const fs = require('fs');

let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

content = content.replace(
  "import {\n  useToast,\n  Switch,\n  FormControl,\n  FormLabel,\n  HStack, supabase } from '../../lib/supabase';",
  "import { supabase } from '../../lib/supabase';"
);

content = content.replace(
  "  Box,\n  Container,",
  "  Box,\n  Container,\n  useToast,\n  Switch,\n  FormControl,\n  FormLabel,\n  HStack,"
);

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
