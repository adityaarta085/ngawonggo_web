import React, { useState } from 'react';
import {
  Box, Text, VStack, HStack, Button, Textarea, Input,
  FormControl, FormLabel, useToast, Select, SimpleGrid,
  Stat, StatLabel, StatNumber, Badge, Flex, Checkbox,
  Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react';
import { FaCopy, FaCheck, FaTimes } from 'react-icons/fa';

const copyBtn = (text, toast) => ({
  size: 'sm', variant: 'ghost', onClick: () => { navigator.clipboard.writeText(text); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }
});

/* ═══════ JSON FORMATTER ═══════ */
const JsonFmt = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const toast = useToast();
  const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, indent)); } catch (e) { setOutput(`Error: ${e.message}`); } };
  const minify = () => { try { setOutput(JSON.stringify(JSON.parse(input))); } catch (e) { setOutput(`Error: ${e.message}`); } };
  return (
    <VStack spacing={4}>
      <FormControl><FormLabel>Input JSON</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="200px" fontFamily="monospace" fontSize="sm" /></FormControl>
      <HStack><Button colorScheme="brand" onClick={format}>Format</Button><Button onClick={minify}>Minify</Button>
        <Select w="120px" value={indent} onChange={e => setIndent(Number(e.target.value))}><option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={1}>Tab</option></Select>
      </HStack>
      {output && <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Hasil</Text><Button {...copyBtn(output, toast)} leftIcon={<FaCopy />}>Copy</Button></Flex><Textarea value={output} isReadOnly minH="200px" fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>}
    </VStack>
  );
};

