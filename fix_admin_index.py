import re

with open('src/views/AdminPage/index.js', 'r') as f:
    content = f.read()

# Fix imports
if "import IklanManager" not in content:
    content = content.replace("import MediaManager from './components/MediaManager';", "import MediaManager from './components/MediaManager';\nimport IklanManager from './components/IklanManager';")

if "FaAd" not in content:
    content = content.replace("import { FaCoins, FaBell } from 'react-icons/fa';", "import { FaCoins, FaBell, FaAd } from 'react-icons/fa';")

# Fix menu items
if "{ name: 'Iklan', icon: FaAd }" not in content:
    content = content.replace("{ name: 'Manajemen Media', icon: FaImage },", "{ name: 'Manajemen Media', icon: FaImage },\n    { name: 'Iklan', icon: FaAd },")

# Fix component rendering - cleanup bad sed first
content = re.sub(r'\{activeTab === \'Manajemen Media\' (?:&& <MediaManager />)?(?:\{activeTab === \'Manajemen Media\' && <MediaManager />\})* <MediaManager />\}', "{activeTab === 'Manajemen Media' && <MediaManager />}", content)
content = re.sub(r'\{activeTab === \'Iklan\' (?:&& <MediaManager />)?(?:\{activeTab === \'Manajemen Media\' && <MediaManager />\})* <IklanManager />\}', "", content)

if "{activeTab === 'Iklan' && <IklanManager />}" not in content:
    content = content.replace("{activeTab === 'Manajemen Media' && <MediaManager />}", "{activeTab === 'Manajemen Media' && <MediaManager />}\n          {activeTab === 'Iklan' && <IklanManager />}")

with open('src/views/AdminPage/index.js', 'w') as f:
    f.write(content)
