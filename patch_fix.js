const fs = require('fs');
let code = fs.readFileSync('src/views/AdminPage/components/SettingsManager.js', 'utf8');

// There's a duplicate key 'is_blocked' in the mapped object.
// Let's replace the block correctly.
code = code.replace(
  "is_takedown: 'false',\n        is_blocked: 'false',\n    is_blocked: 'false',",
  "is_takedown: 'false',\n        is_blocked: 'false',"
);

// We should also check for the other place it might have been duplicated.
code = code.replace(
  "is_takedown: 'false',\n    is_blocked: 'false',\n        is_blocked: 'false',",
  "is_takedown: 'false',\n        is_blocked: 'false',"
);

// Let's just do a string replacement on the exact duplicate if we can't find it
code = code.replace(
  "        is_blocked: 'false',\n    is_blocked: 'false',",
  "        is_blocked: 'false',"
);

fs.writeFileSync('src/views/AdminPage/components/SettingsManager.js', code);
