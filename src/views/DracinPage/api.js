const API_KEY = "TRIAL-ANICHIN-2026";
const BASE_URL = "https://miniapp.anichin.bio/reelshort";

export const dracinApi = {
  getHomepage: async () => {
    const res = await fetch(`${BASE_URL}/homepage`, {
      headers: { "X-API-Key": API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getTrending: async () => {
    const res = await fetch(`${BASE_URL}/trending`, {
      headers: { "X-API-Key": API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getForYou: async (page = 1) => {
    const res = await fetch(`${BASE_URL}/foryou?page=${page}`, {
      headers: { "X-API-Key": API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: { "X-API-Key": API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/detail?id=${id}`, {
      headers: { "X-API-Key": API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getEpisode: async (id, ep) => {
    const res = await fetch(`${BASE_URL}/episode?id=${id}&ep=${ep}`, {
      headers: { "X-API-Key": API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
};
