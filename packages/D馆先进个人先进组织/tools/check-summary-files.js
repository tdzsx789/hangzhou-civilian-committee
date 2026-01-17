const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '../先进组织更新');
const jsPath = path.join(__dirname, '../subfolders.js');

// 1. Read and parse subfolders.js
if (!fs.existsSync(jsPath)) {
    console.error(`File not found: ${jsPath}`);
    process.exit(1);
}

const jsContent = fs.readFileSync(jsPath, 'utf8');
const sandbox = {};
// Execute the JS content in a sandbox to get the array
// We assume the file content is like "const subfoders = [...]"
// We can modify it to "subfoders = [...]" to run in vm context if needed, or just run it if it defines a global var
// Since it uses 'const', it defines a variable in the local scope of the script. 
// We need to capture it.
// Let's try to evaluate it.
try {
    vm.runInNewContext(jsContent + '; data = subfoders;', sandbox);
} catch (e) {
    // If 'const' throws because it's block scoped or something in vm, try replacing const with var or nothing
    // But vm.runInNewContext runs as a script.
    // Let's try to extract the array part string manually if vm fails or is tricky with const
    console.log('VM execution might have failed or variable capture issues, trying manual extraction...');
}

let subfoders = sandbox.data;

if (!subfoders) {
    // Fallback: extract JSON part
    const match = jsContent.match(/=\s*(\[[\s\S]*\])/);
    if (match) {
        try {
            // Using Function to parse loose JSON if it has unquoted keys or comments (though read output looked standard)
            // But let's assume it's valid JSON-like array
            subfoders = eval(match[1]); 
        } catch (e) {
            console.error('Failed to parse array from file content:', e);
            process.exit(1);
        }
    } else {
        console.error('Could not find array in subfolders.js');
        process.exit(1);
    }
}

console.log(`Loaded ${subfoders.length} items from subfolders.js`);

// 2. Scan directories to build a map of FolderName -> Path
const folderMap = new Map();

if (fs.existsSync(rootDir)) {
    const provinceDirs = fs.readdirSync(rootDir);
    provinceDirs.forEach(pDir => {
        if (pDir.startsWith('.')) return;
        const pPath = path.join(rootDir, pDir);
        try {
            if (fs.statSync(pPath).isDirectory()) {
                const orgDirs = fs.readdirSync(pPath);
                orgDirs.forEach(oDir => {
                    if (oDir.startsWith('.')) return;
                    const oPath = path.join(pPath, oDir);
                    if (fs.statSync(oPath).isDirectory()) {
                        folderMap.set(oDir, oPath);
                    }
                });
            }
        } catch (e) {
            console.warn(`Error scanning ${pDir}:`, e);
        }
    });
} else {
    console.error(`Directory not found: ${rootDir}`);
    process.exit(1);
}

console.log(`Found ${folderMap.size} organization directories.`);

// 3. Process each item in subfoders
let updatedCount = 0;
const docExtensions = ['.doc', '.docx', '.wps'];

subfoders.forEach(item => {
    // Determine which field to use for matching. User said "subfoders下的fileName".
    // File content shows "filaName".
    const targetName = item.filaName || item.fileName;
    
    if (!targetName) {
        return;
    }

    const dirPath = folderMap.get(targetName);
    let hasDoc = false;

    if (dirPath) {
        try {
            const files = fs.readdirSync(dirPath);
            hasDoc = files.some(file => {
                const ext = path.extname(file).toLowerCase();
                return docExtensions.includes(ext) && !file.startsWith('~$'); // Ignore temp files
            });
        } catch (e) {
            console.warn(`Error reading directory ${dirPath}:`, e);
        }
    }

    // Update summary field
    if (hasDoc) {
        item.summary = "有文件";
    } else {
        item.summary = null;
    }
    updatedCount++;
});

// 4. Write back to subfolders.js
const newContent = `const subfoders = ${JSON.stringify(subfoders, null, 2)}`;
fs.writeFileSync(jsPath, newContent, 'utf8');

console.log(`Updated ${updatedCount} items. Saved to ${jsPath}`);
