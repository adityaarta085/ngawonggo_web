with open('src/views/LayananPage/ComplaintSystem.js', 'r') as f:
    content = f.read()

handle_start_complaint = """
  const handleStartComplaint = async (e) => {
    e.preventDefault();
    if (!name || !contact || !newMessage) return;

    setLoading(true);
    const newId = generateComplaintId();

    try {
      const { error: cError } = await supabase
        .from('complaints')
        .insert([{
          id: newId,
          name: name,
          contact: contact,
          category: category,
          user_id: user?.id || null
        }]);

      if (cError) throw cError;

      const { error: mError } = await supabase
        .from('complaint_messages')
        .insert([{
          complaint_id: newId,
          sender_type: 'user',
          message: newMessage
        }]);

      if (mError) throw mError;

      setComplaintId(newId);
      localStorage.setItem('complaint_id', newId);
      setNewMessage('');

      if (contact.includes('@')) {
        try {
          await axios.post('/api/broadcast', {
            to: contact,
            subject: 'Pengaduan Diterima - Desa Ngawonggo',
            content: `<h2>Halo ${name},</h2><p>Pengaduan Anda dengan ID <b>${newId}</b> kategori <b>${category}</b> telah kami terima dan akan segera ditindaklanjuti.</p><p>Terima kasih!</p>`
          });
        } catch(err) {
          console.error("Failed to send auto email:", err);
        }
      }

    } catch (err) {
      toast({ title: 'Gagal membuat pengaduan', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };
"""

import re
content = re.sub(r'const handleStartComplaint = async \(e\) => \{[\s\S]*?setLoading\(false\);\n    \}\n  \};', handle_start_complaint.strip(), content)

with open('src/views/LayananPage/ComplaintSystem.js', 'w') as f:
    f.write(content)
