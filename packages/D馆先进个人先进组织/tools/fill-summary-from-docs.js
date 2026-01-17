const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname, '..');
const orgArrayJsPath = path.join(baseDir, 'orgArray.js');
const updatesRoot = path.join(baseDir, '先进组织更新');

function readFile(fp) {
  return fs.readFileSync(fp, 'utf8');
}

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

function toTemplateLiteral(s) {
  return '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pickDocFile(files) {
  const docx = files.find(f => path.extname(f).toLowerCase() === '.docx');
  if (docx) return docx;
  const doc = files.find(f => path.extname(f).toLowerCase() === '.doc');
  if (doc) return doc;
  const wps = files.find(f => path.extname(f).toLowerCase() === '.wps');
  if (wps) return wps;
  return null;
}

function getFolderFiles(folderPath) {
  try {
    return fs.readdirSync(folderPath).map(n => path.join(folderPath, n)).filter(fp => fs.statSync(fp).isFile());
  } catch {
    return [];
  }
}

function extractDocxText(fp) {
  try {
    const xml = execSync(`unzip -p "${fp}" word/document.xml`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
    if (!xml) return '';
    const withBreaks = xml.replace(/<\/w:p>/g, '\n');
    const parts = [];
    const re = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let m;
    while ((m = re.exec(withBreaks)) !== null) {
      parts.push(m[1]);
    }
    const text = parts.join('').replace(/\r/g, '').replace(/\u0000/g, '');
    return text;
  } catch {
    return '';
  }
}

function extractWithTextutil(fp) {
  try {
    const out = execSync(`textutil -convert txt -stdout "${fp}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
    return out || '';
  } catch {
    return '';
  }
}

function extractWithStrings(fp) {
  try {
    const out = execSync(`strings "${fp}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
    return out || '';
  } catch {
    return '';
  }
}

function extractTextFromFile(fp) {
  const ext = path.extname(fp).toLowerCase();
  if (ext === '.docx') return extractDocxText(fp);
  if (ext === '.doc') {
    const t = extractWithTextutil(fp);
    if (t) return t;
    return extractWithStrings(fp);
  }
  if (ext === '.wps') {
    const t = extractWithTextutil(fp);
    if (t) return t;
    return extractWithStrings(fp);
  }
  return '';
}

function stripTitle(text, originName) {
  const namePart = originName.split(/[-－]/)[0].trim();
  const lines = String(text).replace(/\r/g, '').split('\n').map(l => l.trim());
  while (lines.length && lines[0] === '') lines.shift();
  if (!lines.length) return '';
  while (lines.length && /简介/.test(lines[0])) lines.shift();
  let start = 0;
  const isTitleLike = (s) => !!s && s.length <= 80 && (s.includes('简介') || (namePart && s.includes(namePart)));
  while (isTitleLike(lines[start])) start++;
  let body = lines.slice(start).join('\n').trim();
  body = body.replace(/^[^。\n!?！？；;]*简介[^。\n!?！？；;]*[。；;!?！？]?\s*/, '');
  return body;
}

function sanitizeText(s) {
  let t = String(s);
  t = t.replace(/\r/g, '');
  t = t.replace(/<[^>]+>/g, '');
  t = t.replace(/PAGE[\s\\]*\*[\s\\]*MERGEFORMAT(?:\s*\d+)?/gi, '');
  t = t.replace(/^\s*PAGE(?:\s*\d+)?\s*$/gmi, '');
  t = t.replace(/\bMERGEFORMAT\b/gi, '');
  t = t.replace(/\bPAGE\b(?:\s*\d+)?/gi, '');
  t = t.replace(/HYPERLINK\s+"[^"]*"(?:[\s\\]*"[^"]*")?/gi, '');
  t = t.replace(/https?:\/\/\S+/gi, '');
  t = t.replace(/\b_blank\b/gi, '');
  t = t.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFC\uFFFD]+/g, '');
  t = t.replace(/\b([A-Za-z]{2,})\1+\b/g, '$1');
  t = t.replace(/\\{2,}/g, '\\');
  t = t.split('\n').filter(l => !/^[A-Za-z_0-9]{1,30}$/.test(l)).join('\n');
  t = t.replace(/[ \t]+\n/g, '\n');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

function serializeItem(item) {
  const keys = ['originName', 'trueName', 'name', 'title', 'summary'];
  const lines = [];
  keys.forEach((k, idx) => {
    if (k === 'summary') {
      const v = toTemplateLiteral(item.summary || '');
      lines.push(`    "summary": ${v}`);
    } else {
      lines.push(`    "${k}": ${JSON.stringify(item[k] || '')}`);
    }
  });
  return `  {\n${lines.join(',\n')}\n  }`;
}

function run() {
  const js = readFile(orgArrayJsPath);
  const folderMap = buildFolderMap();
  let matched = 0;
  let updated = 0;
  const originRegex = /"originName":\s*"([\s\S]*?)"/g;
  let newJs = js;
  let m;
  while ((m = originRegex.exec(js)) !== null) {
    const origin = m[1];
    const folderPath = folderMap.get(origin);
    if (!folderPath) continue;
    matched++;
    const files = getFolderFiles(folderPath);
    const docFile = pickDocFile(files);
    if (!docFile) continue;
    const rawText = extractTextFromFile(docFile);
    const body = stripTitle(rawText, origin);
    const originEsc = escapeRegex(origin);
    const targetRe = new RegExp(`("originName":\\s*"${originEsc}"[\\s\\S]*?"summary":\\s*)\\\`\\\``);
    if (targetRe.test(newJs)) {
      const clean = sanitizeText(body);
      const replacement = `$1${toTemplateLiteral(clean)}`;
      const replaced = newJs.replace(targetRe, replacement);
      if (replaced !== newJs) {
        newJs = replaced;
        updated++;
      }
    }
  }
  fs.writeFileSync(orgArrayJsPath, newJs, 'utf8');
  console.log(`Matched folders: ${matched}`);
  console.log(`Updated summary fields: ${updated}`);
}

run();
