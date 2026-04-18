const fs = require('fs');

let privacy = fs.readFileSync('src/views/Legal/PrivacyPolicy.js', 'utf8');
let terms = fs.readFileSync('src/views/Legal/TermsConditions.js', 'utf8');

// Privacy Policy updates
if (!privacy.includes('Informasi Nomor WhatsApp')) {
    const waPrivacy = `
            <Box>
              <Heading as="h2" size="lg" color="gray.800" mb={4}>
                <Flex align="center">
                  <Icon as={FaBullhorn} color="brand.500" mr={3} />
                  8. Integrasi WhatsApp dan Komunikasi
                </Flex>
              </Heading>
              <Text color="gray.600" mb={4}>
                Pengguna memiliki opsi untuk memverifikasi nomor WhatsApp di Portal Desa. Verifikasi ini bersifat sukarela dan bukan syarat utama untuk mengakses layanan. Jika pengguna memilih untuk memverifikasi:
              </Text>
              <UnorderedList spacing={3} color="gray.600" pl={5}>
                <ListItem>
                  <Text as="span" fontWeight="bold">Tujuan Penggunaan:</Text> Nomor WhatsApp akan digunakan oleh admin untuk mengirimkan notifikasi penting, seperti pembaruan status pengaduan/laporan, dan pengumuman layanan desa.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Keamanan Data:</Text> Nomor WhatsApp disimpan dengan aman di database kami (Supabase) dan tidak akan disalahgunakan, dibagikan, atau dijual kepada pihak ketiga di luar kepentingan administratif desa.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Komunikasi Positif:</Text> Kami berhak menggunakan nomor WhatsApp yang terverifikasi untuk tujuan "Positive Communication" (pengumuman resmi) sebagaimana kami mengelola komunikasi melalui email.
                </ListItem>
              </UnorderedList>
            </Box>

            <Divider borderColor="gray.200" />
`;

    const insertPointPrivacy = '<Box>\n              <Heading as="h2" size="lg" color="gray.800" mb={4}>\n                <Flex align="center">\n                  <Icon as={FaAd} color="brand.500" mr={3} />\n                  8. Transparansi Iklan';

    privacy = privacy.replace(insertPointPrivacy, waPrivacy + '\n            <Box>\n              <Heading as="h2" size="lg" color="gray.800" mb={4}>\n                <Flex align="center">\n                  <Icon as={FaAd} color="brand.500" mr={3} />\n                  9. Transparansi Iklan');

    // Also update numbering for subsequent sections if needed
    privacy = privacy.replace('9. Kontak dan Pengaduan', '10. Kontak dan Pengaduan');
    privacy = privacy.replace('10. Pembaruan Kebijakan', '11. Pembaruan Kebijakan');

    fs.writeFileSync('src/views/Legal/PrivacyPolicy.js', privacy);
}

// Terms & Conditions updates
if (!terms.includes('Verifikasi WhatsApp')) {
    const waTerms = `
            <Box>
              <Heading as="h2" size="lg" color="gray.800" mb={4}>
                <Flex align="center">
                  <Icon as={FaBullhorn} color="brand.500" mr={3} />
                  8. Verifikasi WhatsApp dan Komunikasi Admin
                </Flex>
              </Heading>
              <Text color="gray.600" mb={4}>
                Bagi pengguna yang secara sukarela memverifikasi nomor WhatsApp mereka di Portal Desa:
              </Text>
              <UnorderedList spacing={3} color="gray.600" pl={5}>
                <ListItem>
                  Pengguna menyetujui bahwa Admin Desa Ngawonggo dapat mengirimkan pesan WhatsApp yang berisi pembaruan status laporan, informasi layanan, atau pemberitahuan penting lainnya.
                </ListItem>
                <ListItem>
                  Permintaan link verifikasi WhatsApp dibatasi satu kali setiap 3 jam untuk mencegah spamming dan penyalahgunaan gateway komunikasi kami.
                </ListItem>
                <ListItem>
                  Pengguna bertanggung jawab untuk mendaftarkan nomor yang aktif dan sah. Kami tidak bertanggung jawab atas kebocoran informasi yang disebabkan oleh kelalaian pengguna dalam menjaga akses ke akun WhatsApp mereka sendiri.
                </ListItem>
              </UnorderedList>
            </Box>

            <Divider borderColor="gray.200" />
`;
    const insertPointTerms = '<Box>\n              <Heading as="h2" size="lg" color="gray.800" mb={4}>\n                <Flex align="center">\n                  <Icon as={FaAdn} color="brand.500" mr={3} />\n                  8. Sponsor dan Iklan Lokal';

    terms = terms.replace(insertPointTerms, waTerms + '\n            <Box>\n              <Heading as="h2" size="lg" color="gray.800" mb={4}>\n                <Flex align="center">\n                  <Icon as={FaAdn} color="brand.500" mr={3} />\n                  9. Sponsor dan Iklan Lokal');

    terms = terms.replace('9. Batasan Tanggung Jawab', '10. Batasan Tanggung Jawab');
    terms = terms.replace('10. Pembaruan Syarat', '11. Pembaruan Syarat');
    terms = terms.replace('11. Kontak Hukum', '12. Kontak Hukum');

    fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
}
