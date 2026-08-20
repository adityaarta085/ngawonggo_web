const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GPTOSS_BASE_URL = "https://gptoss-proxy-production.adityaarta085.workers.dev/v1/chat/completions";

/**
 * Call GPT-OSS Proxy Worker API with stream: true, model: gpt-oss-120b, reasoning_effort: high
 */
async function callGptOssWorker({ messages, userId, threadId }) {
  const effectiveUserId = userId || 'anonymous_user';
  const effectiveThreadId = threadId || `thr_${Date.now()}`;

  const response = await fetch(GPTOSS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Reasoning-Effort': 'high',
      'X-GPTOSS-User-Id': effectiveUserId,
      'X-GPTOSS-Thread-Id': effectiveThreadId,
    },
    body: JSON.stringify({
      model: 'gpt-oss-120b',
      messages,
      stream: true,
      metadata: {
        gptoss_user_id: effectiveUserId,
        gptoss_thread_id: effectiveThreadId,
        reasoning_effort: 'high',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GPT-OSS API Error (${response.status}): ${errText}`);
  }

  return response;
}

/**
 * Helper to collect streaming response into full text & reasoning content
 */
async function collectStreamResponse(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let fullReasoning = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const dataStr = trimmed.slice(6).trim();
      if (dataStr === '[DONE]') break;

      try {
        const parsed = JSON.parse(dataStr);
        const delta = parsed.choices?.[0]?.delta || {};
        if (delta.reasoning_content) {
          fullReasoning += delta.reasoning_content;
        }
        if (delta.content) {
          fullContent += delta.content;
        }
      } catch (e) {
        // Continue parsing next line
      }
    }
  }

  return { content: fullContent, reasoning: fullReasoning };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Mesin Waktu Requests ---
  const { year, action, isMesinWaktu } = req.body;
  if (isMesinWaktu) {
    try {
      const threadId = `thr_mesin_waktu_${year || '926'}`;
      let prompt = '';

      if (action) {
        prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu yang datang ke Desa Ngawonggo di tahun ${year}. User memilih tindakan: "${action}".

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
      } else {
        prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu. User baru saja mendarat di Desa Ngawonggo pada tahun ${year}.
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
      }

      const streamRes = await callGptOssWorker({
        messages: [{ role: 'user', content: prompt }],
        userId: req.body.userId || 'mesin_waktu_user',
        threadId,
      });

      const { content } = await collectStreamResponse(streamRes);
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
        console.error("AI JSON Parse Error:", content);
        // Fallback response if AI returns non-JSON text
        data = action ? {
          result: `Tindakan "${action}" memicu kejutan waktu di Desa Ngawonggo!`,
          title: "Penjelajah Dimensi",
          impact: { wealth: 10, mystic: 20, tech: 15, harmony: 25 }
        } : {
          year: String(year),
          title: `Era ${year} Ngawonggo`,
          description: `Anda mendarat dengan selamat di Desa Ngawonggo tahun ${year}. Suasana misterius namun ramah menyambut Anda.`,
          options: [
            { text: "Melihat situasi sekitar desa" },
            { text: "Bicara dengan tetua desa" },
            { text: "Mencari teknologi/artefak lokal" }
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
  const { messages, customPrompt, userId, threadId, stream } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID is required to use the chatbot.' });
  }

  try {
    // 1. Get Settings from Supabase
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['default_ai_prompt']);

    const defaultPromptSetting = settings?.find(s => s.key === 'default_ai_prompt');

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

    systemPrompt += `\n\nDi akhir setiap jawaban Anda, WAJIB sertakan watermark dan informasi kontak ini persis seperti berikut:\n\n---\n*Jawaban ini dihasilkan oleh AI (Asisten AI DESA).* \n*Mungkin terdapat kesalahan atau informasi yang kurang akurat.*\n*Untuk pertanyaan atau bantuan lebih lanjut, silakan hubungi email: desangawonggoku@gmail.com*`;

    systemPrompt += `\n\nIMPORTANT INSTRUCTION FOR ESCALATION:
Jika user meminta berbicara dengan Customer Service (CS) / manusia, ATAU jika Anda tidak mampu menjawab pertanyaan karena terlalu kompleks atau di luar pengetahuan Anda, Anda WAJIB membalas HANYA dengan JSON berikut (tanpa markdown, tanpa teks lain):
{
  "escalate": true,
  "summary": "<ringkasan singkat masalah user>",
  "reason": "<alasan kenapa butuh CS, misal 'User meminta CS' atau 'Pertanyaan terlalu kompleks'>"
}
Jika tidak perlu eskalasi, jawablah seperti biasa dengan teks biasa.`;

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const effectiveThreadId = threadId || `thr_chat_${userId}`;

    // Update usage count in Supabase
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

    // Call GPT-OSS Proxy Worker API
    const gptOssRes = await callGptOssWorker({
      messages: fullMessages,
      userId,
      threadId: effectiveThreadId,
    });

    const isClientStreaming = stream !== false;

    if (isClientStreaming) {
      // Stream SSE back to client
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = gptOssRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      return res.end();
    } else {
      // Non-streaming response collection for standard callers
      const { content, reasoning } = await collectStreamResponse(gptOssRes);
      return res.status(200).json({
        id: `chatcmpl_${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'gpt-oss-120b',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: content || 'Maaf, Asisten AI Desa Ngawonggo belum memiliki jawaban untuk pertanyaan ini.',
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
