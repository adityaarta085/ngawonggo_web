import React, { useState, useEffect } from 'react';
import {
  Table, Box, Thead, Tbody, Tr, Th, Td, Button, useToast, Select, HStack, Text
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';

const MonetizationManager = () => {
  const [users, setUsers] = useState([]);

  const toast = useToast();

  const fetchUsers = async () => {

    try {
        // We use the existing RPC to get all users, then we will fetch their monetizaton data
        // For a real large app, this needs a proper JOIN query or RPC, but for now we fetch basics
        const { data: authUsers, error: authErr } = await supabase.rpc('get_all_users');
        if (authErr) throw authErr;

        const { data: tiers } = await supabase.from('user_tiers').select('*');
        const { data: currencies } = await supabase.from('user_currencies').select('*');

        const merged = authUsers.map(u => ({
            ...u,
            tier: tiers?.find(t => t.user_id === u.id)?.tier_name || 'Free',
            coins: currencies?.find(c => c.user_id === u.id)?.coins || 0,
            tickets: currencies?.find(c => c.user_id === u.id)?.tickets || 0,
        }));

        setUsers(merged);
    } catch (err) {
        console.error(err);
        toast({ title: 'Error fetching data', status: 'error' });
    } finally {

    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateTier = async (userId, newTier) => {
      try {
          await supabase.rpc('admin_update_tier', { target_user_id: userId, p_tier_name: newTier });
          toast({ title: 'Tier updated', status: 'success' });
          fetchUsers();
      } catch (err) {
          toast({ title: 'Error updating tier', status: 'error' });
      }
  };

  const handleAddCoins = async (userId, amount) => {
      try {
          await supabase.rpc('admin_update_currency', { target_user_id: userId, p_coins_delta: parseInt(amount) });
          toast({ title: 'Coins added', status: 'success' });
          fetchUsers();
      } catch (err) {
           toast({ title: 'Error adding coins', status: 'error' });
      }
  }

  return (
    <Box>
      <Text fontSize="2xl" mb={4} fontWeight="bold">Monetization & Tier Management</Text>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Current Tier</Th>
              <Th>Action (Tier)</Th>
              <Th>Coins</Th>
              <Th>Action (Coins)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>{user.tier}</Td>
                <Td>
                  <Select size="sm" defaultValue={user.tier} onChange={(e) => handleUpdateTier(user.id, e.target.value)}>
                      <option value="Free">Free</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="VIP">VIP</option>
                  </Select>
                </Td>
                <Td>{user.coins}</Td>
                <Td>
                    <HStack>
                        <Button size="xs" colorScheme="green" onClick={() => handleAddCoins(user.id, 100)}>+100</Button>
                        <Button size="xs" colorScheme="red" onClick={() => handleAddCoins(user.id, -100)}>-100</Button>
                    </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default MonetizationManager;
