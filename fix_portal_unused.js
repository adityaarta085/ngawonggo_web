const fs = require('fs');

let content = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

// Remove unused state
content = content.replace('const [gachaLoading, setGachaLoading] = useState(false);\n', '');

// Remove unused variables from useMonetization
content = content.replace('const { currency, tier, deductCurrency, gachaStats, claimDailyLogin, rollGacha, activateVipCard, purchaseVipDirect } = useMonetization();', 'const { currency, tier, deductCurrency, gachaStats, claimDailyLogin } = useMonetization();');

// Remove unused icons
content = content.replace('import { FaCoins, FaLock, FaBell, FaCrown, FaStore, FaPaintBrush, FaMedal, FaGift, FaTrophy, FaCreditCard } from \'react-icons/fa\';', 'import { FaCoins, FaLock, FaBell, FaCrown, FaStore, FaGift, FaTrophy } from \'react-icons/fa\';');

fs.writeFileSync('src/views/PortalPage/index.js', content);
