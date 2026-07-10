import React, { useState } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input,
  FormControl, FormLabel, Stat, StatLabel, StatNumber,
  useToast, Flex, Badge, Slider, SliderTrack, SliderFilledTrack,
  SliderThumb, Image, Select
} from '@chakra-ui/react';
import { FaCopy, FaDownload } from 'react-icons/fa';

/* ═══════ COLOR PICKER ═══════ */
const ColorPicker = () => {
  const [color, setColor] = useState('#3498db');
  const toast = useToast();
  const hexToRgb = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });
  const rgb = hexToRgb(color);
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Input type="color" value={color} onChange={e => setColor(e.target.value)} h="80px" p={1} cursor="pointer" borderRadius="xl" />
      <Box w="full" h="60px" bg={color} borderRadius="xl" border="1px solid" borderColor="gray.200" />
      <SimpleGrid columns={3} spacing={3} w="full">
        {[
          { label: 'HEX', value: color.toUpperCase() },
          { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { label: 'HSL', value: (() => { let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2; if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6; else if (max === g) h = ((b - r) / d + 2) / 6; else h = ((r - g) / d + 4) / 6; } return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`; })() },
        ].map(c => (
          <Box key={c.label} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer" textAlign="center"
            onClick={() => { navigator.clipboard.writeText(c.value); toast({ title: `${c.label} disalin`, status: 'success', duration: 1500 }); }}>
            <Text fontSize="xs" color="gray.500">{c.label}</Text>
            <Text fontWeight="bold" fontFamily="monospace" fontSize="sm">{c.value}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ PALETTE GENERATOR ═══════ */
const PaletteGen = () => {
  const [colors, setColors] = useState([]);
  const toast = useToast();
  const generate = () => {
    const base = Math.floor(Math.random() * 360);
    const palettes = [
      // Analogous
      [0, 30, 60, 90, 120].map(offset => `hsl(${(base + offset) % 360}, ${60 + Math.random() * 20}%, ${45 + Math.random() * 20}%)`),
    ][0];
    setColors(palettes);
  };
  const hslToHex = (hsl) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = hsl; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <Button colorScheme="brand" onClick={generate} size="lg" w="full">Generate Palette</Button>
      {colors.length > 0 && (
        <Flex w="full" h="120px" borderRadius="xl" overflow="hidden">
          {colors.map((c, i) => (
            <Box key={i} flex={1} bg={c} cursor="pointer" transition="flex 0.3s" _hover={{ flex: 2 }}
              onClick={() => { const hex = hslToHex(c); navigator.clipboard.writeText(hex); toast({ title: `${hex} disalin`, status: 'success', duration: 1500 }); }}>
              <Text fontSize="xs" color="white" textShadow="0 1px 3px rgba(0,0,0,0.5)" p={2} fontFamily="monospace">{hslToHex(c)}</Text>
            </Box>
          ))}
        </Flex>
      )}
    </VStack>
  );
};

/* ═══════ GRADIENT GENERATOR ═══════ */
const GradientGen = () => {
  const [c1, setC1] = useState('#667eea');
  const [c2, setC2] = useState('#764ba2');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState('linear');
  const toast = useToast();
  const css = type === 'linear' ? `linear-gradient(${angle}deg, ${c1}, ${c2})` : `radial-gradient(circle, ${c1}, ${c2})`;
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <Box w="full" h="150px" borderRadius="xl" bg={css} />
      <HStack spacing={4} w="full">
        <FormControl><FormLabel>Warna 1</FormLabel><Input type="color" value={c1} onChange={e => setC1(e.target.value)} h="50px" p={1} /></FormControl>
        <FormControl><FormLabel>Warna 2</FormLabel><Input type="color" value={c2} onChange={e => setC2(e.target.value)} h="50px" p={1} /></FormControl>
      </HStack>
      <HStack w="full">
        <Select value={type} onChange={e => setType(e.target.value)} w="150px"><option value="linear">Linear</option><option value="radial">Radial</option></Select>
        {type === 'linear' && <FormControl><FormLabel>Sudut: {angle}°</FormLabel><Slider value={angle} min={0} max={360} onChange={v => setAngle(v)}><SliderTrack><SliderFilledTrack /></SliderTrack><SliderThumb /></Slider></FormControl>}
      </HStack>
      <Box w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer"
        onClick={() => { navigator.clipboard.writeText(`background: ${css};`); toast({ title: 'CSS disalin', status: 'success', duration: 1500 }); }}>
        <Text fontFamily="monospace" fontSize="sm" wordBreak="break-all">background: {css};</Text>
      </Box>
    </VStack>
  );
};

/* ═══════ IMAGE CROPPER ═══════ */
const ImageCropper = () => {
  const [src, setSrc] = useState(null);
  const [ratio, setRatio] = useState('1:1');
  const toast = useToast();
  const handleFile = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setSrc(r.result); r.readAsDataURL(f); };
  const crop = () => {
    const img = new window.Image();
    img.onload = () => {
      const [rw, rh] = ratio.split(':').map(Number);
      const targetRatio = rw / rh;
      let cw, ch;
      if (img.width / img.height > targetRatio) { ch = img.height; cw = ch * targetRatio; }
      else { cw = img.width; ch = cw / targetRatio; }
      const canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      canvas.getContext('2d').drawImage(img, (img.width - cw) / 2, (img.height - ch) / 2, cw, ch, 0, 0, cw, ch);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `cropped_${ratio.replace(':', 'x')}.png`; a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Berhasil!', status: 'success', duration: 2000 });
      });
    };
    img.src = src;
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih Gambar</FormLabel><Input type="file" accept="image/*" onChange={handleFile} p={1} /></FormControl>
      <Select value={ratio} onChange={e => setRatio(e.target.value)}>
        <option value="1:1">1:1 (Square)</option><option value="16:9">16:9 (Widescreen)</option>
        <option value="4:3">4:3 (Standard)</option><option value="9:16">9:16 (Story)</option>
        <option value="3:2">3:2 (Photo)</option><option value="2:3">2:3 (Portrait)</option>
      </Select>
      {src && <Image src={src} maxH="200px" borderRadius="md" />}
      <Button colorScheme="brand" leftIcon={<FaDownload />} onClick={crop} isDisabled={!src} w="full" size="lg">Crop & Download</Button>
    </VStack>
  );
};

/* ═══════ ASPECT RATIO CALC ═══════ */
const AspectRatio = () => {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const g = gcd(w, h);
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <HStack spacing={4} w="full">
        <FormControl><FormLabel>Lebar (px)</FormLabel><Input type="number" value={w} onChange={e => setW(parseInt(e.target.value) || 0)} /></FormControl>
        <FormControl><FormLabel>Tinggi (px)</FormLabel><Input type="number" value={h} onChange={e => setH(parseInt(e.target.value) || 0)} /></FormControl>
      </HStack>
      <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
        <StatLabel>Aspect Ratio</StatLabel>
        <StatNumber fontSize="3xl" color="brand.500">{g > 0 ? `${w / g}:${h / g}` : 'N/A'}</StatNumber>
      </Stat>
    </VStack>
  );
};

/* ═══════ CONTRAST CHECKER ═══════ */
const ContrastChecker = () => {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const luminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };
  const l1 = luminance(fg), l2 = luminance(bg);
  const ratio = ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
  const aaLarge = ratio >= 3; const aaNormal = ratio >= 4.5; const aaaLarge = ratio >= 4.5; const aaaNormal = ratio >= 7;
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <HStack spacing={4} w="full">
        <FormControl><FormLabel>Teks (Foreground)</FormLabel><Input type="color" value={fg} onChange={e => setFg(e.target.value)} h="50px" p={1} /></FormControl>
        <FormControl><FormLabel>Latar (Background)</FormLabel><Input type="color" value={bg} onChange={e => setBg(e.target.value)} h="50px" p={1} /></FormControl>
      </HStack>
      <Box w="full" p={8} bg={bg} borderRadius="xl" textAlign="center"><Text color={fg} fontSize="2xl" fontWeight="bold">Contoh Teks Ini</Text><Text color={fg} fontSize="sm">Teks kecil untuk pengujian</Text></Box>
      <Stat p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" textAlign="center"><StatLabel>Rasio Kontras</StatLabel><StatNumber fontSize="3xl" color={aaNormal ? 'green.500' : 'red.500'}>{ratio}:1</StatNumber></Stat>
      <SimpleGrid columns={2} spacing={3} w="full">
        <Badge colorScheme={aaNormal ? 'green' : 'red'} p={2} textAlign="center">AA Normal: {aaNormal ? '✓' : '✗'}</Badge>
        <Badge colorScheme={aaLarge ? 'green' : 'red'} p={2} textAlign="center">AA Large: {aaLarge ? '✓' : '✗'}</Badge>
        <Badge colorScheme={aaaNormal ? 'green' : 'red'} p={2} textAlign="center">AAA Normal: {aaaNormal ? '✓' : '✗'}</Badge>
        <Badge colorScheme={aaaLarge ? 'green' : 'red'} p={2} textAlign="center">AAA Large: {aaaLarge ? '✓' : '✗'}</Badge>
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ HEX RGB CONVERTER ═══════ */
const HexRgb = () => {
  const [hex, setHex] = useState('#3498db');
  const toast = useToast();
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(hex);
  const rgb = isValid ? { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) } : null;
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <HStack w="full"><Input value={hex} onChange={e => setHex(e.target.value)} fontFamily="monospace" /><Input type="color" value={isValid ? hex : '#000000'} onChange={e => setHex(e.target.value)} w="60px" h="40px" p={1} /></HStack>
      {rgb && (
        <>
          <Box w="full" h="60px" bg={hex} borderRadius="xl" />
          <SimpleGrid columns={2} spacing={3} w="full">
            {[{ l: 'HEX', v: hex.toUpperCase() }, { l: 'RGB', v: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }, { l: 'Red', v: rgb.r }, { l: 'Green', v: rgb.g }, { l: 'Blue', v: rgb.b }].map(c => (
              <Box key={c.l} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer" onClick={() => { navigator.clipboard.writeText(String(c.v)); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
                <Text fontSize="xs" color="gray.500">{c.l}</Text><Text fontWeight="bold" fontFamily="monospace">{c.v}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
};

/* ═══════ SIMPLE PLACEHOLDERS ═══════ */
const SimpleTool = ({ label }) => (
  <VStack spacing={4} p={6} textAlign="center">
    <Text color="gray.500">{label} — Fitur ini memerlukan pemrosesan gambar kompleks. Gunakan tool alternatif yang tersedia.</Text>
  </VStack>
);

/* ═══════ DISPATCHER ═══════ */
const ImageColorTools = ({ tool }) => {
  switch (tool.config) {
    case 'colorPicker': return <ColorPicker />;
    case 'palette': return <PaletteGen />;
    case 'gradient': return <GradientGen />;
    case 'cropper': return <ImageCropper />;
    case 'aspectRatio': return <AspectRatio />;
    case 'contrast': return <ContrastChecker />;
    case 'hexRgb': return <HexRgb />;
    case 'bgRemove': return <SimpleTool label="Background Remover memerlukan AI/ML processing. Kami merekomendasikan menggunakan remove.bg untuk hasil terbaik." />;
    case 'favicon': return <SimpleTool label="Favicon Generator — Upload gambar dan resize ke 16x16, 32x32, dan 180x180 menggunakan tool Resize Image." />;
    case 'logoSize': return <SimpleTool label="Logo Size Checker — Gunakan File Size Checker untuk memeriksa ukuran file logo Anda." />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default ImageColorTools;
