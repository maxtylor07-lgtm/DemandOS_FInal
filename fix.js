const fs = require('fs');
const file = 'c:/Users/Punit/OneDrive/Desktop/j project/DemandOS/DemandOS/index.html';
let content = fs.readFileSync(file, 'utf-8');

// The file has garbled utf-8 characters like 'â†’' which is \u00e2\u2020\u2019
// We can use a regex or string replacement.
content = content.replace(/â†’/g, '→');
content = content.replace(/â† /g, '←');
content = content.replace(/â€”/g, '—');
content = content.replace(/ðŸ“ˆ/g, '📈');
content = content.replace(/âœ•/g, '×');

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed index.html');
