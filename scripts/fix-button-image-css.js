#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function fixButtonImageCss(exhibition) {
  const { name, id } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    console.log(`⏭️  跳过不存在的展项: ${id}`);
    return false;
  }
  
  const homeCssPath = path.join(exhibitionPath, 'src', 'pages', 'Home', 'index.css');
  
  if (!fs.existsSync(homeCssPath)) {
    console.log(`⏭️  跳过没有Home页面的展项: ${id}`);
    return false;
  }
  
  console.log(`🔄 正在修复: ${id} (${name})`);
  
  // 读取现有的CSS
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 更新.learn-more-btn样式，移除文字相关的样式，优化图片显示
  const newButtonStyle = `.learn-more-btn {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 呼吸灯动画 - 变大变小效果，带中间停顿 */
  animation: breathe 4s ease-in-out infinite;
}

.learn-more-btn img {
  display: block;
  max-width: 100%;
  height: auto;
}`;
  
  // 替换.learn-more-btn的样式
  cssContent = cssContent.replace(/\.learn-more-btn\s*\{[\s\S]*?\}/, newButtonStyle);
  
  // 确保img样式存在
  if (!cssContent.includes('.learn-more-btn img')) {
    cssContent = cssContent.replace(
      /(\.learn-more-btn\s*\{[\s\S]*?\})/,
      `$1\n\n.learn-more-btn img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}`
    );
  } else {
    // 更新现有的img样式
    cssContent = cssContent.replace(
      /\.learn-more-btn img\s*\{[\s\S]*?\}/,
      `.learn-more-btn img {
  display: block;
  max-width: 100%;
  height: auto;
}`
    );
  }
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始修复 ${exhibitions.length} 个展项的按钮图片样式...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = fixButtonImageCss(exhibition);
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