/* ═══════ JSON VALIDATOR ═══════ */
const JsonVal = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const validate = () => {
    try { JSON.parse(input); setResult({ valid: true, msg: 'JSON valid!' }); } catch (e) { setResult({ valid: false, msg: e.message }); }
  };
  return (
    <VStack spacing={4}>
      <FormControl><FormLabel>Paste JSON</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="200px" fontFamily="monospace" fontSize="sm" /></FormControl>
      <Button colorScheme="brand" onClick={validate} w="full" size="lg">Validasi</Button>
      {result && (
        <Box w="full" p={4} bg={result.valid ? 'green.50' : 'red.50'} _dark={{ bg: result.valid ? 'green.900' : 'red.900' }} borderRadius="xl" textAlign="center">
          <HStack justify="center"><Box as={result.valid ? FaCheck : FaTimes} color={result.valid ? 'green.500' : 'red.500'} /><Text fontWeight="bold" color={result.valid ? 'green.500' : 'red.500'}>{result.msg}</Text></HStack>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ CODE FORMATTERS (HTML, XML, CSS, JS) ═══════ */
const CodeFmt = ({ tool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const toast = useToast();
  const labels = { xmlFmt: 'XML', htmlFmt: 'HTML', cssFmt: 'CSS', jsFmt: 'JavaScript' };

  const format = () => {
    let result = input;
    if (tool.config === 'htmlFmt' || tool.config === 'xmlFmt') {
      let indent = 0;
      result = input.replace(/>\s*</g, '>\n<').split('\n').map(line => {
        line = line.trim();
        if (line.match(/^<\//)) indent--;
        const indented = '  '.repeat(Math.max(0, indent)) + line;
        if (line.match(/^<[^/!]/) && !line.match(/\/>$/) && !line.match(/^<(br|hr|img|input|meta|link)/i)) indent++;
        return indented;
      }).join('\n');
    } else if (tool.config === 'cssFmt') {
      result = input.replace(/\{/g, ' {\n  ').replace(/;/g, ';\n  ').replace(/\}/g, '\n}\n').replace(/\n\s*\n/g, '\n').replace(/  \n/g, '\n');
    } else if (tool.config === 'jsFmt') {
      // Basic JS formatting
      let indent = 0;
      result = input.replace(/([{;])\s*/g, '$1\n').replace(/\}/g, '\n}').split('\n').map(line => {
        line = line.trim();
        if (!line) return '';
        if (line.startsWith('}')) indent--;
        const indented = '  '.repeat(Math.max(0, indent)) + line;
        if (line.endsWith('{')) indent++;
        return indented;
      }).filter(Boolean).join('\n');
    }
    setOutput(result);
  };

  return (
    <VStack spacing={4}>
      <FormControl><FormLabel>Input {labels[tool.config]}</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="200px" fontFamily="monospace" fontSize="sm" /></FormControl>
      <Button colorScheme="brand" onClick={format} w="full" size="lg">Format {labels[tool.config]}</Button>
      {output && <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Hasil</Text><Button {...copyBtn(output, toast)} leftIcon={<FaCopy />}>Copy</Button></Flex><Textarea value={output} isReadOnly minH="200px" fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>}
    </VStack>
  );
};

/* ═══════ MINIFY ═══════ */
const Minify = () => {
  const [input, setInput] = useState('');
  const [type, setType] = useState('html');
  const [output, setOutput] = useState('');
  const toast = useToast();
  const doMinify = () => {
    let r = input;
    if (type === 'html') r = input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    else if (type === 'css') r = input.replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/\s*;\s*/g, ';').replace(/\s*:\s*/g, ':').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    else if (type === 'js') r = input.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
    setOutput(r);
  };
  const saved = input.length > 0 ? ((1 - output.length / input.length) * 100).toFixed(1) : 0;
  return (
    <VStack spacing={4}>
      <Select value={type} onChange={e => setType(e.target.value)}><option value="html">HTML</option><option value="css">CSS</option><option value="js">JavaScript</option></Select>
      <FormControl><FormLabel>Input Code</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="200px" fontFamily="monospace" fontSize="sm" /></FormControl>
      <Button colorScheme="brand" onClick={doMinify} w="full" size="lg">Minify</Button>
      {output && (
        <>
          <HStack w="full" justify="space-between"><Badge colorScheme="green">Hemat {saved}%</Badge><Badge>{input.length} → {output.length} karakter</Badge></HStack>
          <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Hasil</Text><Button {...copyBtn(output, toast)} leftIcon={<FaCopy />}>Copy</Button></Flex><Textarea value={output} isReadOnly minH="150px" fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>
        </>
      )}
    </VStack>
  );
};

/* ═══════ REGEX TESTER ═══════ */
const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState('');
  const matches = (() => {
    if (!pattern || !text) return [];
    try { const re = new RegExp(pattern, flags); const m = [...text.matchAll(re)]; return m; } catch { return []; }
  })();
  return (
    <VStack spacing={4}>
      <HStack w="full">
        <FormControl flex={1}><FormLabel>Pattern</FormLabel><Input value={pattern} onChange={e => setPattern(e.target.value)} fontFamily="monospace" placeholder="\\w+" /></FormControl>
        <FormControl w="100px"><FormLabel>Flags</FormLabel><Input value={flags} onChange={e => setFlags(e.target.value)} fontFamily="monospace" /></FormControl>
      </HStack>
      <FormControl><FormLabel>Test String</FormLabel><Textarea value={text} onChange={e => setText(e.target.value)} minH="150px" /></FormControl>
      <Box w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl">
        <Text fontWeight="bold" mb={2}>{matches.length} match(es)</Text>
        {matches.map((m, i) => (
          <Badge key={i} mr={2} mb={2} colorScheme="brand" px={3} py={1}>{m[0]} <Text as="span" fontSize="xs" color="gray.400">@{m.index}</Text></Badge>
        ))}
      </Box>
    </VStack>
  );
};

/* ═══════ JWT DECODER ═══════ */
const JwtDecoder = () => {
  const [token, setToken] = useState('');
  const decoded = (() => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { error: 'JWT harus memiliki 3 bagian' };
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const expDate = payload.exp ? new Date(payload.exp * 1000).toLocaleString('id-ID') : null;
      return { header, payload, expired: payload.exp ? Date.now() > payload.exp * 1000 : null, expDate };
    } catch (e) { return { error: e.message }; }
  })();
  return (
    <VStack spacing={4}>
      <FormControl><FormLabel>JWT Token</FormLabel><Textarea value={token} onChange={e => setToken(e.target.value)} minH="100px" fontFamily="monospace" fontSize="sm" placeholder="eyJhbGciOiJIUzI1NiIs..." /></FormControl>
      {decoded && (
        decoded.error ? <Badge colorScheme="red" p={3}>{decoded.error}</Badge> : (
          <VStack spacing={3} w="full">
            {decoded.expired !== null && <Badge colorScheme={decoded.expired ? 'red' : 'green'} px={4} py={2} fontSize="md">{decoded.expired ? `Expired: ${decoded.expDate}` : `Valid until: ${decoded.expDate}`}</Badge>}
            <Box w="full"><Text fontWeight="bold" mb={1}>Header</Text><Textarea value={JSON.stringify(decoded.header, null, 2)} isReadOnly fontFamily="monospace" fontSize="sm" minH="80px" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>
            <Box w="full"><Text fontWeight="bold" mb={1}>Payload</Text><Textarea value={JSON.stringify(decoded.payload, null, 2)} isReadOnly fontFamily="monospace" fontSize="sm" minH="150px" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>
          </VStack>
        )
      )}
    </VStack>
  );
};

/* ═══════ BASE64 ═══════ */
const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const toast = useToast();
  const process = () => {
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else setOutput(decodeURIComponent(escape(atob(input))));
    } catch (e) { setOutput(`Error: ${e.message}`); }
  };
  return (
    <VStack spacing={4}>
      <HStack><Button colorScheme={mode === 'encode' ? 'brand' : 'gray'} onClick={() => setMode('encode')}>Encode</Button><Button colorScheme={mode === 'decode' ? 'brand' : 'gray'} onClick={() => setMode('decode')}>Decode</Button></HStack>
      <FormControl><FormLabel>Input</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="150px" fontFamily="monospace" fontSize="sm" /></FormControl>
      <Button colorScheme="brand" onClick={process} w="full">{mode === 'encode' ? 'Encode' : 'Decode'}</Button>
      {output && <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Hasil</Text><Button {...copyBtn(output, toast)} leftIcon={<FaCopy />}>Copy</Button></Flex><Textarea value={output} isReadOnly minH="150px" fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>}
    </VStack>
  );
};

