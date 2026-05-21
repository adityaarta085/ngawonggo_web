module.exports = async function handler(req, res) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(204).end();
  }

  // Set CORS headers for actual response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    let prompt;
    let model = "Flux1schnell";

    if (req.method === "GET") {
      prompt = req.query.prompt;
      model = req.query.model || model;
    } else if (req.method === "POST") {
      prompt = req.body.prompt;
      model = req.body.model || model;
    } else {
      return res.status(405).json({
        success: false,
        error: "Method tidak didukung. Pakai GET atau POST.",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt tidak boleh kosong.",
        contoh_get: "?prompt=kucing astronot di bulan",
        contoh_post: {
          prompt: "kucing astronot di bulan",
          model: "Flux1schnell",
        },
      });
    }

    const API_TXT2IMG = "https://ai.alfisy.my.id/api/txt2img";
    const apiResponse = await fetch(API_TXT2IMG, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        success: false,
        error: data?.error || "Gagal request ke API txt2img",
        detail: data,
      });
    }

    return res.status(200).json({
      success: true,
      prompt,
      model,
      imageUrl: data.imageUrl,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
