import re

# DoodleManager
with open('src/views/AdminPage/components/DoodleManager.js', 'r') as f:
    content = f.read()

content = content.replace('// eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);', '}, []);') # if existed
content = content.replace('  }, []);', '  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);')

with open('src/views/AdminPage/components/DoodleManager.js', 'w') as f:
    f.write(content)

# Hero.js
with open('src/views/LandingPage/components/Hero.js', 'r') as f:
    content = f.read()

content = content.replace('const { data, error } = await supabase', 'const { data } = await supabase')

with open('src/views/LandingPage/components/Hero.js', 'w') as f:
    f.write(content)
