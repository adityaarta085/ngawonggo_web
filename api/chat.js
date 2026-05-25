const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, customPrompt, userId, isTool, toolName, toolDesc } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  // Wajib Login / User ID required
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID is required to use the chatbot/tools.' });
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
    const limit = isVIP ? (isTool ? 500 : 50) : (isTool ? 50 : 5);

    const featureName = isTool ? 'ai_tool' : 'ai_chat';

    const today = new Date().toISOString().split('T')[0];
    const { data: usageData } = await supabase
      .from('user_feature_usage')
      .select('usage_count')
      .eq('user_id', userId)
      .eq('feature_name', featureName)
      .eq('usage_date', today)
      .single();

    const usageCount = usageData ? usageData.usage_count : 0;

    if (usageCount >= limit) {
      return res.status(403).json({
          error: `Daily limit reached for ${featureName}.`,
          limitReached: true
      });
    }

    // 3. Setup System Prompt
    let systemPrompt = '';

    if (isTool) {
        systemPrompt = customPrompt || `Anda adalah alat online profesional bernama '${toolName}'. Fungsi utama Anda adalah: '${toolDesc}'. Tugas Anda adalah untuk memproses input dari pengguna dan memberikan hasil akhir SECARA LANGSUNG sesuai dengan fungsi alat tersebut. DILARANG KERAS menggunakan kata-kata pengantar seperti "Tentu", "Berikut adalah", "Ini hasilnya", atau kalimat perpisahan. HANYA KEMBALIKAN OUTPUT HASIL PROSES SAJA. Jika diminta format JSON, kembalikan JSON valid. Jika input tidak masuk akal, kembalikan 'Error: Input tidak valid untuk alat ini.'`;
    } else {
        systemPrompt = defaultPromptSetting?.value || 'Anda adalah Asisten AI Desa Ngawonggo. Anda ramah, cerdas, dan membantu. Anda memberikan informasi tentang Desa Ngawonggo Kabupaten Magelang, seperti berita desa, tempat wisata (Wisata Ngawonggo, dll), layanan publik, dan lembaga desa. Jika tidak tahu, sarankan untuk menghubungi kantor desa.';

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
    }

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
        temperature: isTool ? 0.2 : 0.7,
        max_tokens: 1500,
    });

    // 5. Increment Usage
    if (usageData) {
      await supabase
        .from('user_feature_usage')
        .update({ usage_count: usageCount + 1, last_used_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('feature_name', featureName)
        .eq('usage_date', today);
    } else {
      await supabase
        .from('user_feature_usage')
        .insert({
          user_id: userId,
          feature_name: featureName,
          usage_date: today,
          usage_count: 1
        });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(error.response?.status || 500).json({
      error: error.message || 'An error occurred during chat completion'
    });
  }
};
