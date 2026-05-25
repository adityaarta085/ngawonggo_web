import React, { useState, useMemo } from 'react';
import { Box, Textarea, Button, Flex, Text, useToast, VStack, HStack, Select, Input, FormControl, FormLabel, Checkbox, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';
import { FaCopy, FaTrash } from 'react-icons/fa';
import ToolLayout from '../components/ToolLayout';

const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
];

const GenericTextTool = ({ tool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [extraConfig, setExtraConfig] = useState('lowercase');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [loremCount, setLoremCount] = useState(3);
  const [randomLength, setRandomLength] = useState(100);
  const toast = useToast();
  const previewBg = useColorModeValue('white', 'gray.800');
  const previewBorder = useColorModeValue('gray.200', 'gray.600');

  const handleProcess = () => {
    let result = '';
    switch (tool.config) {
      case 'count': {
        const chars = input.length;
        const charsNoSpace = input.replace(/\s/g, '').length;
        const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
        const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
        const lines = input.split(/\r\n|\r|\n/).length;
        const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim()).length;
        result = `Karakter: ${chars}\nKarakter (tanpa spasi): ${charsNoSpace}\nKata: ${words}\nKalimat: ${sentences}\nBaris: ${lines}\nParagraf: ${paragraphs}\nWaktu baca: ~${Math.ceil(words / 200)} menit`;
        break;
      }
      case 'case':
        if (extraConfig === 'lowercase') result = input.toLowerCase();
        else if (extraConfig === 'uppercase') result = input.toUpperCase();
        else if (extraConfig === 'titlecase') result = input.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
        else if (extraConfig === 'sentencecase') result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, x => x.toUpperCase());
        else if (extraConfig === 'alternating') result = input.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        else if (extraConfig === 'inverse') result = input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'slug':
        result = input.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        break;
      case 'space':
        result = input.replace(/ +/g, ' ').replace(/\t+/g, '\t').trim();
        break;
      case 'emptyLine':
        result = input.replace(/^\s*[\r\n]/gm, '');
        break;
      case 'sort':
        result = input.split('\n').sort((a, b) => a.localeCompare(b, 'id')).join('\n');
        break;
      case 'reverse':
        result = input.split('').reverse().join('');
        break;
      case 'random': {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
        let r = '';
        for (let i = 0; i < randomLength; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
        result = r;
        break;
      }
      case 'lorem':
        result = Array.from({ length: loremCount }, (_, i) => LOREM_PARAGRAPHS[i % LOREM_PARAGRAPHS.length]).join('\n\n');
        break;
      case 'replace': {
        try {
          if (useRegex) {
            const flags = caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(findText, flags);
            result = input.replace(regex, replaceText);
          } else {
            if (caseSensitive) {
              result = input.split(findText).join(replaceText);
            } else {
              const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              result = input.replace(regex, replaceText);
            }
          }
        } catch (e) {
          result = `Error: ${e.message}`;
        }
        break;
      }
      case 'format':
        result = input
          .replace(/ +/g, ' ')
          .replace(/\t+/g, ' ')
          .replace(/^\s+|\s+$/gm, '')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/(^\s*\w|[.!?]\s*\w)/g, x => x.toUpperCase());
        break;
      case 'markdown':
        result = input; // Markdown preview handled separately
        break;
      default:
        result = 'Fungsi belum diimplementasikan.';
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: 'Disalin', status: 'success', duration: 2000 });
  };

  // Simple markdown to HTML renderer
  const markdownToHtml = useMemo(() => {
    if (tool.config !== 'markdown') return '';
    let html = input
      .replace(/^### (.+)$/gm, '<h3 style="font-size:1.2em;font-weight:bold;margin:12px 0 8px">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:1.4em;font-weight:bold;margin:16px 0 8px">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size:1.8em;font-weight:bold;margin:20px 0 10px">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-family:monospace">$1</code>')
      .replace(/^- (.+)$/gm, '<li style="margin-left:20px">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;list-style-type:decimal">$1</li>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid #3498db;padding-left:16px;color:#666;margin:8px 0">$1</blockquote>')
      .replace(/---/g, '<hr style="border:0;border-top:1px solid #ddd;margin:16px 0" />')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3498db;text-decoration:underline">$1</a>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return html;
  }, [input, tool.config]);

  const needsInput = !['lorem', 'random'].includes(tool.config);
  const isMarkdown = tool.config === 'markdown';

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={4} align="stretch">
        {/* Extra controls per config */}
        {tool.config === 'case' && (
          <Select value={extraConfig} onChange={e => setExtraConfig(e.target.value)}>
            <option value="lowercase">huruf kecil</option>
            <option value="uppercase">HURUF BESAR</option>
            <option value="titlecase">Huruf Kapital Tiap Kata</option>
            <option value="sentencecase">Huruf kapital tiap kalimat</option>
            <option value="alternating">hUrUf AlTeRnAtIf</option>
            <option value="inverse">iNVERSE cASE</option>
          </Select>
        )}

        {tool.config === 'replace' && (
          <HStack spacing={3}>
            <FormControl><FormLabel>Cari</FormLabel><Input value={findText} onChange={e => setFindText(e.target.value)} placeholder="Kata yang dicari" /></FormControl>
            <FormControl><FormLabel>Ganti</FormLabel><Input value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="Kata pengganti" /></FormControl>
          </HStack>
        )}
        {tool.config === 'replace' && (
          <HStack spacing={4}>
            <Checkbox isChecked={useRegex} onChange={e => setUseRegex(e.target.checked)}>Regex</Checkbox>
            <Checkbox isChecked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)}>Case Sensitive</Checkbox>
          </HStack>
        )}

        {tool.config === 'lorem' && (
          <FormControl>
            <FormLabel>Jumlah Paragraf</FormLabel>
            <NumberInput value={loremCount} onChange={(_, v) => setLoremCount(v)} min={1} max={20}>
              <NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        {tool.config === 'random' && (
          <FormControl>
            <FormLabel>Panjang Karakter</FormLabel>
            <NumberInput value={randomLength} onChange={(_, v) => setRandomLength(v)} min={1} max={10000}>
              <NumberInputField /><NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        {/* Input area */}
        {needsInput && (
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="bold">Input Teks</Text>
              <Button size="xs" variant="ghost" colorScheme="red" leftIcon={<FaTrash />} onClick={() => { setInput(''); setOutput(''); }}>Bersihkan</Button>
            </Flex>
            <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ketik atau paste teks di sini..." minH={isMarkdown ? '300px' : '200px'} resize="vertical" fontFamily={isMarkdown ? 'monospace' : 'inherit'} />
          </Box>
        )}

        <Button colorScheme="brand" size="lg" onClick={handleProcess}>
          {tool.config === 'lorem' ? 'Generate Lorem Ipsum' : tool.config === 'random' ? 'Generate Random Text' : 'Proses Teks'}
        </Button>

        {/* Count stats */}
        {tool.config === 'count' && output && (
          <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3}>
            {output.split('\n').map(line => {
              const [label, value] = line.split(': ');
              return (
                <Stat key={label} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center">
                  <StatLabel fontSize="xs">{label}</StatLabel>
                  <StatNumber fontSize="lg" color="brand.500">{value}</StatNumber>
                </Stat>
              );
            })}
          </SimpleGrid>
        )}

        {/* Markdown preview */}
        {isMarkdown && input && (
          <Box>
            <Text fontWeight="bold" mb={2}>Preview</Text>
            <Box p={6} bg={previewBg} border="1px solid" borderColor={previewBorder} borderRadius="xl" minH="200px" dangerouslySetInnerHTML={{ __html: markdownToHtml }} />
          </Box>
        )}

        {/* Output area (for non-count and non-markdown) */}
        {output && tool.config !== 'count' && tool.config !== 'markdown' && (
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="bold">Hasil</Text>
              <HStack>
                <Button size="xs" leftIcon={<FaCopy />} onClick={handleCopy}>Copy</Button>
              </HStack>
            </Flex>
            <Textarea value={output} isReadOnly minH="200px" bg="gray.50" _dark={{ bg: 'gray.900' }} />
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default GenericTextTool;
