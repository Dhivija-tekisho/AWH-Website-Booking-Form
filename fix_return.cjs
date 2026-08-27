const fs = require('fs');

let content = fs.readFileSync('src/ChatWidget.tsx', 'utf8');

const returnStart1 = content.indexOf('return (\r\n    <div className="h-[100dvh]');
const returnStart2 = content.indexOf('return (\n    <div className="h-[100dvh]');
const returnStart = returnStart1 !== -1 ? returnStart1 : returnStart2;
const chatWidgetStart = content.indexOf('{/* Chat Floating Widget */}');
const floatingButtonsStart = content.indexOf('{/* Floating Action Buttons */}');

if (returnStart !== -1 && chatWidgetStart !== -1 && floatingButtonsStart !== -1) {
  const chatHTML = content.substring(chatWidgetStart, floatingButtonsStart);
  
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

  const newReturn = `  return (
    <div className="awh-widget">
      ${chatHTML}
      ${orbHTML}
    </div>
  );
}
`;

  content = content.substring(0, returnStart) + newReturn;
  fs.writeFileSync('src/ChatWidget.tsx', content);
  console.log("Replaced return block successfully");
} else {
  console.log("Could not find start/end markers");
}
