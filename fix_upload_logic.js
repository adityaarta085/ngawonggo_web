const fs = require('fs');

let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

const oldLogic = `    try {
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

    } catch (error) {`;

const newLogic = `    try {
        const generationUrl = \`https://api-faa.my.id/faa/ai-text2img-pro?prompt=\${encodeURIComponent(prompt)}\`;
        const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

        // 1. Fetch generated image
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

        const finalImageUrl = uploadData.path;

        // 3. Simpan ke Supabase
        const { data, error } = await supabase.from('ai_images').insert([{
            user_id: user.id,
            prompt: prompt,
            image_url: finalImageUrl,
            is_public: tier === 'VIP' ? isPublic : true, // Free always public
            user_name: userName
        }]).select().single();

        if (error) throw error;

        toast({ title: 'Berhasil', description: 'Gambar berhasil dibuat dan disimpan.', status: 'success' });
        navigate(\`/kreativitas/create/\${data.id}\`);

    } catch (error) {`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/views/KreativitasPage/index.js', content);
