import React, { useState, useEffect } from 'react';
import { getList } from '../../lib/dataFetcher';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
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
  Center,
  Icon,
  Tag
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaFileAlt,
  FaCertificate,
  FaPlayCircle,
  FaLock,
  FaCrown,
  FaCode,
  FaLaptopCode,
  FaAward,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaUsers,
  FaCheckCircle,
  FaLayerGroup
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import SEO from '../../components/SEO';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const teamMembers = [
  {
    id: 1,
    name: "ADITYA ARTA PUTRA",
    role: "Project Leader & Lead Developer",
    spec: "Core Architecture & Full-Stack Engineering",
    contribution: "40%",
    isLeader: true,
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifh-gSAUfCfZSZASMU_3xe-LtUUl94TKvEuX7_xF7MSlkiEwWKIyOUExxYxLxHIXBSAVNfDw6pwsA1w9Mlwf3UDBQb4Z4sK7HbVHihuTkmg-8qgjpDQT2nmdwxnWsFj7fUCYAaDDslfbKe9grVOsCCeQ4R1EUVsAUySd7BGzK-i5l1eZPSOvhlq1IfGpw/s320/10%20TJKT%20A%20ADITYA%20ARTA%20PUTRA.JPG",
    certificate: "https://cpamusheoowbmllxffrt.supabase.co/storage/v1/object/public/upload/Emas%20dan%20Krem%20Elegan%20Sertifikat%20Penghargaan.png",
    description: "Ketua proyek sekaligus pengembang utama yang merancang dan membangun arsitektur portal desa digital Ngawonggo dari hulu ke hilir dengan dedikasi tinggi."
  },
  {
    id: 2,
    name: "DAVIN YODI IBRAHIM",
    role: "Co-Lead & Frontend Architect",
    spec: "UI/UX Components & Layout Optimization",
    contribution: "10%",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjF5xhqcCKtgdChLrmBUfF8SZ7wi2EO13giq4Dra8uyh4hVnSLJAzgYqYmoAWexw_mIT9gLgwDcTQDMYDA9uvDEI6oqUWMLADDCLKhyeNDIcdNe7HC7_h1TMGuAWr_Awlgtjvl0sA7oDK1ltJvUBb8agdwpLlVmN4gZ_gM8r7-o8lYVJ84K6S36vucWlr4/s320/10%20TJKT%20A%20DAVIN%20YODI%20IBRAHIM.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFtgqqKDnkB96rFbDyKbb__Q84y2YQl8DV3aoxtrW_s3rFPiWn1LWK1bhm3BaViDg7OesCnA9DmfOoem3yG3tWjQ_hMLuhhNfyNXny12PWmMnk7vxR-9kj5d97faGdOjMSGtQvj9NOPEcEJV5aPd4nwrP-if3HH96_w5vwWm0_GnN0eKERLca_Fa5-FqQ/s320/3.png",
    description: "Merancang tata letak antarmuka yang responsif dan mengoptimalkan komponen UI interaktif untuk kenyamanan pengguna."
  },
  {
    id: 3,
    name: "BINTANG MUSHAROF",
    role: "Security & Infrastructure Specialist",
    spec: "Network Safety & Access Controls",
    contribution: "10%",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgC4zfhQ2ofySTxmG5agAP7W3qJ4MzVlNLnqDWa1-379LRuHRTmaK4K9_1YRkLYM6fd7UffTBcF4Di_b0BNUpUdvKayjT0VS8uO44cFaDFPXc54G-1rhtMhPT3vTiU1myT6Pp0QJJGmhm4mJL6oqVzQ4dPS_8i8Hp3AMbhzif8pdjq-07UXVw2SwbIQBuk/s320/10%20TJKT%20A%20BINTANG%20MUSHAROF.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmZLcDeb3sSE1orJ6ppAOeoP8WqyQZ6Jo9cnNOd1RpRmm4t6xejZyAlBGLVZuFF2EW-LrW5zLwszGu_KsWk3gLXKxK9DtIVqJaFo58qqmZhtud3ovdi9SFwHxjmVZMvFa8gGOIO5LzTTj_Vb2OHhEPveDUZf629YMy09vijYIGqcAr3S93sqOP5SaeDy8/s320/2.png",
    description: "Membantu pengujian keamanan sistem jaringan dan mendukung keandalan akses infrastruktur portal."
  },
  {
    id: 4,
    name: "DESTA HARYA PUTRA",
    role: "UI/UX Craftsmanship & Asset Designer",
    spec: "Visual Aesthetics & Digital Graphics",
    contribution: "10%",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7VolZXUmul2l-kw0pvMOuKX9FiE8pYj2g7WQzyY2Po2qovlAFe3Li7v6f81HZkWHFWElYUPY_rlRvcyzQmhpOKqBoleaGeBf0rNjK_E05xlty7wi-7-rtIcLYCqKBR6EMTm10ErYR9rKwUgRjgXH0UDCIFvh9_IzUNUtJh_LjX3tubb1M0oUjtSUhqfY/s320/10%20TJKT%20A%20DESTA%20ARYA%20PUTRA%20ARDANDRA.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqdg2clKWkdRj-i6NDKoB9gy2TbtcUT6MuQD2b0JXuy1TW4bThGDq9n-igd3VfvTUMwVUuUinCoXEJ1E_ovQMm6TWkGmd13VxPLDuFcgigWfvSouyLnEws0sbqEU172-QCwESL8gSiXlWpEqbbIVQqGh3DBcukvTy8prsIiybRGRF_oZqta9EPGkPnFiY/s320/4.png",
    description: "Menyiapkan elemen visual, grafis promosi, serta penyelarasan estetika tampilan antarmuka web."
  },
  {
    id: 5,
    name: "M. AZMA AL FATAH",
    role: "Database & API Integration Engineer",
    spec: "Data Schema & Fetching Operations",
    contribution: "10%",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4xSBqRfqxDnZmUfFaemCsca5Xw2un-ReNzPVKK3ycLVZKsrM8NvXH7KyWkIEn1KhFHFoxz6AhLl6dkUXYAxEapXxT-Qw0bNfm6nNMf-QOoDckEnsguysf5wPwxpAu7XmXbvgkq62Un6vRRCkvLGdQ0RfeEEQKfXNKJ3YgbQg7JmUuEi0nVu7oYwdNn5s/s320/10%20TJKT%20A%20MUHAMMAD%20AZMA%20AL%20FATAH.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQc_p1DU_EpHwl9PHVOqeKQPcfNWsmsS0F5FuVN35YX80lDpMl-pt1lZG9m1QlvrGBB6g8JovW2mTsfOk_j6AWpqEGMrrUpYJGnVf4o_DkVvFruuAzNlOz8hHc9B7nuhzUK3oXcAnfEUpfZwrg0cvy6gQhb0VYDwk6vbB0lj-9LRQYr8VP9NuesIKuK1A/s320/5.png",
    description: "Mendukung pengelolaan skema data internal dan efisiensi pengambilan data dari API."
  },
  {
    id: 6,
    name: "M. FAZA HUSNA MUBAROK",
    role: "Quality Assurance & System Tester",
    spec: "Bug Hunting & Usability Testing",
    contribution: "10%",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizwfobuJsU2s9OslXbmU3Sc0-jU_IrgKQye1gq6QpyAFyK_2Lp-tJIiYnl6PT4y3P56MC-kipPP5I7Y6L0EvT3SCO2K-nN6JT2V4gQChq77KfNenyoS4FKDA95nuYEM5_63_xsn_Zz4KbMiniJcHTq81NZcXdRjNVxE5VLxpA8KBhUdjjQgF6Ai8wh6ps/s320/10%20TJKT%20A%20MUHAMMAD%20FAZA%20KHUSNA%20MUBAROK.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgWydbP3BOP7KZjOZw9BfCf3uMRkehgUJ7Uq5Y3J-J9Wi8RqWMT6j6C_59pCuqheaz5LtDn6bOjhKCUC5g7r4Cvw6Zn2-Ho4_mjlhF4wzFA9pBWarkPkJjapAHILWBQANsUZvAnCDG5Vgmmkmt71th6MjnwgdBliw27unHiL5uNfz_H7vK1pZHF4RJVwY/s320/6.png",
    description: "Melakukan pengujian fitur (QA) untuk memastikan stabilitas dan meminimalisir kendala di peramban."
  },
  {
    id: 7,
    name: "NIZAR ANNABIL",
    role: "Content Specialist & Media Relations",
    spec: "Digital Documentation & Social Media",
    contribution: "10%",
    photo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9tya8zK3nWzy0xg-r60yjG2jeC5sr_LvcyFeKIZVHz2RM_vQlEkUNtfIZufZ4RbOHeA822Gjn9syjGXAPVlR2mu6eQbtCHcKoLkVL5XauqdweiE_lzt1tKEOlMvg4Kq-cEP22F-3uM5P3YP7W29PS6qG7tbxwnKEvBupERZk0UHIJAnz9dlk9ArPAjzg/s320/10%20TJKT%20A%20NIZAR%20ANABIL.JPG",
    certificate: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgq6fyaGgF-_N0pSvK7JVKV6LxTAVHUS1VbLHKFfQq7dVB5pNMVLaW8xOyEaV74mwn-5j6ZvQKDgx6l5FeVTa7zzcDbk7QQCd7ym0tRuFVve-Jz4ovkBArZQefSA9ym3B4p1p3Xrs3_joRWwnT5-RNR_nIQxtWIVpWhPdyM6_vMPVnjsoPVElVQa9PK3xQ/s320/7.png",
    description: "Mengelola dokumentasi tim, pembuatan publikasi media, serta koordinasi konten informasi."
  }
];

