const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  const { slug, page = 1, limit = 10 } = req.query;

  try {
    if (slug) {
      // Get detail
      const { data, error } = await supabase
        .from('scraped_news')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } else {
      // Get list
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('scraped_news')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return res.status(200).json({
        data,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
