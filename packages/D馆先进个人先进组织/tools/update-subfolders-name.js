const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../subfolders.json');

function run() {
  if (!fs.existsSync(jsonPath)) {
    console.error('文件不存在:', jsonPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const arr = JSON.parse(raw);
  const out = arr.map(item => {
    const src = item.trueName || item.filaName || '';
    const parts = String(src).split(/[-－]/);
    const name = parts.length ? parts[0].trim() : '';
    return { ...item, name };
  });
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('已更新 name 字段:', out.length);
}

run();
