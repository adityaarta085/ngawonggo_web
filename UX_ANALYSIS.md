# Struktur Navbar (Hasil Akhir)

- **Beranda** ( `/` )
- **Profil Desa**
  - Sejarah Desa ( `/profil#sejarah` )
  - Visi & Misi ( `/profil#visimisi` )
  - Wilayah Administratif ( `/profil#wilayah` )
  - Informasi Dusun ( `/dusun/:slug` )
- **Pemerintahan**
  - Perangkat Desa ( `/pemerintahan` )
  - Transparansi Dana ( `/transparansi` )
- **Layanan**
  - Layanan Masyarakat ( `/layanan` )
  - Kontak & Pengaduan ( `/kontak` )
- **Jelajahi** (Dropdown / Mega Menu)
  - Berita Terkini ( `/news` )
  - Media Desa & Radio ( `/media` )
  - Al-Quran Digital ( `/quran` )
  - Edu Game ( `/game/*` )
  - Hiburan: Anime ( `/anime` )

*(Menu Ekstra di Pojok Kanan Navbar)*
- **Portal Warga / Login** (Button Icon Khusus menuju `/portal` atau `/auth`)

*(Menu yang Dipindahkan ke Footer)*
- Kebijakan Privasi ( `/privacy-policy` )
- Syarat & Ketentuan ( `/terms-conditions` )
- Kredit ( `/credits` )

---

# Penjelasan (Alasan Perubahan)

1. **Penggabungan "Pemerintahan" dan "Transparansi"**:
   Secara logika, transparansi dana desa adalah produk dari pemerintahan yang baik. Menyatukan keduanya dalam satu payung (dropdown) "Pemerintahan" akan mengurangi jumlah item di navbar utama, sehingga navigasi terlihat lebih rapi.

2. **Konsolidasi Fitur Hiburan ke dalam "Jelajahi"**:
   Saat ini, Navbar terlalu penuh dengan menu seperti Media, Anime, Quran, dan Game. Jika dideretkan di luar, *cognitive load* pengguna akan sangat tinggi dan kehilangan fokus pada menu utama desa. Menggabungkannya di bawah menu "Jelajahi" mengkategorikan semuanya sebagai fitur tambahan/eksplorasi yang bisa dinikmati warga dan pengunjung.

3. **Integrasi "Dusun" ke dalam "Profil Desa"**:
   Informasi mengenai berbagai dusun di desa pada hakikatnya merupakan bagian dari wilayah desa itu sendiri. Menjadikannya sub-menu dari Profil membuat penemuan informasinya lebih relevan.

4. **Pemisahan Halaman Administratif & Legal**:
   Halaman seperti `/privacy-policy`, `/terms-conditions`, dan `/credits` jarang diakses langsung sebagai navigasi utama. Standar UX terbaik adalah meletakkannya di *Footer*. Sementara untuk `/auth`, `/portal`, `/admin`, cukup disajikan sebagai satu tombol "Akun/Masuk" agar desain bersih. Rute sistem seperti `/down` dan `/blocked` tentu tidak masuk ke menu mana pun.

---

# Saran Tambahan (Peningkatan UX)

- **Desain Mega Menu untuk "Jelajahi"**: Mengingat isi dari "Jelajahi" sangat beragam (Berita, Anime, Quran, Game), pertimbangkan menggunakan desain Mega Menu yang lebar saat *hover*. Di dalamnya, berikan icon-icon menarik untuk tiap halamannya agar lebih visual dan mudah dikenali dengan cepat (misal icon Game untuk Edu Game, icon Buku untuk Quran).
- **Batasan Item Navbar Utama**: Dengan struktur di atas, item navbar utama (Top-level) hanya menjadi **5 item** (Beranda, Profil, Pemerintahan, Layanan, Jelajahi). Ini sangat ideal karena standar hukum Miller dalam UX menyarankan maksimal 5-7 item agar mudah diingat dan dipindai secara visual.
- **Konsistensi Label**: Mengubah nama "Kontak" menjadi "Kontak & Pengaduan" memberi tahu pengguna dengan lebih jelas bahwa di sana mereka tidak hanya melihat nomor telepon desa, tapi juga bisa mengirimkan aduan mereka.
