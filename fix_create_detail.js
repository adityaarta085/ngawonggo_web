const fs = require('fs');
let content = fs.readFileSync('src/views/KreativitasPage/components/CreateDetail.js', 'utf8');

content = content.replace("Box, Container, VStack, HStack, Text, Image, Button,", "Box, Container, HStack, Text, Image, Button,");
content = content.replace("fetchImage();\n  }, [id]);", "fetchImage();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [id]);");

fs.writeFileSync('src/views/KreativitasPage/components/CreateDetail.js', content);
