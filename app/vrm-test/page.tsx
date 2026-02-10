"use client";

import {
  VRM,
  VRMActions,
  VRMAnimationToggle,
  VRMContent,
  VRMControls,
  VRMCopyButton,
  VRMFullscreenButton,
  VRMHeader,
  VRMResetButton,
  VRMTitle,
  type VRMData,
} from "@/components/ai-elements/vrm";

// Sample VRM model from a public CDN
// Using a publicly available VRM model for testing
const sampleVRMData: VRMData = {
  modelUrl: 'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1580159206855',
  camera: {
    position: { x: 0, y: 1.4, z: 2.5 },
    target: { x: 0, y: 1, z: 0 },
  },
  lighting: {
    ambient: 0.6,
    directional: {
      color: '#ffffff',
      intensity: 1.2,
    },
  },
  background: '#e0e0e0',
  animations: [
    { name: 'Idle', loop: true },
  ],
};

const customVRMData: VRMData = {
  modelUrl: 'https://cdn.jsdelivr.net/gh/pixiv/three-vrm@dev/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm',
  camera: {
    position: { x: 0, y: 1.5, z: 3 },
    target: { x: 0, y: 1, z: 0 },
  },
  lighting: {
    ambient: 0.5,
    directional: {
      color: '#ffddaa',
      intensity: 1,
    },
  },
  background: '#282c34',
};

export default function VRMTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">VRM Avatar Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Interactive 3D avatars powered by three-vrm
        </p>
      </div>

      <div className="space-y-8">
        {/* Sample VRM Model */}
        <VRM data={sampleVRMData} options={{ height: 600, enableControls: true }}>
          <VRMHeader>
            <VRMTitle>Ashtra VRM Avatar</VRMTitle>
            <VRMActions>
              <VRMAnimationToggle />
              <VRMResetButton />
              <VRMCopyButton />
              <VRMFullscreenButton />
            </VRMActions>
          </VRMHeader>
          <VRMContent />
          <VRMControls />
        </VRM>

        {/* Custom VRM Model */}
        <VRM data={customVRMData} options={{ height: 500, enableControls: true }}>
          <VRMHeader>
            <VRMTitle>VRM Constraint Sample</VRMTitle>
            <VRMActions>
              <VRMResetButton />
              <VRMCopyButton />
              <VRMFullscreenButton />
            </VRMActions>
          </VRMHeader>
          <VRMContent />
        </VRM>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">VRM Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Load and display VRM 0.0 and VRM 1.0 avatar models</li>
          <li>Interactive OrbitControls for camera manipulation</li>
          <li>Play and pause animations</li>
          <li>Configurable camera position and target</li>
          <li>Custom lighting (ambient and directional)</li>
          <li>Automatic spring bone physics</li>
          <li>Reset camera to initial position</li>
          <li>Fullscreen mode</li>
          <li>Copy model configuration to clipboard</li>
        </ul>

        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">Controls:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Left Click + Drag: Rotate camera around model</li>
            <li>Right Click + Drag: Pan camera</li>
            <li>Scroll Wheel: Zoom in/out</li>
            <li>Use control buttons to play animations and reset view</li>
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Note: VRM models are loaded from public CDNs. Loading times may vary based on model size and network speed.
          </p>
        </div>
      </div>
    </div>
  );
}
