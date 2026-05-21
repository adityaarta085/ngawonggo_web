import React, { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Text, useToast, Container, Image } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const CSLogin = ({ setCsSession }) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username.trim()) return;
        setLoading(true);
        try {
            const { data, error } = await supabase.from('usersCS').select('*').eq('username', username.trim()).single();

            if (error || !data) {
                toast({ title: 'Gagal', description: 'Username tidak ditemukan.', status: 'error' });
                return;
            }

            await supabase.from('usersCS').update({ status: 'online' }).eq('id', data.id);

            localStorage.setItem('csSession', JSON.stringify(data));
            setCsSession(data);
            navigate('/admin/cs');
        } catch (err) {
            toast({ title: 'Error', description: err.message, status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} display="flex" alignItems="center" justifyContent="center">
            <Container maxW="md" bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" boxShadow="lg">
                <VStack spacing={6}>
                    <Image src="/logo192.png" h="60px" />
                    <Heading size="md">Login Customer Service</Heading>
                    <Text color="gray.500" fontSize="sm" textAlign="center">Masukkan username CS Anda untuk mulai melayani warga.</Text>

                    <Input
                        placeholder="Username CS..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    />

                    <Button colorScheme="blue" w="full" onClick={handleLogin} isLoading={loading}>Masuk</Button>
                </VStack>
            </Container>
        </Box>
    );
};

export default CSLogin;
