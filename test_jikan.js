const axios = require('axios');

async function getJikanData() {
  try {
    const recentRes = await axios.get('https://api.jikan.moe/v4/seasons/now?limit=10');
    console.log('recent', recentRes.data.data.length);
    const topRes = await axios.get('https://api.jikan.moe/v4/top/anime?limit=10');
    console.log('top10', topRes.data.data.length);
    const movieRes = await axios.get('https://api.jikan.moe/v4/anime?type=movie&order_by=popularity&sort=asc&limit=10');
    console.log('movie', movieRes.data.data.length);
  } catch(e) { console.error(e.message); }
}

getJikanData();
