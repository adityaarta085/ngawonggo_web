const fs = require('fs');

let content = fs.readFileSync('src/views/LandingPage/components/QuickLinks.js', 'utf8');

const importReplacement = `import {
  SimpleGrid,
  Box,
  Text,
  Icon,
  Flex,
  Link,
} from '@chakra-ui/react';
import {
  FaInfoCircle,
  FaHandHoldingHeart,
  FaGavel,
  FaBullhorn,
  FaBookOpen,
  FaGamepad,
  FaNewspaper,
  FaDonate,
  FaPhotoVideo,
  FaPlayCircle,
  FaPhoneAlt,
  FaCompass,
} from 'react-icons/fa';`;

content = content.replace(/import \{[^}]+\} from '@chakra-ui\/react';[\s\S]*?from 'react-icons\/fa';/, importReplacement);

const linksReplacement = `const links = [
    {
      label: language === 'id' ? 'Profil Desa' : 'Village Profile',
      icon: FaInfoCircle,
      href: '/profil',
      color: 'brand.400',
    },
    {
      label: language === 'id' ? 'Layanan' : 'Services',
      icon: FaHandHoldingHeart,
      href: '/layanan',
      color: 'green.400',
    },
    {
      label: language === 'id' ? 'Pemerintahan' : 'Government',
      icon: FaGavel,
      href: '/pemerintahan',
      color: 'orange.400',
    },
    {
      label: language === 'id' ? 'Berita' : 'News',
      icon: FaNewspaper,
      href: '/news',
      color: 'blue.400',
    },
    {
      label: language === 'id' ? 'Donasi' : 'Donation',
      icon: FaDonate,
      href: '/donasi',
      color: 'pink.400',
    },
    {
        label: language === 'id' ? 'Al-Qur\\'an' : 'Al-Quran',
        icon: FaBookOpen,
        href: '/quran',
        color: 'teal.400',
    },
    {
      label: language === 'id' ? 'Edu Game' : 'Edu Game',
      icon: FaGamepad,
      href: '/game',
      color: 'purple.400',
    },
    {
      label: language === 'id' ? 'Media' : 'Media',
      icon: FaPhotoVideo,
      href: '/media',
      color: 'cyan.400',
    },
    {
      label: language === 'id' ? 'Anime' : 'Anime',
      icon: FaPlayCircle,
      href: '/anime',
      color: 'red.400',
    },
    {
      label: language === 'id' ? 'Jelajahi' : 'Explore',
      icon: FaCompass,
      href: '/jelajahi',
      color: 'yellow.400',
    },
    {
      label: language === 'id' ? 'Pengaduan' : 'Complaints',
      icon: FaBullhorn,
      href: '#pengaduan',
      color: 'red.500',
    },
    {
      label: language === 'id' ? 'Kontak' : 'Contact',
      icon: FaPhoneAlt,
      href: '/kontak',
      color: 'gray.400',
    },
  ];`;

content = content.replace(/const links = \[\s*\{[\s\S]*?\}\s*,\s*\];/, linksReplacement);

// Change SimpleGrid columns to fit 12 items nicely
content = content.replace(/columns=\{\{ base: 3, md: 6 \}\}/, 'columns={{ base: 3, md: 4, lg: 6 }}');
content = content.replace(/columns=\{\{ base: 3, md: 6 \}\} spacing=\{\{ base: 4, md: 6 \}\}/, 'columns={{ base: 3, md: 4, lg: 6 }} spacing={{ base: 4, md: 6 }}');

// Update font sizes slightly to fit smaller screens if needed
// Actually, it uses xs/sm, which is fine

fs.writeFileSync('src/views/LandingPage/components/QuickLinks.js', content, 'utf8');
