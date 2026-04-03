const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Chatbot.js');
let content = fs.readFileSync(filePath, 'utf8');

// The issue is in handleSend:
/*
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!sessionUser && csStatus === 'none' && input.toLowerCase().includes('cs')) {
        // Just a little hint
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (csStatus === 'active' || csStatus === 'waiting') {
       try {
           await supabase.from('messagesCS').insert({
               chat_id: chatSession,
               sender: 'user',
               message: userMessage.content
           });
       } catch (error) {
           console.error("CS Send Error", error);
       } finally {
           setIsLoading(false);
       }
       return;
    }

    const userMessage = { role: 'user', content: input }; // <--- DUP!
*/

content = content.replace(
    `    const userMessage = { role: 'user', content: input };\n    setMessages(prev => [...prev, userMessage]);\n    setInput('');\n    setIsLoading(true);\n\n    try {\n      const response = await axios.post('/api/chat', {\n        messages: [...messages, userMessage].slice(-6) // Send last 6 messages for context\n      });`,
    `    try {\n      const response = await axios.post('/api/chat', {\n        messages: [...messages, userMessage].slice(-6) // Send last 6 messages for context\n      });`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed duplicate userMessage declaration in Chatbot.js');
