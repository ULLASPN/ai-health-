import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AICore = ({ isEmergency }) => {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate rings
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.y = t * 0.4;
    
    // Core pulsing
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  const coreColor = isEmergency ? '#ef4444' : '#22d3ee';

  return (
    <group position={[0, 0, 0]}>
      {/* Central Intelligence Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={coreRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={coreColor}
            speed={3}
            distort={0.4}
            radius={1}
            emissive={coreColor}
            emissiveIntensity={2}
          />
        </Sphere>
      </Float>

      {/* Holographic Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={5} transparent opacity={0.6} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={3} transparent opacity={0.4} />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={2} transparent opacity={0.3} />
      </mesh>

      {/* Particle Field Inside */}
      <points>
        <sphereGeometry args={[1.5, 32, 32]} />
        <pointsMaterial color={coreColor} size={0.02} transparent opacity={0.5} />
      </points>

      {/* Volumetric Light Glow */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color={coreColor} transparent opacity={0.1} />
      </Sphere>
    </group>
  );
};

export default AICore;
