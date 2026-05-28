import { FaNetworkWired, FaQuestionCircle, FaPuzzlePiece, FaCube, FaGhost, FaRocket, FaShapes, FaHistory } from 'react-icons/fa';

export const gamesData = [
  {
    id: 'mesin-waktu',
    title: 'Mesin Waktu Ngawonggo',
    desc: 'Simulator perjalanan waktu AI interaktif. Ubah masa lalu, hadapi konsekuensinya!',
    longDesc: 'Rasakan sensasi menjadi penjelajah waktu di Desa Ngawonggo. Pilih tahun tujuanmu, berikan instruksi kepada AI, dan lihat Butterfly Effect apa yang akan kamu ciptakan di masa depan.',
    icon: FaHistory,
    color: 'purple',
    highlight: true,
    isPremium: false,
    category: 'Simulasi AI & Narasi',
    difficulty: 'Mudah',
    embedUrl: null,
    howToPlay: [
      'Pilih tahun tujuan (contoh: 1945, 2026, dll) di layar kokpit.',
      'Klik tombol WARP! dan tunggu AI menyiapkan skenario.',
      'Baca skenario dan pilih tindakan yang paling lucu/absurd.',
      'Lihat hasil Butterfly Effect dari pilihanmu!'
    ],
    maxScore: 0,
    isRoute: true,
    routePath: '/game/mesin-waktu'
  },
  {
    id: 'level-devil',
    title: 'Level Devil',
    desc: 'Game platformer penuh kejutan dan jebakan. Latih kesabaran dan refleksmu!',
    longDesc: 'Level Devil adalah game unggulan resmi berlisensi yang menguji kesabaran dan refleksmu. Setiap level penuh dengan jebakan tak terduga. Game ini dilisensikan secara resmi dari Poki.com.',
    icon: FaGhost,
    color: 'red',
    highlight: true,
    isPremium: true,
    category: 'Platformer & Refleks',
    difficulty: 'Sulit',
    embedUrl: 'https://bitlifeonline.github.io/level-devil',
    howToPlay: [
      'Gunakan tombol panah atau kontrol layar untuk bergerak.',
      'Hindari jebakan yang muncul tiba-tiba.',
      'Capai pintu keluar untuk lanjut ke level berikutnya.',
      'Tetap sabar dan jangan menyerah!'
    ],
    maxScore: 0
  },
  {
    id: 'geometry-dash',
    title: 'Geometry Dash',
    desc: 'Lompat dan terbang melewati rintangan berbahaya dalam platformer berbasis ritme ini.',
    longDesc: 'Geometry Dash adalah game platformer ritme legendaris. Siapkan dirimu untuk tantangan yang hampir mustahil. Game unggulan ini dilisensikan secara resmi dari Poki.com.',
    icon: FaShapes,
    color: 'yellow',
    highlight: true,
    isPremium: true,
    category: 'Rhythm & Platformer',
    difficulty: 'Sangat Sulit',
    embedUrl: 'https://labgstore21.github.io/g26/class-453',
    howToPlay: [
      'Klik atau sentuh layar untuk melompat.',
      'Ikuti irama musik untuk melewati rintangan.',
      'Satu kesalahan dan kamu harus mengulang dari awal.',
      'Buktikan kecepatan reaksimu!'
    ],
    maxScore: 0
  },
  {
    id: 'space-waves',
    title: 'Space Waves',
    desc: 'Kendalikan gelombang luar angkasa dan hindari rintangan di jalurmu.',
    longDesc: 'Space Waves adalah game arcade yang menenangkan namun menantang. Arahkan gelombangmu melalui rintangan kosmik. Game unggulan ini dilisensikan secara resmi dari Poki.com.',
    icon: FaRocket,
    color: 'cyan',
    highlight: true,
    isPremium: true,
    category: 'Arcade & Kasual',
    difficulty: 'Menengah',
    embedUrl: 'https://marblerun-3d.github.io/game/spacewave/',
    howToPlay: [
      'Klik atau tahan untuk menggerakkan gelombang ke atas.',
      'Lepaskan untuk membiarkan gelombang turun.',
      'Hindari semua rintangan yang ada di depan.',
      'Raih skor terjauhmu!'
    ],
    maxScore: 0
  },
  {
    id: 'network',
    title: 'Labirin Jaringan',
    desc: 'Hubungkan semua titik komputer dalam desa untuk menciptakan jaringan internet yang stabil.',
    longDesc: 'Di masa depan (2045), Desa Ngawonggo memerlukan infrastruktur jaringan yang merata. Tugasmu adalah menghubungkan Pusat Data dengan dusun-dusun secara efisien menggunakan kabel fiber optik tanpa kehabisan stok kabel.',
    icon: FaNetworkWired,
    color: 'purple',
    highlight: false,
    category: 'Logika & Strategi',
    difficulty: 'Menengah',
    howToPlay: [
      'Mulai dari ikon Server (Pusat Data).',
      'Klik kotak di sebelahnya untuk membentangkan kabel.',
      'Hubungkan kabel ke ikon Rumah (Dusun).',
      'Perhatikan jumlah kabel yang tersisa di bagian atas layar.',
      'Selesaikan dengan jumlah kabel yang diberikan!'
    ],
    maxScore: 100
  },
  {
    id: 'quiz',
    title: 'Kuis Tekno-Sains',
    desc: 'Uji wawasanmu tentang dunia teknologi, sains populer, dan digitalisasi desa.',
    longDesc: 'Untuk menjadi warga digital yang cerdas, kita harus paham mengenai teknologi di sekitar kita. Kuis ini akan menguji pengetahuan umummu mengenai istilah-istilah teknologi, jaringan, dan sains populer.',
    icon: FaQuestionCircle,
    color: 'blue',
    highlight: false,
    category: 'Pengetahuan Umum',
    difficulty: 'Mudah',
    howToPlay: [
      'Baca pertanyaan dengan teliti.',
      'Pilih salah satu dari 4 pilihan jawaban yang menurutmu paling benar.',
      'Klik tombol "Lanjut" untuk pertanyaan berikutnya.',
      'Jawab 5 pertanyaan secara acak untuk menyelesaikan kuis.'
    ],
    maxScore: 5
  },
  {
    id: 'sort',
    title: 'Sortir Digital',
    desc: 'Latih kecepatanmu membedakan antara perangkat teknologi analog dan digital.',
    longDesc: 'Dunia terus berkembang dari era analog ke era digital. Tantangan ini menguji kecepatan refleks dan pengetahuanmu dalam membedakan benda-benda dari kedua era tersebut dalam waktu yang cepat.',
    icon: FaPuzzlePiece,
    color: 'orange',
    highlight: false,
    category: 'Kecepatan & Refleks',
    difficulty: 'Mudah',
    howToPlay: [
      'Sebuah gambar atau teks benda akan muncul di layar.',
      'Tentukan apakah benda tersebut adalah teknologi "Analog" atau "Digital".',
      'Klik tombol yang sesuai dengan cepat.',
      'Kumpulkan poin sebanyak-banyaknya!'
    ],
    maxScore: 8
  },
  {
    id: '3d-object',
    title: 'Geometri 3D Explorer',
    desc: 'Pelajari berbagai bentuk geometri ruang dalam tampilan 3D interaktif yang seru.',
    longDesc: 'Bentuk-bentuk 3D ada di sekeliling kita! Dalam mode pembelajaran ini, kamu bisa memutar, memperbesar, dan mengenali berbagai bangun ruang, lalu menjawab kuis singkat mengenai sifat-sifatnya.',
    icon: FaCube,
    color: 'green',
    highlight: false,
    category: 'Edukasi Visual',
    difficulty: 'Menengah',
    howToPlay: [
      'Perhatikan objek 3D yang tampil di sebelah kiri layar.',
      'Kamu bisa menggeser atau zoom objek tersebut dengan mouse / sentuhan.',
      'Baca pertanyaan di sebelah kanan mengenai objek tersebut.',
      'Pilih jawaban yang benar dan dapatkan fakta menarik!',
    ],
    maxScore: 60
  }
];
