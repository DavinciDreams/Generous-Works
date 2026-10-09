import {
  Remotion,
  RemotionActions,
  RemotionContent,
  RemotionCopyButton,
  RemotionFullscreenButton,
  RemotionHeader,
  RemotionPlayButton,
  RemotionResetButton,
  RemotionTimeline,
  RemotionTitle,
  type RemotionData,
} from "@/components/ai-elements/remotion";
import { ChatSidebar } from "@/components/ui/chat-sidebar";

const textAnimationExample: RemotionData = {
  composition: {
    type: "TextAnimation",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 90, // 3 seconds
    props: {
      text: "Welcome to Remotion!",
      color: "#ffffff",
      fontSize: 80,
      backgroundColor: "#0066ff",
    },
  },
};

const examplePrompts = [
  "Create a text animation that fades in and scales up",
  "Generate a video with animated shapes moving across screen",
  "Build a countdown timer from 10 to 0",
  "Create a logo reveal animation"
];

export default function RemotionTestPage() {
  return (
    <>
      <ChatSidebar
        componentType="Remotion"
        examplePrompts={examplePrompts}
        title="Remotion Video Generator"
      />
      <div className="container mx-auto p-8 pr-[420px]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Remotion Video Test</h1>
        <p className="text-muted-foreground mt-2">
          Programmatic video creation using React and Remotion
        </p>
      </div>

      <Remotion
        data={textAnimationExample}
        options={{
          autoPlay: false,
          loop: true,
          controls: false,
        }}
      >
        <RemotionHeader>
          <RemotionTitle />
          <RemotionActions>
            <RemotionPlayButton />
            <RemotionResetButton />
            <RemotionCopyButton />
            <RemotionFullscreenButton />
          </RemotionActions>
        </RemotionHeader>
        <RemotionContent />
        <RemotionTimeline />
      </Remotion>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Remotion Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Real Remotion Player - Actual video preview in browser</li>
          <li>✅ Frame-based composition control</li>
          <li>✅ Pre-built animation templates</li>
          <li>✅ Play, pause, and scrub through frames</li>
          <li>✅ Loop and autoplay options</li>
          <li>✅ Timeline scrubber for frame navigation</li>
          <li>✅ Fullscreen mode support</li>
          <li>✅ Fully functional like other AI Elements</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Available Composition Types:</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-foreground">TextAnimation:</strong>
            <p className="text-muted-foreground mt-1">
              Text that fades in and scales up, with customizable color, size, and background
            </p>
          </div>
          <div>
            <strong className="text-foreground">ShapeAnimation:</strong>
            <p className="text-muted-foreground mt-1">
              Animated shapes (circles, squares, triangles) moving across the screen
            </p>
          </div>
          <div>
            <strong className="text-foreground">CountdownTimer:</strong>
            <p className="text-muted-foreground mt-1">
              Countdown timer with customizable start/end values, color, and label
            </p>
          </div>
          <div>
            <strong className="text-foreground">LogoReveal:</strong>
            <p className="text-muted-foreground mt-1">
              Logo/text reveal animation with subtitle and smooth transitions
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Current Composition:</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Type:</strong> {textAnimationExample.composition.type}</p>
          <p><strong>Resolution:</strong> {textAnimationExample.composition.width}x{textAnimationExample.composition.height}</p>
          <p><strong>FPS:</strong> {textAnimationExample.composition.fps}</p>
          <p><strong>Duration:</strong> {textAnimationExample.composition.durationInFrames} frames ({textAnimationExample.composition.durationInFrames / textAnimationExample.composition.fps}s)</p>
        </div>
      </div>
    </div>
    </>
  );
}
