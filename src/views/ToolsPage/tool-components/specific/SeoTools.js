import React, { useState } from 'react';
import {
  Box, Text, VStack, SimpleGrid, Button, Input, Textarea,
  FormControl, FormLabel, useToast, Stat, StatLabel, StatNumber,
  Badge, Flex, Progress
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

/* ═══════ KEYWORD DENSITY ═══════ */
const KeywordDensity = () => {
  const [text, setText] = useState('');
  const words = text.trim() === '' ? [] : text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const freq = {};
  words.forEach(w => { if (w.length > 2) freq[w] = (freq[w] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Paste konten Anda</FormLabel><Textarea value={text} onChange={e => setText(e.target.value)} minH="200px" /></FormControl>
      <Badge>Total kata: {words.length}</Badge>
      {sorted.length > 0 && (
        <Box w="full">
          {sorted.map(([word, count]) => (
            <Flex key={word} align="center" py={1} gap={3}><Text fontSize="sm" fontWeight="bold" w="120px" noOfLines={1}>{word}</Text><Progress value={(count / words.length) * 100} flex={1} colorScheme="brand" borderRadius="full" size="sm" /><Text fontSize="xs" color="gray.500" w="80px" textAlign="right">{count}x ({((count / words.length) * 100).toFixed(1)}%)</Text></Flex>
          ))}
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ META TITLE CHECKER ═══════ */
const MetaTitleChk = () => {
  const [title, setTitle] = useState('');
  const len = title.length;
  const isGood = len >= 30 && len <= 60;
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Meta Title</FormLabel><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul halaman Anda..." /></FormControl>
      <Box w="full"><Progress value={Math.min(100, (len / 60) * 100)} colorScheme={isGood ? 'green' : len > 60 ? 'red' : 'yellow'} borderRadius="full" /><Flex justify="space-between" mt={1}><Text fontSize="xs" color="gray.400">{len} karakter</Text><Text fontSize="xs" color={isGood ? 'green.500' : 'orange.500'}>{isGood ? 'Optimal ✓' : len < 30 ? 'Terlalu pendek' : 'Terlalu panjang'}</Text></Flex></Box>
      <Box w="full" p={4} border="1px solid" borderColor="gray.200" borderRadius="lg"><Text color="blue.600" fontSize="lg" fontWeight="medium" noOfLines={1}>{title || 'Preview judul...'}</Text><Text fontSize="sm" color="green.600">contoh.com › halaman</Text><Text fontSize="sm" color="gray.500">Deskripsi halaman akan muncul di sini...</Text></Box>
    </VStack>
  );
};

/* ═══════ META DESC CHECKER ═══════ */
const MetaDescChk = () => {
  const [desc, setDesc] = useState('');
  const len = desc.length;
  const isGood = len >= 120 && len <= 160;
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Meta Description</FormLabel><Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Deskripsi halaman Anda..." rows={3} /></FormControl>
      <Box w="full"><Progress value={Math.min(100, (len / 160) * 100)} colorScheme={isGood ? 'green' : len > 160 ? 'red' : 'yellow'} borderRadius="full" /><Flex justify="space-between" mt={1}><Text fontSize="xs" color="gray.400">{len} karakter</Text><Text fontSize="xs" color={isGood ? 'green.500' : 'orange.500'}>{isGood ? 'Optimal ✓' : len < 120 ? 'Terlalu pendek' : 'Terlalu panjang'}</Text></Flex></Box>
    </VStack>
  );
};

/* ═══════ HEADING CHECKER ═══════ */
const HeadingChk = () => {
  const [html, setHtml] = useState('');
  const headings = [];
  const regex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) { headings.push({ level: parseInt(match[1]), text: match[2].replace(/<[^>]*>/g, '') }); }
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Paste HTML</FormLabel><Textarea value={html} onChange={e => setHtml(e.target.value)} minH="200px" fontFamily="monospace" fontSize="sm" placeholder='<h1>Title</h1>\n<h2>Subtitle</h2>' /></FormControl>
      {headings.length > 0 ? (
        <Box w="full">
          {headings.map((h, i) => (<Flex key={i} pl={(h.level - 1) * 4} py={1}><Badge mr={2} colorScheme={h.level === 1 ? 'brand' : h.level === 2 ? 'purple' : 'gray'}>H{h.level}</Badge><Text fontSize="sm">{h.text}</Text></Flex>))}
          <Divider my={2} />
          <Text fontSize="sm" color={headings.filter(h => h.level === 1).length === 1 ? 'green.500' : 'red.500'}>{headings.filter(h => h.level === 1).length === 1 ? '✓ Satu H1 (bagus!)' : `⚠ ${headings.filter(h => h.level === 1).length} H1 ditemukan`}</Text>
        </Box>
      ) : <Text color="gray.400">Tidak ada heading ditemukan.</Text>}
    </VStack>
  );
};

/* ═══════ READABILITY SCORE ═══════ */
const Readability = () => {
  const [text, setText] = useState('');
  const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const syllables = words.reduce((sum, w) => sum + Math.max(1, w.replace(/e$/i, '').match(/[aeiouy]+/gi)?.length || 1), 0);
  const fk = words.length > 0 && sentences > 0 ? 0.39 * (words.length / sentences) + 11.8 * (syllables / words.length) - 15.59 : 0;
  const level = fk <= 6 ? 'Sangat Mudah' : fk <= 8 ? 'Mudah' : fk <= 10 ? 'Sedang' : fk <= 12 ? 'Sulit' : 'Sangat Sulit';
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Paste teks</FormLabel><Textarea value={text} onChange={e => setText(e.target.value)} minH="200px" /></FormControl>
      {words.length > 0 && (
        <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3} w="full">
          <Stat p={3} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" textAlign="center"><StatLabel>Skor FK</StatLabel><StatNumber color="brand.500">{fk.toFixed(1)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Level</StatLabel><StatNumber fontSize="md">{level}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Kata</StatLabel><StatNumber>{words.length}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Kalimat</StatLabel><StatNumber>{sentences}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ PLAGIARISM CHECKER (Simulation) ═══════ */
const PlagiarismChk = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const check = () => {
    const words = text.trim().split(/\s+/).length;
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
    const uniqueness = ((uniqueWords / words) * 100).toFixed(1);
    setResult({ words, uniqueWords, uniqueness });
  };
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <Box p={3} bg="orange.50" _dark={{ bg: 'orange.900' }} borderRadius="md"><Text fontSize="sm" color="orange.700" _dark={{ color: 'orange.200' }}>Analisis keunikan kata lokal. Bukan pengecekan plagiarisme online.</Text></Box>
      <FormControl><FormLabel>Paste teks</FormLabel><Textarea value={text} onChange={e => setText(e.target.value)} minH="200px" /></FormControl>
      <Button colorScheme="brand" onClick={check} isDisabled={!text.trim()} w="full">Analisis</Button>
      {result && (
        <SimpleGrid columns={3} spacing={3} w="full">
          <Stat p={3} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" textAlign="center"><StatLabel>Keunikan</StatLabel><StatNumber color="brand.500">{result.uniqueness}%</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Total Kata</StatLabel><StatNumber>{result.words}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Kata Unik</StatLabel><StatNumber>{result.uniqueWords}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ OUTLINE GENERATOR ═══════ */
const OutlineGen = () => {
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState('');
  const toast = useToast();
  const generate = () => {
    const o = `# ${topic}\n\n## 1. Pendahuluan\n- Latar belakang ${topic}\n- Mengapa topik ini penting\n- Overview pembahasan\n\n## 2. Pengertian ${topic}\n- Definisi menurut ahli\n- Istilah terkait\n\n## 3. Manfaat dan Kegunaan\n- Manfaat utama\n- Manfaat tambahan\n- Studi kasus\n\n## 4. Cara Implementasi\n- Langkah-langkah\n- Tips dan trik\n- Kesalahan umum yang harus dihindari\n\n## 5. Contoh dan Studi Kasus\n- Contoh penerapan\n- Analisis keberhasilan\n\n## 6. Kesimpulan\n- Ringkasan poin penting\n- Rekomendasi\n- Call to action\n\n## FAQ\n- Pertanyaan umum tentang ${topic}\n- Jawaban singkat dan jelas`;
    setOutline(o);
  };
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Topik Artikel</FormLabel><Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Cara belajar programming" /></FormControl>
      <Button colorScheme="brand" onClick={generate} isDisabled={!topic} w="full">Generate Outline</Button>
      {outline && (
        <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Outline</Text><Button size="sm" variant="ghost" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(outline); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Copy</Button></Flex><Textarea value={outline} isReadOnly minH="400px" fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>
      )}
    </VStack>
  );
};

/* ═══════ HASHTAG GENERATOR ═══════ */
const HashtagGen = () => {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState('');
  const toast = useToast();
  const generate = () => {
    const base = topic.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const tags = new Set();
    base.forEach(w => { tags.add(`#${w}`); tags.add(`#${w}tips`); tags.add(`#${w}${new Date().getFullYear()}`); });
    tags.add('#fyp'); tags.add('#viral'); tags.add('#trending');
    tags.add('#tips'); tags.add('#tutorial'); tags.add('#belajar');
    tags.add('#indonesia'); tags.add('#info'); tags.add('#edukasi');
    base.forEach((w, i) => { if (i < base.length - 1) tags.add(`#${w}${base[i + 1]}`); });
    setHashtags(Array.from(tags).slice(0, 30).join(' '));
  };
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Topik</FormLabel><Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Masak nasi goreng" /></FormControl>
      <Button colorScheme="brand" onClick={generate} isDisabled={!topic} w="full">Generate Hashtag</Button>
      {hashtags && (
        <Box w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" cursor="pointer" onClick={() => { navigator.clipboard.writeText(hashtags); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
          <Text fontSize="sm" color="blue.500" wordBreak="break-word">{hashtags}</Text>
          <Text fontSize="xs" color="gray.400" mt={2}>Klik untuk menyalin</Text>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const Divider2 = () => <Box />;
const SeoTools = ({ tool }) => {
  switch (tool.config) {
    case 'keyword': return <KeywordDensity />;
    case 'metaTitle': return <MetaTitleChk />;
    case 'metaDesc': return <MetaDescChk />;
    case 'heading': return <HeadingChk />;
    case 'readability': return <Readability />;
    case 'plagiarism': return <PlagiarismChk />;
    case 'outline': return <OutlineGen />;
    case 'hashtag': return <HashtagGen />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default SeoTools;
