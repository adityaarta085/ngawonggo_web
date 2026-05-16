const fs = require('fs');
const file = 'src/components/Chatbot.js';
let content = fs.readFileSync(file, 'utf8');

// Update Send logic
content = content.replace(/const handleSend = async \(\) => \{([\s\S]*?)const userMessage = \{ role: 'user', content: input \};/m, `const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!sessionUser && csStatus === 'none' && input.toLowerCase().includes('cs')) {
        // Just a little hint
    }

    if (!sessionUser) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Anda harus login untuk menggunakan Asisten AI.' }]);
        setInput('');
        return;
    }

    const userMessage = { role: 'user', content: input };`);

// Update Payload
content = content.replace(/messages: \[\.\.\.messages, userMessage\]\.slice\(-6\)/g, "messages: [...messages, userMessage].slice(-6), userId: sessionUser.id");

// Update UI Text
content = content.replace(/<Text fontSize="10px" opacity=\{0.8\}>Aktif • Didukung oleh Groq<\/Text>/g, '<Text fontSize="10px" opacity={0.8}>Aktif • DIDUKUNG GPT 5.5 NEW</Text>');

// Update UI Text when getting rate limited from API
content = content.replace(/const botMessage = response\.data\.choices\[0\]\.message;/, `
      if (response.data.limitReached) {
          setMessages(prev => [...prev, { role: 'assistant', content: response.data.error }]);
          setIsLoading(false);
          return;
      }
      const botMessage = response.data.choices[0].message;`);

fs.writeFileSync(file, content);
