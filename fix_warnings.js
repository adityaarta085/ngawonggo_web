const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/contexts/MonetizationContext.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("const { data, error } = await supabase.rpc('roll_gacha'", "const { data } = await supabase.rpc('roll_gacha'");
content = content.replace("const { data, error } = await supabase.rpc('claim_daily_login'", "const { data } = await supabase.rpc('claim_daily_login'");

fs.writeFileSync(filePath, content);
