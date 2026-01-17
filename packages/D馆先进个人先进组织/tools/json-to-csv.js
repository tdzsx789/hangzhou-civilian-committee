const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../wrongData.json');
const csvPath = path.join(__dirname, '../wrongData.csv');

if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// CSV Header
let csvContent = '\uFEFF'; // BOM for Excel UTF-8 compatibility
csvContent += '"name","summarySnippet"\n';

data.forEach(item => {
    // Escape quotes by doubling them
    const name = (item.name || '').replace(/"/g, '""');
    const summary = (item.summarySnippet || '').replace(/"/g, '""');
    
    // Check if fields need to be wrapped in quotes (they always should be for safety)
    csvContent += `"${name}","${summary}"\n`;
});

fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log(`Converted ${data.length} items to CSV. Saved to ${csvPath}`);
