const fs = require('fs');
const path = require('path');
const vm = require('vm');

const orgArrayPath = path.join(__dirname, '../orgArray.js');
const zuzhiDataPath = path.join(__dirname, '../src/assets/zuzhiData.js');
const outputPath = path.join(__dirname, '../compare_Zuzhi.json');

// Helper to parse orgArray.js
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

// Helper to extract data from JS file
function extractArraySource(fileContent) {
    const match = fileContent.match(/export\s+const\s+zuzhiData\s*=\s*(\[[\s\S]*?\]);?\s*$/);
    if (match && match[1]) {
        return match[1];
    }
    // Try without strict end anchor if file has more content
    const looseMatch = fileContent.match(/export\s+const\s+zuzhiData\s*=\s*(\[[\s\S]*?\])/);
    if (looseMatch && looseMatch[1]) {
        return looseMatch[1];
    }
    return null;
}

try {
    // 1. Read orgArray.js
    if (!fs.existsSync(orgArrayPath)) {
        console.error('orgArray.js not found');
        process.exit(1);
    }
    const orgArray = parseItemsFromJs(fs.readFileSync(orgArrayPath, 'utf8'));

    // 2. Read zuzhiData.js
    if (!fs.existsSync(zuzhiDataPath)) {
        console.error('zuzhiData.js not found');
        process.exit(1);
    }
    const zuzhiDataContent = fs.readFileSync(zuzhiDataPath, 'utf8');
    const zuzhiArraySource = extractArraySource(zuzhiDataContent);
    
    if (!zuzhiArraySource) {
        console.error('Could not extract zuzhiData array from file');
        process.exit(1);
    }

    const sandbox = {};
    const zuzhiData = vm.runInNewContext(`data = ${zuzhiArraySource}`, sandbox);

    // 3. Process zuzhiData to get all children names
    const zuzhiNames = new Set();
    const zuzhiNameMap = new Map(); // name -> object for reference

    zuzhiData.forEach(province => {
        if (province.children && Array.isArray(province.children)) {
            province.children.forEach(child => {
                if (child.name) {
                    const cleanName = child.name.trim();
                    zuzhiNames.add(cleanName);
                    zuzhiNameMap.set(cleanName, child);
                }
            });
        }
    });

    // 4. Compare
    const matches = [];
    const onlyInOrgArray = [];
    
    orgArray.forEach(item => {
        if (!item.name) return;
        const name = item.name.trim();
        
        if (zuzhiNames.has(name)) {
            matches.push({
                name: name,
                orgArrayItem: item,
                zuzhiDataItem: zuzhiNameMap.get(name)
            });
            // Remove from set to track what's left in zuzhiData
            zuzhiNames.delete(name); 
        } else {
            onlyInOrgArray.push(item);
        }
    });

    // What's left in zuzhiNames is onlyInZuzhiData
    const onlyInZuzhiData = Array.from(zuzhiNames).map(name => ({
        name: name,
        item: zuzhiNameMap.get(name)
    }));

    const result = {
        summary: {
            totalInOrgArray: orgArray.length,
            totalChildrenInZuzhiData: zuzhiNameMap.size, // Original size before deletion
            matchedCount: matches.length,
            onlyInOrgArrayCount: onlyInOrgArray.length,
            onlyInZuzhiDataCount: onlyInZuzhiData.length
        },
        matches: matches.map(m => m.name),
        onlyInOrgArray: onlyInOrgArray,
        onlyInZuzhiData: onlyInZuzhiData
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log('Comparison complete.');
    console.log(`Matched: ${matches.length}`);
    console.log(`Only in orgArray: ${onlyInOrgArray.length}`);
    console.log(`Only in zuzhiData: ${onlyInZuzhiData.length}`);
    console.log(`Result saved to ${outputPath}`);

} catch (error) {
    console.error('Error during comparison:', error);
}
