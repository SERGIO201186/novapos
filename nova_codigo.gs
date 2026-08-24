// NovaPOS — Apps Script Backend
// Pega este código en script.google.com y despliega como Web App

const SS_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// 🔒 Debe ser IDÉNTICA a la "Clave secreta de sincronización" que pongas en
// NovaPOS (Configuración → Google Sheets). Sin esto, cualquiera que adivine
// o encuentre la URL /exec podría leer, modificar o borrar todos los datos
// del negocio — la URL de un Web App de Apps Script no es secreta por sí sola.
const SYNC_SECRET = 'NicolasBravo11centroVeracruzXalapa';

function checkSecret(secret) {
  return SYNC_SECRET && SYNC_SECRET !== 'CAMBIA_ESTO_por_una_clave_larga_y_unica' && secret === SYNC_SECRET;
}

function doGet(e) {
  const action = e.parameter.action || '';
  if (!checkSecret(e.parameter.secret)) return json({ok:false, error:'unauthorized'});

  // Los NIP (dueño, inventario, cada vendedor) viven en Propiedades del
  // script, no en ninguna hoja — así alguien con quien compartas la hoja de
  // cálculo (un contador, un socio) puede ver ventas/inventario sin ver los
  // NIP, que solo son visibles desde el editor de Apps Script.
  if (action === 'get_pins') return json({ok:true, data: getPins_()});

  const sheet = getSheet(e.parameter.sheet || 'productos');
  if (action === 'get') {
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(r => Object.fromEntries(headers.map((h,i)=>[h,r[i]])));
    return json({ok:true, data});
  }
  return json({ok:false, error:'Unknown action'});
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!checkSecret(body.secret)) return json({ok:false, error:'unauthorized'});
    const {action, sheet: sheetName, data, id} = body;

    // La recarga no toca hojas directamente: solo habla con el proveedor y
    // regresa el resultado. NovaPOS guarda el registro por separado con un
    // 'upsert' normal a la hoja "recargas", igual que hace con ventas/facturas.
    if (action === 'recharge') return handleRecharge_(body);

    // Guarda un NIP en Propiedades del script (nunca en una hoja). scope
    // 'owner'/'inventario' son un solo valor; 'vendedor' guarda un mapa
    // {vendedorId: pin} porque puede haber varios. pin vacío = quitar/borrar.
    if (action === 'set_pin') {
      const props = PropertiesService.getScriptProperties();
      if (body.scope === 'owner') props.setProperty('OWNER_PIN', body.pin || '');
      else if (body.scope === 'inventario') props.setProperty('INV_PIN', body.pin || '');
      else if (body.scope === 'vendedor' && body.vendedorId) {
        let mapa = {};
        try { mapa = JSON.parse(props.getProperty('VENDEDOR_PINS') || '{}'); } catch(e) {}
        if (body.pin) mapa[body.vendedorId] = body.pin; else delete mapa[body.vendedorId];
        props.setProperty('VENDEDOR_PINS', JSON.stringify(mapa));
      } else {
        return json({ok:false, error:'scope inválido'});
      }
      return json({ok:true});
    }

    // Relevo simple hacia MailApp — igual que 'recharge' con el proveedor de
    // recargas, NovaPOS no necesita ninguna credencial de correo propia,
    // solo pedirle a Apps Script que mande el email con la cuenta de Google
    // que tiene desplegado el script.
    if (action === 'send_corte_email') {
      if (!body.to) return json({ok:false, error:'Falta correo destino'});
      MailApp.sendEmail({ to: body.to, subject: body.subject || 'Corte de turno', htmlBody: body.html || '' });
      return json({ok:true});
    }

    // Cobro con terminal física Mercado Pago Point. El Access Token vive en
    // Propiedades del script (MP_ACCESS_TOKEN) — nunca en NovaPOS ni en la
    // hoja de cálculo. Basado en la documentación pública confirmada de
    // "Point Integration API" para crear/cancelar payment-intents; la
    // consulta de estatus (mp_estado_intent) se infiere del mismo patrón de
    // URL que las otras dos, sin haberse podido verificar 100% contra la
    // documentación oficial completa — pruébalo con un cobro pequeño antes
    // de usarlo con clientes reales.
    if (action === 'mp_listar_dispositivos') {
      return mpProxy_('GET', '/point/integration-api/devices', null, function(data) {
        var lista = Array.isArray(data) ? data : (Array.isArray(data.devices) ? data.devices : []);
        return json({ ok:true, data: lista });
      });
    }
    if (action === 'mp_crear_intent') {
      return mpProxy_('POST', '/point/integration-api/devices/' + body.deviceId + '/payment-intents', {
        amount: Math.round(body.amount * 100), // MP no acepta decimales: 1500 = $15.00
        additional_info: { external_reference: body.externalReference || '', print_on_terminal: true },
      }, function(data) { return json({ ok:true, data: { paymentIntentId: data.id } }); });
    }
    if (action === 'mp_estado_intent') {
      return mpProxy_('GET', '/point/integration-api/devices/' + body.deviceId + '/payment-intents/' + body.paymentIntentId);
    }
    if (action === 'mp_cancelar_intent') {
      return mpProxy_('DELETE', '/point/integration-api/devices/' + body.deviceId + '/payment-intents/' + body.paymentIntentId);
    }

    // Resincronización completa (botón "Sincronizar todo" y los resets de
    // "Borrar datos de prueba"/"Borrar TODO"): a diferencia de 'sync', que
    // reemplaza una sola hoja, aquí 'data' es un objeto {nombreHoja: filas[]}
    // con varias hojas a la vez.
    if (action === 'sync_all') {
      Object.keys(data || {}).forEach(sheetName2 => {
        const sh = getSheet(sheetName2);
        const shHeaders = ensureHeaders_(sh, sheetName2);
        const lastRow = sh.getLastRow();
        if (lastRow > 1) sh.deleteRows(2, lastRow-1);
        (data[sheetName2] || []).forEach(d => sh.appendRow(shHeaders.map(h=>d[h]??'')));
      });
      return json({ok:true});
    }

    const sheet = getSheet(sheetName || 'productos');
    const headers = ensureHeaders_(sheet, sheetName || 'productos');

    if (action === 'upsert') {
      // La mayoría de las hojas identifican cada fila por "id", pero "config"
      // es key/value puro (encabezados "key","value") — sin este fallback,
      // idCol quedaba en -1 para esa hoja, nunca encontraba la fila existente
      // (upsert = siempre insertaba una nueva) y el valor de "key" se escribía
      // en blanco porque data.key no existía (el cliente mandaba data.id).
      const idField = headers.includes('id') ? 'id' : 'key';
      const rows = sheet.getDataRange().getValues();
      const idCol = headers.indexOf(idField);
      const existing = rows.findIndex((r,i)=>i>0 && r[idCol]===data[idField]);
      const row = headers.map(h => data[h] ?? '');
      if (existing > 0) sheet.getRange(existing+1,1,1,row.length).setValues([row]);
      else sheet.appendRow(row);
      return json({ok:true});
    }
    if (action === 'delete') {
      // Mismo fallback que en 'upsert' — por si algún día se borra una fila
      // de la hoja "config" u otra hoja key/value.
      const idField = headers.includes('id') ? 'id' : 'key';
      const rows = sheet.getDataRange().getValues();
      const idCol = headers.indexOf(idField);
      const idx = rows.findIndex((r,i)=>i>0 && r[idCol]===id);
      if (idx > 0) sheet.deleteRow(idx+1);
      return json({ok:true});
    }
    if (action === 'sync') {
      // Bulk sync: replace all rows
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) sheet.deleteRows(2, lastRow-1);
      data.forEach(d => sheet.appendRow(headers.map(h=>d[h]??'')));
      return json({ok:true});
    }
    return json({ok:false, error:'Unknown action'});
  } catch(err) {
    return json({ok:false, error:err.toString()});
  }
}

