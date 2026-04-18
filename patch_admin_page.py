import re

with open('src/views/AdminPage/index.js', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import BroadcastManager from './components/BroadcastManager';", "import BroadcastManager from './components/BroadcastManager';\nimport PemerintahanManager from './components/PemerintahanManager';")

# Add to menuItems
menu_pattern = r"(const menuItems = \[\s*)([\s\S]*?)(\s*\];)"
menu_match = re.search(menu_pattern, content)

if menu_match:
    menu_inner = menu_match.group(2)
    new_menu_inner = menu_inner + "\n    { name: 'Pemerintahan', icon: FaUsers },"
    content = content[:menu_match.start()] + menu_match.group(1) + new_menu_inner + menu_match.group(3) + content[menu_match.end():]

# Ensure FaUsers is imported
if "FaUsers" not in content:
    content = content.replace("FaEnvelope,", "FaEnvelope,\n  FaUsers,")

# Add to activeTab render logic
tab_render_pattern = r"(\{activeTab === 'Pengaturan' && <SettingsManager />\})"
if re.search(tab_render_pattern, content):
    content = re.sub(tab_render_pattern, r"\1\n          {activeTab === 'Pemerintahan' && <PemerintahanManager />}", content)

with open('src/views/AdminPage/index.js', 'w') as f:
    f.write(content)
