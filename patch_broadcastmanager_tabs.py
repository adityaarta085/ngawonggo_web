with open('src/views/AdminPage/components/BroadcastManager.js', 'r') as f:
    content = f.read()

# Add Tabs imports
import re
content = re.sub(
    r"import \{(.*?)\} from '@chakra-ui/react';",
    r"import {\1, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea} from '@chakra-ui/react';",
    content
)

old_quill = """
              <Box bg="white" color="black">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  style={{ height: '250px', marginBottom: '50px' }}
                  readOnly={isSending}
                />
              </Box>
"""

new_tabs = """
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
                      value={content}
                      onChange={setContent}
                      modules={quillModules}
                      style={{ height: '250px', marginBottom: '40px' }}
                      readOnly={isSending}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Ketik atau paste kode HTML di sini..."
                      height="250px"
                      fontFamily="monospace"
                      fontSize="sm"
                      isDisabled={isSending}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Box
                      height="250px"
                      overflowY="auto"
                      p={4}
                      border="1px solid"
                      borderColor="gray.100"
                      borderRadius="md"
                      dangerouslySetInnerHTML={{ __html: content || '<p color="gray">Pratinjau kosong</p>' }}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
"""

content = content.replace(old_quill.strip(), new_tabs.strip())

with open('src/views/AdminPage/components/BroadcastManager.js', 'w') as f:
    f.write(content)
