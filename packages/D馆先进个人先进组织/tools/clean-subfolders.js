const fs = require('fs');
const path = require('path');
const vm = require('vm');

const jsPath = path.join(__dirname, '../subfolders.js');

if (!fs.existsSync(jsPath)) {
    console.error(`File not found: ${jsPath}`);
    process.exit(1);
}

let jsContent = fs.readFileSync(jsPath, 'utf8');

// Strip 'export' to make it runnable in VM
const vmContent = jsContent.replace(/^\s*export\s+const\s+subfolders/m, 'const subfolders');

const sandbox = {};
try {
    vm.runInNewContext(vmContent + '; data = subfolders;', sandbox);
} catch (e) {
    console.error('VM execution failed:', e);
    // Fallback: try to eval just the array part if VM fails
    const match = jsContent.match(/=\s*(\[[\s\S]*\])/);
    if (match) {
        try {
            sandbox.data = eval(match[1]);
        } catch (e2) {
            console.error('Eval failed:', e2);
            process.exit(1);
        }
    } else {
        process.exit(1);
    }
}

const subfolders = sandbox.data;
let fixedCount = 0;

subfolders.forEach(item => {
    if (item.summary && (item.summary.includes('\u0000') || item.summary.length > 10000 && /[\x00-\x08\x0E-\x1F]/.test(item.summary))) {
        // Found garbage data
        console.log(`Fixing summary for: ${item.name}`);
        item.summary = "有文件"; // Reset to default state indicating file exists but content not extracted
        fixedCount++;
    }
});

if (fixedCount === 0) {
    console.log('No suspicious entries found to fix.');
} else {
    console.log(`Fixed ${fixedCount} entries.`);
}

// Generate output
let output = 'export const subfolders = [\n';

subfolders.forEach((item, index) => {
    output += '  {\n';
    const keys = Object.keys(item);
    keys.forEach((key, kIndex) => {
        const val = item[key];
        let valStr;
        if (key === 'summary' && typeof val === 'string') {
            // Use backticks for summary if it has newlines or is long, but check for backticks in string
            // Escape backticks and ${
            const escaped = val
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');
            valStr = `\`${escaped}\``;
        } else {
            valStr = JSON.stringify(val);
        }
        
        output += `    "${key}": ${valStr}`;
        if (kIndex < keys.length - 1) {
            output += ',\n';
        } else {
            output += '\n';
        }
    });
    output += '  }';
    if (index < subfolders.length - 1) {
        output += ',\n';
    } else {
        output += '\n';
    }
});

output += '];\n';

fs.writeFileSync(jsPath, output, 'utf8');
console.log('Saved subfolders.js');
