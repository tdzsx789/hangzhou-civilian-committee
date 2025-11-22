#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 更新单个展项的函数
function updateExhibition(exhibition) {
  const { name, id, gallery } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    console.log(`⏭️  跳过不存在的展项: ${id}`);
    return false;
  }
  
  console.log(`🔄 正在更新: ${id} (${name})`);
  
  // 更新 public/index.html - 添加禁止右键和触摸长按
  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="杭州市民委员会 - ${name}" />
    <title>${name}</title>
    <style>
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    </style>
    <script>
      // 禁止右键菜单
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      
      // 禁止触摸长按
      document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      });
      
      let touchTimer;
      document.addEventListener('touchstart', function(e) {
        touchTimer = setTimeout(function() {
          e.preventDefault();
        }, 500);
      });
      
      document.addEventListener('touchend', function() {
        clearTimeout(touchTimer);
      });
      
      document.addEventListener('touchmove', function() {
        clearTimeout(touchTimer);
      });
    </script>
  </head>
  <body>
    <noscript>您需要启用JavaScript才能运行此应用程序。</noscript>
    <div id="root"></div>
  </body>
</html>`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'public', 'index.html'),
    indexHtml
  );
  
  // 更新 src/index.css
  const indexCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

html, body {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#root {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  position: relative;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'index.css'),
    indexCss
  );
  
  // 更新 src/App.js - 添加首页和详情页
  const appJs = `import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <div className="home-page">
          <header className="home-header">
            <h1>${name}</h1>
            <p>${gallery}</p>
          </header>
          <button className="learn-more-btn" onClick={handleLearnMore}>
            了解更多
          </button>
        </div>
      ) : (
        <div className="detail-page">
          <header className="detail-header">
            <button className="back-btn" onClick={handleBack}>返回</button>
            <h1>${name}</h1>
            <p>${gallery} - 详情页</p>
          </header>
          <div className="detail-content">
            <p>这里是详情页内容</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'App.js'),
    appJs
  );
  
  // 更新 src/App.css
  const appCss = `.App {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;
}

/* 首页样式 */
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
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.learn-more-btn:hover {
  background-color: white;
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.learn-more-btn:active {
  transform: translateX(-50%) scale(0.98);
}

/* 详情页样式 */
.detail-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  overflow: hidden;
}

.detail-header {
  padding: 40px 60px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 30px;
}

.back-btn {
  padding: 12px 30px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.back-btn:hover {
  background-color: white;
  transform: scale(1.05);
}

.back-btn:active {
  transform: scale(0.98);
}

.detail-header h1 {
  font-size: 48px;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.detail-header p {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.detail-content {
  flex: 1;
  padding: 60px;
  color: white;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.detail-content p {
  font-size: 24px;
  line-height: 1.8;
}`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'App.css'),
    appCss
  );
  
  return true;
}

// 批量更新所有展项
console.log(`📋 开始更新 ${exhibitions.length} 个展项...\n`);

let updated = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = updateExhibition(exhibition);
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

