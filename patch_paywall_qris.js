const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Monetization/PaywallModal.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { useNavigate }')) {
    content = content.replace(
        "import { useMonetization } from '../../contexts/MonetizationContext';",
        "import { useMonetization } from '../../contexts/MonetizationContext';\nimport { useNavigate } from 'react-router-dom';"
    );

    content = content.replace(
        "const { currency, deductCurrency } = useMonetization();",
        "const { currency, deductCurrency } = useMonetization();\n  const navigate = useNavigate();"
    );

    content = content.replace(
        "Silakan isi ulang melalui Portal Warga.",
        "Silakan Topup / Isi Ulang (QRIS)."
    );

    content = content.replace(
        "<Button w=\"full\" variant=\"ghost\" colorScheme=\"brand\" leftIcon={<FaCrown />}>",
        "<Button w=\"full\" variant=\"ghost\" colorScheme=\"brand\" leftIcon={<FaCrown />} onClick={() => {\n            onClose();\n            navigate('/donasi'); // Redirecting to Topup/Donasi route as per existing QRIS flow\n          }}>"
    );
}

fs.writeFileSync(filePath, content);
console.log('Paywall updated to connect to Topup');
