const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/TopupPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("Divider,", "");
content = content.replace("FaHistory, FaUser", "FaHistory");

content = content.replace(
`  useEffect(() => {
    // Try auto-fill if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            setEmail(user.email);
            handleCheckUser(user.email);
            fetchHistory(user.id);
        }
    });
  }, []);`,
`  useEffect(() => {
    // Try auto-fill if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            setEmail(user.email);
            // Ignore exhaust-deps for standard one-time fetch
            handleCheckUser(user.email);
            fetchHistory(user.id);
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`);

fs.writeFileSync(filePath, content);
console.log('Fixed linting warnings in TopupPage.');
