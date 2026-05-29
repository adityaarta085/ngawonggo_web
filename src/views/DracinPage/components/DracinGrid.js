import React from 'react';
import { Box, SimpleGrid, Text, Image, LinkBox, LinkOverlay, Badge } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dracinTheme } from '../theme';

const MotionLinkBox = motion(LinkBox);

export const DracinGrid = ({ items, emptyMessage = "Tidak ada data." }) => {
    if (!items || items.length === 0) return <Text color={dracinTheme.textSecondary}>{emptyMessage}</Text>;

    return (
        <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={6} mb={10}>
        {items.map((item, idx) => {
            const title = item.title;
            const slug = item.collection_id;
            const image = item.cover || 'https://via.placeholder.com/300x450?text=No+Image';

            return (
                <MotionLinkBox
                    key={idx}
                    as="article"
                    rounded="xl"
                    overflow="hidden"
                    boxShadow={`0 4px 20px rgba(0,0,0,0.5)`}
                    bg={dracinTheme.cardBg}
                    border={`1px solid ${dracinTheme.glassBorder}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                <Box position="relative">
                    <Image src={image} alt={title} objectFit="cover" h="250px" w="100%" loading="lazy" fallbackSrc="https://via.placeholder.com/300x450?text=Loading..." />
                    {item.total_episodes && (
                        <Badge position="absolute" top={2} left={2} bg="rgba(0,0,0,0.7)" color={dracinTheme.accentGold} backdropFilter="blur(4px)" border={`1px solid ${dracinTheme.accentGold}`}>
                            Eps {item.total_episodes}
                        </Badge>
                    )}
                </Box>
                <Box p={4}>
                    <LinkOverlay as={RouterLink} to={`/dracin/detail/${slug}`}>
                        <Text fontWeight="bold" noOfLines={2} fontSize="sm" color={dracinTheme.textPrimary}>{title}</Text>
                    </LinkOverlay>
                </Box>
                </MotionLinkBox>
            );
        })}
        </SimpleGrid>
    );
}
