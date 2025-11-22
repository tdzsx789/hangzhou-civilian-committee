#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取命令行参数（支持中文名称）
const exhibitionNameInput = process.argv[2];

if (!exhibitionNameInput) {
  console.error('❌ 请提供展项名称，例如: npm run new A馆展项1');
  process.exit(1);
}

// 使用输入的名称作为展项名称（支持中文）
const exhibitionName = exhibitionNameInput.trim();

// 生成符合npm规范的包名（将中文转换为拼音或使用编码）
// 为了简化，我们使用一个基于名称的编码方式
function generatePackageName(name) {
  // 将中文名称转换为安全的包名
  // 使用简单的编码：将非ASCII字符转换为拼音首字母或使用base64编码的一部分
  let safeName = name
    .replace(/[^\w\u4e00-\u9fa5]/g, '-') // 将特殊字符替换为连字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .toLowerCase();
  
  // 如果包含中文，使用一个简单的哈希方式生成英文名
  if (/[\u4e00-\u9fa5]/.test(name)) {
    // 使用Buffer将中文编码为base64，然后取前16个字符作为包名
    const encoded = Buffer.from(name, 'utf8').toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substring(0, 16)
      .toLowerCase();
    safeName = `exhibition-${encoded}`;
  }
  
  return safeName;
}

const packageNameSafe = generatePackageName(exhibitionName);
const packageName = `@hangzhou-civilian-committee/${packageNameSafe}`;
const exhibitionPath = path.join(__dirname, '..', 'packages', exhibitionName);

// 检查展项是否已存在
if (fs.existsSync(exhibitionPath)) {
  console.error(`❌ 展项 "${exhibitionName}" 已存在！`);
  process.exit(1);
}

console.log(`🚀 正在创建展项: "${exhibitionName}"...`);

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

// 创建 package.json
const packageJson = {
  name: packageName,
  version: "1.0.0",
  private: true,
  description: exhibitionName,
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
    <meta name="description" content="杭州市民委员会 - ${exhibitionName}" />
    <title>${exhibitionName}</title>
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
        <h1>${exhibitionName}</h1>
        <p>杭州市民委员会 - Web展项</p>
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

console.log(`✅ 展项 "${exhibitionName}" 创建成功！`);
console.log(`📦 路径: ${exhibitionPath}`);
console.log(`📦 包名: ${packageName}`);
console.log(`\n💡 下一步:`);
// 如果名称包含空格或特殊字符，需要用引号包裹
const cdPath = exhibitionName.includes(' ') || /[^\w\u4e00-\u9fa5]/.test(exhibitionName) 
  ? `packages/"${exhibitionName}"` 
  : `packages/${exhibitionName}`;
console.log(`   1. cd ${cdPath}`);
console.log(`   2. npm install`);
console.log(`   3. npm start`);

