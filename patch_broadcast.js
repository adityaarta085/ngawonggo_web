const fs = require('fs');
const file = 'src/views/AdminPage/components/BroadcastManager.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state customEmail and aiPrompt
content = content.replace(
  "const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });",
  "const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });\n  const [customEmail, setCustomEmail] = useState('');\n  const [isAiLoading, setIsAiLoading] = useState(false);\n  const [aiPrompt, setAiPrompt] = useState('');\n"
);

// 2. Add icons FaMagic, FaSpinner
content = content.replace(
  "import { FaPaperPlane, FaSearch, FaUserCircle } from 'react-icons/fa';",
  "import { FaPaperPlane, FaSearch, FaUserCircle, FaMagic, FaSpinner } from 'react-icons/fa';"
);

// 3. Add AI handler function
const aiHandler = `
  const handleAiBeautify = async () => {
    setIsAiLoading(true);
    try {
      const promptToSend = aiPrompt.trim()
        ? \`Instruksi: \${aiPrompt}. Konten saat ini: \${content}\`
        : \`Tolong percantik dan perbaiki tata bahasa dari email ini. Konten saat ini: \${content}\`;

      const response = await axios.post('/api/chat', {
        messages: [{ role: 'user', content: promptToSend }],
        customPrompt: 'Anda adalah asisten cerdas pembuat email untuk admin web. Tugas Anda adalah membuat atau mempercantik isi email (Subject: ' + subject + '). Berikan HANYA KODE HTML yang siap dimasukkan ke editor (tanpa tag <html>, <body>, atau markdown backticks seperti \`\`\`html). Hanya konten di dalamnya saja, gunakan tag p, br, strong, em, ul, li, dll.',
      });

      if (response.data?.choices?.[0]?.message?.content) {
        let aiContent = response.data.choices[0].message.content;
        aiContent = aiContent.replace(/\\\`\\\`\\\`html/g, '').replace(/\\\`\\\`\\\`/g, '').trim();
        setContent(aiContent);
        toast({ title: 'Email berhasil dipercantik dengan AI', status: 'success' });
      } else {
        throw new Error('Respons AI kosong');
      }
    } catch (error) {
      toast({ title: 'Gagal menggunakan AI', description: error.message, status: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };
`;

content = content.replace(
  "const handleSendEmail = async () => {",
  aiHandler + "\n\n  const handleSendEmail = async () => {"
);

// 4. Update targets for Test Email and Manual Email
content = content.replace(
  "if (sendTest) {\n      const { data: { user } } = await supabase.auth.getUser();\n      if (user?.email) {\n        targets = [user.email];\n      } else {\n        toast({ title: 'Gagal mendapatkan email admin. Pastikan Anda sudah login ke Portal Warga.', status: 'error' });\n        return;\n      }\n    } else if (recipientType === 'all') {",
  "if (sendTest) {\n      targets = ['adityaarta085@gmail.com'];\n    } else if (recipientType === 'manual') {\n      if (!customEmail) {\n        toast({ title: 'Email manual tidak boleh kosong', status: 'warning' });\n        return;\n      }\n      targets = [customEmail];\n    } else if (recipientType === 'all') {"
);

// 5. Update Radio buttons
content = content.replace(
  "<Radio value=\"selected\">Pengguna Tertentu ({selectedUsers.length})</Radio>",
  "<Radio value=\"selected\">Pengguna Tertentu ({selectedUsers.length})</Radio>\n                  <Radio value=\"manual\">Email Spesifik (Manual)</Radio>"
);

// 6. Add Custom Email Input
const customEmailUI = `
            {recipientType === 'manual' && (
              <Box border="1px" borderColor="gray.100" borderRadius="lg" p={4}>
                <FormControl isRequired>
                  <FormLabel>Alamat Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="contoh@email.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    isDisabled={isSending}
                  />
                </FormControl>
              </Box>
            )}
`;

content = content.replace(
  "{recipientType === 'selected' && (",
  customEmailUI + "\n            {recipientType === 'selected' && ("
);

// 7. Add AI UI before ReactQuill
const aiUI = `
              <Box mb={2} p={4} border="1px" borderColor="brand.100" borderRadius="md" bg="brand.50">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="brand.700">Tulis atau Percantik Email dengan AI</Text>
                <HStack>
                  <Input
                    placeholder="Instruksi AI (contoh: Buatkan email undangan rapat desa...)"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    bg="white"
                    size="sm"
                    isDisabled={isSending || isAiLoading}
                  />
                  <Button
                    leftIcon={isAiLoading ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                    colorScheme="brand"
                    size="sm"
                    onClick={handleAiBeautify}
                    isLoading={isAiLoading}
                    loadingText="Memproses..."
                  >
                    Generate AI
                  </Button>
                </HStack>
              </Box>
`;

content = content.replace(
  "<Box bg=\"white\" color=\"black\">\n                <ReactQuill",
  aiUI + "\n              <Box bg=\"white\" color=\"black\">\n                <ReactQuill"
);

fs.writeFileSync(file, content);
