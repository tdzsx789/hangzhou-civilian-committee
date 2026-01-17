const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '../src/assets/newPeopleData.js');
const outputCsvPath = path.join(__dirname, '../newPeopleData_export.csv');

function loadData(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const sandbox = {};
    try {
        const scriptCode = content.replace(/export\s+const\s+/, 'var ');
        vm.runInNewContext(scriptCode, sandbox);
        return sandbox.newPeopleData;
    } catch (e) {
        console.error(`Error parsing ${filePath}:`, e);
        return null;
    }
}

try {
    const data = loadData(filePath);
    if (!data) {
        console.error('No data loaded.');
        process.exit(1);
    }

    // Prepare CSV content
    // Add BOM for Excel UTF-8 compatibility
    let csvContent = '\uFEFFprovince,trueName\n';

    data.forEach(prov => {
        const provinceName = prov.name || '';
        if (prov.children && Array.isArray(prov.children)) {
            prov.children.forEach(child => {
                const trueName = child.trueName || '';
                // Escape quotes by doubling them
                const escProv = provinceName.replace(/"/g, '""');
                const escTrueName = trueName.replace(/"/g, '""');
                csvContent += `"${escProv}","${escTrueName}"\n`;
            });
        }
    });

    fs.writeFileSync(outputCsvPath, csvContent, 'utf8');
    console.log(`Successfully exported data to ${outputCsvPath}`);

} catch (error) {
    console.error('Error exporting data:', error);
}
