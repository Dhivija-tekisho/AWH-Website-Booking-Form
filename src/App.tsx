import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { MessageCircle, Mic, Send, Globe, ChevronDown, Upload, CheckCircle2, Calendar, User, Phone, MapPin, Stethoscope, FileText, Activity, AlertCircle, Wind } from 'lucide-react';
import { CLINIC, doctorName, departmentName } from '@/booking';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { LanguageToggle, useLang } from '@/i18n';
import { apiClient } from '@/api/apiClient';
import type { FormRequest } from '@/api/apiClient';
import './App.css';

type Language = 'en' | 'hi' | 'te';

interface Translations {
  online: string;
  subtitle: string;
  welcomeMessage: ReactNode;
  bookAppointment: string;
  askNameIntro: ReactNode;
  askAiQuestion: string;
  aiResponse: string;
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
    manualBookingPrompt: string;
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
        <p>Namaste 🙏 I'm <strong>Asha</strong>, your care companion at KVNN's Advanced Wound Healing Clinics. You can ask me about a wound, our treatments, booking a visit, or anything at all. How can I help you today?</p>
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
    aiResponse: "Thank you for asking Asha AI Specialist. For non-healing wounds or diabetic foot concerns, hyperbaric oxygen therapy (HBOT) and specialized vascular assessment are highly recommended. Would you like to book an appointment with our specialist?",
    suggestionPills: [
      "My wound isn't healing",
      "Diabetic foot care",
      "Told I might lose my leg",
      "What is HBOT?",
      "Book an appointment",
      "Where are you located?"
    ],
    inputPlaceholder: 'Type your question..',
    stepPrompts: {
      selectCategory: "Please select the treatment category that best matches your medical condition:",
      uploadImage: "To help our specialists perform an initial assessment before your consultation, please upload a clear image of the wound (or select an option below):",
      uploadBtn: "📷 Upload Wound Photo",
      skipPhotoBtn: "⏭️ Skip Photo for Now",
      selectStatus: "Please select the current status/condition of the wound:",
      selectSpecialist: "Based on your selected category, here are our available specialists at AWH Clinic. Please select a doctor:",
      selectSlot: "Please select a preferred consultation time slot:",
      enterDetails: "Almost done! Please type the patient's Full Name, Age, and Phone Number (e.g. Ramesh Kumar, 45, 9876543210):",
      manualBookingPrompt: "Please provide the patient's Full Name, Age, and Phone Number (e.g. Ramesh Kumar, 45, 9876543210) to begin booking:",
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
    aiResponse: "आशा AI विशेषज्ञ से पूछने के लिए धन्यवाद। न भरने वाले घावों या डायबिटीज पैर की समस्याओं के लिए, हाइपरबेरिक ऑक्सीजन थेरेपी (HBOT) और संवहनी मूल्यांकन (vascular assessment) की अत्यधिक सिफारिश की जाती है। क्या आप हमारे विशेषज्ञ के साथ अपॉइंटमेंट बुक करना चाहेंगे?",
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
      manualBookingPrompt: "बुकिंग शुरू करने के लिए, कृपया मरीज का पूरा नाम, उम्र और फोन नंबर दें (जैसे: रमेश कुमार, 45, 9876543210):",
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
    aiResponse: "ఆశా AI స్పెషలిస్ట్‌ని అడిగినందుకు ధన్యవాదాలు. మానని గాయాలు లేదా డయాబెటిక్ ఫుట్ సమస్యల కోసం, హైపర్‌బారిక్ ఆక్సిజన్ థెరపీ (HBOT) మరియు వాస్కులర్ మూల్యాంకనం ఎంతగానో సిఫార్సు చేయబడ్డాయి. మీరు మా నిపుణుడితో అపాయింట్‌మెంట్ బుక్ చేసుకోవాలనుకుంటున్నారా?",
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
      manualBookingPrompt: "బుకింగ్ ప్రారంభించడానికి, దయచేసి రోగి పూర్తి పేరు, వయస్సు మరియు ఫోన్ నంబర్‌ను అందించండి (ఉదా: రమేష్ కుమార్, 45, 9876543210):",
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
  const [bookingView, setBookingView] = useState<{ active: boolean; patientType?: 'new' | 'existing'; name?: string }>({ active: false });
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { t: i18nT, setLang: setGlobalLang } = useLang();
  const t = translations[language];


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
                <span className="detail-val">
                  {doctorName(details.doctor.id)}
                  {details.department ? ` (${departmentName(details.department.id)})` : ''}
                </span>
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
    const genUuid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `70000000-0000-4000-8000-${Date.now()}`.padEnd(36, '0');
    conversationIdRef.current = genUuid();
    threadIdRef.current = genUuid();
    setStep(1);
    setCurrentPills(t.suggestionPills);
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
  }, [language]);

  useEffect(() => {
    if (messages.length === 0) {
      setCurrentPills(t.suggestionPills);
    }
  }, [t.suggestionPills, messages.length]);

  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setGlobalLang(lang);
    setIsLangMenuOpen(false);
  };

  const addMessage = (role: Role, content: ReactNode) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content }]);
  };



