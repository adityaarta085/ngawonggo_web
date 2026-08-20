const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GPTOSS_BASE_URL = "https://gptoss-proxy-production.adityaarta085.workers.dev/v1/chat/completions";

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { newsId, type, content, userId } = req.body;

  if (!newsId || !type || !content || !userId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const tableName = type === 'national' ? 'national_news' : 'news';

  try {
    // 1. Check if summary already exists in DB
    const { data: newsData, error: newsError } = await supabase
      .from(tableName)
      .select('ai_summary')
      .eq('id', newsId)
      .single();

    if (newsError) throw newsError;

    if (newsData && newsData.ai_summary) {
      // Return cached summary, no limit check needed
      return res.status(200).json({ success: true, summary: newsData.ai_summary, cached: true });
    }

    // 2. Summary doesn't exist. Check user limits.
    const { data: tierData } = await supabase
      .from('user_tiers')
      .select('tier_name')
      .eq('user_id', userId)
      .single();

    const isVIP = tierData && tierData.tier_name !== 'Free';
    const limit = isVIP ? -1 : 1; // -1 means unlimited

    // Check usage for today
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
      return res.status(403).json({ error: 'Daily limit reached. Upgrade to VIP for unlimited summaries.', limitReached: true });
    }

    // 3. Fetch summary from GPT-OSS 120B API with stream: true and reasoning_effort: high
    const cleanContent = content.replace(/<[^>]*>?/gm, ''); // basic html strip
    const prompt = `langsung ringkaskan berita berikut secara singkat dan jelas, langsung ke isi ringkasan tanpa pembuka atau penutup: ${cleanContent}`;

    const threadId = `news_summary_${newsId}`;

    const aiResponse = await fetch(GPTOSS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Reasoning-Effort': 'high',
        'X-GPTOSS-User-Id': userId,
        'X-GPTOSS-Thread-Id': threadId,
      },
      body: JSON.stringify({
        model: 'gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        metadata: {
          gptoss_user_id: userId,
          gptoss_thread_id: threadId,
          reasoning_effort: 'high',
        },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`Failed to fetch from GPT-OSS service: ${errText}`);
    }

    // Collect streamed chunks
    const reader = aiResponse.body.getReader();
    const decoder = new TextDecoder();
    let summary = '';
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
          if (delta.content) {
            summary += delta.content;
          }
        } catch (e) {
          // continue
        }
      }
    }

    summary = summary.trim();
    if (!summary) {
      summary = "Ringkasan tidak dapat dibuat untuk artikel ini.";
    }

    // 4. Save to DB
    await supabase
      .from(tableName)
      .update({ ai_summary: summary })
      .eq('id', newsId);

    // 5. Update user usage
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

    return res.status(200).json({ success: true, summary, cached: false, isVIP });

  } catch (error) {
    console.error('AI Summary Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
