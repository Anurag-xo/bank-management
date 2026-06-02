const fs = require('fs');
const path = require('path');

const rgbMap = {
  // #3b82f6
  '59, 130, 246': '230, 240, 130',
  '59,130,246': '230, 240, 130',
  '#3b82f6': '#E6F082',
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceColorsInFile(filePath) {
  if (!filePath.endsWith('.css')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [oldRgb, newRgb] of Object.entries(rgbMap)) {
    // Escape commas and spaces if necessary, but string replacement globally works well
    content = content.split(oldRgb).join(newRgb);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated RGB: ${filePath}`);
  }
}

const srcDir = path.join(__dirname, 'src');
walkDir(srcDir, replaceColorsInFile);

console.log('RGB Color replacement complete.');
