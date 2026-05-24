with open('src/App.js', 'r') as f:
    content = f.read()

if "import CustomAds" not in content:
    content = content.replace("import ScrollToTop from './components/ScrollToTop';", "import ScrollToTop from './components/ScrollToTop';\nimport CustomAds from './components/CustomAds';")
    if "import CustomAds" not in content:
        # Fallback if ScrollToTop import is different
        content = content.replace("import React,", "import React,\nimport CustomAds from './components/CustomAds';")
        content = content.replace("import React,\nimport CustomAds", "import React from 'react';\nimport CustomAds")

if "<CustomAds placementType" not in content:
    ads_markup = """        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && (
          <>
            <CustomAds placementType="popup_top" />
            <CustomAds placementType="popup_bottom" />
            <CustomAds placementType="popup_center" />
          </>
        )}
        <ScrollToTop />"""
    content = content.replace("<ScrollToTop />", ads_markup)

with open('src/App.js', 'w') as f:
    f.write(content)
