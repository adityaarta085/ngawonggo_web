/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box, Text, VStack, HStack, Button, Input, Textarea,
  FormControl, FormLabel, useToast, Stat, StatLabel, StatNumber,
  Divider, Badge, Flex, IconButton, Checkbox, Table, Thead, Tbody,
  Tr, Th, Td, Progress
} from '@chakra-ui/react';
import { FaCopy, FaPlus, FaTrash, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

/* ═══════ INVOICE GENERATOR ═══════ */
const InvoiceGen = () => {
  const [company, setCompany] = useState('');
  const [client, setClient] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const toast = useToast();
  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const updateItem = (i, field, val) => { const n = [...items]; n[i][field] = val; setItems(n); };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const copyInvoice = () => {
    const inv = `INVOICE\nDari: ${company}\nKepada: ${client}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n\n${items.map(i => `${i.desc} x${i.qty} = Rp ${(i.qty * i.price).toLocaleString('id-ID')}`).join('\n')}\n\nTOTAL: Rp ${total.toLocaleString('id-ID')}`;
    navigator.clipboard.writeText(inv);
    toast({ title: 'Invoice disalin', status: 'success', duration: 2000 });
  };
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <HStack w="full"><FormControl><FormLabel>Dari (Perusahaan)</FormLabel><Input value={company} onChange={e => setCompany(e.target.value)} /></FormControl><FormControl><FormLabel>Kepada (Klien)</FormLabel><Input value={client} onChange={e => setClient(e.target.value)} /></FormControl></HStack>
      {items.map((item, i) => (
        <HStack key={i} w="full"><Input flex={2} placeholder="Deskripsi" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} /><Input w="70px" type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, 'qty', parseInt(e.target.value) || 0)} /><Input w="120px" type="number" placeholder="Harga" value={item.price} onChange={e => updateItem(i, 'price', parseInt(e.target.value) || 0)} /><IconButton icon={<FaTrash />} size="sm" colorScheme="red" variant="ghost" onClick={() => removeItem(i)} aria-label="Hapus" /></HStack>
      ))}
      <HStack><Button leftIcon={<FaPlus />} onClick={addItem} size="sm" variant="outline">Tambah Item</Button></HStack>
      <Divider /><Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>Total</StatLabel><StatNumber color="brand.500">Rp {total.toLocaleString('id-ID')}</StatNumber></Stat>
      <Button colorScheme="brand" leftIcon={<FaCopy />} onClick={copyInvoice} w="full">Salin Invoice</Button>
    </VStack>
  );
};

/* ═══════ RECEIPT GENERATOR ═══════ */
const ReceiptGen = () => {
  const [store, setStore] = useState('');
  const [items, setItems] = useState([{ name: '', price: 0 }]);
  const toast = useToast();
  const addItem = () => setItems([...items, { name: '', price: 0 }]);
  const updateItem = (i, field, val) => { const n = [...items]; n[i][field] = val; setItems(n); };
  const total = items.reduce((sum, i) => sum + (parseInt(i.price) || 0), 0);
  const copyReceipt = () => {
    const lines = [`==========================`, `  ${store || 'TOKO'}`, `==========================`, `Tanggal: ${new Date().toLocaleDateString('id-ID')}`, ``, ...items.filter(i => i.name).map(i => `${i.name.padEnd(20)} Rp ${parseInt(i.price).toLocaleString('id-ID')}`), `--------------------------`, `TOTAL${' '.repeat(15)}Rp ${total.toLocaleString('id-ID')}`, `==========================`, `  Terima Kasih!`];
    navigator.clipboard.writeText(lines.join('\n'));
    toast({ title: 'Struk disalin', status: 'success', duration: 2000 });
  };
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Nama Toko</FormLabel><Input value={store} onChange={e => setStore(e.target.value)} /></FormControl>
      {items.map((item, i) => (<HStack key={i}><Input placeholder="Nama Item" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} /><Input type="number" placeholder="Harga" w="130px" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} /></HStack>))}
      <Button leftIcon={<FaPlus />} onClick={addItem} size="sm" variant="outline">Tambah Item</Button>
      <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" textAlign="center"><StatLabel>Total</StatLabel><StatNumber color="green.500">Rp {total.toLocaleString('id-ID')}</StatNumber></Stat>
      <Button colorScheme="brand" leftIcon={<FaCopy />} onClick={copyReceipt} w="full">Salin Struk</Button>
    </VStack>
  );
};

