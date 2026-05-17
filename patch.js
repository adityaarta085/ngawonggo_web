const fs = require('fs');
const file = 'src/views/DracinPage/Watch.js';
let content = fs.readFileSync(file, 'utf8');

// Remove ReactPlayer import
content = content.replace(/import ReactPlayer from 'react-player';\n/, '');

// Replace maxW="1000px" with maxW="500px"
content = content.replace(/maxW="1000px"/g, 'maxW="500px"');

// Replace pt="56.25%" with pt="177.78%"
content = content.replace(/pt="56\.25%"/g, 'pt="177.78%"');

// Replace <ReactPlayer ... /> with <video ... />
const reactPlayerRegex = /<ReactPlayer[\s\S]*?\/>/g;
const videoTag = `<video
                        src={videoUrl}
                        controls
                        autoPlay
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />`;
content = content.replace(reactPlayerRegex, videoTag);

fs.writeFileSync(file, content);
console.log('Patched');
