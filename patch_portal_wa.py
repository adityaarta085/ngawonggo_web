import re

with open('src/views/PortalPage/index.js', 'r') as f:
    portal = f.read()

# Add imports
if 'import { useLocation }' not in portal:
    portal = portal.replace("import { useNavigate, Link as RouterLink } from 'react-router-dom';", "import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';")

if 'FaWhatsapp' not in portal:
    portal = portal.replace("FaClipboardList,", "FaClipboardList,\n    FaWhatsapp,\n    FaCheckCircle,")

if 'Input,' not in portal:
    portal = portal.replace("Heading,", "Heading,\n  Input,\n  FormControl,\n  FormLabel,")

with open('src/views/PortalPage/index.js', 'w') as f:
    f.write(portal)
