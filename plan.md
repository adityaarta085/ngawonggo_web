1. **Chatbot Perbaikan Besar:**
   - **Wajib Login:** Tambahkan proteksi login di `src/components/Chatbot.js`. Jika belum login, tampilkan pesan error atau blok interaksi.
   - **Limitasi:** Buat tabel `ai_chat_usage` di Supabase untuk mencatat jumlah request per user per hari. Limit = 5 untuk user biasa (Free), 50 untuk user VIP.
   - **Integrasi OpenAI & API Baru:** Ganti axios post ke groq di `api/chat.js` menggunakan OpenAI SDK (`openai` module). Set baseURL ke `https://www.aichixia.xyz/api/v1`, model ke `gpt-5-mini`. Masukkan API Key ke `site_settings` di Supabase. Hapus setting model dan customPrompt Groq sebelumnya.
   - **System Prompt:** Perbarui `default_ai_prompt` di `site_settings` dengan prompt baru yang disertakan (termasuk watermark `---\n*Jawaban ini dihasilkan oleh AI (Asisten AI DESA)...`).
   - **UI Update:** Ubah teks di UI chatbot yang menyebutkan "Groq" menjadi "GPT 5.5 NEW".

2. **Fitur Baru "Kreativitas Tanpa Batas" (Text-to-Image):**
   - **Halaman Baru (`/kreativitas`):** Buat view baru `src/views/KreativitasPage/index.js` untuk fitur Text-to-Image. Halaman harus "mewah", bisa menampilkan prompt generator (termasuk prompt "Naruto Uzumaki"), dan form untuk menghasilkan gambar menggunakan endpoint API `https://api-faa.my.id/faa/ai-text2img-pro?prompt=`. Tampilkan loading state yang keren.
   - **Landing Page Integration:** Tambahkan seksi/banner Text-to-Image di `LandingPage` atau di dalam `QuickLinks`.
   - **Image Upload:** Masukkan gambar desain `sideimage.webp` (dari attachment) ke tempat yang sesuai di fitur Kreativitas.
   - **Watermark Teks Kecil:** Tambahkan teks kecil tersembunyi "(hanya sementara ini free)".

3. **Supabase Migration:**
   - Buat file SQL migration untuk menambahkan table `ai_chat_usage`, serta meng-update/insert row di `site_settings` untuk setting OpenAI.

4. **Pre-commit Checks:**
   - Call `pre_commit_instructions` and follow steps.
