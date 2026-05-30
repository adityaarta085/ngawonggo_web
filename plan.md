1. **Update `src/lib/dataFetcher.js`**
   - Ensure it correctly imports `supabase`.
   - Contains functions `getList`, `getById`, `getByColumn` implemented according to requirements (D1-first, retry 3x, fallback to Supabase).
   - Ensure it explicitly ignores reading from `admins`, `page_views`, `sync_changes` on the frontend side.

2. **Refactor Read Operations across the codebase**
   - We need to search through all the places where `supabase.from(<table_name>).select(...)` is called outside the `AdminPage` folder.
   - For lists, use `getList`.
   - For single entries by ID, use `getById`.
   - For single entries by other columns, use `getByColumn`.
   - Ensure we are not breaking anything by updating the syntax. The fetched `data` will be available in the `result.data`. We may need to adapt `where` and `limit` clauses where applicable by utilizing `getList` options (`limit`, `offset`, `orderBy`, `order`) and manually filtering other criteria or updating the backend for complex filters if not supported (although mostly straightforward selects).

3. **Verify replacements**
   - Make sure no direct Supabase read operations are left in the main frontend codebase (except admin, create/update/delete operations, and complex queries if the worker does not support them natively, but based on the task description, most simple reads are supported). Note: Worker supports `limit`, `offset`, `orderBy`, `order`. For `in`, `eq` and other operators that aren't primary keys/columns, we might need to filter data locally if the worker returns a full list, or use the `getByColumn` for single items. Wait, the instructions say:
   `GET /api/{table}/by/{column}/{value}`
   This returns detail.
   What if it's `eq` but returns multiple? E.g., `eq('user_id', id)`. If the worker doesn't support list by column, we must be careful. Wait, the instructions say:
   "Untuk tabel yang primary key-nya bukan id, Worker sudah menangani otomatis:
   chatsCS -> chat_id
   site_settings -> key
   user_currencies -> user_id
   user_gacha_stats -> user_id
   user_gamification -> user_id
   user_profile_customizations -> user_id
   user_tiers -> user_id"
   So `getById` will work for `user_id` on these tables.
   What about `eq('category', cat)` or `.in('key', keys)`?
   The instruction says: "Semua fitur baca data... prioritas trafik baca: 99%+ request baca -> Cloudflare Worker / D1. Supabase hanya boleh dipakai sebagai fallback".
   If there are queries like `.in('key', keys)`, we can fetch all and filter, or fetch one by one, or just keep it as is if it's complex? Wait, the task says:
   "Implementasikan sistem D1-first, Supabase-fallback untuk *semua fitur baca data* di website saya."
   Let's see what is requested exactly. I will write a script to automatically patch the frontend files using an Abstract Syntax Tree or regex replacements, or manually patch the most important ones.

4. **Detailed Refactoring Plan:**
   - I will search for all `.select()` calls.
   - I will write a Node.js script to refactor the straightforward ones using `dataFetcher`.
   - I will manually refactor the rest.

5. **Pre-commit Checks**
   - Run linter/type check (if any).
   - Ensure the app builds.
