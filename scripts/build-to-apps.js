const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packagesDir = path.join(__dirname, '..', 'packages');
const appsDir = path.join(__dirname, '..', 'apps');

// 确保 apps 目录存在
if (!fs.existsSync(appsDir)) {
  fs.mkdirSync(appsDir, { recursive: true });
  console.log(`Created apps directory: ${appsDir}`);
}

// 获取所有 packages 目录
const packages = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let successCount = 0;
let failCount = 0;
const failures = [];

console.log(`Found ${packages.length} packages to build.\n`);
console.log(`Build output will be placed in: ${appsDir}\n`);

packages.forEach((pkgName, index) => {
  const pkgPath = path.join(packagesDir, pkgName);
  const packageJsonPath = path.join(pkgPath, 'package.json');
  
  // 检查是否有 package.json
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`[${index + 1}/${packages.length}] ⏭️  Skipped ${pkgName} - no package.json`);
    return;
  }

  // 检查是否有 build 脚本
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.scripts || !packageJson.scripts.build) {
      console.log(`[${index + 1}/${packages.length}] ⏭️  Skipped ${pkgName} - no build script`);
      return;
    }
  } catch (e) {
    console.log(`[${index + 1}/${packages.length}] ⏭️  Skipped ${pkgName} - invalid package.json`);
    return;
  }

  console.log(`[${index + 1}/${packages.length}] 🔨 Building ${pkgName}...`);
  
  try {
    // 设置 BUILD_PATH 为 ../../apps/文件夹名（从 packages/xxx 到根目录的 apps）
    const buildPath = path.join('..', '..', 'apps', pkgName);
    
    // 保存原始的 build 脚本
    const originalBuildScript = packageJson.scripts.build;
    
    // 修改 build 脚本，将 BUILD_PATH 设置为目标路径
    // 移除原有的 BUILD_PATH 设置（如果有）
    let newBuildScript = originalBuildScript.replace(/BUILD_PATH=[^\s]+\s*/, '');
    // 添加新的 BUILD_PATH
    newBuildScript = `BUILD_PATH=${buildPath} ${newBuildScript.trim()}`;
    
    // 临时修改 package.json
    packageJson.scripts.build = newBuildScript;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    
    try {
      // 执行构建
      execSync('npm run build', {
        cwd: pkgPath,
        stdio: 'inherit',
        env: { ...process.env, CI: 'false' }
      });
    } finally {
      // 恢复原始的 build 脚本
      packageJson.scripts.build = originalBuildScript;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    }
    
    // 检查打包输出目录是否存在
    const buildOutputDir = path.join(appsDir, pkgName);
    if (fs.existsSync(buildOutputDir)) {
      console.log(`[${index + 1}/${packages.length}] ✅ Built ${pkgName} -> apps/${pkgName}/\n`);
      successCount++;
    } else {
      console.log(`[${index + 1}/${packages.length}] ⚠️  Built ${pkgName} but output directory not found at apps/${pkgName}/\n`);
      successCount++;
    }
  } catch (error) {
    console.error(`[${index + 1}/${packages.length}] ❌ Failed to build ${pkgName}`);
    console.error(error.message);
    console.log('');
    failCount++;
    failures.push(pkgName);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Build Summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
if (failures.length > 0) {
  console.log(`\nFailed packages:`);
  failures.forEach(pkg => console.log(`  - ${pkg}`));
}
console.log('='.repeat(60));

