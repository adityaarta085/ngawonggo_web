import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Jikan API rate limit is 3 requests per second and 60 requests per minute
let requestCount = 0;
let lastResetTime = Date.now();

apiClient.interceptors.request.use(async (config) => {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= 55) {
      // Delay to respect rate limit
      await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Quick throttle for 3 req/sec
  await new Promise(resolve => setTimeout(resolve, 350));

  requestCount++;
  return config;
});

const mapAnime = (item) => ({
    title: item.title,
    animeId: item.mal_id.toString(),
    poster: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '',
    episodes: item.episodes ? `${item.episodes}` : '?',
    score: item.score ? item.score.toString() : '?',
    type: item.type,
    releasedOn: item.year ? item.year.toString() : (item.aired?.prop?.from?.year ? item.aired.prop.from.year.toString() : '')
});

const samehadaku = {
  home: async () => {
      try {
          // Parallel requests to get home data
          const [recentRes, top10Res, movieRes] = await Promise.all([
              apiClient.get('/seasons/now?limit=10'),
              apiClient.get('/top/anime?limit=10'),
              apiClient.get('/anime?type=movie&order_by=popularity&sort=asc&limit=10')
          ]);

          return {
              data: {
                  data: {
                      recent: { animeList: recentRes.data.data.map(mapAnime) },
                      top10: { animeList: top10Res.data.data.map(mapAnime) },
                      movie: { animeList: movieRes.data.data.map(mapAnime) }
                  }
              }
          };
      } catch (error) {
          throw error;
      }
  },
  search: async (q, page = 1) => {
      try {
          const res = await apiClient.get(`/anime?q=${encodeURIComponent(q)}&page=${page}&sfw=true`);
          return {
              data: {
                  data: {
                      animeList: res.data.data.map(mapAnime)
                  }
              }
          };
      } catch (error) {
          throw error;
      }
  },
  detail: async (animeId) => {
      try {
          const res = await apiClient.get(`/anime/${animeId}/full`);
          const data = res.data.data;

          return {
              data: {
                  data: {
                      title: data.title,
                      japanese: data.title_japanese,
                      english: data.title_english,
                      poster: data.images?.jpg?.large_image_url || data.images?.jpg?.image_url || '',
                      score: { value: data.score, users: data.scored_by },
                      status: data.status,
                      type: data.type,
                      duration: data.duration,
                      aired: data.aired?.string,
                      genreList: data.genres.map(g => ({ title: g.name })),
                      synopsis: { paragraphs: data.synopsis ? data.synopsis.split('\n').filter(p => p.trim() !== '') : [] },
                      studios: data.studios?.map(s => s.name).join(', '),
                      producers: data.producers?.map(p => p.name).join(', '),
                      season: data.season ? `${data.season.charAt(0).toUpperCase() + data.season.slice(1)} ${data.year}` : '',
                      source: data.source,

                      // Fake episode list since jikan doesn't provide streams
                      episodeList: Array.from({ length: data.episodes || 0 }, (_, i) => ({
                          title: `Episode ${i + 1}`,
                          episodeId: `${animeId}-ep-${i + 1}`,
                          releasedOn: data.status === 'Finished Airing' ? 'Tersedia' : 'Cek Ketersediaan'
                      })).reverse(),
                      batchList: []
                  }
              }
          }
      } catch (error) {
          throw error;
      }
  },
  // Dummy endpoints for features not supported by Jikan but required by components
  episode: async (episodeId) => ({ data: { data: { title: "Streaming Tidak Tersedia", iframe: "", servers: [] } } }),
  batchDetail: async (batchId) => ({ data: { data: {} } }),
  server: async (serverId) => ({ data: { data: {} } }),
};

const api = { samehadaku };

export default api;
