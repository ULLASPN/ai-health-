import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Individual Holo Screen ────────────────────────────────── */
const HoloScreen = ({ position, rotation, title, lines, color, width = 3.2, height = 2 }) => {
  const groupRef = useRef();
  const borderRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (borderRef.current) {
      borderRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position} rotation={rotation}>
        {/* Screen Background */}
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Border Frame */}
        <mesh ref={borderRef}>
          <planeGeometry args={[width + 0.06, height + 0.06]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>

        {/* Scan Line Effect */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[width - 0.1, 0.01]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>

        {/* Title */}
        <Text
          position={[0, height / 2 - 0.22, 0.01]}
          fontSize={0.12}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          {'◆ ' + title + ' ◆'}
        </Text>

        {/* Separator Line */}
        <mesh position={[0, height / 2 - 0.38, 0.008]}>
          <planeGeometry args={[width - 0.4, 0.005]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>

        {/* Data Lines */}
        {lines.map((line, i) => (
          <Text
            key={i}
            position={[-width / 2 + 0.2, height / 2 - 0.55 - i * 0.2, 0.01]}
            fontSize={0.09}
            color={line.highlight ? '#00ffaa' : color}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.04}
          >
            {line.text}
          </Text>
        ))}

        {/* Corner Decorations */}
        {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, y], i) => (
          <mesh key={i} position={[x * width / 2, y * height / 2, 0.002]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

/* ── ECG Waveform in 3D ────────────────────────────────────── */
const ECGWaveform = ({ position, color, emergencyMode }) => {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 100; i++) {
      const x = (i / 100) * 4 - 2;
      let y = 0;
      const phase = (i % 25) / 25;
      if (phase < 0.1) y = 0;
      else if (phase < 0.15) y = -0.15;
      else if (phase < 0.2) y = 0.6;
      else if (phase < 0.25) y = -0.2;
      else if (phase < 0.35) y = 0;
      else if (phase < 0.5) y = 0.15;
      else y = 0;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, []);

  const curve = new THREE.CatmullRomCurve3(points);
  const linePoints = curve.getPoints(200);
  const geom = new THREE.BufferGeometry().setFromPoints(linePoints);

  return (
    <group ref={lineRef} position={position}>
      <line>
        <bufferGeometry attach="geometry" {...geom} />
        <lineBasicMaterial color={color} transparent opacity={0.7} />
      </line>
    </group>
  );
};

/* ── Main HoloScreens Component ────────────────────────────── */
const HoloScreens = ({ activeRoom, emergencyMode }) => {
  const color = emergencyMode ? '#ff0044' : '#00f2ff';

  const screens = [
    {
      id: 'vitals',
      title: 'PATIENT VITALS · ID-4029',
      lines: [
        { text: '► HEART RATE ............ 72 BPM', highlight: false },
        { text: '► OXYGEN SAT ........... 98.2%', highlight: false },
        { text: '► BLOOD PRESSURE ....... 120/80', highlight: false },
        { text: '► TEMP ................. 36.8°C', highlight: false },
        { text: '► RISK SCORE ........... LOW', highlight: true },
        { text: '► AI PREDICTION ........ STABLE', highlight: true },
      ],
      position: [-7, 2.5, -3],
      rotation: [0, 0.45, 0],
    },
    {
      id: 'neural',
      title: 'NEURAL ACTIVITY SCAN',
      lines: [
        { text: '► ALPHA WAVES .......... OPTIMAL', highlight: true },
        { text: '► BETA WAVES ........... 22.4 Hz', highlight: false },
        { text: '► DELTA ACTIVITY ....... NOMINAL', highlight: false },
        { text: '► SYNAPTIC LOAD ........ 42%', highlight: false },
        { text: '► COGNITIVE INDEX ...... 94/100', highlight: true },
        { text: '► ANOMALIES ............ NONE', highlight: true },
      ],
      position: [7, 2, -4],
      rotation: [0, -0.45, 0],
    },
    {
      id: 'ops',
      title: 'HOSPITAL OPS COMMAND',
      lines: [
        { text: '► ACTIVE ROOMS ......... 124', highlight: false },
        { text: '► STAFF ON DUTY ........ 342', highlight: false },
        { text: '► ICU BEDS AVAILABLE ... 12', highlight: false },
        { text: '► POWER CORE ........... 89.4%', highlight: false },
        { text: '► NETWORK .............. AES-512', highlight: true },
        { text: '► AI UPTIME ............ 99.97%', highlight: true },
      ],
      position: [0, 5, -6],
      rotation: [0.15, 0, 0],
    },
    {
      id: 'icu',
      title: 'ICU ENVIRONMENT FEED',
      lines: [
        { text: '► TEMPERATURE .......... 22.5°C', highlight: false },
        { text: '► HUMIDITY ............. 44.8%', highlight: false },
        { text: '► BIO-SECURITY ......... LVL-1', highlight: true },
        { text: '► VENTILATION .......... NORMAL', highlight: false },
        { text: '► AIR QUALITY .......... 99.1%', highlight: true },
        { text: '► CONTAMINATION ........ CLEAR', highlight: true },
      ],
      position: [-6, -1.5, -5],
      rotation: [-0.1, 0.6, 0],
    },
    {
      id: 'predictive',
      title: 'PREDICTIVE ANALYTICS',
      lines: [
        { text: '► 24H RISK FORECAST .... LOW', highlight: true },
        { text: '► READMISSION PROB ..... 4.2%', highlight: false },
        { text: '► TREATMENT EFF ........ 96.1%', highlight: true },
        { text: '► RESOURCE DEMAND ...... NORMAL', highlight: false },
        { text: '► OUTBREAK RISK ........ 0.01%', highlight: true },
        { text: '► MODEL CONFIDENCE ..... 97.8%', highlight: false },
      ],
      position: [6, -2, -5],
      rotation: [-0.1, -0.6, 0],
    },
  ];

  return (
    <group>
      {screens.map((screen) => (
        <HoloScreen key={screen.id} {...screen} color={color} />
      ))}

      {/* 3D ECG Waveforms */}
      <ECGWaveform position={[-7, 0.5, -2]} color={emergencyMode ? '#ff3366' : '#00ffaa'} emergencyMode={emergencyMode} />
      <ECGWaveform position={[7, 0, -3]} color={color} emergencyMode={emergencyMode} />
    </group>
  );
};

export default HoloScreens;
