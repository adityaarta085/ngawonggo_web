const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'api', 'chat.js');
let content = fs.readFileSync(filePath, 'utf8');

// The AI prompt needs to be updated to support escalation
const promptUpdate = `
    // Use customPrompt if provided (used by Takedown Page)
    if (customPrompt) {
        systemPrompt = customPrompt;
    }

    // Append Escalation Instructions
    systemPrompt += \`
IMPORTANT INSTRUCTION FOR ESCALATION:
Jika user meminta berbicara dengan Customer Service (CS) / manusia, ATAU jika Anda tidak mampu menjawab pertanyaan karena terlalu kompleks atau di luar pengetahuan Anda, Anda WAJIB membalas HANYA dengan JSON berikut (tanpa markdown, tanpa teks lain):
{
  "escalate": true,
  "summary": "<ringkasan singkat masalah user>",
  "reason": "<alasan kenapa butuh CS, misal 'User meminta CS' atau 'Pertanyaan terlalu kompleks'>"
}
Jika tidak perlu eskalasi, jawablah seperti biasa dengan teks biasa.\`;
`;

content = content.replace(`    // Use customPrompt if provided (used by Takedown Page)
    if (customPrompt) {
        systemPrompt = customPrompt;
    }`, promptUpdate);

fs.writeFileSync(filePath, content, 'utf8');
console.log('chat.js patched');
