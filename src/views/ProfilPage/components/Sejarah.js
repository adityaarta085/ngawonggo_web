
import { Flex, Text, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getByColumn } from '../../../lib/dataFetcher';

const Sejarah = () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    getByColumn('site_settings', 'key', 'profil_sejarah').then(({ data }) => ({ data }))
      .then(({data}) => { if(data) setContent(data.value) });
  }, []);

  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Sejarah Desa
      </Text>
      <Box dangerouslySetInnerHTML={{ __html: content }} />
    </Flex>
  );
};
export default Sejarah;
