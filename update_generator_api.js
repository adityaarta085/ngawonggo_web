const fs = require('fs');
let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

const oldLogic = `        // 1. Fetch generated image
        const imageResponse = await fetch(generationUrl);
        if (!imageResponse.ok) throw new Error('Failed to generate image');
        const blob = await imageResponse.blob();

        // 2. Upload to storage API (matching community logic)
        const formData = new FormData();
        formData.append('file', blob, \`ai-image-\${Date.now()}.jpg\`);

        const key = "AIzaBj7z2z3xBjsk";
        const uploadResponse = await fetch(\`https://c.termai.cc/api/upload?key=\${key}\`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload image to storage');
        const uploadData = await uploadResponse.json();
        if (!uploadData.status) throw new Error('Storage returned error');

        const finalImageUrl = uploadData.path;`;

const newLogic = `        // 1 & 2. Generate and Upload via Serverless API
        const response = await fetch('/api/generate-ai-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Failed to generate and upload image');
        }

        const finalImageUrl = result.url;`;

content = content.replace(oldLogic, newLogic);
content = content.replace("const generationUrl = `https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(prompt)}`;", "");

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
