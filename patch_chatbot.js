const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace the initial message
code = code.replace(
  "content: 'Halo! Saya Asisten AI Desa Ngawonggo. Ada yang bisa saya bantu?'",
  "content: 'Halo! Saya Azma, maskot baru web Desa Ngawonggo. Ada yang bisa saya bantu?'"
);

// Add audio reference and auto-play logic
// We can use a ref and a useEffect to play the audio when the chatbot is first opened,
// or on mount if it's not docked, etc. Since the requirement is "saat pertama kali masuk web desa ngawonggo itu maskot nya akan memperkenalkan diri",
// we can play the audio once on component mount.

const importStatement = `import React, { useState, useRef, useEffect } from 'react';`;
const newImportStatement = `import React, { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';`;

code = code.replace(importStatement, newImportStatement);

const stateCode = `  const [csIsTyping, setCsIsTyping] = useState(false);
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars`;

const newStateCode = `  const [csIsTyping, setCsIsTyping] = useState(false);
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  useEffect(() => {
    // Only play once per session
    if (!hasPlayedIntro) {
      const audio = new Audio('/azma_intro.aac');
      const playPromise = audio.play();
      if (playPromise !== undefined) {
          playPromise.then(_ => {
              setHasPlayedIntro(true);
          }).catch(error => {
              console.log("Audio autoplay prevented by browser. Wait for user interaction.");
          });
      }
    }
  }, [hasPlayedIntro]);`;

code = code.replace(stateCode, newStateCode);


// Replace the logo
code = code.replace(
  /src="\/ai_logo\.png"/g,
  `src="/ai_logo.png"` // Assuming we might want to keep the image, or we might need to replace it. Wait, the prompt says "masukkan model baru yang saya kirim... ini adalah maskot baru". It doesn't mention an image file in the prompt, but says "maskot akan selalu ditampilkan mengambang kecil setengah badan di kiri bawah". The user says "masukkan model baru yang saya kirim".
);

fs.writeFileSync(filePath, code);
