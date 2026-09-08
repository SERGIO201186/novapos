// Captura screenshots reales de NovaPOS (corriendo local en
// http://localhost:8792, una copia SIN sw-nova.js — ver serve-for-capture.mjs)
// para usarlos como assets en el video demo de Remotion. No modifica
// index.html — el "modo PRO sin conexión" se logra simulando una licencia
// Versión 2 ya verificada en localStorage (usa la misma gracia offline de
// 72h que ya trae la app) y bloqueando la petición real al Control Maestro,
// para no tocar ningún servidor real. El giro se fija en "papeleria" para
// que el catálogo demo (cuadernos, copias, impresiones…) se vea relevante.
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "screens");
const BASE = "http://localhost:8792/index.html";

async function main() {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  });

  // Google Fonts está bloqueado por la política de red de este entorno —
  // sin este abort explícito, el navegador tarda ~12s en darse por vencido
  // esperando el link de la fuente antes de disparar "load".
  await context.route("**/fonts.googleapis.com/**", (route) => route.abort());
  // Nunca tocar el Control Maestro real de licencias durante la captura.
  await context.route("**/script.google.com/**", (route) => route.abort());

  await context.addInitScript(() => {
    localStorage.setItem(
      "nova_licencia",
      JSON.stringify({
        clave: "DEMO-VIDEO",
        cliente: "Papelería Nova",
        vence: null,
        productId: "prod_novapos_v2",
        verificadoEn: Date.now(),
      }),
    );
    localStorage.setItem(
      "fp2_cfg",
      JSON.stringify({
        giro: "papeleria",
        nombre: "Papelería Nova",
        tel: "228 555 0134",
        dir: "Av. Xalapa 210, Centro",
        iva: 16,
        recargaComisionFija: 10,
        controlCopias: true,
      }),
    );
    // Nunca abrir ventanas reales de impresión durante la captura.
    window.open = () => ({
      document: { write() {}, close() {} },
      close() {},
      focus() {},
      print() {},
    });
  });

  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("#license-gate", { state: "hidden", timeout: 15000 });
  await page.waitForFunction(() => typeof db !== "undefined" && db.productos && db.productos.length > 0);
  await page.waitForTimeout(300);

  const shot = async (name, selector) => {
    if (selector) {
      await page.waitForSelector(selector, { state: "visible" });
      await page.waitForTimeout(250);
    }
    // El toast de confirmación (p.ej. "Recarga R-0001 registrada ✓") se
    // queda visible varios segundos y tapa contenido en las siguientes
    // capturas si no se limpia explícitamente antes de cada screenshot.
    await page.evaluate(() => document.getElementById("toast")?.classList.remove("show"));
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log("✓", name);
  };

  // ── 1. Ventas (POS) con productos ya en el ticket ──────────────────
  await page.evaluate(() => showView("pos", null));
  const barcodes = await page.evaluate(() =>
    db.productos.filter((p) => p.stock > 0).slice(0, 3).map((p) => p.barcode),
  );
  for (const bc of barcodes.slice(0, 2)) {
    await page.evaluate((b) => addToTicket(b), bc);
  }
  await page.evaluate((b) => { addToTicket(b); addToTicket(b); }, barcodes[2]);
  await shot("01-ventas");

  // ── 2. Modal de cobro (efectivo) ────────────────────────────────────
  await page.evaluate(() => openCobrar());
  await shot("02-cobrar", "#modal-cobrar.open");
  await page.evaluate(() => closeModal("modal-cobrar"));
  await page.waitForTimeout(150);

  // ── 3. Caja (datos demo ya vienen con caja abierta) ─────────────────
  await page.evaluate(() => showView("caja", null));
  await shot("03-caja");

  // ── 4. Recargas telefónicas: cargar saldo + registrar una recarga ──
  await page.evaluate(() => showView("recargas", null));
  await page.waitForSelector("#rec-saldo-monto");
  await page.fill("#rec-saldo-monto", "1000");
  await page.fill("#rec-saldo-nota", "Carga con proveedor de recargas");
  await page.evaluate(() => agregarSaldoRecarga());
  await page.evaluate(() => seleccionarCompaniaRecarga("telcel"));
  await page.fill("#rec-folio-ref", "REF-88291");
  await page.fill("#rec-telefono", "5512345678");
  await page.fill("#rec-monto", "100");
  await page.fill("#rec-comision", "10");
  await page.evaluate(() => actualizarResumenRecarga());
  await page.evaluate(() => document.getElementById("btn-recargar")?.scrollIntoView({ block: "center" }));
  await shot("04-recargas-form");
  await page.evaluate(() => procesarRecarga());
  await page.waitForTimeout(300);
  await shot("05-recargas-historial");

  // ── 5. Inventario ────────────────────────────────────────────────
  await page.evaluate(() => showView("inventario", null));
  await shot("06-inventario");

  // ── 6. Reportes (Resumen) ───────────────────────────────────────
  await page.evaluate(() => showView("reportes", null));
  await shot("07-reportes");

  // ── 7. Configuración ────────────────────────────────────────────
  await page.evaluate(() => showView("config", null));
  await shot("08-config");

  await browser.close();
  console.log("Listo. Screenshots en", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
