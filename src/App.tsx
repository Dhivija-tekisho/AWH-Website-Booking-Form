import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { MessageCircle, Mic, Send, Globe, ChevronDown, Upload, CheckCircle2, Calendar, User, Phone, MapPin, Stethoscope, Activity, AlertCircle, Wind } from 'lucide-react';

import './App.css';

function RegistrationForm({ onSubmit }: { onSubmit: (data: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    state: '',
    city: '',
    concern: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const str = `Name: ${formData.name}, Email: ${formData.email}, DOB: ${formData.dob}, Gender: ${formData.gender}, State: ${formData.state}, City: ${formData.city}, Concern: ${formData.concern}`;
    setSubmitted(true);
    onSubmit(str);
  };

  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[12px] p-4 mt-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-3 w-full sm:w-[320px]">
      <h3 className="font-semibold text-[#043b2d] text-[15px] mb-1">Patient Details</h3>
      <input required type="text" placeholder="Full Name" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input required type="email" placeholder="Email Address" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      
      <div className="flex gap-2">
        <input required type="date" placeholder="Date of Birth" className="w-1/2 border border-gray-200 rounded-[8px] p-2.5 text-[14px] text-gray-700 outline-none focus:border-[#cca66a]" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
        <select required className="w-1/2 border border-gray-200 rounded-[8px] p-2.5 text-[14px] text-gray-700 outline-none focus:border-[#cca66a]" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
          <option value="" disabled>Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-2">
        <input required type="text" placeholder="State (e.g. Telangana)" className="w-1/2 border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
        <input required type="text" placeholder="City" className="w-1/2 border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
      </div>

      <textarea required placeholder="Main health concern (e.g., wound on my leg)" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a] resize-none" rows={2} value={formData.concern} onChange={e => setFormData({...formData, concern: e.target.value})} />
      <button type="submit" className="bg-[#cca66a] text-white py-2.5 rounded-[8px] text-[14px] font-bold hover:bg-[#b5925a] transition-colors mt-2">Submit Details</button>
    </form>
  );
}

type Language = 'en' | 'hi' | 'te';

