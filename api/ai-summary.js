const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cpamusheoowbmllxffrt.supabase.co';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwYW11c2hlb293Ym1sbHhmZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzQxODMsImV4cCI6MjA4NTQ1MDE4M30.5J-ObKNsLXZL6yNeiGNjLy3jpAUx0hGC-2oJPYdcmMs';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    return [primary, ...fallbacks, 'mistral-agent', 'deepseek'];
  } catch (e) {
    return ['mistral-agent', 'deepseek', 'islamic-ai'];
  }
}

/**
 * Call AI Engine to generate summary
 */
async function generateSummaryWithAI(cleanText) {
  const prompt = `langsung ringkaskan berita berikut secara singkat, padat, dan jelas (maksimal 3-4 kalimat), langsung ke inti berita tanpa kalimat pembuka atau penutup:\n\n${cleanText}`;
  const models = await getAIModelConfig();
  const uniqueModels = [...new Set(models.filter(Boolean))];

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

      if (reply && !reply.startsWith('Maaf, terjadi kesalahan') && !reply.startsWith('Gagal terhubung')) {
        return reply;
      }
    } catch (err) {
      console.warn(`Summary model ${model} failed, trying next:`, err.message);
    }
  }

  // Fallback: Smart extractive summary if AI service unreachable
  const sentences = cleanText.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 15);
  if (sentences.length > 0) {
    return sentences.slice(0, 3).join(' ');
  }

  return cleanText.slice(0, 200) + '...';
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { newsId, type, content, userId } = req.body;

  if (!newsId || !type || !content || !userId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const tableName = type === 'national' ? 'national_news' : 'news';

  try {
    // 1. Check if valid summary already exists in DB
    const { data: newsData, error: newsError } = await supabase
      .from(tableName)
      .select('ai_summary')
      .eq('id', newsId)
      .single();

    if (!newsError && newsData && newsData.ai_summary) {
      const existingSummary = newsData.ai_summary.trim();
      // Only return cached if it's NOT the old broken error message
      if (existingSummary && existingSummary !== 'Ringkasan tidak dapat dibuat untuk artikel ini.') {
        return res.status(200).json({ success: true, summary: existingSummary, cached: true });
      }
    }

    // 2. Check user limits
    let isVIP = false;
    if (userId !== 'anonymous_user') {
      const { data: tierData } = await supabase
        .from('user_tiers')
        .select('tier_name')
        .eq('user_id', userId)
        .single();

      isVIP = tierData && tierData.tier_name !== 'Free';
      const limit = isVIP ? 9999 : 5; // 5 summaries per day for free tier

      const today = new Date().toISOString().split('T')[0];
      const { data: usageData } = await supabase
        .from('user_feature_usage')
        .select('usage_count')
        .eq('user_id', userId)
        .eq('feature_name', 'ai_summary')
        .eq('usage_date', today)
        .single();

      const usageCount = usageData ? usageData.usage_count : 0;

      if (!isVIP && usageCount >= limit) {
        return res.status(403).json({ error: 'Limit harian ringkasan tercapai. Upgrade ke VIP untuk akses tak terbatas.', limitReached: true });
      }

      // Update usage
      if (usageData) {
        await supabase
          .from('user_feature_usage')
          .update({ usage_count: usageCount + 1, last_used_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('feature_name', 'ai_summary')
          .eq('usage_date', today);
      } else {
        await supabase
          .from('user_feature_usage')
          .insert({
            user_id: userId,
            feature_name: 'ai_summary',
            usage_date: today,
            usage_count: 1
          });
      }
    }

    // 3. Generate summary with AI
    const cleanContent = content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
    const summary = await generateSummaryWithAI(cleanContent);

    // 4. Save clean summary to DB
    try {
      await supabase
        .from(tableName)
        .update({ ai_summary: summary })
        .eq('id', newsId);
    } catch (saveErr) {
      console.warn('Could not save ai_summary to database:', saveErr.message);
    }

    return res.status(200).json({ success: true, summary, cached: false, isVIP });

  } catch (error) {
    console.error('AI Summary Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