const DynamicBackendFormCard = ({
  form,
  onSubmit,
}: {
  form: FormRequest;
  onSubmit: (answers: Record<string, string>) => void;
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm mt-2 space-y-3">
      {form.title && <h4 className="font-semibold text-emerald-950 text-sm">{form.title}</h4>}
      {form.reason && <p className="text-xs text-gray-600">{form.reason}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(answers);
        }}
        className="space-y-3"
      >
        {form.fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                className="w-full text-xs p-2 bg-emerald-50/50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={answers[field.name] || ''}
                onChange={(e) => setAnswers({ ...answers, [field.name]: e.target.value })}
                required={field.required}
              >
                <option value="">Select option...</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                className="w-full text-xs p-2 bg-emerald-50/50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder=""
                value={answers[field.name] || ''}
                onChange={(e) => setAnswers({ ...answers, [field.name]: e.target.value })}
                required={field.required}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 px-3 bg-[#113227] hover:bg-[#043b2d] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

  // Step 7: Handle text input details or AI question
  const callLLM = async (userMessage: string) => {
    setIsLoading(true);
    setCurrentPills([]);
    try {
      // Send natural language message directly to AI Orchestration Engine on port 3001 using persistent session IDs
      const aiRes = await apiClient.sendChatMessage(userMessage, conversationIdRef.current, threadIdRef.current);
      if (aiRes && aiRes.response) {
        addMessage('bot', (
          <div>
            <p className="text-sm whitespace-pre-wrap">{aiRes.response}</p>
            {aiRes.form && (
              <DynamicBackendFormCard
                form={aiRes.form}
                onSubmit={async (answers) => {
                  addMessage('user', `Submitted form details`);
                  setIsLoading(true);
                  try {
                    const followUp = await apiClient.sendChatMessage(undefined, conversationIdRef.current, threadIdRef.current, answers);
                    if (followUp && followUp.response) {
                      addMessage('bot', followUp.response);
                    }
                  } catch (err) {
                    console.error('Form submit error:', err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            )}
          </div>
        ));

        if (aiRes.suggestedActions && aiRes.suggestedActions.length > 0) {
          setCurrentPills(aiRes.suggestedActions);
        } else {
          setCurrentPills([
            "Tell me more",
            "What treatments are available?",
            "Book an appointment",
            "Where is the clinic?"
          ]);
        }
      }
    } catch (e) {
      console.error('AI chat endpoint error:', e);
      addMessage('bot', "I'm sorry, I had trouble connecting to the care assistant server. Please ensure the backend server is running on port 3001 or try sending your message again.");
    } finally {
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

  if (bookingView.active) {
    return (
      <main className="mx-auto flex min-h-dvh sm:min-h-[85vh] sm:max-h-[90vh] sm:my-6 max-w-3xl flex-col overflow-y-auto overflow-x-hidden sm:overflow-hidden px-0 py-0 sm:px-6 sm:py-6 bg-white sm:rounded-2xl sm:shadow-2xl sm:border sm:border-emerald/10">
        <header className="relative mb-3 flex-none text-center sm:mb-4 px-3 pt-3 sm:px-0 sm:pt-0">
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
        <div className="min-h-0 flex-1 px-3 pb-3 sm:px-0 sm:pb-0">
          <BookingWizard
            initialOverrides={{
              patientType: bookingView.patientType,
              name: bookingView.name || '',
              step: bookingView.patientType === 'new' ? 2 : 1,
              openVerifyOnMount: bookingView.patientType === 'existing',
            }}
            onBookingComplete={handleBookingComplete}
          />
        </div>
      </main>
    );
  }

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
