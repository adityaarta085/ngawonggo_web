const dns = require('dns').promises;
const tls = require('tls');
const net = require('net');

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

  if (!action || !target) {
    return res.status(400).json({ error: 'Missing action or target parameter' });
  }

  const hostname = getHostname(target);

  try {
    switch (action) {
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
        // Query RDAP (modern JSON-based Whois)
        const rdapUrl = `https://rdap.org/domain/${hostname}`;
        const rdapRes = await fetch(rdapUrl);
        if (rdapRes.ok) {
          const data = await rdapRes.json();
          // Extract key info for cleaner display
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
