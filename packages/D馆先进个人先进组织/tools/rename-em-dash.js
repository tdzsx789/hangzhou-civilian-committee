const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, '../先进个人更新');

function traverseAndRename(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const items = fs.readdirSync(dir);

  // Process children first (deep traversal) to avoid renaming a directory before its children
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch (e) {
      console.error(`Cannot stat ${fullPath}`, e);
      return;
    }

    if (stats.isDirectory()) {
      traverseAndRename(fullPath);
    }
  });

  // Rename files/directories in current directory
  // Re-read directory items to ensure we are working with current state if needed, 
  // but since we only rename current level items after processing children, 
  // and we iterate based on original listing, we should be careful.
  // Actually, iterating original 'items' is fine as long as we check if file still exists before rename
  // or if we renamed a child directory, the parent directory (current 'dir') name hasn't changed yet.
  
  // Wait, if we rename a directory inside 'traverseAndRename(fullPath)', 
  // then when we are back in the parent loop, 'item' still refers to old name.
  // But we are processing children first.
  // So when we are in 'dir', we process 'dir/subdir'. 'dir/subdir' might be renamed to 'dir/subdir_new'.
  // Then we continue to next item in 'dir'.
  // Finally, we might rename 'dir' itself (if this function was called recursively).
  // But here we are iterating 'items' of 'dir'.
  // We should check for renaming of 'item' (which is a child of 'dir').
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    // Check if it still exists (it might have been renamed if it was a directory and we processed it? 
    // No, wait. traverseAndRename(fullPath) renames things INSIDE fullPath. 
    // It does NOT rename fullPath itself.
    // So we need to handle renaming of 'item' here.
    
    if (!item.includes('—')) return;

    // Replace em dash (—) with full-width hyphen (－)
    // Note: The user provided '—' (U+2014) to be replaced by '－' (U+FF0D)
    const newName = item.replace(/—/g, '－');
    
    if (newName !== item) {
      const newFullPath = path.join(dir, newName);
      if (fs.existsSync(newFullPath)) {
        console.warn(`Skipping rename, target already exists: ${newFullPath}`);
      } else {
        try {
          fs.renameSync(fullPath, newFullPath);
          console.log(`Renamed: ${item} -> ${newName}`);
        } catch (err) {
          console.error(`Error renaming ${item}:`, err);
        }
      }
    }
  });
}

console.log(`Starting rename in ${TARGET_DIR}`);
traverseAndRename(TARGET_DIR);
console.log('Done.');
