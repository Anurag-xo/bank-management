const fs = require('fs');
const path = require('path');

const colorMap = {
  // Case-insensitive regexes for the existing colors
  '#0f172a': '#454040',
  '#1e293b': '#605B51',
  '#334155': '#605B51',
  '#64748b': '#605B51',
  '#6366f1': '#D8D365',
  '#4f46e5': '#D8D365',
  '#8b5cf6': '#E6F082',
  '#a78bfa': '#E6F082',
  '#c084fc': '#E6F082',
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

  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    // Replace all occurrences, case insensitive
    const regex = new RegExp(oldColor, 'gi');
    content = content.replace(regex, newColor);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

const srcDir = path.join(__dirname, 'src');
walkDir(srcDir, replaceColorsInFile);

console.log('Color replacement complete.');
