const fs = require('fs');

let portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

// Insert states and hooks inside PortalPage
const hookInsertionPoint = "const PortalPage = () => {";
const hookInsertion = `const PortalPage = () => {
  const [waNumber, setWaNumber] = useState('');
  const [waLoading, setWaLoading] = useState(false);
  const location = useLocation();`;

portal = portal.replace(hookInsertionPoint, hookInsertion);

// Insert logic inside useEffect
const useEffectPoint = `setStats({
          complaints: complaintsData.count || 0,
          gamesPlayed: gamesData.count || 0,
          quranProgress: quranData.data ? \`Surah \${quranData.data.surah_number}: Ayat \${quranData.data.ayah_number}\` : 'Mulai baca'
        });`;

const verificationLogic = `setStats({
          complaints: complaintsData.count || 0,
          gamesPlayed: gamesData.count || 0,
          quranProgress: quranData.data ? \`Surah \${quranData.data.surah_number}: Ayat \${quranData.data.ayah_number}\` : 'Mulai baca'
        });

        // Check for WA verification token in URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('verify_wa');
        if (token && authUser) {
            const savedToken = localStorage.getItem('wa_verification_token');
            const savedNumber = localStorage.getItem('wa_verification_number');
            if (token === savedToken && savedNumber) {
                // Verify WA
                const { error } = await supabase.auth.updateUser({
                    data: {
                        whatsapp_verified: true,
                        whatsapp_number: savedNumber
                    }
                });
                if (!error) {
                    toast({ title: 'WhatsApp berhasil diverifikasi!', status: 'success', duration: 5000 });
                    localStorage.removeItem('wa_verification_token');
                    localStorage.removeItem('wa_verification_number');
                    // Refresh user data
                    const { data: { user: updatedUser } } = await supabase.auth.getUser();
                    setUser(updatedUser);
                    // Remove query param
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
                    toast({ title: 'Gagal verifikasi WhatsApp', description: error.message, status: 'error', duration: 5000 });
                }
            } else {
                toast({ title: 'Link verifikasi tidak valid atau kadaluarsa', status: 'error', duration: 5000 });
            }
        }`;

portal = portal.replace(useEffectPoint, verificationLogic);

// Insert handleSendWaLink
const handleLogoutPoint = "const handleLogout = async () => {";
const handleSendWaLink = `const handleSendWaLink = async () => {
    if (!waNumber) {
        toast({ title: 'Masukkan nomor WhatsApp', status: 'warning', duration: 3000 });
        return;
    }

    // Check 3 hours limit
    const lastSent = localStorage.getItem('wa_last_sent');
    if (lastSent) {
        const timeDiff = new Date().getTime() - parseInt(lastSent);
        const hoursDiff = timeDiff / (1000 * 3600);
        if (hoursDiff < 3) {
            toast({ title: 'Tunggu 3 Jam', description: 'Anda baru saja meminta link verifikasi. Silakan tunggu 3 jam untuk meminta lagi.', status: 'warning', duration: 5000 });
            return;
        }
    }

    setWaLoading(true);
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('wa_verification_token', token);
    localStorage.setItem('wa_verification_number', waNumber);
    localStorage.setItem('wa_last_sent', new Date().getTime().toString());

    const verifyLink = \`\${window.location.origin}/portal?verify_wa=\${token}\`;

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: waNumber,
          message: \`Halo! Klik link berikut untuk memverifikasi nomor WhatsApp Anda di Portal Desa Ngawonggo:\\n\\n\${verifyLink}\\n\\nAbaikan pesan ini jika Anda tidak memintanya.\`
        })
      });
      if (!response.ok) throw new Error('Gagal mengirim pesan');

      toast({
        title: 'Link Terkirim!',
        description: 'Silakan cek WhatsApp Anda dan klik link yang diberikan.',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
      // Reset limit so they can try again if it fails
      localStorage.removeItem('wa_last_sent');
    } finally {
      setWaLoading(false);
    }
  };

  `;

portal = portal.replace(handleLogoutPoint, handleSendWaLink + handleLogoutPoint);

// Insert UI component
const benefitsCardPoint = "{/* Benefits Info Card */}";
const waSection = `{/* WhatsApp Verification Card */}
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="3xl"
            bg="white"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack align="start" spacing={4}>
                <HStack>
                    <Icon as={FaWhatsapp} color="#25D366" boxSize={6} />
                    <Heading size="md" color="gray.800">Verifikasi WhatsApp</Heading>
                </HStack>

                {user?.user_metadata?.whatsapp_verified ? (
                    <Alert status="success" borderRadius="xl">
                        <AlertIcon as={FaCheckCircle} />
                        <Box>
                            <AlertTitle>Nomor Terverifikasi</AlertTitle>
                            <AlertDescription fontSize="sm">
                                Nomor WhatsApp Anda ({user?.user_metadata?.whatsapp_number}) sudah terhubung. Anda akan menerima notifikasi dari Admin jika ada update layanan.
                            </AlertDescription>
                        </Box>
                    </Alert>
                ) : (
                    <Box w="full">
                        <Text fontSize="sm" color="gray.600" mb={4}>
                            Verifikasi nomor WhatsApp Anda (Tidak Wajib). Keuntungan:
                            <UnorderedList mt={2} pl={4}>
                                <ListItem>Menerima notifikasi update pengaduan langsung ke WA Anda.</ListItem>
                                <ListItem>Mendapatkan informasi terbaru dari Admin Desa Ngawonggo.</ListItem>
                                <ListItem>Membuka fitur eksklusif di masa mendatang.</ListItem>
                            </UnorderedList>
                        </Text>
                        <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ base: 'stretch', md: 'flex-end' }}>
                            <FormControl flex={1}>
                                <FormLabel fontSize="sm" color="gray.600">Nomor WhatsApp</FormLabel>
                                <Input
                                    type="tel"
                                    placeholder="Contoh: 62812xxxx"
                                    value={waNumber}
                                    onChange={(e) => setWaNumber(e.target.value)}
                                    borderRadius="xl"
                                    h="50px"
                                />
                            </FormControl>
                            <Button
                                colorScheme="whatsapp"
                                h="50px"
                                borderRadius="xl"
                                px={8}
                                isLoading={waLoading}
                                onClick={handleSendWaLink}
                                leftIcon={<FaWhatsapp />}
                            >
                                Kirim Link Verifikasi
                            </Button>
                        </Flex>
                        <Text fontSize="xs" color="gray.400" mt={3}>
                            *Batas permintaan link verifikasi adalah 1 kali per 3 jam untuk menghindari spam.
                        </Text>
                    </Box>
                )}
            </VStack>
          </Box>\n\n          `;

portal = portal.replace(benefitsCardPoint, waSection + benefitsCardPoint);

// Ensure Alert is imported
if (!portal.includes('Alert,')) {
    portal = portal.replace('Tooltip,', 'Tooltip,\n  Alert,\n  AlertIcon,\n  AlertTitle,\n  AlertDescription,\n  UnorderedList,\n  ListItem,');
}

fs.writeFileSync('src/views/PortalPage/index.js', portal);
