import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, VStack, HStack, Icon, useToast, Badge } from '@chakra-ui/react';
import { FaRobot, FaCrown } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const AISummary = ({ newsId, type, content, initialSummary }) => {
  const [summary, setSummary] = useState(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);

  const [usageCount, setUsageCount] = useState(0);
  const autoTriggered = useRef(false);

  const toast = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);

        // Check VIP
        const { data: tierData } = await supabase
          .from('user_tiers')
          .select('tier_name')
          .eq('user_id', session.user.id)
          .single();

        const userIsVIP = tierData && tierData.tier_name !== 'Free';
        setIsVIP(userIsVIP);

        // Check Usage
        if (!userIsVIP && !initialSummary) {
          const today = new Date().toISOString().split('T')[0];
          const { data: usageData } = await supabase
            .from('user_feature_usage')
            .select('usage_count')
            .eq('user_id', session.user.id)
            .eq('feature_name', 'ai_summary')
            .eq('usage_date', today)
            .single();

          if (usageData) {
            setUsageCount(usageData.usage_count);
          }
        }
      }
    };
    checkUser();
  }, [initialSummary]);



  useEffect(() => {
    // Auto-generate if summary is not present, user exists, and they have quota
    if (!summary && !initialSummary && user && !loading && !autoTriggered.current) {
      if (isVIP || usageCount < 1) {
        autoTriggered.current = true;
        handleGenerate();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isVIP, usageCount, initialSummary, summary, loading]);


  const handleGenerate = async () => {
    if (!user) {
      toast({ title: 'Silakan login', description: 'Anda harus login untuk menggunakan fitur ini.', status: 'warning' });
      return;
    }

    if (!isVIP && usageCount >= 1 && !summary) {
      toast({ title: 'Limit Tercapai', description: 'Fitur gratis hanya 1x per hari. Upgrade ke VIP.', status: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, type, content, userId: user.id })
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
        if (!data.cached && !isVIP) {
          setUsageCount(prev => prev + 1);
        }
      } else {
        toast({ title: 'Gagal', description: data.error, status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Error', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (summary) {
    return (
      <Box p={6} borderRadius="xl" bg={isVIP ? "linear-gradient(135deg, #1A202C 0%, #2D3748 100%)" : "blue.50"} border="1px solid" borderColor={isVIP ? "yellow.400" : "blue.200"} mb={8} boxShadow="md" position="relative" overflow="hidden">
        {isVIP && (
            <Box position="absolute" top="-10px" right="-10px" opacity={0.1}>
                <Icon as={FaCrown} w={24} h={24} color="yellow.400" />
            </Box>
        )}
        <HStack mb={4}>
          <Icon as={FaRobot} color={isVIP ? "yellow.400" : "blue.500"} w={6} h={6} />
          <Text fontWeight="bold" fontSize="lg" color={isVIP ? "yellow.400" : "blue.700"}>Ringkasan AI</Text>
          {isVIP && <Badge colorScheme="yellow" variant="solid" ml={2}>VIP</Badge>}
        </HStack>
        <Text color={isVIP ? "gray.200" : "gray.700"} lineHeight="1.8" fontStyle="italic">
          "{summary}"
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6} borderRadius="xl" bg="gray.50" _dark={{ bg: "gray.900" }} border="1px dashed" borderColor="gray.300" mb={8} textAlign="center">
      <VStack spacing={4}>
        <Icon as={FaRobot} color="gray.400" w={8} h={8} />
        <Box>
          <Text fontWeight="bold" color="gray.700">Terlalu panjang? Minta AI ringkaskan!</Text>
          <Text fontSize="sm" color="gray.500">
            {!user ? 'Login untuk menggunakan fitur ini.' : (
              isVIP ? 'Anda memiliki akses VIP tak terbatas.' : `Sisa kuota gratis hari ini: ${Math.max(0, 1 - usageCount)}/1`
            )}
          </Text>
        </Box>
        <Button
          colorScheme={isVIP ? "yellow" : "blue"}
          onClick={handleGenerate}
          isLoading={loading}
          leftIcon={isVIP ? <FaCrown /> : <FaRobot />}
          isDisabled={(!isVIP && usageCount >= 1) && user}
        >
          {(!isVIP && usageCount >= 1 && user) ? 'Limit Harian Habis' : 'Buat Ringkasan AI'}
        </Button>
      </VStack>
    </Box>
  );
};

export default AISummary;
