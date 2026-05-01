sed -i 's/import PortalPage from .\//import PortalRouter from .\//g' src/App.js
sed -i 's/path="\/portal"/path="\/portal\/*"/g' src/App.js
sed -i 's/<PortalPage \/>/<PortalRouter \/>/g' src/App.js
