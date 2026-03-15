import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Checkbox,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Progress,
  Badge,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaPaperPlane, FaSearch, FaUserCircle } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const BroadcastManager = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientType, setRecipientType] = useState('all'); // 'all' or 'selected'
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [sendTest, setSendTest] = useState(false);
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        status: 'error',
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSelectUser = (email) => {
    setSelectedUsers(prev =>
      prev.includes(email) ? prev.filter(u => u !== email) : [...prev, email]
    );
  };

  const handleSelectAllFiltered = () => {
    const filtered = filteredUsers.map(u => u.email).filter(Boolean);
    const allSelected = filtered.every(email => selectedUsers.includes(email));

    if (allSelected) {
      setSelectedUsers(prev => prev.filter(email => !filtered.includes(email)));
    } else {
      setSelectedUsers(prev => Array.from(new Set([...prev, ...filtered])));
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSendEmail = async () => {
    if (!subject || !content) {
      toast({ title: 'Subject dan Konten tidak boleh kosong', status: 'warning' });
      return;
    }

    let targets = [];
    if (sendTest) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        targets = [user.email];
      } else {
        toast({ title: 'Gagal mendapatkan email admin. Pastikan Anda sudah login ke Portal Warga.', status: 'error' });
        return;
      }
    } else if (recipientType === 'all') {
      targets = users.map(u => u.email).filter(Boolean);
    } else {
      targets = selectedUsers;
    }

    if (targets.length === 0) {
      toast({ title: 'Tidak ada penerima yang dipilih', status: 'warning' });
      return;
    }

    setIsSending(true);
    setProgress(0);
    setStats({ sent: 0, failed: 0, total: targets.length });

    const batchSize = 2;
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = targets.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map(email => axios.post('/api/broadcast', { to: email, subject, content }))
      );

      let batchSent = 0;
      let batchFailed = 0;
      results.forEach(res => {
        if (res.status === 'fulfilled' && res.value.status === 200) {
          batchSent++;
        } else {
          batchFailed++;
        }
      });

      setStats(prev => ({
        ...prev,
        sent: prev.sent + batchSent,
        failed: prev.failed + batchFailed
      }));

      const processedCount = i + batch.length;
      const currentProgress = Math.min(Math.round((processedCount / targets.length) * 100), 100);
      setProgress(currentProgress);

      if (processedCount < targets.length) {
        await delay(2000);
      }
    }

    setIsSending(false);
    toast({
      title: 'Broadcast Selesai',
      status: 'success',
      duration: 5000,
    });
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Broadcast Email</Heading>
          {isSending && <Badge colorScheme="blue" p={2} borderRadius="md">Mengirim...</Badge>}
        </HStack>

        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Subject (Judul Email)</FormLabel>
              <Input
                placeholder="Masukkan judul email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                isDisabled={isSending}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Content</FormLabel>
              <Box bg="white" color="black">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  style={{ height: '250px', marginBottom: '50px' }}
                  readOnly={isSending}
                />
              </Box>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Pilih Penerima</FormLabel>
              <RadioGroup onChange={setRecipientType} value={recipientType} isDisabled={isSending}>
                <Stack direction="row" spacing={5}>
                  <Radio value="all">Semua Pengguna ({users.length})</Radio>
                  <Radio value="selected">Pengguna Tertentu ({selectedUsers.length})</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {recipientType === 'selected' && (
              <Box border="1px" borderColor="gray.100" borderRadius="lg" p={4}>
                <VStack spacing={4} align="stretch">
                  <InputGroup>
                    <InputLeftElement children={<FaSearch color="gray.300" />} />
                    <Input
                      placeholder="Cari email user..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>

                  <Box maxH="300px" overflowY="auto">
                    <Table size="sm" variant="simple">
                      <Thead position="sticky" top={0} bg="white" zIndex={1}>
                        <Tr>
                          <Th width="40px">
                            <Checkbox
                              isChecked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUsers.includes(u.email))}
                              isIndeterminate={filteredUsers.some(u => selectedUsers.includes(u.email)) && !filteredUsers.every(u => selectedUsers.includes(u.email))}
                              onChange={handleSelectAllFiltered}
                            />
                          </Th>
                          <Th>Email</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredUsers.map(user => (
                          <Tr key={user.id} _hover={{ bg: 'gray.50' }} cursor="pointer" onClick={() => handleSelectUser(user.email)}>
                            <Td>
                              <Checkbox
                                isChecked={selectedUsers.includes(user.email)}
                                onChange={() => handleSelectUser(user.email)}
                              />
                            </Td>
                            <Td>
                              <HStack>
                                <FaUserCircle />
                                <Text fontSize="sm">{user.email}</Text>
                              </HStack>
                            </Td>
                            <Td>
                              <Badge colorScheme={user.last_sign_in_at ? 'green' : 'gray'} fontSize="2xs">
                                {user.last_sign_in_at ? 'Active' : 'Never'}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              </Box>
            )}

            <HStack spacing={4} pt={4}>
              <Checkbox
                isChecked={sendTest}
                onChange={(e) => setSendTest(e.target.checked)}
                isDisabled={isSending}
              >
                Kirim email uji coba ke saya dahulu
              </Checkbox>
            </HStack>

            {isSending && (
              <Box pt={4}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="bold">Proses Pengiriman...</Text>
                  <Text fontSize="sm">{stats.sent + stats.failed} / {stats.total} terproses</Text>
                </HStack>
                <Progress value={progress} size="sm" borderRadius="full" colorScheme="blue" hasStripe isAnimated />
                <HStack mt={2} spacing={4}>
                  <Text fontSize="xs" color="green.500">Berhasil: {stats.sent}</Text>
                  <Text fontSize="xs" color="red.500">Gagal: {stats.failed}</Text>
                </HStack>
              </Box>
            )}

            <Button
              leftIcon={<FaPaperPlane />}
              colorScheme="brand"
              size="lg"
              onClick={handleSendEmail}
              isLoading={isSending}
              loadingText="Mengirim..."
              mt={4}
            >
              {sendTest ? 'Kirim Test Email' : 'Kirim Broadcast'}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default BroadcastManager;
