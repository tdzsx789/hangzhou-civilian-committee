const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packagesDir = path.join(__dirname, '..', 'packages');

// 获取所有 packages 目录
const packages = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let successCount = 0;
let failCount = 0;
const failures = [];

console.log(`Found ${packages.length} packages to build.\n`);

packages.forEach((pkgName, index) => {
  const pkgPath = path.join(packagesDir, pkgName);
  const packageJsonPath = path.join(pkgPath, 'package.json');
  
  // 检查是否有 package.json
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`[${index + 1}/${packages.length}] ⏭️  Skipped ${pkgName} - no package.json`);
    return;
  }

  // 检查是否有 build 脚本
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
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
    // 在工程目录下执行 build
    execSync('npm run build', {
      cwd: pkgPath,
      stdio: 'inherit',
      env: { ...process.env, CI: 'false' }
    });
    
    // 检查打包输出目录是否存在（应该是和工程文件夹名称一致）
    const buildDir = path.join(pkgPath, pkgName);
    if (fs.existsSync(buildDir)) {
      console.log(`[${index + 1}/${packages.length}] ✅ Built ${pkgName} -> ${pkgName}/\n`);
      successCount++;
    } else {
      console.log(`[${index + 1}/${packages.length}] ⚠️  Built ${pkgName} but output directory not found at ${pkgName}/\n`);
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

