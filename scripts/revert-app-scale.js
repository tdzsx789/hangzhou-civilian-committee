const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

function revertAppCss(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.warn(`Failed to read ${filePath}:`, e.message);
    return false;
  }

  let updated = content;
  let changed = false;

  // Remove the transform scale we previously added on .App
  const removeLines = [
    '  transform: scale(2);',
    '  transform-origin: top left;',
    '  transform-style: flat;',
  ];

  for (const line of removeLines) {
    if (updated.includes(line)) {
      updated = updated.replace(line + '\n', '');
      changed = true;
    }
  }

  // Restore width/height if we had shrunk them for scaling
  if (updated.includes('width: 960px;')) {
    updated = updated.replace('width: 960px;', 'width: 1920px;');
    changed = true;
  }
  if (updated.includes('height: 540px;')) {
    updated = updated.replace('height: 540px;', 'height: 1080px;');
    changed = true;
  }

  if (!changed) return false;

  try {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Reverted scale in ${filePath}`);
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
    const appCssPath = path.join(PACKAGES_DIR, dir, 'src', 'App.css');
    if (!fs.existsSync(appCssPath)) continue;
    if (revertAppCss(appCssPath)) {
      changedCount += 1;
    }
  }

  console.log(`Done. Reverted ${changedCount} App.css file(s).`);
}

main();


