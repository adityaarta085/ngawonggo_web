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
export const searchKusonime = (query, page = 1) => apiClient.get(`/anime/kusonime/search/${query}`, { params: { page } });

const api = {
  otakudesu: {
    home: fetchOtakudesuHome,
    detail: fetchOtakudesuDetail,
    episode: fetchOtakudesuEpisode,
    search: searchOtakudesu,
  },
  samehadaku: {
    home: fetchSamehadakuHome,
    detail: fetchSamehadakuDetail,
    episode: fetchSamehadakuEpisode,
    search: searchSamehadaku,
  },
  donghua: {
    home: fetchDonghuaHome,
    detail: fetchDonghuaDetail,
    episode: fetchDonghuaEpisode,
    search: searchDonghua,
  },
  kusonime: {
    latest: fetchKusonimeLatest,
    detail: fetchKusonimeDetail,
    search: searchKusonime,
  }
};

export default api;