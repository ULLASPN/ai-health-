import React from 'react';
import { Html, Float, Text } from '@react-three/drei';
import { Activity, Heart, Wind, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

const HolographicPanel = ({ position, title, value, unit, icon: Icon, color = '#22d3ee' }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
      <group>
        {/* Panel Background */}
        <mesh>
          <planeGeometry args={[2, 1.2]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.4} />
        </mesh>
        
        {/* Border Glow */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.05, 1.25]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>

        {/* Content via HTML (Drei) */}
        <Html transform distanceFactor={3} position={[0, 0, 0.02]}>
          <div className="w-64 p-4 text-white font-sans pointer-events-none select-none">
            <div className="flex justify-between items-center mb-2">
              <div className="p-1 rounded bg-white/10">
                <Icon size={16} color={color} />
              </div>
              <div className="text-[8px] font-mono opacity-50 tracking-widest uppercase">NODE-SECURE</div>
            </div>
            
            <div className="text-[10px] opacity-60 uppercase tracking-tighter mb-1">{title}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono" style={{ color: color }}>{value}</span>
              <span className="text-xs opacity-50">{unit}</span>
            </div>

            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-current opacity-50" style={{ width: '70%', backgroundColor: color }} />
            </div>
          </div>
        </Html>

        {/* 3D Decorative Elements */}
        <Text
          position={[0.8, -0.5, 0.05]}
          fontSize={0.05}
          color={color}
          font="/fonts/JetBrainsMono-Bold.ttf"
          anchorX="right"
        >
          LIVE_STREAM_v4.2
        </Text>
      </group>
    </Float>
  );
};

const HolographicPanels = ({ vitals, isEmergency }) => {
  const primaryColor = isEmergency ? '#ef4444' : '#22d3ee';
  
  return (
    <group>
      <HolographicPanel 
        position={[-4, 1.5, -2]} 
        title="Heart Rate" 
        value={vitals.hr} 
        unit="BPM" 
        icon={Heart} 
        color={vitals.hr > 100 ? '#ef4444' : primaryColor}
      />
      <HolographicPanel 
        position={[4, 1.5, -2]} 
        title="Oxygen Saturation" 
        value={vitals.spo2} 
        unit="%" 
        icon={Wind} 
        color={primaryColor}
      />
      <HolographicPanel 
        position={[-4, -1.5, -2]} 
        title="Body Temp" 
        value={vitals.temp} 
        unit="°C" 
        icon={Thermometer} 
        color="#fbbf24"
      />
      <HolographicPanel 
        position={[4, -1.5, -2]} 
        title="System Status" 
        value={isEmergency ? 'CRITICAL' : 'NOMINAL'} 
        unit="" 
        icon={Activity} 
        color={isEmergency ? '#ef4444' : '#10b981'}
      />
    </group>
  );
};

export default HolographicPanels;
