import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { MessageCircle, Mic, Send, ChevronDown, Upload, CheckCircle2, Calendar, User, Phone, MapPin, Stethoscope, Activity, AlertCircle, Wind, Clock, UserCheck, XCircle } from 'lucide-react';

import './App.css';

// ─── Lightweight Markdown Renderer ──────────────────────────────────────────

/** Parse inline markdown: **bold**, *italic*, `code`, [text](url) */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Combined regex for inline tokens
  const inlineRe = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = inlineRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={keyIdx++} className="bg-emerald-50 text-emerald-800 font-mono text-[12px] px-1.5 py-0.5 rounded border border-emerald-200">{token.slice(1, -1)}</code>);
    } else if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
      parts.push(<strong key={keyIdx++} className="font-semibold text-[#124d3c]">{renderInline(token.slice(2, -2))}</strong>);
    } else if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
      parts.push(<em key={keyIdx++}>{renderInline(token.slice(1, -1))}</em>);
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(<a key={keyIdx++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900 transition-colors">{linkMatch[1]}</a>);
      }
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let i = 0;
  let keyCount = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={keyCount++} className="my-2 p-3 bg-[#0f1c16] rounded-xl overflow-x-auto text-xs font-mono text-emerald-200 border border-emerald-900/40 shadow-inner">
          {lang && <span className="block text-[10px] text-emerald-500 mb-1 uppercase tracking-wider">{lang}</span>}
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // ── Heading H1
    if (/^# /.test(line)) {
      elements.push(<h1 key={keyCount++} className="text-base font-bold text-[#0b382b] mt-3 mb-1 border-b border-emerald-200 pb-1">{renderInline(line.slice(2))}</h1>);
      i++; continue;
    }
    // ── Heading H2
    if (/^## /.test(line)) {
      elements.push(<h2 key={keyCount++} className="text-[13px] font-bold text-[#124d3c] mt-2.5 mb-1">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }
    // ── Heading H3
    if (/^### /.test(line)) {
      elements.push(<h3 key={keyCount++} className="text-[12.5px] font-semibold text-[#124d3c] mt-2 mb-0.5">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }

    // ── Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={keyCount++} className="border-emerald-200/70 my-2" />);
      i++; continue;
    }

    // ── Unordered list block
    if (/^[\-\*\+] /.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^[\-\*\+] /.test(lines[i])) {
        items.push(
          <li key={i} className="flex items-start gap-2 text-[13px] text-[#2d3748] leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>{renderInline(lines[i].replace(/^[\-\*\+] /, ''))}</span>
          </li>
        );
        i++;
      }
      elements.push(<ul key={keyCount++} className="my-1.5 pl-1 space-y-1">{items}</ul>);
      continue;
    }

    // ── Ordered list block
    if (/^\d+[\.\)] /.test(line)) {
      const items: ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+[\.\)] /.test(lines[i])) {
        items.push(
          <li key={i} className="flex items-start gap-2 text-[13px] text-[#2d3748] leading-relaxed">
            <span className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{num++}</span>
            <span>{renderInline(lines[i].replace(/^\d+[\.\)] /, ''))}</span>
          </li>
        );
        i++;
      }
      elements.push(<ol key={keyCount++} className="my-1.5 pl-1 space-y-1.5">{items}</ol>);
      continue;
    }

    // ── Blank line → spacer
    if (line.trim() === '') {
      elements.push(<div key={keyCount++} className="h-1.5" />);
      i++; continue;
    }

    // ── Regular paragraph
    elements.push(
      <p key={keyCount++} className="text-[13.5px] text-[#2d3748] leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}
// ────────────────────────────────────────────────────────────────────────────

type Language = 'en' | 'hi' | 'te';

interface Translations {
  online: string;
  subtitle: string;
  ashaVoice: string;
  welcomeMessage: ReactNode;
  bookAppointment: string;
  specialistDoctors: string;
  woundTreatments: string;
  rescheduleVisit: string;
  cancelVisit: string;
  chatWhatsapp: string;
  inputPlaceholder: string;
  quickPatientDetails: string;
  phonePlaceholder: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  dobGenderTitle: string;
  dobLabel: string;
  genderLabel: string;
  male: string;
  female: string;
  other: string;
  submitDetails: string;
  submitRegistration: string;
  yesCancel: string;
  noKeep: string;
  selectSlotHeader: string;
  confirmedTitle: string;
  cancelledTitle: string;
  rescheduledTitle: string;
  confirmedBadge: string;
  cancelledBadge: string;
  rescheduledBadge: string;
  doctorLabel: string;
  dateTimeLabel: string;
  refIdLabel: string;
  manageAppointmentBtn: string;
  stepPrompts: {
    confirmationTitle: string;
    clinicAddress: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    online: 'Online',
    subtitle: 'Care Companion · always here for you',
    ashaVoice: "Asha's voice",
    welcomeMessage: (
      <div>
        <p>Namaste 🙏 I'm <strong>Asha</strong>, your care companion at KVNN's Advanced Wound Healing Clinics. You can ask me about a wound, our treatments, booking a visit, or anything at all. How can I help you today?</p>
      </div>
    ),
    bookAppointment: 'Book Appointment',
    specialistDoctors: 'Specialist Doctors',
    woundTreatments: 'Wound Care Treatments',
    rescheduleVisit: 'Reschedule Visit',
    cancelVisit: 'Cancel Visit',
    chatWhatsapp: 'Chat on WhatsApp',
    inputPlaceholder: 'Type your message or ask Asha...',
    quickPatientDetails: 'Quick Patient Details',
    phonePlaceholder: 'Phone Number (e.g. 5550000006)',
    namePlaceholder: 'Full Name (optional)',
    emailPlaceholder: 'Email Address (optional)',
    dobGenderTitle: 'Date of Birth & Gender Selection',
    dobLabel: 'Date of Birth',
    genderLabel: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    submitDetails: 'Submit Details',
    submitRegistration: 'Submit Registration Details',
    yesCancel: 'Yes, Cancel Appointment',
    noKeep: 'No, Keep Appointment',
    selectSlotHeader: 'Select Available Time Slot:',
    confirmedTitle: 'Appointment Confirmed!',
    cancelledTitle: 'Appointment Cancelled',
    rescheduledTitle: 'Appointment Rescheduled!',
    confirmedBadge: 'CONFIRMED',
    cancelledBadge: 'CANCELLED',
    rescheduledBadge: 'RESCHEDULED',
    doctorLabel: 'Doctor:',
    dateTimeLabel: 'Date/Time:',
    refIdLabel: 'Reference ID:',
    manageAppointmentBtn: 'Book / Manage Appointment',
    stepPrompts: {
      confirmationTitle: "🎉 Appointment Confirmed!",
      clinicAddress: "AWH Advanced Wound Healing Clinic, Jubilee Hills, Hyderabad",
    }
  },
  hi: {
    online: 'ऑनलाइन',
    subtitle: 'केयर साथी · आपके लिए हमेशा उपलब्ध',
    ashaVoice: 'आशा की आवाज़',
    welcomeMessage: (
      <div>
        <p>नमस्ते 🙏 मैं <strong>आशा</strong> हूँ, KVNN एडवांस्ड वूंड हीलिंग क्लिनिक से आपकी वर्चुअल सहायक। आप मुझसे घाव के इलाज, डॉक्टरों, अपॉइंटमेंट बुकिंग या किसी भी प्रश्न के बारे में पूछ सकते हैं। आज मैं आपकी क्या मदद कर सकती हूँ?</p>
      </div>
    ),
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    specialistDoctors: 'विशेषज्ञ डॉक्टर',
    woundTreatments: 'घाव के इलाज',
    rescheduleVisit: 'अपॉइंटमेंट रीशेड्यूल करें',
    cancelVisit: 'अपॉइंटमेंट रद्द करें',
    chatWhatsapp: 'व्हाट्सएप पर चैट करें',
    inputPlaceholder: 'अपना संदेश लिखें या आशा से पूछें...',
    quickPatientDetails: 'त्वरित रोगी विवरण',
    phonePlaceholder: 'फोन नंबर (जैसे 5550000006)',
    namePlaceholder: 'पूरा नाम (वैकल्पिक)',
    emailPlaceholder: 'ईमेल पता (वैकल्पिक)',
    dobGenderTitle: 'जन्म तिथि एवं लिंग का चयन',
    dobLabel: 'जन्म तिथि',
    genderLabel: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    submitDetails: 'विवरण जमा करें',
    submitRegistration: 'पंजीकरण विवरण जमा करें',
    yesCancel: 'हाँ, अपॉइंटमेंट रद्द करें',
    noKeep: 'नहीं, अपॉइंटमेंट जारी रखें',
    selectSlotHeader: 'उपलब्ध समय स्लॉट चुनें:',
    confirmedTitle: 'अपॉइंटमेंट की पुष्टि हो गई!',
    cancelledTitle: 'अपॉइंटमेंट रद्द कर दिया गया',
    rescheduledTitle: 'अपॉइंटमेंट रीशेड्यूल कर दिया गया!',
    confirmedBadge: 'पुष्टिलाभ',
    cancelledBadge: 'रद्द',
    rescheduledBadge: 'रीशेड्यूल',
    doctorLabel: 'डॉक्टर:',
    dateTimeLabel: 'तिथि/समय:',
    refIdLabel: 'संदर्भ आईडी:',
    manageAppointmentBtn: 'अपॉइंटमेंट बुक/प्रबंधित करें',
    stepPrompts: {
      confirmationTitle: "🎉 अपॉइंटमेंट की पुष्टि हो गई!",
      clinicAddress: "AWH एडवांस्ड वूंड हीलिंग क्लिनिक, जुबली हिल्स, हैदराबाद",
    }
  },
  te: {
    online: 'ఆన్‌లైన్',
    subtitle: 'సంరక్షణ భాగస్వామి · మీకు ఎల్లప్పుడూ ఇక్కడ ఉన్నారు',
    ashaVoice: 'ఆశా వాయిస్',
    welcomeMessage: (
      <div>
        <p>నమస్కారం 🙏 నేను <strong>ఆశా</strong>, KVNN అడ్వాన్స్‌డ్ ఊండ్ హీలింగ్ క్లినిక్స్ నుండి మీ వర్చువల్ అసిస్టెంట్‌ని. మీరు గాయం చికిత్సలు, వైద్యులు, అపాయింట్‌మెంట్ బుకింగ్ లేదా ఏదైనా సమాచారం గురించి నన్ను అడగవచ్చు. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?</p>
      </div>
    ),
    bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    specialistDoctors: 'నిపుణులైన వైద్యులు',
    woundTreatments: 'గాయం చికిత్సలు',
    rescheduleVisit: 'అపాయింట్‌మెంట్ రీషెడ్యూల్ చేయండి',
    cancelVisit: 'అపాయింట్‌మెంట్ రద్దు చేయండి',
    chatWhatsapp: 'వాట్సాప్‌లో చాట్ చేయండి',
    inputPlaceholder: 'మీ సందేశాన్ని టైప్ చేయండి లేదా ఆశాని అడగండి...',
    quickPatientDetails: 'రోగి వివరాలు',
    phonePlaceholder: 'ఫోన్ నంబర్ (ఉదా: 5550000006)',
    namePlaceholder: 'పూర్తి పేరు (ఐచ్ఛికం)',
    emailPlaceholder: 'ఈమెయిల్ చిరునామా (ఐచ్ఛికం)',
    dobGenderTitle: 'పుట్టిన తేదీ మరియు లింగ ఎంపిక',
    dobLabel: 'పుట్టిన తేదీ',
    genderLabel: 'లింగం',
    male: 'పురుషుడు',
    female: 'స్త్రీ',
    other: 'ఇతర',
    submitDetails: 'వివరాలను సమర్పించండి',
    submitRegistration: 'నమోదు వివరాలను సమర్పించండి',
    yesCancel: 'అవును, అపాయింట్‌మెంట్ రద్దు చేయండి',
    noKeep: 'లేదు, అపాయింట్‌మెంట్ కొనసాగించండి',
    selectSlotHeader: 'అందుబాటులో ఉన్న సమయ స్లాట్‌ను ఎంచుకోండి:',
    confirmedTitle: 'అపాయింట్‌మెంట్ ధృవీకరించబడింది!',
    cancelledTitle: 'అపాయింట్‌మెంట్ రద్దు చేయబడింది',
    rescheduledTitle: 'అపాయింట్‌మెంట్ రీషెడ్యూల్ చేయబడింది!',
    confirmedBadge: 'ధృవీకరించబడింది',
    cancelledBadge: 'రద్దు చేయబడింది',
    rescheduledBadge: 'రీషెడ్యూల్ చేయబడింది',
    doctorLabel: 'డాక్టర్:',
    dateTimeLabel: 'తేదీ/సమయం:',
    refIdLabel: 'రెఫరెన్స్ ఐడీ:',
    manageAppointmentBtn: 'అపాయింట్‌మెంట్ బుక్/నిర్వహించండి',
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
  isStreaming?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export interface FormRequest {
  formId: string;
  title: string;
  reason: string;
  fields: FormField[];
}

export interface TurnResult {
  reply: string;
  form: FormRequest | null;
  workflowId: string;
  conversationId: string;
}

function DynamicForm({ form, onSubmit }: { form: FormRequest, onSubmit: (answers: Record<string, string>) => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 w-full">
      <div className="font-semibold text-[#043b2d] text-sm">{form.title}</div>
      <div className="text-xs text-gray-500 mb-1">{form.reason}</div>
      {form.fields.map(f => (
        <div key={f.name} className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">{f.label} {f.required && '*'}</label>
          {f.type === 'select' ? (
             <select 
               required={f.required}
               value={formData[f.name] || ''}
               onChange={e => handleChange(f.name, e.target.value)}
               className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#cca66a] transition-colors"
             >
               <option value="">Select...</option>
               {f.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
             </select>
          ) : (
             <input 
               type={f.type} 
               required={f.required}
               value={formData[f.name] || ''}
               onChange={e => handleChange(f.name, e.target.value)}
               className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#cca66a] transition-colors"
             />
          )}
        </div>
      ))}
      <button type="submit" className="mt-2 w-full bg-[#113227] hover:bg-[#043b2d] text-white py-2 rounded-lg text-sm font-medium transition-colors">
        Submit
      </button>
    </form>
  );
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

interface RichBotMessageProps {
  content: string;
  language: Language;
  onSelectSlot: (slot: string) => void;
  onSubmitRegistration: (name: string, email: string, phone: string, dob: string, gender: string) => void;
  onBookAnother: () => void;
}

const RichBotMessage = ({ content, language, onSelectSlot, onSubmitRegistration, onBookAnother }: RichBotMessageProps) => {
  const t = translations[language];
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const rawSlotMatches = Array.from(content.matchAll(/(\d{1,2}:\d{2}\s*(?:AM|PM)(?:\s*(?:to|-)\s*\d{1,2}:\d{2}\s*(?:AM|PM))?)/gi)).map(m => m[1]);
  const uniqueSlots = Array.from(new Set(rawSlotMatches)).filter(s => s.length >= 6);

  const isConfirmed = /successfully booked|appointment confirmed|पुष्टि|ధృవీకరించబడింది/i.test(content);
  const isCancelled = /successfully cancelled|appointment cancelled|रद्द|రద్దు/i.test(content);
  const isRescheduled = /successfully rescheduled|appointment rescheduled|रीशेड्यूल|రీషెడ్యూల్/i.test(content);

  const refIdMatch = content.match(/(?:Reference ID|Booking ID|ID):\s*([a-zA-Z0-9-]{8,})/i);
  const refId = refIdMatch ? refIdMatch[1] : null;

  const dateMatch = content.match(/(?:on|for)\s+([A-Za-z0-9\s,]+(?:\s+at\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?)/i);
  const dateTimeStr = dateMatch ? dateMatch[1] : null;

  const docMatch = content.match(/(Dr\.\s+[A-Za-z\s]+?)(?=\s+on|\s+has|\s+at|,|\.|$)/i);
  const doctorName = docMatch ? docMatch[1] : null;

  const isAskingRegistration = /full name|share your full name|email address|date of birth|dob|gender/i.test(content) && !isConfirmed && !isCancelled && !isRescheduled && !/confirm/i.test(content) && !/issue|error|try again|sorry/i.test(content);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() && !formEmail.trim() && !formPhone.trim()) return;
    setFormSubmitted(true);
    onSubmitRegistration(formName, formEmail, formPhone, dob, gender);
  };

  // Always strip time-range lines and date-only bullet headers from the displayed markdown.
  // Slots are shown exclusively via the chip grid below — never in raw text.
  const filteredContent = content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      // Remove lines that are purely a time range: "- 09:20 AM - 09:40 AM"
      if (/^[-\u2022*\s]*\d{1,2}:\d{2}\s*(?:AM|PM)/i.test(trimmed)) return false;
      // Remove date-only bullet lines: "• August 7, 2026" / "**August 7, 2026**"
      if (/^[-\u2022*\s]*\*{0,2}(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\*{0,2}\s*$/i.test(trimmed)) return false;
      return true;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return (
    <div className="space-y-2.5">
      <div className="leading-relaxed">
        <MarkdownRenderer text={filteredContent} />
      </div>

      {/* 1. Time Slot Selector Pills */}
      {uniqueSlots.length > 0 && !isConfirmed && !isCancelled && !isRescheduled && (
        <div className="mt-2.5 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl shadow-xs">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-950 mb-2">
            <Clock size={14} className="text-emerald-700 shrink-0" />
            <span>{t.selectSlotHeader}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueSlots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSlot(slot)}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#124d3c] text-[#124d3c] hover:text-white border border-emerald-300 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-white shrink-0"></span>
                <span>{slot}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Patient Registration Form Card */}
      {isAskingRegistration && !formSubmitted && (
        <form onSubmit={handleFormSubmit} className="mt-2.5 p-3.5 bg-gradient-to-br from-white to-emerald-50/60 rounded-xl border border-emerald-200 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[#124d3c] mb-1">
            <UserCheck size={16} className="text-emerald-600" />
            <span>Patient Registration Details</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="E.g. Jane Doe"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +14155552671"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Gender</label>
              <div className="flex gap-1.5">
                {[
                  { key: 'male', label: 'Male' },
                  { key: 'female', label: 'Female' },
                  { key: 'other', label: 'Other' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => setGender(item.key)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      gender === item.key
                        ? 'bg-[#124d3c] text-white border-[#124d3c] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full mt-2 bg-[#124d3c] hover:bg-[#0b382b] text-white py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Submit Registration</span>
            <Send size={12} />
          </button>
        </form>
      )}

      {/* 4. Status Confirmation Card */}
      {(isConfirmed || isCancelled || isRescheduled) && (
        <div className={`mt-2.5 p-3.5 rounded-xl border shadow-xs ${
          isCancelled
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : isRescheduled
            ? 'bg-sky-50/90 border-sky-200 text-sky-950'
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs ${
              isCancelled ? 'bg-amber-500' : isRescheduled ? 'bg-sky-600' : 'bg-emerald-600'
            }`}>
              {isCancelled ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm">
                  {isCancelled ? t.cancelledTitle : isRescheduled ? t.rescheduledTitle : t.confirmedTitle}
                </span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isCancelled ? 'bg-amber-200 text-amber-900' : isRescheduled ? 'bg-sky-200 text-sky-900' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {isCancelled ? t.cancelledBadge : isRescheduled ? t.rescheduledBadge : t.confirmedBadge}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-lg p-2.5 border border-black/5 text-xs space-y-1 my-2">
                {doctorName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">{t.doctorLabel}</span>
                    <span className="font-semibold text-gray-800">{doctorName}</span>
                  </div>
                )}
                {dateTimeStr && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">{t.dateTimeLabel}</span>
                    <span className="font-semibold text-emerald-800">{dateTimeStr}</span>
                  </div>
                )}
                {refId && (
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="text-gray-500 font-medium">{t.refIdLabel}</span>
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-gray-700">{refId}</code>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={onBookAnother}
                  className="text-xs bg-[#124d3c] hover:bg-[#0b382b] text-white px-3 py-1.5 rounded-lg font-medium shadow-xs transition-colors"
                >
                  {t.manageAppointmentBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const conversationIdRef = useRef<string>(generateId());
  const threadIdRef = useRef<string>(generateId());
  const wsRef = useRef<WebSocket | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Manage WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/ai/chat`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected to', wsUrl);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setIsLoading(false);
          addMessage('bot', data.error);
          return;
        }

        if (data.type === 'chunk') {
          setIsLoading(false);
          setMessages(prev => {
            const last = [...prev];
            const lastMsg = last[last.length - 1];
            if (lastMsg && lastMsg.role === 'bot' && lastMsg.isStreaming) {
              last[last.length - 1] = { ...lastMsg, content: (lastMsg.content as string) + data.content };
            } else {
              last.push({ id: Date.now().toString(), role: 'bot', content: data.content, isStreaming: true });
            }
            return last;
          });
          return;
        }

        setIsLoading(false);
        let content: ReactNode = data.reply;
        let actionButtons: ReactNode = undefined;
        
        // Skip empty responses that have no text and no form (tool-call-only turns)
        if (!data.form && (!data.reply || data.reply.toString().trim() === '')) {
          return;
        }

        if (data.form) {
          actionButtons = <DynamicForm form={data.form} onSubmit={handleFormSubmit} />;
        } else if (typeof data.reply === 'string') {
          actionButtons = generateActionButtonsForBotReply(data.reply);
        }

        setMessages(prev => {
          const last = [...prev];
          const lastMsg = last[last.length - 1];
          if (lastMsg && lastMsg.role === 'bot' && lastMsg.isStreaming) {
            // Replace the streaming text with the final response text & form
            last[last.length - 1] = {
              ...lastMsg,
              content,
              actionButtons,
              isStreaming: false
            };
          } else {
            last.push({ id: Date.now().toString(), role: 'bot', content, actionButtons });
          }
          return last;
        });

      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

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
          <button className="btn-whatsapp !bg-[#1da851] !hover:bg-[#158940]" onClick={() => window.open('https://wa.me/1234567890', '_blank')}>
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



  // Helper to generate dynamic hospital-focused action pills OUTSIDE and BELOW the dialogue box
  const generateActionButtonsForBotReply = (replyText: string): ReactNode => {
    const t = translations[language];
    const isConfirmed = /successfully booked|appointment confirmed|पुष्टि|ధృవీకరించబడింది/i.test(replyText);
    const isCancelled = /successfully cancelled|appointment cancelled|रद्द|రద్దు/i.test(replyText);
    const isRescheduled = /successfully rescheduled|appointment rescheduled|रीशेड्यूल|రీషెడ్యూల్/i.test(replyText);

    // Slot selection is handled inside RichBotMessage chip grid — skip here to avoid duplication.

    // 2. Cancellation Confirmation prompt ("Are you sure you would like to cancel...?")
    if (/would like to cancel this appointment|are you sure you want to cancel|रद्द करना चाहते हैं|రద్దు చేయాలనుకుంటున్నారా/i.test(replyText)) {
      return (
        <div className="flex gap-2 flex-wrap mt-1.5">
          <button
            onClick={() => handleSend('Yes, cancel it', true)}
            className="btn-primary !bg-[#8c1d1d] hover:!bg-[#6b1515] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            {t.yesCancel}
          </button>
          <button
            onClick={() => handleSend('No, keep my appointment', true)}
            className="btn-primary !bg-[#113227] hover:!bg-[#043b2d] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            {t.noKeep}
          </button>
        </div>
      );
    }

    // 3. Hospital Care & Patient Service Pills (Clean text in selected language)
    return (
      <div className="flex gap-2 flex-wrap mt-1.5">
        <button
          onClick={() => handleSend(t.bookAppointment, true)}
          className="btn-primary !bg-[#113227] hover:!bg-[#043b2d] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          {t.bookAppointment}
        </button>
        <button
          onClick={() => handleSend(t.specialistDoctors, true)}
          className="btn-primary !bg-[#113227] hover:!bg-[#043b2d] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          {t.specialistDoctors}
        </button>
        <button
          onClick={() => handleSend(t.woundTreatments, true)}
          className="btn-primary !bg-[#113227] hover:!bg-[#043b2d] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          {t.woundTreatments}
        </button>
        <button
          onClick={() => handleSend(t.rescheduleVisit, true)}
          className="btn-primary !bg-[#113227] hover:!bg-[#043b2d] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          {t.rescheduleVisit}
        </button>
        <button
          onClick={() => handleSend(t.cancelVisit, true)}
          className="btn-primary !bg-[#113227] hover:!bg-[#043b2d] !text-white !rounded-full text-xs font-semibold px-4 py-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          {t.cancelVisit}
        </button>
      </div>
    );
  };

  // Step 7: Handle text input details or AI question
  const callLLM = async (userMessage?: string, formAnswers?: Record<string, string>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addMessage('bot', 'Connecting to chat... please try again in a moment.');
      return;
    }
    
    setIsLoading(true);
    setCurrentPills([]);
    
    const payload = {
      organizationId: '30000000-0000-0000-0000-000000000001',
      threadId: threadIdRef.current,
      conversationId: conversationIdRef.current,
      text: userMessage,
      language: language,
      formAnswers: formAnswers,
    };

    wsRef.current.send(JSON.stringify(payload));
  };

  const handleFormSubmit = (answers: Record<string, string>) => {
    addMessage('user', 'Form submitted.');
    callLLM(undefined, answers);
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
        <div className="flex items-center bg-white/15 rounded-full p-1 gap-0.5 border border-white/20 backdrop-blur-sm">
          {(['en', 'te', 'hi'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => selectLanguage(lang)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-all ${
                language === lang
                  ? 'bg-[#d8c28d] text-[#043b2d] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिंदी'}
            </button>
          ))}
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
              <div className="header-actions shrink-0 flex items-center gap-2">
                <div className="flex items-center bg-white/15 rounded-full p-0.5 gap-0 border border-white/20">
                  {(['en', 'te', 'hi'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        language === lang
                          ? 'bg-[#d8c28d] text-[#043b2d] shadow-sm'
                          : 'text-white/75 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? 'EN' : lang === 'te' ? 'తె' : 'हि'}
                    </button>
                  ))}
                </div>
                <button className="header-action-btn mobile-close-btn hover:bg-white/20" onClick={toggleWidget} aria-label="Minimize">
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
                        {msg.role === 'bot' && typeof msg.content === 'string' ? (
                          <RichBotMessage
                            content={msg.content}
                            language={language}
                            onSelectSlot={(slot) => handleSend(slot, true)}
                            onSubmitRegistration={(name, email, phone, dob, gender) => {
                              const detailsStr = [name && `Name: ${name}`, email && `Email: ${email}`, phone && `Phone: ${phone}`, dob && `DOB: ${dob}`, gender && `Gender: ${gender}`].filter(Boolean).join(', ');
                              handleSend(detailsStr, true);
                            }}
                            onBookAnother={() => handleSend(t.bookAppointment, true)}
                          />
                        ) : (
                          msg.content
                        )}
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
                <span className="text-[12px] md:text-[13.5px] text-[#697a72] mr-3 font-medium">{t.ashaVoice}</span>
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
                    placeholder={t.inputPlaceholder}
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
