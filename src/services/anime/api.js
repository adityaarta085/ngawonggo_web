import axios from 'axios';

const BASE_URL = 'https://sankavollerei.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Simple Rate limiter implementation for 50 req/min
let requestCount = 0;
let lastResetTime = Date.now();

apiClient.interceptors.request.use((config) => {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= 50) {
    return Promise.reject(new Error("Rate limit exceeded. Please wait a minute."));
  }

  requestCount++;
  return config;
});

// Otakudesu
export const fetchOtakudesuHome = () => apiClient.get('/anime/home');
export const fetchOtakudesuDetail = (slug) => apiClient.get(`/anime/anime/${slug}`);
export const fetchOtakudesuEpisode = (slug) => apiClient.get(`/anime/episode/${slug}`);
export const searchOtakudesu = (keyword) => apiClient.get(`/anime/search/${keyword}`);

// Samehadaku
export const fetchSamehadakuHome = () => apiClient.get('/anime/samehadaku/home');
export const fetchSamehadakuDetail = (id) => apiClient.get(`/anime/samehadaku/anime/${id}`);
export const fetchSamehadakuEpisode = (id) => apiClient.get(`/anime/samehadaku/episode/${id}`);
export const searchSamehadaku = (q) => apiClient.get(`/anime/samehadaku/search`, { params: { q } });

// Donghua
export const fetchDonghuaHome = (page = 1) => apiClient.get(`/anime/donghua/home/${page}`);
export const fetchDonghuaDetail = (slug) => apiClient.get(`/anime/donghua/detail/${slug}`);
export const fetchDonghuaEpisode = (slug) => apiClient.get(`/anime/donghua/episode/${slug}`);
export const searchDonghua = (keyword, page = 1) => apiClient.get(`/anime/donghua/search/${keyword}/${page}`);

// Kusonime
export const fetchKusonimeLatest = (page = 1) => apiClient.get(`/anime/kusonime/latest`, { params: { page } });
export const fetchKusonimeDetail = (slug) => apiClient.get(`/anime/kusonime/detail/${slug}`);
export const fetchKusonimeEpisode = (slug) => apiClient.get(`/anime/kusonime/detail/${slug}`); // Same as detail usually for kuso
export const searchKusonime = (query, page = 1) => apiClient.get(`/anime/kusonime/search/${query}`, { params: { page } });

// Anoboy
export const fetchAnoboyHome = (page = 1) => apiClient.get(`/anime/anoboy/home`, { params: { page } });
export const fetchAnoboyDetail = (slug) => apiClient.get(`/anime/anoboy/anime/${slug}`);
export const fetchAnoboyEpisode = (slug) => apiClient.get(`/anime/anoboy/episode/${slug}`);
export const searchAnoboy = (keyword) => apiClient.get(`/anime/anoboy/search/${keyword}`);

// Oploverz
export const fetchOploverzHome = (page = 1) => apiClient.get(`/anime/oploverz/home`, { params: { page } });
export const fetchOploverzDetail = (slug) => apiClient.get(`/anime/oploverz/anime/${slug}`);
export const fetchOploverzEpisode = (slug) => apiClient.get(`/anime/oploverz/episode/${slug}`);
export const searchOploverz = (query) => apiClient.get(`/anime/oploverz/search/${query}`);

// Stream
export const fetchStreamLatest = (page = 1) => apiClient.get(`/anime/stream/latest/${page}`);
export const fetchStreamDetail = (slug) => apiClient.get(`/anime/stream/anime/${slug}`);
export const fetchStreamEpisode = (slug) => apiClient.get(`/anime/stream/episode/${slug}`);
export const searchStream = (query) => apiClient.get(`/anime/stream/search/${query}`);

// Animekuindo
export const fetchAnimekuindoHome = () => apiClient.get(`/anime/animekuindo/home`);
export const fetchAnimekuindoDetail = (slug) => apiClient.get(`/anime/animekuindo/detail/${slug}`);
export const fetchAnimekuindoEpisode = (slug) => apiClient.get(`/anime/animekuindo/episode/${slug}`);
export const searchAnimekuindo = (query) => apiClient.get(`/anime/animekuindo/search/${query}`);

// Nimegami
export const fetchNimegamiHome = () => apiClient.get(`/anime/nimegami/home`);
export const fetchNimegamiDetail = (slug) => apiClient.get(`/anime/nimegami/detail/${slug}`);
export const fetchNimegamiEpisode = (slug) => apiClient.get(`/anime/nimegami/detail/${slug}`);
export const searchNimegami = (query) => apiClient.get(`/anime/nimegami/search/${query}`);

// Alqanime
export const fetchAlqanimeHome = () => apiClient.get(`/anime/alqanime/home`);
export const fetchAlqanimeDetail = (slug) => apiClient.get(`/anime/alqanime/detail/${slug}`);
export const fetchAlqanimeEpisode = (slug) => apiClient.get(`/anime/alqanime/detail/${slug}`); // Adjust if there is specific episode endpoint
export const searchAlqanime = (query) => apiClient.get(`/anime/alqanime/search/${query}`);

