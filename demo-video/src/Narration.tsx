import { useEffect, useState } from "react";
import { Audio, continueRender, delayRender, staticFile } from "remotion";

// Reproduce el mp3 de narración de una escena si ya fue generado
// (ver demo-video/scripts/generate-voiceover.mjs). Si el archivo todavía no
// existe, no reproduce nada en vez de romper el preview o el render.
export const Narration: React.FC<{ id: string }> = ({ id }) => {
  const src = staticFile(`audio/${id}.mp3`);
  const [exists, setExists] = useState(false);
  const [handle] = useState(() => delayRender(`check-narration-${id}`));

  useEffect(() => {
    fetch(src, { method: "HEAD" })
      .then((res) => setExists(res.ok))
      .catch(() => setExists(false))
      .finally(() => continueRender(handle));
  }, [handle, src]);

  if (!exists) {
    return null;
  }

  return <Audio src={src} />;
};
