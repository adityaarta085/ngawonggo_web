import React from 'react';
import {
  Box,
  Flex,
  Text,
  Stack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SimpleGrid,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBookOpen, FaGamepad, FaPhotoVideo, FaNewspaper } from 'react-icons/fa';

const EXPLORE_ITEMS = [
  {
    label: 'Berita',
    subLabel: 'Kabar dan kegiatan terbaru di Ngawonggo',
    href: '/news',
    icon: FaNewspaper,
  },
  {
    label: 'Media',
    subLabel: 'Streaming & Komunitas',
    href: '/media',
    icon: FaPhotoVideo,
  },
  {
    label: "Al-Qur'an",
    subLabel: 'Akses kitab suci Al-Qur\'an',
    href: '/quran',
    icon: FaBookOpen,
  },
  {
    label: 'Edu Game',
    subLabel: 'Main game edukasi 3D',
    href: '/game',
    icon: FaGamepad,
  },
];

const MegaMenu = ({ label }) => {
  return (
    <Popover trigger={'hover'} placement={'bottom-start'}>
      <PopoverTrigger>
        <Box
          as={RouterLink}
          p={2}
          to={'/jelajahi'}
          fontSize={'xs'}
          fontFamily="accent"
          fontWeight={800}
          color="black"
          transition="all 0.2s"
          _hover={{
            textDecoration: 'none',
            bg: 'neo.yellow',
            borderBottom: '2px solid black'
          }}
          textTransform="uppercase"
          letterSpacing="wider"
          whiteSpace="nowrap"
        >
          {label}
        </Box>
      </PopoverTrigger>

      <PopoverContent
        border="3px solid black"
        boxShadow={'brutal'}
        bg="white"
        p={4}
        rounded={'none'}
        minW={'xl'}
      >
        <SimpleGrid columns={2} spacing={4}>
          {EXPLORE_ITEMS.map((child, childIndex) => (
            <Box
              as={RouterLink}
              key={`${child.label}-${childIndex}`}
              to={child.href}
              role={'group'}
              display={'block'}
              p={3}
              rounded={'none'}
              _hover={{ bg: 'neo.yellow' }}
              border="2px solid transparent"
              _groupHover={{ borderColor: 'black' }}
            >
              <Stack direction={'row'} align={'center'}>
                <Flex
                  w={10}
                  h={10}
                  align={'center'}
                  justify={'center'}
                  rounded={'full'}
                  bg={'gray.100'}
                  _groupHover={{ bg: 'black', color: 'white' }}
                  transition={'all .3s ease'}
                >
                  <Icon as={child.icon} w={5} h={5} />
                </Flex>
                <Box pl={2}>
                  <Text
                    transition={'all .3s ease'}
                    _groupHover={{ color: 'black' }}
                    fontWeight={900}
                    fontFamily="heading"
                    color="black"
                  >
                    {child.label}
                  </Text>
                  <Text fontSize={'sm'} color="gray.600">{child.subLabel}</Text>
                </Box>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </PopoverContent>
    </Popover>
  );
};

export default MegaMenu;
