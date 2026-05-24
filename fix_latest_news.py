with open('src/views/LandingPage/components/LatestNews.js', 'r') as f:
    content = f.read()

if "import CustomAds" not in content:
    content = content.replace("import CardNews from '../../../components/CardNews';", "import CardNews from '../../../components/CardNews';\nimport CustomAds from '../../../components/CustomAds';")

if "<CustomAds placementType=\"inline\" />" not in content:
    content = content.replace("<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>", "<CustomAds placementType=\"inline\" />\n                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>")

with open('src/views/LandingPage/components/LatestNews.js', 'w') as f:
    f.write(content)
