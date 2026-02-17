import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Image,
  Link,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FaFileAlt, FaCertificate } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

const teamMembers = [
  {
    name: "ADITYA ARTA PUTRA",
    role: "Project Leader & Lead Developer",
    isLeader: true,
    description: "Koordinator utama kelompok sekaligus pengembang utama yang membangun sekitar 40% dari keseluruhan website ini. Bertanggung jawab atas arsitektur kode, integrasi API, dan desain UI/UX.",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifh-gSAUfCfZSZASMU_3xe-LtUUl94TKvEuX7_xF7MSlkiEwWKIyOUExxYxLxHIXBSAVNfDw6pwsA1w9Mlwf3UDBQb4Z4sK7HbVHihuTkmg-8qgjpDQT2nmdwxnWsFj7fUCYAaDDslfbKe9grVOsCCeQ4R1EUVsAUySd7BGzK-i5l1eZPSOvhlq1IfGpw/s320/10%20TJKT%20A%20ADITYA%20ARTA%20PUTRA.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilVHKf4rAAnNsXQ9rCmDp1wDaHGD-54HwjNQkUSLzUwhCY3csZ9AeRpBkCL1tulzAg_BRcOgm4rremf6CxK-CKiqocFpf5s-9x_qeDnfquLIyRkPte3dzxKA-sOiLmVt97BGWFtGLc7DTE70AfiebK2KnrT8m9j5DSXTdBGCvOdXT9IaTtB4IKxJYbBg0/s320/1.png"
  },
  {
    name: "DAVIN YODI IBRAHIM",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjF5xhqcCKtgdChLrmBUfF8SZ7wi2EO13giq4Dra8uyh4hVnSLJAzgYqYmoAWexw_mIT9gLgwDcTQDMYDA9uvDEI6oqUWMLADDCLKhyeNDIcdNe7HC7_h1TMGuAWr_Awlgtjvl0sA7oDK1ltJvUBb8agdwpLlVmN4gZ_gM8r7-o8lYVJ84K6S36vucWlr4/s320/10%20TJKT%20A%20DAVIN%20YODI%20IBRAHIM.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFtgqqKDnkB96rFbDyKbb__Q84y2YQl8DV3aoxtrW_s3rFPiWn1LWK1bhm3BaViDg7OesCnA9DmfOoem3yG3tWjQ_hMLuhhNfyNXny12PWmMnk7vxR-9kj5d97faGdOjMSGtQvj9NOPEcEJV5aPd4nwrP-if3HH96_w5vwWm0_GnN0eKERLca_Fa5-FqQ/s320/3.png"
  },
  {
    name: "BINTANG MUSHAROF",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgC4zfhQ2ofySTxmG5agAP7W3qJ4MzVlNLnqDWa1-379LRuHRTmaK4K9_1YRkLYM6fd7UffTBcF4Di_b0BNUpUdvKayjT0VS8uO44cFaDFPXc54G-1rhtMhPT3vTiU1myT6Pp0QJJGmhm4mJL6oqVzQ4dPS_8i8Hp3AMbhzif8pdjq-07UXVw2SwbIQBuk/s320/10%20TJKT%20A%20BINTANG%20MUSHAROF.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmZLcDeb3sSE1orJ6ppAOeoP8WqyQZ6Jo9cnNOd1RpRmm4t6xejZyAlBGLVZuFF2EW-LrW5zLwszGu_KsWk3gLXKxK9DtIVqJaFo58qqmZhtud3ovdi9SFwHxjmVZMvFa8gGOIO5LzTTj_Vb2OHhEPveDUZf629YMy09vijYIGqcAr3S93sqOP5SaeDy8/s320/2.png"
  },
  {
    name: "DESTA HARYA PUTRA",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7VolZXUmul2l-kw0pvMOuKX9FiE8pYj2g7WQzyY2Po2qovlAFe3Li7v6f81HZkWHFWElYUPY_rlRvcyzQmhpOKqBoleaGeBf0rNjK_E05xlty7wi-7-rtIcLYCqKBR6EMTm10ErYR9rKwUgRjgXH0UDCIFvh9_IzUNUtJh_LjX3tubb1M0oUjtSUhqfY/s320/10%20TJKT%20A%20DESTA%20ARYA%20PUTRA%20ARDANDRA.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqdg2clKWkdRj-i6NDKoB9gy2TbtcUT6MuQD2b0JXuy1TW4bThGDq9n-igd3VfvTUMwVUuUinCoXEJ1E_ovQMm6TWkGmd13VxPLDuFcgigWfvSouyLnEws0sbqEU172-QCwESL8gSiXlWpEqbbIVQqGh3DBcukvTy8prsIiybRGRF_oZqta9EPGkPnFiY/s320/4.png"
  },
  {
    name: "M. AZMA AL FATAH",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4xSBqRfqxDnZmUfFaemCsca5Xw2un-ReNzPVKK3ycLVZKsrM8NvXH7KyWkIEn1KhFHFoxz6AhLl6dkUXYAxEapXxT-Qw0bNfm6nNMf-QOoDckEnsguysf5wPwxpAu7XmXbvgkq62Un6vRRCkvLGdQ0RfeEEQKfXNKJ3YgbQg7JmUuEi0nVu7oYwdNn5s/s320/10%20TJKT%20A%20MUHAMMAD%20AZMA%20AL%20FATAH.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQc_p1DU_EpHwl9PHVOqeKQPcfNWsmsS0F5FuVN35YX80lDpMl-pt1lZG9m1QlvrGBB6g8JovW2mTsfOk_j6AWpqEGMrrUpYJGnVf4o_DkVvFruuAzNlOz8hHc9B7nuhzUK3oXcAnfEUpfZwrg0cvy6gQhb0VYDwk6vbB0lj-9LRQYr8VP9NuesIKuK1A/s320/5.png"
  },
  {
    name: "M. FAZA HUSNA MUBAROK",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizwfobuJsU2s9OslXbmU3Sc0-jU_IrgKQye1gq6QpyAFyK_2Lp-tJIiYnl6PT4y3P56MC-kipPP5I7Y6L0EvT3SCO2K-nN6JT2V4gQChq77KfNenyoS4FKDA95nuYEM5_63_xsn_Zz4KbMiniJcHTq81NZcXdRjNVxE5VLxpA8KBhUdjjQgF6Ai8wh6ps/s320/10%20TJKT%20A%20MUHAMMAD%20FAZA%20KHUSNA%20MUBAROK.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgWydbP3BOP7KZjOZw9BfCf3uMRkehgUJ7Uq5Y3J-J9Wi8RqWMT6j6C_59pCuqheaz5LtDn6bOjhKCUC5g7r4Cvw6Zn2-Ho4_mjlhF4wzFA9pBWarkPkJjapAHILWBQANsUZvAnCDG5Vgmmkmt71th6MjnwgdBliw27unHiL5uNfz_H7vK1pZHF4RJVwY/s320/6.png"
  },
  {
    name: "NIZAR ANNABIL",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9tya8zK3nWzy0xg-r60yjG2jeC5sr_LvcyFeKIZVHz2RM_vQlEkUNtfIZufZ4RbOHeA822Gjn9syjGXAPVlR2mu6eQbtCHcKoLkVL5XauqdweiE_lzt1tKEOlMvg4Kq-cEP22F-3uM5P3YP7W29PS6qG7tbxwnKEvBupERZk0UHIJAnz9dlk9ArPAjzg/s320/10%20TJKT%20A%20NIZAR%20ANABIL.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgq6fyaGgF-_N0pSvK7JVKV6LxTAVHUS1VbLHKFfQq7dVB5pNMVLaW8xOyEaV74mwn-5j6ZvQKDgx6l5FeVTa7zzcDbk7QQCd7ym0tRuFVve-Jz4ovkBArZQefSA9ym3B4p1p3Xrs3_joRWwnT5-RNR_nIQxtWIVpWhPdyM6_vMPVnjsoPVElVQa9PK3xQ/s320/7.png"
  }
];

