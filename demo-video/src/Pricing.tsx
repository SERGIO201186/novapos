import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_STACK, rgba } from "./Scene";

const SPARKLES = [
  { top: "16%", left: "10%", size: 20, speed: 60, phase: 0 },
  { top: "78%", left: "14%", size: 14, speed: 70, phase: 1 },
  { top: "22%", left: "88%", size: 16, speed: 65, phase: 2 },
  { top: "72%", left: "86%", size: 22, speed: 55, phase: 0.7 },
  { top: "46%", left: "4%", size: 12, speed: 75, phase: 1.6 },
  { top: "50%", left: "95%", size: 18, speed: 68, phase: 2.4 },
];

export const Pricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const priceScale = interpolate(frame, [0.15 * fps, 0.75 * fps], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.elastic(1),
    output: "perceptual-scale",
  });
  const priceRotate = interpolate(frame, [0.15 * fps, 0.75 * fps], [-8, -4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.elastic(1),
  });
  const priceOpacity = interpolate(frame, [0.15 * fps, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Calibrado para aparecer cuando la narración llega a "actívala hoy
  // mismo..." (ver voiceover/guion.md).
  const ctaIn = interpolate(frame, [4.0 * fps, 4.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const ctaY = interpolate(frame, [4.0 * fps, 4.5 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const pulse = 1 + Math.sin(frame / 12) * 0.015;

  return (
    <AbsoluteFill
      name="Pricing"
      style={{
        fontFamily: FONT_STACK,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 55%, #DB2777 100%)",
      }}
    >
      {SPARKLES.map((s, i) => {
        const drift = Math.sin(frame / s.speed + s.phase) * 26;
        const pop = interpolate(frame, [i * 3, i * 3 + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.8)),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: rgba("#FFFFFF", 0.85),
              opacity: pop * 0.9,
              scale: pop,
              translate: `${drift}px ${drift * 0.5}px`,
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            }}
          />
        );
      })}

      <Interactive.Div
        name="Eyebrow"
        style={{
          opacity: badgeIn,
          background: "rgba(255,255,255,0.22)",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: 999,
          padding: "12px 32px",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#FFFFFF",
          marginBottom: 36,
        }}
      >
        Oferta de lanzamiento
      </Interactive.Div>

      <Interactive.Div
        name="PriceTag"
        style={{
          opacity: priceOpacity,
          scale: priceScale * pulse,
          rotate: `${priceRotate}deg`,
          background: "#FFFFFF",
          borderRadius: 40,
          padding: "40px 72px",
          boxShadow: "0 40px 90px -20px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, color: "#DB2777", letterSpacing: 1 }}>
          Licencia NovaPOS PRO desde
        </div>
        <div style={{ fontSize: 150, fontWeight: 900, color: "#111827", lineHeight: 1, marginTop: 6 }}>
          $250 <span style={{ fontSize: 56, fontWeight: 800, color: "#DB2777" }}>MXN</span>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="CTA"
        style={{
          opacity: ctaIn,
          translate: `0px ${ctaY}px`,
          marginTop: 44,
          fontSize: 34,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        Adquiere tu licencia hoy y lleva tu negocio al siguiente nivel
      </Interactive.Div>
    </AbsoluteFill>
  );
};
