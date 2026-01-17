const fs = require('fs');
const path = require('path');
const vm = require('vm');

const currentFilePath = path.join(__dirname, '../src/assets/newPeopleData.js');
const copyFilePath = path.join(__dirname, '../src/assets/newPeopleData copy.js');

function loadData(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const sandbox = {};
    try {
        // We handle export const by replacing it or just running it
        // A simple way is to replace 'export const' with 'var' or just execute it
        // The file usually has `export const newPeopleData = [...]`
        // We can just strip "export"
        const scriptCode = content.replace(/export\s+const\s+/, 'var ');
        vm.runInNewContext(scriptCode, sandbox);
        return sandbox.newPeopleData;
    } catch (e) {
        console.error(`Error parsing ${filePath}:`, e);
        return null;
    }
}

function compare() {
    console.log('Loading files...');
    const currentData = loadData(currentFilePath);
    const copyData = loadData(copyFilePath);

    if (!currentData || !copyData) {
        console.log('Failed to load data.');
        return;
    }

    console.log('Comparing newPeopleData.js (Current) vs newPeopleData copy.js (Copy)...\n');

    const currentMap = new Map(currentData.map(p => [p.name, p]));
    const copyMap = new Map(copyData.map(p => [p.name, p]));

    let allMatch = true;

    // Check provinces in Current
    for (const [provName, currentProv] of currentMap) {
        const copyProv = copyMap.get(provName);
        
        if (!copyProv) {
            console.log(`[${provName}] - ADDED in Current (Not in Copy)`);
            allMatch = false;
            continue;
        }

        // Compare children count
        const currentCount = currentProv.children ? currentProv.children.length : 0;
        const copyCount = copyProv.children ? copyProv.children.length : 0;

        if (currentCount !== copyCount) {
            console.log(`[${provName}] - Count MISMATCH: Current=${currentCount}, Copy=${copyCount}`);
            allMatch = false;
        }

        // Compare children positions
        const limit = Math.max(currentCount, copyCount);
        let posMismatchCount = 0;
        for (let i = 0; i < limit; i++) {
            const currentChild = currentProv.children ? currentProv.children[i] : null;
            const copyChild = copyProv.children ? copyProv.children[i] : null;

            const currentName = currentChild ? (currentChild.name || 'Unnamed') : 'NULL';
            const copyName = copyChild ? (copyChild.name || 'Unnamed') : 'NULL';

            // We compare names to determine if position is same
            if (currentName !== copyName) {
                if (posMismatchCount < 5) { // Limit detailed logs per province
                     console.log(`  [${provName}] Index ${i}: Mismatch`);
                     console.log(`     Current: ${currentName}`);
                     console.log(`     Copy   : ${copyName}`);
                }
                posMismatchCount++;
                allMatch = false;
            }
        }
        if (posMismatchCount > 0) {
             console.log(`  [${provName}] Total position mismatches: ${posMismatchCount}`);
        }
    }

    // Check provinces in Copy not in Current
    for (const [provName] of copyMap) {
        if (!currentMap.has(provName)) {
            console.log(`[${provName}] - REMOVED in Current (Exists in Copy)`);
            allMatch = false;
        }
    }

    if (allMatch) {
        console.log('\nSUCCESS: Both files have identical structure (Province list, Children counts, and Children order).');
    } else {
        console.log('\nDIFFERENCES FOUND (see above).');
    }
}

compare();
