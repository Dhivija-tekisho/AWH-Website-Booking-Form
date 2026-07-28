import { useState, useRef, useEffect, ReactNode } from 'react';
import { MessageCircle, Mic, Send, X } from 'lucide-react';
import { CLINIC } from '@/booking';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { LanguageToggle, useLang } from '@/i18n';
import './App.css';

type Role = 'bot' | 'user';

interface Message {
  id: string;
  role: Role;
  content: ReactNode;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    role: 'bot',
    content: (
      <>
        Hi 👋<br /><br />
        I'm <strong>Asha</strong>, your virtual assistant from <strong>Advanced Wound Healing Hospital</strong>.<br /><br />
        I'm here to help you with appointments, wound care guidance, treatment information, doctors, and any questions about our hospital.<br /><br />
        How can I help you today?
      </>
    ),
  },
];

const SUGGESTIONS = [
  'Book Appointment',
  'Wound Care',
  'Meet Our Doctors',
  'Treatment Cost',
  'Existing Appointment',
  'Hospital Location'
];

type FlowStep = 'idle' | 'asking_name' | 'redirecting';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');
  const [bookingView, setBookingView] = useState<{ active: boolean; patientType?: 'new'|'existing'; name?: string }>({ active: false });
  
  const { t } = useLang();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);

  const addMessage = (role: Role, content: ReactNode) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content }]);
  };

  const simulateRedirect = (type: 'existing' | 'new', name: string) => {
    // Instantly switch to the booking view
    setBookingView({ active: true, patientType: type, name });
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    setInputValue('');
    addMessage('user', trimmed);

    // Process intent
    setTimeout(() => {
      const lowerText = trimmed.toLowerCase();

      if (flowStep === 'idle') {
        if (lowerText.includes('book') || lowerText.includes('appointment')) {
          addMessage('bot', (
            <>
              I'd be happy to help with that.<br /><br />
              Before we proceed, may I know your full name?
            </>
          ));
          setFlowStep('asking_name');
        } else {
          addMessage('bot', "I'm still learning, but I can help you book an appointment! Would you like to do that?");
        }
      } else if (flowStep === 'asking_name') {
        const isRamesh = lowerText === 'ramesh kumar';
        const firstName = trimmed.split(' ')[0];
        
        if (isRamesh) {
          addMessage('bot', `Welcome back, ${firstName}! I found your existing patient record. I'll take you to your booking page.`);
          simulateRedirect('existing', trimmed);
        } else {
          addMessage('bot', (
            <>
              Welcome, {firstName}! It looks like this is your first visit to Advanced Wound Healing Hospital.<br /><br />
              I'll help you get started.
            </>
          ));
          simulateRedirect('new', trimmed);
        }
      }
    }, 600); // Simulate typing delay
  };

  if (bookingView.active) {
    return (
      <main className="mx-auto flex h-dvh max-w-3xl flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
        <header className="relative mb-3 flex-none text-center sm:mb-4">
          <div className="absolute right-0 top-0">
            <LanguageToggle />
          </div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-jade">
            {t('app.eyebrow')}
          </p>
          <h1 className="mt-1 text-[clamp(1.55rem,4vw,2.15rem)] font-semibold text-ink">
            {t('app.title')}
          </h1>
          <p className="mt-0.5 text-[0.88rem] text-ink-soft">{CLINIC.name}</p>
        </header>
        <div className="min-h-0 flex-1">
          <BookingWizard 
            initialOverrides={{ 
              patientType: bookingView.patientType, 
              name: bookingView.name,
              step: 2 // Jump straight to verify step
            }} 
          />
        </div>
      </main>
    );
  }

  return (
    <div className="app-container">
      {/* Background content */}
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', opacity: 0.5 }}>
        <h1>AWH Website Booking Form</h1>
        <p>This is a placeholder for the main application. Click the chat widget to start the booking flow.</p>
      </div>

      {/* Chat Widget Container */}
      <div className={`chat-widget-container ${isOpen ? 'animate-slide-up' : 'hidden'}`}>
        
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="avatar-container">A</div>
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
        <div className="chat-body chat-scroll" ref={chatBodyRef}>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`message-group ${msg.role === 'user' ? 'user-message' : ''}`}>
              {msg.role === 'bot' && <div className="message-avatar">A</div>}
              <div className="message-content">
                <div className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : ''}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {flowStep === 'idle' && (
            <div className="suggestion-pills">
              {SUGGESTIONS.map((sug) => (
                <button 
                  key={sug} 
                  className="pill" 
                  onClick={() => handleSend(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
          
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
                placeholder="Type your message..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                disabled={flowStep === 'redirecting'}
              />
            </div>
            <button className="btn-icon btn-mic" aria-label="Use microphone">
              <Mic size={20} />
            </button>
            <button 
              className="btn-icon btn-send" 
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || flowStep === 'redirecting'}
              aria-label="Send message"
            >
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
