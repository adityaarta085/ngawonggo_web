import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

export default function AnalyticsManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: result, error: rpcError } = await supabase.rpc('get_analytics_summary');

        if (rpcError) throw rpcError;

        let workerTotal = 0;
        let fallbackTotal = 0;
        let otherTotal = 0;

        const sourceSummary = result.source_summary || [];

        sourceSummary.forEach(item => {
          if (item.source === 'worker') workerTotal += item.total;
          else if (item.source === 'supabase_fallback') fallbackTotal += item.total;
          else otherTotal += item.total;
        });

        const totalRequests = workerTotal + fallbackTotal + otherTotal;
        const workerPercentage = totalRequests > 0 ? (workerTotal / totalRequests) * 100 : 0;
        const fallbackPercentage = totalRequests > 0 ? (fallbackTotal / totalRequests) * 100 : 0;

        setData({
          ...result,
          worker_percentage: parseFloat(workerPercentage.toFixed(2)),
          fallback_percentage: parseFloat(fallbackPercentage.toFixed(2))
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Box p={6}><Spinner size="xl" /></Box>;
  if (error) return <Box p={6}><Alert status="error"><AlertIcon />{error}</Alert></Box>;
  if (!data) return null;

  const getWorkerStatusColor = (percentage) => {
    if (percentage >= 98) return 'green';
    if (percentage >= 90) return 'yellow';
    return 'red';
  };

  const statusColor = getWorkerStatusColor(data.worker_percentage);

  const totalRequests = (data.source_summary || []).reduce((acc, curr) => acc + curr.total, 0);

  return (
    <Box p={6}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Worker vs Supabase Analytics</Heading>
          <Badge colorScheme={statusColor} fontSize="1em" p={2} borderRadius="md">
            Worker Health: {data.worker_percentage}%
          </Badge>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: 'gray.800' }}>
            <Stat>
              <StatLabel>Total Requests (24h)</StatLabel>
              <StatNumber>{totalRequests}</StatNumber>
              <StatHelpText>
                Total requests via dataFetcher
              </StatHelpText>
            </Stat>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: 'gray.800' }}>
            <Stat>
              <StatLabel>Worker / D1</StatLabel>
              <StatNumber>{data.worker_percentage}%</StatNumber>
              <StatHelpText>
                <StatArrow type={data.worker_percentage >= 90 ? 'increase' : 'decrease'} />
                Target &gt;= 90%
              </StatHelpText>
            </Stat>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: 'gray.800' }}>
            <Stat>
              <StatLabel>Supabase Fallback</StatLabel>
              <StatNumber>{data.fallback_percentage}%</StatNumber>
              <StatHelpText>
                <StatArrow type={data.fallback_percentage <= 10 ? 'decrease' : 'increase'} />
                Target &lt;= 10%
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Box>
            <Heading size="md" mb={4}>Top Tables</Heading>
            <Box overflowX="auto" shadow="sm" borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: 'gray.800' }}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>Table</Th><Th isNumeric>Requests</Th></Tr>
                </Thead>
                <Tbody>
                  {data.top_tables.map((item, i) => (
                    <Tr key={i}><Td>{item.table}</Td><Td isNumeric>{item.total}</Td></Tr>
                  ))}
                  {data.top_tables.length === 0 && <Tr><Td colSpan={2} textAlign="center">No data</Td></Tr>}
                </Tbody>
              </Table>
            </Box>
          </Box>

          <Box>
            <Heading size="md" mb={4}>Fallback Reasons</Heading>
            <Box overflowX="auto" shadow="sm" borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: 'gray.800' }}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>Reason</Th><Th isNumeric>Count</Th></Tr>
                </Thead>
                <Tbody>
                  {data.fallback_reasons.map((item, i) => (
                    <Tr key={i}>
                      <Td><Text noOfLines={1}>{item.reason}</Text></Td>
                      <Td isNumeric>{item.total}</Td>
                    </Tr>
                  ))}
                  {data.fallback_reasons.length === 0 && <Tr><Td colSpan={2} textAlign="center">No data</Td></Tr>}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </SimpleGrid>

        <Box>
          <Heading size="md" mb={4}>Top Endpoints</Heading>
          <Box overflowX="auto" shadow="sm" borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: 'gray.800' }}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr><Th>Endpoint</Th><Th isNumeric>Requests</Th></Tr>
              </Thead>
              <Tbody>
                {data.top_endpoints.map((item, i) => (
                  <Tr key={i}><Td>{item.endpoint}</Td><Td isNumeric>{item.total}</Td></Tr>
                ))}
                {data.top_endpoints.length === 0 && <Tr><Td colSpan={2} textAlign="center">No data</Td></Tr>}
              </Tbody>
            </Table>
          </Box>
        </Box>

      </VStack>
    </Box>
  );
}
