#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 优化hover样式
function optimizeButtonHover(exhibition) {
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
  
  // 更新hover样式，移除背景色和阴影（因为现在是图片按钮）
  const newHoverStyle = `.learn-more-btn:hover {
  transform: translateX(-50%) scale(1.15);
  animation: none; /* 悬停时暂停呼吸动画 */
}`;
  
  cssContent = cssContent.replace(
    /\.learn-more-btn:hover\s*\{[\s\S]*?\}/,
    newHoverStyle
  );
  
  fs.writeFileSync(homeCssPath, cssContent);
  console.log(`✅ 已优化: ${id}`);
  return true;
}

// 批量优化所有展项
console.log(`📋 开始优化按钮hover样式...\n`);

let optimized = 0;

exhibitions.forEach((exhibition) => {
  if (optimizeButtonHover(exhibition)) {
    optimized++;
  }
});

console.log(`\n✅ 完成！优化了 ${optimized} 个文件`);

