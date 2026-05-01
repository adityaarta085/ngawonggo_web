import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Radio,
  Stack,
  Checkbox,
  useToast,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FaPaperPlane, FaSearch, FaUserCircle } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const NotificationManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [actionLink, setActionLink] = useState('');
  const [recipientType, setRecipientType] = useState('all');

  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.raw_user_meta_data?.full_name && u.raw_user_meta_data.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    // setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAllFiltered = (e) => {
    if (e.target.checked) {
      const newSelected = [...new Set([...selectedUsers, ...filteredUsers.map(u => u.id)])];
      setSelectedUsers(newSelected);
    } else {
      const filteredIds = filteredUsers.map(u => u.id);
      setSelectedUsers(selectedUsers.filter(id => !filteredIds.includes(id)));
    }
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Judul dan pesan notifikasi wajib diisi.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (recipientType === 'selected' && selectedUsers.length === 0) {
      toast({
        title: 'Penerima kosong',
        description: 'Pilih minimal satu pengguna untuk dikirimi notifikasi.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSending(true);

    try {
      if (recipientType === 'all') {
        const { error } = await supabase.rpc('notify_all_users', {
          p_title: title,
          p_message: message,
          p_type: type,
          p_action_link: actionLink || null
        });
        if (error) throw error;
      } else if (recipientType === 'selected') {
        const notifications = selectedUsers.map(userId => ({
          user_id: userId,
          title,
          message,
          type,
          action_link: actionLink || null
        }));

        const { error } = await supabase.from('user_notifications').insert(notifications);
        if (error) throw error;
      }

      toast({
        title: 'Berhasil',
        description: 'Notifikasi berhasil dikirim!',
        status: 'success',
        duration: 3000,
      });

      setTitle('');
      setMessage('');
      setActionLink('');
      setSelectedUsers([]);
      setRecipientType('all');

    } catch (error) {
      toast({
        title: 'Gagal mengirim',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Kirim Notifikasi Push (In-App)</Heading>
        </HStack>

        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Judul Notifikasi</FormLabel>
              <Input
                placeholder="Contoh: Info Keamanan, Campaign Baru..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isDisabled={isSending}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Pesan Notifikasi</FormLabel>
              <Textarea
                placeholder="Tulis pesan notifikasi..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                isDisabled={isSending}
                rows={3}
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl w="50%">
                <FormLabel>Tipe Notifikasi</FormLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)} isDisabled={isSending}>
                  <option value="info">Info (Biru)</option>
                  <option value="success">Success (Hijau)</option>
                  <option value="warning">Warning (Oranye)</option>
                  <option value="gift">Gift/Promo (Ungu)</option>
                </Select>
              </FormControl>

              <FormControl w="50%">
                <FormLabel>Link Aksi (Opsional)</FormLabel>
                <Input
                  placeholder="/donasi atau https://..."
                  value={actionLink}
                  onChange={(e) => setActionLink(e.target.value)}
                  isDisabled={isSending}
                />
              </FormControl>
            </HStack>

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
                              isChecked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUsers.includes(u.id))}
                              isIndeterminate={filteredUsers.some(u => selectedUsers.includes(u.id)) && !filteredUsers.every(u => selectedUsers.includes(u.id))}
                              onChange={handleSelectAllFiltered}
                            />
                          </Th>
                          <Th>Email</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredUsers.map(user => (
                          <Tr key={user.id} _hover={{ bg: 'gray.50' }} cursor="pointer" onClick={() => handleSelectUser(user.id)}>
                            <Td>
                              <Checkbox
                                isChecked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
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

            <Button
              leftIcon={<FaPaperPlane />}
              colorScheme="brand"
              size="lg"
              onClick={handleSendNotification}
              isLoading={isSending}
              loadingText="Mengirim..."
              mt={4}
            >
              Kirim Notifikasi
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default NotificationManager;
