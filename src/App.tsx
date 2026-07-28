import { useState } from 'react';
import { MessageCircle, Mic, Send, X } from 'lucide-react';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  return (
    <div className="app-container">
      {/* Background content representing a plain page */}
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', opacity: 0.5 }}>
        <h1>Plain Page Content</h1>
        <p>This is a plain page. Click the chat widget in the bottom right corner.</p>
      </div>

      {/* Chat Widget Container */}
      <div className={`chat-widget-container ${isOpen ? 'animate-slide-up' : 'hidden'}`}>
        
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="avatar-container">
              A
            </div>
            <div className="header-text">
              <span className="header-title">Asha</span>
              <span className="header-subtitle">Care Companion · always here for you</span>
            </div>
          </div>
          <div className="header-status">
            <div className="status-dot"></div>
            Ready
          </div>
        </div>

        {/* Body */}
        <div className="chat-body chat-scroll">
          <div className="message-group">
            <div className="message-avatar">A</div>
            <div className="message-content">
              <div className="message-bubble">
                Namaste, and welcome. 🙏 I'm <strong>Asha</strong>, your care companion at KVNN's Advanced Wound Healing Clinics. You can ask me about a wound, our treatments, booking a visit, or anything at all. How can I help you today?
              </div>
              <div className="action-buttons">
                <button className="btn-primary">Book appointment</button>
              </div>
            </div>
          </div>

          <div className="suggestion-pills">
            <button className="pill">My wound isn't healing</button>
            <button className="pill">Diabetic foot care</button>
            <button className="pill">Told I might lose my leg</button>
            <button className="pill">What is HBOT?</button>
            <button className="pill">Book an appointment</button>
            <button className="pill">Where are you located?</button>
          </div>
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <div className="footer-top">
            <span className="voice-label">Asha's voice</span>
            <button className="toggle-switch" onClick={toggleVoice} aria-label="Toggle voice">
              <div 
                className="toggle-knob" 
                style={{ transform: isVoiceEnabled ? 'translateX(20px)' : 'translateX(0)' }}
              ></div>
            </button>
          </div>
          <div className="footer-bottom">
            <div className="input-container">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Type your question..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button className="btn-icon btn-mic" aria-label="Use microphone">
              <Mic size={20} />
            </button>
            <button className="btn-icon btn-send" aria-label="Send message">
              <Send size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <button 
        className="fab-button" 
        onClick={toggleWidget}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

    </div>
  );
}

export default App;
