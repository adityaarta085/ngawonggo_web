with open('src/components/InstallPWA.js', 'r') as f:
    content = f.read()

content = content.replace(
    "import { MdOutlineInstallMobile } from 'react-icons/md';",
    ""
)

content = content.replace(
    "<MdOutlineInstallMobile fontSize=\"14px\" />",
    "<FaDownload fontSize=\"10px\" />"
)

with open('src/components/InstallPWA.js', 'w') as f:
    f.write(content)
