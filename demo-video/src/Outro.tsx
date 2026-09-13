import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK, rgba } from "./Scene";

const FEATURES: { label: string; color: string }[] = [
  { label: "Ventas y cobro", color: "#34D399" },
  { label: "Caja y cortes", color: "#A78BFA" },
  { label: "Inventario", color: "#F472B6" },
  { label: "Recargas telefónicas", color: "#FBBF24" },
  { label: "Reportes", color: "#60A5FA" },
  { label: "Facturación", color: "#5EEAD4" },
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Los tiempos de abajo están calibrados a la narración de "outro" (ver
  // voiceover/guion.md): asistencia hacia el final de la 1a frase, la demo
  // al arrancar la 2a, y la marca/sitio al arrancar la 3a.
  const assistIn = interpolate(frame, [3.6 * fps, 4.05 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const assistY = interpolate(frame, [3.6 * fps, 4.05 * fps], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const demoIn = interpolate(frame, [4.9 * fps, 5.35 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const demoY = interpolate(frame, [4.9 * fps, 5.35 * fps], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const demoPulse = 1 + Math.sin(frame / 10) * 0.02;

  const brandIn = interpolate(frame, [11.0 * fps, 11.45 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Title"
        style={{
          opacity: titleIn,
          fontSize: 68,
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
          marginTop: 40,
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
              key={f.label}
              style={{
                opacity: chipIn,
                translate: `0px ${chipY}px`,
                background: rgba(f.color, 0.22),
                border: `1px solid ${rgba(f.color, 0.55)}`,
                borderRadius: 999,
                padding: "14px 30px",
                fontSize: 26,
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              {f.label}
            </div>
          );
        })}
      </div>

      <Interactive.Div
        name="Assist"
        style={{
          opacity: assistIn,
          translate: `0px ${assistY}px`,
          marginTop: 38,
          fontSize: 28,
          fontWeight: 600,
          color: "#D7F5E3",
          textAlign: "center",
        }}
      >
        🛟 Contamos con asistencia por si algo falla
      </Interactive.Div>

      <Interactive.Div
        name="DemoCTA"
        style={{
          opacity: demoIn,
          translate: `0px ${demoY}px`,
          scale: demoPulse,
          marginTop: 26,
          background: "#FFFFFF",
          color: COLORS.greenDark,
          borderRadius: 999,
          padding: "18px 40px",
          fontSize: 30,
          fontWeight: 800,
          textAlign: "center",
          boxShadow: "0 20px 50px -10px rgba(0,0,0,0.35)",
        }}
      >
        📅 Solicita tu demo y pregunta por todas las apps disponibles
      </Interactive.Div>

      <Interactive.Div
        name="Brand"
        style={{
          opacity: brandIn,
          marginTop: 34,
          fontSize: 30,
          fontWeight: 600,
          color: "#D7F5E3",
          textAlign: "center",
        }}
      >
        NovaPOS PRO — by Omnia Technology · www.omnia-technology.com
      </Interactive.Div>
    </AbsoluteFill>
  );
};
