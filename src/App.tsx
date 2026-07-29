import { useState, useEffect, useRef } from 'react';
import type { ReactNode, ChangeEvent } from 'react';
import { MessageCircle, Mic, Send, X, Volume2, VolumeX, Globe, ChevronDown, ChevronsRight, Upload, CheckCircle2, Calendar, User, Phone, MapPin, Stethoscope, FileText } from 'lucide-react';
import { CLINIC } from '@/booking';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { LanguageToggle, useLang } from '@/i18n';
import './App.css';

type Language = 'en' | 'hi' | 'te';

interface Translations {
  online: string;
  subtitle: string;
  welcomeMessage: ReactNode;
  bookAppointment: string;
  askNameIntro: ReactNode;
  askAiQuestion: string;
  suggestionPills: string[];
  inputPlaceholder: string;
  stepPrompts: {
    selectCategory: string;
    uploadImage: string;
    uploadBtn: string;
    skipPhotoBtn: string;
    selectStatus: string;
    selectSpecialist: string;
    selectSlot: string;
    enterDetails: string;
    confirmationTitle: string;
    clinicAddress: string;
    prepInstructionsTitle: string;
    prepInstructionsText: string;
    bookNewBtn: string;
  };
  statuses: string[];
  specialists: { name: string; title: string; exp: string }[];
  slots: string[];
}

