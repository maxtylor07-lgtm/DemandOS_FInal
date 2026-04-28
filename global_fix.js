const fs = require('fs');

const svgs = {
  barChart: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M18 20V10\"/><path d=\"M12 20V4\"/><path d=\"M6 20v-6\"/></svg>',
  package: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/></svg>',
  trophy: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\"/><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\"/><path d=\"M4 22h16\"/><path d=\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\"/><path d=\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\"/><path d=\"M18 2H6v7a6 6 0 0 0 12 0V2Z\"/></svg>',
  alert: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\"/><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"/></svg>',
  sparkle: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z\"/></svg>',
  trendUp: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"/><polyline points=\"16 7 22 7 22 13\"/></svg>',
  trendDown: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\"/><polyline points=\"16 7 22 7 22 13\"/></svg>',
  dollar: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"/><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/></svg>',
  zap: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/></svg>',
  gift: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M20 12v10H4V12\"/><path d=\"M2 7h20v5H2z\"/><path d=\"M12 22V7\"/><path d=\"M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z\"/><path d=\"M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z\"/></svg>',
  clipboard: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/></svg>',
  image: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/></svg>',
  camera: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/></svg>',
  gear: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>',
  close: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/></svg>',
  thermometer: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"/></svg>',
  shoppingBag: '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\"/><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/></svg>',
  dotRed: '<span style=\"width:8px;height:8px;border-radius:50%;background:#FF5F57;flex-shrink:0;display:inline-block;margin-top:4px;\"></span>',
  dotYellow: '<span style=\"width:8px;height:8px;border-radius:50%;background:#FEBC2E;flex-shrink:0;display:inline-block;margin-top:4px;\"></span>'
};

const replaces = {
  'ðŸ“ˆ': svgs.trendUp,     // 📈 Trend up
  'ðŸ“¦': svgs.package,     // 📦 Package
  'ðŸ’°': svgs.dollar,      // 💰 Dollar
  'ðŸ”®': svgs.sparkle,     // 🔮 Sparkle
  'ðŸ“Š': svgs.barChart,    // 📊 Bar Chart
  'ðŸ †': svgs.trophy,      // 🏆 Trophy
  'âš ï¸ ': svgs.alert,      // ⚠️ Alert
  'ðŸ”´': svgs.dotRed,      // 🔴 Red dot
  'ðŸŸ¡': svgs.dotYellow,   // 🟡 Yellow dot
  'ðŸ¥¤': svgs.thermometer, // 🥤 Cold drink
  'ðŸ’ª': svgs.zap,         // 💪 Muscle -> Zap
  'ðŸŽ’': svgs.shoppingBag, // 🎒 Backpack
  'ðŸ§ ': svgs.sparkle,     // 🧠 Brain -> Sparkle
  'ðŸŽ ': svgs.gift,        // 🎁 Gift
  'ðŸ“‰': svgs.trendDown,   // 📉 Trend down
  'ðŸ”¥': svgs.trendUp,     // 🔥 Fire -> Trend up
  'ðŸ“‹': svgs.clipboard,   // 📋 Clipboard
  'ðŸ–¼ï¸ ': svgs.image,      // 🖼️ Image
  'ðŸ“ ': svgs.camera,      // 📸 Camera
  'âš™ï¸ ': svgs.gear,        // ⚙️ Gear
  'ðŸ‘¤': svgs.trendUp,     // 👤 User -> Actually let\'s use a user icon... wait I\'ll map it to gear for now or wait! User icon:
  'ðŸŒ™': svgs.sparkle,     // 🌙 Moon
  'â˜€ï¸ ': svgs.sparkle,      // ☀️ Sun
  'ðŸ–¥ï¸ ': svgs.sparkle,      // 🖥️ Monitor
  'ðŸ’¡': svgs.sparkle,     // 💡 Bulb
  'ðŸŽ‰': '',               // 🎉 Party popper (remove)
  'âœ…': '',               // ✅ Checkmark (remove)
  'â†‘': '↑',             // Up arrow
  'â†’': '→',             // Right arrow
  'â† ': '←',             // Left arrow
  'â€”': '—',             // Em dash
  'âœ•': svgs.close,      // ✕ Close
  'âš¡': svgs.zap,        // ⚡ Zap
  'â€¦': '…'              // Ellipsis
};
// Add user icon
replaces['ðŸ‘¤'] = '<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align:-0.125em\"><path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>';

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  for (const [garbled, icon] of Object.entries(replaces)) {
    content = content.split(garbled).join(icon);
  }
  fs.writeFileSync(file, content, 'utf-8');
  console.log('Fixed ' + file);
}

fixFile('c:/Users/Punit/OneDrive/Desktop/j project/DemandOS/DemandOS/dashboard.html');
fixFile('c:/Users/Punit/OneDrive/Desktop/j project/DemandOS/DemandOS/index.html');
fixFile('c:/Users/Punit/OneDrive/Desktop/j project/DemandOS/DemandOS/alerts.js');
