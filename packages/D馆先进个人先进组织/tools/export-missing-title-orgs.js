const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../orgArray.json');
const outputPath = path.join(__dirname, '../orgArray_missing_title.csv');

try {
  if (!fs.existsSync(jsonPath)) {
    console.error('orgArray.json not found');
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const orgArray = JSON.parse(rawData);

  // Filter for items with empty title
  const missingTitleItems = orgArray.filter(item => !item.title || item.title.trim() === '');

  console.log(`Found ${missingTitleItems.length} items with empty title.`);

  if (missingTitleItems.length === 0) {
    console.log('No items with empty title found.');
    process.exit(0);
  }

  // Prepare CSV content
  // Add BOM for Excel utf-8 compatibility
  let csvContent = '\uFEFF';
  
  // Headers
  const headers = ['originName', 'trueName', 'name', 'title'];
  csvContent += headers.join(',') + '\n';

  // Rows
  missingTitleItems.forEach(item => {
    const row = headers.map(header => {
      let val = item[header] || '';
      // Escape quotes and wrap in quotes if necessary
      val = String(val).replace(/"/g, '""');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val}"`;
      }
      return val;
    });
    csvContent += row.join(',') + '\n';
  });

  fs.writeFileSync(outputPath, csvContent, 'utf8');
  console.log(`Successfully exported ${missingTitleItems.length} items to ${outputPath}`);

} catch (error) {
  console.error('Error processing data:', error);
}
