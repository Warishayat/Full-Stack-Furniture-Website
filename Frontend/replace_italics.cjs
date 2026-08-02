const fs = require('fs');
const path = require('path');

const traverse = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const regex = /<span\s+className=(["'`])italic\s+text-gray-400(?:[\s\S]*?)\1>([\s\S]*?)<\/span>/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, '$2');
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  });
};

traverse('./src');
