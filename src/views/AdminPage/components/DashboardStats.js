import React, { useEffect, useState } from 'react';
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  VStack,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';
import { FaUsers, FaEye, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '../../../lib/supabase';

const DashboardStats = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [dailyViews, setDailyViews] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Fetch total views
      const { count, error: countError } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      if (!countError) setTotalViews(count);

      // Fetch views per day (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: viewsData, error: viewsError } = await supabase
        .from('page_views')
        .select('viewed_at')
        .gte('viewed_at', sevenDaysAgo.toISOString());

      if (!viewsError) {
        const countsByDay = {};
        viewsData.forEach(v => {
          const date = new Date(v.viewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          countsByDay[date] = (countsByDay[date] || 0) + 1;
        });
        const chartData = Object.keys(countsByDay).map(date => ({ date, views: countsByDay[date] }));
        setDailyViews(chartData);
      }

      // Fetch top pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('page_views')
        .select('page_path');

      if (!pagesError) {
        const pageCounts = {};
        pagesData.forEach(p => {
          pageCounts[p.page_path] = (pageCounts[p.page_path] || 0) + 1;
        });
        const sortedPages = Object.keys(pageCounts)
          .map(path => ({ path, count: pageCounts[path] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopPages(sortedPages);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <VStack spacing={8} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard label="Total Kunjungan" number={totalViews} icon={FaEye} color="blue.500" />
        <StatCard label="Kunjungan Hari Ini" number={dailyViews[dailyViews.length - 1]?.views || 0} icon={FaCalendarAlt} color="green.500" />
        <StatCard label="Halaman Aktif" number={topPages.length} icon={FaFileAlt} color="purple.500" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
          <Heading size="sm" mb={6}>Statistik Pengunjung (7 Hari Terakhir)</Heading>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3182ce" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
          <Heading size="sm" mb={6}>Halaman Paling Banyak Dikunjungi</Heading>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Path Halaman</Th>
                <Th isNumeric>Kunjungan</Th>
              </Tr>
            </Thead>
            <Tbody>
              {topPages.map((page, index) => (
                <Tr key={index}>
                  <Td fontWeight="600">{page.path}</Td>
                  <Td isNumeric>{page.count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

const StatCard = ({ label, number, icon, color }) => (
  <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
    <Stat>
      <HStack justify="space-between">
        <Box>
          <StatLabel color="gray.500" fontWeight="bold">{label}</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="extrabold">{number}</StatNumber>
        </Box>
        <Icon as={icon} w={10} h={10} color={color} opacity={0.3} />
      </HStack>
    </Stat>
  </Box>
);

export default DashboardStats;
