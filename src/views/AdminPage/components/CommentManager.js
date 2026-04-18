import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Badge,
  Avatar,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FaCheck, FaTrash, FaReply } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const CommentManager = () => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, news(title)')
      .order('created_at', { ascending: false });
    if (!error) setComments(data);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const approveComment = async (id) => {
    const { error } = await supabase.from('comments').update({ is_approved: true }).eq('id', id);
    if (!error) {
      toast({ title: 'Komentar disetujui', status: 'success' });
      fetchComments();
    }
  };

  const deleteComment = async (id) => {
    if (window.confirm('Hapus komentar ini?')) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) {
        toast({ title: 'Komentar dihapus', status: 'success' });
        fetchComments();
      }
    }
  };

  const handleReply = async () => {
    if (!replyContent) return;
    const { error } = await supabase.from('comments').insert([{
      news_id: replyingTo.news_id,
      parent_id: replyingTo.id,
      name: 'Admin Desa Ngawonggo',
      email: 'admin@ngawonggo.desa.id',
      content: replyContent,
      is_approved: true // Admin reply auto-approved
    }]);
    if (!error) {
      toast({ title: 'Balasan terkirim', status: 'success' });
      onClose();
      setReplyContent('');
      fetchComments();
    }
  };

  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>User</Th>
            <Th>Komentar</Th>
            <Th>Berita</Th>
            <Th>Status</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {comments.map(c => (
            <Tr key={c.id}>
              <Td>
                <HStack>
                  <Avatar size="xs" name={c.name} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="xs">{c.name}</Text>
                    <Text fontSize="10px" color="gray.500">{c.email}</Text>
                  </VStack>
                </HStack>
              </Td>
              <Td maxW="300px">
                <Text fontSize="sm" noOfLines={2}>{c.content}</Text>
                <Text fontSize="10px" color="gray.400">{new Date(c.created_at).toLocaleString()}</Text>
              </Td>
              <Td maxW="200px">
                <Text fontSize="xs" isTruncated>{c.news?.title || 'Unknown'}</Text>
              </Td>
              <Td>
                <Badge colorScheme={c.is_approved ? 'green' : 'orange'}>
                  {c.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </Td>
              <Td>
                <HStack>
                  {!c.is_approved && (
                    <IconButton size="sm" icon={<FaCheck />} colorScheme="green" onClick={() => approveComment(c.id)} />
                  )}
                  <IconButton size="sm" icon={<FaReply />} onClick={() => { setReplyingTo(c); onOpen(); }} />
                  <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => deleteComment(c.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Balas Komentar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" mb={4} p={3} bg="gray.50" borderRadius="md">
              <strong>{replyingTo?.name}:</strong> {replyingTo?.content}
            </Text>
            <Textarea
              placeholder="Tulis balasan admin..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button colorScheme="brand" onClick={handleReply}>Kirim Balasan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommentManager;
