#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function updateHomeButton(exhibition) {
  const { name, id, gallery } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    console.log(`⏭️  跳过不存在的展项: ${id}`);
    return false;
  }
  
  const homePath = path.join(exhibitionPath, 'src', 'pages', 'Home');
  
  if (!fs.existsSync(homePath)) {
    console.log(`⏭️  跳过没有Home页面的展项: ${id}`);
    return false;
  }
  
  console.log(`🔄 正在更新: ${id} (${name})`);
  
  // 更新 Home/index.js - 将button改为div
  const homeJs = `import React from 'react';
import './index.css';

function Home({ onLearnMore }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>${name}</h1>
        <p>${gallery}</p>
      </header>
      <div className="learn-more-btn" onClick={onLearnMore}>
        了解更多
      </div>
    </div>
  );
}

export default Home;`;
  
  fs.writeFileSync(
    path.join(homePath, 'index.js'),
    homeJs
  );
  
  // 更新 Home/index.css - 添加呼吸灯动画
  const homeCss = `/* 首页样式 */
.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.home-header {
  text-align: center;
  color: white;
  margin-bottom: 100px;
}

.home-header h1 {
  font-size: 64px;
  margin: 0 0 20px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.home-header p {
  font-size: 32px;
  margin: 0;
  opacity: 0.9;
}

.learn-more-btn {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 60px;
  font-size: 28px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 50px;
  
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 呼吸灯动画 */
  animation: breathe 2s ease-in-out infinite;
}

/* 呼吸灯动画关键帧 */
@keyframes breathe {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2),
                0 0 0 0 rgba(255, 255, 255, 0.7);
    transform: translateX(-50%) scale(0.95);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2),
                0 0 0 20px rgba(255, 255, 255, 0);
    transform: translateX(-50%) scale(1.02);
  }
}

.learn-more-btn:hover {
  background-color: white;
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  animation: none; /* 悬停时暂停呼吸动画 */
}

.learn-more-btn:active {
  transform: translateX(-50%) scale(0.98);
}`;
  
  fs.writeFileSync(
    path.join(homePath, 'index.css'),
    homeCss
  );
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始更新 ${exhibitions.length} 个展项的首页按钮...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = updateHomeButton(exhibition);
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

