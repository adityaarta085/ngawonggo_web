const fs = require('fs');
let content = fs.readFileSync('src/views/AdminPage/components/UserManager.js', 'utf8');

const tableRow = `<Td>{user.tier_name}</Td>`;
const tableRowNew = `<Td><Badge colorScheme={user.tier_name === 'VIP' ? 'purple' : user.tier_name === 'Gold' ? 'yellow' : user.tier_name === 'Silver' ? 'gray' : 'green'}>{user.tier_name || 'Free'}</Badge></Td>`;

if (content.includes(tableRow)) {
    content = content.replace(tableRow, tableRowNew);
}
if (!content.includes('Badge')) {
    content = content.replace('Button, IconButton,  useToast,', 'Button, IconButton,  useToast, Badge,');
}

fs.writeFileSync('src/views/AdminPage/components/UserManager.js', content, 'utf8');
