#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function updateBreatheTiming(exhibition) {
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
  
  // 更新动画时长：从2s改为4s（更慢）
  cssContent = cssContent.replace(
    /animation:\s*breathe\s+2s/,
    'animation: breathe 4s'
  );
  
  // 更新关键帧：添加中间停顿，让呼吸更自然
  // 0% -> 40% 变大 -> 60% 保持最大 -> 100% 变小
  const newKeyframes = `/* 呼吸灯动画关键帧 - 变大变小效果，带中间停顿 */
@keyframes breathe {
  0% {
    transform: translateX(-50%) scale(0.95);
  }
  40% {
    transform: translateX(-50%) scale(1.1);
  }
  60% {
    transform: translateX(-50%) scale(1.1);
  }
  100% {
    transform: translateX(-50%) scale(0.95);
  }
}`;
  
  // 替换关键帧
  cssContent = cssContent.replace(/\/\* 呼吸灯动画关键帧[\s\S]*?\*\/\s*@keyframes breathe[\s\S]*?}/, newKeyframes);
  
  // 如果上面的替换没成功，尝试更简单的匹配
  if (!cssContent.includes('40%')) {
    cssContent = cssContent.replace(/@keyframes breathe[\s\S]*?}/, newKeyframes);
  }
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始更新 ${exhibitions.length} 个展项的呼吸灯动画节奏...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = updateBreatheTiming(exhibition);
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

