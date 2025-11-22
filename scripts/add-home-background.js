#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function addHomeBackground(exhibition) {
  const { name, id, gallery } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    console.log(`⏭️  跳过不存在的展项: ${id}`);
    return false;
  }
  
  const homeJsPath = path.join(exhibitionPath, 'src', 'pages', 'Home', 'index.js');
  const homeCssPath = path.join(exhibitionPath, 'src', 'pages', 'Home', 'index.css');
  
  if (!fs.existsSync(homeJsPath)) {
    console.log(`⏭️  跳过没有Home页面的展项: ${id}`);
    return false;
  }
  
  console.log(`🔄 正在更新: ${id} (${name})`);
  
  // 读取现有的Home/index.js
  let homeJsContent = fs.readFileSync(homeJsPath, 'utf8');
  
  // 检查是否已经导入了cover.jpg
  if (!homeJsContent.includes('cover.jpg')) {
    // 在import语句后添加cover图片导入
    if (homeJsContent.includes("import startImg from")) {
      homeJsContent = homeJsContent.replace(
        /(import startImg from[^\n]+)/,
        `$1\nimport coverImg from '../../assets/cover.jpg';`
      );
    } else {
      // 如果没有startImg导入，在第一个import后添加
      homeJsContent = homeJsContent.replace(
        /(import[^\n]+)/,
        `$1\nimport coverImg from '../../assets/cover.jpg';`
      );
    }
    
    fs.writeFileSync(homeJsPath, homeJsContent);
  }
  
  // 读取现有的CSS
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 更新.home-page样式，添加背景图
  const newHomePageStyle = `.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url('../../assets/cover.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`;
  
  // 替换.home-page样式
  cssContent = cssContent.replace(
    /\.home-page\s*\{[\s\S]*?\}/,
    newHomePageStyle
  );
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始为 ${exhibitions.length} 个展项的首页添加背景图...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = addHomeBackground(exhibition);
  if (success) {
    updated++;
  } else {
    skipped++;
  }
});

console.log(`\n✅ 完成！`);
console.log(`   更新: ${updated} 个`);
console.log(`   跳过: ${skipped} 个`);
console.log(`   总计: ${exhibitions.length} 个`);

