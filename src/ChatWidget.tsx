import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Send, Globe, ChevronDown, ChevronLeft, ChevronRight, Upload, CheckCircle2, Calendar, User, MapPin, Stethoscope, Activity, AlertCircle, Wind, X } from 'lucide-react';

import './App.css';

function RegistrationForm({ onSubmit }: { onSubmit: (data: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    state: '',
    city: '',
    concern: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const str = `Name: ${formData.name}, Email: ${formData.email}, Phone: ${formData.phone}, DOB: ${formData.dob}, Gender: ${formData.gender}, State: ${formData.state}, City: ${formData.city}, Concern: ${formData.concern}`;
    setSubmitted(true);
    onSubmit(str);
  };

  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[12px] p-4 mt-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-[700px] max-w-[100%]">
      <h3 className="font-semibold text-[#043b2d] text-[15px] mb-1 sm:col-span-3">Patient Details</h3>
      <input required type="text" placeholder="Full Name" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input required type="email" placeholder="Email Address" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      <input required type="tel" placeholder="Phone Number (e.g. +1234567890)" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      <input required type="date" placeholder="Date of Birth" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] text-gray-700 outline-none focus:border-[#cca66a]" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
      
      <select required className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] text-gray-700 outline-none focus:border-[#cca66a]" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
        <option value="" disabled>Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input required type="text" placeholder="State (e.g. Telangana)" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
      <input required type="text" placeholder="City" className="border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a]" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
      
      <textarea required placeholder="Main health concern (e.g., wound on my leg)" className="sm:col-span-3 border border-gray-200 rounded-[8px] p-2.5 text-[14px] outline-none focus:border-[#cca66a] resize-none" rows={2} value={formData.concern} onChange={e => setFormData({...formData, concern: e.target.value})} />
      <button type="submit" className="sm:col-span-3 bg-[#cca66a] text-white py-2.5 rounded-[8px] text-[14px] font-bold hover:bg-[#b5925a] transition-colors mt-1">Submit Details</button>
    </form>
  );
}

function parseOptionDate(opt: string) {
  const parts = stripAvailabilityIdMarker(opt).split(', ');
  if (parts.length < 3) return null;
  const datePart = parts[1]; // "25 Aug"
  const [day, monthStr] = datePart.split(' ');
  // Handle both "Sep" and "Sept"
  const cleanMonthStr = monthStr === 'Sept' ? 'Sep' : monthStr;
  const monthIdx = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(cleanMonthStr);
  
  if (monthIdx === -1) return null;

  const now = new Date();
  let year = now.getFullYear();
  if (monthIdx < now.getMonth() - 1) { 
    year++;
  }
  return new Date(year, monthIdx, parseInt(day));
}

type CalendarOption = {
  displayText: string;
  submitText: string;
};

const AVAILABILITY_ID_MARKER_RE = /\s*\[?availabilityId\s*[:=]\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]?\s*/i;

function extractAvailabilityId(opt: string): string | undefined {
  return opt.match(AVAILABILITY_ID_MARKER_RE)?.[1];
}

function stripAvailabilityIdMarker(opt: string): string {
  return opt.replace(AVAILABILITY_ID_MARKER_RE, '').trim();
}

function parseOptionTime(d: Date, timeStr: string): Date {
  const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!match) return d;
  const [_, h, m, ampm] = match;
  let hours = parseInt(h, 10);
  if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
  if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, parseInt(m, 10), 0);
}

