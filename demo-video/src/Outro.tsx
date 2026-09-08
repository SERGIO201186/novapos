import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "./Scene";

const FEATURES = [
  "Ventas y cobro",
  "Caja y cortes",
  "Inventario",
  "Recargas telefónicas",
  "Reportes",
  "Facturación",
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      name="Outro"
      style={{
        backgroundColor: COLORS.greenDark,
        background: `radial-gradient(120% 120% at 50% 20%, #12965A 0%, ${COLORS.greenDark} 70%)`,
        fontFamily: FONT_STACK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Interactive.Div
        name="Title"
        style={{
          opacity: titleIn,
          fontSize: 72,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: -1.5,
          textAlign: "center",
        }}
      >
        Todo tu negocio, en un solo lugar
      </Interactive.Div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 48,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 1400,
        }}
      >
        {FEATURES.map((f, i) => {
          const delay = 0.55 * fps + i * 4;
          const chipIn = interpolate(frame, [delay, delay + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const chipY = interpolate(frame, [delay, delay + 14], [16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={f}
              style={{
                opacity: chipIn,
                translate: `0px ${chipY}px`,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 999,
                padding: "14px 30px",
                fontSize: 26,
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              {f}
            </div>
          );
        })}
      </div>

      <Interactive.Div
        name="CTA"
        style={{
          opacity: interpolate(frame, [1.4 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          marginTop: 56,
          fontSize: 30,
          fontWeight: 600,
          color: "#D7F5E3",
        }}
      >
        PapelPOS — powered by NovaPOS
      </Interactive.Div>
    </AbsoluteFill>
  );
};
