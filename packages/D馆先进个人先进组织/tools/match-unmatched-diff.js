const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const NEW_PEOPLE_JS = path.resolve(ROOT, 'src/assets/newPeopleData.js');
const OUTPUT_JSON = path.resolve(ROOT, 'wps-compare-advanced-person-update.json');

// --- Helper: Load JS Data ---
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
  return vm.runInNewContext(`(${arrSrc})`, {}, { filename: 'newPeopleData.js' });
}

function main() {
  if (!fs.existsSync(OUTPUT_JSON)) {
    console.error(`File not found: ${OUTPUT_JSON}`);
    process.exit(1);
  }

  const outputData = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8'));
  const unmatched = outputData.unmatched;
  if (!Array.isArray(unmatched)) {
    console.log('No unmatched array found.');
    return;
  }

  const newPeopleData = loadNewPeopleData();
  const diffNameArray = [];

  for (const item of unmatched) {
    if (!item.name || !item.province) continue;

    // Find province data
    // Use loose matching: province name in data includes item.province (e.g. "江苏省" includes "江苏")
    // or item.province includes data name (less likely given folder names like "上海")
    const provinceData = newPeopleData.find(p => {
      const pName = String(p.name || '');
      return pName.includes(item.province) || item.province.includes(pName);
    });

    if (provinceData && Array.isArray(provinceData.children)) {
      // Check if item.name matches any child.people
      const matchedChild = provinceData.children.find(child => {
        const peopleName = String(child.people || '').trim();
        return peopleName === item.name.trim();
      });

      if (matchedChild) {
        // Found a match!
        diffNameArray.push({
          ...item,
          matchedChildName: matchedChild.name, // keep info about what it matched against
          matchedChildPeople: matchedChild.people
        });
      }
    }
  }

  outputData.diffNameArray = diffNameArray;
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`Updated ${OUTPUT_JSON}`);
  console.log(`Added diffNameArray with ${diffNameArray.length} items.`);
}

main();
