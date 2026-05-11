import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VOICE_COMMANDS = {
  'open icu monitoring': { room: 'ICU', msg: 'ICU Intelligence Chamber activated.' },
  'run patient diagnostics': { room: 'COMMAND_CENTER', msg: 'Running full patient diagnostics...' },
  'show neural scans': { room: 'NEURAL_LAB', msg: 'Neural Diagnostics Lab engaged.' },
  'activate emergency mode': { emergency: true, msg: 'EMERGENCY MODE ACTIVATED. Triaging critical patients.' },
  'deactivate emergency mode': { emergency: false, msg: 'Returning to standard operation.' },
  'analyze patient risk': { room: 'PREDICTIVE', msg: 'Predictive risk analysis running...' },
  'open predictive analytics': { room: 'PREDICTIVE', msg: 'Predictive Healthcare Hub launched.' },
  'start medical simulation': { room: 'AI_SURGERY', msg: 'AI Surgery simulation environment loaded.' },
  'show hospital intelligence': { room: 'COMMAND_CENTER', msg: 'Hospital Operations Command Center active.' },
  'open ai diagnostics': { room: 'NEURAL_LAB', msg: 'AI Diagnostic systems online.' },
  'activate healthcare systems': { room: 'COMMAND_CENTER', msg: 'All systems nominal. AI Core at full capacity.' },
  'open emergency response': { room: 'EMERGENCY', msg: 'Emergency Response Center activated.' },
};

const VoiceController = ({ setActiveRoom, toggleEmergency, setIsVoiceActive }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [log, setLog] = useState([]);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleCommand = (text) => {
    const lower = text.toLowerCase().trim();
    for (const [cmd, action] of Object.entries(VOICE_COMMANDS)) {
      if (lower.includes(cmd)) {
        if (action.room) setActiveRoom(action.room);
        if (action.emergency !== undefined) toggleEmergency();
        showFeedback(`✦ ${action.msg}`);
        setLog(prev => [{ time: new Date().toLocaleTimeString(), cmd: text, result: action.msg }, ...prev.slice(0, 4)]);
        return;
      }
    }
    showFeedback(`Command not recognized: "${text}"`);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsVoiceActive(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        handleCommand(finalTranscript);
      }
    };

    recognition.onerror = (e) => {
      setError(`Voice error: ${e.error}`);
      setIsListening(false);
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsVoiceActive(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setIsVoiceActive(false);
  };

  return (
    <div className="voice-controller interactive">
      {/* Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className="voice-feedback glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className="voice-feedback-text">{feedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Button */}
      <motion.button
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`mic-icon ${isListening ? 'pulse' : ''}`}>
          {isListening ? '🎙️' : '🎤'}
        </div>
        <div className="voice-btn-label">{isListening ? 'LISTENING...' : 'VOICE AI'}</div>
        {isListening && <div className="listening-ring" />}
      </motion.button>

      {/* Command Log */}
      <AnimatePresence>
        {log.length > 0 && (
          <motion.div
            className="voice-log glass-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel-title holo-text" style={{ fontSize: '0.6rem', marginBottom: '4px' }}>COMMAND LOG</div>
            {log.map((entry, i) => (
              <div key={i} className="log-entry">
                <span className="log-time">{entry.time}</span>
                <span className="log-cmd">"{entry.cmd}"</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div className="voice-error">{error}</div>}
    </div>
  );
};

export default VoiceController;
