const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'views', 'AdminPage', 'components');
const csManagerPath = path.join(srcDir, 'CsManager.js');

const code = `import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  HStack,
  Avatar,
  Badge,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const CsManager = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    avatar_url: 'https://www.capitallifesyariah.co.id/fileuploadmaster/calisa_7717JG4A9178.jpg',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchAgents();

    const sub = supabase.channel('cs_manager_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usersCS' }, payload => {
          fetchAgents();
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('usersCS')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (agent = null) => {
    if (agent) {
      setSelectedAgent(agent);
      setFormData({
        username: agent.username,
        name: agent.name,
        avatar_url: agent.avatar_url || '',
      });
    } else {
      setSelectedAgent(null);
      setFormData({
        username: '',
        name: '',
        avatar_url: 'https://www.capitallifesyariah.co.id/fileuploadmaster/calisa_7717JG4A9178.jpg',
      });
    }
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      if (selectedAgent) {
        // Update
        const { error } = await supabase
          .from('usersCS')
          .update(formData)
          .eq('id', selectedAgent.id);

        if (error) throw error;
        toast({ title: 'CS Berhasil Diperbarui', status: 'success' });
      } else {
        // Create
        const { error } = await supabase
          .from('usersCS')
          .insert([formData]);

        if (error) throw error;
        toast({ title: 'CS Berhasil Ditambahkan', status: 'success' });
      }
      onClose();
      fetchAgents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus CS ini?')) return;

    try {
      const { error } = await supabase
        .from('usersCS')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'CS Berhasil Dihapus', status: 'success' });
      fetchAgents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={1}>
            <Heading size="md">Manajemen Customer Service</Heading>
            <Text color="gray.500" fontSize="sm">Kelola agen CS yang bertugas melayani pengguna.</Text>
        </VStack>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="brand"
          onClick={() => handleOpenModal()}
        >
          Tambah CS
        </Button>
      </Flex>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden" border="1px solid" borderColor="gray.100">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Profil</Th>
              <Th>Username</Th>
              <Th>Status</Th>
              <Th width="100px">Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {agents.map((agent) => (
              <Tr key={agent.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar size="sm" src={agent.avatar_url} name={agent.name} />
                    <Text fontWeight="bold">{agent.name}</Text>
                  </HStack>
                </Td>
                <Td>{agent.username}</Td>
                <Td>
                  <Badge colorScheme={agent.status === 'online' ? 'green' : 'gray'}>
                    {agent.status || 'offline'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<FaEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => handleOpenModal(agent)}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(agent.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
            {agents.length === 0 && !loading && (
              <Tr>
                <Td colSpan={4} textAlign="center" py={8} color="gray.500">
                  Belum ada agen CS
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAgent ? 'Edit CS' : 'Tambah CS Baru'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama Lengkap</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama agen"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Username (Untuk Login)</FormLabel>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username_cs"
                />
              </FormControl>

              <FormControl>
                <FormLabel>URL Foto Profil</FormLabel>
                <Input
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://..."
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button colorScheme="brand" onClick={handleSubmit}>Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CsManager;
`;

fs.writeFileSync(csManagerPath, code, 'utf8');
console.log('CsManager.js created');
