import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment, ContactShadows, Grid } from '@react-three/drei';
import AICore from './AICore';
import HolographicPanels from './HolographicPanels';
import * as THREE from 'three';

const MedicalEnvironment = ({ isEmergency }) => {
  const color = isEmergency ? '#ef4444' : '#22d3ee';
  
  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 5, 25]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={color} />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color={color}
      />

      <Grid
        infiniteGrid
        fadeDistance={20}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={color}
        cellColor="#1e293b"
      />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floating Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.05} transparent opacity={0.3} sizeAttenuation />
      </points>
    </>
  );
};

const ThreeScene = ({ vitals, isEmergency }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={15} 
          autoRotate={!isEmergency}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />

        <Suspense fallback={null}>
          <MedicalEnvironment isEmergency={isEmergency} />
          <AICore isEmergency={isEmergency} />
          <HolographicPanels vitals={vitals} isEmergency={isEmergency} />
          <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
