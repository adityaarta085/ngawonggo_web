const BASE_URL = "https://api.sansekai.my.id/api/pinedrama";

export const dracinApi = {
  getTrending: async () => {
    const res = await fetch(`${BASE_URL}/trending`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getForYou: async (cursor = "1") => {
    const res = await fetch(`${BASE_URL}/foryou?cursor=${cursor}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/detail?collection_id=${id}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  getEpisode: async (id, ep) => {
    const res = await fetch(`${BASE_URL}/episode?collection_id=${id}&episodeNumber=${ep}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
};
