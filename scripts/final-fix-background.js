#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 最终修复背景图
function finalFixBackground(exhibition) {
  const { name, id } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    return false;
  }
  
  const homeJsPath = path.join(exhibitionPath, 'src', 'pages', 'Home', 'index.js');
  const homeCssPath = path.join(exhibitionPath, 'src', 'pages', 'Home', 'index.css');
  
  if (!fs.existsSync(homeJsPath)) {
    return false;
  }
  
  console.log(`🔄 正在修复: ${id} (${name})`);
  
  // 读取现有的Home/index.js
  let homeJsContent = fs.readFileSync(homeJsPath, 'utf8');
  
  // 确保导入了cover.jpg
  if (!homeJsContent.includes('cover.jpg')) {
    if (homeJsContent.includes("import startImg from")) {
      homeJsContent = homeJsContent.replace(
        /(import startImg from[^\n]+)/,
        `$1\nimport coverImg from '../../assets/cover.jpg';`
      );
    } else {
      homeJsContent = homeJsContent.replace(
        /(import[^\n]+)/,
        `$1\nimport coverImg from '../../assets/cover.jpg';`
      );
    }
  }
  
  // 在home-page div上添加内联样式
  if (!homeJsContent.includes('backgroundImage')) {
    homeJsContent = homeJsContent.replace(
      /<div className="home-page">/,
      `<div className="home-page" style={{ backgroundImage: \`url(\${coverImg})\`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>`
    );
  }
  
  fs.writeFileSync(homeJsPath, homeJsContent);
  
  // 清理CSS中的背景相关样式（因为现在用内联样式）
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 移除所有背景相关的CSS属性
  cssContent = cssContent.replace(/\s*background[^:]*:\s*[^;]+;/g, '');
  cssContent = cssContent.replace(/\s*background-size[^:]*:\s*[^;]+;/g, '');
  cssContent = cssContent.replace(/\s*background-position[^:]*:\s*[^;]+;/g, '');
  cssContent = cssContent.replace(/\s*background-repeat[^:]*:\s*[^;]+;/g, '');
  
  // 确保.home-page样式干净
  cssContent = cssContent.replace(
    /\.home-page\s*\{[\s\S]*?\}/,
    `.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}`
  );
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始最终修复 ${exhibitions.length} 个展项的首页背景图...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = finalFixBackground(exhibition);
  if (success) {
    updated++;
  } else {
    skipped++;
  }
});

console.log(`\n✅ 完成！`);
console.log(`   修复: ${updated} 个`);
console.log(`   跳过: ${skipped} 个`);
console.log(`   总计: ${exhibitions.length} 个`);