/* ═══════ UUID GENERATOR ═══════ */
const UuidGen = () => {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(5);
  const toast = useToast();
  const generate = () => { const list = []; for (let i = 0; i < count; i++) list.push(crypto.randomUUID()); setUuids(list); };
  return (
    <VStack spacing={4}>
      <HStack><Input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} w="100px" min={1} max={50} /><Button colorScheme="brand" onClick={generate}>Generate UUID</Button></HStack>
      {uuids.map((u, i) => (
        <Flex key={i} w="full" p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" justify="space-between" align="center" cursor="pointer" onClick={() => { navigator.clipboard.writeText(u); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
          <Text fontFamily="monospace" fontSize="sm">{u}</Text><FaCopy color="gray" />
        </Flex>
      ))}
    </VStack>
  );
};

/* ═══════ HASH GENERATOR ═══════ */
const HashGen = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({});
  const toast = useToast();
  const generate = async () => {
    const enc = new TextEncoder().encode(input);
    const results = {};
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
      const hash = await crypto.subtle.digest(algo, enc);
      results[algo] = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    setHashes(results);
  };
  return (
    <VStack spacing={4}>
      <FormControl><FormLabel>Input Text</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="100px" /></FormControl>
      <Button colorScheme="brand" onClick={generate} w="full">Generate Hash</Button>
      {Object.keys(hashes).length > 0 && Object.entries(hashes).map(([algo, hash]) => (
        <Box key={algo} w="full" p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer" onClick={() => { navigator.clipboard.writeText(hash); toast({ title: `${algo} disalin`, status: 'success', duration: 1500 }); }}>
          <Text fontSize="xs" fontWeight="bold" color="gray.500">{algo}</Text>
          <Text fontFamily="monospace" fontSize="xs" wordBreak="break-all">{hash}</Text>
        </Box>
      ))}
    </VStack>
  );
};

/* ═══════ LOREM API TESTER ═══════ */
const LoremApi = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    try {
      const opts = { method };
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = body;
      }
      const res = await fetch(url, opts);
      setStatus(res.status);
      const text = await res.text();
      try { setResponse(JSON.stringify(JSON.parse(text), null, 2)); } catch { setResponse(text); }
    } catch (e) { setResponse(`Error: ${e.message}`); setStatus(0); }
    setLoading(false);
  };

  return (
    <VStack spacing={4}>
      <HStack w="full">
        <Select value={method} onChange={e => setMethod(e.target.value)} w="120px"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option></Select>
        <Input value={url} onChange={e => setUrl(e.target.value)} flex={1} fontFamily="monospace" fontSize="sm" />
        <Button colorScheme="brand" onClick={send} isLoading={loading}>Send</Button>
      </HStack>
      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <FormControl><FormLabel>Request Body (JSON)</FormLabel><Textarea value={body} onChange={e => setBody(e.target.value)} fontFamily="monospace" fontSize="sm" minH="100px" /></FormControl>
      )}
      {status !== null && <Badge colorScheme={status >= 200 && status < 300 ? 'green' : status >= 400 ? 'red' : 'yellow'} fontSize="md" px={4} py={1}>Status: {status}</Badge>}
      {response && <Textarea value={response} isReadOnly minH="300px" fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} />}
    </VStack>
  );
};

