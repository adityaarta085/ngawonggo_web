import axios from 'axios';

const BASE_URL = 'https://sankavollerei.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

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

const samehadaku = {
  home: () => apiClient.get('/anime/samehadaku/home'),
  recent: (page = 1) => apiClient.get('/anime/samehadaku/recent', { params: { page } }),
  search: (q, page = 1) => apiClient.get('/anime/samehadaku/search', { params: { q, page } }),
  ongoing: (page = 1, order = 'popular') => apiClient.get('/anime/samehadaku/ongoing', { params: { page, order } }),
  completed: (page = 1, order = 'latest') => apiClient.get('/anime/samehadaku/completed', { params: { page, order } }),
  popular: (page = 1) => apiClient.get('/anime/samehadaku/popular', { params: { page } }),
  movies: (page = 1, order = 'update') => apiClient.get('/anime/samehadaku/movies', { params: { page, order } }),
  list: () => apiClient.get('/anime/samehadaku/list'),
  schedule: () => apiClient.get('/anime/samehadaku/schedule'),
  genres: () => apiClient.get('/anime/samehadaku/genres'),
  genre: (genreId, page = 1) => apiClient.get(`/anime/samehadaku/genres/${genreId}`, { params: { page } }),
  batchList: (page = 1) => apiClient.get('/anime/samehadaku/batch', { params: { page } }),
  detail: (animeId) => apiClient.get(`/anime/samehadaku/anime/${animeId}`),
  episode: (episodeId) => apiClient.get(`/anime/samehadaku/episode/${episodeId}`),
  batchDetail: (batchId) => apiClient.get(`/anime/samehadaku/batch/${batchId}`),
  server: (serverId) => apiClient.get(`/anime/samehadaku/server/${serverId}`),
};

const api = { samehadaku };

export default api;
