const axios = require('axios');

async function testFormat() {
  const mapData = (item) => ({
      title: item.title,
      animeId: item.mal_id.toString(),
      poster: item.images?.jpg?.image_url,
      episodes: item.episodes ? `${item.episodes}` : '?',
      score: item.score ? item.score.toString() : '?',
      type: item.type,
      releasedOn: item.year ? item.year.toString() : ''
  });

  try {
    const recentRes = await axios.get('https://api.jikan.moe/v4/seasons/now?limit=10');
    console.log(recentRes.data.data.map(mapData)[0]);
  } catch(e) { console.error(e.message); }
}

testFormat();
