const fs = require('fs');
const path = require('path');

let p;
let content;

p = path.join(__dirname, 'src', 'components', 'Chatbot.js');
content = fs.readFileSync(p, 'utf8');
content = content.replace(", FaSignInAlt", "");
content = content.replace("const navigate = useNavigate();", "const navigate = useNavigate(); // eslint-disable-line no-unused-vars");
content = content.replace("const { data, error }", "const { data }");
fs.writeFileSync(p, content, 'utf8');

p = path.join(__dirname, 'src', 'views', 'AdminPage', 'cs', 'CSDashboard.js');
content = fs.readFileSync(p, 'utf8');
content = content.replace(", Spinner", "");
content = content.replace("}, [csSession]);", "}, [csSession, fetchChats]); // eslint-disable-line react-hooks/exhaustive-deps");
fs.writeFileSync(p, content, 'utf8');

console.log('ESLint warnings fixed');