// 📲 Habla con el proveedor mayorista de recargas (Seycel, Taecel, Sivetel,
// etc.) y regresa el resultado a NovaPOS. TODO: sustituye el cuerpo de
// sendRecharge_ por la llamada real a la API de tu proveedor, usando
// UrlFetchApp y credenciales guardadas en Archivo → Propiedades del proyecto
// → Propiedades del script (Configuración ⚙️ del editor) — nunca las escribas
// aquí en texto plano ni en NovaPOS, cualquiera con el HTML/JS las vería.
function sendRecharge_(compania, telefono, monto) {
  // Ejemplo de cómo quedaría (ajusta nombres de campos y endpoint a la
  // documentación real que te dé tu proveedor al darte de alta):
  //
  // const props = PropertiesService.getScriptProperties();
  // const resp = UrlFetchApp.fetch('https://api.tuproveedor.mx/recarga', {
  //   method: 'post',
  //   contentType: 'application/json',
  //   payload: JSON.stringify({
  //     compania, telefono, monto,
  //     usuario: props.getProperty('PROVEEDOR_USUARIO'),
  //     clave:   props.getProperty('PROVEEDOR_CLAVE'),
  //   }),
  //   muteHttpExceptions: true,
  // });
  // const data = JSON.parse(resp.getContentText());
  // return { ok: !!data.exito, folioProveedor: data.folio || '', mensaje: data.mensaje || '' };

  return { ok:false, mensaje:'Proveedor de recargas no configurado todavía — edita sendRecharge_ en este script.' };
}

