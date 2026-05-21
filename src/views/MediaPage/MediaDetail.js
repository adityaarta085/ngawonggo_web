import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, VStack, HStack, Text, IconButton, Image, Avatar,
  Spinner, Heading, Divider, Textarea, Button, useToast
} from '@chakra-ui/react';
import { FaHeart, FaComment, FaShare, FaThumbsDown, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
const MediaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userAction, setUserAction] = useState(null); // 'like', 'unlike', or null

  useEffect(() => {
    fetchMediaAndComments();
    if (user) checkUserInteraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchMediaAndComments = async () => {
    try {
      setLoading(true);
      const { data: mediaData, error: mediaError } = await supabase
        .from('community_media')
        .select('*')
        .eq('id', id)
        .single();

      if (mediaError) throw mediaError;
      setMedia(mediaData);

      const { data: commentsData, error: commentsError } = await supabase
        .from('community_media_comments')
        .select('*')
        .eq('media_id', id)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error) {
      console.error("Error fetching detail:", error);
      toast({ title: 'Gagal memuat', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkUserInteraction = async () => {
      try {
          const { data } = await supabase
              .from('community_media_interactions')
              .select('interaction_type')
              .eq('media_id', id)
              .eq('user_id', user.id)
              .single();
          if (data) {
              setUserAction(data.interaction_type);
          }
      } catch (err) {
          // ignore if no record
      }
  };

  const handleInteraction = async (type) => {
      if (!user) {
          toast({ title: 'Silakan login', status: 'warning' });
          return;
      }
      if (userAction) {
          toast({ title: `Anda sudah memberikan ${userAction}`, status: 'info' });
          return;
      }

      try {
          const isLike = type === 'like';
          const field = isLike ? 'likes' : 'unlikes';
          const newValue = media[field] + 1;

          setMedia({ ...media, [field]: newValue });
          setUserAction(type);

          await supabase.from('community_media_interactions').insert([{
              media_id: id,
              user_id: user.id,
              interaction_type: type
          }]);

          await supabase.from('community_media').update({ [field]: newValue }).eq('id', id);
      } catch (error) {
          console.error(error);
          toast({ title: 'Gagal', status: 'error' });
      }
  };

  const submitComment = async () => {
      if (!user) {
          toast({ title: 'Silakan login untuk komentar', status: 'warning' });
          return;
      }
      if (!newComment.trim()) return;

      setSubmittingComment(true);
      try {
          const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

          const newEntry = {
              media_id: id,
              user_id: user.id,
              user_name: userName,
              content: newComment,
          };

          const { data, error } = await supabase
              .from('community_media_comments')
              .insert([newEntry])
              .select()
              .single();

          if (error) throw error;

          setComments([data, ...comments]);
          setNewComment('');
          toast({ title: 'Komentar ditambahkan', status: 'success' });
      } catch (error) {
          console.error(error);
          toast({ title: 'Gagal menambahkan komentar', status: 'error' });
      } finally {
          setSubmittingComment(false);
      }
  };

  const handleShare = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      toast({ title: 'Tersalin', description: 'Link postingan telah disalin', status: 'info' });
  };

  const handleDownloadAlert = () => {
      alert("Tutorial Download:\n\nPC/Desktop: Klik kanan pada media, lalu pilih 'Simpan Gambar Sebagai...'\n\nAndroid/iOS: Tekan lama pada media, lalu pilih 'Download Gambar/Video'.");
  };

  if (loading) return <Container py={20} centerContent><Spinner size="xl" /></Container>;
  if (!media) return <Container py={20} centerContent><Heading>Postingan tidak ditemukan</Heading></Container>;

  return (
    <Box pt={24} pb={32} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
      <Container maxW="3xl">
        <Button leftIcon={<FaArrowLeft />} mb={6} onClick={() => navigate('/media')}>Kembali</Button>
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" overflow="hidden" boxShadow="md">
          <HStack p={4} justify="space-between">
            <HStack>
              <Avatar size="sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${media.user_id || media.id}`} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm">{media.user_name || 'User'}</Text>
                <Text fontSize="xs" color="gray.500">{new Date(media.created_at).toLocaleString()}</Text>
              </VStack>
            </HStack>
          </HStack>

          <Box bg="black" display="flex" justifyContent="center" maxH="600px">
            {media.file_type === 'video' ? (
              <video src={media.file_url} controls style={{ maxHeight: '600px', maxWidth: '100%' }} onContextMenu={(e) => e.preventDefault()} />
            ) : (
              <Image src={media.file_url} alt={media.title} maxH="600px" objectFit="contain" />
            )}
          </Box>

          <Box p={4}>
            <HStack spacing={4} mb={3}>
              <HStack spacing={1}>
                <IconButton
                  icon={<FaHeart />}
                  variant="ghost"
                  colorScheme={userAction === 'like' ? 'red' : 'gray'}
                  rounded="full"
                  onClick={() => handleInteraction('like')}
                />
                <Text fontSize="sm" fontWeight="bold">{media.likes}</Text>
              </HStack>
              <HStack spacing={1}>
                 <IconButton
                   icon={<FaThumbsDown />}
                   variant="ghost"
                   colorScheme={userAction === 'unlike' ? 'blue' : 'gray'}
                   rounded="full"
                   onClick={() => handleInteraction('unlike')}
                 />
                 <Text fontSize="sm">{media.unlikes}</Text>
              </HStack>
              <IconButton icon={<FaComment />} variant="ghost" rounded="full" />
              <IconButton icon={<FaShare />} variant="ghost" rounded="full" onClick={handleShare} />
            </HStack>

            <Button size="xs" variant="outline" mb={4} onClick={handleDownloadAlert}>
                Cara Download
            </Button>

            <Text fontWeight="bold" mb={1}>{media.title}</Text>
            {media.description && <Text fontSize="sm" color="gray.700" mb={3}>{media.description}</Text>}

            <Divider my={4} />

            <Heading size="sm" mb={4}>Komentar ({comments.length})</Heading>

            <VStack align="stretch" spacing={3} mb={6}>
              <Textarea
                  placeholder={user ? "Tambahkan komentar..." : "Login untuk komentar"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  isDisabled={!user}
              />
              <Button
                  colorScheme="brand"
                  alignSelf="flex-end"
                  onClick={submitComment}
                  isLoading={submittingComment}
                  isDisabled={!user || !newComment.trim()}
              >
                  Kirim
              </Button>
            </VStack>

            <VStack align="stretch" spacing={4}>
              {comments.map((comment, index) => (
                <Box key={comment.id} bg={index === 0 ? "brand.50" : "gray.50"} p={3} borderRadius="md" borderWidth={index === 0 ? "1px" : "0"} borderColor="brand.200">
                  {index === 0 && <Text fontSize="xs" color="brand.600" fontWeight="bold" mb={1}>Komentar Teratas</Text>}
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold" fontSize="sm">{comment.user_name}</Text>
                    <Text fontSize="xs" color="gray.500">{new Date(comment.created_at).toLocaleDateString()}</Text>
                  </HStack>
                  <Text fontSize="sm">{comment.content}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MediaDetail;
