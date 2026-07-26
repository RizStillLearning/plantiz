const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, 'src/pages/Planner.jsx');
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
for (let i = 240; i < 300 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
