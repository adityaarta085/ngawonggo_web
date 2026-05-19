const fs = require('fs');

const mascotPath = 'src/components/Mascot3D.js';
let mascotCode = fs.readFileSync(mascotPath, 'utf8');
mascotCode = mascotCode.replace('const { scene, nodes, animations } = useGLTF(url);', 'const { scene } = useGLTF(url);');
fs.writeFileSync(mascotPath, mascotCode);
