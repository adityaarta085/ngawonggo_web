import React, { useState, useRef } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input,
  FormControl, FormLabel, Stat, StatLabel, StatNumber,
  useToast, Textarea, Slider, SliderTrack,
  SliderFilledTrack, SliderThumb, Badge, Image
} from '@chakra-ui/react';
import { FaDownload, FaUpload } from 'react-icons/fa';

/* ═══════ JPG TO PDF ═══════ */
const JpgPdf = () => {
  const [images, setImages] = useState([]);
  const toast = useToast();
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(f => new Promise(resolve => { const r = new FileReader(); r.onload = () => resolve({ name: f.name, data: r.result }); r.readAsDataURL(f); }));
    Promise.all(readers).then(setImages);
  };
  const generatePdf = async () => {
    if (images.length === 0) return;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      for (const img of images) {
        const bytes = await fetch(img.data).then(r => r.arrayBuffer());
        let image;
        if (img.data.includes('image/png')) image = await doc.embedPng(bytes);
        else image = await doc.embedJpg(bytes);
        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'images.pdf'; a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'PDF berhasil dibuat!', status: 'success', duration: 3000 });
    } catch (err) {
      toast({ title: 'Gagal membuat PDF', description: err.message, status: 'error', duration: 3000 });
    }
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih Gambar (JPG/PNG)</FormLabel>
        <Input type="file" accept="image/*" multiple onChange={handleFiles} p={1} />
      </FormControl>
      {images.length > 0 && (
        <>
          <SimpleGrid columns={{ base: 3, sm: 4 }} spacing={2}>
            {images.map((img, i) => <Image key={i} src={img.data} alt={img.name} borderRadius="md" maxH="80px" objectFit="cover" />)}
          </SimpleGrid>
          <Badge>{images.length} gambar dipilih</Badge>
          <Button colorScheme="brand" leftIcon={<FaDownload />} onClick={generatePdf} size="lg" w="full">Buat PDF</Button>
        </>
      )}
    </VStack>
  );
};

/* ═══════ PNG TO JPG ═══════ */
const PngJpg = () => {
  const [src, setSrc] = useState(null);
  const [quality, setQuality] = useState(90);
  const toast = useToast();
  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setSrc(r.result); r.readAsDataURL(f);
  };
  const convert = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'converted.jpg'; a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Konversi berhasil!', status: 'success', duration: 2000 });
      }, 'image/jpeg', quality / 100);
    };
    img.src = src;
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih File PNG</FormLabel><Input type="file" accept="image/png" onChange={handleFile} p={1} /></FormControl>
      {src && <Image src={src} maxH="200px" borderRadius="md" />}
      <FormControl><FormLabel>Kualitas: {quality}%</FormLabel>
        <Slider value={quality} min={10} max={100} onChange={v => setQuality(v)}>
          <SliderTrack><SliderFilledTrack /></SliderTrack><SliderThumb />
        </Slider>
      </FormControl>
      <Button colorScheme="brand" leftIcon={<FaDownload />} onClick={convert} isDisabled={!src} size="lg" w="full">Konversi ke JPG</Button>
    </VStack>
  );
};

/* ═══════ RESIZE IMAGE ═══════ */
const ResizeImg = () => {
  const [src, setSrc] = useState(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [newW, setNewW] = useState('');
  const [newH, setNewH] = useState('');
  const [lock, setLock] = useState(true);
  const toast = useToast();
  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => {
      const img = new window.Image();
      img.onload = () => { setOrigW(img.width); setOrigH(img.height); setNewW(img.width); setNewH(img.height); };
      img.src = r.result; setSrc(r.result);
    }; r.readAsDataURL(f);
  };
  const handleW = (v) => { setNewW(v); if (lock && origW) setNewH(Math.round(v / origW * origH)); };
  const handleH = (v) => { setNewH(v); if (lock && origH) setNewW(Math.round(v / origH * origW)); };
  const resize = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = parseInt(newW); canvas.height = parseInt(newH);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `resized_${newW}x${newH}.png`; a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Berhasil!', status: 'success', duration: 2000 });
      });
    };
    img.src = src;
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih Gambar</FormLabel><Input type="file" accept="image/*" onChange={handleFile} p={1} /></FormControl>
      {src && (
        <>
          <Image src={src} maxH="200px" borderRadius="md" />
          <Badge>Ukuran asli: {origW} × {origH} px</Badge>
          <HStack spacing={4} w="full">
            <FormControl><FormLabel>Lebar (px)</FormLabel><Input type="number" value={newW} onChange={e => handleW(parseInt(e.target.value) || 0)} /></FormControl>
            <FormControl><FormLabel>Tinggi (px)</FormLabel><Input type="number" value={newH} onChange={e => handleH(parseInt(e.target.value) || 0)} /></FormControl>
          </HStack>
          <Button colorScheme="brand" leftIcon={<FaDownload />} onClick={resize} size="lg" w="full">Download Hasil Resize</Button>
        </>
      )}
    </VStack>
  );
};

