// Genera 4 imágenes publicitarias para redes sociales (1080x1350, formato
// feed de Instagram/Facebook) a partir de las capturas reales de NovaPOS
// PRO ya generadas para el video demo (public/screens/*.png). Cada variante
// resalta un beneficio distinto de la app. No usa IA generativa de imagen:
// compone las capturas reales dentro de un diseño HTML/CSS (mismo criterio
// que el video: mostrar la app real, no una recreación aproximada).
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENS = path.join(__dirname, "..", "public", "screens");
const OUT = path.join(__dirname, "..", "ads");
fs.mkdirSync(OUT, { recursive: true });

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const BRAND_GREEN = "#0F7B3F";
const BRAND_GREEN_DARK = "#0A5A2E";
const INK = "#101418";
const SUB = "#4B5563";
const BG = "#F4F7F5";

function fileUrl(p) {
  return "file://" + p;
}

function chip({ icon, label }, accent) {
  return `<div style="
    display:flex; align-items:center; gap:8px;
    background:${accent}14; border:1.5px solid ${accent}33;
    color:${accent}; font-weight:700; font-size:22px;
    padding:10px 20px; border-radius:999px; white-space:nowrap;
  "><span style="font-size:22px;">${icon}</span>${label}</div>`;
}

function renderHTML({
  accent,
  accentDark,
  badge,
  eyebrow,
  headline,
  headlineAccent,
  subtitle,
  screenshot,
  chips,
  price,
}) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin:0; padding:0; }
  html,body { width:1080px; height:1350px; font-family:${FONT_STACK}; overflow:hidden; }
</style></head>
<body>
  <div style="
    position:relative; width:1080px; height:1350px;
    background:
      radial-gradient(720px 520px at 92% -6%, ${accent}2E 0%, transparent 60%),
      radial-gradient(620px 480px at -10% 18%, ${BRAND_GREEN}22 0%, transparent 60%),
      ${BG};
    overflow:hidden;
  ">
    <!-- blobs decorativos -->
    <div style="position:absolute; top:-120px; right:-140px; width:420px; height:420px; border-radius:50%; background:${accent}26; filter:blur(2px);"></div>
    <div style="position:absolute; bottom:230px; left:-160px; width:360px; height:360px; border-radius:50%; background:${BRAND_GREEN}1A;"></div>

    ${
      badge
        ? `<div style="
      position:absolute; top:56px; right:56px;
      background:${accentDark}; color:#fff; font-weight:800; font-size:24px;
      letter-spacing:1px; padding:12px 26px; border-radius:999px;
      box-shadow:0 14px 30px -8px ${accentDark}88;
    ">${badge}</div>`
        : ""
    }

    <!-- logo -->
    <div style="position:absolute; top:56px; left:56px; display:flex; align-items:center; gap:14px;">
      <div style="
        width:64px; height:64px; border-radius:16px; background:${BRAND_GREEN};
        display:flex; align-items:center; justify-content:center; font-size:32px;
        box-shadow:0 10px 24px -6px ${BRAND_GREEN}77;
      ">🧾</div>
      <div>
        <div style="font-size:28px; font-weight:800; color:${INK}; letter-spacing:-0.5px; line-height:1;">NovaPOS <span style="color:${BRAND_GREEN};">PRO</span></div>
        <div style="font-size:16px; color:${SUB}; font-weight:600; margin-top:2px;">by Omnia Technology</div>
      </div>
    </div>

    <!-- eyebrow + headline -->
    <div style="position:absolute; top:190px; left:56px; right:56px;">
      <div style="
        display:inline-block; font-size:22px; font-weight:800; letter-spacing:2px;
        color:${accentDark}; text-transform:uppercase; margin-bottom:14px;
      ">${eyebrow}</div>
      <div style="font-size:56px; font-weight:800; color:${INK}; line-height:1.1; letter-spacing:-1.2px;">
        ${headline} <span style="color:${accentDark};">${headlineAccent}</span>
      </div>
      <div style="font-size:26px; font-weight:500; color:${SUB}; margin-top:16px; line-height:1.45; max-width:920px;">
        ${subtitle}
      </div>
    </div>

    <!-- screenshot card -->
    <div style="
      position:absolute; top:520px; left:110px; right:110px; height:520px;
      border-radius:24px; overflow:hidden; background:#fff;
      box-shadow:0 34px 70px -18px rgba(15,30,20,0.32), 0 2px 0 rgba(15,30,20,0.06);
      border:1px solid rgba(15,30,20,0.08);
    ">
      <img src="${fileUrl(screenshot)}" style="display:block; width:100%; height:auto;" />
    </div>

    <!-- chips -->
    <div style="
      position:absolute; top:1075px; left:56px; right:56px;
      display:flex; flex-wrap:wrap; gap:14px; justify-content:center;
    ">
      ${chips.map((c) => chip(c, accentDark)).join("")}
    </div>

    <!-- CTA footer -->
    <div style="
      position:absolute; bottom:0; left:0; right:0; height:150px;
      background: linear-gradient(90deg, ${BRAND_GREEN_DARK} 0%, ${BRAND_GREEN} 100%);
      display:flex; align-items:center; justify-content:space-between;
      padding:0 56px;
    ">
      <div>
        <div style="color:#fff; font-weight:800; font-size:30px; letter-spacing:-0.3px;">Solicita tu demo gratis</div>
        <div style="color:#D7F5E3; font-weight:600; font-size:24px; margin-top:4px;">www.omnia-technology.com</div>
      </div>
      <div style="
        background:#fff; color:${BRAND_GREEN_DARK}; font-weight:800; font-size:26px;
        padding:16px 28px; border-radius:16px; text-align:center; line-height:1.2;
        box-shadow:0 14px 30px -10px rgba(0,0,0,0.35);
      ">Desde<br/><span style="font-size:32px;">${price}</span></div>
    </div>
  </div>
