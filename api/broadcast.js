const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, content } = req.body;

  if (!to || !subject || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Gmail SMTP Configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'noreply.ngawonggo@gmail.com',
      pass: 'cccu iodg zvqi afdn',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Desa Ngawonggo" <noreply.ngawonggo@gmail.com>',
      to: to,
      subject: subject,
      html: content,
    });

    return res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