/* ═══════ COMPRESS IMAGE ═══════ */
const CompressImg = () => {
  const [src, setSrc] = useState(null);
  const [origSize, setOrigSize] = useState(0);
  const [quality, setQuality] = useState(70);
  const toast = useToast();
  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setOrigSize(f.size);
    const r = new FileReader(); r.onload = () => setSrc(r.result); r.readAsDataURL(f);
  };
  const compress = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'compressed.jpg'; a.click();
        URL.revokeObjectURL(url);
        toast({ title: `Berhasil! Ukuran: ${(blob.size / 1024).toFixed(1)} KB`, status: 'success', duration: 3000 });
      }, 'image/jpeg', quality / 100);
    };
    img.src = src;
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih Gambar</FormLabel><Input type="file" accept="image/*" onChange={handleFile} p={1} /></FormControl>
      {src && (
        <>
          <Image src={src} maxH="200px" borderRadius="md" />
          <Badge>Ukuran asli: {(origSize / 1024).toFixed(1)} KB</Badge>
          <FormControl><FormLabel>Kualitas: {quality}%</FormLabel>
            <Slider value={quality} min={5} max={100} onChange={v => setQuality(v)}>
              <SliderTrack><SliderFilledTrack /></SliderTrack><SliderThumb />
            </Slider>
          </FormControl>
          <Button colorScheme="brand" leftIcon={<FaDownload />} onClick={compress} size="lg" w="full">Kompres & Download</Button>
        </>
      )}
    </VStack>
  );
};

