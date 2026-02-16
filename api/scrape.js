const axios = require('axios');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_URL = 'https://www.beritamagelang.id';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeDetail(link) {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const title = $('.post-title').text().trim() || $('h1').first().text().trim();
    const date = $('.post-date').text().trim() || $('.date').first().text().trim();

    // Clean content
    const contentElement = $('.post-content').length ? $('.post-content') : $('.entry-content');

    // Remove scripts and styles
    contentElement.find('script, style').remove();

    let contentHtml = contentElement.html() || '';

    const cleanHtml = sanitizeHtml(contentHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt', 'width', 'height'],
        'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
      }
    });

    return {
      title,
      date,
      content: cleanHtml
    };
  } catch (error) {
    console.error(`Error scraping detail ${link}:`, error.message);
    return null;
  }
}

module.exports = async (req, res) => {
  // Simple check for cron or manual trigger
  // In production, you might want to secure this with a secret header

  const results = [];
  const pagesToScrape = [1, 2]; // Scrape first 2 pages per run to stay within timeout

  try {
    for (const page of pagesToScrape) {
      console.log(`Scraping page ${page}...`);
      const { data } = await axios.get(`${BASE_URL}/posts?page=${page}`);
      const $ = cheerio.load(data);

      const items = $('.post-item');

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const title = $(el).find('h4 a').text().trim();
        const relativeLink = $(el).find('h4 a').attr('href');
        const link = relativeLink.startsWith('http') ? relativeLink : `${BASE_URL}${relativeLink}`;
        const image = $(el).find('.post-thumb img').attr('src');
        const date = $(el).find('.date').text().trim();
        const snippet = $(el).find('.snippet').text().trim();

        const slug = link.split('/').filter(Boolean).pop();

        // Check if already exists
        const { data: existing } = await supabase
          .from('scraped_news')
          .select('id')
          .eq('link', link)
          .maybeSingle();

        if (existing) {
          console.log(`Skipping existing article: ${title}`);
          continue;
        }

        console.log(`New article found: ${title}. Scraping detail...`);
        await delay(1000); // Rate limit

        const detail = await scrapeDetail(link);

        if (detail) {
          const { error: insertError } = await supabase
            .from('scraped_news')
            .insert({
              title: detail.title || title,
              slug,
              link,
              image,
              date: detail.date || date,
              snippet,
              content: detail.content,
              source: 'berita-magelang'
            });

          if (insertError) {
            console.error(`Error inserting ${title}:`, insertError.message);
          } else {
            results.push({ title, status: 'inserted' });
          }
        }
      }

      await delay(1000); // Delay between pages
    }

    res.status(200).json({
      success: true,
      processed: results.length,
      articles: results
    });
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
