const fs = require('fs');

// Fix AuthPage warnings
let auth = fs.readFileSync('src/views/AuthPage/index.js', 'utf8');
auth = auth.replace('AccordionIcon,', '');
fs.writeFileSync('src/views/AuthPage/index.js', auth);

// Fix PortalPage warnings
let portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');
portal = portal.replace('const location = useLocation();', '');
portal = portal.replace('  }, [navigate]);', '  }, [navigate, toast]);');
fs.writeFileSync('src/views/PortalPage/index.js', portal);
