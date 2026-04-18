const fs = require('fs');

let terms = fs.readFileSync('src/views/Legal/TermsConditions.js', 'utf8');

if (!terms.includes('WhatsApp')) {
    const splitPoint = '8. Sponsor dan Iklan Lokal';

    if (terms.includes(splitPoint)) {
        terms = terms.replace('8. Sponsor dan Iklan Lokal', '9. Sponsor dan Iklan Lokal');
        terms = terms.replace('9. Batasan Tanggung Jawab', '10. Batasan Tanggung Jawab');
        terms = terms.replace('10. Pembaruan Syarat', '11. Pembaruan Syarat');
        terms = terms.replace('11. Kontak Hukum', '12. Kontak Hukum');

        // Let's insert the WhatsApp section right before the Sponsor section
        // We will match the start of the AccordionItem for Sponsor
        const target = '<AccordionItem border="none" bg="white" borderRadius="xl" mb={4} boxShadow="sm">\n              <h2>\n                <AccordionButton py={4} _hover={{ bg: \'gray.50\', borderRadius: \'xl\' }}>\n                  <Box flex="1" textAlign="left" fontWeight="bold">\n                    <Flex align="center">\n                      <Icon as={FaAdn} color="brand.500" mr={3} />\n                      9. Sponsor dan Iklan Lokal';

        const replacement = `
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
            ${target}`;

        terms = terms.replace(target, replacement);
        fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
    } else {
        console.log("Could not find Sponsor target");
    }
}
