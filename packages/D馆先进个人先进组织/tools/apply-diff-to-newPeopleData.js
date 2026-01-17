const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const NEW_PEOPLE_JS = path.resolve(ROOT, 'src/assets/newPeopleData.js');
const COMPARE_JSON = path.resolve(ROOT, 'wps-compare-advanced-person-update.json');

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
  return { newPeopleData, jsText, arrSrc };
}

function writeNewPeopleData(jsText, arrSrc, newArr) {
  const updatedSrc = JSON.stringify(newArr, null, 2);
  const outJs = jsText.replace(arrSrc, updatedSrc);
  fs.writeFileSync(NEW_PEOPLE_JS, outJs, 'utf8');
}

function main() {
  const compare = JSON.parse(fs.readFileSync(COMPARE_JSON, 'utf8'));
  const diff = Array.isArray(compare.diffNameArray) ? compare.diffNameArray : [];
  const { newPeopleData, jsText, arrSrc } = loadNewPeopleData();

  for (const item of diff) {
    const province = newPeopleData.find(p => {
      const pn = String(p.name || '');
      const ip = String(item.province || '');
      return pn.includes(ip) || ip.includes(pn);
    });
    if (!province) continue;
    const children = Array.isArray(province.children) ? province.children : [];
    const child = children.find(c => {
      const cn = String(c.name || '').trim();
      const cp = String(c.people || '').trim();
      const mn = String(item.matchedChildName || '').trim();
      const mp = String(item.matchedChildPeople || '').trim();
      return (mn && cn === mn) || (mp && cp === mp);
    });
    if (!child) continue;
    let fn = String(item.fileName || '').trim();
    fn = fn.replace(/\.(wps|docx|doc)$/i, '');
    const parts = fn.split('－');
    child.trueName = fn;
    if (parts.length > 0) child.address = parts[0];
    if (parts.length > 2) child.title = parts[2];
  }

  writeNewPeopleData(jsText, arrSrc, newPeopleData);
  console.log('Updated newPeopleData.js with diffNameArray');
}

main();
