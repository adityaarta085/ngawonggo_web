
import { Flex, Text, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

const KondisiGeo = () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'profil_kondisi_geo').single()
      .then(({data}) => { if(data) setContent(data.value) });
  }, []);

  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Kondisi Geografis
      </Text>
      <Box dangerouslySetInnerHTML={{ __html: content }} />
    </Flex>
  );
};
export default KondisiGeo;