/* ═══════ CRON EXPRESSION ═══════ */
const CronGen = () => {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const toast = useToast();
  const expr = `${min} ${hour} ${dom} ${month} ${dow}`;
  const describe = () => {
    const parts = [];
    if (min === '*' && hour === '*') parts.push('Setiap menit');
    else if (min === '0' && hour === '*') parts.push('Setiap jam');
    else if (min !== '*' && hour !== '*') parts.push(`Pada ${hour}:${min.padStart(2, '0')}`);
    else if (min === '*/5') parts.push('Setiap 5 menit');
    else if (min === '*/15') parts.push('Setiap 15 menit');
    else if (min === '*/30') parts.push('Setiap 30 menit');
    else parts.push(`Menit: ${min}, Jam: ${hour}`);
    if (dom !== '*') parts.push(`tanggal ${dom}`);
    if (month !== '*') parts.push(`bulan ${month}`);
    if (dow !== '*') { const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']; parts.push(`hari ${days[parseInt(dow)] || dow}`); }
    return parts.join(', ');
  };

  const presets = [
    { label: 'Setiap menit', value: '* * * * *' },
    { label: 'Setiap 5 menit', value: '*/5 * * * *' },
    { label: 'Setiap jam', value: '0 * * * *' },
    { label: 'Setiap hari pukul 00:00', value: '0 0 * * *' },
    { label: 'Setiap Senin 08:00', value: '0 8 * * 1' },
    { label: 'Setiap tanggal 1 00:00', value: '0 0 1 * *' },
  ];

  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <SimpleGrid columns={5} spacing={2} w="full">
        <FormControl><FormLabel fontSize="xs">Menit</FormLabel><Input value={min} onChange={e => setMin(e.target.value)} fontFamily="monospace" textAlign="center" /></FormControl>
        <FormControl><FormLabel fontSize="xs">Jam</FormLabel><Input value={hour} onChange={e => setHour(e.target.value)} fontFamily="monospace" textAlign="center" /></FormControl>
        <FormControl><FormLabel fontSize="xs">Tanggal</FormLabel><Input value={dom} onChange={e => setDom(e.target.value)} fontFamily="monospace" textAlign="center" /></FormControl>
        <FormControl><FormLabel fontSize="xs">Bulan</FormLabel><Input value={month} onChange={e => setMonth(e.target.value)} fontFamily="monospace" textAlign="center" /></FormControl>
        <FormControl><FormLabel fontSize="xs">Hari</FormLabel><Input value={dow} onChange={e => setDow(e.target.value)} fontFamily="monospace" textAlign="center" /></FormControl>
      </SimpleGrid>
      <Box w="full" p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center" cursor="pointer" onClick={() => { navigator.clipboard.writeText(expr); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
        <Text fontFamily="monospace" fontSize="2xl" fontWeight="bold" color="brand.500">{expr}</Text>
        <Text fontSize="sm" color="gray.500" mt={2}>{describe()}</Text>
      </Box>
      <SimpleGrid columns={2} spacing={2} w="full">
        {presets.map(p => (
          <Button key={p.label} size="sm" variant="outline" onClick={() => { const [a, b, c, d, e] = p.value.split(' '); setMin(a); setHour(b); setDom(c); setMonth(d); setDow(e); }}>{p.label}</Button>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const DevTools = ({ tool }) => {
  switch (tool.config) {
    case 'jsonFmt': return <JsonFmt />;
    case 'jsonVal': return <JsonVal />;
    case 'xmlFmt':
    case 'htmlFmt':
    case 'cssFmt':
    case 'jsFmt':
      return <CodeFmt tool={tool} />;
    case 'minify': return <Minify />;
    case 'regex': return <RegexTester />;
    case 'jwt': return <JwtDecoder />;
    case 'base64': return <Base64Tool />;
    case 'uuid': return <UuidGen />;
    case 'hash': return <HashGen />;
    case 'loremApi': return <LoremApi />;
    case 'cron': return <CronGen />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default DevTools;
