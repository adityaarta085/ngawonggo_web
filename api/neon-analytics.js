const { Client } = require('pg');

const connectionString = process.env.NEON_DATABASE_URL || process.env.REACT_APP_NEON_DATABASE_URL;

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!connectionString) {
      return res.status(500).json({ error: 'Database URL not configured' });
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();

    if (req.method === 'POST') {
      const { source, table, endpoint, type, status, reason } = req.body;

      const query = `
        INSERT INTO analytics_logs (source, table_name, endpoint, type, status, reason)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [source, table, endpoint, type, status, reason];

      await client.query(query, values);
      return res.status(200).json({ success: true });

    } else if (req.method === 'GET') {
      const { action } = req.query;

      if (action === 'summary') {
          const sourceSummaryRes = await client.query(`
              SELECT source, COUNT(*) as total
              FROM analytics_logs
              WHERE created_at > NOW() - INTERVAL '24 hours'
              GROUP BY source
          `);

          const topTablesRes = await client.query(`
              SELECT table_name as table, COUNT(*) as total
              FROM analytics_logs
              WHERE created_at > NOW() - INTERVAL '24 hours' AND table_name IS NOT NULL
              GROUP BY table_name
              ORDER BY total DESC
              LIMIT 5
          `);

          const topEndpointsRes = await client.query(`
              SELECT endpoint, COUNT(*) as total
              FROM analytics_logs
              WHERE created_at > NOW() - INTERVAL '24 hours' AND endpoint IS NOT NULL
              GROUP BY endpoint
              ORDER BY total DESC
              LIMIT 5
          `);

          const fallbackReasonsRes = await client.query(`
              SELECT reason, COUNT(*) as total
              FROM analytics_logs
              WHERE source = 'supabase_fallback' AND created_at > NOW() - INTERVAL '24 hours' AND reason IS NOT NULL
              GROUP BY reason
              ORDER BY total DESC
              LIMIT 5
          `);

          return res.status(200).json({
              source_summary: sourceSummaryRes.rows.map(row => ({ source: row.source, total: parseInt(row.total) })),
              top_tables: topTablesRes.rows.map(row => ({ table: row.table, total: parseInt(row.total) })),
              top_endpoints: topEndpointsRes.rows.map(row => ({ endpoint: row.endpoint, total: parseInt(row.total) })),
              fallback_reasons: fallbackReasonsRes.rows.map(row => ({ reason: row.reason, total: parseInt(row.total) }))
          });
      }

      return res.status(400).json({ error: 'Unknown action' });
    }

  } catch (error) {
    console.error("Neon DB error:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
};
