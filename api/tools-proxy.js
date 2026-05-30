const dns = require('dns').promises;
const tls = require('tls');
const net = require('net');
const { Client } = require('pg');

const neonConnectionString = process.env.NEON_DATABASE_URL || process.env.REACT_APP_NEON_DATABASE_URL;

function getHostname(urlStr) {
  try {
    let clean = urlStr.trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'http://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname;
  } catch (e) {
    return urlStr.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split(':')[0];
  }
}

function checkSsl(hostname) {
  return new Promise((resolve, reject) => {
    try {
      const socket = tls.connect({
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false
      }, () => {
        const cert = socket.getPeerCertificate(true);
        socket.destroy();
        if (!cert || Object.keys(cert).length === 0) {
          reject(new Error("No certificate returned"));
        } else {
          resolve({
            subject: cert.subject,
            issuer: cert.issuer,
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            fingerprint: cert.fingerprint,
            serialNumber: cert.serialNumber,
            bits: cert.bits
          });
        }
      });
      socket.on('error', (err) => {
        reject(err);
      });
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject(new Error("Timeout connecting to SSL port"));
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = async (req, res) => {
  const { action, target } = req.query;

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }
  if (!target && !['analytics', 'neon_analytics_post', 'neon_analytics_summary'].includes(action)) {
    return res.status(400).json({ error: 'Missing action or target parameter' });
  }

  const hostname = target ? getHostname(target) : null;

  try {
    switch (action) {
      case 'neon_analytics_post': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
        if (!neonConnectionString) return res.status(500).json({ error: 'Database URL not configured' });

        const client = new Client({ connectionString: neonConnectionString });
        await client.connect();

        try {
            const { source, table, endpoint, type, status, reason } = req.body;
            const query = `
                INSERT INTO analytics_logs (source, table_name, endpoint, type, status, reason)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            const values = [source, table, endpoint, type, status, reason];
            await client.query(query, values);
            return res.status(200).json({ success: true });
        } finally {
            await client.end();
        }
      }

      case 'neon_analytics_summary': {
        if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
        if (!neonConnectionString) return res.status(500).json({ error: 'Database URL not configured' });

        const client = new Client({ connectionString: neonConnectionString });
        await client.connect();

        try {
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
        } finally {
            await client.end();
        }
      }

      case 'analytics': {
          return res.status(200).json({
              ok: true,
              source_summary: [],
              top_tables: [],
              top_endpoints: [],
              fallback_reasons: [],
              worker_percentage: 0,
              fallback_percentage: 0
            });
      }

      case 'dns': {
        const records = {};
        records.A = await dns.resolve4(hostname).catch(() => []);
        records.AAAA = await dns.resolve6(hostname).catch(() => []);
        records.MX = await dns.resolveMx(hostname).catch(() => []);
        records.TXT = await dns.resolveTxt(hostname).catch(() => []);
        records.NS = await dns.resolveNs(hostname).catch(() => []);
        records.CNAME = await dns.resolveCname(hostname).catch(() => []);
        return res.status(200).json(records);
      }

      case 'ssl': {
        const sslInfo = await checkSsl(hostname);
        return res.status(200).json(sslInfo);
      }

      case 'ping': {
        const start = Date.now();
        const duration = await new Promise((resolve) => {
          const socket = net.createConnection(80, hostname, () => {
            const time = Date.now() - start;
            socket.destroy();
            resolve(time);
          });
          socket.on('error', () => {
            const socket2 = net.createConnection(443, hostname, () => {
              const time = Date.now() - start;
              socket2.destroy();
              resolve(time);
            });
            socket2.on('error', () => resolve(-1));
            socket2.setTimeout(3000, () => {
              socket2.destroy();
              resolve(-1);
            });
          });
          socket.setTimeout(3000, () => {
            socket.destroy();
            resolve(-1);
          });
        });

        if (duration === -1) {
          return res.status(200).json({ status: 'offline', pingMs: null });
        }
        return res.status(200).json({ status: 'online', pingMs: duration });
      }

      case 'whois': {
        const rdapUrl = `https://rdap.org/domain/${hostname}`;
        const rdapRes = await fetch(rdapUrl);
        if (rdapRes.ok) {
          const data = await rdapRes.json();
          const entities = data.entities || [];
          const status = data.status || [];
          const events = data.events || [];
          
          return res.status(200).json({
            domain: data.ldhName,
            status,
            events: events.map(e => ({ action: e.eventAction, date: e.eventDate })),
            registrar: entities.find(ent => ent.roles?.includes('registrar'))?.vcardArray?.[1]?.[1]?.[3] || 'Unknown'
          });
        }
        return res.status(200).json({ error: 'WHOIS information not available or domain does not exist' });
      }

      case 'httpStatus': {
        let cleanUrl = target;
        if (!/^https?:\/\//i.test(cleanUrl)) {
          cleanUrl = 'http://' + cleanUrl;
        }
        const response = await fetch(cleanUrl, { method: 'HEAD', redirect: 'follow' })
          .catch(() => fetch(cleanUrl, { redirect: 'follow' }));
        return res.status(200).json({
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
      }

      case 'redirect': {
        let cleanUrl = target;
        if (!/^https?:\/\//i.test(cleanUrl)) {
          cleanUrl = 'http://' + cleanUrl;
        }
        const chain = [];
        let currentUrl = cleanUrl;
        let limit = 5;
        while (limit-- > 0) {
          chain.push(currentUrl);
          const response = await fetch(currentUrl, { method: 'GET', redirect: 'manual' });
          const loc = response.headers.get('location');
          if (!loc) {
            break;
          }
          currentUrl = new URL(loc, currentUrl).toString();
        }
        return res.status(200).json({ chain });
      }

      case 'speedTest': {
        let cleanUrl = target;
        if (!/^https?:\/\//i.test(cleanUrl)) {
          cleanUrl = 'http://' + cleanUrl;
        }
        const start = Date.now();
        const response = await fetch(cleanUrl);
        const ttfb = Date.now() - start;
        const html = await response.text();
        const loadTime = Date.now() - start;

        return res.status(200).json({
          status: response.status,
          ttfbMs: ttfb,
          loadTimeMs: loadTime,
          pageSizeBytes: Buffer.byteLength(html, 'utf8'),
          paragraphsCount: (html.match(/<p>/g) || []).length,
          imagesCount: (html.match(/<img/g) || []).length,
          linksCount: (html.match(/<a/g) || []).length
        });
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error('Tools API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
