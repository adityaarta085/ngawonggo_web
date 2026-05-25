/* eslint-disable */
import React, { useState } from 'react';
import {
  Box, Button, Flex, Text, VStack, useToast, Checkbox, Input,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  SimpleGrid, Select, FormControl, FormLabel, Textarea,
  HStack, Badge, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { FaCopy, FaSync } from 'react-icons/fa';
import ToolLayout from '../components/ToolLayout';

/* ─── DATA ─── */
const INDO_NAMES = {
  male: ['Adi', 'Budi', 'Cahyo', 'Dimas', 'Eko', 'Fajar', 'Gilang', 'Hadi', 'Irfan', 'Joko', 'Kurnia', 'Luthfi', 'Malik', 'Naufal', 'Oscar', 'Putra', 'Rahmat', 'Surya', 'Teguh', 'Umar', 'Vino', 'Wahyu', 'Yusuf', 'Zaki', 'Ahmad', 'Bayu', 'Dwi', 'Farhan', 'Galih', 'Rizki', 'Arief', 'Hendra', 'Ilham', 'Kevin', 'Mukti', 'Nugroho', 'Prasetyo', 'Rendi', 'Satria', 'Taufik'],
  female: ['Ani', 'Bunga', 'Citra', 'Dewi', 'Eka', 'Fitri', 'Gita', 'Hana', 'Intan', 'Jasmine', 'Kartika', 'Lestari', 'Maya', 'Nita', 'Okta', 'Putri', 'Rina', 'Sari', 'Tari', 'Umi', 'Vina', 'Wati', 'Yuni', 'Zahra', 'Ayu', 'Bella', 'Dini', 'Fani', 'Indah', 'Laras', 'Mega', 'Nisa', 'Ratna', 'Sinta', 'Tiara', 'Wulan', 'Risa', 'Sella', 'Kiki', 'Lina'],
  last: ['Pratama', 'Wijaya', 'Saputra', 'Nugraha', 'Hidayat', 'Permana', 'Santoso', 'Wibowo', 'Kusuma', 'Setiawan', 'Ramadhan', 'Hartono', 'Susanto', 'Utomo', 'Gunawan', 'Purnomo', 'Suharto', 'Firdaus', 'Suryadi', 'Adriansyah'],
};

const QUOTES = [
  { text: 'Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.', author: 'Colin Powell' },
  { text: 'Jangan pernah menyerah. Hal-hal besar membutuhkan waktu.', author: 'Anonim' },
  { text: 'Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.', author: 'Nelson Mandela' },
  { text: 'Masa depan milik mereka yang percaya pada keindahan mimpi-mimpi mereka.', author: 'Eleanor Roosevelt' },
  { text: 'Satu-satunya cara untuk melakukan pekerjaan hebat adalah mencintai apa yang kamu lakukan.', author: 'Steve Jobs' },
  { text: 'Hidup itu 10% apa yang terjadi padamu dan 90% bagaimana kamu menanggapinya.', author: 'Charles R. Swindoll' },
  { text: 'Belajarlah dari hari kemarin, hiduplah untuk hari ini, berharaplah untuk hari esok.', author: 'Albert Einstein' },
  { text: 'Orang yang berhasil bukanlah orang yang tidak pernah gagal, tapi yang tidak pernah berhenti mencoba.', author: 'Anonim' },
  { text: 'Ilmu itu bagaikan cahaya, ia menerangi jalan kehidupan.', author: 'Peribahasa' },
  { text: 'Kejujuran adalah bab pertama dalam buku kebijaksanaan.', author: 'Thomas Jefferson' },
  { text: 'Berani bermimpi besar, berani gagal, berani bangkit lagi.', author: 'Anonim' },
  { text: 'Jadilah perubahan yang ingin kamu lihat di dunia.', author: 'Mahatma Gandhi' },
  { text: 'Kebahagiaan tidak datang dari luar, melainkan dari dalam dirimu sendiri.', author: 'Dalai Lama' },
  { text: 'Waktu yang paling tepat untuk menanam pohon adalah 20 tahun lalu. Waktu terbaik kedua adalah sekarang.', author: 'Peribahasa Tiongkok' },
  { text: 'Kegagalan adalah bumbu keberhasilan.', author: 'Truman Capote' },
  { text: 'Jangan hitung hari, buatlah hari-harimu bermakna.', author: 'Muhammad Ali' },
  { text: 'Lebih baik menyala seperti lilin daripada mengutuk kegelapan.', author: 'Eleanor Roosevelt' },
  { text: 'Kesabaran itu pahit, tapi buahnya manis.', author: 'Jean-Jacques Rousseau' },
  { text: 'Membaca adalah jendela dunia.', author: 'Peribahasa' },
  { text: 'Orang bijak belajar ketika mereka bisa. Orang bodoh belajar ketika mereka terpaksa.', author: 'Arthur Wellesley' },
];

const ADJECTIVES = ['Mega', 'Prima', 'Jaya', 'Maju', 'Sentosa', 'Gemilang', 'Mandiri', 'Sejahtera', 'Utama', 'Abadi', 'Global', 'Digital', 'Kreatif', 'Inovatif', 'Modern'];
const BIZ_NOUNS = ['Karya', 'Solusi', 'Tekno', 'Media', 'Cipta', 'Bina', 'Surya', 'Bumi', 'Nusa', 'Indo', 'Mitra', 'Sinar', 'Cahaya', 'Berkah', 'Makmur'];
const BIZ_SUFFIX = ['Indonesia', 'Group', 'Corp', 'Nusantara', 'Sejahtera', 'Bersama', 'Perkasa', 'Makmur', 'Utama', ''];

const CONTENT_IDEAS = {
  umum: ['Tips produktivitas harian', 'Review produk terbaru', 'Resep masakan viral', 'DIY kerajinan tangan', 'Transformasi sebelum-sesudah', 'Fakta menarik yang jarang diketahui', 'Challenge trending', 'Story time pengalaman pribadi', 'Tutorial makeup natural', 'Rekomendasi buku wajib baca'],
  bisnis: ['Behind the scenes bisnis', 'Tips marketing low budget', 'Kisah sukses UMKM', 'Cara kelola keuangan bisnis', 'Packaging yang menarik', 'Customer service terbaik', 'Strategi harga produk', 'Digital marketing 101'],
  edukasi: ['Rumus matematika mudah', 'Sejarah yang jarang diketahui', 'Tips belajar efektif', 'Eksperimen sains sederhana', 'Vocabulary bahasa Inggris', 'Pengetahuan umum dunia', 'Life hacks sehari-hari', 'Perbandingan teknologi'],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ─── COMPONENT ─── */
const GenericGeneratorTool = ({ tool }) => {
  const [result, setResult] = useState('');
  const [results, setResults] = useState([]);
  const [length, setLength] = useState(12);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [count, setCount] = useState(1);
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(100);
  const [niche, setNiche] = useState('umum');
  const toast = useToast();

  const generate = () => {
    let res = '';
    let resList = [];

    switch (tool.config) {
      case 'password': {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let charset = chars;
        if (useNumbers) charset += nums;
        if (useSymbols) charset += syms;
        for (let i = 0; i < length; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
        break;
      }
      case 'pin': {
        for (let i = 0; i < Math.min(Math.max(length, 4), 8); i++) res += Math.floor(Math.random() * 10);
        break;
      }
      case 'secureNum': {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        const range = maxRange - minRange + 1;
        res = String(minRange + (arr[0] % range));
        break;
      }
      case 'randomNumber': {
        for (let i = 0; i < count; i++) {
          resList.push(String(Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange));
        }
        res = resList.join(', ');
        break;
      }
      case 'name': {
        for (let i = 0; i < count; i++) {
          const gender = Math.random() > 0.5 ? 'male' : 'female';
          resList.push(`${pick(INDO_NAMES[gender])} ${pick(INDO_NAMES.last)}`);
        }
        res = resList.join('\n');
        break;
      }
      case 'username': {
        const prefixes = ['cool', 'dark', 'blue', 'fire', 'ice', 'neo', 'sky', 'star', 'zen', 'pixel', 'cyber', 'nova', 'ultra', 'mega', 'epic'];
        const words = ['wolf', 'hawk', 'fox', 'lion', 'tiger', 'eagle', 'storm', 'blade', 'shadow', 'flash', 'thunder', 'knight', 'ninja', 'ghost', 'phantom'];
        for (let i = 0; i < count; i++) {
          resList.push(`${pick(prefixes)}_${pick(words)}${Math.floor(Math.random() * 999)}`);
        }
        res = resList.join('\n');
        break;
      }
      case 'color': {
        for (let i = 0; i < Math.max(count, 1); i++) {
          const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
          resList.push(hex);
        }
        res = resList.join('\n');
        break;
      }
      case 'quote': {
        const q = pick(QUOTES);
        res = `"${q.text}"\n— ${q.author}`;
        break;
      }
      case 'lottery': {
        const nums = new Set();
        while (nums.size < 6) nums.add(Math.floor(Math.random() * 49) + 1);
        res = Array.from(nums).sort((a, b) => a - b).join(' - ');
        break;
      }
      case 'fakeData': {
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'mail.com'];
        const streets = ['Jl. Merdeka', 'Jl. Sudirman', 'Jl. Gatot Subroto', 'Jl. Diponegoro', 'Jl. Ahmad Yani', 'Jl. Imam Bonjol'];
        const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Semarang', 'Yogyakarta', 'Malang', 'Medan', 'Makassar'];
        const fakeItems = [];
        for (let i = 0; i < Math.max(count, 1); i++) {
          const gender = Math.random() > 0.5 ? 'male' : 'female';
          const first = pick(INDO_NAMES[gender]);
          const last = pick(INDO_NAMES.last);
          fakeItems.push({
            name: `${first} ${last}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(Math.random() * 99)}@${pick(domains)}`,
            phone: `08${Math.floor(Math.random() * 10)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
            address: `${pick(streets)} No. ${Math.floor(Math.random() * 200) + 1}, ${pick(cities)}`,
            age: Math.floor(Math.random() * 50) + 18,
          });
        }
        res = JSON.stringify(fakeItems, null, 2);
        break;
      }
      case 'bizName': {
        for (let i = 0; i < Math.max(count, 5); i++) {
          const style = Math.random();
          if (style < 0.33) resList.push(`${pick(ADJECTIVES)} ${pick(BIZ_NOUNS)}`);
          else if (style < 0.66) resList.push(`${pick(BIZ_NOUNS)} ${pick(BIZ_SUFFIX)}`);
          else resList.push(`${pick(ADJECTIVES)} ${pick(BIZ_NOUNS)} ${pick(BIZ_SUFFIX)}`.trim());
        }
        res = resList.join('\n');
        break;
      }
      case 'contentIdea': {
        const ideas = CONTENT_IDEAS[niche] || CONTENT_IDEAS.umum;
        const shuffled = [...ideas].sort(() => Math.random() - 0.5);
        resList = shuffled.slice(0, Math.min(count, ideas.length));
        res = resList.map((idea, i) => `${i + 1}. ${idea}`).join('\n');
        break;
      }
      case 'ytTitle': {
        const templates = [
          `${Math.floor(Math.random() * 10) + 3} Hal yang BELUM KAMU TAHU tentang [topik]!`,
          `TERNYATA ini RAHASIA di balik [topik]... 😱`,
          `Jangan Lakukan Ini! ${Math.floor(Math.random() * 10) + 3} Kesalahan Fatal saat [topik]`,
          `Aku Coba [topik] Selama 30 Hari... Hasilnya GILA!`,
          `[topik] TERBAIK ${new Date().getFullYear()}! Review Jujur`,
          `Tutorial [topik] Lengkap untuk Pemula (A-Z)`,
          `STOP! Sebelum [topik], Tonton Video Ini Dulu!`,
          `Dari NOL sampai PRO: Panduan [topik] Terlengkap`,
        ];
        for (let i = 0; i < Math.max(count, 5); i++) resList.push(pick(templates));
        res = resList.map((t, i) => `${i + 1}. ${t}`).join('\n');
        break;
      }
      case 'ytDesc': {
        res = `📌 Deskripsi Video
Hai semua! Di video kali ini, aku akan membahas tentang [topik]. Pastikan kamu tonton sampai habis ya!

⏰ Timestamps:
0:00 - Intro
0:30 - Pembahasan Utama
5:00 - Tips & Trik
8:00 - Kesimpulan

🔔 Jangan lupa SUBSCRIBE dan nyalakan loncengnya!
👍 Like video ini kalau bermanfaat
💬 Comment pendapat kamu di bawah

📱 Follow Social Media:
Instagram: @username
TikTok: @username
Twitter: @username

📧 Business Inquiry: email@contoh.com

#[topik] #tutorial #${new Date().getFullYear()}

Disclaimer: Video ini dibuat untuk edukasi dan hiburan.`;
        break;
      }
      case 'igCaption': {
        const captions = [
          `✨ [Deskripsi foto/momen]\n\nKadang hal-hal kecil justru yang paling bermakna. Apa momen kecil yang membuatmu tersenyum hari ini? 👇\n\n#blessed #grateful #instadaily #instagood`,
          `📸 Behind the scenes hari ini!\n\nSetiap proses punya ceritanya sendiri. Yang penting terus bergerak maju 💪\n\n#behindthescenes #process #journey`,
          `🌅 Sore ini...\n\nMenikmati sunset sambil bersyukur untuk hari yang luar biasa. Semoga hari kalian juga menyenangkan!\n\n#sunset #vibes #peaceful #eveningmood`,
          `💡 Quick tips!\n\n1. [Tip 1]\n2. [Tip 2]\n3. [Tip 3]\n\nSave postingan ini biar gak lupa! 🔖\n\n#tips #lifehacks #useful`,
        ];
        for (let i = 0; i < Math.max(count, 3); i++) resList.push(pick(captions));
        res = resList.join('\n\n---\n\n');
        break;
      }
      case 'tiktokCaption': {
        const captions = [
          `Pov: kamu baru tahu tentang [topik] 🤯 #fyp #fypシ #viral`,
          `Trust me bro, coba deh! 😂 Komentar kalau berhasil! #challenge #${new Date().getFullYear()}`,
          `Duet kalau kamu juga begini! 🤣 #relatable #duet #trending`,
          `Tutorial yang kamu butuhkan tapi gak pernah dicari 🧠✨ #tutorial #tips #belajar`,
          `Simpan video ini sebelum hilang! 📌 #save #tips #lifehack`,
          `POV: [situasi lucu/relatable] 😭💀 #pov #comedy #humor`,
          `Ini dia rahasia yang jarang orang tahu! 🤫 #rahasia #secret #fypage`,
        ];
        for (let i = 0; i < Math.max(count, 5); i++) resList.push(pick(captions));
        res = resList.map((c, i) => `${i + 1}. ${c}`).join('\n\n');
        break;
      }
      case 'blogTitle': {
        const templates = [
          `Panduan Lengkap [topik] untuk Pemula di ${new Date().getFullYear()}`,
          `${Math.floor(Math.random() * 15) + 5} Cara Mudah [topik] yang Wajib Kamu Coba`,
          `Mengapa [topik] Penting? Ini Alasan dan Solusinya`,
          `[topik]: Pengertian, Manfaat, dan Cara Melakukannya`,
          `Tips [topik] yang Terbukti Efektif Menurut Ahli`,
          `Rahasia Sukses [topik] yang Jarang Orang Tahu`,
          `Review Lengkap: [topik] Terbaik ${new Date().getFullYear()}`,
          `Studi Kasus: Bagaimana [topik] Mengubah Segalanya`,
          `Kesalahan Fatal saat [topik] dan Cara Menghindarinya`,
          `[topik] vs [alternatif]: Mana yang Lebih Baik?`,
        ];
        const shuffled = [...templates].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.max(count, 5); i++) resList.push(shuffled[i % shuffled.length]);
        res = resList.map((t, i) => `${i + 1}. ${t}`).join('\n');
        break;
      }
      default:
        res = 'Generator ini belum tersedia.';
    }

    setResult(res);
    if (resList.length > 0) setResults(resList);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({ title: 'Disalin ke clipboard', status: 'success', duration: 2000 });
  };

  const isPasswordType = tool.config === 'password';
  const isPinType = tool.config === 'pin';
  const isSecureNum = tool.config === 'secureNum';
  const hasRange = ['randomNumber', 'secureNum'].includes(tool.config);
  const hasCount = ['randomNumber', 'name', 'username', 'color', 'fakeData', 'bizName', 'contentIdea', 'ytTitle', 'igCaption', 'tiktokCaption', 'blogTitle'].includes(tool.config);
  const isColorGen = tool.config === 'color';
  const isContentIdea = tool.config === 'contentIdea';

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
        {/* Password options */}
        {isPasswordType && (
          <Box p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg">
            <Text mb={4}>Panjang Karakter: <strong>{length}</strong></Text>
            <Slider value={length} min={4} max={64} onChange={v => setLength(v)} mb={4}>
              <SliderTrack><SliderFilledTrack /></SliderTrack>
              <SliderThumb />
            </Slider>
            <Flex gap={4}>
              <Checkbox isChecked={useNumbers} onChange={e => setUseNumbers(e.target.checked)}>Angka</Checkbox>
              <Checkbox isChecked={useSymbols} onChange={e => setUseSymbols(e.target.checked)}>Simbol</Checkbox>
            </Flex>
          </Box>
        )}

        {/* PIN options */}
        {isPinType && (
          <FormControl>
            <FormLabel>Panjang PIN (4-8 digit)</FormLabel>
            <Slider value={length} min={4} max={8} onChange={v => setLength(v)}>
              <SliderTrack><SliderFilledTrack /></SliderTrack>
              <SliderThumb />
            </Slider>
            <Text textAlign="center" mt={2} fontWeight="bold">{length} digit</Text>
          </FormControl>
        )}

        {/* Range options */}
        {hasRange && (
          <HStack spacing={4}>
            <FormControl><FormLabel>Min</FormLabel><NumberInput value={minRange} onChange={(_, v) => setMinRange(v)} min={0}><NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper></NumberInput></FormControl>
            <FormControl><FormLabel>Max</FormLabel><NumberInput value={maxRange} onChange={(_, v) => setMaxRange(v)} min={minRange}><NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper></NumberInput></FormControl>
          </HStack>
        )}

        {/* Count options */}
        {hasCount && (
          <FormControl>
            <FormLabel>Jumlah</FormLabel>
            <NumberInput value={count} onChange={(_, v) => setCount(v)} min={1} max={50}>
              <NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        {/* Content idea niche */}
        {isContentIdea && (
          <FormControl>
            <FormLabel>Niche</FormLabel>
            <Select value={niche} onChange={e => setNiche(e.target.value)}>
              <option value="umum">Umum</option>
              <option value="bisnis">Bisnis</option>
              <option value="edukasi">Edukasi</option>
            </Select>
          </FormControl>
        )}

        <Button colorScheme="brand" size="lg" leftIcon={<FaSync />} onClick={generate}>
          Generate
        </Button>

        {result && (
          <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" position="relative">
            {/* Color swatches */}
            {isColorGen && results.length > 0 && (
              <SimpleGrid columns={{ base: 3, sm: 5 }} spacing={2} mb={4}>
                {results.map((c, i) => (
                  <VStack key={i} cursor="pointer" onClick={() => { navigator.clipboard.writeText(c); toast({ title: `${c} disalin`, status: 'success', duration: 1500 }); }}>
                    <Box w="full" h="50px" bg={c} borderRadius="lg" border="1px solid" borderColor="gray.200" />
                    <Text fontSize="xs" fontFamily="monospace">{c}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            )}

            {/* Fake data - formatted JSON */}
            {tool.config === 'fakeData' ? (
              <Textarea value={result} isReadOnly minH="300px" fontFamily="monospace" fontSize="sm" />
            ) : !isColorGen && (
              <Text
                fontSize={result.length > 100 ? 'md' : result.length > 30 ? 'lg' : '2xl'}
                fontWeight="bold"
                fontFamily={['password', 'pin', 'secureNum'].includes(tool.config) ? 'monospace' : 'inherit'}
                wordBreak="break-all"
                whiteSpace="pre-wrap"
                textAlign={result.length > 100 ? 'left' : 'center'}
              >
                {result}
              </Text>
            )}

            {/* Password strength indicator */}
            {isPasswordType && result && (
              <HStack mt={4} justify="center">
                {(() => {
                  let score = 0;
                  if (result.length >= 8) score++;
                  if (result.length >= 12) score++;
                  if (/[A-Z]/.test(result) && /[a-z]/.test(result)) score++;
                  if (/\d/.test(result)) score++;
                  if (/[^A-Za-z0-9]/.test(result)) score++;
                  const labels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
                  const colors = ['red', 'orange', 'yellow', 'green', 'green'];
                  return <Badge colorScheme={colors[Math.min(score, 4)]} px={3} py={1} borderRadius="full">{labels[Math.min(score, 4)]}</Badge>;
                })()}
              </HStack>
            )}

            <Button
              size="sm" position="absolute" top={2} right={2}
              onClick={handleCopy} leftIcon={<FaCopy />} variant="ghost"
            >
              Copy
            </Button>
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default GenericGeneratorTool;
