import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Avatar,
  Textarea,
  Heading,
} from '@chakra-ui/react';
import { FaReply } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const CommentItem = ({ comment, allComments, newsId, onCommentAdded }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyData, setReplyData] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const replies = allComments.filter(c => c.parent_id === comment.id);

  const handleReply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          news_id: newsId,
          parent_id: comment.id,
          name: replyData.name,
          email: replyData.email,
          content: replyData.content,
          is_approved: false // Need admin approval
        }]);

      if (error) throw error;
      toast({ title: 'Balasan terkirim', description: 'Menunggu persetujuan admin', status: 'success' });
      setShowReply(false);
      setReplyData({ name: '', email: '', content: '' });
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      toast({ title: 'Gagal mengirim balasan', description: err.message, status: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box mt={4} pl={comment.parent_id ? 8 : 0} borderLeft={comment.parent_id ? "2px solid" : "none"} borderColor="gray.100">
      <HStack align="start" spacing={3}>
        <Avatar size="sm" name={comment.name} />
        <VStack align="start" spacing={1} flex={1}>
          <HStack justify="space-between" w="full">
            <Text fontWeight="bold" fontSize="sm">{comment.name}</Text>
            <Text fontSize="xs" color="gray.500">{new Date(comment.created_at).toLocaleDateString()}</Text>
          </HStack>
          <Text fontSize="sm">{comment.content}</Text>
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<FaReply />}
            onClick={() => setShowReply(!showReply)}
            colorScheme="brand"
          >
            Balas
          </Button>

          {showReply && (
            <Box w="full" mt={2} p={3} bg="gray.50" borderRadius="md">
              <form onSubmit={handleReply}>
                <VStack spacing={3}>
                  <HStack w="full">
                    <FormControl isRequired>
                      <Input
                        size="xs"
                        placeholder="Nama"
                        value={replyData.name}
                        onChange={(e) => setReplyData({...replyData, name: e.target.value})}
                        bg="white"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        size="xs"
                        placeholder="Email (Opsional)"
                        value={replyData.email}
                        onChange={(e) => setReplyData({...replyData, email: e.target.value})}
                        bg="white"
                      />
                    </FormControl>
                  </HStack>
                  <FormControl isRequired>
                    <Textarea
                      size="xs"
                      placeholder="Tulis balasan..."
                      value={replyData.content}
                      onChange={(e) => setReplyData({...replyData, content: e.target.value})}
                      bg="white"
                    />
                  </FormControl>
                  <Button size="xs" colorScheme="brand" type="submit" isLoading={submitting}>Kirim Balasan</Button>
                </VStack>
              </form>
            </Box>
          )}

          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              newsId={newsId}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </VStack>
      </HStack>
    </Box>
  );
};

const CommentSection = ({ newsId }) => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('news_id', newsId)
      .eq('is_approved', true) // Only approved comments
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          news_id: newsId,
          name: formData.name,
          email: formData.email,
          content: formData.content,
          is_approved: false
        }]);

      if (error) throw error;
      toast({ title: 'Komentar terkirim', description: 'Komentar Anda sedang menunggu persetujuan admin', status: 'success' });
      setFormData({ name: '', email: '', content: '' });
    } catch (err) {
      toast({ title: 'Gagal mengirim komentar', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const rootComments = comments.filter(c => !c.parent_id);

  return (
    <Box mt={12} pt={8} borderTop="1px solid" borderColor="gray.100">
      <Heading size="md" mb={6}>Komentar ({comments.length})</Heading>

      {/* Form Komentar */}
      <Box mb={10} p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <HStack>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Nama</FormLabel>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Anda" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Email (Opsional)</FormLabel>
                <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@contoh.com" />
              </FormControl>
            </HStack>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Komentar</FormLabel>
              <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Tulis komentar Anda..." />
            </FormControl>
            <Button colorScheme="brand" type="submit" isLoading={loading}>Kirim Komentar</Button>
          </VStack>
        </form>
      </Box>

      {/* List Komentar */}
      <VStack align="stretch" spacing={6}>
        {rootComments.length > 0 ? (
          rootComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={comments}
              newsId={newsId}
              onCommentAdded={fetchComments}
            />
          ))
        ) : (
          <Text color="gray.500" fontStyle="italic">Belum ada komentar yang disetujui.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default CommentSection;
