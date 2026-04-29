import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  Box,
  Image,
  Spinner
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const packages = [
  { id: 'coin_small', name: '100 Koin', price: 10000, coins: 100 },
  { id: 'coin_medium', name: '500 Koin', price: 45000, coins: 500 },
  { id: 'tier_vip', name: 'VIP 1 Bulan', price: 50000, tier: 'VIP' }
];

const TopUpModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [qrisData, setQrisData] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const handlePurchase = async (pkg) => {
    setLoading(true);
    setSelectedPkg(pkg);
    try {
      // 1. Call Qrispy API to generate payment
      const res = await fetch(`/api/qrispy?action=createpayment&amount=${pkg.price}`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data.status === 'success' && data.data) {
        setQrisData(data.data);

        // 2. Log pending transaction in DB
        await supabase.from('transactions').insert({
          user_id: user.id,
          amount: pkg.price,
          currency_type: pkg.coins ? 'coins' : pkg.tier ? 'tier' : 'unknown',
          quantity: pkg.coins || 1,
          payment_method: 'QRIS',
          status: 'pending'
        });

      } else {
        throw new Error("Gagal membuat QRIS");
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Gagal memproses pembayaran.", status: "error" });
      setLoading(false);
      setSelectedPkg(null);
    }
  };

  const handleSimulateSuccess = async () => {
    // THIS IS A MOCK FOR TESTING SINCE WE DON'T HAVE WEBHOOK SETUP YET
    setLoading(true);
    try {
      if (selectedPkg.coins) {
        await supabase.rpc('admin_update_currency', {
           target_user_id: user.id,
           p_coins_delta: selectedPkg.coins
        });
      } else if (selectedPkg.tier) {
         await supabase.rpc('admin_update_tier', {
           target_user_id: user.id,
           p_tier_name: selectedPkg.tier,
           p_expires_in_days: 30
        });
      }

      toast({ title: "Berhasil!", description: "Pembelian berhasil (Simulasi).", status: "success" });
      onClose();
    } catch (err) {
       toast({ title: "Error", description: "Gagal simulasi sukses.", status: "error" });
    } finally {
      setLoading(false);
      setQrisData(null);
      setSelectedPkg(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent layerStyle="glassCard">
        <ModalHeader textAlign="center">Toko / Top Up</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {!qrisData ? (
             <VStack spacing={4}>
               {packages.map((pkg) => (
                 <HStack key={pkg.id} w="full" justify="space-between" p={4} borderWidth={1} borderRadius="lg">
                   <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{pkg.name}</Text>
                      <Text color="gray.500" fontSize="sm">Rp {pkg.price.toLocaleString('id-ID')}</Text>
                   </VStack>
                   <Button
                      size="sm"
                      colorScheme="brand"
                      onClick={() => handlePurchase(pkg)}
                      isLoading={loading && selectedPkg?.id === pkg.id}
                    >
                     Beli
                   </Button>
                 </HStack>
               ))}
             </VStack>
          ) : (
            <VStack spacing={4}>
               <Text fontWeight="bold">Scan QRIS untuk Bayar</Text>
               <Text>{selectedPkg?.name} - Rp {selectedPkg?.price.toLocaleString('id-ID')}</Text>
               {qrisData.qris_url ? (
                  <Image src={qrisData.qris_url} alt="QRIS" boxSize="250px" objectFit="contain" />
               ) : (
                  <Box p={4} bg="gray.100" borderRadius="md"><Text>QR String: {qrisData.qris_string}</Text></Box>
               )}
               <HStack>
                 <Button onClick={() => setQrisData(null)}>Batal</Button>
                 <Button colorScheme="green" onClick={handleSimulateSuccess} isLoading={loading}>Simulasi Sukses (Dev)</Button>
               </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TopUpModal;
