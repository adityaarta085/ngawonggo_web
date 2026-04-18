with open('src/views/AdminPage/components/BroadcastManager.js', 'r') as f:
    content = f.read()

content = content.replace("InputLeftElement,, Tabs", "InputLeftElement, Tabs")

with open('src/views/AdminPage/components/BroadcastManager.js', 'w') as f:
    f.write(content)

with open('src/views/AdminPage/components/UserManager.js', 'r') as f:
    content2 = f.read()

content2 = content2.replace("InputLeftElement,, Tabs", "InputLeftElement, Tabs")

with open('src/views/AdminPage/components/UserManager.js', 'w') as f:
    f.write(content2)
