#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 清理重复CSS的函数
function cleanDuplicateCss(exhibition) {
  const { name, id } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    return false;
  }
  
  const homeCssPath = path.join(exhibitionPath, 'src', 'pages', 'Home', 'index.css');
  
  if (!fs.existsSync(homeCssPath)) {
    return false;
  }
  
  // 读取CSS内容
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 移除重复的.learn-more-btn img样式（保留第一个）
  const imgStyleRegex = /\.learn-more-btn img\s*\{[\s\S]*?\}/g;
  const matches = cssContent.match(imgStyleRegex);
  
  if (matches && matches.length > 1) {
    // 保留第一个，移除其他的
    const firstMatch = matches[0];
    cssContent = cssContent.replace(imgStyleRegex, '');
    // 在.learn-more-btn样式后插入正确的img样式
    cssContent = cssContent.replace(
      /(\.learn-more-btn\s*\{[\s\S]*?\})/,
      `$1\n\n${firstMatch}`
    );
    
    fs.writeFileSync(homeCssPath, cssContent);
    console.log(`✅ 已清理: ${id}`);
    return true;
  }
  
  return false;
}

// 批量清理所有展项
console.log(`📋 开始清理重复的CSS样式...\n`);

let cleaned = 0;

exhibitions.forEach((exhibition) => {
  if (cleanDuplicateCss(exhibition)) {
    cleaned++;
  }
});

console.log(`\n✅ 完成！清理了 ${cleaned} 个文件`);

