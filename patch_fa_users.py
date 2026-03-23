with open('src/views/AdminPage/index.js', 'r') as f:
    content = f.read()

content = content.replace("FaEnvelope,", "FaEnvelope,\n  FaUsers,")

with open('src/views/AdminPage/index.js', 'w') as f:
    f.write(content)
