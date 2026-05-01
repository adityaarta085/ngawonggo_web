const fs = require('fs');

let content = fs.readFileSync('src/contexts/MonetizationContext.js', 'utf8');

// The file got messed up. Let's fix it manually.
const lines = content.split('\n');
const fixedLines = [];

let skip = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const purchaseVipDirect = async () => {')) {
        // Keep this implementation
        fixedLines.push(lines[i]);
    } else if (lines[i].includes('const giftVipCard = async (receiverEmail) => {') && fixedLines.some(l => l.includes('const giftVipCard'))) {
        // Skip duplicate
        skip = true;
        continue;
    } else if (skip && lines[i].includes('const isVIP = tier.name === \'VIP\';')) {
        skip = false;
        fixedLines.push(lines[i]);
    } else if (!skip) {
        fixedLines.push(lines[i]);
    }
}

fs.writeFileSync('src/contexts/MonetizationContext.js', fixedLines.join('\n'));
