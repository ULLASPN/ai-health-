import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeScene from './components/ThreeScene';
import UIOverlay from './components/UIOverlay';
import VoiceController from './components/VoiceController';
import './index.css';

function App() {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [activeRoom, setActiveRoom] = useState('COMMAND_CENTER');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const toggleEmergency = () => setEmergencyMode(prev => !prev);

  return (
    <div className={`app-wrapper ${emergencyMode ? 'emergency-mode' : ''}`}>
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 2, 12], fov: 60 }}
        >
          <Suspense fallback={null}>
            <ThreeScene
              emergencyMode={emergencyMode}
              activeRoom={activeRoom}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="overlay-container">
        <UIOverlay
          emergencyMode={emergencyMode}
          activeRoom={activeRoom}
          setActiveRoom={setActiveRoom}
          toggleEmergency={toggleEmergency}
        />
        <VoiceController
          setActiveRoom={setActiveRoom}
          toggleEmergency={toggleEmergency}
          setIsVoiceActive={setIsVoiceActive}
          emergencyMode={emergencyMode}
        />
      </div>

      {/* Persistent Status Bar */}
      <div className="status-bar">
        <div className="status-item">◉ SYSTEM: ONLINE</div>
        <div className="status-item">◉ AI CORE: STABLE</div>
        <div className={`status-item ${emergencyMode ? 'pulse text-emergency' : ''}`}>
          ◉ MODE: {emergencyMode ? 'EMERGENCY' : 'STANDARD'}
        </div>
        <div className="status-item">◉ UPTIME: 99.97%</div>
      </div>
    </div>
  );
}

export default App;
