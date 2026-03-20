import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import eidPoster from '../assets/events/eid_1447h.png';

const SpecialEventPoster = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed, March is 2
    const currentDate = now.getDate();

    // Target: 19-23 March 2026
    const isTargetDate =
      currentYear === 2026 &&
      currentMonth === 2 &&
      currentDate >= 19 &&
      currentDate <= 23;

    if (isTargetDate) {
      const hasShown = sessionStorage.getItem('eid_poster_shown');
      if (!hasShown) {
        onOpen();
      }
    }
  }, [onOpen]);

  const handleClose = () => {
    sessionStorage.setItem('eid_poster_shown', 'true');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent bg="transparent" boxShadow="none" border="none">
        <ModalCloseButton color="white" zIndex={10} />
        <ModalBody p={0}>
          <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
            <Image
              src={eidPoster}
              alt="Selamat Hari Raya Idul Fitri 1447H"
              w="100%"
              h="auto"
              objectFit="contain"
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SpecialEventPoster;
