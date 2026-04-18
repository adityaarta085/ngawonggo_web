def fix_imports(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # The previous regex might have failed to replace if it was multiline or didn't match exactly.
    # Let's do a more robust string replacement.
    import re
    if 'Tabs' not in content[:1000]: # check if imported at top
        # find the @chakra-ui/react import block
        match = re.search(r"import\s+\{([^}]+)\}\s+from\s+'@chakra-ui/react';", content)
        if match:
            old_import = match.group(0)
            new_inner = match.group(1).strip() + ", Tabs, TabList, TabPanels, Tab, TabPanel, Textarea"
            new_import = f"import {{ {new_inner} }} from '@chakra-ui/react';"
            content = content.replace(old_import, new_import)

    with open(filename, 'w') as f:
        f.write(content)

fix_imports('src/views/AdminPage/components/UserManager.js')
fix_imports('src/views/AdminPage/components/BroadcastManager.js')
