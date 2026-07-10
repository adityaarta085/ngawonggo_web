import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input, Select,
  FormControl, FormLabel, Stat, StatLabel, StatNumber, Badge,
  useColorModeValue, Flex, IconButton, Divider, useToast
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaStop, FaPlus, FaTrash, FaRedo } from 'react-icons/fa';

/* ═══════ WORLD CLOCK ═══════ */
const WorldClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const zones = [
    { name: 'WIB (Jakarta)', tz: 'Asia/Jakarta' },
    { name: 'WITA (Makassar)', tz: 'Asia/Makassar' },
    { name: 'WIT (Jayapura)', tz: 'Asia/Jayapura' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Singapore', tz: 'Asia/Singapore' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Paris', tz: 'Europe/Paris' },
    { name: 'Moscow', tz: 'Europe/Moscow' },
  ];
  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
      {zones.map(z => (
        <Stat key={z.tz} p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" textAlign="center">
          <StatLabel fontSize="xs" noOfLines={1}>{z.name}</StatLabel>
          <StatNumber fontSize="xl" fontFamily="monospace" color="brand.500">
            {now.toLocaleTimeString('id-ID', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </StatNumber>
          <Text fontSize="xs" color="gray.400">
            {now.toLocaleDateString('id-ID', { timeZone: z.tz, weekday: 'short', day: 'numeric', month: 'short' })}
          </Text>
        </Stat>
      ))}
    </SimpleGrid>
  );
};

