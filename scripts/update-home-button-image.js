#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function updateHomeButtonImage(exhibition) {
  const { name, id } = exhibition;
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
  
  // 更新 Home/index.js - 使用图片代替文字
  const homeJs = `import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';

function Home({ onLearnMore }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>${name}</h1>
        <p>${exhibition.gallery}</p>
      </header>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={startImg} alt="了解更多" />
      </div>
    </div>
  );
}

export default Home;`;
  
  fs.writeFileSync(homeJsPath, homeJs);
  
  // 读取现有的CSS
  let cssContent = fs.readFileSync(homeCssPath, 'utf8');
  
  // 更新.learn-more-btn样式，使其适合图片显示
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
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}`;
  
  // 替换.learn-more-btn的样式
  cssContent = cssContent.replace(/\.learn-more-btn\s*\{[\s\S]*?\}/, newButtonStyle);
  
  // 如果替换失败，尝试更精确的匹配
  if (!cssContent.includes('.learn-more-btn img')) {
    // 在.learn-more-btn样式后添加img样式
    cssContent = cssContent.replace(
      /(\.learn-more-btn\s*\{[\s\S]*?\})/,
      `$1\n\n.learn-more-btn img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  display: block;\n}`
    );
  }
  
  fs.writeFileSync(homeCssPath, cssContent);
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始更新 ${exhibitions.length} 个展项的首页按钮为图片...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = updateHomeButtonImage(exhibition);
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