const MemberCard = ({ member }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const goldColor = '#C5A96F';

  if (member.isLeader) {
    return (
      <>
        <Box
          gridColumn={{ lg: "span 4", md: "span 3", sm: "span 2" }}
          mb={10}
          position="relative"
          zIndex={1}
        >
          <Box
            bg={cardBg}
            borderWidth="2px"
            borderColor={goldColor}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
            transition="all 0.4s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(197, 169, 111, 0.2)' }}
          >
            <Flex direction={{ base: 'column', md: 'row' }}>
              <Box position="relative" w={{ base: '100%', md: '350px' }} h={{ base: '300px', md: '450px' }}>
                <Image
                  src={member.photo}
                  alt={member.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  top={0} left={0} right={0} bottom={0}
                  bgGradient="linear(to-t, blackAlpha.700, transparent)"
                />
                <Badge
                  position="absolute"
                  top={4} left={4}
                  bg={goldColor} color="white" px={4} py={1} borderRadius="full"
                >
                  THE KING / LEAD
                </Badge>
              </Box>
              <VStack p={{ base: 6, md: 10 }} align="start" justify="center" spacing={6} flex={1}>
                <VStack align="start" spacing={1}>
                  <Text color={goldColor} fontWeight="bold" letterSpacing="widest" fontSize="sm">PROJECT LEADER & COORDINATOR</Text>
                  <Heading size="2xl" fontWeight="900" letterSpacing="tight">{member.name}</Heading>
                </VStack>
                <Text fontSize="lg" color="gray.500" lineHeight="tall">
                  {member.description}
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                   <Box p={4} borderRadius="2xl" bg="gray.50" _dark={{ bg: 'whiteAlpha.50' }}>
                      <Text fontWeight="bold" color="brand.500">40% Contribution</Text>
                      <Text fontSize="xs" color="gray.500">Core Architecture & Development</Text>
                   </Box>
                   <Box p={4} borderRadius="2xl" bg="gray.50" _dark={{ bg: 'whiteAlpha.50' }}>
                      <Text fontWeight="bold" color="brand.500">Tech Maestro</Text>
                      <Text fontSize="xs" color="gray.500">UI/UX & System Integration</Text>
                   </Box>
                </SimpleGrid>
                <Button
                  size="lg"
                  leftIcon={<FaCertificate />}
                  colorScheme="brand"
                  bg={goldColor}
                  _hover={{ bg: '#b39863' }}
                  onClick={onOpen}
                  px={10}
                  borderRadius="full"
                >
                  Lihat Sertifikat Utama
                </Button>
              </VStack>
            </Flex>
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
            <ModalHeader fontSize="lg">Sertifikat Kontribusi Utama</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Image
                src={member.certificate}
                alt={`Sertifikat ${member.name}`}
                w="100%"
                borderRadius="md"
              />
              <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
                Menyatakan bahwasannya {member.name} adalah Ketua Proyek dan Pengembang Utama website Desa Ngawonggo.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-10px)', boxShadow: '2xl' }}
      >
        <Image
          src={member.photo}
          alt={member.name}
          w="100%"
          h="250px"
          objectFit="cover"
        />
        <VStack p={6} spacing={4} align="center">
          <Badge colorScheme="blue">KONTRIBUTOR</Badge>
          <Text fontWeight="800" fontSize="md" textAlign="center" noOfLines={1}>
            {member.name}
          </Text>
          <Button
            size="sm"
            leftIcon={<FaCertificate />}
            colorScheme="brand"
            variant="outline"
            onClick={onOpen}
            w="full"
          >
            Lihat Sertifikat
          </Button>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
          <ModalHeader fontSize="lg">Sertifikat Kontribusi</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Image
              src={member.certificate}
              alt={`Sertifikat ${member.name}`}
              w="100%"
              borderRadius="md"
            />
            <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
              Menyatakan bahwasannya {member.name} berkontribusi dalam pengembangan website Desa Ngawonggo.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const CreditsPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} minH="100vh" pt={24} pb={20}>
      <Container maxW="container.xl">
        <VStack spacing={4} textAlign="center" mb={16}>
          <Heading size="2xl" fontWeight="900">Tim Pengembang</Heading>
          <Text fontSize="lg" color="gray.500" maxW="2xl">
            Proyek ini dikembangkan oleh siswa berbakat dari SMK Muhammadiyah Bandongan, Kelas 10 TJKT A, Tahun 2026.
          </Text>
          <Flex gap={4} mt={6} flexWrap="wrap" justify="center">
            <Button
              as={Link}
              href="https://docs.google.com/document/d/1HPfKm_yJZreKNEyVk-bG7Yg8EKQd0UwA/edit?usp=sharing&ouid=105570846013465124362&rtpof=true&sd=true"
              isExternal
              leftIcon={<FaFileAlt />}
              colorScheme="blue"
              size="lg"
              borderRadius="full"
              _hover={{ textDecoration: 'none', transform: 'scale(1.05)' }}
            >
              Proposal Proyek
            </Button>
            <Button
              as={Link}
              href="https://www.tiktok.com/@kelompok1xtjktasm"
              isExternal
              leftIcon={<SiTiktok />}
              colorScheme="blackAlpha"
              bg="black"
              color="white"
              _hover={{ bg: 'gray.800', textDecoration: 'none', transform: 'scale(1.05)' }}
              size="lg"
              borderRadius="full"
            >
              TikTok Resmi
            </Button>
          </Flex>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
          {teamMembers.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </SimpleGrid>

        <Box mt={20} p={8} bg="brand.500" borderRadius="3xl" color="white" textAlign="center" boxShadow="2xl">
          <Heading size="md" mb={4}>SMK Muhammadiyah Bandongan</Heading>
          <Text fontSize="sm" opacity={0.9}>
            Mencetak generasi unggul di bidang Teknologi Jaringan Komputer dan Telekomunikasi (TJKT).
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default CreditsPage;
