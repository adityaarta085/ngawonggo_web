import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, Heading, Text, Avatar, Button, Input, useColorModeValue, Center, Spinner, useToast } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';

const AvatarCustomization = ({ session, setScreen }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const bg = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const toast = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('geo_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setProfile(data);
        setUsername(data.username || session.user.user_metadata?.full_name || '');
        setAvatarUrl(data.avatar_url || session.user.user_metadata?.avatar_url || '');
      } else if (error?.code === 'PGRST116') {
        // Not found, create one
        setUsername(session.user.user_metadata?.full_name || 'Player' + Math.floor(Math.random() * 1000));
        setAvatarUrl(session.user.user_metadata?.avatar_url || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  const handleUploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Anda harus memilih gambar.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/avatar_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (data?.publicUrl) {
          setAvatarUrl(data.publicUrl);
          toast({ title: 'Gambar berhasil diunggah!', status: 'success', isClosable: true });
      }

    } catch (error) {
      toast({ title: 'Gagal mengunggah gambar', description: error.message, status: 'error', isClosable: true });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);

    const updates = {
      id: session.user.id,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date()
    };

    const { error } = await supabase.from('geo_profiles').upsert(updates);

    if (error) {
      toast({ title: 'Gagal menyimpan profil', description: error.message, status: 'error', isClosable: true });
    } else {
      toast({ title: 'Profil disimpan!', status: 'success', isClosable: true });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Center h="full" bg={bg}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box w="full" h="full" bg={bg} color="white" p={{ base: 4, md: 8 }} overflowY="auto">
      <Button leftIcon={<FaArrowLeft />} variant="ghost" mb={4} onClick={() => setScreen('menu')}>
        Kembali
      </Button>

      <Center>
        <VStack spacing={6} bg={cardBg} p={8} borderRadius="xl" shadow="xl" w="full" maxW="md">
          <Heading size="md">Kustomisasi Profil</Heading>

          <VStack>
            <Avatar size="2xl" src={avatarUrl} name={username} />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleUploadAvatar}
              disabled={uploading}
            />
            <Button
                size="sm"
                leftIcon={<FaUpload />}
                onClick={() => fileInputRef.current.click()}
                isLoading={uploading}
            >
                Ubah Gambar
            </Button>
          </VStack>

          <Box w="full">
            <Text mb={2}>Username</Text>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              bg="gray.800"
              borderColor="gray.600"
            />
          </Box>

          {profile && (
            <VStack w="full" align="start" bg="gray.800" p={4} borderRadius="md" spacing={1}>
              <Text fontSize="sm" color="gray.400">Statistik</Text>
              <Text fontWeight="bold">Level: {profile.level}</Text>
              <Text fontWeight="bold">XP: {profile.xp}</Text>
              <Text fontWeight="bold">Total Match: {profile.total_matches}</Text>
            </VStack>
          )}

          <Button
            leftIcon={<FaSave />}
            colorScheme="teal"
            w="full"
            onClick={handleSave}
            isLoading={saving}
          >
            Simpan
          </Button>
        </VStack>
      </Center>
    </Box>
  );
};

export default AvatarCustomization;
