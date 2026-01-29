import React from 'react';
import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
  Image,
  Link,
} from '@chakra-ui/react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import NgawonggoLogo from './NgawonggoLogo';

const Logo = props => {
  return (
    <svg
      height={32}
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* SVG path data */}
      {/* <LogoSvg /> */}
    </svg>
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.100', '#1C395A')}
      color={useColorModeValue('gray.700', 'gray.200')}
      fontFamily={'heading'}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '1fr 2fr 1fr 1fr 2fr' }}
          spacing={4}
        >
          <Box>
            <NgawonggoLogo fontSize="2xl" />
          </Box>
          <Stack spacing={3}>
            <Text fontSize={'lg'} fontWeight={'bold'}>
              Pemerintah Desa Ngawonggo
            </Text>
            <Text fontSize={'sm'}>
              Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah 56153
            </Text>
            <Text fontSize={'sm'}>© 2026 Pemerintah Desa Ngawonggo</Text>
            <Text fontSize={'sm'}>Tel : 081215030896</Text>
            <Text fontSize={'sm'}>Email : ngawonggodesa@gmail.com</Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton
                label={'Instagram'}
                href={'#'}
              >
                <FaInstagram />
              </SocialButton>
              <SocialButton
                label={'Facebook'}
                href={'#'}
              >
                <FaFacebook />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Menu Utama</ListHeader>
            <Box as="a" href={'/profil'}>
              Profil Desa
            </Box>
            <Box as="a" href={'#'}>
              Peta Desa
            </Box>
            <Box as="a" href={'#'}>
              Hubungi Kami
            </Box>
            <Box as="a" href={'/#wisata'}>
              Potensi Desa
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            {/* Sederhanakan atau hapus bagian ini sesuai instruksi */}
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={'row'}>
              <Input
                placeholder={'Your email address'}
                bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                border={0}
                _focus={{
                  bg: 'whiteAlpha.300',
                }}
              />
              <IconButton
                bg={useColorModeValue('blue.400', 'blue.800')}
                color={useColorModeValue('white', 'gray.800')}
                _hover={{
                  bg: 'blue.600',
                }}
                aria-label="Subscribe"
                icon={<BiMailSend />}
              />
            </Stack>
            <Text fontWeight="700" marginTop="45px">
              Made By
              <Link href="https://github.com/frdmn12" ml={1}>@frdmn12</Link>
              😸
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
