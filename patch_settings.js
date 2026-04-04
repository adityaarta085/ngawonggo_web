const fs = require('fs');
let code = fs.readFileSync('src/views/AdminPage/components/SettingsManager.js', 'utf8');

code = code.replace(
  "is_takedown: 'false',",
  "is_takedown: 'false',\n    is_blocked: 'false',"
);

code = code.replace(
  "is_takedown: 'false',",
  "is_takedown: 'false',\n        is_blocked: 'false',"
);

const newCard = `
        {/* Blocked Mode Settings */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="orange.500">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="xs" color="orange.600" textTransform="uppercase">Mode Situs Diblokir (Internet Baik)</Heading>
                  <Text fontSize="xs" color="gray.500">Aktifkan untuk memblokir situs karena pelanggaran peraturan dan alihkan ke halaman Internet Baik.</Text>
                </Box>
                <FormControl display="flex" alignItems="center" w="auto">
                  <Switch
                    id="blocked-mode"
                    colorScheme="orange"
                    size="lg"
                    isChecked={settings.is_blocked === 'true'}
                    onChange={(e) => handleChange('is_blocked', String(e.target.checked))}
                  />
                </FormControl>
              </Flex>

              {settings.is_blocked === 'true' && (
                <Alert status="warning" borderRadius="lg" variant="subtle">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Situs Sedang Diblokir!</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Seluruh halaman (kecuali Admin) dialihkan ke halaman peringatan Internet Baik.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>
`;

code = code.replace(
  "{/* Takedown Mode Settings */}",
  newCard + "\n        {/* Takedown Mode Settings */}"
);

fs.writeFileSync('src/views/AdminPage/components/SettingsManager.js', code);
