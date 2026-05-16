const fs = require('fs');

let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

const oldFetchLogic = `        setLoadingText('Sedang melukis mahakarya... (Mungkin memakan waktu hingga 30 detik)');
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

const newFetchLogic = `        setLoadingText('Sedang melukis mahakarya... (Mungkin memakan waktu hingga 30 detik)');

        // 1. Panggil serverless function kita untuk generate gambar
        const generateResponse = await fetch('/api/ai-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model: 'Flux1schnell' })
        });

        if (!generateResponse.ok) throw new Error('Gagal melakukan generate gambar dari server AI.');
        const generateData = await generateResponse.json();

        if (!generateData.success || !generateData.imageUrl) {
            throw new Error(generateData.error || 'Gagal mendapatkan gambar dari AI.');
        }

        // 2. Fetch the generated image blob
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        let imageResponse;
        try {
            imageResponse = await fetch(generateData.imageUrl, { signal: controller.signal });
        } catch (err) {
            throw new Error('Koneksi ke server AI terputus atau timeout saat mendownload.');
        } finally {
            clearTimeout(timeoutId);
        }

        if (!imageResponse.ok) throw new Error('Gagal mendownload gambar hasil generate.');
        const blob = await imageResponse.blob();`;

content = content.replace(oldFetchLogic, newFetchLogic);

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