function handleRecharge_(body) {
  const { compania, telefono, monto } = body;
  const resultado = sendRecharge_(compania, telefono, monto);
  return resultado.ok
    ? json({ ok:true, folioProveedor: resultado.folioProveedor||'', mensaje: resultado.mensaje||'' })
    : json({ ok:false, error: resultado.mensaje||'Error del proveedor' });
}

function getPins_() {
  const props = PropertiesService.getScriptProperties();
  let vendedorPins = {};
  try { vendedorPins = JSON.parse(props.getProperty('VENDEDOR_PINS') || '{}'); } catch(e) {}
  return {
    ownerPin: props.getProperty('OWNER_PIN') || '',
    invPin:   props.getProperty('INV_PIN') || '',
    vendedorPins,
  };
}

// Relevo genérico hacia la API de Mercado Pago — agrega el Authorization
// Bearer con MP_ACCESS_TOKEN (Propiedades del script) y traduce cualquier
// error HTTP de MP a {ok:false, error} en vez de dejar tronar el script.
function mpProxy_(method, path, payload, onOk) {
  const token = PropertiesService.getScriptProperties().getProperty('MP_ACCESS_TOKEN');
  if (!token) return json({ ok:false, error:'Falta configurar MP_ACCESS_TOKEN en Propiedades del script' });
  const options = {
    method: method.toLowerCase(),
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true,
  };
  if (payload) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(payload);
  }
  const resp = UrlFetchApp.fetch('https://api.mercadopago.com' + path, options);
  const code = resp.getResponseCode();
  let data = {};
  try { data = JSON.parse(resp.getContentText() || '{}'); } catch(e) {}
  if (code >= 400) return json({ ok:false, error: data.message || data.error || ('Mercado Pago respondió ' + code) });
  return onOk ? onOk(data) : json({ ok:true, data: data });
}

// Encabezados esperados por hoja — usados tanto al crear una hoja nueva
// (getSheet) como para reponerlos si una hoja ya existe pero se vació por
// completo a mano (ensureHeaders_, que usa sync_all antes de escribir).
const SHEET_HEADERS = {
  productos:   ['id','sku','barcode','nombre','cat','proveedor','precio','costo','stock','stockmin','vence','unidad','desc'],
  ventas:      ['id','folio','fecha','items','subtotal','descuento','total','recibido','cambio','metodo','vendedor'],
  movimientos: ['id','fecha','tipo','monto','concepto'],
  facturas:    ['id','folio','ventaId','fecha','clienteNombre','clienteRFC','clienteEmail','clienteDir','usoCFDI','metodoPago','formaPago','subtotal','iva','total','estatus','cfdiUUID'],
  recargas:    ['id','folio','fecha','compania','telefono','monto','comisionPct','gananciaEstimada','estatus','folioProveedor','mensaje'],
  cortes:      ['apertura','cierre','fondo','ingresos','egresos','saldoFinal','vendedor','ventasCount','ventasTotal','efectivo','tarjeta','transferencia','recargasCount','recargasTotal','folio','codigoEmpleado','efectivoEsperado','efectivoContado','faltante'],
  vendedores:  ['id','nombre','codigoEmpleado'],
  config:      ['key','value'],
};

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SS_ID);
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    if (SHEET_HEADERS[name]) s.getRange(1,1,1,SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]]);
  }
  return s;
}

// Si alguien borra a mano TODO el contenido de una hoja (incluyendo la fila
// de encabezados, no solo los datos), getSheet() la sigue encontrando por
// nombre y no la vuelve a preparar — solo hace eso para hojas nuevas. Sin
// esto, sync_all truena al pedir sh.getRange(1,1,1,0) sobre una hoja sin
// ninguna columna con contenido. Regresa el arreglo de encabezados vigente.
function ensureHeaders_(sh, name) {
  const esperados = SHEET_HEADERS[name];
  if (!esperados) return sh.getRange(1,1,1,Math.max(sh.getLastColumn(),1)).getValues()[0];
  const actuales = sh.getLastColumn() > 0 ? sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0] : [];
  const hayEncabezados = actuales.some(c => c !== '' && c !== null);
  if (!hayEncabezados) {
    sh.getRange(1,1,1,esperados.length).setValues([esperados]);
    return esperados;
  }
  // Agrega al final cualquier columna que el código ya espere pero la hoja
  // todavía no tenga (p.ej. "pin" en una hoja "vendedores" creada antes de
  // que existiera esa columna) — nunca reordena ni toca las columnas que ya
  // existen, así que los datos guardados no se mueven ni se pierden.
  const faltantes = esperados.filter(h => !actuales.includes(h));
  if (faltantes.length) {
    sh.getRange(1, actuales.length+1, 1, faltantes.length).setValues([faltantes]);
    return [...actuales, ...faltantes];
  }
  return actuales;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
