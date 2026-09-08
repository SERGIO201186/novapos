import { Composition } from "remotion";
import { DemoVideo, TOTAL_DURATION_IN_FRAMES } from "./DemoVideo";

export const MyComposition = () => {
  return (
    <Composition
      id="PapelPOS-Demo"
      component={DemoVideo}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
