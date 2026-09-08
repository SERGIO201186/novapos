// Prepara una copia de la app SIN sw-nova.js y la sirve en localhost:8792,
// para que capture-screenshots.mjs pueda cargarla sin que el service worker
// dispare su location.reload() automático a mitad de la captura (ver el
// comentario en capture-screenshots.mjs). No modifica el repo original.
import { spawn } from "node:child_process";
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");
const SERVE_DIR = "/tmp/novapos-capture-serve";
const PORT = 8792;

rmSync(SERVE_DIR, { recursive: true, force: true });
mkdirSync(SERVE_DIR, { recursive: true });

for (const file of ["index.html", "icon-nova-192.png", "icon-nova-512.png", "manifest-nova.json"]) {
  const src = path.join(REPO_ROOT, file);
  if (existsSync(src)) cpSync(src, path.join(SERVE_DIR, file));
}
// A propósito NO se copia sw-nova.js — así el registro del service worker
// falla con 404 y la app sigue funcionando normal, sin activarlo nunca.

const server = spawn("python3", ["-m", "http.server", String(PORT)], {
  cwd: SERVE_DIR,
  stdio: "inherit",
});

console.log(`Sirviendo copia sin sw-nova.js en http://localhost:${PORT}/index.html (pid ${server.pid})`);
