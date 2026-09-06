import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Generates N random points inside a sphere shell for the particle field.
 */
function useParticlePositions(count, radius) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count, radius]);
}

function ParticleField({ mouse }) {
  const pointsRef = useRef();
  const positions = useParticlePositions(900, 7);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.018;
    pointsRef.current.rotation.x += delta * 0.004;

    // Gentle parallax toward the mouse position
    const targetX = mouse.current.x * 0.25;
    const targetY = mouse.current.y * 0.15;
    pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.0;
    pointsRef.current.position.x +=
      (targetX - pointsRef.current.position.x) * 0.02;
    pointsRef.current.position.y +=
      (-targetY - pointsRef.current.position.y) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#9d8cff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingShape({ position, scale, color, geometry, speed = 1 }) {
  return (
    <Float
      speed={1.2 * speed}
      rotationIntensity={0.6}
      floatIntensity={1.1}
      floatingRange={[-0.3, 0.3]}
    >
      <mesh position={position} scale={scale}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={1.4}
          roughness={0.15}
          metalness={0.4}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  );
}

function ParallaxRig({ mouse, children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    const targetRotX = mouse.current.y * 0.12;
    const targetRotY = mouse.current.x * 0.18;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * 0.03;
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Scene3D() {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  return (
    <div
      className="fixed inset-0 -z-10"
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0c16"]} />
        <fog attach="fog" args={["#0a0c16", 8, 18]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={40} color="#7c6ff0" />
        <pointLight position={[-5, -3, 2]} intensity={25} color="#4fd1c5" />

        <ParallaxRig mouse={mouse}>
          <ParticleField mouse={mouse} />

          <FloatingShape
            position={[-3.2, 1.4, -2]}
            scale={1.1}
            color="#7c6ff0"
            geometry={<icosahedronGeometry args={[1, 1]} />}
            speed={0.8}
          />
          <FloatingShape
            position={[3.4, -1.2, -3]}
            scale={1.5}
            color="#4fd1c5"
            geometry={<torusGeometry args={[0.9, 0.32, 32, 100]} />}
            speed={1}
          />
          <FloatingShape
            position={[2.2, 2, -4]}
            scale={0.8}
            color="#f0996a"
            geometry={<octahedronGeometry args={[1, 0]} />}
            speed={1.3}
          />
          <FloatingShape
            position={[-2.6, -2, -3.5]}
            scale={0.65}
            color="#9d8cff"
            geometry={<icosahedronGeometry args={[1, 0]} />}
            speed={0.6}
          />
        </ParallaxRig>
      </Canvas>

      {/* Vignette + grain overlay to keep the scene subtle behind the UI */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0c16_78%)]" />
    </div>
  );
}
