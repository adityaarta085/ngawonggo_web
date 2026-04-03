import re

with open('src/views/AdminPage/index.js', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import PemerintahanManager from './components/PemerintahanManager';", "import PemerintahanManager from './components/PemerintahanManager';\nimport UserManager from './components/UserManager';")

# Add to menu items
content = content.replace("{ name: 'Pengaturan', icon: FaCog },", "{ name: 'Pengaturan', icon: FaCog },\n    { name: 'Pengguna', icon: FaUsers },")

# Add to active tab rendering
content = content.replace("{activeTab === 'Pemerintahan' && <PemerintahanManager />}", "{activeTab === 'Pemerintahan' && <PemerintahanManager />}\n          {activeTab === 'Pengguna' && <UserManager />}")

with open('src/views/AdminPage/index.js', 'w') as f:
    f.write(content)