const LeaderSpotlightCard = ({ leader }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(15, 23, 42, 0.85)');
  const goldGradient = "linear(to-r, #F59E0B, #D97706, #B45309)";

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        mb={16}
        position="relative"
        zIndex={2}
      >
        <Box
          bg={cardBg}
          backdropFilter="blur(20px)"
          borderWidth="2px"
          borderColor="yellow.500"
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="0 20px 50px rgba(217, 119, 6, 0.25)"
          transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          _hover={{
            transform: 'translateY(-6px) scale(1.01)',
            boxShadow: '0 30px 60px rgba(217, 119, 6, 0.35)',
            borderColor: 'yellow.400'
          }}
          position="relative"
        >
          {/* Top Ambient Glow */}
          <Box
            position="absolute"
            top="-50px" right="-50px"
            w="250px" h="250px"
            bg="amber.400"
            filter="blur(80px)"
            opacity="0.25"
            pointerEvents="none"
          />

          <Flex direction={{ base: 'column', lg: 'row' }} align="stretch">
            {/* Photo Section with Badge */}
            <Box
              position="relative"
              w={{ base: '100%', lg: '420px' }}
              minH={{ base: '340px', lg: '480px' }}
              overflow="hidden"
            >
              <Image
                src={leader.photo}
                alt={leader.name}
                w="100%"
                h="100%"
                objectFit="cover"
                filter="contrast(1.05)"
                transition="transform 0.5s ease"
                _hover={{ transform: 'scale(1.05)' }}
              />
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-t, blackAlpha.800, transparent 60%)"
              />
              <Tag
                position="absolute"
                top={6} left={6}
                bgGradient={goldGradient}
                color="white"
                px={4} py={2}
                borderRadius="full"
                fontWeight="900"
                fontSize="xs"
                letterSpacing="widest"
                boxShadow="lg"
                display="flex" align="center" gap={2}
              >
                <Icon as={FaCrown} color="yellow.200" boxSize={4} />
                THE KING / LEAD ARCHITECT
              </Tag>
              
              <Box position="absolute" bottom={6} left={6} right={6}>
                <Text color="yellow.300" fontSize="xs" fontWeight="bold" letterSpacing="widest">
                  SMK MUHAMMADIYAH BANDONGAN (10 TJKT A 2026)
                </Text>
                <Heading size="lg" color="white" fontWeight="900" letterSpacing="tight" mt={1}>
                  {leader.name}
                </Heading>
              </Box>
            </Box>

            {/* Content Section */}
            <VStack p={{ base: 6, md: 10 }} align="start" justify="space-between" spacing={6} flex={1}>
              <VStack align="start" spacing={3} w="full">
                <HStack spacing={2}>
                  <Badge colorScheme="amber" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">
                    PROJECT LEADER & LEAD DEVELOPER
                  </Badge>
                  <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full" fontSize="xs">
                    40% CORE CONTRIBUTION
                  </Badge>
                </HStack>

                <Heading size="xl" fontWeight="900" bgGradient="linear(to-r, brand.500, yellow.600)" bgClip="text">
                  {leader.role}
                </Heading>

                <Text fontSize="md" color="gray.600" _dark={{ color: "gray.300" }} lineHeight="tall">
                  {leader.description}
                </Text>
              </VStack>

              {/* Special Specs Grid */}
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                <Box p={4} borderRadius="2xl" bg="amber.50" _dark={{ bg: "whiteAlpha.100" }} border="1px solid" borderColor="amber.200">
                  <HStack mb={1}>
                    <Icon as={FaCode} color="amber.600" />
                    <Text fontWeight="bold" fontSize="sm" color="amber.800" _dark={{ color: "amber.300" }}>Tech Architecture</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>React, Supabase, Security & Full-Stack Systems</Text>
                </Box>

                <Box p={4} borderRadius="2xl" bg="brand.50" _dark={{ bg: "whiteAlpha.100" }} border="1px solid" borderColor="brand.200">
                  <HStack mb={1}>
                    <Icon as={FaAward} color="brand.600" />
                    <Text fontWeight="bold" fontSize="sm" color="brand.800" _dark={{ color: "brand.300" }}>Kontribusi Utama</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>40% Pengembangan Keseluruhan Portal Desa</Text>
                </Box>
              </SimpleGrid>

              {/* Action Certificate Button */}
              <Button
                size="lg"
                leftIcon={<FaCertificate />}
                rightIcon={<FaExternalLinkAlt fontSize="12px" />}
                bgGradient={goldGradient}
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #D97706, #B45309, #92400E)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px rgba(217, 119, 6, 0.4)"
                }}
                onClick={onOpen}
                px={8} py={7}
                borderRadius="2xl"
                w={{ base: "full", sm: "auto" }}
                fontWeight="bold"
              >
                Lihat Sertifikat Utama
              </Button>
            </VStack>
          </Flex>
        </Box>
      </MotionBox>

      {/* Leader Certificate Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(12px)" bg="blackAlpha.700" />
        <ModalContent borderRadius="3xl" overflow="hidden" mx={4} border="2px solid" borderColor="yellow.500">
          <ModalHeader bg="gray.900" color="white" py={4} display="flex" align="center" gap={2}>
            <Icon as={FaCrown} color="yellow.400" /> Sertifikat Penghargaan Kontribusi Utama
          </ModalHeader>
          <ModalCloseButton color="white" boxSize={10} top={3} />
          <ModalBody p={6} bg="gray.900">
            <Image
              src={leader.certificate}
              alt={`Sertifikat ${leader.name}`}
              w="100%"
              maxH="75vh"
              objectFit="contain"
              mx="auto"
              borderRadius="2xl"
              boxShadow="2xl"
            />
            <VStack mt={4} spacing={2} align="center">
              <Text fontSize="sm" color="gray.300" textAlign="center">
                Menyatakan secara resmi bahwasannya <strong>{leader.name}</strong> adalah <strong>Project Leader & Lead Developer</strong> utama dalam pengembangan Portal Desa Digital Ngawonggo (SMK Muhammadiyah Bandongan - 10 TJKT A 2026).
              </Text>
              <Badge colorScheme="yellow" px={4} py={1} borderRadius="full">Terverifikasi Resmi Pemdes Ngawonggo</Badge>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const MemberCard = ({ member, index }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
      >
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="lg"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{ transform: 'translateY(-8px)', boxShadow: '2xl', borderColor: 'brand.400' }}
          h="full"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          position="relative"
        >
          <Box position="relative" h="260px" overflow="hidden">
            <Image
              src={member.photo}
              alt={member.name}
              w="100%"
              h="100%"
              objectFit="cover"
              transition="transform 0.4s ease"
              _hover={{ transform: 'scale(1.08)' }}
            />
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, blackAlpha.800, transparent 50%)"
            />
            <Badge
              position="absolute"
              top={3} left={3}
              colorScheme="blue"
              variant="solid"
              px={3} py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
            >
              KONTRIBUTOR 10%
            </Badge>

            <Box position="absolute" bottom={3} left={3} right={3}>
              <Text color="white" fontWeight="bold" fontSize="md" noOfLines={1}>
                {member.name}
              </Text>
              <Text color="gray.300" fontSize="xs" noOfLines={1}>
                {member.role}
              </Text>
            </Box>
          </Box>

          <VStack p={5} spacing={3} align="start" flex={1} justify="space-between">
            <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} lineHeight="tall" noOfLines={3}>
              {member.description}
            </Text>

            <Button
              size="sm"
              leftIcon={<FaCertificate />}
              colorScheme="brand"
              variant="outline"
              onClick={onOpen}
              w="full"
              borderRadius="xl"
              fontWeight="bold"
              _hover={{ bg: 'brand.500', color: 'white' }}
            >
              Lihat Sertifikat
            </Button>
          </VStack>
        </Box>
      </MotionBox>

      {/* Member Certificate Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
        <ModalContent borderRadius="3xl" overflow="hidden" mx={4} bg="gray.900" color="white">
          <ModalHeader py={4} display="flex" align="center" gap={2}>
            <Icon as={FaCertificate} color="brand.400" /> Sertifikat Kontributor Tim
          </ModalHeader>
          <ModalCloseButton boxSize={10} top={3} />
          <ModalBody p={6}>
            <Image
              src={member.certificate}
              alt={`Sertifikat ${member.name}`}
              w="100%"
              borderRadius="2xl"
              boxShadow="xl"
            />
            <Text mt={4} fontSize="sm" color="gray.400" textAlign="center">
              Menyatakan secara resmi bahwasannya <strong>{member.name}</strong> berkontribusi aktif dalam tim pengembang website Desa Ngawonggo (SMK Muhammadiyah Bandongan - 10 TJKT A 2026).
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const DeveloperMediaList = () => {
  const [medias, setMedias] = useState([]);
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    const { data: allData } = await getList('developer_media', { orderBy: 'created_at', order: 'desc', limit: 1000 });
    const data = (allData || []).filter(item => item.is_active === true);
    if (data) setMedias(data);
  };

  if (medias.length === 0) return null;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
      {medias.map((media) => (
        <MotionBox
          key={media.id}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            bg={cardBg}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="lg"
            cursor="pointer"
            onClick={() => navigate(`/credits/media/${media.id}`)}
            position="relative"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            <Box h="210px" bg="gray.900" position="relative" overflow="hidden">
              {media.media_type === 'image' && media.media_url ? (
                <Image src={media.media_url} w="full" h="full" objectFit="cover" filter="blur(2px) brightness(0.7)" />
              ) : (
                <Center h="full" bgGradient="linear(to-br, brand.600, purple.700)">
                  <Icon as={media.media_type === 'video' ? FaPlayCircle : FaFileAlt} boxSize={16} color="whiteAlpha.400" />
                </Center>
              )}
              <Center position="absolute" inset={0} bg="blackAlpha.500">
                <VStack spacing={1}>
                  <Icon as={FaLock} boxSize={10} color="yellow.400" filter="drop-shadow(0px 2px 8px rgba(0,0,0,0.8))" />
                  <Text color="yellow.300" fontSize="xs" fontWeight="bold" letterSpacing="widest">VIP UNLOCK</Text>
                </VStack>
              </Center>
            </Box>
            <VStack p={6} align="start" spacing={3}>
              <Badge colorScheme={media.media_type === 'video' ? 'pink' : 'purple'} variant="solid" borderRadius="full" px={3}>
                {media.media_type.toUpperCase()} EKSKLUSIF
              </Badge>
              <Heading size="md" noOfLines={2}>{media.title}</Heading>
              <Text color="gray.500" fontSize="sm" noOfLines={2}>{media.description}</Text>
            </VStack>
          </Box>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
};

const CreditsPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.950');
  const leaderMember = teamMembers.find(m => m.isLeader);
  const otherMembers = teamMembers.filter(m => !m.isLeader);

  return (
    <Box bg={bgColor} minH="100vh" pt={{ base: 24, md: 32 }} pb={24} position="relative" overflow="hidden">
      <SEO
        title="Tim Pengembang & Sertifikat Penghargaan - SMK Muhammadiyah Bandongan 10 TJKT A 2026"
        description="Informasi resmi tim pengembang portal desa digital Ngawonggo karya siswa SMK Muhammadiyah Bandongan (10 TJKT A 2026) dipimpin Aditya Arta Putra."
        image="https://cpamusheoowbmllxffrt.supabase.co/storage/v1/object/public/upload/Emas%20dan%20Krem%20Elegan%20Sertifikat%20Penghargaan.png"
        keywords="Aditya Arta Putra, Tim Pengembang Ngawonggo, SMK Muhammadiyah Bandongan, 10 TJKT A 2026, Sertifikat Desa Ngawonggo"
      />

      {/* Decorative Gradient Orbs */}
      <Box
        position="absolute"
        top="-100px" left="-100px"
        w="500px" h="500px"
        bg="brand.400"
        filter="blur(160px)"
        opacity="0.15"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="30%" right="-100px"
        w="500px" h="500px"
        bg="amber.400"
        filter="blur(160px)"
        opacity="0.12"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Header Hero Section */}
        <VStack spacing={6} textAlign="center" mb={16}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Tag size="lg" colorScheme="amber" borderRadius="full" px={5} py={2} mb={4} fontWeight="bold" boxShadow="md">
              <Icon as={FaGraduationCap} mr={2} boxSize={5} />
              SMK MUHAMMADIYAH BANDONGAN (KELAS 10 TJKT A 2026)
            </Tag>

            <Heading
              size="3xl"
              fontWeight="900"
              letterSpacing="tight"
              bgGradient="linear(to-r, #0066cc, #d97706, #9333ea)"
              bgClip="text"
              mb={4}
            >
              HALL OF FAME & KREATIFITAS DIGI-TEAM
            </Heading>

            <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.300" }} maxW="3xl" mx="auto" lineHeight="tall">
              Apresiasi setinggi-tingginya kepada para siswa berbakat yang mendedikasikan ilmu, kreativitas, dan kerja keras dalam merancang Portal Desa Digital Ngawonggo.
            </Text>
          </MotionBox>

          {/* Quick Stats Counter Bar */}
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            wrap="wrap"
            justify="center"
            gap={6}
            mt={4}
          >
            <HStack bg="white" p={4} px={6} borderRadius="2xl" shadow="md" border="1px" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "gray.700" }}>
              <Icon as={FaUsers} color="brand.500" boxSize={6} />
              <Box textAlign="left">
                <Text fontWeight="900" fontSize="lg">7 Talenta Muda</Text>
                <Text fontSize="xs" color="gray.500">Tim Pengembang 10 TJKT A</Text>
              </Box>
            </HStack>

            <HStack bg="white" p={4} px={6} borderRadius="2xl" shadow="md" border="1px" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "gray.700" }}>
              <Icon as={FaLaptopCode} color="amber.500" boxSize={6} />
              <Box textAlign="left">
                <Text fontWeight="900" fontSize="lg">100% Native Architecture</Text>
                <Text fontSize="xs" color="gray.500">React + Supabase Backend</Text>
              </Box>
            </HStack>

            <HStack bg="white" p={4} px={6} borderRadius="2xl" shadow="md" border="1px" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "gray.700" }}>
              <Icon as={FaCheckCircle} color="green.500" boxSize={6} />
              <Box textAlign="left">
                <Text fontWeight="900" fontSize="lg">CI/CD Standard</Text>
                <Text fontSize="xs" color="gray.500">Terkonfigurasi Siap Deploy</Text>
              </Box>
            </HStack>
          </MotionFlex>

          {/* Document & Social Action Buttons */}
          <Flex gap={4} mt={6} flexWrap="wrap" justify="center">
            <Button
              as={Link}
              href="https://drive.google.com/file/d/14fYy1YTkYKDLjVXBensBrQT9BdfFn9VI/view"
              isExternal
              leftIcon={<FaFileAlt />}
              rightIcon={<FaExternalLinkAlt fontSize="12px" />}
              colorScheme="blue"
              size="lg"
              borderRadius="full"
              px={8}
              boxShadow="md"
              _hover={{ textDecoration: 'none', transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              Laporan Proyek Resmi
            </Button>
            <Button
              as={Link}
              href="https://www.tiktok.com/@kelompok1xtjktasm"
              isExternal
              leftIcon={<SiTiktok />}
              rightIcon={<FaExternalLinkAlt fontSize="12px" />}
              colorScheme="blackAlpha"
              bg="black"
              color="white"
              size="lg"
              borderRadius="full"
              px={8}
              boxShadow="md"
              _hover={{ bg: 'gray.800', textDecoration: 'none', transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              TikTok Resmi Tim
            </Button>
          </Flex>
        </VStack>

        {/* 1. Leader Spotlight Card */}
        {leaderMember && <LeaderSpotlightCard leader={leaderMember} />}

        {/* Section Header: Team Contributors */}
        <VStack spacing={3} textAlign="center" mb={10}>
          <HStack spacing={2}>
            <Icon as={FaLayerGroup} color="brand.500" boxSize={5} />
            <Text fontWeight="bold" color="brand.500" letterSpacing="widest" fontSize="sm">
              JAJARAN KONTRIBUTOR HANDAL
            </Text>
          </HStack>
          <Heading size="xl" fontWeight="900">Anggota Tim Pengembang</Heading>
          <Text color="gray.500" maxW="xl">
            Setiap anggota memiliki peran spesifik yang mendukung terciptanya ekosistem digital desa secara utuh.
          </Text>
        </VStack>

        {/* 2. Team Members Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={8} mb={20}>
          {otherMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </SimpleGrid>

        {/* 3. Developer Media Section */}
        <Box mt={20}>
          <VStack spacing={4} textAlign="center" mb={12}>
            <Badge colorScheme="purple" variant="solid" px={4} py={1} borderRadius="full" fontSize="xs">
              VIP BEHIND THE SCENES
            </Badge>
            <Heading size="xl" fontWeight="900">Media Eksklusif Pengembang</Heading>
            <Text color="gray.500" maxW="xl">
              Dokumentasi aktivitas, video di balik layar, serta momen berharga selama proses pembuatan website.
            </Text>
            <Button
              as={Link}
              href="/credits/media"
              colorScheme="brand"
              size="md"
              mt={2}
              borderRadius="full"
              px={6}
              rightIcon={<FaPlayCircle />}
            >
              Lihat Seluruh Galeri Eksklusif
            </Button>
          </VStack>

          <DeveloperMediaList />
        </Box>

        {/* 4. Institutional Footer Pride Card */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          mt={24}
        >
          <Box
            p={{ base: 8, md: 12 }}
            bgGradient="linear(to-r, brand.600, brand.800, purple.900)"
            borderRadius="3xl"
            color="white"
            textAlign="center"
            boxShadow="2xl"
            position="relative"
            overflow="hidden"
          >
            {/* Background Accent */}
            <Box
              position="absolute"
              top="-50%" left="-20%"
              w="400px" h="400px"
              bg="whiteAlpha.100"
              borderRadius="full"
              filter="blur(50px)"
            />

            <VStack spacing={4} position="relative" zIndex={1}>
              <Icon as={FaGraduationCap} boxSize={12} color="yellow.400" />
              <Heading size="lg" fontWeight="900">
                SMK MUHAMMADIYAH BANDONGAN
              </Heading>
              <Text fontSize="md" opacity={0.9} maxW="container.md" mx="auto" lineHeight="tall">
                Mencetak generasi muda unggul, berkarakter, dan berdaya saing di bidang <strong>Teknologi Jaringan Komputer dan Telekomunikasi (TJKT)</strong>. Karya ini disembahkan oleh Kelas 10 TJKT A (Tahun 2026).
              </Text>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default CreditsPage;
