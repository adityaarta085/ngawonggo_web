1. **Update UI KreativitasPage - Loader & 9:16 Aspect Ratio:**
   - Update `src/views/KreativitasPage/index.js` untuk mengganti `<Spinner>` default Chakra UI dengan kustom CSS loader sesuai spesifikasi yang diberikan user.
   - Ubah aspect ratio gambar menjadi `9:16` di tampilan UI result.

2. **Update UI KreativitasPage - Sembunyikan Link Asli:**
   - Hapus tombol "Buka Gambar Full" yang mengarah ke URL asli gambar API. URL gambar akan disembunyikan/dihandle dari komponen untuk alasan keamanan/bocor link.
   - Update layout page agar jika VIP ada fitur history dan privasi, jika free hanya bisa lihat.

3. **Supabase Database Setup for AI Generated Images:**
   - Buat file SQL migration (`create_ai_images.sql`) yang berisi:
     - Pembuatan table `ai_images` (id, user_id, prompt, image_url, is_private, created_at, likes, dislikes).
     - Pembuatan table `ai_image_interactions` (id, user_id, image_id, interaction_type) seperti logic `community_media`.
     - Pembuatan table `ai_image_comments` (id, user_id, user_name, image_id, comment_text, created_at).
   - Execute file sql tersebut untuk mengaplikasikan skema baru ke Supabase database.

4. **KreativitasPage Logic & Route Updates (`/kreativitas/create/:id` & `/kreativitas/publik/:id` & `/kreativitas/history`):**
   - Refactor `KreativitasPage/index.js` menjadi root component yang mem-parsing sub-routes (atau gunakan React Router nested routing).
   - Saat proses generate gambar selesai, simpan meta data (prompt, url, is_private, user_id) ke table `ai_images` di Supabase. Gunakan proxy/upload helper jika diperlukan, namun karena ini Text2Img, URL-nya bisa di fetch, lalu file-nya disave menggunakan public URL / di-upload ke CDN free jika perlu (seperti `c.termai.cc`). Supaya aman, gambar dari API `https://api-faa.my.id/faa/ai-text2img-pro?prompt=` diupload otomatis ke `c.termai.cc` (menggunakan logic yang sama dengan `CommunityFeed`).
   - Redirect / ganti view ke route spesifik berdasarkan tipe privasi.

5. **VIP Privilege Implementation:**
   - Ambil level tier user dari tabel `user_tiers`.
   - Toggle "Private Mode" hanya bisa di klik oleh VIP. User Free akan diset otomatis `is_private = false`.
   - History page (`/kreativitas/histori`) di-lock hanya untuk VIP.

6. **Pre-commit Checks:**
   - Call `pre_commit_instructions` and follow steps.
