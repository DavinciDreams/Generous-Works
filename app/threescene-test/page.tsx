"use client";

import {
  ThreeScene,
  ThreeSceneActions,
  ThreeSceneContent,
  ThreeSceneCopyButton,
  ThreeSceneFullscreenButton,
  ThreeSceneResetButton,
  ThreeSceneHeader,
  ThreeSceneTitle,
  type ThreeSceneData,
} from "@/components/ai-elements/threescene-client";
import { useEffect, useState } from "react";

export default function ThreeSceneTestPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [testData, setTestData] = useState<ThreeSceneData | null>(null);

  useEffect(() => {
    if (!isMounted) return;

    // Create 3D objects only on client
    const createObjects = async () => {
      // Use dynamic import to match the component's import method
      const THREE = await import("three");

      // Create a rotating cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.3,
        roughness: 0.4,
      });
      const cube = new THREE.Mesh(geometry, material);

      // Create a torus
      const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
      const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b35,
        metalness: 0.6,
        roughness: 0.2,
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);

      // Create a sphere
      const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x4ecdc4,
        metalness: 0.7,
        roughness: 0.3,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Create an icosahedron
      const icoGeometry = new THREE.IcosahedronGeometry(0.8, 0);
      const icoMaterial = new THREE.MeshStandardMaterial({
        color: 0xf7b731,
        metalness: 0.5,
        roughness: 0.5,
        wireframe: true,
      });
      const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);

      setTestData({
        camera: {
          type: "perspective",
          position: { x: 5, y: 5, z: 5 },
          fov: 75,
        },
        lights: [
          {
            type: "ambient",
            color: 0xffffff,
            intensity: 0.6,
          },
          {
            type: "directional",
            color: 0xffffff,
            intensity: 0.8,
            position: { x: 5, y: 10, z: 7.5 },
          },
        ],
        background: 0x111111,
        objects: [
          {
            id: "cube",
            object: cube,
            position: { x: -2, y: 0, z: 0 },
            rotation: { x: 0.5, y: 0.5, z: 0 },
          },
          {
            id: "torus",
            object: torus,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 1, y: 0, z: 0 },
          },
          {
            id: "sphere",
            object: sphere,
            position: { x: 2, y: 1, z: 0 },
          },
          {
            id: "icosahedron",
            object: icosahedron,
            position: { x: 0, y: -2, z: 0 },
            rotation: { x: 0, y: 0.8, z: 0 },
          },
        ],
      });
    };

    createObjects();
  }, [isMounted]);

  if (!testData) {
    return (
      <div className="container mx-auto p-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Three.js Scene Test</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Three.js Scene Test</h1>
        <p className="text-muted-foreground mt-2">
          Interactive 3D scene with OrbitControls
        </p>
      </div>

      <ThreeScene
        data={testData}
        options={{
          height: 600,
          enableControls: true,
          autoRotate: false,
          gridHelper: true,
          axesHelper: true,
          antialias: true,
        }}
      >
        <ThreeSceneHeader>
          <ThreeSceneTitle>Interactive 3D Scene</ThreeSceneTitle>
          <ThreeSceneActions>
            <ThreeSceneResetButton />
            <ThreeSceneCopyButton />
            <ThreeSceneFullscreenButton />
          </ThreeSceneActions>
        </ThreeSceneHeader>
        <ThreeSceneContent />
      </ThreeScene>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Controls:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Left Click + Drag:</strong> Rotate camera</li>
          <li><strong>Right Click + Drag:</strong> Pan camera</li>
          <li><strong>Scroll:</strong> Zoom in/out</li>
          <li><strong>Reset Button:</strong> Return to initial view</li>
        </ul>
        <h3 className="font-semibold mb-2 mt-4">Objects in Scene:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Green cube (left)</li>
          <li>Orange torus (center)</li>
          <li>Cyan sphere (right-top)</li>
          <li>Yellow wireframe icosahedron (bottom)</li>
        </ul>
      </div>
    </div>
  );
}
