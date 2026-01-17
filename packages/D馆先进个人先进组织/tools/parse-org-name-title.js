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

  let updatedCount = 0;

  const newArray = orgArray.map(item => {
    const trueName = item.trueName || item.originName; // Fallback to originName if trueName missing
    
    // Split by "－" (full-width dash) or "-" (half-width dash)
    // Using regex /[-－]/ to match either
    const parts = trueName.split(/[-－]/);
    
    let name = '';
    let title = '';

    if (parts.length > 0) {
      name = parts[0].trim();
      if (parts.length > 1) {
        // If there are multiple parts, join the rest back together for title
        // Or just take the second part as requested? 
        // User said: "split[1]变成title字段"
        // But some might have multiple dashes. Let's stick to user request strictly for split[1], 
        // but if there are more parts, maybe they should be included?
        // Usually "Name - Title" structure implies the rest is title.
        // Let's take parts[1] as requested, but also consider if there are more.
        // Actually user said "split[1]变成title字段", implying simple index access.
        // However, if the name itself contains a dash, or title has dashes, this might be tricky.
        // Based on previous tasks, usually it's "Name - Title".
        // Let's try to capture everything after the first dash as title if possible, 
        // or just strict split[1]. Given "split[1] -> title", I will use parts[1].
        // Wait, if there are multiple titles separated by dashes?
        // Let's look at example: "浙江省...社区－全国和谐社区...－全国科普..."
        // If we split by dash, we get [Name, Title1, Title2].
        // If user wants split[1] to be title, then only Title1 is captured.
        // But maybe the user implies the structure is strictly Name - Title.
        // Let's check the file content from previous turn.
        // Example: "浙江省宁波市...季卫桥社区－全国和谐社区...、全国科普..." -> This uses "、" for multiple titles, not dashes.
        // Example: "13. ...南都社区－全国综合减灾示范社区" -> one dash.
        // Example: "浙江省...冬香好妈妈工作站党支部－全国先进基层党组织－全国三八红旗集体" -> Two dashes!
        // In this case: split[0] = Name, split[1] = "全国先进基层党组织", split[2] = "全国三八红旗集体".
        // If I only take split[1], I miss the second title.
        // User instruction: "将split[1]变成title字段".
        // This is specific.
        // However, usually for "Name - Title" extraction, we want the rest.
        // But if I follow strictly: name = split[0], title = split[1].
        // Let's see if I can be smarter. If I see multiple dashes, maybe I should join them?
        // "将split[0]变成name字段，将split[1]变成title字段" -> strict mapping.
        
        // Let's look at the previous context where user asked for:
        // "把fileName根据“－”split，把split[0]覆盖到address字段上，把split[2]覆盖到title字段上" (for another task).
        
        // For THIS task, user says: "将split[0]变成name字段，将split[1]变成title字段".
        // I will follow this strictly. BUT, I should handle the case where split[1] might be undefined.
        
        // Wait, for the "double dash" case (Name - Title1 - Title2), 
        // if I just take split[1], I lose Title2. 
        // Maybe I should join from index 1 to end?
        // But user said "split[1]". 
        // I will implement "rest of the string after first dash" logic if it seems safer, 
        // OR just strict split[1].
        // Let's look at: "浙江省...党支部－全国先进基层党组织－全国三八红旗集体"
        // split[0]: ...党支部
        // split[1]: 全国先进基层党组织
        // split[2]: 全国三八红旗集体
        // If I only use split[1], title becomes "全国先进基层党组织".
        // Maybe that's what user wants? Or maybe they want all titles?
        // Given the ambiguity and the explicit "split[1]" instruction, I'll stick to split[1] primarily,
        // BUT, looking at the data "冬香好妈妈工作站党支部－全国先进基层党组织－全国三八红旗集体", 
        // it seems likely they want the full title info.
        // However, I must follow "split[1] -> title".
        // Let's check if there are cases where split[1] is empty or not enough.
        
        // Actually, looking at the previous Read output:
        // "originName": "2. 河南省焦作市山阳区艺新街道冬香好妈妈工作站党支部－全国先进基层党组织－全国三八红旗集体",
        // "trueName": "河南省焦作市山阳区艺新街道冬香好妈妈工作站党支部－全国先进基层党组织－全国三八红旗集体",
        // The user might want to preserve both?
        // If I strictly do split[1], I get "全国先进基层党组织".
        // If I interpret "split" as splitting the string, maybe I should check if user implies "first part is name, rest is title".
        
        // Let's look at the "name" and "title" fields in the file ALREADY.
        // The file ALREADY HAS "name" and "title" fields!
        // Wait, the Read output shows:
        // {
        //   "originName": "...",
        //   "trueName": "...",
        //   "name": "...",
        //   "title": "..."
        // }
        // The user wants to UPDATE these fields based on trueName split.
        // Why? Maybe the current name/title are incorrect or empty?
        // Or maybe for new items?
        
        // Let's assume strict compliance:
        // split[0] -> name
        // split[1] -> title
        
        title = parts[1] ? parts[1].trim() : '';
      }
    }

    return {
      ...item,
      name: name,
      title: title
    };
  });

  fs.writeFileSync(jsonPath, JSON.stringify(newArray, null, 2), 'utf8');
  console.log(`Successfully updated name and title in orgArray.json`);

} catch (error) {
  console.error('Error processing JSON:', error);
}
