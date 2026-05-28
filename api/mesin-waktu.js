const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { year, action } = req.body;

  if (!year) {
    return res.status(400).json({ error: 'Year is required' });
  }

  try {
    const OPENAI_API_KEY = "acv-5ba0703e794843d66034b8eeb4801bdfd402471740e2f44f04ca225b2e465659";
    const client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        baseURL: "https://www.aichixia.xyz/api/v1",
    });

    if (action) {
       // Generate Result
       const prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu yang datang ke Desa Ngawonggo di tahun ${year}. User memilih tindakan: "${action}".

Buatlah hasil dari tindakan tersebut.
Kembalikan respon DALAM FORMAT JSON SEPERTI INI (TANPA MARKDOWN, TANPA TEKS LAIN):
{
  "result": "<deskripsi hasil tindakan yang lucu, absurd, cyberpunk, atau epik>",
  "title": "<julukan singkat dan keren untuk user, maksimal 4 kata>",
  "impact": {
    "wealth": <angka dampak kekayaan dari -100 sampai 100>,
    "mystic": <angka dampak mistis dari -100 sampai 100>,
    "tech": <angka dampak teknologi dari -100 sampai 100>,
    "harmony": <angka dampak keharmonisan dari -100 sampai 100>
  }
}`;

        const response = await client.chat.completions.create({
            model: "gpt-5-mini",
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        });

        let data;
        try {
            data = JSON.parse(response.choices[0].message.content.trim());
        } catch (e) {
            console.error("AI JSON Parse Error:", response.choices[0].message.content);
            throw new Error("Invalid JSON from AI");
        }
        return res.status(200).json(data);
    } else {
        // Generate Scenario
        const prompt = `Anda adalah narator game fiksi ilmiah komedi bahasa Indonesia tentang penjelajah waktu. User baru saja mendarat di Desa Ngawonggo pada tahun ${year}.
Buatlah deskripsi kedatangan yang unik, absurd, atau epik, dan berikan 3 pilihan tindakan yang lucu, tidak masuk akal, atau sangat spesifik.

Kembalikan respon DALAM FORMAT JSON SEPERTI INI (TANPA MARKDOWN, TANPA TEKS LAIN):
{
  "year": "${year}",
  "title": "<Judul Era yang dramatis>",
  "description": "<Deskripsi situasi di mana user mendarat, maksimal 3 kalimat>",
  "options": [
    { "text": "<pilihan tindakan 1>" },
    { "text": "<pilihan tindakan 2>" },
    { "text": "<pilihan tindakan 3>" }
  ]
}`;

        const response = await client.chat.completions.create({
            model: "gpt-5-mini",
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        });

        let data;
        try {
            data = JSON.parse(response.choices[0].message.content.trim());
        } catch (e) {
            console.error("AI JSON Parse Error:", response.choices[0].message.content);
            throw new Error("Invalid JSON from AI");
        }
        return res.status(200).json(data);
    }

  } catch (error) {
    console.error('Mesin Waktu AI Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
};
