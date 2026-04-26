import re

with open('src/views/AdminPage/index.js', 'r') as f:
    content = f.read()

# Add DoodleManager import
content = re.sub(r"import ProfilManager from '\./components/ProfilManager';", "import ProfilManager from './components/ProfilManager';\nimport DoodleManager from './components/DoodleManager';", content)

# Add Doodles to menuItems array
content = re.sub(r"\{ name: 'Running Text', icon: FaBullhorn \},", "{ name: 'Running Text', icon: FaBullhorn },\n    { name: 'Google Doodles', icon: FaImage },", content)

# Render DoodleManager in switch
content = re.sub(r"\{activeTab === 'Profil Desa' && <ProfilManager />\}", "{activeTab === 'Profil Desa' && <ProfilManager />}\n          {activeTab === 'Google Doodles' && <DoodleManager />}", content)

with open('src/views/AdminPage/index.js', 'w') as f:
    f.write(content)
