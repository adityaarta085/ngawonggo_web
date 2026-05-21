const fs = require('fs');

let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

content = content.replace("const [isGenerating, setIsGenerating] = useState(false);", "const [isGenerating, setIsGenerating] = useState(false);\n  const [loadingText, setLoadingText] = useState('');");

const newFetchLogic = `        setLoadingText('Sedang melukis mahakarya... (Mungkin memakan waktu hingga 30 detik)');
        const generationUrl = \`https://api-faa.my.id/faa/ai-text2img-pro?prompt=\${encodeURIComponent(prompt)}\`;

        // 1. Fetch generated image directly from browser
        const imageResponse = await fetch(generationUrl);
        if (!imageResponse.ok) throw new Error('Gagal melakukan generate gambar dari server AI.');
        const blob = await imageResponse.blob();

        setLoadingText('Mengunggah mahakarya ke server...');
        // 2. Upload to storage API (matching community logic)
        const formData = new FormData();
        formData.append('file', blob, \`ai-image-\${Date.now()}.jpg\`);

        const key = "AIzaBj7z2z3xBjsk";
        const uploadResponse = await fetch(\`https://c.termai.cc/api/upload?key=\${key}\`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Gagal mengunggah gambar ke penyimpanan.');
        const uploadData = await uploadResponse.json();
        if (!uploadData.status) throw new Error('Server penyimpanan mengembalikan error.');

        const finalImageUrl = uploadData.path;
        setLoadingText('Menyimpan data...');`;

content = content.replace(/const generationUrl =[\s\S]*?const finalImageUrl = uploadData\.path;/m, newFetchLogic);

content = content.replace("<Text fontWeight=\"bold\" color=\"purple.500\" animation=\"pulse 2s infinite\">Sedang melukis mahakarya...</Text>", "<Text fontWeight=\"bold\" color=\"purple.500\" animation=\"pulse 2s infinite\">{loadingText || 'Sedang memproses...'}</Text>");

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
