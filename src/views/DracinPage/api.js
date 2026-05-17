const BASE_URL = "https://api.sansekai.my.id/api/reelshort";

export const dracinApi = {
  getHomepage: async () => {
    const res = await fetch(`${BASE_URL}/homepage`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getTrending: async () => {
    const res = await fetch(`${BASE_URL}/homepage`); // Assuming trending is also in homepage data based on the API response structure provided. The previous endpoint was trending, let's keep it simple or map it from homepage lists. For now, fallback to homepage. Or we can just use foryou.
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getForYou: async (page = 1) => {
    const res = await fetch(`${BASE_URL}/foryou?page=${page}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/detail?bookId=${id}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getEpisode: async (id, ep) => {
    const res = await fetch(`${BASE_URL}/episode?bookId=${id}&episodeNumber=${ep}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
};
