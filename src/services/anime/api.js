import axios from 'axios';

const BASE_URL = 'https://www.sankavollerei.com/anime';

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

  search: async (q) => {
    try {
      const res = await apiClient.get(`/search/${q}`);
      return res;
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
  server: async (serverId) => {
    try {
      const res = await apiClient.get(`/server/${serverId}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};


const api = { samehadaku };

export default api;
