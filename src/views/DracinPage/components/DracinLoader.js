import React from 'react';
import { Center, Spinner, VStack, Text } from '@chakra-ui/react';
import { dracinTheme } from '../theme';

export const DracinLoader = () => (
    <Center h="100%" w="100%" bg={dracinTheme.bg}>
        <VStack spacing={4}>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.800" color={dracinTheme.accentRed} size="xl" />
            <Text color={dracinTheme.accentGold} fontWeight="bold" letterSpacing="widest">MEMUAT...</Text>
        </VStack>
    </Center>
);
