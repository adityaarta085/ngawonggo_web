const fs = require('fs');

let auth = fs.readFileSync('src/views/AuthPage/index.js', 'utf8');

// Replace everything from "{step === 1 ? (" to the closing brackets before "</Box>"
const startTag = "{step === 1 ? (";
const endTag = ") : null}";

const startIndex = auth.indexOf(startTag);
const endIndex = auth.indexOf(endTag) + endTag.length;

const replacement = `
            <>
            <VStack spacing={4} w="full">
              <Button
                w='full'
                variant='outline'
                leftIcon={<FaGoogle color="#EA4335" />}
                onClick={handleGoogleLogin}
                borderRadius='xl'
                h='50px'
                isLoading={loading}
                disabled={loading}
                _hover={{ bg: 'gray.50' }}
              >
                Lanjutkan dengan Google
              </Button>

              <Accordion allowToggle w="full">
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton _hover={{ bg: 'transparent' }} px={0}>
                      <Box flex="1" textAlign="center" fontSize="sm" color="gray.500">
                        Tampilkan metode login lainnya
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} px={0}>
                    <VStack spacing={4}>
                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaDiscord color="#5865F2" />}
                        onClick={handleDiscordLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan Discord
                        <Badge colorScheme='green' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>NEW</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaTwitter color="#1DA1F2" />}
                        onClick={handleTwitterLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan X
                        <Badge colorScheme='green' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>NEW</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaSpotify color="#1DB954" />}
                        onClick={handleSpotifyLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan Spotify
                        <Badge colorScheme='blue' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>BETA</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaFacebook color='#1877F2' />}
                        onClick={handleFacebookLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan Facebook
                        <Badge colorScheme='blue' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>BETA</Badge>
                      </Button>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>

            <HStack w='full' mb={6} mt={2}>
              <Divider />
              <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">Atau gunakan Email</Text>
              <Divider />
            </HStack>

            <Tabs isFitted variant="soft-rounded" colorScheme="brand" onChange={(index) => setIsSignUp(index === 1)}>
              <TabList mb={6} bg="gray.100" p={1} borderRadius='full'>
                <Tab borderRadius="full" fontSize="sm" fontWeight="600">Masuk</Tab>
                <Tab borderRadius="full" fontSize="sm" fontWeight="600">Daftar</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <form onSubmit={handleAuth}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan email"
                          bg="white"
                          borderRadius='xl'
                          h='50px'
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Password</FormLabel>
                        <InputGroup h='50px'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            bg="white"
                            borderRadius='xl'
                            h='50px'
                            focusBorderColor="brand.500"
                          />
                          <InputRightElement h='50px'>
                            <IconButton
                              variant="ghost"
                              icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label="Toggle password"
                              _hover={{ bg: 'transparent' }}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="brand"
                        w="full"
                        size="lg"
                        isLoading={loading}
                        borderRadius='xl'
                        h='50px'
                        mt={2}
                      >
                        Masuk Sekarang
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>
                <TabPanel p={0}>
                  <form onSubmit={handleAuth}>
                     <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan email"
                          bg="white"
                          borderRadius='xl'
                          h='50px'
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Password</FormLabel>
                        <InputGroup h='50px'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Buat password"
                            bg="white"
                            borderRadius='xl'
                            h='50px'
                            focusBorderColor="brand.500"
                          />
                          <InputRightElement h='50px'>
                            <IconButton
                              variant="ghost"
                              icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label="Toggle password"
                              _hover={{ bg: 'transparent' }}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="brand"
                        w="full"
                        size="lg"
                        isLoading={loading}
                        borderRadius='xl'
                        h='50px'
                        mt={2}
                      >
                        Daftar Sekarang
                      </Button>
                   </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
            </>
`;

if (startIndex !== -1 && endIndex !== -1) {
    auth = auth.substring(0, startIndex) + replacement + auth.substring(endIndex);
}

// Ensure Accordion is imported
if (!auth.includes('Accordion,')) {
    auth = auth.replace('Tabs,', 'Tabs,\n  Accordion,\n  AccordionItem,\n  AccordionButton,\n  AccordionPanel,\n  AccordionIcon,');
}

fs.writeFileSync('src/views/AuthPage/index.js', auth);
