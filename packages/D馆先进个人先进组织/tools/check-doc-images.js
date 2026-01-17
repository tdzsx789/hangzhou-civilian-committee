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

// 3. Image check functions
function checkImageInZip(filePath) {
    try {
        const output = execSync(`unzip -l "${filePath}"`, { stdio: 'pipe' }).toString();
        // Check for common image paths in OOXML or ODF
        return output.includes('word/media/') || output.includes('pictures/');
    } catch (e) {
        return false;
    }
}

function checkImageInBinary(filePath) {
    try {
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(100000); // Read first 100KB is usually enough for headers, but images can be anywhere.
        // Reading entire file might be slow for large files, but necessary for robust binary search.
        // Let's read chunks or full file if not too huge.
        const stats = fs.statSync(filePath);
        const fullBuffer = fs.readFileSync(filePath); // Read full file
        
        // Signatures
        // JPEG: FF D8 FF
        // PNG: 89 50 4E 47
        // BMP: 42 4D
        // GIF: 47 49 46 38
        
        if (fullBuffer.includes(Buffer.from([0xFF, 0xD8, 0xFF]))) return true;
        if (fullBuffer.includes(Buffer.from([0x89, 0x50, 0x4E, 0x47]))) return true;
        // BMP is too short (BM), prone to false positives. Skip unless confident.
        // GIF
        if (fullBuffer.includes(Buffer.from([0x47, 0x49, 0x46, 0x38]))) return true;
        
        fs.closeSync(fd);
    } catch (e) {
        return false;
    }
    return false;
}

// 4. Process
let updatedCount = 0;
const docExtensions = ['.doc', '.docx', '.wps'];

subfoders.forEach(item => {
    const targetName = item.filaName || item.fileName;
    if (!targetName) return;

    const dirPath = folderMap.get(targetName);
    
    // Default to existing summary or null if re-evaluating
    // But logic should be: find files -> if files, set "有文件" -> if image, set "有图片" -> else "有文件"
    // If no files found, set null.
    
    let newSummary = null;
    let hasFile = false;
    let hasImage = false;

    if (dirPath) {
        try {
            const files = fs.readdirSync(dirPath);
            const targetFiles = files.filter(f => {
                const ext = path.extname(f).toLowerCase();
                return docExtensions.includes(ext) && !f.startsWith('~$');
            });

            if (targetFiles.length > 0) {
                hasFile = true;
                for (const file of targetFiles) {
                    const filePath = path.join(dirPath, file);
                    // Try zip first (for docx and some wps)
                    if (checkImageInZip(filePath)) {
                        hasImage = true;
                        break;
                    }
                    // Try binary (for doc and binary wps)
                    if (checkImageInBinary(filePath)) {
                        hasImage = true;
                        break;
                    }
                }
            }
        } catch (e) {
            console.warn(`Error reading ${dirPath}:`, e);
        }
    }

    if (hasImage) {
        newSummary = "有图片";
    } else if (hasFile) {
        newSummary = "有文件";
    }

    if (item.summary !== newSummary) {
        item.summary = newSummary;
        updatedCount++;
    }
});

// 5. Save
const newContent = `const subfoders = ${JSON.stringify(subfoders, null, 2)}`;
fs.writeFileSync(jsPath, newContent, 'utf8');

console.log(`Updated ${updatedCount} items. Saved to ${jsPath}`);
