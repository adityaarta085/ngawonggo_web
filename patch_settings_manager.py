import re

with open('src/views/AdminPage/components/SettingsManager.js', 'r') as f:
    content = f.read()

# Update initial state
content = content.replace(
"""  const [settings, setSettings] = useState({
    groq_api_key: '',
    default_ai_prompt: '',
    is_takedown: 'false',
    takedown_message: '',
    takedown_image: '',
    takedown_ai_prompt: '',
  });""",
"""  const [settings, setSettings] = useState({
    groq_api_key: '',
    groq_model: 'groq/compound',
    default_ai_prompt: '',
    is_takedown: 'false',
    takedown_message: '',
    takedown_image: '',
    takedown_ai_prompt: '',
  });"""
)

# Update mapped object in fetchSettings
content = content.replace(
"""      const mapped = {
        groq_api_key: '',
        default_ai_prompt: '',
        is_takedown: 'false',
        takedown_message: '',
        takedown_image: '',
        takedown_ai_prompt: '',
      };""",
"""      const mapped = {
        groq_api_key: '',
        groq_model: 'groq/compound',
        default_ai_prompt: '',
        is_takedown: 'false',
        takedown_message: '',
        takedown_image: '',
        takedown_ai_prompt: '',
      };"""
)

# Add Model Input field
model_input_field = """              <FormControl mt={4}>
                <FormLabel fontWeight="bold">Groq Model</FormLabel>
                <Input
                  type="text"
                  placeholder="Contoh: groq/compound"
                  value={settings.groq_model}
                  onChange={(e) => handleChange('groq_model', e.target.value)}
                />
                <Text mt={2} fontSize="xs" color="gray.500">
                  Pilih model AI yang akan digunakan (default: groq/compound).
                </Text>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel fontWeight="bold">Default System Prompt AI</FormLabel>"""

content = content.replace(
"""              <FormControl mt={4}>
                <FormLabel fontWeight="bold">Default System Prompt AI</FormLabel>""",
model_input_field
)

with open('src/views/AdminPage/components/SettingsManager.js', 'w') as f:
    f.write(content)
