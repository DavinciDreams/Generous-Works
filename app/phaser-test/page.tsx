import {
  Phaser,
  PhaserActions,
  PhaserContent,
  PhaserCopyButton,
  PhaserFullscreenButton,
  PhaserHeader,
  PhaserPlayButton,
  PhaserResetButton,
  PhaserTitle,
  type PhaserData,
} from "@/components/ai-elements/phaser";
import { ChatSidebar } from "@/components/ui/chat-sidebar";

const sampleData: PhaserData = {
  config: {
    width: 800,
    height: 600,
    backgroundColor: "#2d2d2d",
    physics: {
      default: "arcade",
    },
  },
  scenes: [
    {
      key: "main",
      create: `
        // Add title text
        scene.add.text(400, 100, 'Phaser Game Test', {
          fontSize: '48px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add instructions
        scene.add.text(400, 200, 'This is a simple Phaser scene', {
          fontSize: '24px',
          color: '#cccccc'
        }).setOrigin(0.5);

        // Add a colored circle
        const circle = scene.add.circle(400, 350, 60, 0x00ff88);

        // Add click text
        scene.add.text(400, 500, 'Click the green circle!', {
          fontSize: '18px',
          color: '#888888'
        }).setOrigin(0.5);

        // Make circle interactive
        circle.setInteractive();
        circle.on('pointerdown', function() {
          circle.setFillStyle(0xff0088);
        });
        circle.on('pointerup', function() {
          circle.setFillStyle(0x00ff88);
        });
      `,
    },
  ],
};

const examplePrompts = [
  "Create a platformer game with a player that can jump",
  "Generate a simple space shooter with bullets",
  "Build a click game with falling objects to catch",
  "Create a simple breakout game with a paddle and ball"
];

export default function PhaserTestPage() {
  return (
    <>
      <ChatSidebar
        componentType="Phaser"
        examplePrompts={examplePrompts}
        title="Phaser Game Generator"
      />
      <div className="container mx-auto p-8 pr-[420px]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Phaser Game Test</h1>
        <p className="text-muted-foreground mt-2">
          HTML5 game engine for interactive 2D games
        </p>
      </div>

      <Phaser data={sampleData} options={{ autoStart: true, showControls: true }}>
        <PhaserHeader>
          <PhaserTitle />
          <PhaserActions>
            <PhaserPlayButton />
            <PhaserResetButton />
            <PhaserCopyButton />
            <PhaserFullscreenButton />
          </PhaserActions>
        </PhaserHeader>
        <PhaserContent />
      </Phaser>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Phaser Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Full Phaser 3 game engine support</li>
          <li>WebGL and Canvas rendering</li>
          <li>Physics engines (Arcade, Matter, Impact)</li>
          <li>Scene management with lifecycle methods</li>
          <li>Interactive game objects</li>
          <li>Play, pause, and reset controls</li>
          <li>Custom game logic via JavaScript code</li>
        </ul>
      </div>
    </div>
    </>
  );
}
