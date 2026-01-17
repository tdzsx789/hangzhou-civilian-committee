const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../orgArray.json');

try {
  if (!fs.existsSync(jsonPath)) {
    console.error('orgArray.json not found');
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const orgArray = JSON.parse(rawData);

  // Regex to match prefixes like "1. ", "13. ", "13 ", etc.
  // ^\d+(\.| )?\s* matches:
  // ^ start of string
  // \d+ one or more digits
  // (\.| )? optional dot or space after digits
  // \s* optional trailing spaces
  const prefixRegex = /^\d+(\.| )?\s*/;

  let updatedCount = 0;

  const newArray = orgArray.map(item => {
    const original = item.originName;
    let trueName = original;
    
    // Check if it matches the pattern
    if (prefixRegex.test(original)) {
      trueName = original.replace(prefixRegex, '');
      updatedCount++;
    }
    
    return {
      ...item,
      trueName: trueName
    };
  });

  fs.writeFileSync(jsonPath, JSON.stringify(newArray, null, 2), 'utf8');
  console.log(`Successfully updated ${updatedCount} items in orgArray.json`);

} catch (error) {
  console.error('Error processing JSON:', error);
}
