const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const startString = 'if (isList && !isConfirmation && !isPrompt) {';
const endString = '} else if (isConfirmation || isPrompt) {';
const startIndex = code.indexOf(startString);
const endIndex = code.indexOf(endString, startIndex);
if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find start or end index.");
  process.exit(1);
}

const replacement = `            if (isList && !isConfirmation && !isPrompt) {
              const listMatches = [...text.matchAll(/(?:(\\d+)\\.\\s*)?(?:✅|🔄|📅)\\s*\\*([^*]+)\\*(?:\\s*with (Dr\\.\\s+[A-Za-z\\s]+))?(?:\\s*\\*\\(for ([^)]+)\\)\\*)?\\n\\s*(?:📋\\s*)?Treatment:\\s*([^\\n]+)/gi)];
              if (listMatches.length > 0) {
                customContent = (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    {listMatches.map((m, i) => {
                      const optionNumber = m[1];
                      const card = (
                        <BookingDetailsCard 
                          key={i}
                          title="Upcoming Appointment"
                          isSuccess={true}
                          when={m[2] ? m[2].trim() : ''}
                          doctor={m[3] ? m[3].trim() : ''}
                          packageName={m[5] ? m[5].trim() : ''}
                          referenceId={m[4] ? \`For: \${m[4].trim()}\` : undefined} 
                        />
                      );
                      
                      if (optionNumber) {
                        return (
                          <button 
                            key={i} 
                            onClick={() => handleSend(optionNumber, true)}
                            className="text-left hover:scale-[1.01] transition-transform w-full"
                          >
                            {card}
                          </button>
                        );
                      }
                      return card;
                    })}
                  </div>
                );
                // Strip the matched list items
                displayText = displayText.replace(/(?:(?:\\d+)\\.\\s*)?(?:✅|🔄|📅)\\s*\\*([^*]+)\\*(?:\\s*with Dr\\.\\s+[A-Za-z\\s]+)?(?:\\s*\\*\\(for [^)]+\\)\\*)?\\n\\s*(?:📋\\s*)?Treatment:\\s*[^\\n]+/gi, '');
                // Clean up prefix
                displayText = displayText.replace(/Here are your (upcoming|recent) appointments:/i, '');
                displayText = displayText.replace(/\\n{2,}/g, '\\n').trim();
              }
            `;

const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync('src/App.tsx', newCode);
console.log("Replaced successfully!");
