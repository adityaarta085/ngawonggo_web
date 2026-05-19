const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

// I will now add tts functionality using an api or web speech api.
// "dan pakai teks to tts untuk bicaranya, buat yang sesuai ya." -> we can use window.speechSynthesis
// Let's modify the Chatbot component to speak new bot messages.

// We need to trigger TTS when a new message from 'assistant' is added.

const newImport = `import axios from 'axios';
const speak = (text) => {
    if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Indonesian
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Optionally, try to find a male voice
        const voices = window.speechSynthesis.getVoices();
        const indonesianMaleVoice = voices.find(voice => voice.lang.includes('id') && voice.name.toLowerCase().includes('male'));

        if (indonesianMaleVoice) {
            utterance.voice = indonesianMaleVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
};`;

code = code.replace("import axios from 'axios';", newImport);

// When bot message is added
const botMessageAdd = `      const botMessage = response.data.choices[0].message;

      // Try to parse if it's an escalation JSON
      let isEscalation = false;
      try {
          // Remove markdown JSON formatting if present
          let cleanContent = botMessage.content.trim();
          if (cleanContent.startsWith('\`\`\`json')) {
              cleanContent = cleanContent.replace(/^\`\`\`json\\n/, '').replace(/\\n\`\`\`$/, '');
          } else if (cleanContent.startsWith('\`\`\`')) {
              cleanContent = cleanContent.replace(/^\`\`\`\\n/, '').replace(/\\n\`\`\`$/, '');
          }
          const parsed = JSON.parse(cleanContent);
          if (parsed.escalate) {
              isEscalation = true;
              handleEscalation(parsed.summary, parsed.reason);
          }
      } catch (e) {
          // Not JSON, normal message
      }

      if (!isEscalation) {
          setMessages(prev => [...prev, botMessage]);
          speak(botMessage.content); // ADDED TTS HERE
      }`;

// But wait, the original code is:
/*
      if (!isEscalation) {
          setMessages(prev => [...prev, botMessage]);
      }
*/
