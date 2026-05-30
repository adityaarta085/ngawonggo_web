import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { getList, getByColumn } from '../../../lib/dataFetcher';

const Demografi = () => {
  const [stats, setStats] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: statsData, ok: statsOk } = await getList('village_stats', { orderBy: 'id', order: 'asc', limit: 1000 });
      if (statsOk && statsData) setStats(statsData);

      const { data: descData, ok: descOk } = await getByColumn('site_settings', 'key', 'profil_demografi');
      if (descOk && descData) setDescription(descData.value);
    };
    fetchData();
  }, []);

  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Demografi Penduduk
      </Text>
      {description ? (
        <Box dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <Text>
          Berdasarkan data statistik terbaru, profil kependudukan Desa Ngawonggo adalah sebagai berikut:
        </Text>
      )}
      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table variant="simple">
          <Tbody>
            {stats.map(stat => (
              <Tr key={stat.id}>
                <Td fontWeight="bold">{stat.label}</Td>
                <Td>{stat.value}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Demografi;
