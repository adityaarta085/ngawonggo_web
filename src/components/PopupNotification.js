import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

const PopupNotification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [popupData, setPopupData] = useState(null);

  const fetchPopup = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setPopupData(data);
        // Check if already shown in this session
        const lastShown = sessionStorage.getItem('last_popup_id');
        if (lastShown !== data.id.toString()) {
          onOpen();
          sessionStorage.setItem('last_popup_id', data.id.toString());
        }
      }
    } catch (err) {
      console.error('Error fetching popup:', err);
    }
  }, [onOpen]);

  useEffect(() => {
    fetchPopup();
  }, [fetchPopup]);

  if (!popupData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.100">
          {popupData.title || 'Pengumuman Penting'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          {popupData.type === 'image' ? (
            <Image
              src={popupData.content}
              alt={popupData.title}
              w="100%"
              objectFit="cover"
            />
          ) : (
            <Text p={6} fontSize="md">
              {popupData.content}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupNotification;
