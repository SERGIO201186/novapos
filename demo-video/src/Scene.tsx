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

type SceneProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
};

export const Scene: React.FC<SceneProps> = ({ eyebrow, title, subtitle, image }) => {
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

  const cardIn = interpolate(frame, [4, 0.7 * fps + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardScale = interpolate(frame, [4, 0.7 * fps + 4], [0.97, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill name="Scene" style={{ backgroundColor: COLORS.bg, fontFamily: FONT_STACK }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${COLORS.greenLight} 0%, ${COLORS.bg} 340px)`,
        }}
      />

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
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            color: COLORS.green,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {eyebrow}
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
          borderRadius: 22,
          overflow: "hidden",
          background: COLORS.white,
          boxShadow: "0 30px 70px -20px rgba(15,30,20,0.35), 0 2px 0 rgba(15,30,20,0.06)",
          border: `1px solid rgba(15,30,20,0.08)`,
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
