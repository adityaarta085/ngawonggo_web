
import { Box, Flex, Text, Divider } from '@chakra-ui/react';
import NgawonggoLogo from '../../../components/NgawonggoLogo';
import DownloadSection from './DownloadSection';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

const LogoDesa = () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'profil_makna_logo').single()
      .then(({data}) => { if(data) setContent(data.value) });
  }, []);

  return (
    <Flex fontFamily="heading" flexDirection="column" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Logo Desa
      </Text>
      <Box display="flex" justifyContent="center" p={10}>
        <NgawonggoLogo
          fontSize={{ base: "40px", md: "60px", lg: "80px" }}
          iconSize={{ base: 20, md: 40, lg: 60 }}
          color="green.500"
          flexDirection="column"
        />
      </Box>
      <Box>
        <Text fontSize="25px">Makna Logo Kabupaten Magelang</Text>
        <Box mt={2} dangerouslySetInnerHTML={{ __html: content }} />
      </Box>

      <Divider my={10} />

      <DownloadSection />
    </Flex>
  );
};
export default LogoDesa;
