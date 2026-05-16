const fs = require('fs');

let content = fs.readFileSync('src/App.js', 'utf8');

content = content.replace(
  "import KreativitasPage from './views/KreativitasPage/index.js';",
  "import KreativitasPage from './views/KreativitasPage/index.js';\nimport CreateDetail from './views/KreativitasPage/components/CreateDetail.js';\nimport PublikPage from './views/KreativitasPage/components/PublikPage.js';\nimport ImageDetail from './views/KreativitasPage/components/ImageDetail.js';\nimport HistoriPage from './views/KreativitasPage/components/HistoriPage.js';"
);

content = content.replace(
  "<Route path=\"/kreativitas\" element={<KreativitasPage />} />",
  "<Route path=\"/kreativitas\" element={<KreativitasPage />} />\n            <Route path=\"/kreativitas/create/:id\" element={<CreateDetail />} />\n            <Route path=\"/kreativitas/publik\" element={<PublikPage />} />\n            <Route path=\"/kreativitas/publik/:id\" element={<ImageDetail />} />\n            <Route path=\"/kreativitas/histori\" element={<HistoriPage />} />"
);

fs.writeFileSync('src/App.js', content);
