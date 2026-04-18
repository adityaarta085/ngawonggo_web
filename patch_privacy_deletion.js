const fs = require('fs');

let privacy = fs.readFileSync('src/views/Legal/PrivacyPolicy.js', 'utf8');

const privacyDeletion = `
            <Box>
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaUserLock} color="brand.500" boxSize={6} />
                <Heading size="md">Penghapusan Data & Manajemen Hak Privasi</Heading>
              </Flex>
              <Text lineHeight="tall" color="gray.700" mb={4}>
                Anda memiliki kendali penuh atas data Anda, termasuk hak untuk menghapus data spesifik atau keseluruhan akun melalui dasbor Portal pengguna:
              </Text>
              <UnorderedList spacing={3} color="gray.700" pl={5}>
                <ListItem>
                  <Text as="span" fontWeight="bold">Prosedur Penghapusan:</Text> Permintaan penghapusan data (seperti nomor WhatsApp atau Akun Utama) memerlukan verifikasi berlapis sesuai metode yang terhubung untuk mencegah penghapusan tanpa otorisasi.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Penghapusan Parsial:</Text> Jika menghapus data WhatsApp, verifikasi akan dikirimkan ke nomor tersebut. Jika nomor sudah tidak aktif, prosedur fallback melalui verifikasi Email tersedia.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Pusat Bantuan Administrasi:</Text> Apabila nomor telepon dan email tidak dapat diakses, permohonan dapat diajukan kepada administrator dengan menghubungi pusat kontak yang tercantum pada navigasi atau bagian bawah situs web. Administrator akan memberikan panduan pemulihan lebih lanjut sesuai prosedur identifikasi identitas.
                </ListItem>
              </UnorderedList>
            </Box>
`;

if (!privacy.includes('Penghapusan Data & Manajemen Hak Privasi')) {
    const splitPoint = '<Box>\n              <Heading as="h1" size="2xl"';
    privacy = privacy.replace('<Box>\n                  <Flex align="center" mb={4} gap={3}>\n                    <Icon as={FaAd}', privacyDeletion + '\n            <Box>\n                  <Flex align="center" mb={4} gap={3}>\n                    <Icon as={FaAd}');
    fs.writeFileSync('src/views/Legal/PrivacyPolicy.js', privacy);
}
