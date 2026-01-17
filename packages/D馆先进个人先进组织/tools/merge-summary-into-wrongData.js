const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = path.join(__dirname, '..');
const wrongDataJsPath = path.join(baseDir, 'wrongData.js');
const subfoldersJsPath = path.join(baseDir, 'subfolders.js');

function readUtf8(fp) {
  return fs.readFileSync(fp, 'utf8');
}

function toTemplateLiteral(s) {
  return '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}

function loadArrayFromJs(fp, exportConstName) {
  const jsText = readUtf8(fp);
  const vmText = jsText.replace(new RegExp(`^\\s*export\\s+const\\s+${exportConstName}`, 'm'), `const ${exportConstName}`);
  const sandbox = {};
  try {
    vm.runInNewContext(vmText + `; data = ${exportConstName};`, sandbox);
    return sandbox.data;
  } catch (e) {
    const match = jsText.match(/=\s*(\[[\s\S]*\])/);
    if (match) {
      try {
        return eval(match[1]);
      } catch (e2) {
        throw new Error(`Eval failed for ${fp}: ${e2.message}`);
      }
    }
    throw new Error(`Unable to parse ${fp}: ${e.message}`);
  }
}

function serializeWrongItem(item) {
  const parts = [];
  parts.push('  {');
  parts.push(`    "name": ${JSON.stringify(item.name || '')},`);
  parts.push(`    "shortNameDerived": ${JSON.stringify(item.shortNameDerived || '')},`);
  parts.push(`    "summarySnippet": ${JSON.stringify(item.summarySnippet || '')},`);
  parts.push(`    "summaryLength": ${JSON.stringify(item.summaryLength || 0)},`);
  parts.push(`    "reason": ${JSON.stringify(item.reason || '')}` + (item.summary !== undefined ? ',' : ''));
  if (item.summary !== undefined) {
    parts.push(`    "summary": ${toTemplateLiteral(item.summary || '')}`);
  }
  parts.push('  }');
  return parts.join('\n');
}

function run() {
  if (!fs.existsSync(wrongDataJsPath)) {
    console.error(`File not found: ${wrongDataJsPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(subfoldersJsPath)) {
    console.error(`File not found: ${subfoldersJsPath}`);
    process.exit(1);
  }

  const wrongData = loadArrayFromJs(wrongDataJsPath, 'wrongData');
  const subfolders = loadArrayFromJs(subfoldersJsPath, 'subfolders');

  const nameToSummary = new Map();
  subfolders.forEach(it => {
    nameToSummary.set(it.name, typeof it.summary === 'string' ? it.summary : (it.summary == null ? '' : String(it.summary)));
  });

  let updated = 0;
  wrongData.forEach(it => {
    if (nameToSummary.has(it.name)) {
      it.summary = nameToSummary.get(it.name);
      updated++;
    }
  });

  const output = [
    'export const wrongData = [',
    wrongData.map(serializeWrongItem).join(',\n'),
    ']',
  ].join('\n');

  fs.writeFileSync(wrongDataJsPath, output, 'utf8');
  console.log(`Updated ${updated} wrongData items with summary from subfolders.js`);
}

run();
