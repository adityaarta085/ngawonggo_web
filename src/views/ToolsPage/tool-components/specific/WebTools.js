/* eslint-disable */
import React, { useState } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input, Textarea,
  FormControl, FormLabel, useToast, Badge, Stat, StatLabel, StatNumber,
  Flex, Select, Divider, Table, Thead, Tbody, Tr, Th, Td, Checkbox
} from '@chakra-ui/react';
import { FaCopy, FaDownload } from 'react-icons/fa';

/* ═══════ QR CODE GENERATOR ═══════ */
const QrGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}` : '';
  const toast = useToast();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Teks atau URL</FormLabel><Input value={text} onChange={e => setText(e.target.value)} placeholder="https://contoh.com" /></FormControl>
      <Select value={size} onChange={e => setSize(Number(e.target.value))}><option value={150}>150px</option><option value={200}>200px</option><option value={300}>300px</option><option value={400}>400px</option></Select>
      {qrUrl && (
        <VStack>
          <Box p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
            <img src={qrUrl} alt="QR Code" width={size} height={size} />
          </Box>
          <Button as="a" href={qrUrl} download="qrcode.png" colorScheme="brand" leftIcon={<FaDownload />}>Download QR</Button>
        </VStack>
      )}
    </VStack>
  );
};

/* ═══════ URL ENCODER/DECODER ═══════ */
const UrlEncode = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');
  const [output, setOutput] = useState('');
  const toast = useToast();
  const process = () => { try { setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)); } catch (e) { setOutput(`Error: ${e.message}`); } };
  return (
    <VStack spacing={4}>
      <HStack><Button colorScheme={mode === 'encode' ? 'brand' : 'gray'} onClick={() => setMode('encode')}>Encode</Button><Button colorScheme={mode === 'decode' ? 'brand' : 'gray'} onClick={() => setMode('decode')}>Decode</Button></HStack>
      <FormControl><FormLabel>Input</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} minH="100px" fontFamily="monospace" /></FormControl>
      <Button colorScheme="brand" onClick={process} w="full">Proses</Button>
      {output && <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Hasil</Text><Button size="sm" variant="ghost" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(output); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Copy</Button></Flex><Textarea value={output} isReadOnly fontFamily="monospace" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>}
    </VStack>
  );
};

/* ═══════ UTM BUILDER ═══════ */
const UtmBuilder = () => {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const toast = useToast();
  const result = (() => {
    if (!url) return '';
    const params = new URLSearchParams();
    if (source) params.set('utm_source', source);
    if (medium) params.set('utm_medium', medium);
    if (campaign) params.set('utm_campaign', campaign);
    if (term) params.set('utm_term', term);
    if (content) params.set('utm_content', content);
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${params.toString() ? sep + params.toString() : ''}`;
  })();
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>URL Website</FormLabel><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://contoh.com" /></FormControl>
      <SimpleGrid columns={2} spacing={3} w="full">
        <FormControl><FormLabel>Source *</FormLabel><Input value={source} onChange={e => setSource(e.target.value)} placeholder="google, facebook" /></FormControl>
        <FormControl><FormLabel>Medium *</FormLabel><Input value={medium} onChange={e => setMedium(e.target.value)} placeholder="cpc, email, social" /></FormControl>
        <FormControl><FormLabel>Campaign *</FormLabel><Input value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="promo_akhir_tahun" /></FormControl>
        <FormControl><FormLabel>Term</FormLabel><Input value={term} onChange={e => setTerm(e.target.value)} placeholder="kata_kunci" /></FormControl>
      </SimpleGrid>
      {result && (
        <Box w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" cursor="pointer" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
          <Text fontFamily="monospace" fontSize="sm" wordBreak="break-all">{result}</Text>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ META TAG GENERATOR ═══════ */
const MetaTag = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const toast = useToast();
  const code = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${title ? `<title>${title}</title>` : ''}
${desc ? `<meta name="description" content="${desc}">` : ''}
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}
${title ? `<meta property="og:title" content="${title}">` : ''}
${desc ? `<meta property="og:description" content="${desc}">` : ''}
${url ? `<meta property="og:url" content="${url}">` : ''}
${image ? `<meta property="og:image" content="${image}">` : ''}
<meta property="og:type" content="website">
${title ? `<meta name="twitter:card" content="summary_large_image">` : ''}
${title ? `<meta name="twitter:title" content="${title}">` : ''}
${desc ? `<meta name="twitter:description" content="${desc}">` : ''}`.replace(/\n{2,}/g, '\n');
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Judul Halaman</FormLabel><Input value={title} onChange={e => setTitle(e.target.value)} /><Text fontSize="xs" color={title.length > 60 ? 'red.500' : 'gray.400'} mt={1}>{title.length}/60</Text></FormControl>
      <FormControl><FormLabel>Deskripsi</FormLabel><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /><Text fontSize="xs" color={desc.length > 160 ? 'red.500' : 'gray.400'} mt={1}>{desc.length}/160</Text></FormControl>
      <SimpleGrid columns={2} spacing={3} w="full">
        <FormControl><FormLabel>Keywords</FormLabel><Input value={keywords} onChange={e => setKeywords(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Author</FormLabel><Input value={author} onChange={e => setAuthor(e.target.value)} /></FormControl>
        <FormControl><FormLabel>URL</FormLabel><Input value={url} onChange={e => setUrl(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Image URL</FormLabel><Input value={image} onChange={e => setImage(e.target.value)} /></FormControl>
      </SimpleGrid>
      <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">Hasil</Text><Button size="sm" variant="ghost" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(code); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Copy</Button></Flex><Textarea value={code} isReadOnly fontFamily="monospace" fontSize="xs" minH="250px" bg="gray.50" _dark={{ bg: 'gray.900' }} /></Box>
    </VStack>
  );
};

/* ═══════ OG PREVIEW ═══════ */
const OgPreview = () => {
  const [title, setTitle] = useState('Judul Halaman Web');
  const [desc, setDesc] = useState('Deskripsi singkat halaman web Anda akan muncul di sini');
  const [url, setUrl] = useState('contoh.com');
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Judul</FormLabel><Input value={title} onChange={e => setTitle(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Deskripsi</FormLabel><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></FormControl>
      <FormControl><FormLabel>URL</FormLabel><Input value={url} onChange={e => setUrl(e.target.value)} /></FormControl>
      <Divider />
      <Text fontWeight="bold" alignSelf="start">Preview Facebook/LinkedIn:</Text>
      <Box w="full" border="1px solid" borderColor="gray.300" borderRadius="lg" overflow="hidden">
        <Box h="200px" bg="gray.200" display="flex" alignItems="center" justifyContent="center"><Text color="gray.400">Gambar OG</Text></Box>
        <Box p={3} bg="gray.50" _dark={{ bg: 'gray.800' }}><Text fontSize="xs" color="gray.400" textTransform="uppercase">{url}</Text><Text fontWeight="bold" noOfLines={2}>{title}</Text><Text fontSize="sm" color="gray.500" noOfLines={2}>{desc}</Text></Box>
      </Box>
      <Text fontWeight="bold" alignSelf="start">Preview Twitter:</Text>
      <Box w="full" border="1px solid" borderColor="gray.300" borderRadius="xl" overflow="hidden">
        <Box h="150px" bg="gray.200" display="flex" alignItems="center" justifyContent="center"><Text color="gray.400">Gambar Card</Text></Box>
        <Box p={3}><Text fontWeight="bold" noOfLines={1}>{title}</Text><Text fontSize="sm" color="gray.500" noOfLines={2}>{desc}</Text><Text fontSize="xs" color="gray.400">{url}</Text></Box>
      </Box>
    </VStack>
  );
};

/* ═══════ ROBOTS.TXT GENERATOR ═══════ */
const RobotsTxt = () => {
  const [sitemap, setSitemap] = useState('');
  const [disallow, setDisallow] = useState('/admin\n/private');
  const [crawlDelay, setCrawlDelay] = useState('');
  const toast = useToast();
  const code = `User-agent: *\n${disallow.split('\n').filter(Boolean).map(d => `Disallow: ${d.trim()}`).join('\n')}\nAllow: /\n${crawlDelay ? `Crawl-delay: ${crawlDelay}\n` : ''}${sitemap ? `\nSitemap: ${sitemap}` : ''}`;
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Sitemap URL</FormLabel><Input value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://contoh.com/sitemap.xml" /></FormControl>
      <FormControl><FormLabel>Disallow (per baris)</FormLabel><Textarea value={disallow} onChange={e => setDisallow(e.target.value)} rows={3} fontFamily="monospace" /></FormControl>
      <FormControl><FormLabel>Crawl Delay (detik)</FormLabel><Input value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} type="number" /></FormControl>
      <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">robots.txt</Text><Button size="sm" variant="ghost" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(code); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Copy</Button></Flex><Textarea value={code} isReadOnly fontFamily="monospace" fontSize="sm" bg="gray.50" _dark={{ bg: 'gray.900' }} minH="150px" /></Box>
    </VStack>
  );
};

/* ═══════ SITEMAP GENERATOR ═══════ */
const SitemapGen = () => {
  const [domain, setDomain] = useState('');
  const [pages, setPages] = useState('/\n/about\n/contact\n/blog');
  const toast = useToast();
  const today = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.split('\n').filter(Boolean).map(p => `  <url>
    <loc>${domain}${p.trim()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.trim() === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Domain</FormLabel><Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="https://contoh.com" /></FormControl>
      <FormControl><FormLabel>Halaman (per baris)</FormLabel><Textarea value={pages} onChange={e => setPages(e.target.value)} rows={5} fontFamily="monospace" /></FormControl>
      <Box w="full"><Flex justify="space-between" mb={2}><Text fontWeight="bold">sitemap.xml</Text><Button size="sm" variant="ghost" leftIcon={<FaCopy />} onClick={() => { navigator.clipboard.writeText(xml); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>Copy</Button></Flex><Textarea value={xml} isReadOnly fontFamily="monospace" fontSize="xs" bg="gray.50" _dark={{ bg: 'gray.900' }} minH="250px" /></Box>
    </VStack>
  );
};

/* ═══════ URL SHORTENER (Demo) ═══════ */
const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [short, setShort] = useState('');
  const toast = useToast();
  const shorten = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setShort(`https://ngo.id/${code}`);
  };
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Text fontSize="sm" color="orange.500" bg="orange.50" _dark={{ bg: 'orange.900' }} p={3} borderRadius="md">Demo simulasi. Link pendek tidak benar-benar aktif.</Text>
      <FormControl><FormLabel>URL Panjang</FormLabel><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://contoh.com/halaman-sangat-panjang" /></FormControl>
      <Button colorScheme="brand" onClick={shorten} isDisabled={!url} w="full" size="lg">Persingkat URL</Button>
      {short && (
        <Box w="full" p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" cursor="pointer" textAlign="center"
          onClick={() => { navigator.clipboard.writeText(short); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
          <Text fontWeight="bold" color="green.500" fontSize="xl">{short}</Text>
          <Text fontSize="xs" color="gray.400">Klik untuk menyalin</Text>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ API-BASED TOOLS (using /api/tools-proxy) ═══════ */
const ApiTool = ({ tool }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const labels = {
    httpStatus: { title: 'HTTP Status Checker', placeholder: 'https://contoh.com', desc: 'Cek status kode respon HTTP dari URL' },
    redirect: { title: 'Redirect Checker', placeholder: 'https://contoh.com', desc: 'Cek jalur redirect dari URL' },
    dns: { title: 'DNS Lookup', placeholder: 'contoh.com', desc: 'Cek record DNS domain' },
    whois: { title: 'Whois Lookup', placeholder: 'contoh.com', desc: 'Cek informasi kepemilikan domain' },
    ping: { title: 'Ping Website', placeholder: 'contoh.com', desc: 'Cek latensi akses ke server' },
    speedTest: { title: 'Website Speed', placeholder: 'https://contoh.com', desc: 'Cek kecepatan akses website' },
    ssl: { title: 'SSL Checker', placeholder: 'contoh.com', desc: 'Cek validitas sertifikat SSL' },
  };

  const cfg = labels[tool.config] || { title: tool.name, placeholder: '', desc: '' };

  const check = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tools-proxy?action=${tool.config}&target=${encodeURIComponent(input)}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <Text fontSize="sm" color="gray.500">{cfg.desc}</Text>
      <HStack w="full">
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder={cfg.placeholder} flex={1} />
        <Button colorScheme="brand" onClick={check} isLoading={loading}>Cek</Button>
      </HStack>
      {result && (
        <Box w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl">
          {result.error ? (
            <Text color="red.500">{result.error}</Text>
          ) : (
            <Textarea value={JSON.stringify(result, null, 2)} isReadOnly fontFamily="monospace" fontSize="sm" minH="200px" />
          )}
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const WebTools = ({ tool }) => {
  switch (tool.config) {
    case 'qrGenerator': return <QrGenerator />;
    case 'urlShortener': return <UrlShortener />;
    case 'urlEncode': return <UrlEncode />;
    case 'utm': return <UtmBuilder />;
    case 'metaTag': return <MetaTag />;
    case 'ogPreview': return <OgPreview />;
    case 'robotsTxt': return <RobotsTxt />;
    case 'sitemap': return <SitemapGen />;
    case 'httpStatus':
    case 'redirect':
    case 'dns':
    case 'whois':
    case 'ping':
    case 'speedTest':
    case 'ssl':
      return <ApiTool tool={tool} />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default WebTools;
