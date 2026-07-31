const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\e2bf4513-b530-49de-b7d5-0d189a30e3b0\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n').filter(Boolean);
const userInputs = lines.map(l => JSON.parse(l)).filter(o => o.type === 'USER_INPUT');
const lastInput = userInputs[userInputs.length - 1];
let content = lastInput.content;

// Extract just the part starting with "Advanced Wound Healing Clinics"
const kbStart = content.indexOf('Advanced Wound Healing Clinics');
if (kbStart !== -1) {
    content = content.substring(kbStart);
}

fs.writeFileSync('c:\\kvnn\\webBot\\src\\kb.ts', 'export const knowledgeBase = ' + JSON.stringify(content) + ';\n');
