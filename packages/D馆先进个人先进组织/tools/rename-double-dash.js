const fs = require('fs');
const path = require('path');

const targetDir = '/Users/tree/Desktop/code/hangzhou-civilian-committee/packages/D馆先进个人先进组织/先进个人更新';

function traverseAndRename(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch (e) {
        console.error(`Cannot stat ${fullPath}: ${e.message}`);
        return;
      }
      
      // 先递归处理子目录内容，再处理当前目录名（如果是目录的话）
      // 这样可以避免重命名目录后找不到子项的问题
      if (stats.isDirectory()) {
        traverseAndRename(fullPath);
      }
      
      // 检查名称是否包含 ——
      if (item.includes('——')) {
        const newName = item.replace(/——/g, '－');
        const newFullPath = path.join(dir, newName);
        
        if (fs.existsSync(newFullPath)) {
          console.warn(`Skipping rename: ${item} -> ${newName} because target exists.`);
        } else {
          try {
            fs.renameSync(fullPath, newFullPath);
            console.log(`Renamed: ${item} -> ${newName}`);
          } catch (err) {
            console.error(`Failed to rename ${item}: ${err.message}`);
          }
        }
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
  }
}

if (fs.existsSync(targetDir)) {
  console.log(`Processing ${targetDir}...`);
  traverseAndRename(targetDir);
  console.log('Done.');
} else {
  console.error(`Directory not found: ${targetDir}`);
}
