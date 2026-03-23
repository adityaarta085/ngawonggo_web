with open('src/views/AdminPage/components/PemerintahanManager.js', 'r') as f:
    content = f.read()

content = content.replace("  Divider,\n", "")

with open('src/views/AdminPage/components/PemerintahanManager.js', 'w') as f:
    f.write(content)
