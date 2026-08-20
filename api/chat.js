const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cpamusheoowbmllxffrt.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwYW11c2hlb293Ym1sbHhmZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzQxODMsImV4cCI6MjA4NTQ1MDE4M30.5J-ObKNsLXZL6yNeiGNjLy3jpAUx0hGC-2oJPYdcmMs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_KNOWLEDGE_PROMPT = `Anda adalah Asisten AI Desa Ngawonggo yang ramah, cerdas, informatif, dan membantu warga maupun pengunjung.
Anda memiliki pengetahuan lengkap seputar Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah serta seluruh fitur pada website resmi Desa Ngawonggo:

1. 🕌 Al-Quran Digital & Jadwal Sholat:
   - Tersedia di menu/halaman "/quran".
   - Menyediakan Al-Quran 30 Juz lengkap dengan teks Arab, terjemahan bahasa Indonesia, audio murottal per ayat, serta Jadwal Waktu Sholat otomatis yang akurat untuk wilayah Kabupaten Magelang & sekitarnya.

2. 📜 Layanan Administrasi & Surat Online:
   - Tersedia di menu/halaman "/layanan".
   - Warga dapat mengajukan berbagai surat keterangan (Surat Pengantar KTP/KK, Domisili, Usaha, Kelahiran, Kematian, Tidak Mampu, dll) secara mandiri dan cepat secara online.

3. 📢 Pengaduan & Aspirasi Warga:
   - Tersedia di menu "/layanan" (bagian Form Pengaduan).
   - Setiap pengaduan langsung diproses dan dapat dipantau status penanganannya oleh perangkat desa.

4. 📰 Berita & Portal Informasi Desa:
   - Tersedia di menu "/berita" dan "/portal" untuk kabar terkini kegiatan masyarakat, pembangunan desa, dan info agrikultur lereng Gunung Sumbing.

5. ⏳ Mesin Waktu Ngawonggo:
   - Tersedia di menu "/mesin-waktu" untuk game simulasi penjelajahan waktu fiksi sejarah Desa Ngawonggo dari masa ke masa secara interaktif.

6. 🎨 Kreativitas & Komunitas:
   - Tersedia di menu "/kreativitas" (Generator Gambar AI Desa) dan "/media" (Galeri foto/video karya warga).

7. 🤝 Donasi & Topup Koin:
   - Tersedia di menu "/donasi" dan "/topup" untuk program sosial kemasyarakatan dan transaksi fitur premium.

8. 🏛️ Profil & Pemerintahan Desa:
   - Tersedia di menu "/profil" (Sejarah sejak 1904, Visi Misi SEGER, Demografi, Peta Wilayah) dan "/pemerintahan" (Struktur perangkat desa).

9. 🎧 Customer Service (CS) Desa:
   - Jika warga meminta berbicara langsung dengan Petugas / Customer Service / manusia, atau pertanyaan membutuhkan penanganan admin, Anda WAJIB membalas HANYA dengan format JSON eskalasi berikut:
{
  "escalate": true,
  "summary": "<ringkasan kebutuhan user>",
  "reason": "<alasan eskalasi>"
}`;

