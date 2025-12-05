const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');

// 获取所有 packages 目录
const packages = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let updatedCount = 0;

packages.forEach(pkgName => {
  const appJsPath = path.join(packagesDir, pkgName, 'src', 'App.js');
  
  if (!fs.existsSync(appJsPath)) {
    return;
  }

  let content = fs.readFileSync(appJsPath, 'utf8');
  const originalContent = content;

  // 检查是否已经添加了自动返回逻辑
  if (content.includes('touchstart') && (content.includes('autoReturnTimer') || content.includes('resetTimer'))) {
    console.log(`Skipped ${pkgName} - already has auto return logic`);
    return;
  }

  // 1. 确保导入了 useEffect（如果没有）
  if (!content.includes('useEffect')) {
    // 查找 useState 的导入
    const useStateMatch = content.match(/import React, \{([^}]+)\} from 'react';/);
    if (useStateMatch) {
      const imports = useStateMatch[1];
      if (!imports.includes('useEffect')) {
        content = content.replace(
          /import React, \{([^}]+)\} from 'react';/,
          `import React, {$1, useEffect} from 'react';`
        );
      }
    } else {
      // 如果没有找到 useState，检查是否有其他导入方式
      if (content.includes("import React from 'react';")) {
        content = content.replace(
          /import React from 'react';/,
          "import React, { useEffect } from 'react';"
        );
      } else if (content.includes("import React, { useState }")) {
        content = content.replace(
          /import React, \{ useState \}/,
          "import React, { useState, useEffect }"
        );
      }
    }
  }

  // 2. 检查是否有 setCurrentPage，直接使用它返回 home
  if (!content.includes('setCurrentPage')) {
    console.log(`Could not find setCurrentPage in ${pkgName}, skipping...`);
    return;
  }
  
  const returnHomeCode = "setCurrentPage('home')";

  // 3. 找到 App 函数内部，在最后一个 useEffect 或最后一个函数定义之后、return 之前添加
  // 查找 function App() 或 const App = () => {
  const appFunctionMatch = content.match(/(function\s+App\s*\([^)]*\)\s*\{|const\s+App\s*=\s*(\([^)]*\)\s*)?=>\s*\{)/);
  
  if (!appFunctionMatch) {
    console.log(`Could not find App function in ${pkgName}`);
    return;
  }

  const appStartIndex = appFunctionMatch.index + appFunctionMatch[0].length;
  
  // 找到 return 语句的位置
  const returnMatch = content.substring(appStartIndex).match(/\s+return\s*\(/);
  if (!returnMatch) {
    console.log(`Could not find return statement in ${pkgName}`);
    return;
  }

  const returnIndex = appStartIndex + returnMatch.index;
  
  // 在 return 之前插入 useEffect
  const autoReturnCode = `
  // 2分钟无交互自动返回Home页
  useEffect(() => {
    let autoReturnTimer = null;

    const resetTimer = () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      autoReturnTimer = setTimeout(() => {
        ${returnHomeCode};
      }, 300000); // 2分钟 = 300000毫秒
    };

    const handleTouchStart = () => {
      resetTimer();
    };

    // 初始化定时器
    resetTimer();

    // 监听 touchstart 事件
    document.addEventListener('touchstart', handleTouchStart);

    // 清理函数
    return () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);`;

  // 在 return 之前插入代码
  content = content.slice(0, returnIndex) + autoReturnCode + '\n' + content.slice(returnIndex);

  if (content !== originalContent) {
    fs.writeFileSync(appJsPath, content, 'utf8');
    console.log(`Added auto return to home in ${pkgName}`);
    updatedCount++;
  }
});

console.log(`\nDone. Updated ${updatedCount} App.js file(s).`);

