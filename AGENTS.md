# Instruksi Pengembangan Ngawonggo Web

## Deployment & Build
- **Wajib bisa deploy virtual.**
- Proyek ini menggunakan Vercel dengan konfigurasi CI=true. Artinya, semua peringatan ESLint (seperti variabel yang tidak digunakan/unused vars) akan dianggap sebagai error dan menggagalkan proses build.
- Selalu periksa dan hapus import atau variabel yang tidak digunakan sebelum melakukan commit/push.
- Gunakan `CI=false npm run build` jika ingin mencoba build lokal tanpa menghentikan proses pada warning, namun pastikan untuk membersihkan kode sebelum deploy ke produksi.

## Kontribusi & Penghargaan
- Tim pengembang utama adalah siswa dari **SMK Muhammadiyah Bandongan, Kelas 10 TJKT A, Tahun 2026**.
- Informasi detail tim pengembang dapat ditemukan di halaman `/credits`.
