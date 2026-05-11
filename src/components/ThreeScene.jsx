import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import AICore from './AICore';
import HoloScreens from './HoloScreens';

/* ── Floating Medical Particles ────────────────────────────── */
const MedicalParticles = ({ count = 300, emergencyMode }) => {
  const meshRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={emergencyMode ? '#ff3366' : '#00f2ff'}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

/* ── Holographic Grid Floor ─────────────────────────────────── */
const HoloFloor = ({ emergencyMode }) => {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 0.3) % 2;
    }
  });

  return (
    <group position={[0, -5, 0]}>
      <gridHelper
        ref={gridRef}
        args={[100, 80, emergencyMode ? '#330011' : '#003344', emergencyMode ? '#1a0008' : '#001a22']}
      />
      {/* Glowing floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color={emergencyMode ? '#0a0000' : '#000a10'}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

/* ── Pulsing Data Spheres ──────────────────────────────────── */
const DataSphere = ({ position, size = 0.3, color, speed = 1 }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.scale.setScalar(1 + Math.sin(t) * 0.15);
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.7}
        wireframe
      />
    </mesh>
  );
};

/* ── Orbital Rings ──────────────────────────────────────────── */
const OrbitalRing = ({ radius, color, speed, tilt }) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = tilt[0] + state.clock.getElapsedTime() * speed;
    ref.current.rotation.y = tilt[1] + state.clock.getElapsedTime() * speed * 0.7;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
};

/* ── DNA Helix ─────────────────────────────────────────────── */
const DNAHelix = ({ emergencyMode }) => {
  const groupRef = useRef();
  const color = emergencyMode ? '#ff0044' : '#00ffaa';

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  const helixPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 4;
      const y = (i / 40) * 6 - 3;
      points.push({
        pos1: [Math.cos(t) * 0.8, y, Math.sin(t) * 0.8],
        pos2: [Math.cos(t + Math.PI) * 0.8, y, Math.sin(t + Math.PI) * 0.8],
      });
    }
    return points;
  }, []);

  return (
    <group ref={groupRef} position={[8, 0, -6]}>
      {helixPoints.map((p, i) => (
        <group key={i}>
          <mesh position={p.pos1}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
          </mesh>
          <mesh position={p.pos2}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#7000ff" emissive="#7000ff" emissiveIntensity={3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ── Main Scene ────────────────────────────────────────────── */
const ThreeScene = ({ emergencyMode, activeRoom }) => {
  const mainLightRef = useRef();
  const accentLightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mainLightRef.current) {
      mainLightRef.current.intensity = emergencyMode
        ? 3 + Math.sin(t * 8) * 1.5
        : 2 + Math.sin(t * 1.5) * 0.3;
      mainLightRef.current.position.x = Math.sin(t * 0.3) * 8;
      mainLightRef.current.position.z = Math.cos(t * 0.3) * 8;
    }
    if (accentLightRef.current) {
      accentLightRef.current.position.x = Math.cos(t * 0.5) * 6;
      accentLightRef.current.position.z = Math.sin(t * 0.5) * 6;
    }
  });

  const primaryColor = emergencyMode ? '#ff0044' : '#00f2ff';
  const bgColor = emergencyMode ? '#0a0000' : '#020617';

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 8, 35]} />

      {/* Lighting System */}
      <ambientLight intensity={0.15} />
      <pointLight
        ref={mainLightRef}
        position={[5, 8, 5]}
        color={primaryColor}
        intensity={2}
        distance={30}
        castShadow
      />
      <pointLight
        ref={accentLightRef}
        position={[-5, 4, -5]}
        color={emergencyMode ? '#ff4400' : '#7000ff'}
        intensity={1.5}
        distance={20}
      />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        color={primaryColor}
        intensity={emergencyMode ? 5 : 2}
        distance={30}
        castShadow
      />

      {/* Star Background */}
      <Stars
        radius={80}
        depth={60}
        count={3000}
        factor={3}
        saturation={0.2}
        fade
        speed={0.5}
      />

      {/* Floating Sparkle Particles */}
      <Sparkles
        count={150}
        scale={25}
        size={1.5}
        speed={0.2}
        color={emergencyMode ? '#ff5555' : '#00f2ff'}
      />

      {/* Central AI Core */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <AICore emergencyMode={emergencyMode} />
      </Float>

      {/* Holographic Information Screens */}
      <HoloScreens activeRoom={activeRoom} emergencyMode={emergencyMode} />

      {/* Medical Particles */}
      <MedicalParticles count={400} emergencyMode={emergencyMode} />

      {/* Holographic Floor */}
      <HoloFloor emergencyMode={emergencyMode} />

      {/* DNA Helix */}
      <DNAHelix emergencyMode={emergencyMode} />

      {/* Orbital Rings around the scene */}
      <OrbitalRing radius={12} color={primaryColor} speed={0.15} tilt={[0.3, 0]} />
      <OrbitalRing radius={14} color={emergencyMode ? '#ff4400' : '#7000ff'} speed={-0.1} tilt={[0.8, 0.5]} />
      <OrbitalRing radius={16} color={emergencyMode ? '#ff0044' : '#00ffaa'} speed={0.08} tilt={[1.2, 1]} />

      {/* Floating Data Spheres */}
      <DataSphere position={[-7, 3, -5]} size={0.4} color={primaryColor} speed={1.2} />
      <DataSphere position={[5, -2, -8]} size={0.5} color="#7000ff" speed={0.8} />
      <DataSphere position={[-4, -3, -3]} size={0.25} color="#00ffaa" speed={1.5} />
      <DataSphere position={[9, 1, -4]} size={0.35} color={primaryColor} speed={1} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
};

export default ThreeScene;