interface Translations {
  online: string;
  subtitle: string;
  welcomeMessage: ReactNode;
  bookAppointment: string;
  stepPrompts: {
    confirmationTitle: string;
    clinicAddress: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    online: 'Online',
    subtitle: 'Care Companion · always here for you',
    welcomeMessage: (
      <div>
        <p>Namaste 🙏 I'm <strong>Asha</strong>, your care companion at KVNN's Advanced Wound Healing Clinics. You can ask me about a wound, our treatments, booking a visit, or anything at all. How can I help you today?</p>
      </div>
    ),
    bookAppointment: 'Book appointment',
    stepPrompts: {
      confirmationTitle: "🎉 Appointment Confirmed!",
      clinicAddress: "AWH Advanced Wound Healing Clinic, Jubilee Hills, Hyderabad",
    }
  },
  hi: {
    online: 'ऑनलाइन',
    subtitle: 'केयर साथी · आपके लिए हमेशा तैयार',
    welcomeMessage: (
      <div>
        <p style={{ marginBottom: '10px' }}>नमस्ते 👋</p>
        <p style={{ marginBottom: '10px' }}>मैं <strong>आशा</strong> हूँ, <strong>एडवांस्ड वूंड हीलिंग अस्पताल</strong> से आपकी वर्चुअल सहायक।</p>
        <p>आज मैं आपकी क्या मदद कर सकती हूँ?</p>
      </div>
    ),
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    stepPrompts: {
      confirmationTitle: "🎉 अपॉइंटमेंट की पुष्टि हो गई!",
      clinicAddress: "AWH एडवांस्ड वूंड हीलिंग क्लिनिक, जुबली हिल्स, हैदराबाद",
    }
  },
  te: {
    online: 'ఆన్‌లైన్',
    subtitle: 'సంరక్షణ భాగస్వామి · మీకు ఎల్లప్పుడూ ఇక్కడ ఉన్నారు',
    welcomeMessage: (
      <div>
        <p style={{ marginBottom: '10px' }}>హాయ్ 👋</p>
        <p style={{ marginBottom: '10px' }}>నేను <strong>ఆశా</strong>, <strong>అడ్వాన్స్‌డ్ ఊండ్ హీలింగ్ హాస్పిటల్</strong> నుండి మీ వర్చువల్ అసిస్టెంట్‌ని.</p>
        <p>ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?</p>
      </div>
    ),
    bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    stepPrompts: {
      confirmationTitle: "🎉 అపాయింట్‌మెంట్ ధృవీకరించబడింది!",
      clinicAddress: "AWH అడ్వాన్స్‌డ్ ఊండ్ హీలింగ్ క్లినిక్, జూబ్లీ హిల్స్, హైదరాబాద్",
    }
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
  actionButtons?: ReactNode;
}

interface BookingData {
  category: string;
  imageUrl: string | null;
  status: string;
  specialist: string;
  slot: string;
  patientName: string;
  patientAge: string;
  patientPhone: string;
}

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [, setIsLangMenuOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPills, setCurrentPills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [_step, setStep] = useState<number>(1);
  const [_bookingData, setBookingData] = useState<BookingData>({
    category: '',
    imageUrl: null,
    status: '',
    specialist: '',
    slot: '',
    patientName: '',
    patientAge: '',
    patientPhone: ''
  });

  const conversationIdRef = useRef<string>(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '70000000-0000-4000-8000-000000000001');
  const threadIdRef = useRef<string>(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '90000000-0000-4000-8000-000000000001');
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const t = translations[language];

  const connectWebSocket = () => {
    if (wsRef.current) return;
    const botId = import.meta.env.VITE_BOT_ID;
    if (!botId) return;
    const baseUrl = import.meta.env.VITE_AI_ORCHESTRATION_URL || 'http://localhost:3001';
    const wsBase = baseUrl.replace(/^http/, 'ws');
    
    const url = `${wsBase}/ws/chatbot/${botId}?threadId=${encodeURIComponent(threadIdRef.current)}`;
    const ws = new WebSocket(url);
    
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.type === 'ready') {
           setIsLoading(false);
        } else if (d.type === 'assistant_message') {
           const text = d.text || '';
           const isRegistrationPrompt = text.toLowerCase().includes('what is your full name');
           let actionButtons: ReactNode = undefined;
           
           if (isRegistrationPrompt) {
             actionButtons = <RegistrationForm onSubmit={(data) => {
               handleSend(data, false);
             }} />;
           }

           // Extract numbered options from the text
           let displayText = text;
           const options = [...text.matchAll(/(?:^|\n)\s*(?:\d+\.|-)\s+([^\n]+)/g)].map(m => m[1].trim()).filter(Boolean);
           if (options.length > 0) {
             setCurrentPills(options);
             
             // Remove the list items from the chat bubble
             displayText = displayText.replace(/(?:^|\n)\s*(?:\d+\.|-)\s+([^\n]+)/g, '');
             
             // Remove redundant "reply with..." instructions
             displayText = displayText.replace(/Reply with the number.*/gi, '');
             displayText = displayText.replace(/Please reply with a number.*/gi, '');
             
             // Clean up excess newlines
             displayText = displayText.replace(/\n{3,}/g, '\n\n').trim();
           }

           if (displayText || actionButtons) {
             const formattedText = <div className="whitespace-pre-wrap leading-relaxed">{displayText}</div>;
             addMessage('bot', formattedText, actionButtons);
           }
           setIsLoading(false);
        } else if (d.type === 'form_request') {
           const prompt = d.form?.prompt || 'Please provide some information.';
           addMessage('bot', prompt);
           setIsLoading(false);
        } else if (d.type === 'error') {
           addMessage('bot', 'Something went wrong — please try again.');
           setIsLoading(false);
        }
      } catch (err) {
        console.error('WS parse error', err);
      }
    };
    
    ws.onclose = () => {
      wsRef.current = null;
    };
    
    ws.onerror = () => {
      setIsLoading(false);
    };
    
    wsRef.current = ws;
  };



  // Auto-scroll chat body to bottom when messages update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);



  // Initialize or reset flow
  const resetWorkflow = () => {
    const genUuid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `70000000-0000-4000-8000-${Date.now()}`.padEnd(36, '0');
    conversationIdRef.current = genUuid();
    threadIdRef.current = genUuid();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStep(1);
    setCurrentPills([]);
    setBookingData({
      category: '',
      imageUrl: null,
      status: '',
      specialist: '',
      slot: '',
      patientName: '',
      patientAge: '',
      patientPhone: ''
    });
    setMessages([{
      id: `msg-${Date.now()}`,
      role: 'bot',
      content: t.welcomeMessage,
      actionButtons: (
        <div className="flex gap-2 flex-wrap">
          <button className="btn-primary !bg-[#113227] hover:!bg-[#043b2d]" onClick={() => handleSend(t.bookAppointment, true)}>{t.bookAppointment}</button>
          <button className="btn-whatsapp !bg-[#1da851] !hover:bg-[#158940] flex items-center justify-center gap-1.5" onClick={() => window.open('https://wa.me/1234567890', '_blank')}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Chat on WhatsApp
          </button>
        </div>
      )
    }]);
  };

  useEffect(() => {
    resetWorkflow();
    // setTimeout to allow state to settle before connecting
    setTimeout(connectWebSocket, 50);
  }, [language]);

  useEffect(() => {
    if (messages.length === 0) {
      setCurrentPills([]);
    }
  }, [messages.length]);

  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const addMessage = (role: Role, content: ReactNode, actionButtons?: ReactNode) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content, actionButtons }]);
  };



  // Step 7: Handle text input details or AI question
  const callLLM = async (userMessage: string) => {
    setIsLoading(true);
    setCurrentPills([]);
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        connectWebSocket();
        // Wait a bit for connection if it was closed
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'user_message', text: userMessage }));
          } else {
            addMessage('bot', 'Connection failed. Please try again.');
            setIsLoading(false);
          }
        }, 500);
        return;
      }
      wsRef.current.send(JSON.stringify({ type: 'user_message', text: userMessage }));
    } catch (e) {
      console.error('AI chat endpoint error:', e);
      setIsLoading(false);
    }
  };

  const handleSend = (text: string, _isFromPill: boolean = false) => {
    if (!text.trim()) return;

    addMessage('user', text);
    setInputValue('');

    callLLM(text);
  };

  const getPillIcon = (text: string) => {
    const t = text.toLowerCase();
    const iconCls = "text-[#c4a974] shrink-0";
    if (t.includes('healing') || t.includes('घाव')) return <Activity size={16} className={iconCls} />;
    if (t.includes('diabetic') || t.includes('डायबिटीज')) return <Stethoscope size={16} className={iconCls} />;
    if (t.includes('leg') || t.includes('पैर')) return <AlertCircle size={16} className={iconCls} />;
    if (t.includes('hbot')) return <Wind size={16} className={iconCls} />;
    if (t.includes('appointment')) return <Calendar size={16} className={iconCls} />;
    if (t.includes('located') || t.includes('location')) return <MapPin size={16} className={iconCls} />;
    if (t.includes('burn') || t.includes('जलने')) return <Activity size={16} className={iconCls} />;
    if (t.includes('trauma') || t.includes('चोट')) return <Activity size={16} className={iconCls} />;
    if (t.includes('upload') || t.includes('फोटो')) return <Upload size={16} className={iconCls} />;
    return <CheckCircle2 size={16} className={iconCls} />;
  };



  return (
    <div className="h-[100dvh] md:min-h-screen flex flex-col bg-[#fcfaf5] font-sans selection:bg-[#cca66a] selection:text-white">
      {/* Top Banner */}
      <div className="hidden md:flex bg-[#043b2d] text-white text-xs py-2 px-[5%] justify-between items-center z-20 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span>Open now</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Phone size={12} />
            <span>+91 90541 08789</span>
          </div>
          <span className="hidden sm:inline opacity-90">Saleemnagar, opp. Musharambagh Metro</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 font-semibold text-xs opacity-90">
            <button onClick={() => selectLanguage('en')} className={`hover:text-white transition-colors ${language === 'en' ? 'text-[#d8c28d]' : 'text-white/60'}`}>EN</button>
            <button onClick={() => selectLanguage('te')} className={`hover:text-white transition-colors ${language === 'te' ? 'text-[#d8c28d]' : 'text-white/60'}`}>తెలుగు</button>
            <button onClick={() => selectLanguage('hi')} className={`hover:text-white transition-colors ${language === 'hi' ? 'text-[#d8c28d]' : 'text-white/60'}`}>हिंदी</button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="hidden md:flex justify-between items-center px-[5%] py-4 bg-[#fcfaf5] border-b border-black/5 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#043b2d] flex items-center justify-center relative shadow-sm">
            <div className="w-3.5 h-3.5 rounded-full bg-[#d8c28d] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-100 absolute top-1.5 right-1.5"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-100 absolute bottom-1.5 left-1.5"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-100 absolute top-1.5 left-1.5"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-100 absolute bottom-1.5 right-1.5"></div>
          </div>
          <div className="leading-[1.15] text-[#043b2d]">
            <div className="text-[10px] font-bold tracking-widest text-[#d8c28d]">KVNN'S</div>
            <div className="text-[14px] font-bold font-serif">Advanced Wound Healing</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-gray-700">
          <a href="#" className="hover:text-[#043b2d] transition-colors">Home</a>
          <a href="#" className="hover:text-[#043b2d] transition-colors">Conditions</a>
          <a href="#" className="hover:text-[#043b2d] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#043b2d] transition-colors">Specialists</a>
          <a href="#" className="hover:text-[#043b2d] transition-colors">Book</a>
          <a href="#" className="hover:text-[#043b2d] transition-colors">About</a>
          <a href="#" className="hover:text-[#043b2d] transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#e0d5b8] bg-white text-[#043b2d] text-[13px] font-semibold hover:bg-[#f8f5ee] transition-colors shadow-sm"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-4 h-4 rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1)] bg-[radial-gradient(circle_at_30%_30%,#fff_0%,#d8c28d_50%,#043b2d_100%)]"></div>
            Ask Asha
          </button>
          <button className="hidden sm:block px-6 py-2.5 rounded-full bg-[#d1b886] text-[#043b2d] text-[13px] font-bold hover:bg-[#c4a974] transition-colors shadow-sm">
            Book Appointment
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#fcfaf5] flex flex-col relative z-0 overflow-hidden min-h-0">
        {/* Hero Section */}
        <section className="hidden md:block text-center pt-8 pb-4 px-4 flex-shrink-0">

          <h1 className="text-3xl md:text-5xl font-serif text-[#113227] mb-2 md:mb-4 font-normal tracking-tight">Meet Asha</h1>
          <p className="text-[15px] md:text-[17px] text-gray-600 max-w-[550px] mx-auto leading-relaxed px-4 md:px-0">
            Ask anything — by typing or by voice. Asha is here to guide, reassure, and help you take the next step.
          </p>
        </section>

        {/* Chat Inline Wrapper */}
        <div className={`flex-1 min-h-0 w-full flex justify-center items-stretch md:items-start transition-all duration-700 ease-in-out px-0 md:px-4 pb-0 md:pb-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative bg-[#eff2f0] rounded-[24px] md:rounded-[32px] border-none md:border-[1.5px] border-white/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:shadow-[0_20px_50px_-12px_rgba(46,150,107,0.25),0_0_15px_rgba(255,255,255,0.6)] w-full md:w-[858px] max-w-full md:max-w-[95vw] flex-1 md:flex-none md:h-[620px] max-h-none md:max-h-[70vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="chat-header !rounded-t-[24px] md:!rounded-t-[32px] !py-[12px] md:!py-[24px] !px-[16px] md:!px-[32px] !min-h-[70px] md:!min-h-[112px]">
              <div className="chat-header-content flex-1 min-w-0 mr-2 md:mr-0">
                <div className="header-avatar-orbit scale-75 sm:scale-100 origin-left shrink-0">
                  <div className="header-avatar-orb"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="header-title font-bold" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                    <span className="text-[18px] md:text-[24px]">Asha</span>
                  </span>
                  <span className="text-[11px] md:text-[13px] font-semibold text-[#cca66a] mt-0.5 md:mt-1 leading-snug line-clamp-2 sm:line-clamp-1">{translations[language].subtitle}</span>
                </div>
              </div>
              <div className="header-actions shrink-0">
                <div className="relative group">
                  <button
                    className="status-ready !bg-white/10 !border-white/20 !px-3 !py-1 !rounded-full text-xs flex items-center gap-1.5 hover:!bg-white/20 cursor-pointer transition-colors"
                    aria-label="Select language"
                  >
                    <Globe size={14} className="text-[#cca66a]" />
                    <span>{languageLabels[language]}</span>
                    <ChevronDown size={12} className="opacity-70" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-24 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${language === 'en' ? 'font-bold text-[#043b2d]' : 'text-gray-700'}`}>English</button>
                    <button onClick={() => setLanguage('hi')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${language === 'hi' ? 'font-bold text-[#043b2d]' : 'text-gray-700'}`}>हिंदी</button>
                    <button onClick={() => setLanguage('te')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${language === 'te' ? 'font-bold text-[#043b2d]' : 'text-gray-700'}`}>తెలుగు</button>
                  </div>
                </div>
                <button className="header-action-btn mobile-close-btn ml-1 hover:bg-white/20" onClick={toggleWidget} aria-label="Minimize">
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="chat-body chat-scroll flex-1 min-h-0 bg-[#ebf0ec]" ref={chatBodyRef}>
              <div className="chat-messages pt-[4px] px-[16px] md:px-[30px]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-group ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'bot' && (
                      <div className="message-avatar shadow-sm">
                        A
                      </div>
                    )}
                    <div className={`message-content max-w-[92%] md:max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`message-bubble shadow-sm border border-black/5 text-[#2d3748] ${msg.role === 'user' ? '!bg-[#124d3c] !text-white !rounded-tl-[18px] !rounded-tr-[18px] !rounded-bl-[18px] !rounded-br-[4px]' : '!bg-white'}`}>
                        {msg.content}
                      </div>
                      {msg.actionButtons && (
                        <div className="action-buttons mt-2">
                          {msg.actionButtons}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="user-avatar shadow-sm bg-[#124d3c] rounded-full w-[34px] h-[34px] flex items-center justify-center text-white shrink-0">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="message-group">
                    <div className="message-avatar shadow-sm">A</div>
                    <div className="message-content">
                      <div className="message-bubble typing-indicator !bg-white shadow-sm border border-black/5">
                        <span>.</span><span>.</span><span>.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Categories Flow Area */}
              <div className="suggestion-pills-container w-full shrink-0 px-[16px] md:px-[30px] pt-4 pb-[16px] flex justify-center mt-2">

                {/* Mobile Drawer-style Container */}
                <div className="md:hidden w-full max-w-[400px] mx-auto bg-gradient-to-b from-[#e3ece7]/95 to-[#d6e2dc]/95 backdrop-blur-md rounded-2xl p-3 pt-2.5 shadow-sm border border-white/50 relative z-10">
                  <div className="w-10 h-1.5 bg-[#b5c7bd] rounded-full mx-auto mb-3.5"></div>
                  <div className="flex flex-col gap-2.5">
                    {currentPills.map((pillText, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 bg-gradient-to-b from-white/95 to-white/60 border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#113227] text-[13px] font-semibold px-4 py-2.5 rounded-full transition-colors active:scale-[0.98]"
                        onClick={() => handleSend(pillText, true)}
                      >
                        <span className="flex items-center justify-center w-6 opacity-90">{getPillIcon(pillText)}</span>
                        <span className="truncate">{pillText}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Grid Container */}
                <div className="hidden md:grid md:grid-cols-3 gap-3 w-full max-w-full">
                  {currentPills.map((pillText, index) => (
                    <button
                      key={index}
                      className="pill shadow-sm bg-white hover:bg-gray-50 text-[#333] text-[13.5px] font-medium px-4 py-2.5 rounded-[16px] transition-colors text-center truncate"
                      onClick={() => handleSend(pillText, true)}
                      title={pillText}
                    >
                      <span className="truncate block w-full">{pillText}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="chat-footer bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex justify-end items-center px-[16px] md:px-[20px] pt-1 md:pt-0 pb-1 md:pb-0">
                <span className="text-[12px] md:text-[13.5px] text-[#697a72] mr-3 font-medium">Asha's voice</span>
                <label className="voice-switch relative inline-block w-[40px] md:w-[44px] h-[22px] md:h-[24px]">
                  <input type="checkbox" className="opacity-0 w-0 h-0" checked={isVoiceEnabled} onChange={toggleVoice} />
                  <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${isVoiceEnabled ? 'bg-[#043b2d]' : 'bg-[#e2e8e4]'}`}></span>
                  <span className={`absolute h-[18px] md:h-[20px] w-[18px] md:w-[20px] left-[2px] bottom-[2px] bg-white rounded-full transition-transform shadow-sm ${isVoiceEnabled ? 'translate-x-[18px] md:translate-x-[20px]' : ''}`}></span>
                </label>
              </div>
              <div className="flex items-center gap-2 md:gap-3 px-[10px] md:px-[14px] pt-0 pb-2 md:pb-3">
                <div className="flex-1 bg-[#e6ebe7] rounded-full px-3 md:px-4 py-2 md:py-2.5 flex items-center border border-[#dce4df] focus-within:border-[#4a866d] focus-within:bg-white transition-colors shadow-sm">
                  <input
                    type="text"
                    className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] text-gray-800 placeholder-gray-500"
                    placeholder=""
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && handleSend(inputValue, false)}
                  />
                </div>
                <button className="w-[44px] h-[44px] rounded-full bg-[#cca66a] text-white flex items-center justify-center hover:bg-[#b5925a] transition-colors shrink-0 shadow-sm" aria-label="Use microphone">
                  <Mic size={22} />
                </button>
                <button
                  className="w-[44px] h-[44px] rounded-full bg-[#043b2d] text-white flex items-center justify-center hover:bg-[#032e23] transition-colors shrink-0 shadow-sm"
                  aria-label="Send message"
                  onClick={() => inputValue.trim() && handleSend(inputValue, false)}
                >
                  <Send size={22} className="ml-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>



      </main>

      {/* Floating Action Buttons */}
      <div className={`fixed bottom-4 md:bottom-8 right-4 md:right-8 flex-col gap-3 md:gap-4 z-50 ${isOpen ? 'hidden md:flex' : 'flex'}`}>
        <button
          className="w-[52px] h-[52px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-[#fcfaf5] bg-gradient-to-br from-[#f6e8cc] to-[#d1b886] flex items-center justify-center hover:scale-105 transition-transform"
          onClick={() => setIsOpen(true)}
          title="Talk to Asha"
        >
          <div className="w-[26px] h-[26px] rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_0_6px_rgba(255,255,255,0.8)] bg-[radial-gradient(circle_at_35%_35%,#fff_0%,#f4dca6_35%,#c8a165_70%,#4a866d_100%)]"></div>
        </button>
        <button className="w-[52px] h-[52px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] bg-[#25d366] text-white flex items-center justify-center hover:scale-105 transition-transform">
          <MessageCircle size={26} />
        </button>
        <button className="w-[52px] h-[52px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] bg-[#d1b886] text-white flex items-center justify-center hover:scale-105 transition-transform">
          <Phone size={24} fill="currentColor" />
        </button>
      </div>


    </div>
  );
}

export default App;
