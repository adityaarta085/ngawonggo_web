const AXIOM_TOKEN = process.env.AXIOM_TOKEN;

async function queryAxiom(apl) {
  const res = await fetch("https://us-east-1.aws.edge.axiom.co/v1/query?format=tabular", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AXIOM_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apl }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

module.exports = async (req, res) => {
  // Ensure the request comes from an authorized source or admin.
  // In a real application, you'd verify JWT or session here.
  // We're omitting strict auth verification per the prompt if not available,
  // but it's typically required.

  if (!AXIOM_TOKEN) {
    return res.status(500).json({ ok: false, error: "Axiom token is not configured." });
  }

  try {
    const aplSummary = "['website_requests'] | where ['_time'] > ago(24h) | summarize total=count() by source";
    const aplTables = "['website_requests'] | where ['_time'] > ago(24h) | summarize total=count() by table | sort by total desc";
    const aplEndpoints = "['website_requests'] | where ['_time'] > ago(24h) | summarize total=count() by endpoint | sort by total desc";
    const aplFallback = "['website_requests'] | where ['_time'] > ago(24h) | where source == 'supabase_fallback' | summarize total=count() by reason | sort by total desc";

    const [summaryRes, tablesRes, endpointsRes, fallbackRes] = await Promise.all([
      queryAxiom(aplSummary),
      queryAxiom(aplTables),
      queryAxiom(aplEndpoints),
      queryAxiom(aplFallback),
    ]);

    // Calculate percentages
    let workerTotal = 0;
    let fallbackTotal = 0;
    let otherTotal = 0;

    const sourceSummary = summaryRes.tables?.[0]?.rows?.map(row => {
      return {
        source: row[0],
        total: row[1]
      }
    }) || [];

    sourceSummary.forEach(item => {
      if (item.source === 'worker') workerTotal += item.total;
      else if (item.source === 'supabase_fallback') fallbackTotal += item.total;
      else otherTotal += item.total;
    });

    const totalRequests = workerTotal + fallbackTotal + otherTotal;

    const workerPercentage = totalRequests > 0 ? (workerTotal / totalRequests) * 100 : 0;
    const fallbackPercentage = totalRequests > 0 ? (fallbackTotal / totalRequests) * 100 : 0;

    res.status(200).json({
      ok: true,
      source_summary: sourceSummary,
      top_tables: tablesRes.tables?.[0]?.rows?.map(row => ({ table: row[0], total: row[1] })) || [],
      top_endpoints: endpointsRes.tables?.[0]?.rows?.map(row => ({ endpoint: row[0], total: row[1] })) || [],
      fallback_reasons: fallbackRes.tables?.[0]?.rows?.map(row => ({ reason: row[0], total: row[1] })) || [],
      worker_percentage: parseFloat(workerPercentage.toFixed(2)),
      fallback_percentage: parseFloat(fallbackPercentage.toFixed(2))
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