/* ═══════ FILE SIZE CHECKER ═══════ */
const FileSizeChecker = () => {
  const [files, setFiles] = useState([]);
  const handleFiles = (e) => setFiles(Array.from(e.target.files).map(f => ({ name: f.name, size: f.size, type: f.type, lastModified: new Date(f.lastModified).toLocaleString('id-ID') })));
  const fmtSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(2)} KB` : `${(b / 1048576).toFixed(2)} MB`;
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih File</FormLabel><Input type="file" multiple onChange={handleFiles} p={1} /></FormControl>
      {files.length > 0 && files.map((f, i) => (
        <Box key={i} w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl">
          <Text fontWeight="bold" noOfLines={1}>{f.name}</Text>
          <SimpleGrid columns={3} spacing={2} mt={2}>
            <Stat><StatLabel>Ukuran</StatLabel><StatNumber fontSize="sm" color="brand.500">{fmtSize(f.size)}</StatNumber></Stat>
            <Stat><StatLabel>Tipe</StatLabel><StatNumber fontSize="sm">{f.type || 'Unknown'}</StatNumber></Stat>
            <Stat><StatLabel>Diubah</StatLabel><StatNumber fontSize="sm">{f.lastModified}</StatNumber></Stat>
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
};

/* ═══════ FILE BASE64 ENCODE ═══════ */
const FileBase64 = () => {
  const [result, setResult] = useState('');
  const toast = useToast();
  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setResult(r.result); r.readAsDataURL(f);
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <FormControl><FormLabel>Pilih File</FormLabel><Input type="file" onChange={handleFile} p={1} /></FormControl>
      {result && (
        <>
          <Textarea value={result} isReadOnly minH="200px" fontFamily="monospace" fontSize="xs" />
          <Button colorScheme="brand" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}>Salin Base64</Button>
        </>
      )}
    </VStack>
  );
};

/* ═══════ RENAME FILE GENERATOR ═══════ */
const RenameGen = () => {
  const [prefix, setPrefix] = useState('file');
  const [start, setStart] = useState(1);
  const [count, setCount] = useState(10);
  const [ext, setExt] = useState('.jpg');
  const [sep, setSep] = useState('_');
  const result = Array.from({ length: count }, (_, i) => `${prefix}${sep}${String(start + i).padStart(3, '0')}${ext}`).join('\n');
  const toast = useToast();
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <SimpleGrid columns={2} spacing={4} w="full">
        <FormControl><FormLabel>Prefix</FormLabel><Input value={prefix} onChange={e => setPrefix(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Ekstensi</FormLabel><Input value={ext} onChange={e => setExt(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Mulai dari</FormLabel><Input type="number" value={start} onChange={e => setStart(parseInt(e.target.value) || 1)} /></FormControl>
        <FormControl><FormLabel>Jumlah</FormLabel><Input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} /></FormControl>
      </SimpleGrid>
      <Textarea value={result} isReadOnly minH="200px" fontFamily="monospace" fontSize="sm" />
      <Button colorScheme="brand" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}>Salin Semua</Button>
    </VStack>
  );
};

/* ═══════ QR FROM FILE ═══════ */
const FileQr = () => {
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <Text color="gray.500" p={6} textAlign="center" border="2px dashed" borderColor="gray.300" borderRadius="xl">
        Fitur QR dari file menggunakan QR Code Generator di menu Web Tools. Silakan gunakan tool "QR Code Generator" untuk membuat QR dari URL file Anda.
      </Text>
    </VStack>
  );
};

/* ═══════ SIMULATION TOOLS ═══════ */
const SimulationTool = ({ tool }) => {
  const [file, setFile] = useState(null);
  const desc = {
    pdfWord: 'Konversi PDF ke Word memerlukan pemrosesan kompleks. File akan diproses di browser.',
    wordPdf: 'Konversi Word ke PDF memerlukan library tambahan. File akan diproses di browser.',
    compressPdf: 'Kompresi PDF akan mengurangi kualitas gambar dalam file PDF.',
    mergePdf: 'Gabungkan beberapa file PDF menjadi satu dokumen.',
    splitPdf: 'Pisahkan halaman-halaman dari file PDF.',
  };
  return (
    <VStack spacing={6} maxW="lg" mx="auto">
      <Box p={4} bg="orange.50" _dark={{ bg: 'orange.900' }} borderRadius="md" w="full">
        <Text fontSize="sm" color="orange.800" _dark={{ color: 'orange.200' }}>
          {desc[tool.config] || 'Tool ini memerlukan pemrosesan file.'}
        </Text>
      </Box>
      <FormControl>
        <FormLabel>Upload File</FormLabel>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} p={1} />
      </FormControl>
      {file && <Badge colorScheme="green">{file.name} ({(file.size / 1024).toFixed(1)} KB)</Badge>}
      <Button colorScheme="brand" leftIcon={<FaUpload />} isDisabled={!file} size="lg" w="full" onClick={() => {
        // For now, demonstrate with alert
        alert(`File "${file?.name}" siap diproses. Fitur lengkap PDF processing menggunakan pdf-lib sedang dalam pengembangan.`);
      }}>Proses File</Button>
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const FileTools = ({ tool }) => {
  switch (tool.config) {
    case 'jpgPdf': return <JpgPdf />;
    case 'pngJpg': return <PngJpg />;
    case 'resizeImg': return <ResizeImg />;
    case 'compressImg': return <CompressImg />;
    case 'fileSize': return <FileSizeChecker />;
    case 'fileBase64': return <FileBase64 />;
    case 'rename': return <RenameGen />;
    case 'fileQr': return <FileQr />;
    case 'pdfWord':
    case 'wordPdf':
    case 'compressPdf':
    case 'mergePdf':
    case 'splitPdf':
      return <SimulationTool tool={tool} />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default FileTools;
