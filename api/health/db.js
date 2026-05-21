const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const start = Date.now();
  const results = { status: "ok", type: "database" };

  try {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('site_settings').select('key').limit(1);

      results.supabase = {
        status: error ? "error" : "ok",
        error: error?.message
      };
      if (error) results.status = "degraded";
    } else {
      results.supabase = { status: "warning", message: "Supabase config missing" };
    }
  } catch (err) {
    results.status = "error";
    results.supabase = { status: "error", error: err.message };
  }

  results.latency = `${Date.now() - start}ms`;
  return res.status(results.status === "error" ? 500 : 200).json(results);
};
