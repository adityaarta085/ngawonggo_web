import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
  Image,
  Link,
} from '@chakra-ui/react';
import { FaChevronRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const DusunSection = () => {
  const [dusuns, setDusuns] = useState([]);

  useEffect(() => {
    const fetchDusuns = async () => {
      const { data, error } = await supabase.from('dusuns').select('*').order('sort_order', { ascending: true });
      if (!error && data) setDusuns(data);
    };
    fetchDusuns();
  }, []);

  return (
    <Box py={24} bg="neo.warmWhite" className="bg-crosshatch" position="relative" borderY="4px solid black">
      <Container maxW="container.xl">
        <VStack spacing={16} align="center">
          <Box textAlign="center" position="relative">
            <Box position="relative" display="inline-block">
                <Heading fontFamily="heading" color="black" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="900" mb={4} position="relative" zIndex={2}>
                    Wilayah Ngawonggo
                </Heading>
                <Box position="absolute" bottom="10px" left="-5px" right="-5px" h="12px" bg="neo.coral" zIndex={1} />
            </Box>
          </Box>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={{ base: 6, md: 8 }} w="full">
            {dusuns.map((dusun, index) => {
              const rotate = index % 2 === 0 ? '-3deg' : '3deg';
              return (
              <Link
                key={dusun.slug}
                as={RouterLink}
                to={`/dusun/${dusun.slug}`}
                _hover={{ textDecoration: 'none' }}
                role="group"
              >
                <MotionBox
                  initial={{ opacity: 0, y: 50, rotate: rotate }}
                  whileInView={{ opacity: 1, y: 0, rotate: rotate }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  position="relative"
                  bg="white"
                  p={3}
                  pb={6}
                  border="3px solid black"
                  boxShadow="brutal"
                  _hover={{
                      transform: 'translate(-5px, -10px) rotate(0deg) !important',
                      boxShadow: '8px 12px 0px black'
                  }}
                >
                  {/* Decorative Tape */}
                  <Box
                      position="absolute"
                      top="-10px"
                      left="50%"
                      transform="translateX(-50%) rotate(-5deg)"
                      w="40px"
                      h="15px"
                      bg="rgba(255, 255, 255, 0.6)"
                      border="1px solid rgba(0,0,0,0.1)"
                      zIndex={2}
                      backdropFilter="blur(2px)"
                  />

                  <Box w="full" h="140px" overflow="hidden" border="2px solid black" mb={3}>
                      <Image
                        src={dusun.image_url}
                        alt={dusun.name}
                        w="full"
                        h="full"
                        objectFit="cover"
                        transition="all 0.5s"
                        _groupHover={{ transform: 'scale(1.05)' }}
                      />
                  </Box>
                  <Flex justify="space-between" align="center" px={1}>
                    <VStack align="start" spacing={0}>
                      <Text fontFamily="accent" color="gray.600" fontSize="xs" fontWeight="bold" textTransform="uppercase">Dusun</Text>
                      <Text fontFamily="heading" color="black" fontWeight="900" fontSize="md">{dusun.name}</Text>
                    </VStack>
                    <Icon as={FaChevronRight} color="black" transition="all 0.3s" _groupHover={{ transform: 'translateX(3px)' }} />
                  </Flex>
                </MotionBox>
              </Link>
            )})}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default DusunSection;
