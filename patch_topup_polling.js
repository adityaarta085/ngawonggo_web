const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/TopupPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add timer logic
const stateSearch = `  const [history, setHistory] = useState([]);

  const toast = useToast();`;
const stateReplace = `  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  const toast = useToast();

  useEffect(() => {
    let timer;
    if (isModalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsModalOpen(false);
      toast({ title: 'Waktu habis', description: 'Sesi QRIS telah kedaluwarsa.', status: 'warning' });
    }
    return () => clearInterval(timer);
  }, [isModalOpen, timeLeft, toast]);

  useEffect(() => {
    let interval;
    if (isModalOpen && qrisData) {
      interval = setInterval(checkPaymentStatus, 5000);
    }
    return () => clearInterval(interval);
  }, [isModalOpen, qrisData]);`;

content = content.replace(stateSearch, stateReplace);

// 2. Add Timer UI inside modal and remove manual 'Saya Sudah Bayar' check requirement
const modalSearch = `              <Box p={4} bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.100">
                  {qrisData?.qr_url ? (
                      <Image src={qrisData.qr_url} alt="QRIS" boxSize="250px" />
                  ) : (
                      <Center boxSize="250px" bg="gray.50" borderRadius="lg">
                          <Text color="gray.400">QR Code Error</Text>
                      </Center>
                  )}
              </Box>

              <VStack w="full" spacing={2} bg="gray.50" p={4} borderRadius="xl">
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">Total Bayar:</Text>
                      <Text fontWeight="bold" fontSize="lg" color="brand.600">Rp {qrisData?.package?.price?.toLocaleString('id-ID')}</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">Mendapatkan:</Text>
                      <HStack color="yellow.500">
                          <Icon as={FaCoins} />
                          <Text fontWeight="bold">{qrisData?.package?.coins}</Text>
                      </HStack>
                  </HStack>
              </VStack>

              <Button w="full" colorScheme="blue" size="lg" onClick={checkPaymentStatus}>
                  Saya Sudah Bayar
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>`;

const modalReplace = `              <VStack spacing={1}>
                  <Text fontWeight="bold" color="red.500" fontSize="xl">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </Text>
                  <Text fontSize="xs" color="gray.500">Selesaikan sebelum waktu habis</Text>
              </VStack>

              <Box p={4} bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.100">
                  {qrisData?.qr_url ? (
                      <Image src={qrisData.qr_url} alt="QRIS" boxSize="250px" />
                  ) : (
                      <Center boxSize="250px" bg="gray.50" borderRadius="lg">
                          <Text color="gray.400">QR Code Error</Text>
                      </Center>
                  )}
              </Box>

              <VStack w="full" spacing={2} bg="gray.50" p={4} borderRadius="xl">
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">ID Transaksi:</Text>
                      <Text fontWeight="bold" fontSize="xs" color="gray.700" noOfLines={1}>{qrisData?.payment_reference || '-'}</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">Total Bayar:</Text>
                      <Text fontWeight="bold" fontSize="lg" color="brand.600">Rp {qrisData?.package?.price?.toLocaleString('id-ID')}</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">Mendapatkan:</Text>
                      <HStack color="yellow.500">
                          <Icon as={FaCoins} />
                          <Text fontWeight="bold">{qrisData?.package?.coins}</Text>
                      </HStack>
                  </HStack>
                  <Badge colorScheme="blue" variant="subtle" w="full" textAlign="center" py={1} mt={2}>
                      Menunggu Pembayaran...
                  </Badge>
              </VStack>

              <Button w="full" colorScheme="blue" size="lg" onClick={checkPaymentStatus}>
                  Cek Status Manual
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>`;

content = content.replace(modalSearch, modalReplace);

// 3. Ensure reset timer when generating
const generateSearch = `        setQrisData({
            ...data.data,
            qr_url: data.data.qris_image_url || data.data.qris_url || data.data.qr_url,
            package: selectedPackage
        });
        setIsModalOpen(true);`;

const generateReplace = `        setQrisData({
            ...data.data,
            qr_url: data.data.qris_image_url || data.data.qris_url || data.data.qr_url,
            package: selectedPackage
        });
        setTimeLeft(900);
        setIsModalOpen(true);`;

content = content.replace(generateSearch, generateReplace);

// Remove toast "Belum terbayar" from polling
const checkStatusSearch = `      if (currentStatus === 'success') {
          // Grant coins
          const { error } = await supabase.rpc('process_topup_success', {
              p_user_id: targetUser.id,
              p_coins: qrisData.package.coins,
              p_trx_id: qrisData.qris_id
          });

          if (!error) {
              toast({ title: 'Pembayaran Berhasil!', description: \`\${qrisData.package.coins} Koin telah ditambahkan.\`, status: 'success', duration: 5000 });
              setIsModalOpen(false);
              setQrisData(null);
              fetchHistory(targetUser.id);
          }
      } else {
          toast({ title: 'Belum terbayar', description: 'Silakan scan dan bayar melalui aplikasi E-Wallet/M-Banking Anda.', status: 'info' });
      }`;

const checkStatusReplace = `      if (currentStatus === 'success') {
          // Grant coins
          const { error } = await supabase.rpc('process_topup_success', {
              p_user_id: targetUser.id,
              p_coins: qrisData.package.coins,
              p_trx_id: qrisData.qris_id
          });

          if (!error) {
              toast({ title: 'Pembayaran Berhasil!', description: \`\${qrisData.package.coins} Koin telah ditambahkan.\`, status: 'success', duration: 5000 });
              setIsModalOpen(false);
              setQrisData(null);
              fetchHistory(targetUser.id);
          }
      }`;

content = content.replace(checkStatusSearch, checkStatusReplace);

fs.writeFileSync(filePath, content);
console.log('TopupPage injected with Realtime Polling and 15 mins Countdown');
