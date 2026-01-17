const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../month_images.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const trueDateLike = [];

data.forEach(fullPath => {
    const filename = path.basename(fullPath);
    
    // Check if it starts with "Month" pattern
    if (/^\d+月/.test(filename)) {
        trueDateLike.push(fullPath);
    }
    // Check if it starts with "Number dot" pattern
    else if (/^\d+\./.test(filename)) {
        // Exclude if it looks like an index followed by a year (e.g. "1.2021...", "1. 2022...")
        // We assume year starts with 19 or 20
        if (/^\d+\.\s?(19|20)\d{2}/.test(filename)) {
            // Likely an index, skip
        } else {
            // Likely a date like "10.1" or "5.15"
            // Also exclude simple indices like "1.jpg" or "1. name.jpg" if they don't look like dates
            // But "10.1" is hard to distinguish from "10.1 Section".
            // Let's keep them and let the user decide, but maybe flag them?
            // Actually, "10.1" is exactly what the user asked for.
            // What about "1. Name"?
            // If it's "1. Name", it matches `^\d+\.` but not year.
            // If the user wants "10.1", they probably mean "Month.Day".
            // "1. Name" is usually index.
            // "10.1" implies two numbers separated by dot.
            
            if (/^\d+\.\d+/.test(filename)) {
                trueDateLike.push(fullPath);
            } else {
                 // Starts with "1." but not "1.1". e.g. "1.jpg" or "1. Name"
                 // User asked for "10.1", so "1." is probably not what they want unless it's "1月".
                 // But wait, "1." could be "1月" short form? Unlikely.
                 // I'll exclude single number dot unless it's followed by digit.
            }
        }
    }
});

const outputPath = path.join(__dirname, '../true_date_images.txt');
fs.writeFileSync(outputPath, trueDateLike.join('\n'), 'utf8');

console.log(`Found ${trueDateLike.length} likely date-pattern files (excluding indices).`);
console.log(`Saved to ${outputPath}`);

if (trueDateLike.length > 0) {
    console.log('Examples:');
    trueDateLike.slice(0, 20).forEach(f => console.log(path.basename(f)));
}
