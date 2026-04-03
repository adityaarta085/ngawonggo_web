import React from 'react';
import { Box } from '@chakra-ui/react';
import SEO from '../../components/SEO';

const BlockedPage = () => {
  return (
    <Box minH="100vh" w="100vw" overflow="hidden">
      <SEO
        title="Internet Baik"
        description="Situs ini telah diblokir."
      />
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html lang="id">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Internet Baik</title>
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

                  body {
                      margin: 0;
                      padding: 0;
                      font-family: 'Poppins', sans-serif;
                      background-color: #f8f9fa;
                      color: #333;
                      display: flex;
                      flex-direction: column;
                      min-height: 100vh;
                      text-align: center;
                  }

                  .header {
                      background-color: #fff;
                      padding: 20px;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                      display: flex;
                      justify-content: center;
                      align-items: center;
                  }

                  .img-header {
                      max-width: 100%;
                      height: auto;
                      border-radius: 10px;
                  }

                  .wrapper {
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      padding: 40px 20px;
                  }

                  .message-box {
                      background: white;
                      padding: 40px;
                      border-radius: 15px;
                      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                      max-width: 600px;
                      width: 100%;
                  }

                  .icon-warning {
                      font-size: 64px;
                      margin-bottom: 20px;
                  }

                  h1 {
                      color: #e53e3e;
                      font-size: 28px;
                      margin-bottom: 15px;
                  }

                  p {
                      font-size: 16px;
                      line-height: 1.6;
                      color: #666;
                      margin-bottom: 20px;
                  }

                  .btn-contact {
                      display: inline-block;
                      background-color: #3182ce;
                      color: white;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: 600;
                      transition: background-color 0.3s;
                  }

                  .btn-contact:hover {
                      background-color: #2b6cb0;
                  }

                  footer {
                      background-color: #2d3748;
                      color: white;
                      padding: 20px;
                      font-size: 14px;
                  }
              </style>
          </head>
          <body>
              <header class="header">
                  <img alt="Internet Baik" class="img-header" src="https://internetbaik.telkomsel.com/asset/images/Header-Desktop.png" onerror="this.src='https://via.placeholder.com/800x200?text=Internet+Baik'">
              </header>

              <div class="wrapper">
                  <div class="message-box">
                      <div class="icon-warning">⚠️</div>
                      <h1>Situs Diblokir</h1>
                      <p>Mohon maaf, akses ke situs ini diblokir sementara karena terindikasi mengandung konten yang melanggar peraturan atau sedang dalam perbaikan terkait masalah kepatuhan.</p>
                      <p>Situs ini dialihkan ke laman <strong>Internet Baik</strong>.</p>
                      <a href="mailto:admin@desa.com" class="btn-contact">Hubungi Administrator</a>
                  </div>
              </div>

              <footer>
                  <p>&copy; 2026 Internet Baik - Transparansi & Keamanan</p>
              </footer>
          </body>
          </html>
        `}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="Blocked Site"
      />
    </Box>
  );
};

export default BlockedPage;
