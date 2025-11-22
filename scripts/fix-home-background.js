#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 修复背景图实现方式
function fixHomeBackground(exhibition) {
  const { name, id, gallery } = exhibition;
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
  if (!homeJsContent.includes('coverImg')) {
    homeJsContent = homeJsContent.replace(
      /<div className="home-page">/,
      `<div className="home-page" style={{ backgroundImage: \`url(\${coverImg})\` }}>`
    );
  }
  
  fs.writeFileSync(homeJsPath, homeJsContent);
  
  // 更新CSS，移除背景渐变，保留其他样式
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 更新.home-page样式，移除渐变背景（因为现在用图片）
  cssContent = cssContent.replace(
    /background:\s*linear-gradient[^;]+;/,
    ''
  );
  cssContent = cssContent.replace(
    /background-image:\s*url\([^)]+\);/,
    ''
  );
  cssContent = cssContent.replace(
    /background-size:\s*cover;/,
    ''
  );
  cssContent = cssContent.replace(
    /background-position:\s*center;/,
    ''
  );
  cssContent = cssContent.replace(
    /background-repeat:\s*no-repeat;/,
    ''
  );
  
  // 确保.home-page有正确的样式
  if (!cssContent.includes('.home-page {')) {
    // 如果.home-page不存在，添加它
    cssContent = `/* 首页样式 */\n.home-page {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n\n` + cssContent;
  } else {
    // 确保.home-page有必要的样式
    if (!cssContent.includes('background-size')) {
      // 添加背景图相关样式（作为备用，主要使用内联样式）
      cssContent = cssContent.replace(
        /(\.home-page\s*\{[^}]*)/,
        `$1\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;`
      );
    }
  }
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始修复 ${exhibitions.length} 个展项的首页背景图...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = fixHomeBackground(exhibition);
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