const SUPPORTED_MODELS = [
  { id: 'mistral-agent', name: 'AlfiXD Mistral Agent', category: 'General / Agent', description: 'Model Cepat, Ringan & Serba Bisa untuk Percakapan Umum', recommended: true },
  { id: 'deepseek', name: 'DeepSeek V3', category: 'Reasoning & Intelligence', description: 'Penalaran Mendalam, Bahasa Indonesia Sangat Natural & Cerdas', recommended: true },
  { id: 'islamic-ai', name: 'Islamic AI Specialist', category: 'Islamic / Religion', description: 'Spesialis Dalil Al-Quran, Fiqih, Sholat, dan Keagamaan', recommended: true },
  { id: 'codestral', name: 'Codestral High-Logic', category: 'Logic & Code', description: 'Optimal untuk Struktur Data, Logika Komputasi, & Format JSON' },
  { id: 'pixtral', name: 'Pixtral Vision', category: 'Vision & Multimodal', description: 'Analisis Visual & Pemrosesan Gambar Dokumen' },
  { id: 'zai-glm', name: 'Z.AI GLM-4.7', category: 'Large Language Model', description: 'Zhipu AI Multilingual Engine' },
  { id: 'gpt5', name: 'GPT-5 Turbo', category: 'Next-Gen Interface', description: 'Model OpenAI Next-Generation Compatible' },
  { id: 'claude', name: 'Claude Sonnet 4.5', category: 'Advanced Conversational', description: 'Anthropic High-Precision Contextual Assistant' },
  { id: 'gemini', name: 'Gemini 3 Flash', category: 'Google Multimodal', description: 'Google Deepmind Ultra-fast Processing' },
  { id: 'kimi', name: 'Kimi K2', category: 'Long-Context', description: 'Moonshot AI Extended Contextual Memory' }
];

/**
 * Fetch dynamic AI model configuration from Supabase site_settings
 */
async function getAIModelConfig() {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['ai_primary_model', 'ai_fallback_models']);

    const primary = data?.find(s => s.key === 'ai_primary_model')?.value || 'mistral-agent';
    const fallbacksRaw = data?.find(s => s.key === 'ai_fallback_models')?.value || 'deepseek,islamic-ai,codestral';
    const fallbacks = fallbacksRaw.split(',').map(s => s.trim()).filter(Boolean);

    return { primary, fallbacks };
  } catch (e) {
    return { primary: 'mistral-agent', fallbacks: ['deepseek', 'islamic-ai', 'codestral'] };
  }
}

/**
 * Call AI Engine with dynamic prioritized models and fallbacks
 */
