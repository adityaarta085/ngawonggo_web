with open('src/views/LayananPage/ComplaintSystem.js', 'r') as f:
    content = f.read()

import_axios = "import axios from 'axios';"

if "import axios" not in content:
    content = content.replace("import { Link as RouterLink } from 'react-router-dom';", "import { Link as RouterLink } from 'react-router-dom';\nimport axios from 'axios';")

# Find handleStartComplaint and modify it to send an email notification
handle_start_complaint = """
  const handleStartComplaint = async (e) => {
    e.preventDefault();
    if (!name || !contact) return;

    setLoading(true);
    const id = generateComplaintId();

    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        id,
        name,
        contact,
        category,
        status: 'open'
      }])
      .select()
      .single();

    if (!error && data) {
      localStorage.setItem('complaint_id', id);
      setComplaintId(id);
      setComplaintData(data);

      // Auto email notification if email is provided
      if (contact.includes('@')) {
        try {
          await axios.post('/api/broadcast', {
            to: contact,
            subject: 'Pengaduan Diterima - Desa Ngawonggo',
            content: `<h2>Halo ${name},</h2><p>Pengaduan Anda dengan ID <b>${id}</b> kategori <b>${category}</b> telah kami terima dan akan segera ditindaklanjuti.</p><p>Terima kasih!</p>`
          });
        } catch(err) {
          console.error("Failed to send auto email:", err);
        }
      }
    }
    setLoading(false);
  };
"""

import re
content = re.sub(r'const handleStartComplaint = async \(e\) => \{[\s\S]*?setLoading\(false\);\n  \};', handle_start_complaint.strip(), content)

with open('src/views/LayananPage/ComplaintSystem.js', 'w') as f:
    f.write(content)

with open('src/views/AdminPage/components/ComplaintManager.js', 'r') as f:
    admin_content = f.read()

if "import axios" not in admin_content:
    admin_content = admin_content.replace("import { uploadDeline } from '../../../lib/uploader';", "import { uploadDeline } from '../../../lib/uploader';\nimport axios from 'axios';")

mark_resolved = """
  const markResolved = async (id) => {
    const { error } = await supabase.from('complaints').update({ status: 'resolved' }).eq('id', id);
    if (!error) {
      toast({ title: 'Selesai', status: 'success' });
      fetchComplaints();
      if(selectedComplaint?.id === id) setSelectedComplaint({...selectedComplaint, status: 'resolved'});

      const comp = complaints.find(c => c.id === id);
      if (comp && comp.contact && comp.contact.includes('@')) {
        try {
          await axios.post('/api/broadcast', {
            to: comp.contact,
            subject: 'Pengaduan Selesai - Desa Ngawonggo',
            content: `<h2>Halo ${comp.name},</h2><p>Pengaduan Anda dengan ID <b>${id}</b> telah selesai ditindaklanjuti. Terima kasih atas partisipasi Anda.</p>`
          });
        } catch (err) {
          console.error('Failed to send completion email:', err);
        }
      }
    }
  };
"""

admin_content = re.sub(r'const markResolved = async \(id\) => \{[\s\S]*?if\(selectedComplaint\?\.id === id\) setSelectedComplaint\(\{.*?\}\);\n    \}\n  \};', mark_resolved.strip(), admin_content)

with open('src/views/AdminPage/components/ComplaintManager.js', 'w') as f:
    f.write(admin_content)
