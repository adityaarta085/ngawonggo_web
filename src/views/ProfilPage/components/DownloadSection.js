import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import NgawonggoLogo from '../../../components/NgawonggoLogo';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';

const DownloadSection = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const t = translations[language].profile;

  const logoRef = useRef(null);
  const splashRef = useRef(null);
  const combinedRef = useRef(null);

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const downloadPNG = async (ref, filename) => {
    try {
      setLoading(true);
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(t.success);
    } catch (err) {
      console.error(err);
      showToast(t.error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (ref, filename) => {
    try {
      setLoading(true);
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.setFontSize(18);
      pdf.text('Aset Resmi Desa Ngawonggo', 10, 20);
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);

      showToast(t.success);
    } catch (err) {
      console.error(err);
      showToast(t.error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async (filename) => {
    setLoading(true);
    showToast(language === 'id' ? "Merekam Animasi..." : "Recording Animation...", "info");

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(30);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.webm`;
        link.click();
        setLoading(false);
        showToast(t.success);
      };

      recorder.start();

      let startTime = null;
      const drawFrame = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;

        if (elapsed > 4) {
          recorder.stop();
          return;
        }

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - 50);
        const scale = 5 + Math.sin(elapsed * 3) * 0.3;
        ctx.scale(scale, scale);

        ctx.fillStyle = '#137fec';
        const p = new Path2D('M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z');
        ctx.translate(-12, -12);
        ctx.fill(p);
        ctx.restore();

        ctx.fillStyle = '#137fec';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Desa Ngawonggo', canvas.width / 2, canvas.height / 2 + 120);

        ctx.fillStyle = '#666';
        ctx.font = '20px Arial';
        ctx.fillText('MADE WITH SMK MUHAMMADIYAH BANDONGAN 2026 TJKT A', canvas.width / 2, canvas.height / 2 + 180);

        if (recorder.state === 'recording') {
          requestAnimationFrame(drawFrame);
        }
      };
      requestAnimationFrame(drawFrame);

    } catch (e) {
      console.error(e);
      setLoading(false);
      showToast(t.error, 'error');
    }
  };

  return (
    <Paper elevation={0} sx={{ mt: 4, p: { xs: 3, md: 4 }, borderRadius: '32px', border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>{t.downloadTitle}</Typography>
          <Typography variant="body2" color="text.secondary">{t.downloadSubtitle}</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box ref={logoRef} sx={{ p: 2, bgcolor: 'white', borderRadius: '16px', mb: 2, border: '1px solid', borderColor: 'divider' }}>
                <NgawonggoLogo iconSize={40} fontSize="1.25rem" flexDirection="column" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>{t.logo}</Typography>
              <Stack spacing={1.5} sx={{ width: '100%', mt: 'auto' }}>
                <Button fullWidth startIcon={<DownloadIcon />} variant="contained" onClick={() => downloadPNG(logoRef, 'Logo_Desa_Ngawonggo')} disabled={loading}>
                  {t.asImage}
                </Button>
                <Button fullWidth variant="outlined" onClick={() => downloadPDF(logoRef, 'Logo_Desa_Ngawonggo')} disabled={loading}>
                  {t.asPDF}
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box ref={splashRef} sx={{ p: 3, bgcolor: 'white', borderRadius: '16px', mb: 2, border: '1px solid', borderColor: 'divider', width: '100%' }}>
                 <NgawonggoLogo iconSize={32} fontSize="1rem" flexDirection="column" />
                 <Typography sx={{ fontSize: '8px', mt: 2, color: 'grey.400', fontWeight: 800 }}>MADE WITH SMK MUHAMMADIYAH BANDONGAN 2026 TJKT A</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>{t.splash}</Typography>
              <Stack spacing={1.5} sx={{ width: '100%', mt: 'auto' }}>
                <Button fullWidth startIcon={<DownloadIcon />} variant="contained" color="secondary" onClick={() => downloadPNG(splashRef, 'Splash_Screen_Ngawonggo')} disabled={loading}>
                  {t.asImage}
                </Button>
                <Button fullWidth variant="contained" color="error" onClick={() => downloadVideo('Splash_Animation_Ngawonggo')} disabled={loading}>
                  {t.asVideo}
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box ref={combinedRef} sx={{ p: 3, bgcolor: 'white', borderRadius: '16px', mb: 2, border: '1px solid', borderColor: 'divider', width: '100%' }}>
                <Stack spacing={2} alignItems="center">
                   <NgawonggoLogo iconSize={24} fontSize="0.75rem" />
                   <Stack direction="row" spacing={3}>
                      <Box component="img" src="https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png" sx={{ height: 24, objectFit: 'contain' }} />
                      <Box component="img" src="https://but.co.id/wp-content/uploads/2023/09/Logo-SPBE.png" sx={{ height: 24, objectFit: 'contain' }} />
                   </Stack>
                </Stack>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>{t.combined}</Typography>
              <Stack spacing={1.5} sx={{ width: '100%', mt: 'auto' }}>
                <Button fullWidth startIcon={<DownloadIcon />} variant="contained" color="info" onClick={() => downloadPNG(combinedRef, 'Logo_Bundel_Ngawonggo')} disabled={loading}>
                  {t.asImage}
                </Button>
                <Button fullWidth variant="outlined" color="info" onClick={() => downloadPDF(combinedRef, 'Logo_Bundel_Ngawonggo')} disabled={loading}>
                  {t.asPDF}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default DownloadSection;