/* ═══════ TODO LIST ═══════ */
const TodoList = () => {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('tools_todo') || '[]'); } catch { return []; } });
  const [input, setInput] = useState('');
  useEffect(() => { localStorage.setItem('tools_todo', JSON.stringify(items)); }, [items]);
  const add = () => { if (!input.trim()) return; setItems([...items, { text: input, done: false }]); setInput(''); };
  const toggle = (i) => { const n = [...items]; n[i].done = !n[i].done; setItems(n); };
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <HStack w="full"><Input value={input} onChange={e => setInput(e.target.value)} placeholder="Tambah tugas..." onKeyDown={e => e.key === 'Enter' && add()} /><Button colorScheme="brand" onClick={add}>+</Button></HStack>
      {items.map((item, i) => (
        <Flex key={i} w="full" p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" justify="space-between" align="center">
          <Checkbox isChecked={item.done} onChange={() => toggle(i)}><Text textDecoration={item.done ? 'line-through' : 'none'} color={item.done ? 'gray.400' : 'inherit'}>{item.text}</Text></Checkbox>
          <IconButton icon={<FaTrash />} size="xs" variant="ghost" colorScheme="red" onClick={() => remove(i)} aria-label="Hapus" />
        </Flex>
      ))}
      {items.length > 0 && <Badge>{items.filter(i => i.done).length}/{items.length} selesai</Badge>}
    </VStack>
  );
};

/* ═══════ NOTES ═══════ */
const Notes = () => {
  const [note, setNote] = useState(() => { try { return localStorage.getItem('tools_notes') || ''; } catch { return ''; } });
  const toast = useToast();
  useEffect(() => { localStorage.setItem('tools_notes', note); }, [note]);
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <Textarea value={note} onChange={e => setNote(e.target.value)} minH="400px" placeholder="Tulis catatan di sini..." fontSize="md" />
      <HStack><Badge>{note.length} karakter</Badge><Badge>{note.trim() === '' ? 0 : note.trim().split(/\s+/).length} kata</Badge></HStack>
      <Button size="sm" onClick={() => { navigator.clipboard.writeText(note); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }} leftIcon={<FaCopy />}>Copy</Button>
    </VStack>
  );
};

/* ═══════ POMODORO ═══════ */
const Pomodoro = () => {
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(t); setRunning(false); setSessions(s => s + 1); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const pct = ((duration - remaining) / duration) * 100;

  return (
    <VStack spacing={6} maxW="sm" mx="auto">
      <Box textAlign="center" py={8} position="relative">
        <Text fontSize="7xl" fontWeight="bold" fontFamily="monospace" color={remaining === 0 ? 'red.500' : 'brand.500'}>{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</Text>
        <Progress value={pct} colorScheme="brand" borderRadius="full" mt={4} />
      </Box>
      <HStack spacing={4}>
        {!running ? <Button colorScheme="green" leftIcon={<FaPlay />} onClick={() => { if (remaining === 0) setRemaining(duration); setRunning(true); }}>Mulai</Button> : <Button colorScheme="orange" leftIcon={<FaPause />} onClick={() => setRunning(false)}>Pause</Button>}
        <Button leftIcon={<FaRedo />} onClick={() => { setRunning(false); setRemaining(duration); }}>Reset</Button>
      </HStack>
      <HStack spacing={2}>
        {[25, 15, 5].map(m => <Button key={m} size="sm" variant={duration === m * 60 ? 'solid' : 'outline'} colorScheme="brand" onClick={() => { setDuration(m * 60); setRemaining(m * 60); setRunning(false); }}>{m} min</Button>)}
      </HStack>
      <Badge colorScheme="green">Sesi selesai: {sessions}</Badge>
    </VStack>
  );
};

/* ═══════ EMAIL TEMPLATE ═══════ */
const EmailTpl = () => {
  const [type, setType] = useState('formal');
  const toast = useToast();
  const templates = {
    formal: `Dengan hormat,\n\nSehubungan dengan [topik], kami bermaksud untuk [tujuan].\n\nBersama surat ini, kami sampaikan [detail].\n\nDemikian surat ini kami buat. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.\n\nHormat kami,\n[Nama]\n[Jabatan]`,
    followup: `Halo [Nama],\n\nSaya ingin menindaklanjuti [topik] yang telah kita bahas sebelumnya pada [tanggal].\n\nApakah ada perkembangan terbaru yang bisa dibagikan?\n\nTerima kasih atas waktunya.\n\nSalam,\n[Nama Anda]`,
    lamaran: `Yth. HRD [Perusahaan],\n\nDengan ini saya [Nama] bermaksud melamar posisi [Posisi] yang tersedia di perusahaan Bapak/Ibu.\n\nSaya memiliki pengalaman di bidang [bidang] selama [durasi] tahun. Saya yakin dapat memberikan kontribusi positif bagi perusahaan.\n\nTerlampir CV dan dokumen pendukung.\n\nTerima kasih atas kesempatan yang diberikan.\n\nHormat saya,\n[Nama]`,
  };
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <HStack>{Object.keys(templates).map(t => <Button key={t} size="sm" colorScheme={type === t ? 'brand' : 'gray'} onClick={() => setType(t)}>{t === 'formal' ? 'Formal' : t === 'followup' ? 'Follow Up' : 'Lamaran'}</Button>)}</HStack>
      <Textarea value={templates[type]} isReadOnly minH="300px" />
      <Button colorScheme="brand" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(templates[type]); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Salin Template</Button>
    </VStack>
  );
};

