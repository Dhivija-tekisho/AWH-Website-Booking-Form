const fs = require('fs');
let data = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `function SelectionOptionCard({ title, when, onClick }: { title: string, when?: string, onClick?: () => void }) {
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
}`;

data = data.replace(/function SelectionOptionCard[\s\S]*?\}\n/, replacement + '\n');
fs.writeFileSync('src/App.tsx', data);
