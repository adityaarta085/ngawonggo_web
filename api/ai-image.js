export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const generationUrl = `https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(prompt)}`;

    // Fetch from AI API
    const imageResponse = await fetch(generationUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`AI API Error: ${imageResponse.status}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to termai
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('file', blob, `ai-image-${Date.now()}.jpg`);

    const key = "AIzaBj7z2z3xBjsk";
    const uploadResponse = await fetch(`https://c.termai.cc/api/upload?key=${key}`, {
        method: 'POST',
        body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload API Error: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    if (!uploadData.status) {
      throw new Error('Storage returned error');
    }

    res.status(200).json({ success: true, url: uploadData.path });
  } catch (error) {
    console.error('AI Image Error:', error);
    res.status(500).json({ error: error.message });
  }
}
