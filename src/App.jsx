import React, { useState, useEffect } from 'react';
import ThreeScene from './components/ThreeScene';
import { 
  Activity, Mic, Bell, Settings, Search, 
  Shield, AlertTriangle, ChevronRight, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceAssistant from './hooks/useVoiceAssistant';

const OverlayUI = ({ isEmergency, setIsEmergency, isListening, startListening }) => {
  return (
    <div className="overlay-ui">
      {/* Top Bar */}
      <header className="absolute top-0 w-full p-8 flex justify-between items-start">
        <div className="flex gap-6">
          <div className="glass-panel p-4 flex items-center gap-4 interactive">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isEmergency ? 'bg-red-500/20 border-red-500' : 'bg-cyan-500/20 border-cyan-500'}`}>
              <Activity className={isEmergency ? 'text-red-500' : 'text-cyan-400'} size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter">NEUROSCAN <span className={isEmergency ? 'text-red-500' : 'text-cyan-400'}>3D</span></h1>
              <p className="text-[10px] opacity-50 font-mono tracking-widest uppercase">Global OS v45.0.2</p>
            </div>
          </div>
          
          <div className="glass-panel px-6 py-4 flex flex-col justify-center interactive">
            <div className="flex items-center gap-4 text-[10px] font-mono opacity-50 tracking-widest mb-1">
              <span>SYSTEM_STATUS</span>
              <div className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
            <div className="font-bold text-sm">{isEmergency ? 'EMERGENCY_PROTOCOLS_ACTIVE' : 'NOMINAL_OPERATION'}</div>
          </div>
        </div>

        <div className="flex gap-4 interactive">
          <div className="glass-panel p-4 flex items-center gap-6">
            <button className="opacity-50 hover:opacity-100 transition-opacity"><Search size={20} /></button>
            <button className="opacity-50 hover:opacity-100 transition-opacity"><Bell size={20} /></button>
            <button className="opacity-50 hover:opacity-100 transition-opacity"><Settings size={20} /></button>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
          </div>
        </div>
      </header>

      {/* Side HUD */}
      <aside className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {[
          { label: 'ICU_CHAMBER_1', status: '85%' },
          { label: 'NEURAL_LINK_7', status: 'ACTIVE' },
          { label: 'BIO_SCAN_SYNC', status: 'SYNCED' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-4 w-48 interactive cursor-pointer hover:bg-white/5 group"
          >
            <div className="text-[8px] font-mono opacity-40 mb-1">{item.label}</div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs">{item.status}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </aside>

      {/* Bottom Control Hub */}
      <footer className="absolute bottom-0 w-full p-12 flex justify-between items-end">
        <div className="flex gap-6 interactive">
          <button 
            onClick={() => setIsEmergency(!isEmergency)}
            className={`glass-panel px-8 py-4 flex items-center gap-4 transition-all ${isEmergency ? 'bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'hover:bg-white/5'}`}
          >
            <AlertTriangle className={isEmergency ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
            <span className={`font-bold tracking-widest text-sm ${isEmergency ? 'text-red-500' : 'text-slate-300'}`}>
              {isEmergency ? 'TERMINATE EMERGENCY' : 'PROTOCOL OVERRIDE'}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
           <AnimatePresence>
             {isListening && (
               <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-2"
               >
                 Neural Uplink Active...
               </motion.div>
             )}
           </AnimatePresence>
           <button 
            onMouseDown={startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center interactive transition-all ${
              isListening ? 'bg-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.6)] scale-110' : 'bg-black/40 border-2 border-cyan-500/30 text-cyan-400 hover:border-cyan-400'
            }`}
          >
            <Mic size={32} className={isListening ? 'text-white' : ''} />
          </button>
        </div>

        <div className="glass-panel p-6 w-80 interactive">
           <div className="flex items-center gap-3 mb-4">
             <Shield className="text-cyan-400" size={18} />
             <span className="text-xs font-bold uppercase tracking-wider">AURA AI Insights</span>
           </div>
           <p className="text-[11px] leading-relaxed opacity-60 font-mono">
             Analysis complete. Patient vitals within 2% of optimal range. No immediate intervention required.
           </p>
           <div className="mt-4 flex gap-2">
             <div className="h-1 flex-1 bg-cyan-500/20 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 w-3/4" />
             </div>
             <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 w-1/2" />
             </div>
           </div>
        </div>
      </footer>

      {/* Cinematic Borders */}
      <div className="fixed inset-0 pointer-events-none border-[100px] border-black/10 mix-blend-overlay" />
      <div className="scanline-effect" />
    </div>
  );
};

const App = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [vitals, setVitals] = useState({ hr: 72, spo2: 98, temp: 36.6 });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        hr: prev.hr + (Math.random() > 0.5 ? 1 : -1),
        spo2: Math.min(100, prev.spo2 + (Math.random() > 0.8 ? 1 : -1)),
        temp: 36.6 + (Math.random() * 0.2)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (cmd) => {
    if (cmd.includes('emergency')) setIsEmergency(true);
    if (cmd.includes('normal') || cmd.includes('stable')) setIsEmergency(false);
  };

  const { isListening, startListening } = useVoiceAssistant(handleCommand);

  return (
    <main className="h-screen w-screen bg-black">
      <ThreeScene vitals={vitals} isEmergency={isEmergency} />
      <OverlayUI 
        isEmergency={isEmergency} 
        setIsEmergency={setIsEmergency} 
        isListening={isListening}
        startListening={startListening}
      />
    </main>
  );
};

export default App;
