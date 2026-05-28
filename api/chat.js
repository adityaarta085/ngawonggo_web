const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cek apakah ini permintaan dari Mesin Waktu
  const { year, action, isMesinWaktu } = req.body;
  if (isMesinWaktu) {
    try {
        const OPENAI_API_KEY = "acv-5ba0703e794843d66034b8eeb4801bdfd402471740e2f44f04ca225b2e465659";
        const client = new OpenAI({
            apiKey: OPENAI_API_KEY,
            baseURL: "https://www.aichixia.xyz/api/v1",
        });

        if (action) {
           const prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu yang datang ke Desa Ngawonggo di tahun ${year}. User memilih tindakan: "${action}".

    Buatlah hasil dari tindakan tersebut.
    Kembalikan respon DALAM FORMAT JSON SEPERTI INI (TANPA MARKDOWN, TANPA TEKS LAIN):
    {
      "result": "<deskripsi hasil tindakan yang lucu, absurd, cyberpunk, atau epik>",
      "title": "<julukan singkat dan keren untuk user, maksimal 4 kata>",
      "impact": {
        "wealth": <angka dampak kekayaan dari -100 sampai 100>,
        "mystic": <angka dampak mistis dari -100 sampai 100>,
        "tech": <angka dampak teknologi dari -100 sampai 100>,
        "harmony": <angka dampak keharmonisan dari -100 sampai 100>
      }
    }`;
            const response = await client.chat.completions.create({
                model: "gpt-5-mini",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
            });
            let data;
            try {
                data = JSON.parse(response.choices[0].message.content.trim());
            } catch (e) {
                console.error("AI JSON Parse Error:", response.choices[0].message.content);
                throw new Error("Invalid JSON from AI");
            }
            return res.status(200).json(data);
        } else {
            const prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu. User baru saja mendarat di Desa Ngawonggo pada tahun ${year}.
    Buatlah deskripsi kedatangan yang unik, absurd, atau epik, dan berikan 3 pilihan tindakan yang lucu, tidak masuk akal, atau sangat spesifik.

    Kembalikan respon DALAM FORMAT JSON SEPERTI INI (TANPA MARKDOWN, TANPA TEKS LAIN):
    {
      "year": "${year}",
      "title": "<Judul Era yang dramatis>",
      "description": "<Deskripsi situasi di mana user mendarat, maksimal 3 kalimat>",
      "options": [
        { "text": "<pilihan tindakan 1>" },
        { "text": "<pilihan tindakan 2>" },
        { "text": "<pilihan tindakan 3>" }
      ]
    }`;
            const response = await client.chat.completions.create({
                model: "gpt-5-mini",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
            });
            let data;
            try {
                data = JSON.parse(response.choices[0].message.content.trim());
            } catch (e) {
                console.error("AI JSON Parse Error:", response.choices[0].message.content);
                throw new Error("Invalid JSON from AI");
            }
            return res.status(200).json(data);
        }
    } catch (error) {
        console.error('Mesin Waktu AI Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
  }

  // --- Normal Chat Logic Below ---
  const { messages, customPrompt, userId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  // Wajib Login / User ID required
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID is required to use the chatbot.' });
  }

  try {
    // 1. Get Settings from Supabase
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['openai_api_key', 'default_ai_prompt']);

    const openAiKeySetting = settings?.find(s => s.key === 'openai_api_key');
    const defaultPromptSetting = settings?.find(s => s.key === 'default_ai_prompt');

    const OPENAI_API_KEY = openAiKeySetting?.value || "acv-5ba0703e794843d66034b8eeb4801bdfd402471740e2f44f04ca225b2e465659";

    // 2. Check limits
    const { data: tierData } = await supabase
      .from('user_tiers')
      .select('tier_name')
      .eq('user_id', userId)
      .single();

    const isVIP = tierData && tierData.tier_name !== 'Free';
    const limit = isVIP ? 50 : 5;

    const today = new Date().toISOString().split('T')[0];
    const { data: usageData } = await supabase
      .from('user_feature_usage')
      .select('usage_count')
      .eq('user_id', userId)
      .eq('feature_name', 'ai_chat')
      .eq('usage_date', today)
      .single();

    const usageCount = usageData ? usageData.usage_count : 0;

    if (usageCount >= limit) {
      return res.status(403).json({
          error: `Daily limit reached. ${isVIP ? 'You have used your 50 daily chats.' : 'Upgrade to VIP for 50 chats/day.'}`,
          limitReached: true
      });
    }

    // 3. Setup System Prompt
    let systemPrompt = defaultPromptSetting?.value || 'Anda adalah Asisten AI Desa Ngawonggo. Anda ramah, cerdas, dan membantu. Anda memberikan informasi tentang Desa Ngawonggo Kabupaten Magelang, seperti berita desa, tempat wisata (Wisata Ngawonggo, dll), layanan publik, dan lembaga desa. Jika tidak tahu, sarankan untuk menghubungi kantor desa.';

    if (customPrompt) {
        systemPrompt = customPrompt;
    }

    systemPrompt += `\n\nDi akhir setiap jawaban Anda, WAJIB sertakan watermark dan informasi kontak ini persis seperti berikut:\n\n---\n*Jawaban ini dihasilkan oleh AI (Asisten AI DESA).*\n*Mungkin terdapat kesalahan atau informasi yang kurang akurat.*\n*Untuk pertanyaan atau bantuan lebih lanjut, silakan hubungi email: desangawonggoku@gmail.com*`;

    systemPrompt += `\n\nIMPORTANT INSTRUCTION FOR ESCALATION:
Jika user meminta berbicara dengan Customer Service (CS) / manusia, ATAU jika Anda tidak mampu menjawab pertanyaan karena terlalu kompleks atau di luar pengetahuan Anda, Anda WAJIB membalas HANYA dengan JSON berikut (tanpa markdown, tanpa teks lain):
{
  "escalate": true,
  "summary": "<ringkasan singkat masalah user>",
  "reason": "<alasan kenapa butuh CS, misal 'User meminta CS' atau 'Pertanyaan terlalu kompleks'>"
}
Jika tidak perlu eskalasi, jawablah seperti biasa dengan teks biasa.`;

    // 4. Call OpenAI API
    const client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        baseURL: "https://www.aichixia.xyz/api/v1",
    });

    const response = await client.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({ role: msg.role, content: msg.content }))
        ],
        temperature: 0.7,
        max_tokens: 1024,
    });

    // 5. Increment Usage
    if (usageData) {
      await supabase
        .from('user_feature_usage')
        .update({ usage_count: usageCount + 1, last_used_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('feature_name', 'ai_chat')
        .eq('usage_date', today);
    } else {
      await supabase
        .from('user_feature_usage')
        .insert({
          user_id: userId,
          feature_name: 'ai_chat',
          usage_date: today,
          usage_count: 1
        });
    }

    // Format response back to match previous structure
    return res.status(200).json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(error.response?.status || 500).json({
      error: error.message || 'An error occurred during chat completion'
    });
  }
};