async function callAIEngine(prompt, requestedModel = null) {
  const config = await getAIModelConfig();
  const modelsToTry = [
    ...(requestedModel ? [requestedModel] : []),
    config.primary,
    ...config.fallbacks,
    'mistral-agent',
    'deepseek',
    'islamic-ai'
  ];
  const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];

  for (const model of uniqueModels) {
    try {
      const response = await fetch('https://ai.alfisy.my.id/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          model: model,
        }),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const reply = (data.reply || data.analysis || data.message || '').trim();

      // Ensure reply is not empty or an internal error string
      if (reply && !reply.startsWith('Maaf, terjadi kesalahan saat memproses permintaan') && !reply.startsWith('Gagal terhubung')) {
        return {
          content: reply,
          reasoning: data.reasoning || '',
          model: model,
        };
      }
    } catch (err) {
      console.warn(`Model ${model} failed, trying next fallback...`, err.message);
    }
  }

  // Final fallback text if all models had connection issues
  return {
    content: 'Halo! Mohon maaf, saat ini server AI sedang mengalami sedikit kendala jaringan. Anda dapat langsung mengakses menu Al-Quran di "/quran", Layanan Surat di "/layanan", atau hubungi Customer Service kami.',
    reasoning: '',
    model: 'fallback',
  };
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Reasoning-Effort, X-GPTOSS-Thread-Id, X-GPTOSS-User-Id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const config = await getAIModelConfig();
    return res.status(200).json({
      success: true,
      config,
      models: SUPPORTED_MODELS
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Admin Model Testing Action ---
  if (req.body?.action === 'test_model') {
    const modelToTest = req.body.model || 'mistral-agent';
    const t0 = Date.now();
    try {
      const response = await fetch('https://ai.alfisy.my.id/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Halo, respon dalam 1 kalimat pendek: saya siap.',
          model: modelToTest,
        }),
      });
      const data = await response.json();
      const latency = Date.now() - t0;
      const text = (data.reply || data.analysis || data.message || '').trim();
      const isOnline = response.ok && text && !text.startsWith('Maaf, terjadi kesalahan') && !text.startsWith('Gagal terhubung');
      return res.status(200).json({
        success: isOnline,
        model: modelToTest,
        latency,
        reply: text,
        status: isOnline ? 'online' : 'error'
      });
    } catch (e) {
      return res.status(200).json({
        success: false,
        model: modelToTest,
        latency: Date.now() - t0,
        error: e.message,
        status: 'failed'
      });
    }
  }

  // --- Mesin Waktu Requests ---
  const { year, action, isMesinWaktu } = req.body;
  if (isMesinWaktu) {
    try {
      let prompt = '';
      if (action) {
        prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu yang mendarat di Desa Ngawonggo pada tahun ${year}. User memilih tindakan: "${action}".

Buatlah deskripsi hasil dari tindakan tersebut yang seru, absurd, atau epik.
Kembalikan respon HANYA DALAM FORMAT JSON BERIKUT (TANPA MARKDOWN, TANPA TEKS LAIN):
{
  "result": "<deskripsi hasil tindakan yang lucu, absurd, cyberpunk, atau epik>",
  "title": "<julukan singkat dan keren untuk user, maksimal 4 kata>",
  "impact": {
    "wealth": 20,
    "mystic": 15,
    "tech": 10,
    "harmony": 25
  }
}`;
      } else {
        prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu. User baru saja mendarat di Desa Ngawonggo pada tahun ${year}.
Buatlah deskripsi kedatangan yang unik, absurd, atau epik, dan berikan 3 pilihan tindakan yang menarik atau tidak terduga.

Kembalikan respon HANYA DALAM FORMAT JSON BERIKUT (TANPA MARKDOWN, TANPA TEKS LAIN):
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
      }

      const { content } = await callAIEngine(prompt, 'mistral-agent');
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      let data;
      try {
        data = JSON.parse(cleanContent);
      } catch (e) {
        console.error('Mesin Waktu JSON Parse Error, using structured fallback:', content);
        data = action ? {
          result: `Tindakan "${action}" memicu resonansi waktu di sekitar perkebunan lereng Gunung Sumbing Desa Ngawonggo!`,
          title: "Penjelajah Dimensi Sumbing",
          impact: { wealth: 15, mystic: 25, tech: 20, harmony: 30 }
        } : {
          year: String(year),
          title: `Era ${year} Misteri Ngawonggo`,
          description: `Anda mendarat dengan selamat di perbukitan Desa Ngawonggo tahun ${year}. Udara sejuk lereng gunung menyambut petualangan Anda.`,
          options: [
            { text: "Menyapa warga dan tetua desa yang sedang berkumpul" },
            { text: "Menjelajahi mata air dan sawah terasering desa" },
            { text: "Mencari petunjuk artefak peradaban masa lalu" }
          ]
        };
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Mesin Waktu AI Error:', error);
      return res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
  }

  // --- Normal Chat Requests ---
  const { messages, customPrompt, userId, stream } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  const effectiveUserId = userId || 'anonymous_user';

  try {
    // 1. Get Settings from Supabase if available
    let systemPrompt = DEFAULT_KNOWLEDGE_PROMPT;
    try {
      const { data: settings } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['default_ai_prompt']);

      const defaultPromptSetting = settings?.find(s => s.key === 'default_ai_prompt');
      if (defaultPromptSetting && defaultPromptSetting.value) {
        systemPrompt = `${defaultPromptSetting.value}\n\n${DEFAULT_KNOWLEDGE_PROMPT}`;
      }
    } catch (dbErr) {
      console.warn('Could not fetch site_settings prompt:', dbErr.message);
    }

    if (customPrompt) {
      systemPrompt = `${customPrompt}\n\n${DEFAULT_KNOWLEDGE_PROMPT}`;
    }

    // 2. Check limits for authenticated users
    let isVIP = false;
    if (userId && userId !== 'anonymous_user' && userId !== 'takedown_user') {
      try {
        const { data: tierData } = await supabase
          .from('user_tiers')
          .select('tier_name')
          .eq('user_id', userId)
          .single();

        // 2. Check dynamic limits from Supabase site_settings
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['ai_free_daily_limit', 'monetization_enabled']);

        const freeLimitVal = parseInt(settingsData?.find(s => s.key === 'ai_free_daily_limit')?.value || '3', 10);
        const freeLimit = isNaN(freeLimitVal) ? 3 : freeLimitVal;
        const monetizationEnabled = settingsData?.find(s => s.key === 'monetization_enabled')?.value !== 'false';

        isVIP = tierData && tierData.tier_name !== 'Free';
        const limit = !monetizationEnabled ? 9999 : (isVIP ? 50 : freeLimit);

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
            error: `Limit harian AI tercapai (${usageCount}/${limit} pesan). ${isVIP ? 'Anda telah mencapai kuota 50 chat hari ini.' : `Batas harian akun gratis adalah ${limit} pesan/hari. Upgrade ke akun VIP untuk 50 pesan/hari!`}`,
            limitReached: true
          });
        }

        // Increment usage count
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
      } catch (usageErr) {
        console.warn('Usage check warning:', usageErr.message);
      }
    }

    // 3. Prepare AI Prompt
    const conversationHistory = messages.map(m => `${m.role === 'user' ? 'Warga/User' : 'Asisten'}: ${m.content}`).join('\n');
    const fullPrompt = `${systemPrompt}\n\nRiwayat Percakapan:\n${conversationHistory}\n\nAsisten AI Desa Ngawonggo:`;

    // 4. Call AI Engine
    const { content: rawContent, reasoning, model: usedModel } = await callAIEngine(fullPrompt, 'mistral-agent');

    let finalContent = rawContent;

    // Check if output is escalation JSON
    let isEscalation = false;
    let cleanForJson = rawContent.trim();
    if (cleanForJson.startsWith('```json')) {
      cleanForJson = cleanForJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanForJson.startsWith('```')) {
      cleanForJson = cleanForJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    try {
      const parsedJson = JSON.parse(cleanForJson);
      if (parsedJson.escalate) {
        isEscalation = true;
        finalContent = JSON.stringify(parsedJson);
      }
    } catch (e) {
      // Not JSON escalation, treat as normal text
    }

    // Append standard watermark to regular text answers
    if (!isEscalation && !finalContent.includes('Jawaban ini dihasilkan oleh AI')) {
      finalContent += `\n\n---\n*Jawaban ini dihasilkan oleh AI (Asisten AI Desa Ngawonggo).* \n*Mungkin terdapat kesalahan informasi. Untuk layanan resmi silakan hubungi email: desangawonggoku@gmail.com*`;
    }

    const isClientStreaming = stream !== false;

    if (isClientStreaming) {
      // Stream SSE tokens to client with standard OpenAI event-stream format
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      // Send reasoning chunk if available
      if (reasoning) {
        const reasoningChunk = {
          id: `chatcmpl_${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: usedModel,
          choices: [{
            index: 0,
            delta: { reasoning_content: reasoning },
            finish_reason: null
          }]
        };
        res.write(`data: ${JSON.stringify(reasoningChunk)}\n\n`);
      }

      // Stream content in small chunks
      const words = finalContent.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunkText = (i === 0 ? '' : ' ') + words[i];
        const contentChunk = {
          id: `chatcmpl_${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: usedModel,
          choices: [{
            index: 0,
            delta: { content: chunkText },
            finish_reason: null
          }]
        };
        res.write(`data: ${JSON.stringify(contentChunk)}\n\n`);
      }

      // Send finish chunk & [DONE]
      const finishChunk = {
        id: `chatcmpl_${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: usedModel,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: 'stop'
        }]
      };
      res.write(`data: ${JSON.stringify(finishChunk)}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    } else {
      // Non-streaming response for Axios/REST callers
      return res.status(200).json({
        id: `chatcmpl_${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: usedModel,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: finalContent,
              reasoning_content: reasoning || '',
            },
            finish_reason: 'stop',
          },
        ],
      });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error.message || 'An error occurred during chat completion'
      });
    } else {
      res.end();
    }
  }
};
