const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const UPDATE_DIR = path.resolve(ROOT, '先进个人更新');
const NEW_PEOPLE_JS = path.resolve(ROOT, 'src/assets/newPeopleData.js');

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

function convertJsonToBackticks(jsonStr) {
  // Replace "summary": "..." with "summary": `...`
  // We match "summary": followed by a JSON string
  return jsonStr.replace(/"summary":\s*"((?:[^"\\]|\\.)*)"/g, (match, content) => {
    try {
      // Decode JSON string to raw string
      let raw = JSON.parse(`"${content}"`);
      // Escape backticks and ${ for template literal
      raw = raw.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
      // Wrap in backticks
      return `"summary": \`${raw}\``;
    } catch (e) {
      console.error('Failed to convert summary to backticks:', e);
      return match;
    }
  });
}

function writeNewPeopleData(jsText, arrSrc, newArr) {
  let updatedSrc = JSON.stringify(newArr, null, 2);
  updatedSrc = convertJsonToBackticks(updatedSrc);
  const outJs = jsText.replace(arrSrc, updatedSrc);
  fs.writeFileSync(NEW_PEOPLE_JS, outJs, 'utf8');
}

function baseNameNoExt(p) {
  const bn = path.basename(p);
  // Handle multiple extensions if needed, but standard ext usually suffices
  // Our files are like name.docx or name.wps
  // We want to remove the last extension.
  // Actually, previously we removed .wps|.docx|.doc specifically.
  return bn.replace(/\.(wps|docx|doc)$/i, '');
}

function getFileContent(filePath) {
  try {
    // textutil -convert txt -stdout "path"
    // We use quotes around path to handle spaces
    const cmd = `textutil -convert txt -stdout "${filePath}"`;
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return output.trim();
  } catch (e) {
    console.warn(`Failed to read content from ${path.basename(filePath)}: ${e.message}`);
    return null;
  }
}

function main() {
  const { newPeopleData, jsText, arrSrc } = loadNewPeopleData();
  const entries = fs.readdirSync(UPDATE_DIR, { withFileTypes: true });
  const folders = entries.filter(e => e.isDirectory()).map(e => e.name);

  let updatedCount = 0;

  for (const folder of folders) {
    // Match province
    const province = newPeopleData.find(p => typeof p.name === 'string' && p.name.includes(folder));
    if (!province) continue;

    const children = Array.isArray(province.children) ? province.children : [];
    const folderPath = path.join(UPDATE_DIR, folder);
    
    let fileEntries;
    try {
      fileEntries = fs.readdirSync(folderPath, { withFileTypes: true });
    } catch (e) {
      console.warn(`Cannot read folder ${folder}:`, e);
      continue;
    }

    for (const fe of fileEntries) {
      if (!fe.isFile()) continue;
      if (!/\.(wps|docx|doc)$/i.test(fe.name)) continue;

      const base = baseNameNoExt(fe.name);
      // Find matching child
      const child = children.find(c => {
        const tn = String(c.trueName || '').trim();
        const nm = String(c.name || '').trim();
        return tn === base || nm === base;
      });

      if (child) {
        const fullPath = path.join(folderPath, fe.name);
        const text = getFileContent(fullPath);
        if (text) {
          child.summary = text;
          updatedCount++;
          console.log(`Updated summary for ${base}`);
        }
      }
    }
  }

  writeNewPeopleData(jsText, arrSrc, newPeopleData);
  console.log(`Total updated summaries: ${updatedCount}`);
}

main();