const translations: Record<Language, Translations> = {
  en: {
    online: 'Online',
    subtitle: 'Care Companion · always here for you',
    welcomeMessage: (
      <div>
        <p style={{ marginBottom: '10px' }}>Hi 👋</p>
        <p style={{ marginBottom: '10px' }}>I'm <strong>Asha</strong>, your virtual assistant from <strong>Advanced Wound Healing Hospital</strong>.</p>
        <p>How can I help you today?</p>
      </div>
    ),
    bookAppointment: 'Book appointment',
    askNameIntro: (
      <div>
        <p>I'd be happy to help with that.</p>
        <p className="mt-2">Before we proceed, may I know your full name?</p>
      </div>
    ),
    askAiQuestion: '💬 Ask AI Specialist a Question',
    suggestionPills: [
      "Diabetic Foot Care",
      "Non-Healing Wounds & Ulcers",
      "Burn Injuries",
      "Leg Pain & Swelling",
      "Trauma & Injuries",
      "Other Conditions",
      "Upload Wound Photo"
    ],
    inputPlaceholder: 'Type your response...',
    stepPrompts: {
      selectCategory: "Please select the treatment category that best matches your medical condition:",
      uploadImage: "To help our specialists perform an initial assessment before your consultation, please upload a clear image of the wound (or select an option below):",
      uploadBtn: "📷 Upload Wound Photo",
      skipPhotoBtn: "⏭️ Skip Photo for Now",
      selectStatus: "Please select the current status/condition of the wound:",
      selectSpecialist: "Based on your selected category, here are our available specialists at AWH Clinic. Please select a doctor:",
      selectSlot: "Please select a preferred consultation time slot:",
      enterDetails: "Almost done! Please type the patient's Full Name, Age, and Phone Number (e.g. Ramesh Kumar, 45, 9876543210):",
      confirmationTitle: "🎉 Appointment Confirmed!",
      clinicAddress: "AWH Advanced Wound Healing Clinic, Jubilee Hills, Hyderabad",
      prepInstructionsTitle: "Preparation Instructions:",
      prepInstructionsText: "Please arrive 15 minutes before your scheduled appointment time. Bring all prior medical reports and dressing records.",
      bookNewBtn: "🔄 Book Another Appointment"
    },
    statuses: [
      "Mild / Surface Wound",
      "Non-Healing Chronic Ulcer",
      "Painful / Swollen / Infection Risk",
      "Severe Bleeding / Acute Trauma"
    ],
    specialists: [
      { name: "Dr. Ramesh Kumar", title: "Senior Vascular & Wound Specialist", exp: "15+ Yrs Exp" },
      { name: "Dr. Priya Sharma", title: "Podiatrist & Diabetic Foot Specialist", exp: "12+ Yrs Exp" },
      { name: "Dr. Vikram Mehta", title: "Plastic & Burn Injury Specialist", exp: "14+ Yrs Exp" }
    ],
    slots: [
      "Today at 4:00 PM",
      "Tomorrow at 10:30 AM",
      "Tomorrow at 2:30 PM"
    ]
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
    askNameIntro: (
      <div>
        <p>मुझे इसमें आपकी मदद करने में खुशी होगी।</p>
        <p className="mt-2">आगे बढ़ने से पहले, क्या मैं आपका पूरा नाम जान सकती हूँ?</p>
      </div>
    ),
    askAiQuestion: '💬 AI विशेषज्ञ से प्रश्न पूछें',
    suggestionPills: [
      "डायबिटीज पैर की देखभाल",
      "न भरने वाले घाव व अल्सर",
      "जलने की चोटें",
      "पैर में दर्द व सूजन",
      "चोट व आघात",
      "अन्य स्थितियां",
      "घाव की फोटो अपलोड करें"
    ],
    inputPlaceholder: 'अपना उत्तर लिखें...',
    stepPrompts: {
      selectCategory: "कृपया अपनी चिकित्सा स्थिति से मेल खाने वाली श्रेणी चुनें:",
      uploadImage: "डॉक्टरों द्वारा शुरुआती आकलन के लिए, कृपया घाव की स्पष्ट तस्वीर अपलोड करें:",
      uploadBtn: "📷 घाव की फोटो अपलोड करें",
      skipPhotoBtn: "⏭️ फोटो बाद में अपलोड करें",
      selectStatus: "कृपया घाव की वर्तमान स्थिति चुनें:",
      selectSpecialist: "AWH क्लिनिक में उपलब्ध हमारे विशेषज्ञ। कृपया डॉक्टर चुनें:",
      selectSlot: "कृपया परामर्श का समय चुनें:",
      enterDetails: "बुकिंग पूरी करने के लिए, अपना नाम, उम्र और फोन नंबर लिखें (जैसे: रमेश कुमार, 45, 9876543210):",
      confirmationTitle: "🎉 अपॉइंटमेंट की पुष्टि हो गई!",
      clinicAddress: "AWH एडवांस्ड वूंड हीलिंग क्लिनिक, जुबली हिल्स, हैदराबाद",
      prepInstructionsTitle: "तैयारी के निर्देश:",
      prepInstructionsText: "कृपया अपने समय से 15 मिनट पहले पहुंचें और पुरानी मेडिकल रिपोर्ट साथ लाएं।",
      bookNewBtn: "🔄 एक और अपॉइंटमेंट बुक करें"
    },
    statuses: [
      "हल्का घाव",
      "न भरने वाला अल्सर / बेड सोर",
      "दर्द / सूजन / इन्फेक्शन",
      "गंभीर रक्तस्राव / चोट"
    ],
    specialists: [
      { name: "डॉ. रमेश कुमार", title: "वरिष्ठ वूंड विशेषज्ञ", exp: "15+ वर्ष अनुभव" },
      { name: "डॉ. प्रिया शर्मा", title: "डायबिटीज पैर विशेषज्ञ", exp: "12+ वर्ष अनुभव" },
      { name: "डॉ. विक्रम मेहता", title: "प्लास्टिक व बर्न विशेषज्ञ", exp: "14+ वर्ष अनुभव" }
    ],
    slots: [
      "आज शाम 4:00 बजे",
      "कल सुबह 10:30 बजे",
      "कल दोपहर 2:30 बजे"
    ]
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
    askNameIntro: (
      <div>
        <p>దీనిలో మీకు సహాయం చేయడానికి నేను సంతోషిస్తాను.</p>
        <p className="mt-2">మనం ముందుకు వెళ్లే ముందు, మీ పూర్తి పేరు తెలుసుకోవచ్చా?</p>
      </div>
    ),
    askAiQuestion: '💬 AI స్పెషలిస్ట్‌ని ప్రశ్నించండి',
    suggestionPills: [
      "డయాబెటిక్ ఫుట్ కేర్",
      "మానని గాయాలు & అల్సర్లు",
      "కాలిన గాయాలు",
      "కాలు నొప్పి & వాపు",
      "గాయాలు & దెబ్బలు",
      "ఇతర సమస్యలు",
      "గాయం ఫోటో అప్‌లోడ్"
    ],
    inputPlaceholder: 'మీ సమాధానాన్ని టైప్ చేయండి...',
    stepPrompts: {
      selectCategory: "దయచేసి మీ ఆరోగ్య పరిస్థితికి సరిపోయే చికిత్స వర్గాన్ని ఎంచుకోండి:",
      uploadImage: "వైద్యుల ప్రాథమిక అంచనా కోసం, దయచేసి గాయం యొక్క స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ చేయండి:",
      uploadBtn: "📷 గాయం ఫోటోను అప్‌లోడ్ చేయండి",
      skipPhotoBtn: "⏭️ ప్రస్తుతానికి ఫోటోను దాటవేయండి",
      selectStatus: "దయచేసి గాయం యొక్క ప్రస్తుత పరిస్థితిని ఎంచుకోండి:",
      selectSpecialist: "AWH క్లినిక్‌లో అందుబాటులో ఉన్న మా నిపుణులు. దయచేసి ఒక డాక్టర్‌ని ఎంచుకోండి:",
      selectSlot: "దయచేసి సంప్రదింపు సమయాన్ని ఎంచుకోండి:",
      enterDetails: "బుకింగ్ పూర్తి చేయడానికి, దయచేసి మీ పూర్తి పేరు, వయస్సు మరియు ఫోన్ నంబర్‌ను టైప్ చేయండి (ఉదా: రమేష్ కుమార్, 45, 9876543210):",
      confirmationTitle: "🎉 అపాయింట్‌మెంట్ ధృవీకరించబడింది!",
      clinicAddress: "AWH అడ్వాన్స్‌డ్ ఊండ్ హీలింగ్ క్లినిక్, జూబ్లీ హిల్స్, హైదరాబాద్",
      prepInstructionsTitle: "సన్నాహక సూచనలు:",
      prepInstructionsText: "దయచేసి నిర్ణీత సమయానికి 15 నిమిషాల ముందు చేరుకోండి మరియు మునుపటి మెడికల్ రిపోర్టులను తీసుకురావండి.",
      bookNewBtn: "🔄 మరొక అపాయింట్‌మెంట్ బుక్ చేయండి"
    },
    statuses: [
      "సాధారణ గాయం",
      "మానని అల్సర్ / బెడ్ సోర్",
      "నొప్పి / వాపు / ఇన్ఫెక్షన్",
      "తీవ్రమైన రక్తస్రావం / గాయం"
    ],
    specialists: [
      { name: "డా. రమేష్ కుమార్", title: "సీనియర్ ఊండ్ స్పెషలిస్ట్", exp: "15+ ఏళ్ల అనుభవం" },
      { name: "డా. ప్రియా శర్మ", title: "డయాబెటిక్ ఫుట్ స్పెషలిస్ట్", exp: "12+ ఏళ్ల అనుభవం" },
      { name: "డా. విక్రమ్ మెహతా", title: "ప్లాస్టిక్ & బర్న్ స్పెషలిస్ట్", exp: "14+ ఏళ్ల అనుభవం" }
    ],
    slots: [
      "ఈ రోజు సాయంత్రం 4:00 గంటలకు",
      "రేపు ఉదయం 10:30 గంటలకు",
      "రేపు మధ్యాహ్నం 2:30 గంటలకు"
    ]
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

// 8-Step AWH WhatsApp Appointment Booking Workflow Steps
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    category: '',
    imageUrl: null,
    status: '',
    specialist: '',
    slot: '',
    patientName: '',
    patientAge: '',
    patientPhone: ''
  });
  
  const [bookingView, setBookingView] = useState<{ active: boolean; patientType?: 'new'|'existing'; name?: string }>({ active: false });
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { t: i18nT } = useLang();
  const t = translations[language];

  const [isDraggingPills, setIsDraggingPills] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const scrollPillsRight = () => {
    if (pillsRef.current) {
      pillsRef.current.scrollBy({ left: 180, behavior: 'smooth' });
    }
  };

  // Horizontal scroll & drag helpers for pills track
  const handlePillsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (pillsRef.current && e.deltaY !== 0) {
      pillsRef.current.scrollLeft += e.deltaY;
    }
  };

  const handlePillsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pillsRef.current) return;
    setIsDraggingPills(true);
    setDragStartX(e.pageX - pillsRef.current.offsetLeft);
    setDragScrollLeft(pillsRef.current.scrollLeft);
  };

  const handlePillsMouseUpOrLeave = () => {
    setIsDraggingPills(false);
  };

  const handlePillsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingPills || !pillsRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    pillsRef.current.scrollLeft = dragScrollLeft - walk;
  };

  // Auto-scroll chat body to bottom when messages update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleBookingComplete = (details: any) => {
    setBookingView({ active: false });
    setStep(8); // Mark as complete
    
    addMessage('bot', (
      <div className="confirmation-card">
        <div className="card-header-badge">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <span className="card-title">{t.stepPrompts.confirmationTitle}</span>
        </div>

        <div className="card-body-details">
          <div className="detail-row">
            <User size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Patient:</span>
              <span className="detail-val">{details.name || 'Not provided'} {details.age ? `(${details.age} yrs)` : ''}</span>
            </div>
          </div>

          <div className="detail-row">
            <Phone size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Contact:</span>
              <span className="detail-val">{details.phone || 'Not provided'}</span>
            </div>
          </div>

          {details.doctor && (
            <div className="detail-row">
              <Stethoscope size={15} className="detail-icon" />
              <div>
                <span className="detail-label">Doctor:</span>
                <span className="detail-val">{details.doctor.name} {details.department ? `(${details.department.name})` : ''}</span>
              </div>
            </div>
          )}

          <div className="detail-row">
            <Calendar size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Date & Time:</span>
              <span className="detail-val">
                {details.date ? new Date(details.date).toLocaleDateString() : ''} {details.slot ? `at ${details.slot}` : ''}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <MapPin size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Location:</span>
              <span className="detail-val">{t.stepPrompts.clinicAddress}</span>
            </div>
          </div>
          
          {details.reference && (
            <div className="detail-row">
              <FileText size={15} className="detail-icon" />
              <div>
                <span className="detail-label">Reference ID:</span>
                <span className="detail-val font-mono">{details.reference}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    ));
  };

  // Initialize or reset flow
  const resetWorkflow = () => {
    setStep(1);
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
        <button className="btn-primary" onClick={() => startBookingFlow()}>{t.bookAppointment}</button>
      )
    }]);
  };

  const startBookingFlow = () => {
    addMessage('user', t.bookAppointment);
    setStep(9);
    setTimeout(() => {
      addMessage('bot', translations[language].askNameIntro);
    }, 400);
  };

  useEffect(() => {
    resetWorkflow();
  }, [language]);

  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const addMessage = (role: Role, content: ReactNode) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content }]);
  };

  // Step 2: Select Category
  const handleStepSelectCategory = (preselectedCategory?: string) => {
    if (preselectedCategory) {
      addMessage('user', preselectedCategory);
      setBookingData(prev => ({ ...prev, category: preselectedCategory }));
      setStep(3);
      setTimeout(() => promptStep3UploadImage(preselectedCategory), 400);
      return;
    }

    setStep(2);
    addMessage('bot', (
      <div>
        <p>{t.stepPrompts.selectCategory}</p>
        <div className="options-grid mt-2">
          {t.suggestionPills.map((cat, idx) => (
            <button 
              key={idx} 
              className="option-btn"
              onClick={() => {
                if (cat.toLowerCase().includes('upload')) {
                  handleStepSelectCategory("Upload an image of your wound");
                } else {
                  handleStepSelectCategory(cat);
                }
              }}
            >
              <span className="option-num">{idx + 1}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>
    ));
  };

  // Step 3: Upload Image Prompt
  const promptStep3UploadImage = (_categoryName?: string) => {
    addMessage('bot', (
      <div className="upload-step-bubble">
        <p>{t.stepPrompts.uploadImage}</p>
        <div className="action-buttons mt-3">
          <label htmlFor="chat-file-input" className="btn-primary flex items-center gap-2 cursor-pointer">
            <Upload size={16} />
            <span>{t.stepPrompts.uploadBtn}</span>
          </label>
          <input 
            type="file" 
            id="chat-file-input" 
            accept="image/*" 
            className="hidden"
            onChange={handleImageUpload}
          />
          <button className="btn-secondary" onClick={() => handleSkipImage()}>{t.stepPrompts.skipPhotoBtn}</button>
        </div>
      </div>
    ));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBookingData(prev => ({ ...prev, imageUrl: url }));
      addMessage('user', (
        <div className="user-image-preview">
          <img src={url} alt="Wound sample" className="rounded-lg max-h-32 object-cover" />
          <span className="text-xs text-emerald-700 font-medium block mt-1">✓ Wound Photo Uploaded</span>
        </div>
      ));
      setStep(4);
      setTimeout(() => promptStep4SelectStatus(), 400);
    }
  };

  const handleSkipImage = () => {
    addMessage('user', "Skipped wound photo for now");
    setStep(4);
    setTimeout(() => promptStep4SelectStatus(), 400);
  };

  // Step 4: Select Wound Status
  const promptStep4SelectStatus = () => {
    addMessage('bot', (
      <div>
        <p>{t.stepPrompts.selectStatus}</p>
        <div className="options-grid mt-2">
          {t.statuses.map((statusItem, idx) => (
            <button 
              key={idx} 
              className="option-btn"
              onClick={() => handleSelectStatus(statusItem)}
            >
              <span>{statusItem}</span>
            </button>
          ))}
        </div>
      </div>
    ));
  };

  const handleSelectStatus = (statusName: string) => {
    addMessage('user', statusName);
    setBookingData(prev => ({ ...prev, status: statusName }));
    setStep(5);
    setTimeout(() => promptStep5ChooseSpecialist(), 400);
  };

  // Step 5: Choose Specialist
  const promptStep5ChooseSpecialist = () => {
    addMessage('bot', (
      <div>
        <p>{t.stepPrompts.selectSpecialist}</p>
        <div className="specialists-list mt-3">
          {t.specialists.map((doc, idx) => (
            <button 
              key={idx} 
              className="doctor-card-btn"
              onClick={() => handleSelectSpecialist(doc.name)}
            >
              <div className="doc-avatar"><Stethoscope size={18} /></div>
              <div className="doc-info">
                <span className="doc-name">{doc.name}</span>
                <span className="doc-title">{doc.title}</span>
                <span className="doc-exp">{doc.exp}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    ));
  };

  const handleSelectSpecialist = (docName: string) => {
    addMessage('user', docName);
    setBookingData(prev => ({ ...prev, specialist: docName }));
    setStep(6);
    setTimeout(() => promptStep6SelectSlot(docName), 400);
  };

  // Step 6: Select Slot
  const promptStep6SelectSlot = (_docName?: string) => {
    addMessage('bot', (
      <div>
        <p>{t.stepPrompts.selectSlot}</p>
        <div className="slots-grid mt-2">
          {t.slots.map((slotItem, idx) => (
            <button 
              key={idx} 
              className="slot-btn"
              onClick={() => handleSelectSlot(slotItem)}
            >
              <Calendar size={14} />
              <span>{slotItem}</span>
            </button>
          ))}
        </div>
      </div>
    ));
  };

  const handleSelectSlot = (slotTime: string) => {
    addMessage('user', slotTime);
    setBookingData(prev => ({ ...prev, slot: slotTime }));
    setStep(7);
    setTimeout(() => {
      addMessage('bot', (
        <div>
          <p>{t.stepPrompts.enterDetails}</p>
        </div>
      ));
    }, 400);
  };

  // Step 7: Handle text input details or AI question
  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInputValue('');

    if (step === 7) {
      // User entered details
      addMessage('user', trimmed);
      const parts = trimmed.split(',').map(s => s.trim());
      const pName = parts[0] || trimmed;
      const pAge = parts[1] || '42';
      const pPhone = parts[2] || '9876543210';

      const finalData: BookingData = {
        ...bookingData,
        patientName: pName,
        patientAge: pAge,
        patientPhone: pPhone
      };
      setBookingData(finalData);
      setStep(8);
      setTimeout(() => showStep8Confirmation(finalData), 500);

    } else if (step === 9) {
      addMessage('user', trimmed);
      // Mock checking if patient exists based on name
      const lower = trimmed.toLowerCase();
      const isExisting = lower.includes('ramesh') || lower.includes('existing');
      
      setTimeout(() => {
        setBookingView({ 
          active: true, 
          patientType: isExisting ? 'existing' : 'new', 
          name: trimmed 
        });
      }, 500);

    } else if (step === 1 || step === 2) {
      // Check if user clicked or typed a category or question
      addMessage('user', trimmed);
      const lower = trimmed.toLowerCase();
      if (lower.includes('book') || lower.includes('appointment')) {
        handleStepSelectCategory();
      } else {
        // AI Specialist mock response
        setTimeout(() => {
          addMessage('bot', (
            <div>
              <p>Thank you for asking Asha AI Specialist. For non-healing wounds or diabetic foot concerns, hyperbaric oxygen therapy (HBOT) and specialized vascular assessment are highly recommended. Would you like to book an appointment with our specialist?</p>
              <div className="action-buttons mt-3">
                <button className="btn-primary" onClick={() => handleStepSelectCategory()}>{t.bookAppointment}</button>
              </div>
            </div>
          ));
        }, 600);
      }
    } else {
      addMessage('user', trimmed);
    }
  };

  // Step 8: Show Confirmation Summary Card
  const showStep8Confirmation = (data: BookingData) => {
    addMessage('bot', (
      <div className="confirmation-card">
        <div className="card-header-badge">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <span className="card-title">{t.stepPrompts.confirmationTitle}</span>
        </div>

        <div className="card-body-details">
          <div className="detail-row">
            <User size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Patient:</span>
              <span className="detail-val">{data.patientName || 'Ramesh Kumar'} ({data.patientAge || '45'} yrs)</span>
            </div>
          </div>

          <div className="detail-row">
            <Phone size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Contact:</span>
              <span className="detail-val">{data.patientPhone || '9876543210'}</span>
            </div>
          </div>

          <div className="detail-row">
            <Stethoscope size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Doctor:</span>
              <span className="detail-val">{data.specialist || 'Dr. Ramesh Kumar'}</span>
            </div>
          </div>

          <div className="detail-row">
            <Calendar size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Date & Time:</span>
              <span className="detail-val">{data.slot || 'Tomorrow at 10:30 AM'}</span>
            </div>
          </div>

          <div className="detail-row">
            <MapPin size={15} className="detail-icon" />
            <div>
              <span className="detail-label">Location:</span>
              <span className="detail-val">{t.stepPrompts.clinicAddress}</span>
            </div>
          </div>

          {data.category && (
            <div className="detail-row">
              <FileText size={15} className="detail-icon" />
              <div>
                <span className="detail-label">Category:</span>
                <span className="detail-val">{data.category}</span>
              </div>
            </div>
          )}

          {data.imageUrl && (
            <div className="wound-photo-summary">
              <span className="text-xs font-semibold text-gray-700 block mb-1">Attached Wound Photo:</span>
              <img src={data.imageUrl} alt="Uploaded wound" className="rounded-lg h-24 object-cover border border-emerald-200" />
            </div>
          )}
        </div>

      </div>
    ));
  };

  if (bookingView.active) {
    return (
      <main className="mx-auto flex h-dvh max-w-3xl flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
        <header className="relative mb-3 flex-none text-center sm:mb-4">
          <div className="absolute left-0 top-0">
            <button 
              onClick={() => setBookingView({ active: false })}
              className="flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors border border-emerald-200"
            >
              ← Back to Chat
            </button>
          </div>
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
              name: bookingView.name || '',
              step: 2 
            } as any}
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
                  {msg.actionButtons && (
                    <div className="action-buttons">
                      {msg.actionButtons}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Categories Scroll Track (Translucent Right Arrow Hint) */}
        <div className="suggestion-pills-container">
          <div 
            className="suggestion-pills-wrapper" 
            ref={pillsRef}
            onWheel={handlePillsWheel}
            onMouseDown={handlePillsMouseDown}
            onMouseUp={handlePillsMouseUpOrLeave}
            onMouseLeave={handlePillsMouseUpOrLeave}
            onMouseMove={handlePillsMouseMove}
            style={{ cursor: isDraggingPills ? 'grabbing' : 'grab' }}
          >
            <div className="suggestion-pills-track">
              {t.suggestionPills.map((pillText, idx) => (
                <button 
                  key={idx} 
                  className="pill"
                  onClick={() => {
                    if (pillText.toLowerCase().includes('upload') || pillText.includes('अप्ल') || pillText.includes('అప్‌లోడ్')) {
                      handleStepSelectCategory("Upload an image of your wound");
                    } else {
                      handleStepSelectCategory(pillText);
                    }
                  }}
                >
                  <span>{pillText}</span>
                </button>
              ))}
            </div>
          </div>
          <button 
            className="pills-scroll-right-hint" 
            onClick={scrollPillsRight}
            aria-label="Scroll right"
            title="More options"
          >
            <ChevronsRight size={16} />
          </button>
          
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
              />
            </div>
            <button className="btn-icon btn-mic" aria-label="Use microphone">
              <Mic size={18} />
            </button>
            <button 
              className="btn-icon btn-send" 
              aria-label="Send message"
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
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
