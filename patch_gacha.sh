sed -i 's/<Badge colorScheme="purple" p={2} borderRadius="lg" fontSize="md">/<!--/g' src/views/PortalPage/GachaPage/index.js
sed -i 's/Pity: {gachaStats\?\.total_pulls || 0}\/75/Pity/g' src/views/PortalPage/GachaPage/index.js
sed -i 's/<\/Badge>/-->/g' src/views/PortalPage/GachaPage/index.js
