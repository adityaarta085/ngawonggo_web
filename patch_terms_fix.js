const fs = require('fs');

let terms = fs.readFileSync('src/views/Legal/TermsConditions.js', 'utf8');

if (!terms.includes('ListItem,')) {
    terms = terms.replace('UnorderedList,', 'UnorderedList,\n  ListItem,');
}

fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
