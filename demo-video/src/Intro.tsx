import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK, rgba } from "./Scene";

const CONFETTI = [
  { color: "#FCD34D", top: "18%", left: "12%", size: 26, speed: 55, phase: 0 },
  { color: "#60A5FA", top: "70%", left: "18%", size: 18, speed: 70, phase: 1 },
  { color: "#F472B6", top: "24%", left: "84%", size: 22, speed: 60, phase: 2 },
  { color: "#34D399", top: "76%", left: "80%", size: 30, speed: 80, phase: 0.5 },
  { color: "#FB923C", top: "50%", left: "6%", size: 16, speed: 65, phase: 1.5 },
  { color: "#A78BFA", top: "46%", left: "92%", size: 20, speed: 75, phase: 2.5 },
];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoScale = interpolate(frame, [0, 0.6 * fps], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.elastic(1),
    output: "perceptual-scale",
  });
  const logoRotate = interpolate(frame, [0, 0.6 * fps], [-14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.elastic(1),
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
        overflow: "hidden",
      }}
    >
      {CONFETTI.map((c, i) => {
        const drift = Math.sin(frame / c.speed + c.phase) * 22;
        const spin = (frame / c.speed) * 40 + c.phase * 60;
        const pop = interpolate(frame, [i * 3, i * 3 + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.6)),
        });
        return (
          <div
            key={c.color + i}
            style={{
              position: "absolute",
              top: c.top,
              left: c.left,
              width: c.size,
              height: c.size,
              borderRadius: 6,
              background: c.color,
              opacity: pop * 0.85,
              scale: pop,
              rotate: `${spin}deg`,
              translate: `${drift}px ${drift * 0.6}px`,
              boxShadow: `0 8px 20px ${rgba(c.color, 0.35)}`,
            }}
          />
        );
      })}

      <Interactive.Div
        name="Logo"
        style={{
          opacity: logoIn,
          scale: logoScale,
          rotate: `${logoRotate}deg`,
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
        NovaPOS PRO
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
