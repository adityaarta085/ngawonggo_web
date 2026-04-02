with open('src/views/AdminPage/components/UserManager.js', 'r') as f:
    content = f.read()

# Fix unused vars
content = content.replace("Badge, Modal", "Modal")
content = content.replace("Select, Tooltip", "Tooltip")
content = content.replace("FaTrash, FaEdit, FaEnvelope", "FaTrash, FaEnvelope")
content = content.replace("const [isLoading, setIsLoading] = useState(false);", "const [, setIsLoading] = useState(false);")
content = content.replace("const { data, error } = await supabase.auth.signUp({", "const { error } = await supabase.auth.signUp({")

with open('src/views/AdminPage/components/UserManager.js', 'w') as f:
    f.write(content)

with open('src/views/LayananPage/ComplaintSystem.js', 'r') as f:
    content = f.read()

content = content.replace("import axios from 'axios';", "// import axios from 'axios';")
content = content.replace("import { Link as RouterLink } from 'react-router-dom';", "import { Link as RouterLink } from 'react-router-dom';\nimport axios from 'axios';")
# Actually, axios is used in LayananPage/ComplaintSystem.js, but let's check where
