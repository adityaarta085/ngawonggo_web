const fs = require('fs');

let portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');
portal = portal.replace("import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';", "import { useNavigate, Link as RouterLink } from 'react-router-dom';");
fs.writeFileSync('src/views/PortalPage/index.js', portal);
