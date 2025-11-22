#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 list.json
const listPath = path.join(__dirname, '..', 'list.json');
const exhibitions = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const packagesDir = path.join(__dirname, '..', 'packages');

// 创建assets文件夹的函数
function createAssetsFolder(exhibition) {
  const { name, id } = exhibition;
  const exhibitionPath = path.join(packagesDir, id);
  
  if (!fs.existsSync(exhibitionPath)) {
    console.log(`⏭️  跳过不存在的展项: ${id}`);
    return false;
  }
  
  const assetsPath = path.join(exhibitionPath, 'src', 'assets');
  
  if (fs.existsSync(assetsPath)) {
    console.log(`⏭️  跳过已存在的assets文件夹: ${id}`);
    return false;
  }
  
  console.log(`🔄 正在创建: ${id} (${name})`);
  
  // 创建assets文件夹
  fs.mkdirSync(assetsPath, { recursive: true });
  
  // 创建一个.gitkeep文件，确保空文件夹也能被git跟踪（可选）
  // fs.writeFileSync(path.join(assetsPath, '.gitkeep'), '');
  
  return true;
}

// 批量创建所有展项的assets文件夹
console.log(`📋 开始为 ${exhibitions.length} 个展项创建assets文件夹...\n`);

let created = 0;
let skipped = 0;

exhibitions.forEach((exhibition) => {
  const success = createAssetsFolder(exhibition);
  if (success) {
    created++;
  } else {
    skipped++;
  }
});

console.log(`\n✅ 完成！`);
console.log(`   创建: ${created} 个`);
console.log(`   跳过: ${skipped} 个`);
console.log(`   总计: ${exhibitions.length} 个`);

