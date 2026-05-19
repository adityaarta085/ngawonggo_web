const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

const importReplacement = `import axios from 'axios';

const speak = (text) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Remove markdown or special characters before speaking
        let cleanText = text.replace(/\\*Jawaban ini dihasilkan oleh AI.*?desangawonggoku@gmail\\.com\\*/gs, '');
        cleanText = cleanText.replace(/[#*\\-]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.pitch = 0.9; // Slightly lower pitch for male voice

        const voices = window.speechSynthesis.getVoices();
        const indonesianMaleVoice = voices.find(voice => voice.lang.includes('id') && voice.name.toLowerCase().includes('male'));

        if (indonesianMaleVoice) {
            utterance.voice = indonesianMaleVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
};`;

code = code.replace("import axios from 'axios';", importReplacement);

const newBotMessageAddition = `      if (!isEscalation) {
        setMessages(prev => [...prev, botMessage]);
        speak(botMessage.content);
      }`;

code = code.replace(`      if (!isEscalation) {
        setMessages(prev => [...prev, botMessage]);
      }`, newBotMessageAddition);


fs.writeFileSync(filePath, code);
