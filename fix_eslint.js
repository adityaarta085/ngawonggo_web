const fs = require('fs');

let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';"
);

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
