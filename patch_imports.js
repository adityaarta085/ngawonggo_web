const fs = require('fs');
let portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

if (!portal.includes('FaExclamationTriangle')) {
    portal = portal.replace('FaClipboardList,', 'FaClipboardList,\n    FaExclamationTriangle,');
}

const modalImports = ['Modal', 'ModalOverlay', 'ModalContent', 'ModalHeader', 'ModalFooter', 'ModalBody', 'ModalCloseButton', 'useDisclosure'];
for(let m of modalImports) {
    if (!portal.includes(m + ',')) {
        portal = portal.replace('useToast,', 'useToast,\n  ' + m + ',');
    }
}

fs.writeFileSync('src/views/PortalPage/index.js', portal);
