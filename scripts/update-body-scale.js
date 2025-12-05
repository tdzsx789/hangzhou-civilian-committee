const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

function hasBodyScale(content) {
  return content.includes('body {') && content.includes('transform: scale(2)');
}

function injectBodyScale(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.warn(`Failed to read ${filePath}:`, e.message);
    return false;
  }

  // 如果已经有 body 上的 scale(2)，就不重复加了
  if (hasBodyScale(content)) {
    return false;
  }

  let updated = content;
  let changed = false;

  const bodyIdx = updated.indexOf('body {');

  if (bodyIdx !== -1) {
    // 在已有 body 块的开头插入两行 transform
    const insertPos = bodyIdx + 'body {'.length;
    const injection = '\n  transform: scale(2);\n  transform-origin: 0 0;';
    updated = updated.slice(0, insertPos) + injection + updated.slice(insertPos);
    changed = true;
  } else {
    // 文件中没有单独的 body 选择器，则在末尾追加一个 body 块
    const snippet =
      '\n\nbody {\n' +
      '  transform: scale(2);\n' +
      '  transform-origin: 0 0;\n' +
      '}\n';
    updated += snippet;
    changed = true;
  }

  if (!changed) return false;

  try {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Added body scale to ${filePath}`);
    return true;
  } catch (e) {
    console.warn(`Failed to write ${filePath}:`, e.message);
    return false;
  }
}

function main() {
  if (!fs.existsSync(PACKAGES_DIR)) {
    console.error(`Packages directory not found: ${PACKAGES_DIR}`);
    process.exit(1);
  }

  const packageDirs = fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let changedCount = 0;

  for (const dir of packageDirs) {
    const idxCssPath = path.join(PACKAGES_DIR, dir, 'src', 'index.css');
    if (!fs.existsSync(idxCssPath)) continue;
    if (injectBodyScale(idxCssPath)) {
      changedCount += 1;
    }
  }

  console.log(`Done. Updated ${changedCount} index.css file(s).`);
}

main();



