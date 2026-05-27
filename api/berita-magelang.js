const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
  const { slug, page = 1, limit = 10 } = req.query;
  try {
    if (slug) {
      const { data, error } = await supabase.from('scraped_news').select('*').eq('slug', slug).single();
      if (error) throw error;
      return res.status(200).json(data);
    } else {
      const from = (page - 1) * limit;
      const { data, error, count } = await supabase.from('scraped_news').select('*', { count: 'exact' }).order('id', { ascending: false }).range(from, from + limit - 1);
      if (error) throw error;
      return res.status(200).json({ data, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) } });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
