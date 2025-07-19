// Script untuk update API URL di frontend setelah backend deployed
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node update-api-url.js <your-fly-app-url>');
    console.log('Example: node update-api-url.js https://justsploit-api-123.fly.dev');
    process.exit(1);
}

const apiUrl = args[0];
const apiFilePath = path.join(__dirname, 'frontend', 'src', 'services', 'api.js');

// Read current api.js
let apiFileContent = fs.readFileSync(apiFilePath, 'utf8');

// Update baseURL
apiFileContent = apiFileContent.replace(
    /baseURL:\s*['"][^'"]*['"]/,
    `baseURL: '${apiUrl}/api'`
);

// Write back
fs.writeFileSync(apiFilePath, apiFileContent);

console.log(`✅ Updated API URL to: ${apiUrl}/api`);
console.log('🔄 Now run: cd frontend && npm run build && npx vercel --prod');