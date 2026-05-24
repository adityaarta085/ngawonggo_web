with open('src/views/NewsPage/index.js', 'r') as f:
    content = f.read()

if "import CustomAds" not in content:
    content = content.replace("import CardNews from '../../components/CardNews.js';", "import CardNews from '../../components/CardNews.js';\nimport CustomAds from '../../components/CustomAds';")

if "<CustomAds placementType=\"inline\" />" not in content:
    # Inject it right after the Category Filter box
    content = content.replace("</HStack>\n          </Box>", "</HStack>\n          </Box>\n\n          <CustomAds placementType=\"inline\" />")

with open('src/views/NewsPage/index.js', 'w') as f:
    f.write(content)
