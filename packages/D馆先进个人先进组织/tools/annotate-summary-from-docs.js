const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const baseDir = path.join(rootDir, '..');
const orgArrayPath = path.join(baseDir, 'orgArray.json');
const updatesRoot = path.join(baseDir, '先进组织更新');

function listDirs(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).map(name => path.join(p, name)).filter(fp => {
    try {
      return fs.statSync(fp).isDirectory();
    } catch {
      return false;
    }
  });
}

function buildFolderMap() {
  const map = new Map();
  const provinces = listDirs(updatesRoot);
  provinces.forEach(provincePath => {
    const items = listDirs(provincePath);
    items.forEach(itemPath => {
      const base = path.basename(itemPath);
      map.set(base, itemPath);
    });
  });
  return map;
}

function hasImageInDocx(fp) {
  try {
    const xml = execSync(`unzip -p "${fp}" word/document.xml`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
    if (!xml) return false;
    if (xml.includes('<w:drawing') || xml.includes('<v:imagedata') || xml.includes('<w:pict')) return true;
    return false;
  } catch {
    return false;
  }
}

function hasImageBySignature(fp) {
  try {
    const buf = fs.readFileSync(fp);
    const markers = [
      Buffer.from([0x89, 0x50, 0x4E, 0x47]),
      Buffer.from('JFIF', 'ascii'),
      Buffer.from('Exif', 'ascii'),
      Buffer.from('GIF8', 'ascii'),
      Buffer.from('BM', 'ascii')
    ];
    for (const m of markers) {
      if (buf.indexOf(m) !== -1) return true;
    }
    return false;
  } catch {
    return false;
  }
}

function detectImagesInFolder(folderPath) {
  let files = [];
  try {
    files = fs.readdirSync(folderPath).map(n => path.join(folderPath, n));
  } catch {
    return false;
  }
  const docFiles = files.filter(fp => {
    const ext = path.extname(fp).toLowerCase();
    return ['.docx', '.doc', '.wps'].includes(ext);
  });
  for (const f of docFiles) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.docx') {
      if (hasImageInDocx(f)) return true;
    } else {
      if (hasImageBySignature(f)) return true;
    }
  }
  return false;
}

function run() {
  if (!fs.existsSync(orgArrayPath)) {
    console.error('orgArray.json not found');
    process.exit(1);
  }
  const orgArray = JSON.parse(fs.readFileSync(orgArrayPath, 'utf8'));
  const folderMap = buildFolderMap();
  let updated = 0;
  let matched = 0;
  let unmatched = 0;
  const newArray = orgArray.map(item => {
    const folderPath = folderMap.get(item.originName);
    if (folderPath) {
      matched++;
      const hasImg = detectImagesInFolder(folderPath);
      const summary = hasImg ? '有图片' : '``';
      if (item.summary !== summary) updated++;
      return { ...item, summary };
    } else {
      unmatched++;
      return { ...item };
    }
  });
  fs.writeFileSync(orgArrayPath, JSON.stringify(newArray, null, 2), 'utf8');
  console.log(`Matched folders: ${matched}`);
  console.log(`Unmatched folders: ${unmatched}`);
  console.log(`Updated summary fields: ${updated}`);
}

run();
