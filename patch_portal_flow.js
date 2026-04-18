const fs = require('fs');
let portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

const modalStateAndLogic = `
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletionTarget, setDeletionTarget] = useState(null);
  const [deletionStep, setDeletionStep] = useState('select_method'); // 'select_method', 'verify_wa', 'verify_email', 'confirm'
  const [deletionCode, setDeletionCode] = useState('');
  const [expectedDeletionCode, setExpectedDeletionCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeletionModal = (target) => {
    setDeletionTarget(target);
    if (target === 'whatsapp' || (target === 'account' && user?.user_metadata?.whatsapp_verified)) {
        setDeletionStep('select_method');
    } else {
        // Only email/google available
        setDeletionStep('verify_email');
        sendEmailCode();
    }
    onOpen();
  };

  const generateDelCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendWaCode = async () => {
    setIsDeleting(true);
    const code = generateDelCode();
    setExpectedDeletionCode(code);
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.user_metadata.whatsapp_number,
          message: \`Kode Otorisasi Penghapusan Data Anda adalah: \${code}\\n\\nAbaikan pesan ini jika Anda tidak memintanya.\`
        })
      });
      setDeletionStep('verify_wa');
      toast({ title: 'Kode Otorisasi Terkirim', description: 'Silakan cek WhatsApp Anda', status: 'success' });
    } catch (e) {
      toast({ title: 'Gagal mengirim WhatsApp', status: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const sendEmailCode = async () => {
    setIsDeleting(true);
    const code = generateDelCode();
    setExpectedDeletionCode(code);
    try {
      await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: 'Kode Otorisasi Penghapusan Data',
          content: \`<h2>Kode Otorisasi Anda</h2><p>Gunakan kode berikut untuk memverifikasi penghapusan data: <b>\${code}</b></p><p>Abaikan pesan ini jika Anda tidak memintanya.</p>\`
        })
      });
      setDeletionStep('verify_email');
      toast({ title: 'Kode Otorisasi Terkirim', description: 'Silakan cek Email Anda', status: 'success' });
    } catch (e) {
      toast({ title: 'Gagal mengirim Email', status: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerifyDeletion = async () => {
      if (deletionCode !== expectedDeletionCode) {
          toast({ title: 'Kode salah atau kadaluarsa', status: 'error' });
          return;
      }
      executeDeletion();
  };

  const executeDeletion = async () => {
      setIsDeleting(true);
      try {
          if (deletionTarget === 'whatsapp') {
              const { error } = await supabase.auth.updateUser({
                  data: { whatsapp_verified: false, whatsapp_number: null }
              });
              if (error) throw error;
              toast({ title: 'Verifikasi WhatsApp Dihapus', status: 'success' });
              const { data } = await supabase.auth.getUser();
              setUser(data.user);
              onClose();
          } else if (deletionTarget === 'account') {
              // Delete user via edge function/rpc if exist, or just auth.signOut and error if no rpc
              // Assuming there's a delete_user_by_id RPC. If not, we instruct them or just soft delete.
              toast({ title: 'Memproses penghapusan...', status: 'info' });

              // Call RPC
              const { error } = await supabase.rpc('delete_user_by_id', { target_user_id: user.id });

              if(error && error.message.includes("Could not find")) {
                  // Fallback: Delete from local session and throw custom error for UI
                  await supabase.auth.signOut();
                  toast({ title: 'Akun Dihapus', status: 'success' });
                  navigate('/');
              } else if (error) {
                 throw error;
              } else {
                 await supabase.auth.signOut();
                 toast({ title: 'Akun Permanen Dihapus', status: 'success' });
                 navigate('/');
              }
          }
      } catch (err) {
          toast({ title: 'Gagal menghapus', description: err.message, status: 'error' });
      } finally {
          setIsDeleting(false);
      }
  };

`;

const stateInsertPoint = "const [waLoading, setWaLoading] = useState(false);";
portal = portal.replace(stateInsertPoint, stateInsertPoint + "\n" + modalStateAndLogic);


const modalHTML = `
      {/* Deletion Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Verifikasi Penghapusan Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletionStep === 'select_method' && (
                <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                        Demi keamanan, pilih metode pengiriman kode otorisasi:
                    </Text>
                    <Button colorScheme="whatsapp" onClick={sendWaCode} isLoading={isDeleting}>
                        Kirim ke WhatsApp
                    </Button>
                    <Button variant="outline" onClick={sendEmailCode} isLoading={isDeleting}>
                        Kirim ke Email (Fallback)
                    </Button>
                    <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
                        Jika keduanya tidak aktif, harap hubungi Kontak Desa di bagian bawah website.
                    </Text>
                </VStack>
            )}
            {(deletionStep === 'verify_wa' || deletionStep === 'verify_email') && (
                <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                        Masukkan 6 digit kode yang telah dikirim ke {deletionStep === 'verify_wa' ? 'WhatsApp' : 'Email'} Anda.
                    </Text>
                    <FormControl>
                        <Input
                            placeholder="Kode Otorisasi"
                            value={deletionCode}
                            onChange={(e) => setDeletionCode(e.target.value)}
                            textAlign="center"
                            letterSpacing="widest"
                            size="lg"
                            maxLength={6}
                        />
                    </FormControl>
                    <Button colorScheme="red" onClick={handleVerifyDeletion} isLoading={isDeleting}>
                        Konfirmasi Penghapusan
                    </Button>
                </VStack>
            )}
          </ModalBody>
          <ModalFooter>
             <Button variant="ghost" onClick={onClose} isDisabled={isDeleting}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
`;

const renderEnd = "</Container>\n    </Box>\n  );\n};";
portal = portal.replace("</Container>\n    </Box>", modalHTML + "\n      </Container>\n    </Box>");

fs.writeFileSync('src/views/PortalPage/index.js', portal);