/* ═══════ PROPOSAL TEMPLATE ═══════ */
const ProposalTpl = () => {
  const toast = useToast();
  const tpl = `PROPOSAL [JUDUL PROYEK]\n\n1. PENDAHULUAN\nLatar belakang: [jelaskan latar belakang]\n\n2. TUJUAN\n- [Tujuan 1]\n- [Tujuan 2]\n\n3. RINCIAN KEGIATAN\n[Deskripsi kegiatan yang akan dilakukan]\n\n4. ANGGARAN\n| No | Item | Jumlah | Harga | Total |\n|----|------|--------|-------|-------|\n| 1  | [item] | [qty] | [harga] | [total] |\n\nTotal Anggaran: Rp [total]\n\n5. TIMELINE\n- Minggu 1-2: [kegiatan]\n- Minggu 3-4: [kegiatan]\n\n6. PENUTUP\nDemikian proposal ini kami ajukan.\n\n[Kota], [Tanggal]\n[Nama]`;
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <Textarea value={tpl} isReadOnly minH="400px" fontFamily="monospace" fontSize="sm" />
      <Button colorScheme="brand" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(tpl); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Salin Template</Button>
    </VStack>
  );
};

/* ═══════ CHECKLIST ═══════ */
const ChecklistGen = () => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['']);
  const toast = useToast();
  const addItem = () => setItems([...items, '']);
  const updateItem = (i, val) => { const n = [...items]; n[i] = val; setItems(n); };
  const copyChecklist = () => {
    const text = `${title ? `# ${title}\n\n` : ''}${items.filter(Boolean).map(i => `☐ ${i}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Disalin', status: 'success', duration: 1500 });
  };
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <FormControl><FormLabel>Judul Checklist</FormLabel><Input value={title} onChange={e => setTitle(e.target.value)} /></FormControl>
      {items.map((item, i) => <HStack key={i} w="full"><Text color="gray.400">☐</Text><Input value={item} onChange={e => updateItem(i, e.target.value)} placeholder={`Item ${i + 1}`} /></HStack>)}
      <Button leftIcon={<FaPlus />} onClick={addItem} size="sm" variant="outline">Tambah Item</Button>
      <Button colorScheme="brand" leftIcon={<FaCopy />} onClick={copyChecklist} w="full">Salin Checklist</Button>
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const BusinessTools = ({ tool }) => {
  switch (tool.config) {
    case 'invoice': return <InvoiceGen />;
    case 'receipt': return <ReceiptGen />;
    case 'todo': return <TodoList />;
    case 'notes': return <Notes />;
    case 'pomodoro': return <Pomodoro />;
    case 'emailTpl': return <EmailTpl />;
    case 'proposalTpl': return <ProposalTpl />;
    case 'checklist': return <ChecklistGen />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default BusinessTools;
