export const scenarios = {
  "926 M": {
    year: "926 M",
    title: "Era Kerajaan Kuno - Sendang Ngawonggo",
    description: "Kamu tiba di tepi Sendang Ngawonggo. Seorang pertapa sakti sedang bersemedi dan membuka sebelah matanya melihat kedatanganmu dengan benda aneh di tangan.",
    options: [
      { text: "Beri Ponsel (Mabar ML)", result: "Pertapa kecanduan push rank. Ngawonggo menjadi kerajaan esport pertama di dunia.", impact: { wealth: 80, mystic: 10, tech: 50, harmony: -20 }, title: "Ngawonggo Esport Sultanate" },
      { text: "Beri Mie Instan (Micin)", result: "Pertapa terpukau dengan rasa MSG. Ia mengajarkan ilmu kanuragan rasa micin ke seluruh desa.", impact: { wealth: -10, mystic: 90, tech: -10, harmony: 80 }, title: "Sekte Micin Nusantara" },
      { text: "Menyamar Jadi Patung", result: "Kamu diam tak bergerak. 1000 tahun kemudian kamu ditemukan sebagai artefak paling aneh dalam sejarah.", impact: { wealth: 20, mystic: 40, tech: 10, harmony: 50 }, title: "Artefak Mager" },
    ]
  },
  "1945": {
    year: "1945",
    title: "Era Kemerdekaan - Hutan Bambu",
    description: "Kamu mendarat di tengah patroli pejuang kemerdekaan. Mereka menodongkan bambu runcing karena pakaianmu yang aneh.",
    options: [
      { text: "Pekik Merdeka!", result: "Kamu diangkat jadi pemimpin batalyon. Namun kamu ketahuan takut suara mercon.", impact: { wealth: 40, mystic: 20, tech: 30, harmony: 90 }, title: "Pahlawan Kesiangan" },
      { text: "Tunjukkan Wikipedia Proklamasi", result: "Pejuang bingung melihat layar bercahaya. Mereka mengiramu dukun sakti dari masa depan.", impact: { wealth: 10, mystic: 80, tech: 90, harmony: -10 }, title: "Dukun Gadget 1945" },
      { text: "Seduh Kopi Instan", result: "Aroma kopi instan menyatukan semua orang. Penjajah ikut ngopi dan perang dibatalkan.", impact: { wealth: 90, mystic: 10, tech: 20, harmony: 100 }, title: "Duta Perdamaian Kopi" },
    ]
  },
  "2026": {
    year: "2026",
    title: "Masa Kini - SMK Muhammadiyah Bandongan",
    description: "Kamu muncul di ruang lab komputer. Tim pengembang TJKT A 2026 sedang panik karena error build ESLint tidak kunjung selesai.",
    options: [
      { text: "Bersihkan Manual", result: "Kamu menghabiskan 3 bulan memperbaiki setiap titik koma. Build berhasil, tapi kamu lupa cara tidur.", impact: { wealth: 50, mystic: -20, tech: 100, harmony: 40 }, title: "Pahlawan Titik Koma" },
      { text: "Bypass CI=false", result: "Build berhasil! Tapi aplikasinya sering crash. Kamu dicari oleh polisi kualitas kode.", impact: { wealth: -50, mystic: 10, tech: -40, harmony: -60 }, title: "Kriminal CI/CD" },
      { text: "Pura-pura Mati Lampu", result: "Kamu mencabut kabel server. Semua masalah selesai untuk sementara, tapi kamu dimusuhi satu sekolah.", impact: { wealth: -20, mystic: 40, tech: -80, harmony: -90 }, title: "Sang Pemutus Arus" },
    ]
  },
  "3000": {
    year: "3000",
    title: "Masa Depan - Ngawonggo Cyberpunk",
    description: "Mobil terbang berlalu-lalang. Kamu dihentikan oleh polisi robot karena tidak memiliki chip identitas di otakmu.",
    options: [
      { text: "Tunjukkan e-KTP lecek", result: "Robot polisi konslet mencoba memindai plastik lecek. Kamu dianggap virus purba dan dihormati.", impact: { wealth: 100, mystic: 50, tech: 80, harmony: 60 }, title: "Virus Purba VIP" },
      { text: "Tarian Robot Breakdance", result: "Robot mengira itu bahasa komunikasi tingkat tinggi. Kamu diangkat menjadi Gubernur Cyber.", impact: { wealth: 90, mystic: 10, tech: 90, harmony: 80 }, title: "Gubernur Breakdance" },
      { text: "Sogok Baterai AA Bekas", result: "Baterai AA dianggap artefak sumber energi legendaris. Kamu kaya mendadak tapi dikejar kolektor mafia.", impact: { wealth: 100, mystic: -20, tech: -10, harmony: -50 }, title: "Buronan Baterai" },
    ]
  }
};
