import { FaNetworkWired, FaQuestionCircle, FaPuzzlePiece, FaCube } from 'react-icons/fa';

export const gamesData = [
  {
    id: 'network',
    title: 'Labirin Jaringan',
    desc: 'Hubungkan semua titik komputer dalam desa untuk menciptakan jaringan internet yang stabil.',
    longDesc: 'Di masa depan (2045), Desa Ngawonggo memerlukan infrastruktur jaringan yang merata. Tugasmu adalah menghubungkan Pusat Data dengan dusun-dusun secara efisien menggunakan kabel fiber optik tanpa kehabisan stok kabel.',
    icon: FaNetworkWired,
    color: 'purple',
    highlight: true,
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
