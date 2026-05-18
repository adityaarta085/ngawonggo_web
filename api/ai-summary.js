const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // 3. Fetch summary from AI
    const cleanContent = content.replace(/<[^>]*>?/gm, ''); // basic html strip
    const prompt = `langsung ringkaskan berita, langsung ke isi ringkasan. ${cleanContent}`;

    const aiResponse = await axios.get(`https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(prompt)}`);

    if (!aiResponse.data || !aiResponse.data.result) {
      throw new Error('Failed to fetch from AI service');
    }

    const summary = aiResponse.data.result;

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
