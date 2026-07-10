import React, { useState, useEffect } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input, Textarea,
  FormControl, FormLabel, useToast, Badge, Stat, StatLabel, StatNumber,
  Flex, Progress, Icon, List, ListItem, ListIcon
} from '@chakra-ui/react';
import { FaCopy, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaLock, FaUnlock } from 'react-icons/fa';

/* ═══════ PASSWORD STRENGTH CHECKER ═══════ */
const PassStrength = () => {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const toast = useToast();

  const analyze = (pwd) => {
    let score = 0;
    if (!pwd) return { score, label: 'Kosong', color: 'gray', feedback: [] };

    const feedback = [];
    if (pwd.length >= 8) { score += 20; } else { feedback.push('Panjang minimal 8 karakter'); }
    if (/[a-z]/.test(pwd)) { score += 20; } else { feedback.push('Tambahkan huruf kecil'); }
    if (/[A-Z]/.test(pwd)) { score += 20; } else { feedback.push('Tambahkan huruf besar'); }
    if (/[0-9]/.test(pwd)) { score += 20; } else { feedback.push('Tambahkan angka'); }
    if (/[^A-Za-z0-9]/.test(pwd)) { score += 20; } else { feedback.push('Tambahkan simbol khusus (@, #, $, dll)'); }

    let label = 'Sangat Lemah';
    let color = 'red';
    if (score >= 80) { label = 'Sangat Kuat ✓'; color = 'green'; }
    else if (score >= 60) { label = 'Kuat'; color = 'teal'; }
    else if (score >= 40) { label = 'Sedang'; color = 'yellow'; }
    else if (score >= 20) { label = 'Lemah'; color = 'orange'; }

    return { score, label, color, feedback };
  };

  const { score, label, color, feedback } = analyze(password);

  const getCrackTime = (sc) => {
    if (sc === 0) return '0 detik';
    if (sc <= 20) return 'Instan (kurang dari 1 detik)';
    if (sc <= 40) return 'Sekitar 5 menit';
    if (sc <= 60) return 'Sekitar 3 hari';
    if (sc <= 80) return 'Sekitar 2 tahun';
    return '1,000+ tahun';
  };

  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl>
        <FormLabel>Masukkan Password</FormLabel>
        <HStack>
          <Input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tulis password Anda..." />
          <Button onClick={() => setShow(!show)} size="sm">{show ? 'Sembunyikan' : 'Lihat'}</Button>
        </HStack>
      </FormControl>
      {password && (
        <Box w="full">
          <Flex justify="space-between" mb={1}><Text fontSize="sm" fontWeight="bold">Kekuatan: {label}</Text><Text fontSize="sm">{score}%</Text></Flex>
          <Progress value={score} colorScheme={color} borderRadius="full" mb={3} />
          
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" mb={3}>
            <StatLabel>Estimasi Waktu Retas (Brute-force)</StatLabel>
            <StatNumber fontSize="lg" color={color + '.500'}>{getCrackTime(score)}</StatNumber>
          </Stat>

          {feedback.length > 0 && (
            <Box p={3} bg="orange.50" _dark={{ bg: 'orange.900' }} borderRadius="lg">
              <Text fontSize="xs" fontWeight="bold" color="orange.700" _dark={{ color: 'orange.200' }} mb={1}>Saran Perbaikan:</Text>
              <List spacing={1}>
                {feedback.map((f, i) => (
                  <ListItem key={i} fontSize="xs" color="orange.600" _dark={{ color: 'orange.300' }}>
                    <ListIcon as={FaExclamationCircle} color="orange.500" />
                    {f}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ 2FA QR GENERATOR ═══════ */
const TwoFactorHelper = () => {
  const [issuer, setIssuer] = useState('Ngawonggo Web');
  const [account, setAccount] = useState('admin@ngawonggo.com');
  const [secret, setSecret] = useState('');
  const toast = useToast();

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecret(res);
  };

  const otpauthUri = secret ? `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}` : '';
  const qrUrl = otpauthUri ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}` : '';

  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Nama Layanan / Aplikasi (Issuer)</FormLabel><Input value={issuer} onChange={e => setIssuer(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Nama Akun / Email</FormLabel><Input value={account} onChange={e => setAccount(e.target.value)} /></FormControl>
      <FormControl>
        <FormLabel>Kunci Rahasia Base32 (Secret Key)</FormLabel>
        <HStack>
          <Input value={secret} onChange={e => setSecret(e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, ''))} placeholder="16 Karakter Base32" />
          <Button onClick={generateSecret} size="sm">Acak</Button>
        </HStack>
      </FormControl>
      {qrUrl && (
        <VStack spacing={3} p={4} border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" w="full" align="center">
          <Text fontWeight="bold" color="gray.700" fontSize="sm">Pindai dengan Google Authenticator atau Aegis:</Text>
          <img src={qrUrl} alt="2FA QR Code" width={180} height={180} />
          <Button size="xs" variant="ghost" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(secret); toast({ title: 'Kunci rahasia disalin', status: 'success', duration: 1500 }); }}>Salin Kunci Manual: {secret}</Button>
        </VStack>
      )}
    </VStack>
  );
};

/* ═══════ HASH COMPARER ═══════ */
const HashComparer = () => {
  const [hashA, setHashA] = useState('');
  const [hashB, setHashB] = useState('');
  const [match, setMatch] = useState(null);

  const check = () => {
    if (!hashA || !hashB) return;
    setMatch(hashA.trim().toLowerCase() === hashB.trim().toLowerCase());
  };

  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Nilai Hash A</FormLabel><Input value={hashA} onChange={e => setHashA(e.target.value)} placeholder="Paste hash A di sini..." /></FormControl>
      <FormControl><FormLabel>Nilai Hash B</FormLabel><Input value={hashB} onChange={e => setHashB(e.target.value)} placeholder="Paste hash B di sini..." /></FormControl>
      <Button colorScheme="brand" onClick={check} isDisabled={!hashA || !hashB} w="full">Bandingkan Hash</Button>
      {match !== null && (
        <Box w="full" p={4} bg={match ? 'green.50' : 'red.50'} _dark={{ bg: match ? 'green.900' : 'red.900' }} borderRadius="xl" textAlign="center">
          <HStack justify="center">
            <Icon as={match ? FaCheckCircle : FaExclamationCircle} color={match ? 'green.500' : 'red.500'} />
            <Text fontWeight="bold" color={match ? 'green.500' : 'red.500'}>{match ? 'Nilai Hash Cocok ✓' : 'Nilai Hash Tidak Cocok ✗'}</Text>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ EMAIL LEAK CHECKER ═══════ */
const EmailLeakChecker = () => {
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const check = () => {
    if (!email) return;
    setChecking(true);
    setTimeout(() => {
      // Deterministic simulation based on email hash/name
      const count = email.length % 3 === 0 ? Math.floor((email.length * 7) % 5) + 1 : 0;
      setResult({
        leaked: count > 0,
        count,
        sources: count > 0 ? ['Adobe (2013)', 'Canva (2019)', 'LinkedIn (2016)', 'Dropbox (2012)'].slice(0, count) : []
      });
      setChecking(false);
    }, 1500);
  };

  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <Text fontSize="sm" color="gray.500" textAlign="center">Cek apakah alamat email Anda pernah bocor dalam pelanggaran data publik terkenal (Simulasi Lokal).</Text>
      <FormControl><FormLabel>Alamat Email</FormLabel><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="anda@domain.com" type="email" /></FormControl>
      <Button colorScheme="brand" onClick={check} isLoading={checking} isDisabled={!email} w="full">Periksa Kebocoran</Button>
      {result && (
        <Box w="full" p={4} bg={result.leaked ? 'red.50' : 'green.50'} _dark={{ bg: result.leaked ? 'red.900' : 'green.900' }} borderRadius="xl">
          {result.leaked ? (
            <VStack align="start" spacing={2}>
              <HStack><Icon as={FaExclamationCircle} color="red.500" /><Text fontWeight="bold" color="red.500">Email Bocor!</Text></HStack>
              <Text fontSize="sm">Ditemukan di {result.count} kebocoran data:</Text>
              <List spacing={1}>
                {result.sources.map((s, i) => <ListItem key={i} fontSize="xs" fontWeight="semibold">- {s}</ListItem>)}
              </List>
              <Text fontSize="xs" color="red.700" _dark={{ color: 'red.200' }} mt={2}>Segera ganti password akun email Anda dan aktifkan 2FA.</Text>
            </VStack>
          ) : (
            <HStack justify="center"><Icon as={FaCheckCircle} color="green.500" /><Text fontWeight="bold" color="green.500">Aman! Tidak ditemukan kebocoran data.</Text></HStack>
          )}
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ URL SAFETY CHECKER ═══════ */
const UrlSafetyChecker = () => {
  const [url, setUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const check = () => {
    if (!url) return;
    setChecking(true);
    setTimeout(() => {
      // Basic check simulation
      const lowercaseUrl = url.toLowerCase();
      let safe = true;
      let reason = 'Domain terlihat terpercaya.';
      if (lowercaseUrl.includes('login') || lowercaseUrl.includes('secure') || lowercaseUrl.includes('update') || lowercaseUrl.includes('bank')) {
        if (!lowercaseUrl.includes('google.com') && !lowercaseUrl.includes('microsoft.com') && !lowercaseUrl.includes('github.com')) {
          safe = false;
          reason = 'Mendeteksi kata kunci mencurigakan yang sering digunakan untuk phising.';
        }
      }
      if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
        safe = false;
        reason = 'Menggunakan HTTP yang tidak terenkripsi (bukan HTTPS).';
      }

      setResult({ safe, reason });
      setChecking(false);
    }, 1200);
  };

  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <Text fontSize="sm" color="gray.500" textAlign="center">Periksa keamanan tautan dari potensi phising, malware, atau ketidakamanan koneksi (Simulasi).</Text>
      <FormControl><FormLabel>Tautan / URL</FormLabel><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="http://link-mencurigakan.com" /></FormControl>
      <Button colorScheme="brand" onClick={check} isLoading={checking} isDisabled={!url} w="full">Analisis URL</Button>
      {result && (
        <Box w="full" p={4} bg={result.safe ? 'green.50' : 'red.50'} _dark={{ bg: result.safe ? 'green.900' : 'red.900' }} borderRadius="xl">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={result.safe ? FaShieldAlt : FaExclamationCircle} color={result.safe ? 'green.500' : 'red.500'} />
              <Text fontWeight="bold" color={result.safe ? 'green.500' : 'red.500'}>{result.safe ? 'Tautan Aman' : 'Tautan Mencurigakan / Tidak Aman'}</Text>
            </HStack>
            <Text fontSize="xs">{result.reason}</Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ SECURE LOCAL NOTES ═══════ */

const encrypt = (text, key) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(unescape(encodeURIComponent(result)));
};

const decrypt = (encoded, key) => {
  try {
    const text = decodeURIComponent(escape(atob(encoded)));
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    return null;
  }
};

const SecureNotes = () => {
  const [note, setNote] = useState('');
  const [passcode, setPasscode] = useState('');
  const [locked, setLocked] = useState(true);
  const [inputPass, setInputPass] = useState('');
  const toast = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('ngawonggo_sec_note');
    if (saved) {
      setNote(saved); // encrypted string
    }
  }, []);

  const save = () => {
    if (!passcode) {
      toast({ title: 'Masukkan passcode untuk mengunci & menyimpan', status: 'warning', duration: 2000 });
      return;
    }
    const encrypted = encrypt(note, passcode);
    localStorage.setItem('ngawonggo_sec_note', encrypted);
    setLocked(true);
    setNote(encrypted);
    toast({ title: 'Catatan terenkripsi dan disimpan!', status: 'success', duration: 1500 });
  };

  const unlock = () => {
    const decrypted = decrypt(note, inputPass);
    if (decrypted !== null) {
      setNote(decrypted);
      setPasscode(inputPass);
      setLocked(false);
      toast({ title: 'Berhasil membuka catatan!', status: 'success', duration: 1500 });
    } else {
      toast({ title: 'Passcode salah!', status: 'error', duration: 2000 });
    }
  };

  const handleReset = () => {
    localStorage.removeItem('ngawonggo_sec_note');
    setNote('');
    setPasscode('');
    setLocked(false);
    toast({ title: 'Catatan dihapus dari storage', status: 'info', duration: 1500 });
  };

  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <Text fontSize="sm" color="gray.500" textAlign="center">Simpan catatan rahasia di browser Anda. Semua konten dienkripsi lokal sebelum disimpan ke localStorage.</Text>
      
      {locked && note ? (
        <VStack spacing={3} p={6} border="1px solid" borderColor="gray.200" borderRadius="xl" w="full" bg="gray.50" _dark={{ bg: 'gray.900' }}>
          <Icon as={FaLock} size="lg" color="orange.500" />
          <Text fontWeight="bold">Catatan Anda Terkunci</Text>
          <FormControl>
            <FormLabel fontSize="xs">Masukkan Passcode untuk membuka:</FormLabel>
            <Input type="password" value={inputPass} onChange={e => setInputPass(e.target.value)} placeholder="Passcode Anda" />
          </FormControl>
          <HStack w="full">
            <Button colorScheme="brand" onClick={unlock} flex={1} leftIcon={<FaUnlock />}>Buka Catatan</Button>
            <Button colorScheme="red" variant="ghost" onClick={handleReset}>Hapus</Button>
          </HStack>
        </VStack>
      ) : (
        <VStack spacing={4} w="full">
          <FormControl>
            <FormLabel>Isi Catatan Rahasia</FormLabel>
            <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Tulis informasi rahasia Anda di sini..." minH="200px" />
          </FormControl>
          <HStack w="full">
            <FormControl flex={1}>
              <FormLabel fontSize="xs">Set Passcode Enkripsi</FormLabel>
              <Input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} placeholder="Passcode Enkripsi" />
            </FormControl>
            <Button colorScheme="brand" onClick={save} alignSelf="flex-end" leftIcon={<FaLock />}>Kunci & Simpan</Button>
          </HStack>
          {note && (
            <Button colorScheme="red" variant="ghost" size="sm" onClick={handleReset}>Reset/Hapus Semua</Button>
          )}
        </VStack>
      )}
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const SecurityTools = ({ tool }) => {
  switch (tool.config) {
    case 'passStrength': return <PassStrength />;
    case '2fa': return <TwoFactorHelper />;
    case 'hashCheck': return <HashComparer />;
    case 'emailLeak': return <EmailLeakChecker />;
    case 'urlSafe': return <UrlSafetyChecker />;
    case 'secureNotes': return <SecureNotes />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default SecurityTools;
