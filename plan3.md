1. Verify Supabase `site_settings`
   - Using the tool `supabase_execute_sql` execute query `SELECT * FROM site_settings WHERE key IN ('openai_api_key', 'default_ai_prompt');` to verify the execution of `update_ai_settings`.
2. Commit logic and changes.
   - Run `pre_commit_instructions`
   - Commit via `submit`
