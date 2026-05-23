import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

const AdSenseComponent = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <Box w="100%" display="flex" justifyContent="center" my={4} overflow="hidden">
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%' }}
           data-ad-client="ca-pub-2190305679534890"
           data-ad-slot="9434422911"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </Box>
  );
};

export default AdSenseComponent;