/* ═══════ STOPWATCH ═══════ */
const Stopwatch = () => {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = () => {
    if (running) return;
    setRunning(true);
    startTimeRef.current = Date.now() - ms;
    intervalRef.current = setInterval(() => {
      setMs(Date.now() - startTimeRef.current);
    }, 10);
  };
  const stop = () => { setRunning(false); clearInterval(intervalRef.current); };
  const reset = () => { stop(); setMs(0); setLaps([]); };
  const lap = () => { setLaps(prev => [ms, ...prev]); };

  const formatTime = (milliseconds) => {
    const m = Math.floor(milliseconds / 60000);
    const s = Math.floor((milliseconds % 60000) / 1000);
    const cs = Math.floor((milliseconds % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  useEffect(() => { return () => clearInterval(intervalRef.current); }, []);

  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Box textAlign="center" py={8}>
        <Text fontSize="6xl" fontWeight="bold" fontFamily="monospace" color="brand.500">{formatTime(ms)}</Text>
      </Box>
      <HStack spacing={4} justify="center">
        {!running ? (
          <Button colorScheme="green" size="lg" leftIcon={<FaPlay />} onClick={start}>Mulai</Button>
        ) : (
          <Button colorScheme="orange" size="lg" leftIcon={<FaPause />} onClick={stop}>Pause</Button>
        )}
        <Button colorScheme="brand" size="lg" onClick={lap} isDisabled={!running}>Lap</Button>
        <Button colorScheme="red" size="lg" leftIcon={<FaStop />} onClick={reset}>Reset</Button>
      </HStack>
      {laps.length > 0 && (
        <Box w="full" maxH="200px" overflowY="auto">
          {laps.map((l, i) => (
            <Flex key={i} justify="space-between" py={2} px={4} bg={i % 2 === 0 ? 'gray.50' : 'transparent'} _dark={{ bg: i % 2 === 0 ? 'gray.800' : 'transparent' }} borderRadius="md">
              <Badge>Lap {laps.length - i}</Badge>
              <Text fontFamily="monospace" fontWeight="bold">{formatTime(l)}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ TIMER / COUNTDOWN ═══════ */
const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

  const start = () => {
    if (running) return;
    const target = remaining !== null ? remaining : totalMs;
    if (target <= 0) return;
    setRunning(true);
    const endTime = Date.now() + target;
    intervalRef.current = setInterval(() => {
      const left = endTime - Date.now();
      if (left <= 0) {
        clearInterval(intervalRef.current);
        setRemaining(0);
        setRunning(false);
        try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVggoGSnaCckGg8Kklkb3qFhXx0a2JfZXCBjJOQhXJhUUJBTmV6iY6MhnxrWk1FQ1NmeoiQkYd7bF5TS0hUaHuHjI2FeW1gU0tIUmh7h42OhXtuYFRMSlJoeIeOjoV7bmFUTUlSaHmIj42Fe29hVU5KUmd4iI+NhXtwYVVOS1FneIiPjYZ7cGFVT0tRZ3eIj42Ge3BhVU9LUWd3iI+NhXtvYVVPS1Fnd4iPjYZ7cGJWUEtRZ3eIj42Ge3BiVlBLUWd3iI+Nhnt='
            ).play().catch(() => {}); } catch(e) { /* ignore */ }
      } else {
        setRemaining(left);
      }
    }, 100);
  };
  const pause = () => { setRunning(false); clearInterval(intervalRef.current); };
  const reset = () => { pause(); setRemaining(null); };

  const display = remaining !== null ? remaining : totalMs;
  const h = Math.floor(display / 3600000);
  const m = Math.floor((display % 3600000) / 60000);
  const s = Math.floor((display % 60000) / 1000);

  useEffect(() => { return () => clearInterval(intervalRef.current); }, []);

  return (
    <VStack spacing={6} maxW="md" mx="auto">
      {remaining === null ? (
        <HStack spacing={4} justify="center">
          <FormControl w="80px"><FormLabel textAlign="center">Jam</FormLabel><Input type="number" value={hours} onChange={e => setHours(parseInt(e.target.value) || 0)} min={0} textAlign="center" /></FormControl>
          <FormControl w="80px"><FormLabel textAlign="center">Menit</FormLabel><Input type="number" value={minutes} onChange={e => setMinutes(parseInt(e.target.value) || 0)} min={0} max={59} textAlign="center" /></FormControl>
          <FormControl w="80px"><FormLabel textAlign="center">Detik</FormLabel><Input type="number" value={seconds} onChange={e => setSeconds(parseInt(e.target.value) || 0)} min={0} max={59} textAlign="center" /></FormControl>
        </HStack>
      ) : (
        <Box textAlign="center" py={8}>
          <Text fontSize="6xl" fontWeight="bold" fontFamily="monospace" color={remaining <= 0 ? 'red.500' : 'brand.500'}>
            {remaining <= 0 ? '00:00:00' : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}
          </Text>
          {remaining <= 0 && <Badge colorScheme="red" fontSize="lg" mt={2}>Waktu Habis!</Badge>}
        </Box>
      )}
      <HStack spacing={4} justify="center">
        {!running ? (
          <Button colorScheme="green" size="lg" leftIcon={<FaPlay />} onClick={start} isDisabled={remaining !== null && remaining <= 0}>Mulai</Button>
        ) : (
          <Button colorScheme="orange" size="lg" leftIcon={<FaPause />} onClick={pause}>Pause</Button>
        )}
        <Button colorScheme="red" size="lg" leftIcon={<FaRedo />} onClick={reset}>Reset</Button>
      </HStack>
    </VStack>
  );
};

/* ═══════ CALENDAR ═══════ */
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const todayBg = useColorModeValue('brand.500', 'brand.400');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <VStack spacing={4} maxW="sm" mx="auto">
      <Flex justify="space-between" w="full" align="center">
        <Button size="sm" onClick={prevMonth}>&lt;</Button>
        <Text fontWeight="bold" fontSize="lg">{monthNames[month]} {year}</Text>
        <Button size="sm" onClick={nextMonth}>&gt;</Button>
      </Flex>
      <SimpleGrid columns={7} spacing={1} w="full">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
          <Text key={d} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500" py={2}>{d}</Text>
        ))}
        {days.map((d, i) => (
          <Box key={i} textAlign="center" py={2} borderRadius="lg" cursor={d ? 'pointer' : 'default'}
            bg={d && d === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? todayBg : 'transparent'}
            color={d && d === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 'white' : 'inherit'}
            _hover={d ? { bg: 'brand.100', _dark: { bg: 'brand.800' } } : {}}
          >
            <Text fontSize="sm">{d || ''}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ DATE DIFF ═══════ */
const DateDiff = () => {
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const r = (() => {
    if (!d1 || !d2) return null;
    const a = new Date(d1), b = new Date(d2);
    const diff = Math.abs(b - a);
    const days = Math.floor(diff / 86400000);
    return { days, weeks: Math.floor(days / 7), months: Math.floor(days / 30.44), hours: days * 24 };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <HStack spacing={4} w="full">
        <FormControl><FormLabel>Tanggal Awal</FormLabel><Input type="date" value={d1} onChange={e => setD1(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Tanggal Akhir</FormLabel><Input type="date" value={d2} onChange={e => setD2(e.target.value)} /></FormControl>
      </HStack>
      {r && (
        <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3} w="full">
          <Stat p={3} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" textAlign="center"><StatLabel>Hari</StatLabel><StatNumber color="brand.500">{r.days}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Minggu</StatLabel><StatNumber>{r.weeks}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Bulan</StatLabel><StatNumber>{r.months}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Jam</StatLabel><StatNumber>{r.hours.toLocaleString()}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ ADD/SUBTRACT DAYS ═══════ */
const AddSubtract = () => {
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [num, setNum] = useState(7);
  const [unit, setUnit] = useState('days');
  const result = (() => {
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return null;
    if (unit === 'days') d.setDate(d.getDate() + num);
    else if (unit === 'weeks') d.setDate(d.getDate() + num * 7);
    else if (unit === 'months') d.setMonth(d.getMonth() + num);
    else if (unit === 'years') d.setFullYear(d.getFullYear() + num);
    return d;
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Tanggal Awal</FormLabel><Input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)} /></FormControl>
      <HStack spacing={4}>
        <FormControl><FormLabel>Jumlah</FormLabel><Input type="number" value={num} onChange={e => setNum(parseInt(e.target.value) || 0)} /></FormControl>
        <FormControl><FormLabel>Satuan</FormLabel>
          <Select value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="days">Hari</option><option value="weeks">Minggu</option>
            <option value="months">Bulan</option><option value="years">Tahun</option>
          </Select>
        </FormControl>
      </HStack>
      {result && (
        <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
          <StatLabel>Hasil</StatLabel>
          <StatNumber color="brand.500">{result.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</StatNumber>
        </Stat>
      )}
    </VStack>
  );
};

/* ═══════ TIMEZONE CONVERTER ═══════ */
const TimezoneConverter = () => {
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromTz, setFromTz] = useState('Asia/Jakarta');
  const [toTz, setToTz] = useState('America/New_York');
  const tzList = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Tokyo', 'Asia/Singapore', 'Asia/Dubai', 'Europe/London', 'Europe/Paris', 'Europe/Moscow', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney', 'Pacific/Auckland'];
  const result = (() => {
    try {
      const [h, m] = time.split(':').map(Number);
      const d = new Date(date);
      d.setHours(h, m, 0, 0);
      return d.toLocaleString('id-ID', { timeZone: toTz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return null; }
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <HStack spacing={4} w="full">
        <FormControl><FormLabel>Tanggal</FormLabel><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Waktu</FormLabel><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></FormControl>
      </HStack>
      <HStack spacing={4} w="full">
        <FormControl><FormLabel>Dari</FormLabel><Select value={fromTz} onChange={e => setFromTz(e.target.value)}>{tzList.map(t => <option key={t} value={t}>{t.split('/')[1]}</option>)}</Select></FormControl>
        <FormControl><FormLabel>Ke</FormLabel><Select value={toTz} onChange={e => setToTz(e.target.value)}>{tzList.map(t => <option key={t} value={t}>{t.split('/')[1]}</option>)}</Select></FormControl>
      </HStack>
      {result && <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>Waktu di {toTz.split('/')[1]}</StatLabel><StatNumber fontSize="xl" color="brand.500">{result}</StatNumber></Stat>}
    </VStack>
  );
};

/* ═══════ TIMESTAMP ═══════ */
const TimestampConverter = () => {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState('');
  const toast = useToast();
  const fromTs = (() => { const n = parseInt(ts); if (isNaN(n)) return null; const d = new Date(n * 1000); return d.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' }); })();
  const toTs = dateStr ? Math.floor(new Date(dateStr).getTime() / 1000) : null;
  const nowTs = Math.floor(Date.now() / 1000);
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Stat p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" textAlign="center" cursor="pointer" onClick={() => { navigator.clipboard.writeText(String(nowTs)); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
        <StatLabel>Timestamp Sekarang</StatLabel><StatNumber fontFamily="monospace" color="brand.500">{nowTs}</StatNumber>
      </Stat>
      <Divider />
      <FormControl><FormLabel>Unix Timestamp → Tanggal</FormLabel><Input type="number" value={ts} onChange={e => setTs(e.target.value)} /></FormControl>
      {fromTs && <Box p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg"><Text fontWeight="bold" color="brand.500">{fromTs}</Text></Box>}
      <Divider />
      <FormControl><FormLabel>Tanggal → Unix Timestamp</FormLabel><Input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} /></FormControl>
      {toTs && <Box p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" cursor="pointer" onClick={() => { navigator.clipboard.writeText(String(toTs)); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}><Text fontWeight="bold" fontFamily="monospace" color="brand.500">{toTs}</Text></Box>}
    </VStack>
  );
};

/* ═══════ DAY OF YEAR ═══════ */
const DayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const day = Math.floor(diff / 86400000);
  const total = (now.getFullYear() % 4 === 0) ? 366 : 365;
  const pct = ((day / total) * 100).toFixed(1);
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Stat p={8} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
        <StatLabel>Hari ke- dalam tahun {now.getFullYear()}</StatLabel>
        <StatNumber fontSize="5xl" color="brand.500">{day}</StatNumber>
        <Text color="gray.500">dari {total} hari ({pct}% telah berlalu)</Text>
      </Stat>
      <Box w="full" h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
        <Box h="full" w={`${pct}%`} bg="brand.500" borderRadius="full" transition="width 0.5s" />
      </Box>
      <SimpleGrid columns={2} spacing={3} w="full">
        <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Hari Tersisa</StatLabel><StatNumber>{total - day}</StatNumber></Stat>
        <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Minggu Tersisa</StatLabel><StatNumber>{Math.ceil((total - day) / 7)}</StatNumber></Stat>
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ SCHEDULE GENERATOR ═══════ */
const ScheduleGen = () => {
  const [items, setItems] = useState([{ time: '08:00', activity: 'Kegiatan 1' }]);
  const toast = useToast();
  const addItem = () => setItems([...items, { time: '', activity: '' }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => { const n = [...items]; n[i][field] = value; setItems(n); };
  const copySchedule = () => {
    const text = items.filter(i => i.time && i.activity).map(i => `${i.time} - ${i.activity}`).join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Jadwal disalin', status: 'success', duration: 2000 });
  };
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      {items.map((item, i) => (
        <HStack key={i} spacing={3} w="full">
          <Input type="time" value={item.time} onChange={e => updateItem(i, 'time', e.target.value)} w="130px" />
          <Input value={item.activity} onChange={e => updateItem(i, 'activity', e.target.value)} placeholder="Aktivitas..." flex={1} />
          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" variant="ghost" onClick={() => removeItem(i)} aria-label="Hapus" />
        </HStack>
      ))}
      <HStack spacing={4}>
        <Button leftIcon={<FaPlus />} onClick={addItem} variant="outline" size="sm">Tambah</Button>
        <Button colorScheme="brand" onClick={copySchedule} size="sm">Salin Jadwal</Button>
      </HStack>
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const DateTimeTools = ({ tool }) => {
  switch (tool.config) {
    case 'worldClock': return <WorldClock />;
    case 'stopwatch': return <Stopwatch />;
    case 'timer': return <Timer />;
    case 'calendar': return <Calendar />;
    case 'dateDiff': return <DateDiff />;
    case 'addSubtract': return <AddSubtract />;
    case 'timezone': return <TimezoneConverter />;
    case 'timestamp': return <TimestampConverter />;
    case 'dayOfYear': return <DayOfYear />;
    case 'schedule': return <ScheduleGen />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default DateTimeTools;
