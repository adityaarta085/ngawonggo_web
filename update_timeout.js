const fs = require('fs');
let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

const fetchLogic = `        setLoadingText('Sedang melukis mahakarya... (Mungkin memakan waktu hingga 30 detik)');
        const generationUrl = \`https://api-faa.my.id/faa/ai-text2img-pro?prompt=\${encodeURIComponent(prompt)}\`;

        // 1. Fetch generated image directly from browser
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        let imageResponse;
        try {
            imageResponse = await fetch(generationUrl, { signal: controller.signal });
        } catch (err) {
            throw new Error('Koneksi ke server AI terputus atau timeout.');
        } finally {
            clearTimeout(timeoutId);
        }

        if (!imageResponse.ok) throw new Error('Gagal melakukan generate gambar dari server AI.');
        const blob = await imageResponse.blob();`;

content = content.replace(/setLoadingText\('Sedang melukis mahakarya\.\.\. \(Mungkin memakan waktu hingga 30 detik\)'\);[\s\S]*?const blob = await imageResponse\.blob\(\);/m, fetchLogic);

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
