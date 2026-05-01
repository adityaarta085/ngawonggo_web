const fs = require('fs');
const path = require('path');

// 1. Fix TopupPage amount param
const topupPath = path.join(__dirname, 'src/views/TopupPage/index.js');
let topupContent = fs.readFileSync(topupPath, 'utf8');

// The API expects `amount` in req.query (?amount=) not req.body for createpayment
// because qrispy.js parses: const { action, amount, qris_id } = req.query;
const topupSearch = "const response = await axios.post('/api/qrispy?action=createpayment', {\n        amount: selectedPackage.price\n      });";
const topupReplace = "const response = await axios.post(`/api/qrispy?action=createpayment&amount=${selectedPackage.price}`);";

if (topupContent.includes(topupSearch)) {
    topupContent = topupContent.replace(topupSearch, topupReplace);
    fs.writeFileSync(topupPath, topupContent);
    console.log('Fixed TopupPage axios post parameters');
}

// 2. Fix PortalPage redirects
const portalPath = path.join(__dirname, 'src/views/PortalPage/index.js');
let portalContent = fs.readFileSync(portalPath, 'utf8');

portalContent = portalContent.replace(/navigate\('\/donasi'\)/g, "navigate('/topup')");

fs.writeFileSync(portalPath, portalContent);
console.log('Fixed PortalPage redirects to /topup');
