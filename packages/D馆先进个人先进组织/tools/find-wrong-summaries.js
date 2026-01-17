const fs = require('fs');
const path = require('path');
const vm = require('vm');

const jsPath = path.join(__dirname, '../orgArray.js');
const outPath = path.join(__dirname, '../wrongData.json');

if (!fs.existsSync(jsPath)) {
    console.error(`File not found: ${jsPath}`);
    process.exit(1);
}

const jsContent = fs.readFileSync(jsPath, 'utf8');

// Handle "export const orgArray ="
let data;
const sandbox = {};
try {
    // Replace export const with just const or assignment
    const script = jsContent.replace('export const orgArray', 'orgArray');
    vm.runInNewContext(script + '; data = orgArray;', sandbox);
    data = sandbox.data;
} catch (e) {
    console.error('VM execution failed, trying regex extraction...');
    const match = jsContent.match(/=\s*(\[[\s\S]*\])/);
    if (match) {
        try {
            data = eval(match[1]);
        } catch (err) {
            console.error('Regex eval failed:', err);
            process.exit(1);
        }
    } else {
        console.error('Could not parse array');
        process.exit(1);
    }
}

const wrongData = [];

data.forEach(item => {
    if (!item.summary || item.summary.trim() === '') return;

    // 1. Determine short name (core entity name)
    let shortName = item.name;
    const adminDivisions = ['街道', '镇', '乡'];
    
    let foundDiv = false;
    for (const div of adminDivisions) {
        if (item.name.includes(div)) {
            const parts = item.name.split(div);
            // Take the part after the LAST occurrence of the division
            // But split splits all. So the last element is what comes after the last separator.
            // E.g. "A街道B社区" -> ["A", "B社区"] -> "B社区"
            // E.g. "A街道B街道C社区" -> ["A", "B", "C社区"] -> "C社区"
            const candidate = parts[parts.length - 1].trim();
            if (candidate.length >= 2) {
                shortName = candidate;
                foundDiv = true;
                break; // Prioritize '街道' then '镇' etc order in array
            }
        }
    }

    // If no admin division found, or result too short, try removing "省", "市", "区", "县" prefixes
    if (!foundDiv) {
        // Try to strip known prefixes aggressively
        // This is harder. Fallback to full name check?
        // Or if full name is long, check if summary contains it?
        // Usually full name is "浙江省衢州市法律援助中心".
        // Summary might be "衢州市法律援助中心简介".
        // If we use full name "浙江省...", summary might not have "浙江省".
        // So we should at least strip "xx省xx市xx区".
        
        let tempName = item.name;
        // Remove patterns like "xx省", "xx市", "xx区", "xx县" (non-greedy)
        // Repeat to remove multiple levels
        while (true) {
            const newName = tempName.replace(/^.+?[省市区县]/, '');
            if (newName === tempName || newName.length < 2) break;
            tempName = newName;
        }
        shortName = tempName.trim();
    }

    // Edge case: shortName might still be empty or too short
    if (shortName.length < 2) shortName = item.name;

    // 2. Check if summary contains shortName
    if (!item.summary.includes(shortName)) {
        // Double check: maybe summary contains the full name? (unlikely if shortName isn't there)
        // Maybe summary contains the name without "社区"?
        // E.g. Name="xx社区", Summary="xx简介" (where xx is the same)
        const nameNoSuffix = shortName.replace(/社区|村|委员会|中心|党支部|站/g, '');
        if (nameNoSuffix.length >= 2 && item.summary.includes(nameNoSuffix)) {
            // It's probably fine
            return;
        }

        wrongData.push({
            name: item.name,
            shortNameDerived: shortName,
            summarySnippet: item.summary.substring(0, 50).replace(/\n/g, ' '),
            summaryLength: item.summary.length,
            reason: `Summary does not contain "${shortName}" or "${nameNoSuffix}"`
        });
    }
});

fs.writeFileSync(outPath, JSON.stringify(wrongData, null, 2), 'utf8');
console.log(`Found ${wrongData.length} potentially wrong items. Saved to ${outPath}`);
