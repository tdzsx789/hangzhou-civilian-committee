#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function updateBreatheAnimation(exhibition) {
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
  
  console.log(`🔄 正在更新: ${id} (${name})`);
  
  // 读取现有的CSS文件
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 新的呼吸灯动画 - 纯粹的变大变小效果
  const newBreatheKeyframes = `/* 呼吸灯动画关键帧 - 变大变小效果 */
@keyframes breathe {
  0%, 100% {
    transform: translateX(-50%) scale(0.95);
  }
  50% {
    transform: translateX(-50%) scale(1.1);
  }
}`;
  
  // 替换原有的动画关键帧（匹配多种可能的格式）
  cssContent = cssContent.replace(/\/\* 呼吸灯动画关键帧[\s\S]*?\*\/\s*@keyframes breathe[\s\S]*?}/, newBreatheKeyframes);
  
  // 如果上面的替换没成功，尝试更简单的匹配
  if (!cssContent.includes('scale(1.1)')) {
    cssContent = cssContent.replace(/@keyframes breathe[\s\S]*?}/, newBreatheKeyframes);
  }
  
  // 更新 hover 状态
  cssContent = cssContent.replace(
    /\.learn-more-btn:hover\s*\{[\s\S]*?\}/,
    `.learn-more-btn:hover {
  background-color: white;
  transform: translateX(-50%) scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  animation: none; /* 悬停时暂停呼吸动画 */
}`
  );
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始更新 ${exhibitions.length} 个展项的呼吸灯动画...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = updateBreatheAnimation(exhibition);
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
