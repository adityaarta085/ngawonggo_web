import React, { useState, useEffect, useCallback } from 'react';
import { Box, VStack, HStack, Text, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, IconButton, Badge, useToast, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  FormControl, FormLabel, Input, Tooltip, InputGroup, InputLeftElement, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react';
import { FaTrash, FaEnvelope, FaPlus, FaSearch, FaUserShield, FaExclamationTriangle, FaMagic, FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWaOnly, setShowWaOnly] = useState(false);
  const [, setIsLoading] = useState(false);
  const toast = useToast();

  // Modal states
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
  const { isOpen: isUserOpen, onOpen: onUserOpen, onClose: onUserClose } = useDisclosure();

  // Email state
  const [emailTarget, setEmailTarget] = useState(null); // specific user or 'invite'
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // User form state
  const [userData, setUserData] = useState({ email: '', password: '', role: 'user' });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({ title: 'Gagal memuat pengguna', description: error.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan.')) {
      try {
        // Karena client-side tidak bisa langsung delete auth.users tanpa service_role,
        // Kita panggil rpc atau edge function.
        // Jika tidak ada fungsi khusus, kita gunakan toast peringatan atau rpc delete_user
        const { error } = await supabase.rpc('delete_user_by_id', { user_id: id });
        if (error) throw error;
        toast({ title: 'Pengguna dihapus', status: 'success' });
        fetchUsers();
      } catch (error) {
        toast({ title: 'Gagal menghapus pengguna', description: error.message || 'Harap pastikan RPC delete_user_by_id tersedia dan admin memiliki akses.', status: 'error' });
      }
    }
  };

  const handleAddUser = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (error) throw error;
      toast({ title: 'Pengguna berhasil ditambahkan', status: 'success' });
      onUserClose();
      fetchUsers();
    } catch (error) {
      toast({ title: 'Gagal menambahkan pengguna', description: error.message, status: 'error' });
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent) {
      toast({ title: 'Subject dan Konten tidak boleh kosong', status: 'warning' });
      return;
    }

    let targetEmail = emailTarget?.email;
    if (emailTarget === 'invite') {
      targetEmail = userData.email;
    }

    if (!targetEmail) {
      toast({ title: 'Target email tidak valid', status: 'error' });
      return;
    }

    setIsSending(true);
    try {
      await axios.post('/api/broadcast', { to: targetEmail, subject: emailSubject, content: emailContent });
      toast({ title: 'Email terkirim', status: 'success' });
      onEmailClose();
    } catch (error) {
      toast({ title: 'Gagal mengirim email', description: error.message, status: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleAiBeautify = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        messages: [{ role: 'user', content: `Buatkan HTML email menarik dan profesional berdasarkan instruksi berikut: ${aiPrompt}. HANYA BERIKAN KODE HTML SAJA TANPA MARKDOWN (tanpa tag <html>, <body>, atau markdown backticks seperti \`\`\`html). Hanya konten di dalamnya saja.` }]
      });

      if (response.data?.choices?.[0]?.message?.content) {
        let aiContent = response.data.choices[0].message.content;
        aiContent = aiContent.replace(/```html/g, '').replace(/```/g, '').trim();
        setEmailContent(aiContent);
        toast({ title: 'Email digenerate dengan AI', status: 'success' });
      } else {
        throw new Error('Respons AI kosong');
      }
    } catch (error) {
      toast({ title: 'Gagal menggunakan AI', description: error.message, status: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const openEmailModal = (target, type) => {
    setEmailTarget(target);
    if (type === 'violation') {
      setEmailSubject('Peringatan Pelanggaran - Desa Ngawonggo');
      setEmailContent(`<h2>Peringatan Pelanggaran</h2><p>Halo, ini adalah peringatan terkait aktivitas Anda di platform kami...</p>`);
    } else if (type === 'invite') {
      setEmailSubject('Undangan Bergabung - Desa Ngawonggo');
      setEmailContent(`<h2>Undangan Eksklusif</h2><p>Kami mengundang Anda untuk bergabung ke portal Desa Ngawonggo...</p>`);
    } else {
      setEmailSubject('');
      setEmailContent('');
    }
    onEmailOpen();
  };

  const toggle2FA = async (userId, currentStatus) => {
    // Implementasi mock/RPC untuk toggle 2FA
    toast({ title: 'Fitur 2FA (MFA) segera hadir/membutuhkan konfigurasi khusus', status: 'info' });
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const isWaVerified = u.raw_user_meta_data?.whatsapp_verified;
    if (showWaOnly) return matchSearch && isWaVerified;
    return matchSearch;
  });

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
    <Box p={4} bg="white" borderRadius="xl" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Manajemen Pengguna</Heading>
          <HStack>
            <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => { setUserData({ email: '', password: '', role: 'user' }); onUserOpen(); }}>
              Tambah / Invite User
            </Button>
          </HStack>
        </HStack>

        <HStack w="full">
          <InputGroup flex={1}>
            <InputLeftElement children={<FaSearch color="gray.300" />} />
            <Input
              placeholder="Cari email user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Button
            colorScheme={showWaOnly ? 'whatsapp' : 'gray'}
            variant={showWaOnly ? 'solid' : 'outline'}
            onClick={() => setShowWaOnly(!showWaOnly)}
            leftIcon={<FaWhatsapp />}
            size="md"
          >
            {showWaOnly ? 'Semua User' : 'Filter WA Verif'}
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>ID</Th>
                <Th>Email & Kontak</Th>
                <Th>Login Terakhir</Th>
                <Th>Aksi Email</Th>
                <Th>Aksi Manajemen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map(user => (
                <Tr key={user.id}>
                  <Td fontSize="xs" maxWidth="100px" isTruncated>{user.id}</Td>
                                    <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{user.email}</Text>
                      {user.raw_user_meta_data?.whatsapp_verified && (
                        <Badge colorScheme="whatsapp" variant="subtle" fontSize="xs">
                          WA: {user.raw_user_meta_data.whatsapp_number}
                        </Badge>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Belum Pernah'}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Kirim Email Biasa">
                        <IconButton size="sm" icon={<FaEnvelope />} onClick={() => openEmailModal(user, 'general')} />
                      </Tooltip>
                      <Tooltip label="Kirim Peringatan">
                        <IconButton size="sm" colorScheme="orange" icon={<FaExclamationTriangle />} onClick={() => openEmailModal(user, 'violation')} />
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Toggle 2FA">
                        <IconButton size="sm" colorScheme="purple" icon={<FaUserShield />} onClick={() => toggle2FA(user.id)} />
                      </Tooltip>
                      <Tooltip label="Hapus Akun">
                        <IconButton size="sm" colorScheme="red" icon={<FaTrash />} onClick={() => handleDeleteUser(user.id)} />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Modal Tambah/Invite User */}
      <Modal isOpen={isUserOpen} onClose={onUserClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah / Invite Pengguna</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Password Sementara (Kosongkan jika hanya invite)</FormLabel>
                <Input type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
              </FormControl>
              <Button width="full" colorScheme="brand" onClick={handleAddUser} isDisabled={!userData.email || !userData.password}>
                Buat Akun Manual
              </Button>
              <Text fontSize="sm" color="gray.500">Atau</Text>
              <Button width="full" variant="outline" colorScheme="blue" onClick={() => { onUserClose(); openEmailModal('invite', 'invite'); }} isDisabled={!userData.email}>
                Kirim Email Undangan (HTML Menarik)
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Kirim Email */}
      <Modal isOpen={isEmailOpen} onClose={onEmailClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {emailTarget === 'invite' ? 'Kirim Undangan' : `Kirim Email ke ${emailTarget?.email}`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
              </FormControl>

              <Box mb={2} p={4} border="1px" borderColor="brand.100" borderRadius="md" bg="brand.50">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="brand.700">Tulis atau Percantik Email dengan AI (Sangat Menarik & Fleksibel)</Text>
                <HStack>
                  <Input
                    placeholder="Instruksi AI (contoh: Buatkan email undangan HTML dengan gaya modern...)"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    bg="white"
                    size="sm"
                  />
                  <Button
                    leftIcon={<FaMagic />}
                    colorScheme="brand"
                    size="sm"
                    onClick={handleAiBeautify}
                    isLoading={isAiLoading}
                  >
                    Generate HTML
                  </Button>
                </HStack>
              </Box>

              <FormControl isRequired>
                <FormLabel>Isi Email</FormLabel>
                <Tabs variant="enclosed" colorScheme="brand">
                  <TabList>
                    <Tab>Visual Editor</Tab>
                    <Tab>HTML Editor</Tab>
                    <Tab>Preview</Tab>
                  </TabList>
                  <TabPanels bg="white" color="black" border="1px" borderColor="gray.200" borderTop="none" borderBottomRadius="md">
                    <TabPanel p={0}>
                      <ReactQuill
                        theme="snow"
                        value={emailContent}
                        onChange={setEmailContent}
                        modules={quillModules}
                        style={{ height: '300px', marginBottom: '40px' }}
                      />
                    </TabPanel>
                    <TabPanel>
                      <Textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="Ketik atau paste kode HTML di sini..."
                        height="300px"
                        fontFamily="monospace"
                        fontSize="sm"
                      />
                    </TabPanel>
                    <TabPanel>
                      <Box
                        height="300px"
                        overflowY="auto"
                        p={4}
                        border="1px solid"
                        borderColor="gray.100"
                        borderRadius="md"
                        dangerouslySetInnerHTML={{ __html: emailContent || '<p color="gray">Pratinjau kosong</p>' }}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter mt={8}>
            <Button variant="ghost" mr={3} onClick={onEmailClose}>Batal</Button>
            <Button colorScheme="blue" onClick={handleSendEmail} isLoading={isSending}>Kirim Email</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default UserManager;