function CalendarSlotPicker({ options, onSelect }: { options: CalendarOption[], onSelect: (submitText: string, displayText: string) => void }) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const parsedSlots: { dateObj: Date, dateKey: string, timeStr: string, displayText: string, submitText: string }[] = [];
  
  const now = new Date();

  options.forEach(opt => {
    const displayText = stripAvailabilityIdMarker(opt.displayText);
    const d = parseOptionDate(displayText);
    if (d) {
      const timeStr = displayText.split(', ').slice(2).join(', ');
      const fullDateTime = parseOptionTime(d, timeStr);
      
      // Filter out slots that have already passed
      if (fullDateTime < now) return;

      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      parsedSlots.push({ dateObj: d, dateKey, timeStr, displayText, submitText: opt.submitText });
    }
  });

  const slotsByDate: Record<string, typeof parsedSlots> = {};
  parsedSlots.forEach(s => {
    if (!slotsByDate[s.dateKey]) slotsByDate[s.dateKey] = [];
    slotsByDate[s.dateKey].push(s);
  });

  useEffect(() => {
    if (!selectedDateStr && parsedSlots.length > 0) {
      const sorted = [...parsedSlots].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
      setSelectedDateStr(sorted[0].dateKey);
      setCurrentMonth(new Date(sorted[0].dateObj.getFullYear(), sorted[0].dateObj.getMonth(), 1));
    }
  }, [parsedSlots, selectedDateStr]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const selectedDateSlots = selectedDateStr ? (slotsByDate[selectedDateStr] || []) : [];
  
  let selectedDateDisplay = '';
  if (selectedDateStr) {
    const [y, m, d] = selectedDateStr.split('-');
    const dObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    selectedDateDisplay = `${weekdays[dObj.getDay()]}, ${dObj.getDate()} ${monthNames[dObj.getMonth()]}`;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[12px] p-0 mt-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] w-full sm:w-[700px] max-w-[100%] flex flex-col sm:flex-row overflow-hidden">
      
      {/* Left Panel: Calendar */}
      <div className="flex-1 p-5 border-b sm:border-b-0 sm:border-r border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[17px] font-bold text-[#043b2d]">
            {monthNames[month]} <span className="text-gray-400 font-normal">{year}</span>
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
            <div key={d} className="text-[11px] font-bold text-gray-400 tracking-wider py-1">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="p-2"></div>;
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasSlots = !!slotsByDate[dateKey];
            const isSelected = selectedDateStr === dateKey;
            
            return (
              <button
                key={idx}
                disabled={!hasSlots}
                onClick={() => setSelectedDateStr(dateKey)}
                className={`w-full aspect-square flex items-center justify-center rounded-[6px] text-[14px] font-medium transition-colors
                  ${isSelected ? 'bg-[#043b2d] text-white shadow-sm' : ''}
                  ${!isSelected && hasSlots ? 'bg-[#f4f7f5] text-gray-800 hover:bg-[#e2e8e4]' : ''}
                  ${!hasSlots ? 'text-gray-300 cursor-default' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Time Slots */}
      <div className="w-full sm:w-[280px] p-5 bg-[#fafbfb]">
        {selectedDateStr ? (
          <>
            <h3 className="font-semibold text-gray-700 text-[14px] mb-4 pb-3 border-b border-gray-200">
              {selectedDateDisplay}
            </h3>
            
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
              {selectedDateSlots.length > 0 ? (
                selectedDateSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(slot.submitText, slot.displayText)}
                    className="w-full py-2.5 px-4 text-[13.5px] font-bold text-[#043b2d] bg-white border border-gray-200 rounded-[6px] hover:border-[#cca66a] hover:text-[#cca66a] hover:shadow-[0_2px_8px_rgba(204,166,106,0.15)] transition-all text-center"
                  >
                    {slot.timeStr}
                  </button>
                ))
              ) : (
                <div className="text-[13px] text-gray-400 text-center py-8">
                  No availability on this date
                </div>
              )}
            </div>
          </>
        ) : (
           <div className="text-[13px] text-gray-400 text-center py-10 h-full flex items-center justify-center">
             Select a date to view times
           </div>
        )}
      </div>

    </div>
  );
}

function BookingDetailsCard({ title, isSuccess, referenceId, doctor, when, packageName, oldTime }: { title: string, isSuccess: boolean, referenceId?: string, doctor?: string, when?: string, packageName?: string, oldTime?: string }) {
  return (
    <div className={`bg-white border ${isSuccess ? 'border-[#1da851]/40' : 'border-[#cca66a]/40'} rounded-[16px] p-4 my-2 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col gap-4 w-full sm:w-[340px]`}>
      <div className="flex items-center gap-2.5 text-[#043b2d]">
        {isSuccess ? <CheckCircle2 size={22} className="text-[#1da851]" /> : <Calendar size={22} className="text-[#cca66a]" />}
        <h3 className="font-bold text-[15px]">{title}</h3>
      </div>
      
      <div className="flex flex-col gap-3.5 text-[13.5px] text-gray-700 bg-gray-50/50 p-3 rounded-[12px] border border-gray-100">
        {referenceId && (
          <div className="flex flex-col mb-1">
            <span className="text-[11px] font-bold text-[#cca66a] uppercase tracking-wider mb-0.5">Patient ID</span>
            <span className="font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 w-fit">{referenceId}</span>
          </div>
        )}
        
        {packageName && (
          <div className="flex items-start gap-3">
            <Activity size={16} className="text-[#cca66a] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Service</span>
              <span className="font-medium leading-snug">{packageName}</span>
            </div>
          </div>
        )}
        
        {doctor && (
          <div className="flex items-start gap-3">
            <User size={16} className="text-[#cca66a] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Doctor</span>
              <span className="font-medium leading-snug">{doctor}</span>
            </div>
          </div>
        )}
        
        {oldTime && (
          <div className="flex items-start gap-3 opacity-60">
            <Calendar size={16} className="text-gray-400 shrink-0 mt-0.5 line-through" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Old Time</span>
              <span className="font-medium leading-snug line-through">{oldTime}</span>
            </div>
          </div>
        )}
        
        {when && (
          <div className="flex items-start gap-3">
            <Calendar size={16} className={isSuccess ? "text-[#1da851] shrink-0 mt-0.5" : "text-[#cca66a] shrink-0 mt-0.5"} />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{oldTime ? "New Time" : "Time"}</span>
              <span className="font-bold leading-snug text-[#043b2d]">{when}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectionOptionCard({ when, onClick }: { when?: string, onClick?: () => void }) {
  let datePart = when || '';
  let timePart = '';
  
  if (when) {
    const parts = when.split(',');
    if (parts.length >= 3) {
      timePart = parts.pop()?.trim() || '';
      datePart = parts.join(',').trim();
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-[#1da851] rounded-full p-2 my-1.5 shadow-sm flex items-center gap-3 w-max cursor-pointer hover:shadow-md hover:bg-[#f8fbf9] transition-all pr-5"
    >
      <div className="flex-shrink-0 bg-[#e6f4ea] rounded-full w-9 h-9 flex items-center justify-center ml-0.5">
        <Calendar size={18} className="text-[#1da851]" />
      </div>
      <div className="w-[1.5px] h-5 bg-gray-200 mx-0.5"></div>
      <div className="flex items-center">
        <span className="font-bold text-[#113227] text-[15px]">{datePart}</span>
        {timePart && (
          <>
            <span className="text-[#1da851] font-bold mx-2 text-[15px]">•</span>
            <span className="font-bold text-[#1da851] text-[15px]">{timePart}</span>
          </>
        )}
      </div>
    </div>
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
      <div className="text-[10px]" style={{ fontSize: '10px', lineHeight: '1.4' }}>
        <p style={{ fontSize: '10px' }}>Namaste 🙏 I'm <strong>Asha</strong>, your care companion at KVNN's Advanced Wound Healing Clinics. You can ask me about a wound, our treatments, booking a visit, or anything at all. How can I help you today?</p>
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
  customContent?: ReactNode;
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

export default function ChatWidget({ botId, apiUrl }: { botId: string; apiUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');

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
    const botIdStr = botId;
    const baseUrl = apiUrl || 'http://localhost:3001';
    const wsBase = baseUrl.replace(/^http/, 'ws');
    
    const url = `${wsBase}/ws/chatbot/${botIdStr}?threadId=${encodeURIComponent(threadIdRef.current)}`;
    console.log(url)
    const ws = new WebSocket(url);
    
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.type === 'ready') {
           setIsLoading(false);
        } else if (d.type === 'assistant_message') {
           const text = d.text || '';
           const isRegistrationPrompt = text.toLowerCase().includes('what is your full name') || text.toLowerCase().includes('what is their full name');
           const isSlotPrompt = text.toLowerCase().includes('available slots');
           const isAppointmentSelection = text.match(/which one would you like to (cancel|reschedule)/i);
           let actionButtons: ReactNode = undefined;
           let customContent: ReactNode = undefined;
           
           if (isRegistrationPrompt) {
             actionButtons = <RegistrationForm onSubmit={(data) => {
               handleSend(data, false);
             }} />;
           }

           // Extract numbered options from the text, optionally matching a follow-up "Treatment:" line
           let displayText = text;
           const allOptions = [...text.matchAll(/(?:^|\n)\s*(\d+\.)\s+([^\n]+)(?:\n\s*(?:📋\s*)?Treatment:\s*([^\n]+))?/gi)];
           const options: string[] = [];
           const slotOptions: CalendarOption[] = [];
           const appointmentOptions: { num: string, val: string, treatment?: string }[] = [];
           
           for (const match of allOptions) {
             const optionNumber = match[1].trim();
             const val = match[2].trim();
             const treatment = match[3]?.trim();
             
             if (isAppointmentSelection || val.match(/(?:✅|🔄|📅)/) || val.match(/—\s*Consultation/i)) {
               appointmentOptions.push({ num: optionNumber, val, treatment });
               displayText = displayText.replace(match[0], '');
               continue;
             }
             
             // Skip details like "**Date:** value" so they don't become pills
             if (!/^\*\*.*?\*\*:/.test(val) && !val.includes('**Date:**') && !val.includes('**Time:**')) {
               options.push(val);
               const availabilityId = extractAvailabilityId(val);
               const cleanVal = stripAvailabilityIdMarker(val);
               slotOptions.push({
                 displayText: cleanVal,
                 submitText: `${optionNumber} ${cleanVal}${availabilityId ? ` availabilityId:${availabilityId}` : ''}`,
               });
               // Remove only the matched pill line
               displayText = displayText.replace(match[0], '');
             }
           }
           
           // Check for Yes/No confirmation prompts
           const yesNoRegex = /(?:please\s+)?reply\s+\*?yes\*?\s+.*?or\s+\*?no\*?\s+.*?(?:\.|$)/i;
           const yesNoMatch = text.match(yesNoRegex);
           if (yesNoMatch) {
             options.push('Yes', 'No');
             displayText = displayText.replace(yesNoRegex, '');
           }

           // Check for Verify prompt
           const verifyRegex = /(?:please\s+)?say\s+["'*]?verify["'*]?.*?(?:\.|$)/i;
           const verifyMatch = text.match(verifyRegex);
           if (verifyMatch) {
             options.push('Verify');
             displayText = displayText.replace(verifyRegex, '');
           }

           // Check for identity verified to show quick actions
           if (/identity has been verified/i.test(text)) {
             options.push('Cancel Appointment');
           }

           if (options.length > 0 || appointmentOptions.length > 0) {
             if (appointmentOptions.length > 0) {
               customContent = (
                 <div className="flex flex-col gap-2 w-full mt-2">
                   {appointmentOptions.map((opt, i) => {
                     const timeMatch = opt.val.match(/(?:✅|🔄|📅)?\s*\*?([A-Za-z0-9,\s:]+(?:am|pm))\*?/i);
                     
                     const when = timeMatch ? timeMatch[1].trim() : opt.val.replace(/(?:✅|🔄|📅|—.*)/g, '').trim();
                     
                     return (
                       <SelectionOptionCard 
                         key={i}
                         when={when}
                         onClick={() => handleSend(opt.num, false, opt.val)}
                       />
                     );
                   })}
                 </div>
               );
             } else if (isSlotPrompt) {
               actionButtons = <CalendarSlotPicker options={slotOptions} onSelect={(submitText, cleanText) => {
                 handleSend(submitText, false, cleanText);
               }} />;
             } else {
               setCurrentPills(options);
             }
             
             // Remove redundant "reply with..." instructions
             displayText = displayText.replace(/Reply with the number.*/gi, '');
             displayText = displayText.replace(/Which one would you like to (cancel|reschedule)\?.*/gi, '');
             displayText = displayText.replace(/Please reply with a number.*/gi, '');
           }
             
           // Clean up excess newlines
           displayText = displayText.replace(/\n{3,}/g, '\n\n').trim();

           // Check for booking details (either prompt, confirmation, or listing)
           const isConfirmationMatch = text.match(/(?:Your )?appointment (is confirmed|has been rescheduled)/i);
           const isConfirmation = !!isConfirmationMatch;
           const isRescheduled = isConfirmationMatch ? isConfirmationMatch[1].toLowerCase().includes('rescheduled') : false;
           const isPrompt = text.match(/Please confirm (?:your booking|rescheduling)/i);
           const isList = text.match(/upcoming appointment|here are the details|recent appointments/i);
           
           if (isList && !isConfirmation && !isPrompt) {
             const listMatches = [...text.matchAll(/(?:✅|🔄|📅)\s*\*([^*]+)\*(?:\s*with (Dr\.\s+[A-Za-z\s]+))?(?:\s*\*\(for ([^)]+)\)\*)?\n\s*📋 Treatment:\s*([^\n]+)/gi)];
             if (listMatches.length > 0) {
               customContent = (
                 <div className="flex flex-col gap-2 w-full mt-2">
                   {listMatches.map((m, i) => (
                     <BookingDetailsCard 
                       key={i}
                       title="Upcoming Appointment"
                       isSuccess={true}
                       when={m[1].trim()}
                       doctor={m[2] ? m[2].trim() : ''}
                       packageName={m[4] ? m[4].trim() : ''}
                       // Reuse the referenceId field to show who it is for if it's a family booking
                       referenceId={m[3] ? `For: ${m[3].trim()}` : undefined} 
                     />
                   ))}
                 </div>
               );
               // Strip the matched list items
               displayText = displayText.replace(/(?:✅|🔄|📅)\s*\*([^*]+)\*(?:\s*with Dr\.\s+[A-Za-z\s]+)?(?:\s*\*\(for [^)]+\)\*)?\n\s*📋 Treatment:\s*[^\n]+/gi, '');
               // Clean up prefix
               displayText = displayText.replace(/Here are your (upcoming|recent) appointments:/i, '');
               displayText = displayText.replace(/\n{2,}/g, '\n').trim();
             }
           } else if (isConfirmation || isPrompt) {
             const referenceMatch = text.match(/Reference ID:\s*([^\n]+)/i);
             const doctorMatch = text.match(/Doctor:\s*([^\n]+)/i) || text.match(/Dr\.\s+([A-Za-z\s]+)/i);
             const whenMatch = text.match(/When:\s*([^\n]+)/i) || text.match(/\*\*Date:\*\*\s*([^\n]+)/i);
             const timeMatch = text.match(/\*\*Time:\*\*\s*([^\n]+)/i);
             const packageMatch = text.match(/Package:\s*([^\n]+)/i);
             const oldTimeMatch = text.match(/Old time:\s*([^\n]+)/i);
             const newTimeMatch = text.match(/New time:\s*([^\n]+)/i);
             const appointmentMatch = text.match(/Appointment:\s*([^\n]+)/i) || text.match(/for a (consultation|check-up)/i);
             
             if (doctorMatch || whenMatch || oldTimeMatch || newTimeMatch) {
               const title = isConfirmation ? (isRescheduled ? "Appointment Rescheduled!" : "Appointment Confirmed!") : "Please confirm details:";
               
               const actualDoctor = doctorMatch ? (doctorMatch[0].startsWith('Dr.') ? doctorMatch[0].trim() : doctorMatch[1].trim()) : '';
               let actualWhen = whenMatch ? whenMatch[1].trim() : (newTimeMatch ? newTimeMatch[1].trim() : '');
               if (timeMatch && actualWhen) {
                 actualWhen = `${actualWhen} at ${timeMatch[1].trim()}`;
               }
               const actualPackage = packageMatch ? packageMatch[1].trim() : (appointmentMatch ? appointmentMatch[1].trim() : '');
               const actualOldTime = oldTimeMatch ? oldTimeMatch[1].trim() : '';
               
               customContent = <BookingDetailsCard 
                 title={title}
                 isSuccess={!!isConfirmation}
                 referenceId={referenceMatch ? referenceMatch[1].trim() : undefined} 
                 doctor={actualDoctor} 
                 when={actualWhen} 
                 packageName={actualPackage} 
                 oldTime={actualOldTime}
               />;
               
               // Strip from display text
               displayText = displayText.replace(/(?:Your )?appointment is confirmed!/i, '');
               displayText = displayText.replace(/Please confirm (?:your booking|rescheduling):/i, '');
               displayText = displayText.replace(/Reference ID:.*/i, '');
               displayText = displayText.replace(/Doctor:.*/i, '');
               displayText = displayText.replace(/When:.*/i, '');
               displayText = displayText.replace(/Package:.*/i, '');
               displayText = displayText.replace(/Appointment:.*/i, '');
               displayText = displayText.replace(/Old time:.*/i, '');
               displayText = displayText.replace(/New time:.*/i, '');
               displayText = displayText.replace(/(?:- )?\*\*Date:\*\*.*\n?/i, '');
               displayText = displayText.replace(/(?:- )?\*\*Time:\*\*.*\n?/i, '');
               
               // Re-cleanup empty newlines left behind
               displayText = displayText.replace(/\n{2,}/g, '\n').trim();
             }
           }

           if (displayText || actionButtons || customContent) {
             const formattedText = displayText ? <div className="whitespace-pre-wrap leading-relaxed">{displayText}</div> : null;
             addMessage('bot', formattedText, actionButtons, customContent);
           }
           setIsLoading(false);
        } else if (d.type === 'form_request') {
           const prompt = d.form?.prompt || 'Please provide some information.';
           addMessage('bot', prompt);
           setIsLoading(false);
        } else if (d.type === 'error') {
           console.error('Chat error from server:', d.content);
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
          <button className="btn-whatsapp !bg-[#1da851] !hover:bg-[#158940] flex items-center justify-center gap-1.2" onClick={() => window.open('https://wa.me/1234567890', '_blank')}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
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

  // const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);


  const addMessage = (role: Role, content: ReactNode, actionButtons?: ReactNode, customContent?: ReactNode) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content, customContent, actionButtons }]);
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

  const handleSend = (text: string, _isFromPill: boolean = false, displayText?: string) => {
    if (!text.trim()) return;

    addMessage('user', displayText ?? text);
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
    <div className="awh-widget">
      {/* Chat Floating Widget */}
        <div className={`fixed bottom-0 right-0 md:bottom-[20px] md:right-[22px] w-full h-[100dvh] md:w-[550px] md:h-[420px] max-w-full md:max-h-[calc(100vh-48px)] z-[100] transition-all duration-500 ease-in-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="relative bg-[#eff2f0] rounded-none md:rounded-[24px] border-none md:border-[1.5px] border-white/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:shadow-[0_20px_50px_-12px_rgba(46,150,107,0.25),0_0_15px_rgba(255,255,255,0.6)] w-full h-full flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="chat-header !rounded-t-[24px] !py-[12px] !px-[16px] !min-h-[70px]">
              <div className="chat-header-content flex-1 min-w-0 mr-2 md:mr-0">
                <div className="header-avatar-orbit scale-75 origin-left shrink-0">
                  <div className="header-avatar-orb"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="header-title font-bold" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                    <span className="text-[18px]">Asha</span>
                  </span>
                  <span className="font-medium text-[#cca66a] mt-0.5 leading-snug line-clamp-2 sm:line-clamp-1" style={{ fontSize: '8px' }}>{translations[language].subtitle}</span>
                </div>
              </div>
              <div className="header-actions shrink-0">
                <div className="relative group">
                  <button
                    className="status-ready !bg-white/10 !border-white/20 !rounded-full text-[10px] flex items-center hover:!bg-white/20 cursor-pointer transition-colors"
                    aria-label="Select language"
                  >
                    <Globe size={12} className="text-[#cca66a]" />
                    <span>{languageLabels[language]}</span>
                    <ChevronDown size={10} className="opacity-70" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-24 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2 text-[10px] hover:bg-gray-50 ${language === 'en' ? 'font-bold text-[#043b2d]' : 'text-gray-700'}`}>English</button>
                    <button onClick={() => setLanguage('hi')} className={`w-full text-left px-4 py-2 text-[10px] hover:bg-gray-50 ${language === 'hi' ? 'font-bold text-[#043b2d]' : 'text-gray-700'}`}>हिंदी</button>
                    <button onClick={() => setLanguage('te')} className={`w-full text-left px-4 py-2 text-[10px] hover:bg-gray-50 ${language === 'te' ? 'font-bold text-[#043b2d]' : 'text-gray-700'}`}>తెలుగు</button>
                  </div>
                </div>
                <button className="header-action-btn ml-1 hover:bg-white/20" onClick={() => setIsOpen(false)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="chat-body chat-scroll flex-1 min-h-0 bg-[#ebf0ec]" ref={chatBodyRef}>
              <div className="chat-messages pt-[4px] px-[16px]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-group ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'bot' && (
                      <div className="message-avatar shadow-sm">
                        A
                      </div>
                    )}
                    <div className={`message-content max-w-[92%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      {msg.content && (
                        <div className={`message-bubble shadow-sm border border-black/5 text-[#2d3748] ${msg.role === 'user' ? '!bg-[#124d3c] !text-white !rounded-tl-[18px] !rounded-tr-[12px] !rounded-bl-[16px] !rounded-br-[2px]' : '!bg-white'}`}>
                          {msg.content}
                        </div>
                      )}
                      {msg.customContent && (
                        <div className="mt-1">
                          {msg.customContent}
                        </div>
                      )}
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
              {currentPills.length > 0 && (
                <div className="suggestion-pills-container w-full shrink-0 px-[16px] md:px-[30px] pt-4 pb-[16px] flex justify-center mt-2">
                  {/* Drawer-style Container */}
                  <div className="w-full max-w-[400px] mx-auto bg-gradient-to-b from-[#e3ece7]/95 to-[#d6e2dc]/95 backdrop-blur-md rounded-2xl p-3 pt-2.5 shadow-sm border border-white/50 relative z-10">
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
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="chat-footer bg-white border-t border-gray-100 flex-shrink-0">
              {/* 
              <div className="flex justify-end items-center px-[16px] pt-1 pb-1">
                <span className="text-[12px] text-[#697a72] mr-3 font-medium">Asha's voice</span>
                <label className="voice-switch relative inline-block w-[40px] h-[22px]">
                  <input type="checkbox" className="opacity-0 w-0 h-0" checked={isVoiceEnabled} onChange={toggleVoice} />
                  <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${isVoiceEnabled ? 'bg-[#043b2d]' : 'bg-[#e2e8e4]'}`}></span>
                  <span className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] bg-white rounded-full transition-transform shadow-sm ${isVoiceEnabled ? 'translate-x-[18px]' : ''}`}></span>
                </label>
              </div>
              */}
              <div className="flex items-center gap-2 px-[10px] pt-0 pb-2">
                <div className="flex-1 bg-[#e6ebe7] rounded-full px-3 py-1.5 flex items-center border border-[#dce4df] focus-within:border-[#4a866d] focus-within:bg-white transition-colors shadow-sm">
                  <input
                    type="text"
                    className="w-full bg-transparent border-none outline-none text-[12px] text-gray-800 placeholder-gray-500"
                    placeholder=""
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && handleSend(inputValue, false)}
                  />
                </div>
                {/*
                <button className="w-[44px] h-[44px] rounded-full bg-[#cca66a] text-white flex items-center justify-center hover:bg-[#b5925a] transition-colors shrink-0 shadow-sm" aria-label="Use microphone">
                  <Mic size={22} />
                </button>
                */}
                <button
                  className="w-[34px] h-[34px] rounded-full bg-[#043b2d] text-white flex items-center justify-center hover:bg-[#032e23] transition-colors shrink-0 shadow-sm"
                  aria-label="Send message"
                  onClick={() => inputValue.trim() && handleSend(inputValue, false)}
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      
      
      {/* Floating Action Button (Orb) */}
      <div className={`fixed bottom-4 md:bottom-8 right-4 md:right-8 flex-col gap-3 md:gap-4 z-[999999] ${isOpen ? 'hidden' : 'flex'}`}>
        <button
          className="w-[52px] h-[52px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-[#fcfaf5] bg-gradient-to-br from-[#f6e8cc] to-[#d1b886] flex items-center justify-center hover:scale-105 transition-transform"
          onClick={() => setIsOpen(true)}
          title="Talk to Asha"
        >
          <div className="w-[26px] h-[26px] rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_0_6px_rgba(255,255,255,0.8)] bg-[radial-gradient(circle_at_35%_35%,#fff_0%,#f4dca6_35%,#c8a165_70%,#4a866d_100%)]"></div>
        </button>
      </div>
  
    </div>
  );
}

