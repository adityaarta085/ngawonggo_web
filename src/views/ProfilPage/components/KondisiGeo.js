
import { Flex, Text, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getByColumn } from '../../../lib/dataFetcher';

const KondisiGeo = () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    getByColumn('site_settings', 'key', 'profil_kondisi_geo').then(({ data }) => ({ data }))
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
