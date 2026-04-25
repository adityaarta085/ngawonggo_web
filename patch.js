const fs = require('fs');
let code = fs.readFileSync('src/App.js', 'utf8');

code = code.replace(
  'const [isVerified, setIsVerified] = useState(false); // Verification reset on refresh',
  `const [isVerified, setIsVerified] = useState(() => {
    try {
      return sessionStorage.getItem('humanVerified') === 'true';
    } catch (e) {
      console.error('Failed to access sessionStorage:', e);
      return false;
    }
  });`
);

code = code.replace(
  `<HumanVerification onVerified={() => {
              setIsVerified(true);
            }} />`,
  `<HumanVerification onVerified={() => {
              try {
                sessionStorage.setItem('humanVerified', 'true');
              } catch (e) {
                console.error('Failed to access sessionStorage:', e);
              }
              setIsVerified(true);
            }} />`
);

fs.writeFileSync('src/App.js', code);
