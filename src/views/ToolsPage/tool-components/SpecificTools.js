import React, { lazy, Suspense } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import ToolLayout from '../components/ToolLayout';

/* ─── Lazy-loaded sub-modules ─── */
const DateTimeTools = lazy(() => import('./specific/DateTimeTools'));
const FileTools = lazy(() => import('./specific/FileTools'));
const ImageColorTools = lazy(() => import('./specific/ImageColorTools'));
const WebTools = lazy(() => import('./specific/WebTools'));
const DevTools = lazy(() => import('./specific/DevTools'));
const MathTools = lazy(() => import('./specific/MathTools'));
const BusinessTools = lazy(() => import('./specific/BusinessTools'));
const SeoTools = lazy(() => import('./specific/SeoTools'));
const SecurityTools = lazy(() => import('./specific/SecurityTools'));
const RandomTools = lazy(() => import('./specific/RandomTools'));

/* ─── CONFIG → MODULE MAPPING ─── */
const dateTimeConfigs = ['worldClock', 'stopwatch', 'timer', 'calendar', 'dateDiff', 'addSubtract', 'timezone', 'timestamp', 'dayOfYear', 'schedule'];
const fileConfigs = ['pdfWord', 'wordPdf', 'jpgPdf', 'pngJpg', 'compressPdf', 'mergePdf', 'splitPdf', 'resizeImg', 'compressImg', 'rename', 'fileSize', 'fileQr', 'fileBase64'];
const imageColorConfigs = ['colorPicker', 'palette', 'gradient', 'cropper', 'bgRemove', 'favicon', 'logoSize', 'aspectRatio', 'hexRgb', 'contrast'];
const webConfigs = ['qrGenerator', 'urlShortener', 'urlEncode', 'utm', 'metaTag', 'ogPreview', 'robotsTxt', 'sitemap', 'httpStatus', 'redirect', 'dns', 'whois', 'ping', 'speedTest', 'ssl'];
const devConfigs = ['jsonFmt', 'jsonVal', 'xmlFmt', 'htmlFmt', 'cssFmt', 'jsFmt', 'minify', 'regex', 'jwt', 'base64', 'uuid', 'hash', 'loremApi', 'cron'];
const mathConfigs = ['graph', 'solver', 'average', 'median', 'probability', 'geometry', 'trigo', 'physics', 'periodic', 'formulas', 'exercise', 'flashcard'];
const businessConfigs = ['invoice', 'receipt', 'todo', 'notes', 'pomodoro', 'emailTpl', 'proposalTpl', 'checklist'];
const seoConfigs = ['keyword', 'metaTitle', 'metaDesc', 'heading', 'readability', 'plagiarism', 'outline', 'hashtag'];
const securityConfigs = ['passStrength', '2fa', 'hashCheck', 'emailLeak', 'urlSafe', 'secureNotes'];
const randomConfigs = ['team', 'wheel', 'dice', 'coin'];

const LoadingFallback = () => (
  <Center py={20}>
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
);

const SpecificTools = ({ tool }) => {
  const getComponent = () => {
    const cfg = tool.config;
    if (dateTimeConfigs.includes(cfg)) return <DateTimeTools tool={tool} />;
    if (fileConfigs.includes(cfg)) return <FileTools tool={tool} />;
    if (imageColorConfigs.includes(cfg)) return <ImageColorTools tool={tool} />;
    if (webConfigs.includes(cfg)) return <WebTools tool={tool} />;
    if (devConfigs.includes(cfg)) return <DevTools tool={tool} />;
    if (mathConfigs.includes(cfg)) return <MathTools tool={tool} />;
    if (businessConfigs.includes(cfg)) return <BusinessTools tool={tool} />;
    if (seoConfigs.includes(cfg)) return <SeoTools tool={tool} />;
    if (securityConfigs.includes(cfg)) return <SecurityTools tool={tool} />;
    if (randomConfigs.includes(cfg)) return <RandomTools tool={tool} />;
    return <Box p={8} textAlign="center" color="gray.500">Tool belum tersedia.</Box>;
  };

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<LoadingFallback />}>
        {getComponent()}
      </Suspense>
    </ToolLayout>
  );
};

export default SpecificTools;
