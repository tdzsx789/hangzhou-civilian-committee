const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const UPDATE_DIR = path.resolve(ROOT, '先进个人更新');
const NEW_PEOPLE_JS = path.resolve(ROOT, 'src/assets/newPeopleData.js');
const OUTPUT_JSON = path.resolve(ROOT, 'wps-compare-advanced-person-update.json');

function extractArraySource(jsText) {
  const exportIdx = jsText.indexOf('export const newPeopleData');
  if (exportIdx === -1) throw new Error('Cannot find export newPeopleData');
  const firstBracket = jsText.indexOf('[', exportIdx);
  if (firstBracket === -1) throw new Error('Cannot find opening [');
  let depth = 0;
  let endIdx = -1;
  for (let i = firstBracket; i < jsText.length; i++) {
    const ch = jsText[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx === -1) throw new Error('Cannot find closing ]');
  return jsText.slice(firstBracket, endIdx + 1);
}

function loadNewPeopleData() {
  const jsText = fs.readFileSync(NEW_PEOPLE_JS, 'utf8');
  const arrSrc = extractArraySource(jsText);
  const newPeopleData = vm.runInNewContext(`(${arrSrc})`, {}, { filename: 'newPeopleData.js' });
  return newPeopleData;
}

function listProvinceFolders() {
  const entries = fs.readdirSync(UPDATE_DIR, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

function walkWpsFiles(dir) {
  const res = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && /\.(wps|docx|doc)$/i.test(e.name)) res.push(p);
    }
  }
  return res;
}

function baseNameNoExt(p) {
  const bn = path.basename(p);
  const i = bn.lastIndexOf('.');
  return i === -1 ? bn : bn.slice(0, i);
}

function main() {
  const data = loadNewPeopleData();
  const folders = listProvinceFolders();
  const matched = [];
  const unmatched = [];
  const sameNameFolders = [];
  let totalWps = 0;

  for (const folder of folders) {
    const province = data.find(p => typeof p.name === 'string' && p.name.includes(folder));
    if (!province) continue;
    sameNameFolders.push({ folder, provinceName: String(province.name || '') });
    const children = Array.isArray(province.children) ? province.children : [];
    const wpsFiles = walkWpsFiles(path.join(UPDATE_DIR, folder));
    totalWps += wpsFiles.length;
    for (const wps of wpsFiles) {
      const base = baseNameNoExt(wps);
      let isMatch = false;
      for (const child of children) {
        const tn = String(child.trueName || '').trim();
        const nm = String(child.name || '').trim();
        if (tn && base === tn) { matched.push({ province: folder, fileName: path.basename(wps), matchedBy: 'trueName' }); isMatch = true; break; }
        if (nm && base === nm) { matched.push({ province: folder, fileName: path.basename(wps), matchedBy: 'name' }); isMatch = true; break; }
      }
      if (!isMatch) unmatched.push({ province: folder, fileName: path.basename(wps) });
    }
  }

  const out = { generatedAt: new Date().toISOString(), sameNameFolders, matched, unmatched, totals: { matched: matched.length, unmatched: unmatched.length, totalWps } };
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT_JSON}`);
  console.log(`Matched: ${matched.length}, Unmatched: ${unmatched.length}, Total WPS: ${totalWps}`);
}

main();
