export async function logAnalytics({ source, table, endpoint, type, status, reason }) {
  try {
    const payload = {
      source,
      table,
      endpoint,
      type,
      status,
      timestamp: new Date().toISOString()
    };

    if (reason) {
      payload.reason = reason;
    }

    // Call our serverless function to proxy to Axiom
    // We proxy it to avoid exposing AXIOM_TOKEN in the frontend
    fetch('/api/tools-proxy?action=axiom-ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      // Use keepalive to ensure request completes even if user navigates away
      keepalive: true
    }).catch(e => {
        console.error("Failed to log analytics to proxy", e)
    });
  } catch (error) {
    console.error("Error formatting analytics log", error);
  }
}
