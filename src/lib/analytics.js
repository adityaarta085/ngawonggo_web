import { supabase } from './supabase';

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

    const { error } = await supabase
      .from('analytics_logs')
      .insert([payload]);

    if (error) {
      console.error("Failed to log analytics to Supabase", error);
    }
  } catch (error) {
    console.error("Error formatting analytics log", error);
  }
}
