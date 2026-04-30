const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/PemerintahanPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Imports
content = content.replace(
    "import { SEO } from '../../components';",
    "import { SEO } from '../../components';\nimport { useMonetization } from '../../contexts/MonetizationContext';\nimport PaywallModal from '../../components/Monetization/PaywallModal';\nimport { FaFilePdf, FaLock, FaChartLine } from 'react-icons/fa';\nimport { Button } from '@chakra-ui/react';"
);

// Hooks
content = content.replace(
    'const [loading, setLoading] = useState(!previewData);',
    `const [loading, setLoading] = useState(!previewData);
  const { isSubscription, isVIP } = useMonetization();
  const [documents, setDocuments] = useState([]);
  const [showPaywall, setShowPaywall] = useState(false);`
);

// Fetching Logic
const fetchSearch = `          });
          setData(newData);
        }`;
const fetchReplace = `          });
          setData(newData);
        }

        // Fetch docs
        const { data: docs } = await supabase.from('premium_documents').select('*');
        if(docs) setDocuments(docs);`;

content = content.replace(fetchSearch, fetchReplace);

// Rendering Logic
const renderSearch = `</SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}`;

const renderReplace = `</SimpleGrid>

          {/* Dokumen Premium Section */}
          <Box pt={10}>
             <HStack spacing={4} align="center" mb={6}>
                <Icon as={FaChartLine} w={6} h={6} color="brand.500" />
                <Heading size="lg">Dokumen & Analitik Data</Heading>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {documents.length > 0 ? documents.map(doc => (
                      <Box key={doc.id} p={6} borderRadius="xl" bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm" position="relative">
                          {doc.is_early_access && (
                              <Badge colorScheme="purple" position="absolute" top={-3} right={4} fontSize="xs">VIP EARLY ACCESS</Badge>
                          )}
                          <HStack mb={3}>
                              <Icon as={FaFilePdf} color="red.500" boxSize={6} />
                              <Heading size="sm" isTruncated>{doc.title}</Heading>
                          </HStack>
                          <Text fontSize="sm" color="gray.500" mb={6} noOfLines={2}>{doc.description}</Text>

                          {(isSubscription || isVIP) ? (
                               <Button w="full" colorScheme="brand" variant="outline" onClick={() => window.open(doc.file_url)}>Download Data</Button>
                          ) : (
                               <Button w="full" colorScheme="gray" leftIcon={<FaLock />} onClick={() => setShowPaywall(true)}>Akses Premium</Button>
                          )}
                      </Box>
                  )) : (
                      <Text color="gray.500">Belum ada dokumen publikasi terbaru.</Text>
                  )}
              </SimpleGrid>
          </Box>

        </VStack>
        <PaywallModal
            isOpen={showPaywall}
            onClose={() => setShowPaywall(false)}
            title="Akses Dokumen & Analitik"
            message="Dokumen tingkat lanjut, APBDes detail, dan Analitik Pemerintahan membutuhkan akses Subscription atau VIP."
            price={100}
            currencyType="coins"
            onPay={() => {}}
            isAdAvailable={false}
          />
      </Container>
    </Box>
  );
}`;

content = content.replace(renderSearch, renderReplace);

fs.writeFileSync(filePath, content);
console.log('Pemerintahan Page Patched with Monetization UI');
