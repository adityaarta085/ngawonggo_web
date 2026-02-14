import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';

const Demografi = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('village_stats').select('*').order('id', { ascending: true });
      if (!error && data) setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Demografi Penduduk
      </Text>
      <Text>
        Berdasarkan data statistik terbaru, profil kependudukan Desa Ngawonggo adalah sebagai berikut:
      </Text>
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
