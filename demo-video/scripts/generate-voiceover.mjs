#!/usr/bin/env node
// Genera los mp3 de narración en public/audio/ a partir de voiceover/voiceover.json
// usando la API de ElevenLabs. Requiere ELEVENLABS_API_KEY en el entorno.
//
// Uso:
//   ELEVENLABS_API_KEY=xxxx npm run voiceover
//   ELEVENLABS_API_KEY=xxxx ELEVENLABS_VOICE_ID=yyyy npm run voiceover

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const API_KEY = process.env.ELEVENLABS_API_KEY;
// Voz multilingüe pre-hecha de ElevenLabs (funciona bien en español) por defecto;
// puedes sobreescribirla con el ID de cualquier voz de tu cuenta.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "IKne3meq5aSn9XLyUdCD";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

if (!API_KEY) {
  console.error(
    "Falta ELEVENLABS_API_KEY. Exporta tu API key de ElevenLabs antes de correr este script.",
  );
  process.exit(1);
}

const scriptPath = path.join(ROOT, "voiceover", "voiceover.json");
const outDir = path.join(ROOT, "public", "audio");

async function main() {
  const lines = JSON.parse(await readFile(scriptPath, "utf8"));
  await mkdir(outDir, { recursive: true });

  for (const { id, text } of lines) {
    process.stdout.write(`Generando "${id}"... `);
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `ElevenLabs respondió ${res.status} para "${id}": ${body}`,
      );
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const outPath = path.join(outDir, `${id}.mp3`);
    await writeFile(outPath, buffer);
    console.log(`OK (${outPath})`);
  }

  console.log("\nListo. Corre `npm run dev` para previsualizar con audio.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
