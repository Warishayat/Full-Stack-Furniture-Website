const fs = require('fs');
const path = require('path');

const traverse = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace 'font-serif font-black' with 'font-serif font-medium'
      // This will soften the headings from extra bold to medium.
      if (content.includes('font-serif font-black')) {
        content = content.replace(/font-serif font-black/g, 'font-serif font-medium');
        fs.writeFileSync(fullPath, content);
        console.log('Updated font-black to font-medium in', fullPath);
      }
    }
  });
};

traverse('./src');
