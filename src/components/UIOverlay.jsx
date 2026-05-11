import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROOMS = [
  { id: 'COMMAND_CENTER', label: 'Command Center', icon: '🧠' },
  { id: 'ICU', label: 'ICU Intelligence', icon: '🫀' },
  { id: 'NEURAL_LAB', label: 'Neural Lab', icon: '🔬' },
  { id: 'EMERGENCY', label: 'Emergency Response', icon: '🚨' },
  { id: 'AI_SURGERY', label: 'AI Surgery', icon: '🔩' },
  { id: 'PREDICTIVE', label: 'Predictive Hub', icon: '📊' },
];

const PATIENTS = [
  { id: 'P-4029', name: 'Aryan Mehta', hr: 72, o2: 98, bp: '120/80', status: 'STABLE' },
  { id: 'P-4030', name: 'Priya Sharma', hr: 105, o2: 94, bp: '135/90', status: 'WATCH' },
  { id: 'P-4031', name: 'Rahul Gupta', hr: 58, o2: 91, bp: '100/65', status: 'CRITICAL' },
];

const PatientCard = ({ patient, emergencyMode }) => {
  const statusColor = patient.status === 'STABLE'
    ? '#00ffaa'
    : patient.status === 'WATCH'
    ? '#ffaa00'
    : '#ff0044';

  return (
    <motion.div
      className="patient-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ borderLeft: `3px solid ${statusColor}` }}
    >
      <div className="patient-header">
        <span className="patient-id">{patient.id}</span>
        <span className="patient-status" style={{ color: statusColor, textShadow: `0 0 8px ${statusColor}` }}>
          {patient.status}
        </span>
      </div>
      <div className="patient-name">{patient.name}</div>
      <div className="patient-vitals">
        <div className="vital-item">
          <span className="vital-label">HR</span>
          <span className="vital-value ecg-color">{patient.hr} BPM</span>
        </div>
        <div className="vital-item">
          <span className="vital-label">O₂</span>
          <span className="vital-value">{patient.o2}%</span>
        </div>
        <div className="vital-item">
          <span className="vital-label">BP</span>
          <span className="vital-value">{patient.bp}</span>
        </div>
      </div>
      <div className="ecg-line">
        <svg viewBox="0 0 200 40" width="100%" height="40" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={patient.status === 'STABLE' ? '#00f2ff' : '#ff0044'}
            strokeWidth="1.5"
            points="0,20 10,20 20,5 30,35 40,20 50,20 60,20 70,10 80,30 90,20 100,20 110,20 120,5 130,35 140,20 150,20 160,20 170,10 180,30 190,20 200,20"
          />
        </svg>
      </div>
    </motion.div>
  );
};

const UIOverlay = ({ emergencyMode, activeRoom, setActiveRoom, toggleEmergency }) => {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({ activePatients: 124, aiAlerts: 3, systemLoad: 67 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setStats(prev => ({
        activePatients: prev.activePatients,
        aiAlerts: Math.floor(Math.random() * 5) + 1,
        systemLoad: Math.floor(Math.random() * 15) + 60,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ui-overlay interactive">
      {/* Emergency Mode Banner */}
      <AnimatePresence>
        {emergencyMode && (
          <motion.div
            className="emergency-banner"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
          >
            <span className="pulse">⚠ EMERGENCY MODE ACTIVE — AI TRIAGING CRITICAL PATIENTS ⚠</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="topbar glass-panel">
        <div className="topbar-left">
          <div className="logo-area">
            <div className="logo-icon">✦</div>
            <div>
              <div className="logo-title">NEUROSCAN AI 3D</div>
              <div className="logo-sub">MEDICAL INTELLIGENCE CORE · v9.4.1</div>
            </div>
          </div>
        </div>

        <div className="topbar-center">
          <div className="stat-pill">
            <span className="stat-label">PATIENTS</span>
            <span className="stat-value">{stats.activePatients}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">AI ALERTS</span>
            <span className="stat-value" style={{ color: stats.aiAlerts > 3 ? '#ffaa00' : '#00ffaa' }}>
              {stats.aiAlerts}
            </span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">SYSTEM LOAD</span>
            <span className="stat-value">{stats.systemLoad}%</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="time-display">
            <div className="time-main">{time.toLocaleTimeString()}</div>
            <div className="time-date">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <button
            className={`emergency-btn ${emergencyMode ? 'active' : ''}`}
            onClick={toggleEmergency}
          >
            {emergencyMode ? '🔴 DEACTIVATE' : '🚨 EMERGENCY'}
          </button>
        </div>
      </div>

      {/* Left Panel: Room Navigator */}
      <div className="left-panel glass-panel">
        <div className="panel-title holo-text">ENVIRONMENTS</div>
        {ROOMS.map((room) => (
          <motion.button
            key={room.id}
            className={`room-btn ${activeRoom === room.id ? 'active' : ''}`}
            onClick={() => setActiveRoom(room.id)}
            whileHover={{ scale: 1.03, x: 4 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="room-icon">{room.icon}</span>
            <span className="room-label">{room.label}</span>
            {activeRoom === room.id && <span className="room-active-dot" />}
          </motion.button>
        ))}
      </div>

      {/* Right Panel: Patient Monitoring */}
      <div className="right-panel glass-panel">
        <div className="panel-title holo-text">PATIENT TELEMETRY</div>
        <div className="scan-line" />
        {PATIENTS.map((p) => (
          <PatientCard key={p.id} patient={p} emergencyMode={emergencyMode} />
        ))}
      </div>

      {/* Bottom Bar: AI Status */}
      <div className="bottom-bar glass-panel">
        <div className="ai-status-row">
          {[
            { label: 'NEURAL CORE', value: 'ACTIVE', color: '#00f2ff' },
            { label: 'PREDICTIVE ENGINE', value: '97.4% CONF', color: '#00ffaa' },
            { label: 'BIOMETRICS', value: 'SYNCED', color: '#00f2ff' },
            { label: 'ENCRYPTION', value: 'AES-512', color: '#7000ff' },
            { label: 'DATA STREAMS', value: '1,248 LIVE', color: '#00ffaa' },
            { label: 'VOICE AI', value: 'LISTENING', color: '#ffaa00' },
          ].map((item) => (
            <div key={item.label} className="ai-status-item">
              <span className="ai-status-label">{item.label}</span>
              <span className="ai-status-value" style={{ color: item.color, textShadow: `0 0 6px ${item.color}` }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Room Label */}
      <motion.div
        className="room-label-display holo-text"
        key={activeRoom}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        {ROOMS.find(r => r.id === activeRoom)?.label.toUpperCase() || activeRoom}
      </motion.div>
    </div>
  );
};

export default UIOverlay;
