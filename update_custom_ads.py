with open('src/components/CustomAds.js', 'r') as f:
    content = f.read()

# Replace the renderAdContent function
old_render_ad_content = """  const renderAdContent = (ad) => (
    <Box
      bg={bg}
      borderRadius="md"
      overflow="hidden"
      boxShadow="lg"
      position="relative"
      w="full"
      maxW={placementType === 'inline' ? "full" : "400px"}
    >
      {placementType !== 'inline' && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          bg="rgba(0,0,0,0.5)"
          color="white"
          size="sm"
          borderRadius="full"
          _hover={{ bg: "rgba(0,0,0,0.7)" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose(ad.id);
          }}
        />
      )}

      <Box position="relative">
        {ad.media_type === 'image' ? (
          <Image src={ad.media_url} alt={ad.title} w="full" objectFit="cover" maxH="300px" />
        ) : (
          <video
            ref={el => videoRefs.current[ad.id] = el}
            src={ad.media_url}
            muted={!ad.has_audio}
            loop
            playsInline
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        )}
      </Box>

      <Box p={3}>
        <Text fontSize="xs" color="gray.500" mb={1} fontWeight="600" fontStyle="italic">
          *Ini Adalah Iklan {ad.category}*
        </Text>
        <Text fontWeight="bold" fontSize="md" noOfLines={1} mb={1}>
          {ad.title}
        </Text>
        {ad.description && (
          <Text fontSize="sm" color={textColor} noOfLines={2} mb={2}>
            {ad.description}
          </Text>
        )}
        {ad.action_url && (
          <Link href={ad.action_url} isExternal _hover={{ textDecoration: 'none' }}>
             <Text color="brand.500" fontSize="sm" fontWeight="bold">Info Selengkapnya &rarr;</Text>
          </Link>
        )}
      </Box>
    </Box>
  );"""

new_render_ad_content = """  const renderAdContent = (ad) => (
    <Box
      bg={bg}
      borderRadius="sm"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      overflow="hidden"
      boxShadow={placementType === 'inline' ? 'none' : 'md'}
      position="relative"
      w="full"
      maxW={placementType === 'inline' ? "full" : "360px"}
      _hover={{ boxShadow: 'sm' }}
      transition="all 0.2s"
    >
      {placementType !== 'inline' && (
        <CloseButton
          position="absolute"
          top={1}
          right={1}
          zIndex={2}
          bg="rgba(255,255,255,0.8)"
          color="gray.600"
          size="sm"
          _hover={{ bg: "white" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose(ad.id);
          }}
        />
      )}

      <Box p={3} pb={2}>
        <Flex align="center" gap={2} mb={2}>
          <Text
            fontSize="10px"
            fontWeight="bold"
            color={useColorModeValue('gray.600', 'gray.300')}
            border="1px solid"
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            px={1.5}
            py={0.5}
            borderRadius="sm"
          >
            Iklan
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {ad.category}
          </Text>
        </Flex>

        <Text fontWeight="bold" fontSize="lg" color={useColorModeValue('blue.600', 'blue.300')} mb={1} lineHeight="tight" _hover={{ textDecoration: 'underline' }}>
          {ad.title}
        </Text>

        {ad.description && (
          <Text fontSize="sm" color={textColor} mb={3} lineHeight="tall">
            {ad.description}
          </Text>
        )}
      </Box>

      <Box position="relative" bg={useColorModeValue('gray.50', 'gray.900')} display="flex" justifyContent="center" alignItems="center">
        {ad.media_type === 'image' ? (
          <Image
            src={ad.media_url}
            alt={ad.title}
            w="full"
            h="auto"
            maxH="400px"
            objectFit="contain"
            bg="transparent"
          />
        ) : (
          <video
            ref={el => videoRefs.current[ad.id] = el}
            src={ad.media_url}
            muted={!ad.has_audio}
            loop
            playsInline
            controls={ad.has_audio}
            style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', backgroundColor: 'transparent' }}
          />
        )}
      </Box>

      {ad.action_url && (
        <Box p={3} borderTopWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.700')} bg={useColorModeValue('gray.50', 'gray.800')}>
          <Flex justify="space-between" align="center">
            <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize="xs" noOfLines={1} maxW="70%">
               {new URL(ad.action_url).hostname.replace('www.', '')}
            </Text>
            <Text color="blue.500" fontSize="sm" fontWeight="600">Buka &rsaquo;</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );"""

content = content.replace(old_render_ad_content, new_render_ad_content)

with open('src/components/CustomAds.js', 'w') as f:
    f.write(content)
