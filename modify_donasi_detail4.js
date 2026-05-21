const fs = require('fs');
let content = fs.readFileSync('src/views/DonasiPage/DonasiDetail.js', 'utf8');

// 6. Update UI for Countdown Timer
const uiTarget = `                        {paymentData.qr_image && (
                            <Box border="1px solid" borderColor="gray.200" p={4} borderRadius="lg" bg="white">
                                <Text fontSize="sm" fontWeight="bold" mb={2}><Icon as={FaQrcode} /> Scan QRIS</Text>
                                <Image src={paymentData.qr_image} alt="QRIS" boxSize="200px" objectFit="contain" />
                            </Box>
                        )}`;

const uiReplacement = `                        {paymentData.qr_image && (
                            <Box border="1px solid" borderColor="gray.200" p={4} borderRadius="lg" bg="white" position="relative">
                                <Text fontSize="sm" fontWeight="bold" mb={2}><Icon as={FaQrcode} /> Scan QRIS</Text>
                                <Image src={paymentData.qr_image} alt="QRIS" boxSize="200px" objectFit="contain" />

                                <Box mt={4} p={3} bg="red.50" color="red.600" borderRadius="md" fontWeight="bold">
                                    <Text fontSize="sm" mb={1}>Selesaikan pembayaran dalam</Text>
                                    <Text fontSize="xl">
                                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                                        {(timeLeft % 60).toString().padStart(2, '0')}
                                    </Text>
                                </Box>
                            </Box>
                        )}`;

content = content.replace(uiTarget, uiReplacement);

// 7. format time utility function helper, just in case
// 8. Fix the repeated loading states for different buttons
const btnTarget = `                                <Button onClick={() => window.location.reload()} colorScheme="brand" w="full" mt={4}>
                                    Donasi Lagi
                                </Button>`;
const btnReplacement = `                                <Button onClick={() => navigate('/donasi')} colorScheme="brand" w="full" mt={4}>
                                    Donasi Lagi
                                </Button>`;

const btnTarget2 = `                                <Button onClick={() => window.location.reload()} colorScheme="brand" w="full" mt={4}>
                                    Ulangi Transaksi
                                </Button>`;
const btnReplacement2 = `                                <Button onClick={() => navigate(\`/donasi/\${id}\`)} colorScheme="brand" w="full" mt={4}>
                                    Ulangi Transaksi
                                </Button>`;

content = content.replace(btnTarget, btnReplacement);
content = content.replace(btnTarget2, btnReplacement2);

fs.writeFileSync('src/views/DonasiPage/DonasiDetail.js', content, 'utf8');
