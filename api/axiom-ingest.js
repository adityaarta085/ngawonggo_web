const AXIOM_TOKEN = process.env.AXIOM_TOKEN;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!AXIOM_TOKEN) {
    console.error("Axiom token is not configured.");
    return res.status(500).json({ error: "Axiom token is not configured." });
  }

  try {
    const payload = req.body;

    // Send to Axiom
    const axiomRes = await fetch("https://us-east-1.aws.edge.axiom.co/v1/datasets/website_requests/ingest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AXIOM_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([payload]),
    });

    if (!axiomRes.ok) {
      console.error("Axiom ingest error:", await axiomRes.text());
      return res.status(500).json({ error: "Failed to ingest to Axiom" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Axiom Ingest API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
