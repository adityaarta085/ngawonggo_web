
import { AspectRatio, Flex, Text, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getList } from '../../../lib/dataFetcher';

const DataWilayah = () => {
  const [content, setContent] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data: allSettings } = await getList('site_settings', { limit: 1000 });
      const data = allSettings?.filter(s => ['profil_data_wilayah', 'profil_data_wilayah_map'].includes(s.key));
      if(data) {
        data.forEach(d => {
          if(d.key === 'profil_data_wilayah') setContent(d.value);
          if(d.key === 'profil_data_wilayah_map') setMapUrl(d.value);
        });
      }
    };
    fetch();
  }, []);

  return (
    <Flex direction={'column'}>
      <Text fontFamily="heading" fontWeight="600" fontSize="35px">
        Data Wilayah
      </Text>
      <Box fontFamily="heading" dangerouslySetInnerHTML={{ __html: content }} />
      {mapUrl && (
        <AspectRatio ratio={16 / 9} my={5} maxWidth={{ base: '500px', lg: '700px' }}>
          <iframe src={mapUrl} title="embed_location" />
        </AspectRatio>
      )}
    </Flex>
  );
};
export default DataWilayah;
