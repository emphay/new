const fs = require('fs');
const fontManager = require('font-manager');

const fonts = fontManager.getAvailableFontsSync();

const fontOptions = fonts.map(font => ({ value: font.family, label: font.family }));

fs.writeFileSync('fonts.json', JSON.stringify(fontOptions, null, 2));
console.log('Fonts have been saved to fonts.json');
