with open('src/App.js', 'r') as f:
    content = f.read()

content = content.replace("import React from 'react';\nimport CustomAds from './components/CustomAds'; { useState, useEffect, useCallback, useRef } from 'react';", "import React, { useState, useEffect, useCallback, useRef } from 'react';\nimport CustomAds from './components/CustomAds';")

with open('src/App.js', 'w') as f:
    f.write(content)
