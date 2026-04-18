import re

with open('src/views/PortalPage/index.js', 'r') as f:
    content = f.read()

# Make sure imports are there
if 'FaExclamationTriangle' not in content:
    content = content.replace('FaSignOutAlt,', 'FaSignOutAlt,\n    FaExclamationTriangle,')

# Wait, we also need Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
modal_imports = ['Modal', 'ModalOverlay', 'ModalContent', 'ModalHeader', 'ModalFooter', 'ModalBody', 'ModalCloseButton', 'useDisclosure']
for item in modal_imports:
    if item not in content:
        content = content.replace('Tooltip,', f'Tooltip,\n  {item},')

with open('src/views/PortalPage/index.js', 'w') as f:
    f.write(content)
