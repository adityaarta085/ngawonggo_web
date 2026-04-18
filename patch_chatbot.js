const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Chatbot.js');
let content = fs.readFileSync(filePath, 'utf8');

// Imports
content = content.replace(
  `import { FaRobot, FaTimes, FaMinus, FaPaperPlane } from 'react-icons/fa';`,
  `import { FaRobot, FaTimes, FaMinus, FaPaperPlane, FaUserHeadset, FaSignInAlt } from 'react-icons/fa';\nimport { supabase } from '../lib/supabase';\nimport { useNavigate } from 'react-router-dom';`
);

// State vars
content = content.replace(
  `const [isLoading, setIsLoading] = useState(false);`,
  `const [isLoading, setIsLoading] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [chatSession, setChatSession] = useState(null); // The CS chat session ID
  const [csStatus, setCsStatus] = useState('none'); // none, waiting, active
  const [csAssigned, setCsAssigned] = useState(null); // Assigned CS info
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Fetch active session on mount if logged in
  useEffect(() => {
    if (sessionUser) {
      const checkActiveSession = async () => {
        const { data, error } = await supabase
          .from('chatsCS')
          .select('*, usersCS:assigned_to(name)')
          .eq('user_id', sessionUser.id)
          .in('status', ['waiting', 'active'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setChatSession(data.chat_id);
          setCsStatus(data.status);
          if (data.usersCS) {
            setCsAssigned(data.usersCS.name);
          }

          // Load existing messages
          const { data: msgs } = await supabase
            .from('messagesCS')
            .select('*')
            .eq('chat_id', data.chat_id)
            .order('created_at', { ascending: true });

          if (msgs) {
            const mapped = msgs.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.message,
              realSender: m.sender
            }));
            setMessages(prev => {
                const init = [...prev];
                // Add a divider or just replace if we want to show history.
                // For simplicity, replace all but first.
                return [init[0], ...mapped];
            });
          }
        }
      };
      checkActiveSession();
    }
  }, [sessionUser]);

  // Realtime subscription for messages & chat status
  useEffect(() => {
    if (!chatSession) return;

    const messageSub = supabase
      .channel('messagesCS_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messagesCS', filter: \`chat_id=eq.\${chatSession}\` }, payload => {
        const newMsg = payload.new;
        if (newMsg.sender !== 'user') { // Only add non-user messages (we optimistically add user msgs)
           setMessages(prev => [...prev, { role: 'assistant', content: newMsg.message, realSender: newMsg.sender }]);
        }
      })
      .subscribe();

    const chatSub = supabase
      .channel('chatsCS_channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chatsCS', filter: \`chat_id=eq.\${chatSession}\` }, async payload => {
        const updated = payload.new;
        setCsStatus(updated.status);
        if (updated.status === 'active' && updated.assigned_to) {
             const { data: csUser } = await supabase.from('usersCS').select('name').eq('id', updated.assigned_to).single();
             if (csUser) setCsAssigned(csUser.name);
        } else if (updated.status === 'closed') {
             setChatSession(null);
             setCsStatus('none');
             setCsAssigned(null);
             setMessages(prev => [...prev, { role: 'assistant', content: 'Sesi chat dengan CS telah diakhiri. Kembali ke Asisten AI.' }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSub);
      supabase.removeChannel(chatSub);
    };
  }, [chatSession]);
`
);

// handleSend update
content = content.replace(
  `  const handleSend = async () => {`,
  `  const handleSend = async () => {
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
`
);

content = content.replace(
  `      const botMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {`,
  `      const botMessage = response.data.choices[0].message;

      // Try to parse if it's an escalation JSON
      let isEscalation = false;
      try {
          const parsed = JSON.parse(botMessage.content);
          if (parsed.escalate) {
              isEscalation = true;
              handleEscalation(parsed.summary, parsed.reason);
          }
      } catch (e) {
          // Not json, normal message
      }

      if (!isEscalation) {
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {`
);

// Escalation handler
content = content.replace(
  `  if (isHidden) return null;`,
  `  const handleEscalation = async (summary, reason) => {
      if (!sessionUser) {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Anda perlu login terlebih dahulu untuk berbicara dengan Customer Service.' }]);
          setIsLoading(false);
          return;
      }

      try {
          const { data: newChat, error } = await supabase.from('chatsCS').insert({
              user_id: sessionUser.id,
              summary: summary || 'Permintaan CS',
              reason: reason || 'User meminta eskalasi',
              status: 'waiting'
          }).select().single();

          if (error) throw error;

          setChatSession(newChat.chat_id);
          setCsStatus('waiting');

          // Save context to messagesCS
          const recentContext = messages.slice(-5).map(m => \`\${m.role === 'user' ? 'User' : 'AI'}: \${m.content}\`).join('\\n');
          await supabase.from('messagesCS').insert({
              chat_id: newChat.chat_id,
              sender: 'ai',
              message: \`[AI Context]\\n\${recentContext}\`
          });

          setMessages(prev => [...prev, { role: 'assistant', content: 'Mohon tunggu sebentar, Anda sedang disambungkan ke Customer Service. Anda berada di antrian.' }]);
      } catch (err) {
          console.error("Escalation error:", err);
          setMessages(prev => [...prev, { role: 'assistant', content: 'Gagal menghubungi CS. Silakan coba lagi.' }]);
      }
  };

  if (isHidden) return null;`
);

// Header UI update
content = content.replace(
  `<Text fontSize="10px" opacity={0.8}>Aktif • Didukung oleh Groq</Text>`,
  `{csStatus === 'waiting' ? (
    <Text fontSize="10px" opacity={0.8} color="yellow.200">Menunggu CS...</Text>
  ) : csStatus === 'active' ? (
    <Text fontSize="10px" opacity={0.8} color="green.200">Terhubung dengan CS {csAssigned}</Text>
  ) : (
    <Text fontSize="10px" opacity={0.8}>Aktif • Didukung oleh Groq</Text>
  )}`
);

content = content.replace(
  `<FaRobot />`,
  `{csStatus !== 'none' ? <FaUserHeadset size={20} /> : <FaRobot size={20} />}`
);

// Input disabled when waiting
content = content.replace(
  `<chakra.input
                    flex={1}`,
  `<chakra.input
                    isDisabled={csStatus === 'waiting'}
                    flex={1}`
);

// Bubble sender UI update
content = content.replace(
  `<Text whiteSpace="pre-wrap">{msg.content}</Text>`,
  `<Text whiteSpace="pre-wrap">
     {msg.realSender && msg.realSender !== 'user' && msg.realSender !== 'ai' ? (
         <Box as="span" fontWeight="bold" display="block" fontSize="xs" mb={1} color="blue.500">
             CS {csAssigned || 'Admin'}
         </Box>
     ) : null}
     {msg.content}
   </Text>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Chatbot.js patched');
