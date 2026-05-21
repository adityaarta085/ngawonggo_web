const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // Use anon key since RLS is disabled/allowed for anon, but normally we'd use a service role key.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://api.nexray.eu.cc/berita/cnn');

    if (response.data && response.data.status && response.data.result) {
      const newsItems = response.data.result.map(item => ({
        title: item.title,
        image_thumbnail: item.image_thumbnail,
        image_full: item.image_full,
        date: item.time,
        slug: item.slug,
        link: item.link,
        content: item.content,
        source: 'CNN'
      }));

      // Upsert data based on unique slug
      const { data, error } = await supabase
        .from('national_news')
        .upsert(newsItems, { onConflict: 'slug' });

      if (error) {
        throw error;
      }

      res.status(200).json({ success: true, message: 'Cron executed successfully', insertedCount: newsItems.length });
    } else {
      res.status(500).json({ success: false, message: 'Failed to fetch valid data from API' });
    }
  } catch (error) {
    console.error('Error in cron job:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
