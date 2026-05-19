const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.js');
let code = fs.readFileSync(filePath, 'utf8');

if (!code.includes('Mascot3D')) {
    code = code.replace(
        "import Chatbot from './components/Chatbot.js';",
        "import Chatbot from './components/Chatbot.js';\nimport Mascot3D from './components/Mascot3D.js';"
    );

    // Check if there is a way to link `isSpeaking` from chatbot. We might need a global state or an event listener.
    // For simplicity, let's just add it to App.js and listen to a custom event from Chatbot for speaking status.

    // Find where Chatbot is rendered and add Mascot3D next to it
    code = code.replace(
        '<Chatbot',
        '<Mascot3D />\n              <Chatbot'
    );
}

fs.writeFileSync(filePath, code);

// Now let's update Chatbot.js to emit an event when speaking
const chatFilePath = path.join(__dirname, 'src/components/Chatbot.js');
let chatCode = fs.readFileSync(chatFilePath, 'utf8');

if (!chatCode.includes('window.dispatchEvent(new CustomEvent("azma-speaking"')) {
    chatCode = chatCode.replace(
        'window.speechSynthesis.speak(utterance);',
        `
        utterance.onstart = () => window.dispatchEvent(new CustomEvent('azma-speaking', { detail: true }));
        utterance.onend = () => window.dispatchEvent(new CustomEvent('azma-speaking', { detail: false }));
        utterance.onerror = () => window.dispatchEvent(new CustomEvent('azma-speaking', { detail: false }));
        window.speechSynthesis.speak(utterance);`
    );
    fs.writeFileSync(chatFilePath, chatCode);
}

// And update Mascot3D.js to listen to this event instead of passing props, to avoid passing props deeply
const mascotFilePath = path.join(__dirname, 'src/components/Mascot3D.js');
let mascotCode = fs.readFileSync(mascotFilePath, 'utf8');
mascotCode = mascotCode.replace(
    'export default function Mascot3D({ isSpeaking }) {',
    `export default function Mascot3D() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
      const handleSpeaking = (e) => setIsSpeaking(e.detail);
      window.addEventListener('azma-speaking', handleSpeaking);
      return () => window.removeEventListener('azma-speaking', handleSpeaking);
  }, []);`
);
// We also need to add isSpeaking conditionally inside Model if it wasn't passed down
// The Model receives it via props from Mascot3D
fs.writeFileSync(mascotFilePath, mascotCode);
