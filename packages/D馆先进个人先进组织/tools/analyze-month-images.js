const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../month_images.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const indexLike = [];
const dateLike = [];
const other = [];

data.forEach(fullPath => {
    const filename = path.basename(fullPath);
    
    // Pattern for Index: "1. Something", "10. Something" (Space after dot)
    if (/^\d+\.\s/.test(filename)) {
        indexLike.push(filename);
    } 
    // Pattern for Date: "10月", "10.1" (No space after dot, or followed by digit)
    else if (/^\d+月/.test(filename) || /^\d+\.\d+/.test(filename)) {
        dateLike.push(fullPath); // Keep full path for date-like to identify location
    }
    else {
        other.push(filename);
    }
});

console.log(`Total files: ${data.length}`);
console.log(`Index-like (e.g. "1. Name"): ${indexLike.length}`);
console.log(`Date-like (e.g. "10月..." or "10.1..."): ${dateLike.length}`);
console.log(`Other: ${other.length}`);

if (dateLike.length > 0) {
    console.log('\nDate-like files (Potential targets):');
    const outputPath = path.join(__dirname, '../date_like_images.txt');
    fs.writeFileSync(outputPath, dateLike.join('\n'), 'utf8');
    console.log(`Saved ${dateLike.length} date-like files to ${outputPath}`);
}

if (other.length > 0) {
    console.log('\nOther files:');
    other.forEach(f => console.log(f));
}
