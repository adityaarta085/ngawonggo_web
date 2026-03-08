import sys

file_path = "src/components/Navbar.js"
with open(file_path, "r") as f:
    content = f.read()

new_nav_logic = """  const navBg = useColorModeValue(
    isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.3)',
    isScrolled ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.3)'
  );
  const navColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      p={{ base: 2, md: 4 }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      w="full"
    >
      <Flex
        layerStyle="liquidGlass"
        bg={navBg}
        color={navColor}
        minH="64px"
        py={{ base: 2 }}
        px={{ base: 4, md: 8 }}
        align="center"
        borderRadius={isScrolled ? "full" : "2xl"}
        maxW="container.xl"
        mx="auto"
        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        border="1px solid"
        borderColor={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
        backdropFilter="blur(16px)"
      >"""

content_lines = content.splitlines()
start_idx = -1
end_idx = -1
for i, line in enumerate(content_lines):
    if "const navBg = useColorModeValue(" in line and start_idx == -1:
        start_idx = i
    if "borderColor={isScrolled ? \"transparent\" : \"gray.100\"}" in line:
        end_idx = i + 1
        break

if start_idx != -1 and end_idx != -1:
    new_content_lines = content_lines[:start_idx] + new_nav_logic.splitlines() + content_lines[end_idx+1:]
    with open(file_path, "w") as f:
        f.write("\n".join(new_content_lines))
    print("Successfully updated src/components/Navbar.js")
else:
    print(f"Could not find markers: start_idx={start_idx}, end_idx={end_idx}")
