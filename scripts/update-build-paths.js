const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname ? path.join(__dirname, '..') : path.resolve('..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

function updateBuildScripts() {
  if (!fs.existsSync(PACKAGES_DIR)) {
    console.error(`Packages directory not found: ${PACKAGES_DIR}`);
    process.exit(1);
  }

  const packageDirs = fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let changedCount = 0;

  for (const dirName of packageDirs) {
    const pkgJsonPath = path.join(PACKAGES_DIR, dirName, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) {
      continue;
    }

    let pkg;
    try {
      const raw = fs.readFileSync(pkgJsonPath, 'utf8');
      pkg = JSON.parse(raw);
    } catch (e) {
      console.warn(`Failed to read or parse ${pkgJsonPath}:`, e.message);
      continue;
    }

    if (!pkg.scripts || !pkg.scripts.build) {
      continue;
    }

    const originalBuild = pkg.scripts.build;

    // Only touch CRA-style builds and avoid re-writing if already has BUILD_PATH
    if (
      typeof originalBuild === 'string' &&
      originalBuild.includes('react-scripts build') &&
      !originalBuild.includes('BUILD_PATH=')
    ) {
      pkg.scripts.build = `BUILD_PATH=${dirName} ${originalBuild}`;

      try {
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        console.log(`Updated build script in ${pkgJsonPath}`);
        changedCount += 1;
      } catch (e) {
        console.warn(`Failed to write ${pkgJsonPath}:`, e.message);
      }
    }
  }

  console.log(`Done. Updated build scripts in ${changedCount} package(s).`);
}

updateBuildScripts();


