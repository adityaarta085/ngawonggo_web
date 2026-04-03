with open('src/views/AdminPage/components/UserManager.js', 'r') as f:
    content = f.read()

handle_ai_beautify_old = """
  const handleAiBeautify = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        messages: [{ role: 'user', content: `Buatkan HTML email menarik dan profesional berdasarkan instruksi berikut: ${aiPrompt}. HANYA BERIKAN KODE HTML SAJA TANPA MARKDOWN.` }]
      });
      setEmailContent(response.data.message);
      toast({ title: 'Email digenerate dengan AI', status: 'success' });
    } catch (error) {
      toast({ title: 'Gagal menggunakan AI', description: error.message, status: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };
"""

handle_ai_beautify_new = """
  const handleAiBeautify = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        messages: [{ role: 'user', content: `Buatkan HTML email menarik dan profesional berdasarkan instruksi berikut: ${aiPrompt}. HANYA BERIKAN KODE HTML SAJA TANPA MARKDOWN (tanpa tag <html>, <body>, atau markdown backticks seperti \`\`\`html). Hanya konten di dalamnya saja.` }]
      });

      if (response.data?.choices?.[0]?.message?.content) {
        let aiContent = response.data.choices[0].message.content;
        aiContent = aiContent.replace(/```html/g, '').replace(/```/g, '').trim();
        setEmailContent(aiContent);
        toast({ title: 'Email digenerate dengan AI', status: 'success' });
      } else {
        throw new Error('Respons AI kosong');
      }
    } catch (error) {
      toast({ title: 'Gagal menggunakan AI', description: error.message, status: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };
"""

content = content.replace(handle_ai_beautify_old.strip(), handle_ai_beautify_new.strip())

with open('src/views/AdminPage/components/UserManager.js', 'w') as f:
    f.write(content)
