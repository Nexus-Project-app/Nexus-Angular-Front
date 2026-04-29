// emojilib v2 uses require('./emojis') without .json extension.
// esbuild cannot resolve bare JSON requires. These shims bridge the gap.
const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'node_modules', 'emojilib');

const shims = {
  'emojis.js': "module.exports = require('./emojis.json');\n",
  'ordered.js': "module.exports = require('./ordered.json');\n",
};

for (const [file, content] of Object.entries(shims)) {
  const dest = path.join(base, file);
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, content);
    console.log(`[patch-emojilib] created ${file}`);
  }
}
