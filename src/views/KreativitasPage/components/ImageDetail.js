import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, VStack, HStack, Text, IconButton, Image, Avatar,
  Spinner, Heading, Divider, Textarea, Button, useToast
} from '@chakra-ui/react';
import { FaHeart, FaShare, FaArrowLeft, FaDownload } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const ImageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  useEffect(() => {
    fetchImageAndComments();
    if (user) checkLikeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchImageAndComments = async () => {
    try {
      setLoading(true);
      const { data: imgData, error: imgError } = await supabase
        .from('ai_images')
        .select('*')
        .eq('id', id)
        .single();

      if (imgError) throw imgError;
      setImage(imgData);

      const { data: commentsData, error: commentsError } = await supabase
        .from('ai_image_comments')
        .select('*')
        .eq('image_id', id)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error) {
      console.error(error);
      toast({ title: 'Gagal memuat', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async () => {
      try {
          const { data } = await supabase
              .from('ai_image_interactions')
              .select('id')
              .eq('image_id', id)
              .eq('user_id', user.id)
              .eq('interaction_type', 'like')
              .single();
          if (data) setHasLiked(true);
      } catch (err) {
          // not liked yet
      }
  };

  const handleLike = async () => {
      if (!user) {
          toast({ title: 'Silakan login', status: 'warning' });
          return;
      }

      try {
          if (hasLiked) {
              // Unlike
              await supabase.from('ai_image_interactions').delete().match({ image_id: id, user_id: user.id, interaction_type: 'like' });
              const newLikes = image.likes - 1;
              await supabase.from('ai_images').update({ likes: newLikes }).eq('id', id);
              setImage({ ...image, likes: newLikes });
              setHasLiked(false);
          } else {
              // Like
              await supabase.from('ai_image_interactions').insert([{ image_id: id, user_id: user.id, interaction_type: 'like' }]);
              const newLikes = image.likes + 1;
              await supabase.from('ai_images').update({ likes: newLikes }).eq('id', id);
              setImage({ ...image, likes: newLikes });
              setHasLiked(true);
          }
      } catch (error) {
          console.error(error);
          toast({ title: 'Gagal memproses', status: 'error' });
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

          const { data, error } = await supabase
              .from('ai_image_comments')
              .insert([{
                  image_id: id,
                  user_id: user.id,
                  user_name: userName,
                  text: newComment,
              }])
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

  const handleShare = async () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      toast({ title: 'Tersalin', description: 'Link telah disalin', status: 'info' });

      // Increment share counter quietly
      try {
          const newShares = (image.shares || 0) + 1;
          await supabase.from('ai_images').update({ shares: newShares }).eq('id', id);
          setImage({ ...image, shares: newShares });
      } catch (err) {
          // ignore
      }
  };

  if (loading) return <Container py={20} centerContent><Spinner size="xl" /></Container>;
  if (!image) return <Container py={20} centerContent><Heading>Gambar tidak ditemukan atau privat</Heading></Container>;

  return (
    <Box pt={24} pb={32} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">

        <style dangerouslySetInnerHTML={{__html: `
        .loader {
          display: inline-grid;
          width: 80px;
          aspect-ratio: 1;
          overflow: hidden;
          background:
           conic-gradient(from 146deg at 50% 1%,#0000, #91492A 2deg 65deg,#0000 68deg)
           -5% 100%/20% 27% repeat-x;
        }
        .loader:before {
          content:"";
          margin: 12.5%;
          clip-path: polygon(100% 50%,78.19% 60.26%,88.3% 82.14%,65% 75.98%,58.68% 99.24%,44.79% 79.54%,25% 93.3%,27.02% 69.28%,3.02% 67.1%,20% 50%,3.02% 32.9%,27.02% 30.72%,25% 6.7%,44.79% 20.46%,58.68% 0.76%,65% 24.02%,88.3% 17.86%,78.19% 39.74%);
          background: #CF6F46;
          animation: l7 3s linear infinite;
          translate: -135% 0;
        }
        @keyframes l7 {to{rotate: 400deg;translate: 135% 0}}
        `}} />

        <Container maxW="3xl">
        <Button leftIcon={<FaArrowLeft />} mb={6} onClick={() => navigate(-1)}>Kembali</Button>
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" overflow="hidden" boxShadow="md">
          <HStack p={4} justify="space-between">
            <HStack>
              <Avatar size="sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${image.user_id}`} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm">{image.user_name || 'User'}</Text>
                <Text fontSize="xs" color="gray.500">{new Date(image.created_at).toLocaleString()}</Text>
              </VStack>
            </HStack>
          </HStack>

          <Box bg="black" display="flex" justifyContent="center" maxH="600px">
            <Image src={image.image_url} alt={image.prompt} maxH="600px" objectFit="contain" fallback={<Box display="flex" w="full" h="full" alignItems="center" justifyContent="center"><div className="loader"></div></Box>} />
          </Box>

          <Box p={4}>
            <HStack spacing={4} mb={3}>
              <HStack spacing={1}>
                <IconButton
                  icon={<FaHeart />}
                  variant="ghost"
                  colorScheme={hasLiked ? 'red' : 'gray'}
                  rounded="full"
                  onClick={handleLike}
                />
                <Text fontSize="sm" fontWeight="bold">{image.likes}</Text>
              </HStack>

              <HStack spacing={1}>
                <IconButton icon={<FaShare />} variant="ghost" rounded="full" onClick={handleShare} />
                <Text fontSize="sm">{image.shares || 0}</Text>
              </HStack>

              <IconButton icon={<FaDownload />} variant="ghost" rounded="full" onClick={() => alert("PC/Desktop: Klik kanan -> Simpan Gambar\nAndroid/iOS: Tekan Lama -> Download")} />
            </HStack>

            <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} mb={4} fontStyle="italic">"{image.prompt}"</Text>

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
                  colorScheme="purple"
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
                <Box key={comment.id} bg={index === 0 ? "purple.50" : "gray.50"} _dark={{ bg: index === 0 ? "purple.900" : "gray.700" }} p={3} borderRadius="md" borderWidth={index === 0 ? "1px" : "0"} borderColor="purple.200">
                  {index === 0 && <Text fontSize="xs" color="purple.600" _dark={{ color: "purple.300" }} fontWeight="bold" mb={1}>Komentar Teratas</Text>}
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold" fontSize="sm">{comment.user_name}</Text>
                    <Text fontSize="xs" color="gray.500">{new Date(comment.created_at).toLocaleDateString()}</Text>
                  </HStack>
                  <Text fontSize="sm">{comment.text}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ImageDetail;
