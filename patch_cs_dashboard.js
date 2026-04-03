const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'views', 'AdminPage', 'cs', 'CSDashboard.js');
let content = fs.readFileSync(filePath, 'utf8');

// Imports
content = content.replace(
  `import {\n  Box, Flex, VStack, HStack, Heading, Text, Badge, Button, Input, IconButton, \n  Avatar, Divider, useToast\n} from '@chakra-ui/react';`,
  `import {\n  Box, Flex, VStack, HStack, Heading, Text, Badge, Button, Input, IconButton, \n  Avatar, Divider, useToast, Switch\n} from '@chakra-ui/react';`
);

// State & Effects
content = content.replace(
  `  const [inputMsg, setInputMsg] = useState('');`,
  `  const [inputMsg, setInputMsg] = useState('');\n  const [isOnline, setIsOnline] = useState(csSession?.status === 'online');`
);

content = content.replace(
  `  useEffect(() => {`,
  `  useEffect(() => {
    // Listen for my own status changes (e.g. forced offline by admin)
    const mySub = supabase.channel('cs_my_status')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'usersCS', filter: \`id=eq.\${csSession.id}\` }, payload => {
          setIsOnline(payload.new.status === 'online');

          // Update local storage session
          const updatedSession = { ...csSession, ...payload.new };
          localStorage.setItem('csSession', JSON.stringify(updatedSession));
          setCsSession(updatedSession);
      })
      .subscribe();

    return () => { supabase.removeChannel(mySub); };
  }, [csSession, setCsSession]);\n\n  useEffect(() => {`
);

// Toggle handler
content = content.replace(
  `  const handleLogout = async () => {`,
  `  const handleToggleStatus = async (e) => {
      const newStatus = e.target.checked ? 'online' : 'offline';
      setIsOnline(e.target.checked);

      const { error } = await supabase.from('usersCS').update({ status: newStatus }).eq('id', csSession.id);
      if (error) {
          toast({ title: 'Gagal mengubah status', description: error.message, status: 'error' });
          setIsOnline(!e.target.checked); // revert
      } else {
          toast({ title: \`Status: \${newStatus}\`, status: 'info', duration: 1000 });
      }
  };

  const handleLogout = async () => {`
);

// Header UI
content = content.replace(
  `<Badge colorScheme="green" fontSize="10px">CS Online</Badge>`,
  `<Badge colorScheme={isOnline ? 'green' : 'gray'} fontSize="10px">
                            CS {isOnline ? 'Online' : 'Offline'}
                        </Badge>`
);

content = content.replace(
  `<IconButton size="xs" icon={<FaSignOutAlt />} colorScheme="red" variant="ghost" onClick={handleLogout} aria-label="logout" />`,
  `<HStack spacing={4}>
                    <Switch colorScheme="green" isChecked={isOnline} onChange={handleToggleStatus} size="sm" />
                    <IconButton size="xs" icon={<FaSignOutAlt />} colorScheme="red" variant="ghost" onClick={handleLogout} aria-label="logout" />
                </HStack>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('CSDashboard.js patched with online/offline switch');
