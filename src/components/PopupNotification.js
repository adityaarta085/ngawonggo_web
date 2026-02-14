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
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

const PopupNotification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [popups, setPopups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchPopups = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Check session storage to see if popups already shown
        const sessionShown = sessionStorage.getItem('popups_shown');
        if (!sessionShown) {
          setPopups(data);
          setCurrentIndex(0);
          onOpen();
        }
      }
    } catch (err) {
      console.error('Error fetching popups:', err);
    }
  }, [onOpen]);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const handleClose = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      sessionStorage.setItem('popups_shown', 'true');
      onClose();
    }
  };

  if (popups.length === 0 || currentIndex >= popups.length) return null;

  const currentPopup = popups[currentIndex];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.100">
          {currentPopup.title || 'Pengumuman Penting'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          {currentPopup.type === 'image' ? (
            <Image
              src={currentPopup.content}
              alt={currentPopup.title}
              w="100%"
              objectFit="cover"
            />
          ) : (
            <Text p={6} fontSize="md">
              {currentPopup.content}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            {currentPopup.button_link && (
              <Button
                as="a"
                href={currentPopup.button_link}
                target="_blank"
                colorScheme="blue"
              >
                {currentPopup.button_label || 'Kunjungi'}
              </Button>
            )}
            <Button colorScheme="brand" onClick={handleClose}>
              {currentIndex < popups.length - 1 ? 'Berikutnya' : 'Tutup'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupNotification;
