import sys

with open("src/App.js", "r") as f:
    content = f.read()

# Add import
import_str = "import TopupPage from './views/TopupPage/index.js';\n"
if "import TopupPage" not in content:
    content = content.replace("import PageNotFound", import_str + "import PageNotFound")

# Add route
route_str = "<Route path=\"/topup\" element={<TopupPage />} />\n              <Route path=\"/anime\""
if "path=\"/topup\"" not in content:
    content = content.replace("<Route path=\"/anime\"", route_str)

with open("src/App.js", "w") as f:
    f.write(content)
