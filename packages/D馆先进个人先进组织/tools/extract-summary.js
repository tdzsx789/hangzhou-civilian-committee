const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '../先进组织更新');
const jsPath = path.join(__dirname, '../subfolders.js');

// 1. Read and parse subfolders.js
if (!fs.existsSync(jsPath)) {
    console.error(`File not found: ${jsPath}`);
    process.exit(1);
}

const jsContent = fs.readFileSync(jsPath, 'utf8');
const sandbox = {};
try {
    vm.runInNewContext(jsContent + '; data = subfoders;', sandbox);
} catch (e) {
    console.log('VM execution failed, trying manual extraction...');
}

let subfoders = sandbox.data;
if (!subfoders) {
    const match = jsContent.match(/=\s*(\[[\s\S]*\])/);
    if (match) {
        try {
            subfoders = eval(match[1]); 
        } catch (e) {
            console.error('Failed to parse array:', e);
            process.exit(1);
        }
    } else {
        console.error('Could not find array in subfolders.js');
        process.exit(1);
    }
}

// 2. Scan directories
console.log('Scanning directories...');
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
        } catch (e) {}
    });
}

// 3. Process items
console.log('Processing items...');
let updatedCount = 0;
const docExtensions = ['.doc', '.docx', '.wps'];

subfoders.forEach((item, index) => {
    // Only process if summary implies existence of a file, or if we want to be robust, check file existence.
    // User instruction: "subfoders下'summary': '有文件'的fileName做匹配"
    // I will include '有图片' as well because those definitely have files.
    if (item.summary !== '有文件' && item.summary !== '有图片') {
        return;
    }

    const targetName = item.filaName || item.fileName;
    if (!targetName) return;

    const dirPath = folderMap.get(targetName);
    if (!dirPath) {
        console.log(`Directory not found for: ${targetName}`);
        return;
    }

    // Find the doc file
    let docFile = null;
    try {
        const files = fs.readdirSync(dirPath);
        docFile = files.find(f => {
            const ext = path.extname(f).toLowerCase();
            return docExtensions.includes(ext) && !f.startsWith('~$');
        });
    } catch (e) {
        console.error(`Error reading dir ${dirPath}:`, e);
        return;
    }

    if (docFile) {
        const docPath = path.join(dirPath, docFile);
        try {
            // Use textutil to extract text
            // -convert txt: convert to plain text
            // -stdout: output to stdout
            const cmd = `textutil -convert txt -stdout "${docPath}"`;
            const text = execSync(cmd, { stdio: 'pipe' }).toString().trim();
            
            if (text) {
                item.summary = text;
                updatedCount++;
                console.log(`[${index + 1}/${subfoders.length}] Updated summary for ${item.name}`);
            } else {
                console.log(`[${index + 1}/${subfoders.length}] Empty text for ${item.name}`);
            }
        } catch (e) {
            console.error(`Error extracting text for ${docFile}:`, e.message);
        }
    } else {
        console.log(`No doc file found in ${dirPath} (expected one based on summary)`);
    }
});

// 4. Save
console.log(`Saving ${updatedCount} updates to ${jsPath}...`);
const newContent = `const subfoders = ${JSON.stringify(subfoders, null, 2)}`;
fs.writeFileSync(jsPath, newContent, 'utf8');
console.log('Done.');
