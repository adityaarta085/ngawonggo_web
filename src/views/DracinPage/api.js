const BASE_URL = "https://dracin-weld.vercel.app/goodshort";

export const dracinApi = {
  getTrending: async () => {
    const res = await fetch(`${BASE_URL}/home?channel=id`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return { collections: json.result.items || json.result.data || [] };
  },
  getForYou: async (page = 1) => {
    const res = await fetch(`${BASE_URL}/home?channel=id&page=${page}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return { collections: json.result.items || json.result.data || [] };
  },
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return { results: json.result.items || json.result.data || [] };
  },
  getDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/detail?id=${id}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json.result.data || json.result;
  },
  getEpisode: async (id, ep) => {
    const res = await fetch(`${BASE_URL}/stream_fast?id=${id}&ep=${ep}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();

    let url = json.result.url || json.result.video_url || json.result.videoUrl || json.result;

    // Convert relative proxy URLs to absolute ones
    if (typeof url === 'string' && url.startsWith('/goodshort/playlist')) {
        url = `https://dracin-weld.vercel.app${url}`;
    }

    return { videoUrl: url };
  }
};
