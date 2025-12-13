const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PEOPLE_JS_PATH = path.resolve(__dirname, '../src/assets/peopleData.js');
const XIANJIN_JSON_PATH = path.resolve(__dirname, '../src/assets/xianjinPeople.json');
const OUTPUT_NEW_JSON = path.resolve(__dirname, '../src/assets/newPeopleData.json');

function extractArraySource(jsText) {
  const exportIdx = jsText.indexOf('export const peopleData');
  if (exportIdx === -1) throw new Error('Cannot find export peopleData');
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

function loadPeopleData() {
  const jsText = fs.readFileSync(PEOPLE_JS_PATH, 'utf8');
  const arrSrc = extractArraySource(jsText);
  const peopleData = vm.runInNewContext(`(${arrSrc})`, {}, { filename: 'peopleData.js' });
  return { peopleData, jsText, arrSrc };
}

function main() {
  const xj = JSON.parse(fs.readFileSync(XIANJIN_JSON_PATH, 'utf8'));
  const summaryMap = new Map(xj.map(p => [p.name, p.summary]));
  const { peopleData } = loadPeopleData();

  let replacedCount = 0;
  for (const province of peopleData) {
    const children = province.children || [];
    for (const child of children) {
      const personName = child.people || child.name || child.trueName || '';
      if (summaryMap.has(personName)) {
        child.summary = summaryMap.get(personName);
        replacedCount++;
      }
    }
  }

  fs.writeFileSync(OUTPUT_NEW_JSON, JSON.stringify(peopleData, null, 2), 'utf8');
  console.log(`Merged summaries for ${replacedCount} entries -> ${OUTPUT_NEW_JSON}`);
}

main();
