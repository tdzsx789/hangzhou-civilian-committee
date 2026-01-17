const fs = require('fs');
const path = require('path');
const vm = require('vm');

const jsPath = path.join(__dirname, '../subfolders.js');

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

// Generate output manually
let output = 'const subfoders = [\n';

subfoders.forEach((item, index) => {
    output += '  {\n';
    const keys = Object.keys(item);
    keys.forEach((key, kIndex) => {
        const val = item[key];
        let valStr;
        if (key === 'summary' && typeof val === 'string') {
            // Use backticks
            // Escape backticks and ${
            const escaped = val
                .replace(/\\/g, '\\\\') // Escape backslashes first!
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
    if (index < subfoders.length - 1) {
        output += ',\n';
    } else {
        output += '\n';
    }
});

output += ']\n';

fs.writeFileSync(jsPath, output, 'utf8');
console.log('Formatted subfolders.js with backticks.');
