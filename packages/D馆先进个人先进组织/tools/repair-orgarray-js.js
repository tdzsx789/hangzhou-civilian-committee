const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const orgArrayJsPath = path.join(baseDir, 'orgArray.js');

function readText(fp) {
  return fs.readFileSync(fp, 'utf8');
}

function toTemplateLiteral(s) {
  return '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
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
  t = t.replace(/^\s*[^\n]*简介[^\n]*\n?/, '');
  t = t.replace(/^[^。\n!?！？；;]*简介[^。\n!?！？；;]*[。；;!?！？]?\s*/, '');
  t = t.split('\n').filter(l => !/^[A-Za-z_0-9]{1,30}$/.test(l)).join('\n');
  t = t.replace(/[ \t]+\n/g, '\n');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

function serializeItem(item) {
  const parts = [];
  parts.push(`  {`);
  parts.push(`    "originName": ${JSON.stringify(item.originName || '')},`);
  parts.push(`    "trueName": ${JSON.stringify(item.trueName || '')},`);
  parts.push(`    "name": ${JSON.stringify(item.name || '')},`);
  parts.push(`    "title": ${JSON.stringify(item.title || '')},`);
  const sum = item.summary === '有图片' ? '有图片' : sanitizeText(item.summary || '');
  parts.push(`    "summary": ${toTemplateLiteral(sum)}`);
  parts.push(`  }`);
  return parts.join('\n');
}

function parseItemsFromJs(jsContent) {
  const items = [];
  const originRe = /"originName":\s*"([\s\S]*?)"/g;
  let m;
  while ((m = originRe.exec(jsContent)) !== null) {
    const origin = m[1];
    const start = m.index;
    const next = jsContent.indexOf('"originName":', originRe.lastIndex);
    const slice = jsContent.slice(start, next !== -1 ? next : jsContent.length);
    const getField = (key) => {
      const re = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"`);
      const mm = re.exec(slice);
      return mm ? mm[1] : '';
    };
    const summaryRe = /"summary":\s*`([\s\S]*?)`/;
    const sm = summaryRe.exec(slice);
    const item = {
      originName: origin,
      trueName: getField('trueName'),
      name: getField('name'),
      title: getField('title'),
      summary: sm ? sm[1] : ''
    };
    items.push(item);
  }
  return items;
}

function run() {
  if (!fs.existsSync(orgArrayJsPath)) {
    console.error('orgArray.js not found');
    process.exit(1);
  }
  const jsText = readText(orgArrayJsPath);
  const parsedItems = parseItemsFromJs(jsText);

  const output = [
    `export const orgArray = [`,
    parsedItems.map(serializeItem).join(',\n'),
    `]`,
  ].join('\n');

  fs.writeFileSync(orgArrayJsPath, output, 'utf8');
  console.log(`Parsed and repaired items: ${parsedItems.length}`);
  console.log(`orgArray.js repaired and rewritten successfully.`);
}

run();
