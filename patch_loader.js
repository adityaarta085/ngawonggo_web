const fs = require('fs');
const file = 'src/views/KreativitasPage/index.js';
let content = fs.readFileSync(file, 'utf8');

// The user provided the exact CSS they want for the loader, so I should use it.
// I will inject the css block and use the loader class.
const cssLoader = `
<style>
.loader {
  display: inline-grid;
  width: 80px;
  aspect-ratio: 1;
  overflow: hidden;
  background:
   conic-gradient(from 146deg at 50% 1%,#0000, #91492A 2deg 65deg,#0000 68deg)
   -5% 100%/20% 27% repeat-x;
}
.loader:before {
  content:"";
  margin: 12.5%;
  clip-path: polygon(100% 50%,78.19% 60.26%,88.3% 82.14%,65% 75.98%,58.68% 99.24%,44.79% 79.54%,25% 93.3%,27.02% 69.28%,3.02% 67.1%,20% 50%,3.02% 32.9%,27.02% 30.72%,25% 6.7%,44.79% 20.46%,58.68% 0.76%,65% 24.02%,88.3% 17.86%,78.19% 39.74%);
  background: #CF6F46;
  animation: l7 3s linear infinite;
  translate: -135% 0;
}
@keyframes l7 {to{rotate: 400deg;translate: 135% 0}}
</style>
`;

// Insert the CSS style into the render component
content = content.replace(/<Box pt=\{0\} minH="100vh" bgGradient=\{bgGradient\} pb=\{32\}>/, `<Box pt={0} minH="100vh" bgGradient={bgGradient} pb={32}>\n      ${cssLoader}`);

// Replace the Chakra Spinner with the requested custom loader
content = content.replace(/<Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="purple.500" \/>/, `<div className="loader"></div>`);

// Change the aspect ratio of the image container to 9:16 and ensure it scales correctly
content = content.replace(/h=\{\{ base: "300px", md: "500px" \}\}/, `h={{ base: "450px", md: "600px" }} w={{ base: "full", md: "auto" }} aspectRatio="9/16" mx="auto"`);
content = content.replace(/w="full"\n[\s]*h=\{\{ base: "300px", md: "500px" \}\}/, `w={{ base: "full", md: "auto" }} aspectRatio="9/16" mx="auto"`); // if first replace didn't work perfectly

fs.writeFileSync(file, content);
