import React, { useEffect, useState } from 'react';
import { Box, Container, VStack, Heading, Text, Button, Icon, HStack, Badge, Spinner, Center, IconButton } from '@chakra-ui/react';
import { FaBell, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaGift, FaTrash } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const NotifikasiPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('user_notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setNotifications(data);
        }
        setLoading(false);
    };


    const deleteNotification = async (id, e) => {
        if (e) e.stopPropagation();
        await supabase.from('user_notifications').delete().eq('id', id);
        fetchNotifications();
    };

    const markAsRead = async (id) => {
        await supabase.from('user_notifications').update({ is_read: true }).eq('id', id);
        fetchNotifications();
    };

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('user_notifications').update({ is_read: true }).eq('user_id', user.id);
        fetchNotifications();
    };

    useEffect(() => {
        fetchNotifications();

        const setupSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(!user) return;
            const channel = supabase
              .channel('schema-db-changes')
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'user_notifications',
                  filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (Notification.permission === 'granted') {
                        if ('serviceWorker' in navigator) {
                            navigator.serviceWorker.ready.then(registration => {
                                registration.showNotification(payload.new.title, { body: payload.new.message, icon: '/logo192.png' });
                            }).catch(() => {
                                new Notification(payload.new.title, { body: payload.new.message });
                            });
                        } else {
                            new Notification(payload.new.title, { body: payload.new.message });
                        }
                    }
                    setNotifications(prev => [payload.new, ...prev]);
                }
              )
              .subscribe();
            return () => {
              supabase.removeChannel(channel);
            }
        };

        setupSubscription();
    }, []);

    const requestPermission = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification("Notifikasi Aktif!", { body: "Anda akan menerima notifikasi real-time dari sistem.", icon: '/logo192.png' });
                        }).catch(() => {
                            new Notification("Notifikasi Aktif!", { body: "Anda akan menerima notifikasi real-time dari sistem." });
                        });
                    } else {
                        new Notification("Notifikasi Aktif!", { body: "Anda akan menerima notifikasi real-time dari sistem." });
                    }
                }
            });
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <Icon as={FaCheckCircle} color="green.500" />;
            case 'warning': return <Icon as={FaExclamationTriangle} color="orange.500" />;
            case 'gift': return <Icon as={FaGift} color="purple.500" />;
            default: return <Icon as={FaInfoCircle} color="blue.500" />;
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <HStack mb={6} justify="space-between">
                <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate('/portal')}>
                    Kembali
                </Button>
                <Button size="sm" colorScheme="blue" variant="outline" onClick={requestPermission}>
                    Aktifkan Push Notif
                </Button>
                <Button size="sm" colorScheme="purple" variant="outline" onClick={() => {
                    if (Notification.permission === "granted") {
                        if ('serviceWorker' in navigator) {
                            navigator.serviceWorker.ready.then(registration => {
                                registration.showNotification("Test Notifikasi", { body: "Push notifikasi kamu berfungsi dengan baik!", icon: '/logo192.png' });
                            }).catch(() => {
                                new Notification("Test Notifikasi", { body: "Push notifikasi kamu berfungsi dengan baik!" });
                            });
                        } else {
                            new Notification("Test Notifikasi", { body: "Push notifikasi kamu berfungsi dengan baik!" });
                        }
                    } else {
                        alert("Izinkan notifikasi terlebih dahulu!");
                    }
                }}>
                    Test Push Notif
                </Button>
            </HStack>

            <HStack justify="space-between" mb={6}>
                <HStack>
                    <Icon as={FaBell} boxSize={6} color="brand.500" />
                    <Heading size="lg">Notifikasi</Heading>
                </HStack>
                {notifications.some(n => !n.is_read) && (
                    <Button size="sm" onClick={markAllAsRead}>Tandai semua dibaca</Button>
                )}
            </HStack>

            {loading ? (
                <Center py={10}><Spinner size="xl" color="brand.500" /></Center>
            ) : notifications.length === 0 ? (
                <Center py={10} bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="xl">
                    <Text color="gray.500">Belum ada notifikasi.</Text>
                </Center>
            ) : (
                <VStack align="stretch" spacing={4}>
                    {notifications.map(notif => (
                        <Box
                            key={notif.id}
                            p={4}
                            bg={notif.is_read ? "white" : "blue.50"}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={notif.is_read ? "gray.200" : "blue.200"}
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                            cursor={notif.is_read ? "default" : "pointer"}
                            transition="all 0.2s"
                            _hover={{ borderColor: 'blue.300' }}
                        >
                            <HStack align="start" spacing={4}>
                                <Box mt={1}>{getIcon(notif.type)}</Box>
                                <VStack align="start" spacing={1} flex={1}>
                                    <HStack w="full" justify="space-between">
                                        <Text fontWeight="bold" color={notif.is_read ? "gray.700" : "black"}>
                                            {notif.title}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.600">{notif.message}</Text>
                                    {notif.action_link && (
                                        <Button as="a" href={notif.action_link} target="_blank" size="xs" colorScheme="blue" variant="outline" mt={2}>
                                            Lihat Detail
                                        </Button>
                                    )}
                                    {!notif.is_read && <Badge colorScheme="blue" variant="subtle" mt={notif.action_link ? 1 : 2}>Baru</Badge>}
                                </VStack>
                                <IconButton
                                    icon={<FaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={(e) => deleteNotification(notif.id, e)}
                                    aria-label="Hapus Notifikasi"
                                />
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}
        </Container>
    );
};

export default NotifikasiPage;
