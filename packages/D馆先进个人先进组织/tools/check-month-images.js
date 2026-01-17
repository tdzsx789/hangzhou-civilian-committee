const fs = require('fs');
const path = require('path');

const rootDir = '/Users/tree/Desktop/code/hangzhou-civilian-committee/packages/D馆先进个人先进组织/public/zuzhiImages';

// Regex explanation:
// ^\d{1,2}月  -> Starts with 1 or 2 digits followed by '月' (e.g., 10月1日)
// ^\d{1,2}\.  -> Starts with 1 or 2 digits followed by '.' (e.g., 10.1)
const pattern = /^(\d{1,2}月|\d{1,2}\.)/;

const results = [];

function traverse(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory does not exist: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            traverse(fullPath);
        } else {
            // Check if it is an image
            if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)) {
                if (pattern.test(file)) {
                    results.push(fullPath);
                }
            }
        }
    });
}

console.log('Scanning for images starting with a month pattern...');
traverse(rootDir);

const outputPath = path.join(__dirname, '../month_images.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

console.log(`Found ${results.length} files. Saved to ${outputPath}`);
