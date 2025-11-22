#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 确保 packages 目录存在
if (!fs.existsSync(packagesDir)) {
  fs.mkdirSync(packagesDir, { recursive: true });
}

// 生成符合npm规范的包名
function generatePackageName(id) {
  // id 已经是英文格式，直接使用
  return id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

// 创建单个展项的函数
function createExhibition(exhibition) {
  const { name, id, gallery } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  // 检查是否已存在
  if (fs.existsSync(exhibitionPath)) {
    console.log(`⏭️  跳过已存在的展项: ${id} (${name})`);
    return false;
  }
  
  console.log(`🚀 正在创建: ${id} (${name})`);
  
  // 创建目录结构
  const dirs = [
    exhibitionPath,
    path.join(exhibitionPath, 'public'),
    path.join(exhibitionPath, 'src'),
    path.join(exhibitionPath, 'src', 'assets')
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
  
  // 生成包名
  const packageNameSafe = generatePackageName(id);
  const packageName = `@hangzhou-civilian-committee/${packageNameSafe}`;
  
  // 创建 package.json
  const packageJson = {
    name: packageName,
    version: "1.0.0",
    private: true,
    description: `${name} - ${gallery}`,
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1"
    },
    scripts: {
      start: "react-scripts start",
      build: "react-scripts build",
      test: "react-scripts test",
      eject: "react-scripts eject"
    },
    eslintConfig: {
      extends: ["react-app"]
    },
    browserslist: {
      production: [">0.2%", "not dead", "not op_mini all"],
      development: [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    }
  };
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // 创建 public/index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="杭州市民委员会 - ${name}" />
    <title>${name}</title>
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
  
  // 创建 src/index.js
  const indexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'index.js'),
    indexJs
  );
  
  // 创建 src/App.js
  const appJs = `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>${name}</h1>
        <p>${gallery} - ${id}</p>
      </header>
    </div>
  );
}

export default App;`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'App.js'),
    appJs
  );
  
  // 创建 src/App.css
  const appCss = `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

.App-header h1 {
  margin: 0 0 20px 0;
}

.App-header p {
  margin: 0;
  font-size: 18px;
  opacity: 0.8;
}`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'App.css'),
    appCss
  );
  
  // 创建 src/index.css
  const indexCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`;
  
  fs.writeFileSync(
    path.join(exhibitionPath, 'src', 'index.css'),
    indexCss
  );
  
  return true;
}

// 批量创建所有展项
console.log(`📋 开始创建 ${exhibitions.length} 个展项...\n`);

let created = 0;
let skipped = 0;

exhibitions.forEach((exhibition, index) => {
  const success = createExhibition(exhibition);
  if (success) {
    created++;
  } else {
    skipped++;
  }
});

console.log(`\n✅ 完成！`);
console.log(`   创建: ${created} 个`);
console.log(`   跳过: ${skipped} 个`);
console.log(`   总计: ${exhibitions.length} 个`);

