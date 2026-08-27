const fs = require('fs');
let content = fs.readFileSync('src/ChatWidget.tsx', 'utf8');

// Fix App declaration
content = content.replace(/export default function ChatWidget[\s\S]*?\{/, 'export default function ChatWidget({ botId, apiUrl }: { botId: string; apiUrl?: string }) {');

// Remove extra 'export default App'
content = content.replace(/export default App;/g, '');

// The return block is still wrong. Let's find 'return (\n    <div className="h-[100dvh]'
const startIdx = content.indexOf('return (');
if (startIdx !== -1) {
  // Find where the Chat Widget actually begins (usually around {/* Chat Floating Widget */})
  const widgetStart = content.indexOf('{/* Chat Floating Widget */}');
  
  if (widgetStart !== -1) {
    // The chat widget ends right before {/* Floating Action Buttons */}
    const widgetEnd = content.indexOf('{/* Floating Action Buttons */}');
    
    if (widgetEnd !== -1) {
      const chatWidgetHTML = content.substring(widgetStart, widgetEnd);
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
      
      const newReturn = 'return (\n    <div className="awh-widget">\n      ' + chatWidgetHTML + orbHTML + '\n    </div>\n  );\n}';
      
      // Replace everything from startIdx to the end of the file with the new return block
      content = content.substring(0, startIdx) + newReturn;
    }
  }
}

fs.writeFileSync('src/ChatWidget.tsx', content);
