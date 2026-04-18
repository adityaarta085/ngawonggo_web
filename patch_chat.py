with open('api/chat.js', 'r') as f:
    content = f.read()

content = content.replace(
    ".in('key', ['groq_api_key', 'default_ai_prompt']);",
    ".in('key', ['groq_api_key', 'default_ai_prompt', 'groq_model']);"
)

content = content.replace(
    "const defaultPromptSetting = settings.find(s => s.key === 'default_ai_prompt');",
    "const defaultPromptSetting = settings.find(s => s.key === 'default_ai_prompt');\n    const groqModelSetting = settings.find(s => s.key === 'groq_model');"
)

content = content.replace(
    "// Default System Prompt",
    "const GROQ_MODEL = groqModelSetting?.value || 'groq/compound';\n\n    // Default System Prompt"
)

content = content.replace(
    "model: 'groq/compound',",
    "model: GROQ_MODEL,"
)

with open('api/chat.js', 'w') as f:
    f.write(content)
