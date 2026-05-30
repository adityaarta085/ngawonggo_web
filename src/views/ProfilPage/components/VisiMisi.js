
import { Flex, Text, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getList } from '../../../lib/dataFetcher';

const VisiMisi = () => {
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data: allSettings } = await getList('site_settings', { limit: 1000 });
      const data = allSettings?.filter(s => ['profil_visi', 'profil_misi'].includes(s.key));
      if(data) {
        data.forEach(d => {
          if(d.key === 'profil_visi') setVisi(d.value);
          if(d.key === 'profil_misi') setMisi(d.value);
        });
      }
    };
    fetch();
  }, []);

  return (
    <Flex flexDirection="column">
      <Box my={5}>
        <Text fontFamily="heading" fontWeight="600" fontSize="35px">
          Visi Misi
        </Text>
        <Text fontFamily="heading" fontSize="25px">
          Visi
        </Text>
        <Box fontFamily="heading" dangerouslySetInnerHTML={{ __html: visi }} />
      </Box>
      <Box>
        <Text fontFamily="heading" fontSize="25px">
          Misi
        </Text>
        <Box fontFamily="heading" dangerouslySetInnerHTML={{ __html: misi }} />
      </Box>
    </Flex>
  );
};
export default VisiMisi;
