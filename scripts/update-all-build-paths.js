const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');

// 获取所有 packages 目录
const packages = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let updatedCount = 0;

packages.forEach(pkgName => {
  const packageJsonPath = path.join(packagesDir, pkgName, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts || !packageJson.scripts.build) {
      return;
    }

    // 检查当前的 BUILD_PATH 是否和文件夹名称一致
    const currentBuildPath = packageJson.scripts.build.match(/BUILD_PATH=([^\s]+)/);
    const expectedBuildPath = pkgName;

    if (currentBuildPath && currentBuildPath[1] !== expectedBuildPath) {
      // 更新 BUILD_PATH
      packageJson.scripts.build = packageJson.scripts.build.replace(
        /BUILD_PATH=[^\s]+/,
        `BUILD_PATH=${expectedBuildPath}`
      );
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
      console.log(`Updated build path in ${pkgName}: ${currentBuildPath[1]} -> ${expectedBuildPath}`);
      updatedCount++;
    } else if (!currentBuildPath) {
      // 如果没有 BUILD_PATH，添加它
      packageJson.scripts.build = `BUILD_PATH=${expectedBuildPath} react-scripts build`;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
      console.log(`Added build path in ${pkgName}: ${expectedBuildPath}`);
      updatedCount++;
    }
  } catch (e) {
    console.error(`Error processing ${pkgName}: ${e.message}`);
  }
});

console.log(`\nDone. Updated ${updatedCount} package(s).`);

