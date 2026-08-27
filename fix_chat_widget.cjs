const fs = require('fs');
let content = fs.readFileSync('src/ChatWidget.tsx', 'utf8');

// Fix imports
content = content.replace(/import \{ MessageCircle, Send.*?\} from 'lucide-react';/, "import { Send, Globe, ChevronDown, ChevronLeft, ChevronRight, Upload, CheckCircle2, Calendar, User, MapPin, Stethoscope, Activity, AlertCircle, Wind, X } from 'lucide-react';");

// Fix App declaration
content = content.replace('function App() {', 'export default function ChatWidget({ botId, apiUrl }: { botId: string; apiUrl?: string }) {');

// Fix env vars
content = content.replace('const botId = import.meta.env.VITE_BOT_ID;', 'const botIdStr = botId; if (!botIdStr) return null;');
content = content.replace('const baseUrl = import.meta.env.VITE_AI_ORCHESTRATION_URL || \'http://localhost:3001\';', 'const baseUrl = apiUrl || \'http://localhost:3001\';');
content = content.replace(/\/ws\/chatbot\/\`\$\{botId\}/, '/ws/chatbot/`${botIdStr}');

// Remove unused language selection method from App
content = content.replace(/const selectLanguage = \(lang: Language\) => \{[\s\S]*?\};\n/, '');

// Replace the return block entirely. We find the start of return (
const returnIndex = content.indexOf('return (\n    <div className="h-[100dvh]');
if (returnIndex !== -1) {
  const chatWidgetStart = content.indexOf('{/* Chat Floating Widget */}');
  const chatWidgetEnd = content.indexOf('{/* Floating Action Buttons */}');
  const chatWidgetHTML = content.substring(chatWidgetStart, chatWidgetEnd);
  
  const orbHTML = `
      {/* Floating Action Button (Orb) */}
      <div className={\`fixed bottom-4 md:bottom-8 right-4 md:right-8 flex-col gap-3 md:gap-4 z-[999999] \${isOpen ? 'hidden' : 'flex'}\`}>
        <button
          className="w-[52px] h-[52px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-[#fcfaf5] bg-gradient-to-br from-[#f6e8cc] to-[#d1b886] flex items-center justify-center hover:scale-105 transition-transform"
          onClick={() => setIsOpen(true)}
          title="Talk to Asha"
        >
          <div className="w-[26px] h-[26px] rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_0_6px_rgba(255,255,255,0.8)] bg-[radial-gradient(circle_at_35%_35%,#fff_0%,#f4dca6_35%,#c8a165_70%,#4a866d_100%)]"></div>
        </button>
      </div>
  `;

  content = content.substring(0, returnIndex) + 'return (\n    <div className="awh-widget">\n      ' + chatWidgetHTML + orbHTML + '\n    </div>\n  );\n}\n';
}

fs.writeFileSync('src/ChatWidget.tsx', content);
