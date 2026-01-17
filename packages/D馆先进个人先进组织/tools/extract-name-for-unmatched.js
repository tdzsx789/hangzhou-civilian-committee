const fs = require('fs');
const path = require('path');

const JSON_PATH = path.resolve(__dirname, '../wps-compare-advanced-person-update.json');

if (!fs.existsSync(JSON_PATH)) {
  console.error(`File not found: ${JSON_PATH}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

if (data.unmatched && Array.isArray(data.unmatched)) {
  data.unmatched.forEach(item => {
    const fileName = item.fileName;
    if (!fileName) return;

    // Find the text between the first and second '－'
    const firstDash = fileName.indexOf('－');
    if (firstDash !== -1) {
      const secondDash = fileName.indexOf('－', firstDash + 1);
      if (secondDash !== -1) {
        const extractedName = fileName.substring(firstDash + 1, secondDash);
        item.name = extractedName;
      } else {
        // Try to find if there is at least one dash and the rest is extension?
        // But the requirement is specifically "between two －".
        // If there is no second dash, maybe check if it ends with extension?
        // Let's stick to strict "between two dashes" first, but what if fileName is "Title－Name.wps"?
        // The user said "fileName two － between text".
        // Let's assume the format implies two dashes exist.
        // If not found, we might want to log it.
        console.warn(`Could not find second dash in: ${fileName}`);
        
        // Fallback: if only one dash, maybe name is from dash to dot?
        // But looking at the data, most have "Title－Name－Title".
        // Let's leave name undefined if strict match fails, or try to be smart?
        // Given user instruction is specific, I will only extract if two dashes exist.
      }
    } else {
      console.warn(`Could not find any dash in: ${fileName}`);
    }
  });
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Updated ${JSON_PATH} with extracted names.`);
