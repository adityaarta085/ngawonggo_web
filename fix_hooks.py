with open('src/components/CustomAds.js', 'r') as f:
    content = f.read()

# Define color variables at the top of the component
vars_to_add = """  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tagTextColor = useColorModeValue('gray.600', 'gray.300');
  const tagBorderColor = useColorModeValue('gray.300', 'gray.600');
  const titleColor = useColorModeValue('blue.600', 'blue.300');
  const mediaBg = useColorModeValue('gray.50', 'gray.900');
  const actionBorder = useColorModeValue('gray.100', 'gray.700');
  const actionBg = useColorModeValue('gray.50', 'gray.800');
  const actionText = useColorModeValue('gray.500', 'gray.400');"""

content = content.replace("const textColor = useColorModeValue('gray.600', 'gray.300');", "const textColor = useColorModeValue('gray.600', 'gray.300');\n" + vars_to_add)

# Replace hook calls inside renderAdContent
content = content.replace("borderColor={useColorModeValue('gray.200', 'gray.700')}", "borderColor={borderColor}")
content = content.replace("color={useColorModeValue('gray.600', 'gray.300')}", "color={tagTextColor}")
content = content.replace("borderColor={useColorModeValue('gray.300', 'gray.600')}", "borderColor={tagBorderColor}")
content = content.replace("color={useColorModeValue('blue.600', 'blue.300')}", "color={titleColor}")
content = content.replace("bg={useColorModeValue('gray.50', 'gray.900')}", "bg={mediaBg}")
content = content.replace("borderColor={useColorModeValue('gray.100', 'gray.700')} bg={useColorModeValue('gray.50', 'gray.800')}", "borderColor={actionBorder} bg={actionBg}")
content = content.replace("color={useColorModeValue('gray.500', 'gray.400')}", "color={actionText}")

with open('src/components/CustomAds.js', 'w') as f:
    f.write(content)
