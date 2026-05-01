const fs = require('fs');

let content = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');
const lines = content.split('\n');
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
    // Drop all these bad additions from previous bad seds
    if (lines[i].includes('<Heading size="sm" color="gray.700">Dompet & Status</Heading>') &&
        (lines[i-1].includes('<Icon as={FaStore}') || lines[i+1].includes('<IconButton icon={<Icon as={FaBell} />}'))) {

        // We only want ONE Dompet & Status header, which should be around line 320
        if (i < 318 || i > 330) {
            // Drop it and the surrounding HStack
            if (fixedLines.length > 0 && fixedLines[fixedLines.length-1].includes('<HStack>')) {
                fixedLines.pop();
            }
            if (fixedLines.length > 0 && fixedLines[fixedLines.length-1].includes('<Icon as={FaStore}')) {
                fixedLines.pop();
            }
            i++; // skip the IconButton too if it exists
            if (lines[i] && lines[i].includes('</HStack>')) {
                continue; // skip the closing HStack
            } else {
                i--; // backtrack if it wasn't there
            }
            continue;
        }
    }

    // Fix missing icon imports if any
    if (lines[i].includes('FaHistory,') && !fixedLines.some(l => l.includes('FaBell'))) {
        fixedLines.push(lines[i].replace('FaHistory,', 'FaHistory, FaBell,'));
        continue;
    }

    fixedLines.push(lines[i]);
}

// Clean up some specific bad lines
content = fixedLines.join('\n');
content = content.replace(/<HStack>\s*<Icon as=\{FaStore\} color="brand.500" \/>\s*<Heading size="sm" color="gray.700">Dompet & Status<\/Heading>\s*<IconButton icon=\{<Icon as=\{FaBell\} \/>\} colorScheme="blue" variant="ghost" isRound onClick=\{\(\) => navigate\("\/portal\/notifikasi"\)\} aria-label="Notifikasi" ml=\{4\} \/>\s*<\/HStack>/g, '');

content = content.replace(/<HStack>\s*<Icon as=\{FaStore\} color="brand.500" \/>\s*<Heading size="sm" color="gray.700">Dompet & Status<\/Heading>\s*<\/HStack>/g, '');


fs.writeFileSync('src/views/PortalPage/index.js', content);
