const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 可以通过命令行参数指定目标大小，默认为2MB
const targetSizeMB = process.argv[3] ? parseInt(process.argv[3]) : 2;
const TARGET_SIZE = targetSizeMB * 1024 * 1024; // MB to bytes
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
// 可以通过命令行参数指定目录，默认为 peopleImages
const targetDirName = process.argv[2] || 'peopleImages';
const TARGET_DIR = path.join(__dirname, 'public', targetDirName);

// 检查文件大小（字节）
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error.message);
    return 0;
  }
}

// 检查是否是图片文件
function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// 使用 sips 压缩图片（macOS）
function compressImageWithSips(filePath) {
  try {
    const tempPath = filePath + '.tmp';
    // 使用 sips 压缩，质量设置为 80
    execSync(`sips -s format jpeg -s formatOptions 80 "${filePath}" --out "${tempPath}"`, { stdio: 'ignore' });
    
    // 如果压缩后的文件更小，替换原文件
    if (fs.existsSync(tempPath)) {
      const newSize = getFileSize(tempPath);
      const oldSize = getFileSize(filePath);
      
      if (newSize < oldSize && newSize <= TARGET_SIZE) {
        fs.renameSync(tempPath, filePath);
        return { success: true, originalSize: oldSize, newSize };
      } else if (newSize > TARGET_SIZE) {
        // 如果还是太大，尝试更低的质量
        fs.unlinkSync(tempPath);
        let quality = 70;
        let attempts = 0;
        
        while (quality >= 50 && attempts < 5) {
          execSync(`sips -s format jpeg -s formatOptions ${quality} "${filePath}" --out "${tempPath}"`, { stdio: 'ignore' });
          const currentSize = getFileSize(tempPath);
          
          if (currentSize <= TARGET_SIZE) {
            fs.renameSync(tempPath, filePath);
            return { success: true, originalSize: oldSize, newSize: currentSize };
          }
          
          quality -= 10;
          attempts++;
        }
        
        // 如果还是太大，尝试调整尺寸
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        
        // 如果还是太大，尝试调整尺寸并降低质量
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        
        // 获取图片尺寸并缩小
        const info = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: 'utf8' });
        const widthMatch = info.match(/pixelWidth: (\d+)/);
        const heightMatch = info.match(/pixelHeight: (\d+)/);
        
        if (widthMatch && heightMatch) {
          let width = parseInt(widthMatch[1]);
          let height = parseInt(heightMatch[1]);
          let scale = 0.8;
          let quality = 60;
          
          // 尝试不同的缩放比例和质量组合
          while (scale >= 0.4 && quality >= 40) {
            const newWidth = Math.floor(width * scale);
            const newHeight = Math.floor(height * scale);
            
            // 先调整尺寸
            execSync(`sips -z ${newHeight} ${newWidth} "${filePath}" --out "${tempPath}"`, { stdio: 'ignore' });
            
            // 再调整质量
            const tempPath2 = tempPath + '.2';
            execSync(`sips -s format jpeg -s formatOptions ${quality} "${tempPath}" --out "${tempPath2}"`, { stdio: 'ignore' });
            
            if (fs.existsSync(tempPath2)) {
              const currentSize = getFileSize(tempPath2);
              
              if (currentSize <= TARGET_SIZE) {
                fs.renameSync(tempPath2, filePath);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                return { success: true, originalSize: oldSize, newSize: currentSize };
              }
              
              fs.unlinkSync(tempPath2);
            }
            
            if (fs.existsSync(tempPath)) {
              fs.unlinkSync(tempPath);
            }
            
            // 如果尺寸调整后还是太大，降低质量
            if (scale <= 0.5) {
              quality -= 10;
              scale = 0.8; // 重置缩放比例
            } else {
              scale -= 0.1;
            }
          }
        }
      } else {
        fs.unlinkSync(tempPath);
      }
    }
    
    return { success: false, message: `Could not compress below ${targetSizeMB}MB` };
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error.message);
    return { success: false, error: error.message };
  }
}

// 递归遍历目录
function walkDirectory(dirPath, callback) {
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      let stat;
      try {
        stat = fs.statSync(filePath);
      } catch (error) {
        // 跳过无法访问的文件（如损坏的符号链接）
        continue;
      }
      
      // 跳过符号链接指向的文件
      if (stat.isSymbolicLink()) {
        continue;
      }
      
      if (stat.isDirectory()) {
        walkDirectory(filePath, callback);
      } else if (stat.isFile() && isImageFile(filePath)) {
        callback(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
}

// 主函数
function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Directory not found: ${TARGET_DIR}`);
    process.exit(1);
  }
  
  console.log(`Starting image compression for: ${TARGET_DIR}`);
  console.log(`Target size: ${TARGET_SIZE / 1024 / 1024}MB\n`);
  
  let totalFiles = 0;
  let compressedFiles = 0;
  let skippedFiles = 0;
  let errorFiles = 0;
  
  walkDirectory(TARGET_DIR, (filePath) => {
    totalFiles++;
    const fileSize = getFileSize(filePath);
    const sizeInMB = (fileSize / 1024 / 1024).toFixed(2);
    
    if (fileSize > TARGET_SIZE) {
      console.log(`Compressing: ${filePath} (${sizeInMB}MB)`);
      const result = compressImageWithSips(filePath);
      
      if (result.success) {
        compressedFiles++;
        const newSizeInMB = (result.newSize / 1024 / 1024).toFixed(2);
        const saved = ((result.originalSize - result.newSize) / 1024 / 1024).toFixed(2);
        console.log(`  ✓ Compressed: ${sizeInMB}MB → ${newSizeInMB}MB (saved ${saved}MB)`);
      } else {
        errorFiles++;
        console.log(`  ✗ Failed to compress: ${result.message || result.error}`);
      }
    } else {
      skippedFiles++;
      // 只在详细模式下显示跳过的文件
      if (process.argv.includes('--verbose')) {
        console.log(`Skipping: ${filePath} (${sizeInMB}MB - already under ${targetSizeMB}MB)`);
      }
    }
  });
  
  console.log(`\n=== Summary ===`);
  console.log(`Total images: ${totalFiles}`);
  console.log(`Compressed: ${compressedFiles}`);
  console.log(`Skipped (already < ${targetSizeMB}MB): ${skippedFiles}`);
  console.log(`Errors: ${errorFiles}`);
}

main();

