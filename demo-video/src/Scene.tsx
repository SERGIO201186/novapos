import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const COLORS = {
  green: "#0F7B3F",
  greenDark: "#0A5A2E",
  greenLight: "#EAF7EF",
  ink: "#101418",
  sub: "#4B5563",
  bg: "#F4F7F5",
  white: "#FFFFFF",
  amber: "#B45309",
};

export const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const hexToRgb = (hex: string) => {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

export const rgba = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Formas de color flotando suavemente detrás del contenido, para que cada
// escena se sienta viva incluso mientras el texto y la captura están quietos.
export const FloatingBlobs: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const drift = (speed: number, amplitude: number, phase: number) =>
    Math.sin(frame / speed + phase) * amplitude;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: rgba(accent, 0.16),
          filter: "blur(70px)",
          translate: `${drift(70, 30, 0)}px ${drift(90, 20, 1)}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          left: -100,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: rgba(accent, 0.12),
          filter: "blur(80px)",
          translate: `${drift(80, 24, 2)}px ${drift(65, 26, 0.5)}px`,
        }}
      />
    </>
  );
};

type SceneProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  accent?: string;
  durationInFrames?: number;
};

export const Scene: React.FC<SceneProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  accent = COLORS.green,
  durationInFrames = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const textY = interpolate(frame, [0, 0.5 * fps], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const badgeIn = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.elastic(1.1),
  });

  const cardIn = interpolate(frame, [4, 0.7 * fps + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardScale = interpolate(frame, [4, 0.7 * fps + 4], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });
  const cardRotate = interpolate(frame, [4, 0.7 * fps + 4], [-1.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Zoom lento tipo "Ken Burns" a lo largo de toda la escena, para que la
  // captura estática también se sienta en movimiento.
  const imageZoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill name="Scene" style={{ backgroundColor: COLORS.bg, fontFamily: FONT_STACK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${rgba(accent, 0.14)} 0%, ${COLORS.bg} 340px)`,
        }}
      />
      <FloatingBlobs accent={accent} />

      <Interactive.Div
        name="Header"
        style={{
          position: "absolute",
          top: 64,
          left: 96,
          right: 96,
          opacity: textIn,
          translate: `0px ${textY}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: accent,
              scale: badgeIn,
              boxShadow: `0 0 0 6px ${rgba(accent, 0.18)}`,
            }}
          />
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
              color: accent,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: COLORS.ink,
            lineHeight: 1.08,
            letterSpacing: -1,
            maxWidth: 1500,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.sub,
            marginTop: 14,
            maxWidth: 1300,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Screenshot"
        style={{
          position: "absolute",
          top: 280,
          left: 160,
          right: 160,
          bottom: 56,
          opacity: cardIn,
          scale: cardScale,
          rotate: `${cardRotate}deg`,
          borderRadius: 22,
          overflow: "hidden",
          background: COLORS.white,
          boxShadow: `0 30px 70px -20px ${rgba(accent, 0.35)}, 0 2px 0 rgba(15,30,20,0.06)`,
          border: `1px solid ${rgba(accent, 0.18)}`,
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            scale: imageZoom,
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
