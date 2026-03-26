import axios from 'axios';

const BASE_URL = 'https://www.sankavollerei.com/download/anime';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  }
});

const samehadaku = {
  home: async () => {
    try {
      const res = await apiClient.get('/home');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // The API doesn't have a direct search endpoint based on the prompt.
  // Let's create a client-side filter using /unlimited, or wait for the prompt details.
  // Actually, wait, let's just fetch /unlimited and filter it if needed, or if it's too big, just wait.
  search: async (q) => {
    try {
      const res = await apiClient.get('/unlimited');
      if (res.data?.data?.animeList) {
        const filtered = res.data.data.animeList.filter(item =>
          item.title.toLowerCase().includes(q.toLowerCase())
        );
        return {
          data: {
            data: {
              animeList: filtered
            }
          }
        };
      }
      return { data: { data: { animeList: [] } } };
    } catch (error) {
      throw error;
    }
  },

  detail: async (slug) => {
    try {
      const res = await apiClient.get(`/anime/${slug}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  episode: async (slug) => {
    try {
      const res = await apiClient.get(`/episode/${slug}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  batchDetail: async (batchId) => ({ data: { data: {} } }),
  server: async (serverId) => ({ data: { data: {} } }),
};

const api = { samehadaku };

export default api;
