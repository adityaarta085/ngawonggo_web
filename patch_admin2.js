const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/AdminPage/components/UserManager.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { Badge } from \'@chakra-ui/react\'')) {
    content = content.replace("import {\n  Box,\n  Button,\n  Table,\n  Thead,\n  Tbody,\n  Tr,\n  Th,\n  Td,\n  VStack,\n  HStack,\n  Heading,\n  Text,\n  IconButton,\n  useToast,\n  Modal,\n  ModalOverlay, ModalContent,\n  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,\n  FormControl, FormLabel, Input, Tooltip, InputGroup, InputLeftElement, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react';",
    "import {\n  Box,\n  Button,\n  Table,\n  Thead,\n  Tbody,\n  Tr,\n  Th,\n  Td,\n  VStack,\n  HStack,\n  Heading,\n  Text,\n  IconButton,\n  useToast,\n  Modal,\n  ModalOverlay, ModalContent,\n  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,\n  FormControl, FormLabel, Input, Tooltip, InputGroup, InputLeftElement, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea, Badge } from '@chakra-ui/react';");
}

const fetchSearch = `      const { data, error } = await supabase.rpc('get_all_users');
      if (error) throw error;
      setUsers(data || []);`;

const fetchReplace = `      // Fetch base users
      const { data: usersData, error } = await supabase.rpc('get_all_users');
      if (error) throw error;

      // Fetch economy data
      const { data: economyData } = await supabase.from('user_currencies').select('*');
      const { data: tierData } = await supabase.from('user_tiers').select('*');

      const merged = (usersData || []).map(u => {
          const eco = economyData?.find(e => e.user_id === u.id) || { coins: 0, tickets: 0 };
          const tier = tierData?.find(t => t.user_id === u.id) || { tier_name: 'Free' };
          return { ...u, ...eco, ...tier };
      });

      setUsers(merged || []);`;

if (content.includes(fetchSearch)) {
    content = content.replace(fetchSearch, fetchReplace);
}

const theadSearch = `<Th>ID</Th>
                <Th>Email & Kontak</Th>
                <Th>Login Terakhir</Th>
                <Th>Aksi Email</Th>
                <Th>Aksi Manajemen</Th>`;

const theadReplace = `<Th>ID</Th>
                <Th>Email & Kontak</Th>
                <Th>Tier & Dompet</Th>
                <Th>Login Terakhir</Th>
                <Th>Aksi Email</Th>
                <Th>Aksi Manajemen</Th>`;

if (content.includes(theadSearch)) {
    content = content.replace(theadSearch, theadReplace);
}

const tbodySearch = `<Td>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Belum Pernah'}
                  </Td>`;

const tbodyReplace = `<Td>
                    <VStack align="start" spacing={0}>
                        <Badge colorScheme={user.tier_name === 'VIP' ? 'purple' : user.tier_name === 'Subscription' ? 'blue' : 'gray'}>{user.tier_name || 'Free'}</Badge>
                        <Text fontSize="10px">Koin: {user.coins || 0} | Tiket: {user.tickets || 0}</Text>
                    </VStack>
                  </Td>
                  <Td>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Belum Pernah'}
                  </Td>`;

if (content.includes(tbodySearch)) {
    content = content.replace(tbodySearch, tbodyReplace);
}

fs.writeFileSync(filePath, content);
console.log('UserManager UI Patched cleanly');
