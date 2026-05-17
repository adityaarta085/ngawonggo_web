const fs = require('fs');
const file = 'src/views/DracinPage/Watch.js';
let content = fs.readFileSync(file, 'utf8');

// Remove screenfull import
content = content.replace(/import screenfull from 'screenfull';\n/, '');

// Remove icons
content = content.replace(/FaExpand, FaCompress /, '');

// Remove isFullscreen state
content = content.replace(/const \[isFullscreen, setIsFullscreen\] = useState\(false\);\n\n?/, '');

// Remove handleFullscreenChange useEffect logic
const fullScreenEffectRegex = /const handleFullscreenChange = \(\) => \{\n\s*setIsFullscreen\(screenfull\.isFullscreen\);\n\s*};\n\n\s*if \(screenfull\.isEnabled\) \{\n\s*screenfull\.on\('change', handleFullscreenChange\);\n\s*}\n\n\s*return \(\) => \{\n\s*mounted = false;\n\s*if \(screenfull\.isEnabled\) \{\n\s*screenfull\.off\('change', handleFullscreenChange\);\n\s*}\n\s*};\n/g;
content = content.replace(fullScreenEffectRegex, 'return () => {\n        mounted = false;\n    };\n');

// Remove toggleFullscreen
const toggleFullscreenRegex = /const toggleFullscreen = \(\) => \{\n\s*if \(screenfull\.isEnabled && playerWrapperRef\.current\) \{\n\s*screenfull\.toggle\(playerWrapperRef\.current\);\n\s*\}\n\s*\};\n\n?/g;
content = content.replace(toggleFullscreenRegex, '');

// Remove IconButton block
const iconButtonRegex = /\{screenfull\.isEnabled && \(\n\s*<IconButton\n\s*icon=\{isFullscreen \? <FaCompress \/> : <FaExpand \/>\}\n\s*onClick=\{toggleFullscreen\}\n\s*position="absolute"\n\s*bottom="20px"\n\s*right="20px"\n\s*zIndex=\{10\}\n\s*colorScheme="blackAlpha"\n\s*aria-label="Toggle Fullscreen"\n\s*\/>\n\s*\)\}\n\s*/g;
content = content.replace(iconButtonRegex, '');

// Remove dynamic border radius
content = content.replace(/borderRadius=\{isFullscreen \? '0' : 'xl'\}/g, 'borderRadius="xl"');

fs.writeFileSync(file, content);
console.log('Patched');
