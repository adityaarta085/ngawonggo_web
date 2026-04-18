const fs = require('fs');

let terms = fs.readFileSync('src/views/Legal/TermsConditions.js', 'utf8');

if (!terms.includes('WhatsApp')) {
    const waTerms = `
              <Box>
                <Flex align="center" mb={6} gap={3}>
                  <Icon as={FaBullhorn} color="brand.500" boxSize={6} />
                  <Heading size="md">Integrasi WhatsApp dan Komunikasi Admin</Heading>
                </Flex>
                <Text color="gray.700" mb={4} lineHeight="tall">
                  Bagi pengguna yang secara sukarela memverifikasi nomor WhatsApp mereka di Portal Desa:
                </Text>
                <UnorderedList spacing={3} color="gray.700" pl={5}>
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

    const splitPoint = '<Box>\n                <Flex align="center" mb={6} gap={3}>\n                  <Icon as={FaAdn} color="brand.500" boxSize={6} />';

    if (terms.includes(splitPoint)) {
        terms = terms.replace(splitPoint, waTerms + splitPoint);
        fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
    }
}
// Add FaBullhorn if missing
if (!terms.includes('FaBullhorn')) {
    terms = terms.replace('FaAdn } from', 'FaAdn, FaBullhorn } from');
    fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
}
