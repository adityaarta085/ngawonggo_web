const fs = require('fs');
const file = 'src/views/KreativitasPage/index.js';
let content = fs.readFileSync(file, 'utf8');

// I seem to have broken the JSX structure by replacing the download button poorly. Let's fix it.
content = content.replace(/<Text fontSize="xs" color="gray.400" mt=\{2\} fontStyle="italic">Tekan lama \/ klik kanan pada gambar untuk menyimpan.<\/Text>\n                    <\/Flex>\n                  <\/VStack>\n                \) : \(/g, `
                    <Button
                      size="lg"
                      colorScheme="purple"
                      bgGradient="linear(to-r, purple.500, pink.500)"
                      _hover={{ bgGradient: "linear(to-r, purple.600, pink.600)", transform: "translateY(-2px)", boxShadow: "xl" }}
                      px={8}
                      borderRadius="xl"
                      onClick={handleGenerate}
                      isLoading={isGenerating}
                      leftIcon={<FaMagic />}
                    >
                      Generate Gambar
                    </Button>
                  </Flex>

                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={3}>Template Prompt Inspirasi:</Text>
                    <Flex wrap="wrap" gap={3}>
                      {templates.map((tpl, idx) => (
                        <Badge
                          key={idx}
                          px={4}
                          py={2}
                          borderRadius="full"
                          colorScheme="purple"
                          variant="subtle"
                          cursor="pointer"
                          _hover={{ bg: "purple.100", transform: "scale(1.05)" }}
                          onClick={() => handleTemplateClick(tpl)}
                          transition="all 0.2s"
                        >
                          {tpl}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                  <Text fontSize="8px" color="gray.400" textAlign="right">(hanya sementara ini free)</Text>
                </VStack>
              </MotionBox>

              {/* Result Section */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                p={8}
                borderRadius="3xl"
                bg={cardBg}
                boxShadow="2xl"
                backdropFilter="blur(20px)"
                minH="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderColor={useColorModeValue("white", "whiteAlpha.200")}
                position="relative"
                overflow="hidden"
              >
                {isGenerating ? (
                  <VStack spacing={6}>
                    <div className="loader"></div>
                    <Text fontWeight="bold" color="purple.500" animation="pulse 2s infinite">Sedang melukis mahakarya...</Text>
                  </VStack>
                ) : generatedImageUrl ? (
                  <VStack spacing={4} w="full" h="full">
                    <Box
                        h={{ base: "450px", md: "600px" }}
                        w={{ base: "full", md: "auto" }} aspectRatio="9/16" mx="auto"
                        position="relative"
                        borderRadius="2xl"
                        overflow="hidden"
                        boxShadow="2xl"
                    >
                        <Image
                            src={generatedImageUrl}
                            alt={prompt}
                            objectFit="contain"
                            w="full"
                            h="full"
                            bg="blackAlpha.800"
                        />
                    </Box>
                    <Flex w="full" justify="space-between" align="center" px={2}>
                        <Text fontSize="sm" color="gray.500" fontStyle="italic">"{prompt}"</Text>
                        <Text fontSize="xs" color="gray.400" fontStyle="italic">Tekan lama / klik kanan pada gambar untuk menyimpan.</Text>
                    </Flex>
                  </VStack>
                ) : (`);

fs.writeFileSync(file, content);
