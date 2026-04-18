const fs = require('fs');

let terms = fs.readFileSync('src/views/Legal/TermsConditions.js', 'utf8');

const termsDeletion = `
            <AccordionItem border="none" bg="white" borderRadius="xl" mb={4} boxShadow="sm">
              <h2>
                <AccordionButton py={4} _hover={{ bg: 'gray.50', borderRadius: 'xl' }}>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    <Flex align="center">
                      <Icon as={FaExclamationTriangle} color="brand.500" mr={3} />
                      Kebijakan Penghapusan Data dan Identitas
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={6} color="gray.600">
                <Text mb={4}>Ketentuan terkait hak untuk dilupakan (Right to be Forgotten) dan manajemen data pengguna:</Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem>Penghapusan data (WhatsApp, Email, atau keseluruhan Akun) bersifat final dan permanen. Permintaan penghapusan memicu prosedur otorisasi terenkripsi ke metode komunikasi yang terdaftar.</ListItem>
                  <ListItem>Apabila kredensial autentikasi utama (WA/Email) tidak dapat diakses, pengguna berkewajiban menghubungi layanan bantuan atau pihak berwenang desa untuk rekonsiliasi manual sebelum penghapusan data dapat dieksekusi.</ListItem>
                  <ListItem>Kami secara otomatis membersihkan sesi komunikasi usang sesuai protokol teknis untuk mempertahankan integritas kinerja basis data (Supabase).</ListItem>
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
`;

if (!terms.includes('Kebijakan Penghapusan Data dan Identitas')) {
    const target = '<AccordionItem border="none" bg="white" borderRadius="xl" mb={4} boxShadow="sm">\n              <h2>\n                <AccordionButton py={4} _hover={{ bg: \'gray.50\', borderRadius: \'xl\' }}>\n                  <Box flex="1" textAlign="left" fontWeight="bold">\n                    <Flex align="center">\n                      <Icon as={FaAdn} color="brand.500" mr={3} />';
    terms = terms.replace(target, termsDeletion + '\n' + target);
    fs.writeFileSync('src/views/Legal/TermsConditions.js', terms);
}
