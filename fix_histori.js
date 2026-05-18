const fs = require('fs');
let content = fs.readFileSync('src/views/KreativitasPage/components/HistoriPage.js', 'utf8');

content = content.replace("Box, Container, VStack, HStack, Text, Image, Button, SimpleGrid,", "Box, Container, HStack, Text, Image, Button, SimpleGrid,");
content = content.replace("const [user, setUser] = useState(null);", "");
content = content.replace("setUser(user);", "");
content = content.replace("});\n  }, [navigate]);", "});\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [navigate]);");

fs.writeFileSync('src/views/KreativitasPage/components/HistoriPage.js', content);
