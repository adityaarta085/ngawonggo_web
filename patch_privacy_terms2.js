const fs = require('fs');

let privacy = fs.readFileSync('src/views/Legal/PrivacyPolicy.js', 'utf8');
let terms = fs.readFileSync('src/views/Legal/TermsConditions.js', 'utf8');

// The replacement in previous step probably failed because of slight differences in string match.
// Let's use simpler index logic

if (!privacy.includes('Integrasi WhatsApp')) {
    const waPrivacy = `
            <Box>
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaBullhorn} color="brand.500" boxSize={6} />
                <Heading size="md">Integrasi WhatsApp dan Komunikasi</Heading>
              </Flex>
              <Text lineHeight="tall" color="gray.700" mb={4}>
                Pengguna memiliki opsi untuk memverifikasi nomor WhatsApp di Portal Desa. Verifikasi ini bersifat sukarela dan bukan syarat utama untuk mengakses layanan. Jika pengguna memilih untuk memverifikasi:
              </Text>
              <UnorderedList spacing={3} color="gray.700" pl={5}>
                <ListItem>
                  <Text as="span" fontWeight="bold">Tujuan Penggunaan:</Text> Nomor WhatsApp akan digunakan oleh admin untuk mengirimkan notifikasi penting, seperti pembaruan status pengaduan/laporan, dan pengumuman layanan desa.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Keamanan Data:</Text> Nomor WhatsApp disimpan dengan aman di database kami dan tidak akan disalahgunakan, dibagikan, atau dijual kepada pihak ketiga di luar kepentingan administratif desa.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Komunikasi Positif:</Text> Kami berhak menggunakan nomor WhatsApp yang terverifikasi untuk tujuan "Positive Communication" (pengumuman resmi) sebagaimana kami mengelola komunikasi melalui email.
                </ListItem>
              </UnorderedList>
            </Box>

`;
    // Find where to insert in privacy policy
    const splitPoint = '<Box>\n                  <Flex align="center" mb={4} gap={3}>\n                    <Icon as={FaAd} color="brand.500" boxSize={6} />';
    if(privacy.includes(splitPoint)) {
        privacy = privacy.replace(splitPoint, waPrivacy + splitPoint);
        fs.writeFileSync('src/views/Legal/PrivacyPolicy.js', privacy);
    }
}

if (!terms.includes('Verifikasi WhatsApp')) {
    const waTerms = `
            <AccordionItem border="none" bg="white" borderRadius="xl" mb={4} boxShadow="sm">
              <h2>
                <AccordionButton py={4} _hover={{ bg: 'gray.50', borderRadius: 'xl' }}>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    <Flex align="center">
                      <Icon as={FaBullhorn} color="brand.500" mr={3} />
                      8. Verifikasi WhatsApp dan Komunikasi
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={6} color="gray.600">
                <Text mb={4}>Bagi pengguna yang secara sukarela memverifikasi nomor WhatsApp mereka di Portal Desa:</Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem>Pengguna menyetujui bahwa Admin Desa Ngawonggo dapat mengirimkan pesan WhatsApp yang berisi pembaruan status laporan, informasi layanan, atau pemberitahuan penting lainnya.</ListItem>
                  <ListItem>Permintaan link verifikasi WhatsApp dibatasi satu kali setiap 3 jam untuk mencegah spamming dan penyalahgunaan gateway komunikasi kami.</ListItem>
                  <ListItem>Pengguna bertanggung jawab untuk mendaftarkan nomor yang aktif dan sah. Kami tidak bertanggung jawab atas kebocoran informasi yang disebabkan oleh kelalaian pengguna dalam menjaga akses ke akun WhatsApp mereka sendiri.</ListItem>
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
`;
    const splitPointTerms = '<AccordionItem border="none" bg="white" borderRadius="xl" mb={4} boxShadow="sm">\n              <h2>\n                <AccordionButton py={4} _hover={{ bg: \'gray.50\', borderRadius: \'xl\' }}>\n                  <Box flex="1" textAlign="left" fontWeight="bold">\n                    <Flex align="center">\n                      <Icon as={FaAdn} color="brand.500" mr={3} />';

    if(terms.includes(splitPointTerms)) {
        terms = terms.replace(splitPointTerms, waTerms + splitPointTerms);
        // Fix numbering
        terms = terms.replace('8. Sponsor dan Iklan Lokal', '9. Sponsor dan Iklan Lokal');
        terms = terms.replace('9. Batasan Tanggung Jawab', '10. Batasan Tanggung Jawab');
        terms = terms.replace('10. Pembaruan Syarat', '11. Pembaruan Syarat');
        terms = terms.replace('11. Kontak Hukum', '12. Kontak Hukum');

        fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
    }
}
