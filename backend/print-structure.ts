import * as fs from 'fs';
import * as path from 'path';

function printFolderStructure(dirPath: string, indent = '') {
  const items = fs.readdirSync(dirPath);

  items.forEach((item, index) => {
    if (item === 'node_modules' || item === '.git') return;
    const fullPath = path.join(dirPath, item);
    const isDir = fs.statSync(fullPath).isDirectory();
    const isLast = index === items.length - 1;
    const prefix = isLast ? '└─ ' : '├─ ';

    console.log(indent + prefix + item);

    if (isDir) {
      printFolderStructure(fullPath, indent + (isLast ? '   ' : '│  '));
    }
  });
}

// Call this with your project root
printFolderStructure(path.resolve('backend', '../'));
