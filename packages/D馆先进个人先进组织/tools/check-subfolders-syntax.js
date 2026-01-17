const fs = require('fs');
const path = require('path');

try {
    const { subfolders } = require('../subfolders.js');
    console.log('Successfully loaded subfolders.js');
    
    // Check for garbage data
    let count = 0;
    subfolders.forEach((item, index) => {
        if (item.summary && (item.summary.includes('\u0000') || item.summary.length > 10000 && /[\x00-\x08\x0E-\x1F]/.test(item.summary))) {
            console.log(`Entry ${index} (${item.name}) has suspicious summary data.`);
            count++;
        }
    });
    console.log(`Found ${count} suspicious entries.`);
} catch (e) {
    console.error('Error loading subfolders.js:', e.message);
}
