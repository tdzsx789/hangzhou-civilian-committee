const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../先进组织更新');
const prefixRegex = /^\s*\d+(?:[\.．]\s*|\s+)/;

function collect() {
  const out = [];
  if (!fs.existsSync(targetDir)) {
    console.error('目录不存在:', targetDir);
    process.exit(1);
  }
  const first = fs.readdirSync(targetDir);
  first.forEach(p => {
    if (p.startsWith('.')) return;
    const pdir = path.join(targetDir, p);
    const pst = fs.statSync(pdir);
    if (!pst.isDirectory()) return;
    const second = fs.readdirSync(pdir);
    second.forEach(s => {
      if (s.startsWith('.')) return;
      const sdir = path.join(pdir, s);
      const sst = fs.statSync(sdir);
      if (!sst.isDirectory()) return;
      const name = s.replace(prefixRegex, '');
      out.push({ filaName: s, name });
    });
  });
  return out;
}

const arr = collect();
const outputPath = path.join(__dirname, '../subfolders.json');
fs.writeFileSync(outputPath, JSON.stringify(arr, null, 2), 'utf8');
process.stdout.write(JSON.stringify(arr, null, 2));