</body></html>`;
}

const VARIANTS = [
  {
    file: "01-cobro.png",
    accent: "#0F7B3F",
    accentDark: "#0A5A2E",
    eyebrow: "Ventas y cobro",
    headline: "Cobra como",
    headlineAccent: "tú quieras",
    subtitle:
      "Escanea el código de barras y cobra en segundos: efectivo, tarjeta, transferencia, fiado o Mercado Pago.",
    screenshot: path.join(SCREENS, "02-cobrar.png"),
    chips: [
      { icon: "💵", label: "Efectivo" },
      { icon: "💳", label: "Tarjeta" },
      { icon: "🔁", label: "Transferencia" },
      { icon: "🤝", label: "Fiado" },
      { icon: "📱", label: "Mercado Pago" },
    ],
  },
  {
    file: "02-caja.png",
    accent: "#0E7490",
    accentDark: "#155E75",
    eyebrow: "Caja y cortes",
    headline: "Cierra caja",
    headlineAccent: "sin sorpresas",
    subtitle:
      "Cada turno arranca en limpio: saldo, ingresos y egresos siempre acotados al día, con corte automático.",
    screenshot: path.join(SCREENS, "03-caja.png"),
    chips: [
      { icon: "💰", label: "Saldo en caja" },
      { icon: "📈", label: "Ingresos" },
      { icon: "📉", label: "Egresos" },
      { icon: "🧾", label: "Corte automático" },
    ],
  },
  {
    file: "03-recargas.png",
    accent: "#B45309",
    accentDark: "#92400E",
    badge: "NUEVO",
    eyebrow: "Recargas telefónicas",
    headline: "Recarga y",
    headlineAccent: "gana comisión",
    subtitle:
      "Carga tu saldo, registra cada recarga y la comisión se suma directo a la ganancia del turno.",
    screenshot: path.join(SCREENS, "04-recargas-form.png"),
    chips: [
      { icon: "📶", label: "Telcel · Movistar · Unefon" },
      { icon: "💸", label: "Comisión automática" },
      { icon: "📊", label: "Historial completo" },
    ],
  },
  {
    file: "04-negocio.png",
    accent: "#7C3AED",
    accentDark: "#5B21B6",
    eyebrow: "Inventario y reportes",
    headline: "Todo tu negocio,",
    headlineAccent: "bajo control",
    subtitle:
      "Alertas de stock, valor del inventario en vivo y el margen real de tu negocio, al momento.",
    screenshot: path.join(SCREENS, "06-inventario.png"),
    chips: [
      { icon: "📦", label: "Inventario en vivo" },
      { icon: "⚠️", label: "Alertas de stock" },
      { icon: "📊", label: "Reportes de ganancia" },
      { icon: "☁️", label: "Sync. en la nube" },
    ],
  },
];

async function main() {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const v of VARIANTS) {
    const html = renderHTML({ ...v, price: "$250 MXN" });
    // page.setContent() leaves the page on "about:blank", which Chromium
    // blocks from loading file:// subresources (the <img> stays empty).
    // Writing the HTML to disk and navigating to it gives the page a
    // file:// origin of its own, so local image loads work normally.
    const tmpHtml = path.join(OUT, `.tmp-${v.file}.html`);
    fs.writeFileSync(tmpHtml, html);
    await page.goto(fileUrl(tmpHtml), { waitUntil: "load" });
    await page.waitForTimeout(60);
    const outPath = path.join(OUT, v.file);
    await page.screenshot({ path: outPath });
    fs.unlinkSync(tmpHtml);
    console.log("generated", outPath);
  }

  await browser.close();
}

main();
