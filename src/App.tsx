import { useState, useRef, useEffect, ReactNode } from 'react';
import { MessageCircle, Mic, Send, X, Volume2, VolumeX, Globe, ChevronDown } from 'lucide-react';
import { CLINIC } from '@/booking';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { LanguageToggle, useLang } from '@/i18n';
import './App.css';

type Language = 'en' | 'hi' | 'te';

interface Translations {
  online: string;
  subtitle: string;
  welcomeMessage: string;
  bookAppointment: string;
  suggestionPills: string[];
  inputPlaceholder: string;
}

const translations: Record<Language, Translations> = {
  en: {
    online: 'Online',
    subtitle: 'Care Companion · always here for you',
    welcomeMessage: "Namaste, and welcome. 🙏 I'm Asha, your care companion at KVNN's Advanced Wound Healing Clinics. You can ask me about a wound, our treatments, booking a visit, or anything at all. How can I help you today?",
    bookAppointment: 'Book appointment',
    suggestionPills: [
      "My wound isn't healing",
      "Diabetic foot care",
      "Told I might lose my leg",
      "What is HBOT?",
      "Book an appointment",
      "Where are you located?"
    ],
    inputPlaceholder: 'Type your question...'
  },
  hi: {
    online: 'ऑनलाइन',
    subtitle: 'केयर साथी · आपके लिए हमेशा तैयार',
    welcomeMessage: 'नमस्ते, और आपका स्वागत है। 🙏 मैं आशा हूँ, KVNN के एडवांस्ड वूंड हीलिंग क्लिनिक में आपकी देखभाल साथी। आप मुझसे घाव, हमारे उपचार, अपॉइंटमेंट बुक करने या किसी भी विषय के बारे में पूछ सकते हैं। आज मैं आपकी क्या मदद कर सकती हूँ?',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    suggestionPills: [
      'मेरा घाव ठीक नहीं हो रहा है',
      'डायबिटीज पैर की देखभाल',
      'पैर गंवाने का जोखिम',
      'HBOT क्या है?',
      'अपॉइंटमेंट बुक करें',
      'आपका क्लिनिक कहाँ स्थित है?'
    ],
    inputPlaceholder: 'अपना प्रश्न लिखें...'
  },
  te: {
    online: 'ఆన్‌లైన్',
    subtitle: 'సంరక్షణ భాగస్వామి · మీకు ఎల్లప్పుడూ ఇక్కడ ఉన్నారు',
    welcomeMessage: 'నమస్తే, మరియు స్వాగతం. 🙏 నేను ఆశా, KVNN యొక్క అడ్వాన్స్‌డ్ ఊండ్ హీలింగ్ క్లినిక్స్‌లో మీ సంరక్షణ భాగస్వామిని. మీరు నన్ను గాయం, మా చికిత్సలు, విజిట్ బుకింగ్ లేదా ఏదైనా విషయం గురించి అడగవచ్చు. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?',
    bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    suggestionPills: [
      'నా గాయం మానడం లేదు',
      'డయాబెటిక్ పాదాల సంరక్షణ',
      'కాలు తొలగించే ప్రమాదం',
      'HBOT అంటే ఏమిటి?',
      'అపాయింట్‌మెంట్ బుక్ చేయండి',
      'మీ క్లినిక్ ఎక్కడ ఉంది?'
    ],
    inputPlaceholder: 'మీ ప్రశ్నను టైప్ చేయండి...'
  }
};

const languageLabels: Record<Language, string> = {
  en: 'EN',
  hi: 'हिंदी',
  te: 'తెలుగు'
};

type Role = 'bot' | 'user';

interface Message {
  id: string;
  role: Role;
  content: ReactNode;
  showBookButton?: boolean;
}