// Donghub
export const fetchDonghubHome = () => apiClient.get(`/anime/donghub/home`);
export const fetchDonghubDetail = (slug) => apiClient.get(`/anime/donghub/detail/${slug}`);
export const fetchDonghubEpisode = (slug) => apiClient.get(`/anime/donghub/episode/${slug}`);
export const searchDonghub = (query) => apiClient.get(`/anime/donghub/search/${query}`);

// Winbu
export const fetchWinbuHome = () => apiClient.get(`/anime/winbu/home`);
export const fetchWinbuDetail = (id) => apiClient.get(`/anime/winbu/anime/${id}`);
export const fetchWinbuEpisode = (id) => apiClient.get(`/anime/winbu/episode/${id}`);
export const searchWinbu = (q) => apiClient.get(`/anime/winbu/search`, { params: { q } });

// AnimeSail
export const fetchAnimeSailHome = () => apiClient.get(`/anime/animesail/home`);
export const fetchAnimeSailDetail = (slug) => apiClient.get(`/anime/animesail/detail/${slug}`);
export const fetchAnimeSailEpisode = (slug) => apiClient.get(`/anime/animesail/episode/${slug}`);
export const searchAnimeSail = (query) => apiClient.get(`/anime/animesail/search/${query}`);

// Kuramanime
export const fetchKuramanimeHome = () => apiClient.get(`/anime/kura/home`);
export const fetchKuramanimeDetail = (id, slug) => apiClient.get(`/anime/kura/anime/${id}/${slug}`);
export const fetchKuramanimeEpisode = (id, slug, ep) => apiClient.get(`/anime/kura/watch/${id}/${slug}/${ep}`);
export const searchKuramanime = (keyword) => apiClient.get(`/anime/kura/search/${keyword}`);

const api = {
  otakudesu: { home: fetchOtakudesuHome, detail: fetchOtakudesuDetail, episode: fetchOtakudesuEpisode, search: searchOtakudesu },
  samehadaku: { home: fetchSamehadakuHome, detail: fetchSamehadakuDetail, episode: fetchSamehadakuEpisode, search: searchSamehadaku },
  donghua: { home: fetchDonghuaHome, detail: fetchDonghuaDetail, episode: fetchDonghuaEpisode, search: searchDonghua },
  kusonime: { home: fetchKusonimeLatest, detail: fetchKusonimeDetail, episode: fetchKusonimeEpisode, search: searchKusonime },
  anoboy: { home: fetchAnoboyHome, detail: fetchAnoboyDetail, episode: fetchAnoboyEpisode, search: searchAnoboy },
  oploverz: { home: fetchOploverzHome, detail: fetchOploverzDetail, episode: fetchOploverzEpisode, search: searchOploverz },
  stream: { home: fetchStreamLatest, detail: fetchStreamDetail, episode: fetchStreamEpisode, search: searchStream },
  animekuindo: { home: fetchAnimekuindoHome, detail: fetchAnimekuindoDetail, episode: fetchAnimekuindoEpisode, search: searchAnimekuindo },
  nimegami: { home: fetchNimegamiHome, detail: fetchNimegamiDetail, episode: fetchNimegamiEpisode, search: searchNimegami },
  alqanime: { home: fetchAlqanimeHome, detail: fetchAlqanimeDetail, episode: fetchAlqanimeEpisode, search: searchAlqanime },
  donghub: { home: fetchDonghubHome, detail: fetchDonghubDetail, episode: fetchDonghubEpisode, search: searchDonghub },
  winbu: { home: fetchWinbuHome, detail: fetchWinbuDetail, episode: fetchWinbuEpisode, search: searchWinbu },
  animesail: { home: fetchAnimeSailHome, detail: fetchAnimeSailDetail, episode: fetchAnimeSailEpisode, search: searchAnimeSail },
  kuramanime: { home: fetchKuramanimeHome, detail: fetchKuramanimeDetail, episode: fetchKuramanimeEpisode, search: searchKuramanime },
};

export default api;

// Dramabox
export const fetchDramaboxLatest = () => apiClient.get(`/anime/dramabox/latest`);
export const fetchDramaboxDetail = (bookId) => apiClient.get(`/anime/dramabox/detail`, { params: { bookId } });
export const fetchDramaboxEpisode = (bookId, episode) => apiClient.get(`/anime/dramabox/stream`, { params: { bookId, episode } });
export const searchDramabox = (q) => apiClient.get(`/anime/dramabox/search`, { params: { q } });

// Drachin
export const fetchDrachinHome = () => apiClient.get(`/anime/drachin/home`);
export const fetchDrachinDetail = (slug) => apiClient.get(`/anime/drachin/detail/${slug}`);
export const fetchDrachinEpisode = (slug, index) => apiClient.get(`/anime/drachin/episode/${slug}`, { params: { index } });
export const searchDrachin = (query) => apiClient.get(`/anime/drachin/search/${query}`);

// Nekopoi
export const fetchNekoLatest = () => apiClient.get(`/anime/neko/latest`);
export const searchNeko = (query) => apiClient.get(`/anime/neko/search/${query}`);

api.dramabox = { home: fetchDramaboxLatest, detail: fetchDramaboxDetail, episode: fetchDramaboxEpisode, search: searchDramabox };
api.drachin = { home: fetchDrachinHome, detail: fetchDrachinDetail, episode: fetchDrachinEpisode, search: searchDrachin };
api.nekopoi = { home: fetchNekoLatest, search: searchNeko };
