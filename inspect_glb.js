const fs = require('fs');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');
// three.js in node is tricky without a canvas.
// Let's just use a simple regex or string search to see if "morphTargets" or "jawOpen" exists in the GLB file.
const data = fs.readFileSync('public/azma.glb', 'utf8');
console.log("Has jawOpen?", data.includes('jawOpen'));
console.log("Has morphTarget?", data.includes('morphTarget'));
console.log("Has mixamorig?", data.includes('mixamorig'));
