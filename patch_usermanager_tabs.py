with open('src/views/AdminPage/components/UserManager.js', 'r') as f:
    content = f.read()

# Add Tabs imports
import re
content = re.sub(
    r"import \{(.*?)\} from '@chakra-ui/react';",
    r"import {\1, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea} from '@chakra-ui/react';",
    content
)

# Replace the single ReactQuill rendering with Tabs
old_quill = """
              <FormControl isRequired>
                <FormLabel>Isi Email (HTML Didukung, Bisa Diedit Sesuka Hati)</FormLabel>
                <Box bg="white" color="black">
                  <ReactQuill
                    theme="snow"
                    value={emailContent}
                    onChange={setEmailContent}
                    modules={quillModules}
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </Box>
              </FormControl>
"""

new_tabs = """
              <FormControl isRequired>
                <FormLabel>Isi Email</FormLabel>
                <Tabs variant="enclosed" colorScheme="brand">
                  <TabList>
                    <Tab>Visual Editor</Tab>
                    <Tab>HTML Editor</Tab>
                    <Tab>Preview</Tab>
                  </TabList>
                  <TabPanels bg="white" color="black" border="1px" borderColor="gray.200" borderTop="none" borderBottomRadius="md">
                    <TabPanel p={0}>
                      <ReactQuill
                        theme="snow"
                        value={emailContent}
                        onChange={setEmailContent}
                        modules={quillModules}
                        style={{ height: '300px', marginBottom: '40px' }}
                      />
                    </TabPanel>
                    <TabPanel>
                      <Textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="Ketik atau paste kode HTML di sini..."
                        height="300px"
                        fontFamily="monospace"
                        fontSize="sm"
                      />
                    </TabPanel>
                    <TabPanel>
                      <Box
                        height="300px"
                        overflowY="auto"
                        p={4}
                        border="1px solid"
                        borderColor="gray.100"
                        borderRadius="md"
                        dangerouslySetInnerHTML={{ __html: emailContent || '<p color="gray">Pratinjau kosong</p>' }}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </FormControl>
"""

content = content.replace(old_quill.strip(), new_tabs.strip())

with open('src/views/AdminPage/components/UserManager.js', 'w') as f:
    f.write(content)
