import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Pulse Wave Ring ────────────────────────────────────────── */
const PulseRing = ({ radius, color, speed, delay = 0 }) => {
  const ref = useRef();

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * speed + delay) % (Math.PI * 2);
    const scale = 1 + Math.sin(t) * 0.3;
    const opacity = 0.15 + Math.sin(t) * 0.15;
    ref.current.scale.setScalar(scale);
    ref.current.material.opacity = opacity;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
};

/* ── Energy Field Lines ─────────────────────────────────────── */
const EnergyLines = ({ emergencyMode }) => {
  const groupRef = useRef();
  const color = emergencyMode ? '#ff0044' : '#00f2ff';

  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const points = [];
      for (let j = 0; j < 20; j++) {
        const r = 2 + j * 0.15;
        points.push(
          new THREE.Vector3(
            Math.cos(angle + j * 0.05) * r,
            Math.sin(j * 0.5) * 0.5,
            Math.sin(angle + j * 0.05) * r
          )
        );
      }
      result.push(points);
    }
    return result;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((pts, i) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        const linePoints = curve.getPoints(50);
        const geom = new THREE.BufferGeometry().setFromPoints(linePoints);
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" {...geom} />
            <lineBasicMaterial color={color} transparent opacity={0.15} />
          </line>
        );
      })}
    </group>
  );
};

/* ── Main AI Core ──────────────────────────────────────────── */
const AICore = ({ emergencyMode }) => {
  const coreRef = useRef();
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const ring4Ref = useRef();
  const shellRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.z = t * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.8;
      innerRef.current.rotation.x = t * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.6;
    if (ring2Ref.current) ring2Ref.current.rotation.y = t * -0.5;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.35;
    if (ring4Ref.current) {
      ring4Ref.current.rotation.x = t * -0.25;
      ring4Ref.current.rotation.z = t * 0.15;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.15;
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      shellRef.current.scale.setScalar(pulse);
    }
  });

  const coreColor = emergencyMode ? '#ff0044' : '#00f2ff';
  const accentColor = emergencyMode ? '#ff4400' : '#7000ff';

  return (
    <group position={[0, 0, 0]}>
      {/* Central Intelligence Sphere */}
      <Sphere ref={coreRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color={coreColor}
          speed={emergencyMode ? 6 : 3}
          distort={emergencyMode ? 0.5 : 0.35}
          radius={1}
          emissive={coreColor}
          emissiveIntensity={emergencyMode ? 4 : 2.5}
          roughness={0}
          metalness={1}
        />
      </Sphere>

      {/* Inner Energy Sphere */}
      <Sphere ref={innerRef} args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive={coreColor}
          emissiveIntensity={5}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Outer Wireframe Shell */}
      <Sphere ref={shellRef} args={[1.8, 32, 32]}>
        <meshBasicMaterial
          color={coreColor}
          wireframe
          transparent
          opacity={0.08}
        />
      </Sphere>

      {/* Holographic Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.8, 0.04, 16, 128]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={4}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.03, 16, 128]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={3}
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[3.6, 0.02, 16, 128]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={2}
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh ref={ring4Ref} rotation={[Math.PI / 5, 0, Math.PI / 6]}>
        <torusGeometry args={[4.0, 0.015, 16, 128]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.12} />
      </mesh>

      {/* Pulse Waves */}
      <PulseRing radius={5} color={coreColor} speed={1.5} delay={0} />
      <PulseRing radius={5.5} color={coreColor} speed={1.5} delay={2} />
      <PulseRing radius={6} color={coreColor} speed={1.5} delay={4} />

      {/* Energy Field */}
      <EnergyLines emergencyMode={emergencyMode} />

      {/* Core Point Lights */}
      <pointLight color={coreColor} intensity={15} distance={12} decay={2} />
      <pointLight color={accentColor} intensity={5} distance={8} decay={2} position={[0, 2, 0]} />
    </group>
  );
};

export default AICore;
