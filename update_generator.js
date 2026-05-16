const fs = require('fs');

let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

// Add new imports
content = content.replace(
  "import {",
  "import { supabase } from '../../lib/supabase';\nimport { useNavigate } from 'react-router-dom';\nimport {"
);

content = content.replace(
  "  FormControl,\n  FormLabel,\n  Switch,",
  "  FormControl,\n  FormLabel,\n  Switch,\n  useToast,"
);

// Add missing imports
if (!content.includes('useToast')) {
    content = content.replace(
      "import {",
      "import {\n  useToast,\n  Switch,\n  FormControl,\n  FormLabel,\n  HStack,"
    );
}


// Add state and logic
const newLogic = `
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        if (user) {
            supabase.from('user_tiers').select('tier_name').eq('user_id', user.id).single().then(({ data }) => {
                if (data) setTier(data.tier_name);
            });
        }
    });
  }, []);

  const handleGenerate = async () => {
    if (!user) {
        toast({ title: 'Silakan login', description: 'Anda harus login untuk membuat gambar.', status: 'warning' });
        navigate('/auth');
        return;
    }

    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
        const imageUrl = \`https://api-faa.my.id/faa/ai-text2img-pro?prompt=\${encodeURIComponent(prompt)}\`;
        const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

        // Simpan ke Supabase
        const { data, error } = await supabase.from('ai_images').insert([{
            user_id: user.id,
            prompt: prompt,
            image_url: imageUrl,
            is_public: tier === 'VIP' ? isPublic : true, // Free always public
            user_name: userName
        }]).select().single();

        if (error) throw error;

        toast({ title: 'Berhasil', description: 'Gambar sedang dibuat dan disimpan.', status: 'success' });
        navigate(\`/kreativitas/create/\${data.id}\`);

    } catch (error) {
        console.error("Error saving image:", error);
        toast({ title: 'Gagal', description: 'Gagal membuat gambar.', status: 'error' });
    } finally {
        setIsGenerating(false);
    }
  };
`;

content = content.replace(
  /const handleGenerate = \(\) => {[\s\S]*?1500\); \/\/ 1\.5 seconds artificial delay for dramatic effect\n  };/g,
  newLogic
);

// Add Navigation Buttons and Switch to UI
const buttonsUI = `
              <HStack spacing={4} justify="center" mb={6}>
                  <Button colorScheme="brand" variant="outline" onClick={() => navigate('/kreativitas/publik')}>
                      Galeri Publik
                  </Button>
                  <Button colorScheme="purple" variant={tier === 'VIP' ? 'solid' : 'outline'} onClick={() => {
                      if (tier === 'VIP') navigate('/kreativitas/histori');
                      else {
                          toast({ title: 'Fitur VIP', description: 'Histori hanya tersedia untuk pengguna VIP.', status: 'info' });
                          navigate('/portal/toko');
                      }
                  }}>
                      Histori Saya {tier !== 'VIP' && '(VIP)'}
                  </Button>
              </HStack>

              {/* Input Section */}
`;

content = content.replace("{/* Input Section */}", buttonsUI);


const switchUI = `
                  <Flex justify="space-between" align="center" mt={2} p={3} bg={useColorModeValue('whiteAlpha.500', 'blackAlpha.300')} borderRadius="lg">
                      <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="public-switch" mb="0" fontSize="sm" color={tier === 'VIP' ? 'gray.700' : 'gray.500'}>
                              Tampilkan di Publik
                          </FormLabel>
                          <Switch id="public-switch" isChecked={tier === 'VIP' ? isPublic : true} onChange={(e) => setIsPublic(e.target.checked)} isDisabled={tier !== 'VIP'} colorScheme="purple" />
                      </FormControl>
                      {tier !== 'VIP' && <Badge colorScheme="red" fontSize="xs">Hanya VIP (bisa privasi)</Badge>}
                  </Flex>
`;

content = content.replace(
  /<Text fontSize="8px" color="gray\.400" textAlign="right">\(hanya sementara ini free\)<\/Text>/g,
  switchUI
);


fs.writeFileSync('src/views/KreativitasPage/index.js', content);
