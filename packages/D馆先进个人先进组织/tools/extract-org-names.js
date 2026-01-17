const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../先进组织更新');
const outputJsonPath = path.join(__dirname, '../orgArray.json');

function getSubdirectories(dir) {
  let results = [];
  try {
    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return [];
    }
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      // Skip hidden files like .DS_Store
      if (file.startsWith('.')) return;

      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
         // This is a direct subdirectory of "先进组织更新" (e.g. "1. 北京市（1个）")
         // We need to look inside this directory for the actual organization folders
         const subFiles = fs.readdirSync(fullPath);
         subFiles.forEach(subFile => {
             if (subFile.startsWith('.')) return;
             const subFullPath = path.join(fullPath, subFile);
             const subStat = fs.statSync(subFullPath);
             
             if (subStat.isDirectory()) {
                 results.push({
                     originName: subFile
                 });
             }
         });
      }
    });
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
  return results;
}

const orgArray = getSubdirectories(targetDir);

fs.writeFileSync(outputJsonPath, JSON.stringify(orgArray, null, 2), 'utf8');
console.log(`Successfully extracted ${orgArray.length} organization names to ${outputJsonPath}`);
