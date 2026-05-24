with open('src/views/LandingPage/components/LatestNews.js', 'r') as f:
    content = f.read()

content = content.replace('<CustomAds placementType="inline" />\n                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>', '<>\n                  <CustomAds placementType="inline" />\n                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>')
content = content.replace('<CardNews key={item.id} news={item} />\n                ))}\n              </SimpleGrid>', '<CardNews key={item.id} news={item} />\n                ))}\n              </SimpleGrid>\n              </>')

with open('src/views/LandingPage/components/LatestNews.js', 'w') as f:
    f.write(content)
