export async function logAnalytics({ source, table, endpoint, type, status, reason }) {
  try {
    const payload = {
      source,
      table,
      endpoint,
      type,
      status,
      reason
    };

    const response = await fetch('/api/neon-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Failed to log analytics to Neon DB", await response.text());
    }
  } catch (error) {
    console.error("Error formatting analytics log", error);
  }
}