type FlowStep = 'idle' | 'asking_name' | 'redirecting';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');
  const [bookingView, setBookingView] = useState<{ active: boolean; patientType?: 'new'|'existing'; name?: string }>({ active: false });

  const { t: i18nT } = useLang();
  const t = translations[language];

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages or flowStep changes
  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [messages, flowStep, bookingView.active]);

  // Initialize first message based on language
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'msg-1',
        role: 'bot',
        content: t.welcomeMessage,
        showBookButton: true
      }]);
    } else {
      // Update the first message if language changes
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs.length > 0 && newMsgs[0].id === 'msg-1') {
          newMsgs[0] = { ...newMsgs[0], content: t.welcomeMessage };
        }
        return newMsgs;
      });
    }
  }, [language, t.welcomeMessage]);

  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const addMessage = (role: Role, content: ReactNode) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content }]);
  };

  const simulateRedirect = (type: 'existing' | 'new', name: string) => {
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
        const isRamesh = lowerText.includes('ramesh kumar');
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

  const handleBookClick = () => {
    addMessage('bot', (
      <>
        I'd be happy to help with that.<br /><br />
        Before we proceed, may I know your full name?
      </>
    ));
    setFlowStep('asking_name');
  };

  const handleBookingComplete = (details: any) => {
    setBookingView({ active: false });
    setFlowStep('idle');
    
    const formattedDate = details.date ? new Date(details.date).toLocaleDateString() : '';
    
    addMessage('bot', (
      <>
        <strong>Booking Confirmed! 🎉</strong><br /><br />
        <strong>Reference:</strong> {details.reference}<br />
        <strong>Date:</strong> {formattedDate}<br />
        <strong>Time:</strong> {details.slot}<br />
        <strong>Doctor:</strong> {details.doctor?.name}<br /><br />
        Thank you for booking with Advanced Wound Healing Clinics. If you have any other questions, feel free to ask!
      </>
    ));
  };

  if (bookingView.active) {
    return (
      <main className="mx-auto flex h-dvh max-w-3xl flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
        <header className="relative mb-3 flex-none text-center sm:mb-4">
          <div className="absolute right-0 top-0">
            <LanguageToggle />
          </div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-jade">
            {i18nT('app.eyebrow')}
          </p>
          <h1 className="mt-1 text-[clamp(1.55rem,4vw,2.15rem)] font-semibold text-ink">
            {i18nT('app.title')}
          </h1>
          <p className="mt-0.5 text-[0.88rem] text-ink-soft">{CLINIC.name}</p>
        </header>
        <div className="min-h-0 flex-1">
          <BookingWizard 
            initialOverrides={{ 
              patientType: bookingView.patientType as any, 
              name: bookingView.name,
              step: 2 
            }}
            onBookingComplete={handleBookingComplete}
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
            <div className="header-avatar-orbit">
              <div className="header-avatar-orb"></div>
            </div>
            <span className="header-title">Asha</span>
          </div>
          <div className="header-actions">
            <button 
              className="header-action-btn" 
              onClick={toggleVoice} 
              aria-label={isVoiceEnabled ? "Mute voice output" : "Enable voice output"}
              title={isVoiceEnabled ? "Voice output enabled" : "Voice output muted"}
            >
              {isVoiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <div className="lang-dropdown-container">
              <button 
                className="header-action-btn lang-btn" 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                aria-label="Select language"
                title="Change language"
              >
                <Globe size={12} />
                <span className="lang-code">{languageLabels[language]}</span>
                <ChevronDown size={10} className={`dropdown-arrow ${isLangMenuOpen ? 'open' : ''}`} />
              </button>
              {isLangMenuOpen && (
                <div className="lang-menu">
                  <button 
                    className={`lang-option ${language === 'en' ? 'active' : ''}`}
                    onClick={() => selectLanguage('en')}
                  >
                    English (EN)
                  </button>
                  <button 
                    className={`lang-option ${language === 'hi' ? 'active' : ''}`}
                    onClick={() => selectLanguage('hi')}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button 
                    className={`lang-option ${language === 'te' ? 'active' : ''}`}
                    onClick={() => selectLanguage('te')}
                  >
                    తెలుగు (Telugu)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="chat-body chat-scroll" ref={chatBodyRef}>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-group ${msg.role === 'user' ? 'user-message' : ''}`}>
                {msg.role === 'bot' && <div className="message-avatar">A</div>}
                <div className="message-content">
                  <div className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : ''}`}>
                    {msg.content}
                  </div>
                  {msg.showBookButton && flowStep === 'idle' && (
                    <div className="action-buttons">
                      <button className="btn-primary" onClick={handleBookClick}>{t.bookAppointment}</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Questions Section */}
          {flowStep === 'idle' && (
            <div className="suggestion-pills-wrapper">
              <div className="suggestion-pills-track">
                {[...t.suggestionPills, ...t.suggestionPills].map((pillText, idx) => (
                  <button 
                    key={idx} 
                    className="pill"
                    onClick={() => handleSend(pillText)}
                  >
                    <MessageCircle size={14} className="pill-icon" />
                    <span>{pillText}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Dummy div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <div className="footer-bottom">
            <div className="input-container">
              <input 
                type="text" 
                className="chat-input" 
                placeholder={t.inputPlaceholder} 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                disabled={flowStep === 'redirecting'}
              />
            </div>
            <button className="btn-icon btn-mic" aria-label="Use microphone">
              <Mic size={18} />
            </button>
            <button 
              className="btn-icon btn-send" 
              aria-label="Send message"
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || flowStep === 'redirecting'}
            >
              <Send size={18} />
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
