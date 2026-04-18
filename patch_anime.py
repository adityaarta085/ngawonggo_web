import re

with open('src/views/AnimePage/Watch.js', 'r') as f:
    content = f.read()

# Fix episode data parsing
content = content.replace('const serverList = episodeData.serverList || [];', '''const serverQualities = episodeData.server?.qualities || [];
  const serverList = [];
  serverQualities.forEach(q => {
      q.serverList?.forEach(s => {
          serverList.push({ ...s, quality: q.title });
      });
  });''')

# Fix download url parsing
content = content.replace('const downloadUrlList = episodeData.downloadUrl || null;', 'const downloadUrlList = episodeData.downloadUrl?.qualities || [];')

# Fix map logic for downloadUrl
content = content.replace('downloadUrlList?.formats?.length > 0', 'downloadUrlList.length > 0')

# Replace formats.map with qualities.map
download_block_old = '''{downloadUrlList.formats.map((fmt, idx) => (
                             <Box key={idx}>
                                 <Text fontWeight="bold" color="brand.600" mb={2}>Format: {fmt.title}</Text>
                                 <VStack align="stretch" spacing={2}>
                                     {fmt.qualities?.map((qual, qidx) => (
                                         <Box key={qidx} bg="gray.50" p={2} borderRadius="md" border="1px solid" borderColor="gray.200">
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">{qual.title}</Text>
                                            <HStack mt={1} flexWrap="wrap" gap={1}>
                                                {qual.urls?.map((urlItem, uidx) => (
                                                    <Link key={uidx} href={urlItem.url} isExternal>
                                                        <Badge colorScheme="blue" variant="subtle" cursor="pointer" _hover={{ bg: 'blue.100' }}>
                                                            {urlItem.title}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </HStack>
                                         </Box>
                                     ))}
                                 </VStack>
                             </Box>
                         ))}'''

download_block_new = '''{downloadUrlList.map((qual, idx) => (
                             <Box key={idx} bg="gray.50" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
                                 <Text fontWeight="bold" color="brand.600" mb={2}>{qual.title} {qual.size ? `(${qual.size})` : ''}</Text>
                                 <HStack mt={1} flexWrap="wrap" gap={2}>
                                     {qual.urls?.map((urlItem, uidx) => (
                                         <Link key={uidx} href={urlItem.url} isExternal>
                                             <Badge colorScheme="blue" variant="solid" cursor="pointer" _hover={{ bg: 'blue.600' }} px={2} py={1}>
                                                 {urlItem.title}
                                             </Badge>
                                         </Link>
                                     ))}
                                 </HStack>
                             </Box>
                         ))}'''

content = content.replace(download_block_old, download_block_new)

# Fix server list setting
content = content.replace('''if (epData.serverList && epData.serverList.length > 0) {
            const initialServerId = epData.serverList[0].serverId;
            setSelectedServerId(initialServerId);
            fetchServerUrl(initialServerId);
        } else if (epData.stream_url) {''', '''
        let initialServerId = null;
        if (epData.server?.qualities) {
            for (const quality of epData.server.qualities) {
                if (quality.serverList?.length > 0) {
                    initialServerId = quality.serverList[0].serverId;
                    break;
                }
            }
        }

        if (initialServerId) {
            setSelectedServerId(initialServerId);
            fetchServerUrl(initialServerId);
        } else if (epData.stream_url) {''')

# Fix server list dropdown logic
content = content.replace('''{serverList.map((srv, idx) => (
                             <option key={idx} value={srv.serverId}>{srv.title}</option>
                         ))}''', '''{serverList.map((srv, idx) => (
                             <option key={idx} value={srv.serverId}>{srv.quality} - {srv.title}</option>
                         ))}''')

with open('src/views/AnimePage/Watch.js', 'w') as f:
    f.write(content)
