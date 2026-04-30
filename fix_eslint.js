const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/AdminPage/components/MonetizationManager.js');
let content = fs.readFileSync(filePath, 'utf8');

// The error shows unused variables in MonetizationManager.js
content = content.replace(
    "  Box, VStack, HStack, Heading, Text, Switch, Input, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast, FormControl, FormLabel",
    "  Box, VStack, Heading, Text, Input, Button, useToast, FormControl, FormLabel"
);

content = content.replace(
    "import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';",
    "import { FaSave } from 'react-icons/fa';"
);

fs.writeFileSync(filePath, content);
console.log('Fixed unused variables in MonetizationManager.js');
