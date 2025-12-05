const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');

function main() {
  if (!fs.existsSync(packagesDir)) {
    console.error(`Packages directory not found: ${packagesDir}`);
    process.exit(1);
  }

  const dirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let removed = 0;
  dirs.forEach((dir) => {
    const target = path.join(packagesDir, dir, dir);
    if (fs.existsSync(target)) {
      try {
        fs.rmSync(target, { recursive: true, force: true });
        console.log(`Removed ${target}`);
        removed += 1;
      } catch (e) {
        console.warn(`Failed to remove ${target}: ${e.message}`);
      }
    }
  });

  console.log(`Done. Removed ${removed} folder(s).`);
}

main();


