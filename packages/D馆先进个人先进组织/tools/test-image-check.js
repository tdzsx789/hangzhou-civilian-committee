const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = [
  '/Users/tree/Desktop/code/hangzhou-civilian-committee/packages/D馆先进个人先进组织/先进组织更新/10. 浙江省（26个）/1. 浙江省杭州市拱墅区长庆街道王马社区－全国先进基层党组织/浙江省杭州市拱墅区长庆街道王马社区简介.doc',
  '/Users/tree/Desktop/code/hangzhou-civilian-committee/packages/D馆先进个人先进组织/先进组织更新/10. 浙江省（26个）/2. 浙江省杭州市上城区凯旋街道南肖埠社区－全国先进基层群众性自治组织/浙江省杭州市上城区凯旋街道南肖埠社区简介.wps',
  '/Users/tree/Desktop/code/hangzhou-civilian-committee/packages/D馆先进个人先进组织/先进组织更新/10. 浙江省（26个）/3. 浙江省杭州市上城区小营街道小营巷社区－全国先进基层党组织/浙江省杭州市上城区小营街道小营巷社区简介.docx'
];

function checkImageInZip(filePath) {
  try {
    // Check if zip and contains word/media
    const output = execSync(`unzip -l "${filePath}"`, { stdio: 'pipe' }).toString();
    if (output.includes('word/media/')) {
        return true;
    }
  } catch (e) {
    // Not a zip or error
    return false;
  }
  return false;
}

function checkImageInBinary(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    // JPG: FF D8 FF
    if (buffer.includes(Buffer.from([0xFF, 0xD8, 0xFF]))) return true;
    // PNG: 89 50 4E 47
    if (buffer.includes(Buffer.from([0x89, 0x50, 0x4E, 0x47]))) return true;
    return false;
  } catch (e) {
    return false;
  }
}

files.forEach(f => {
    if (!fs.existsSync(f)) {
        console.log(`File not found: ${f}`);
        return;
    }
    const ext = path.extname(f).toLowerCase();
    let hasImage = false;
    
    // Strategy 1: Try zip (works for docx and some wps)
    if (checkImageInZip(f)) {
        console.log(`[ZIP] Found image in ${path.basename(f)}`);
        hasImage = true;
    } else {
        // Strategy 2: Binary search
        if (checkImageInBinary(f)) {
            console.log(`[BIN] Found image in ${path.basename(f)}`);
            hasImage = true;
        } else {
             console.log(`[NO] No image found in ${path.basename(f)}`);
        }
    }
});
