const fs = require('fs');
let code = fs.readFileSync('src/App.js', 'utf8');

code = code.replace(
  "import TakedownPage from './views/TakedownPage/index.js';",
  "import TakedownPage from './views/TakedownPage/index.js';\nimport BlockedPage from './views/BlockedPage/index.js';"
);

code = code.replace(
  "const isDownPage = location.pathname === '/down';",
  "const isDownPage = location.pathname === '/down';\n  const isBlockedPage = location.pathname === '/blocked';"
);

code = code.replace(
  "const [isTakedown, setIsTakedown] = useState(false);",
  "const [isTakedown, setIsTakedown] = useState(false);\n  const [isBlocked, setIsBlocked] = useState(false);"
);

code = code.replace(
  /const { data } = await supabase\s*\n\s*\.from\('site_settings'\)\s*\n\s*\.select\('value'\)\s*\n\s*\.eq\('key', 'is_takedown'\)\s*\n\s*\.single\(\);/,
  "const { data } = await supabase.from('site_settings').select('key, value').in('key', ['is_takedown', 'is_blocked']);"
);

code = code.replace(
  /if \(data && data\.value === 'true'\) \{\s*setIsTakedown\(true\);\s*\}/,
  "if (data) {\n          const takedownSetting = data.find((d) => d.key === 'is_takedown');\n          const blockedSetting = data.find((d) => d.key === 'is_blocked');\n          if (takedownSetting && takedownSetting.value === 'true') setIsTakedown(true);\n          if (blockedSetting && blockedSetting.value === 'true') setIsBlocked(true);\n        }"
);

code = code.replace(
  "if (isTakedown && !isAdmin && !isDownPage) {",
  "if (isBlocked && !isAdmin && !isBlockedPage) {\n    return <Navigate to=\"/blocked\" replace />;\n  }\n\n  if (!isBlocked && isBlockedPage) {\n    return <Navigate to=\"/\" replace />;\n  }\n\n  if (isTakedown && !isAdmin && !isDownPage) {"
);

code = code.replace(/!isDownPage/g, "!isDownPage && !isBlockedPage");
// fix for `if (isTakedown && !isAdmin && !isDownPage && !isBlockedPage)` - we don't want it modified like that.
// Let's replace those specifically.
code = code.replace("if (isTakedown && !isAdmin && !isDownPage && !isBlockedPage) {", "if (isTakedown && !isAdmin && !isDownPage) {");

code = code.replace(
  "<Route path=\"/down\" element={<TakedownPage />} />",
  "<Route path=\"/down\" element={<TakedownPage />} />\n              <Route path=\"/blocked\" element={<BlockedPage />} />"
);

fs.writeFileSync('src/App.js', code);
