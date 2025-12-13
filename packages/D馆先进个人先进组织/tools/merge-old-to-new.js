const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OLD_JS_PATH = path.resolve(__dirname, '../src/assets/peopleData_old.js');
const XJ_JSON_PATH = path.resolve(__dirname, '../src/assets/xianjinPeople.json');
const OUTPUT_JSON_PATH = path.resolve(__dirname, '../src/assets/newPeopleData.json');

function extractArraySource(jsText) {
  const start = jsText.indexOf('export const peopleData');
  const firstBracket = jsText.indexOf('[', start);
  let d = 0, end = -1;
  for (let i = firstBracket; i < jsText.length; i++) {
    const c = jsText[i];
    if (c === '[') d++;
    else if (c === ']') {
      d--;
      if (d === 0) { end = i; break; }
    }
  }
  return jsText.slice(firstBracket, end + 1);
}

function loadOld() {
  const jsText = fs.readFileSync(OLD_JS_PATH, 'utf8');
  const arrSrc = extractArraySource(jsText);
  const peopleData = vm.runInNewContext(`(${arrSrc})`, {}, { filename: 'peopleData_old.js' });
  return peopleData;
}

function main() {
  const xj = JSON.parse(fs.readFileSync(XJ_JSON_PATH, 'utf8'));
  const summaryMap = new Map(xj.map(p => [p.name, p.summary]));
  const people = loadOld();
  let count = 0;
  for (const prov of people) {
    const children = prov.children || [];
    for (const child of children) {
      const nm = child.people || '';
      if (summaryMap.has(nm)) {
        child.summary = summaryMap.get(nm);
        count++;
      }
    }
  }
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(people, null, 2), 'utf8');
  console.log(`Merged ${count} -> ${OUTPUT_JSON_PATH}`);
}

main();

