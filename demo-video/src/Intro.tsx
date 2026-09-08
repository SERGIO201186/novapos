import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "./Scene";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoScale = interpolate(frame, [0, 0.6 * fps], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 200 }),
    output: "perceptual-scale",
  });
  const titleIn = interpolate(frame, [0.35 * fps, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const subIn = interpolate(frame, [0.6 * fps, 1.15 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      name="Intro"
      style={{
        backgroundColor: COLORS.greenDark,
        background: `radial-gradient(120% 120% at 50% 30%, #12965A 0%, ${COLORS.greenDark} 70%)`,
        fontFamily: FONT_STACK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Interactive.Div
        name="Logo"
        style={{
          opacity: logoIn,
          scale: logoScale,
          width: 140,
          height: 140,
          borderRadius: 32,
          background: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 74,
          marginBottom: 40,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.45)",
        }}
      >
        🧾
      </Interactive.Div>
      <Interactive.Div
        name="Title"
        style={{
          opacity: titleIn,
          fontSize: 96,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: -2,
        }}
      >
        PapelPOS
      </Interactive.Div>
      <Interactive.Div
        name="Subtitle"
        style={{
          opacity: subIn,
          fontSize: 34,
          fontWeight: 500,
          color: "#D7F5E3",
          marginTop: 18,
          letterSpacing: 0.5,
        }}
      >
        El sistema de punto de venta para tu negocio
      </Interactive.Div>
    </AbsoluteFill>
  );
};
