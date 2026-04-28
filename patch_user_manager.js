const fs = require('fs');

let content = fs.readFileSync('src/views/AdminPage/components/UserManager.js', 'utf8');

const tableHeader = `<Th>Login Terakhir</Th>
                <Th>Aksi Email</Th>
                <Th>Aksi Manajemen</Th>`;

const tableHeaderNew = `<Th>Login Terakhir</Th>
                <Th>Level</Th>
                <Th>Aset (Koin/Tik/Pts)</Th>
                <Th>Aksi Email</Th>
                <Th>Aksi Manajemen</Th>`;

if (content.includes(tableHeader)) {
    content = content.replace(tableHeader, tableHeaderNew);
}

const tableRow = `<Td>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Belum Pernah'}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Kirim Email Biasa">`;

const tableRowNew = `<Td>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Belum Pernah'}
                  </Td>
                  <Td>
                    <Badge colorScheme={user.tier_name === 'VIP' ? 'purple' : user.tier_name === 'Gold' ? 'yellow' : user.tier_name === 'Silver' ? 'gray' : 'green'}>{user.tier_name}</Badge>
                  </Td>
                  <Td>
                     {user.coins} / {user.tickets} / {user.points}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Kirim Email Biasa">`;

if (content.includes(tableRow)) {
    content = content.replace(tableRow, tableRowNew);
}

// Ensure Badge is imported
if (!content.includes('Badge,')) {
    content = content.replace('Button, IconButton,  useToast,', 'Button, IconButton,  useToast, Badge,');
}

fs.writeFileSync('src/views/AdminPage/components/UserManager.js', content, 'utf8');
