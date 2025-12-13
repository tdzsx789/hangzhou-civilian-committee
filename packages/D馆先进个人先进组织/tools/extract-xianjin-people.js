const fs = require('fs');
const path = require('path');

const DOC_TXT_PATH = path.resolve(__dirname, '../xianjinPeople.txt');
const OUTPUT_JSON_PATH = path.resolve(__dirname, '../src/assets/xianjinPeople.json');

function readLines(file) {
  const content = fs.readFileSync(file, 'utf8');
  // Normalize line endings
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
}

function extract() {
  const lines = readLines(DOC_TXT_PATH);
  const people = [];
  let current = null;
  let inSummary = false;
  let summaryLines = [];

  const pushCurrent = () => {
    if (!current) return;
    // Trim trailing newlines in summary
    if (typeof current.summary === 'string') {
      current.summary = current.summary.replace(/\n+$/,'');
    }
    people.push(current);
    current = null;
    inSummary = false;
  };

  const isLabel = (line, label) => {
    // 兼容全角/半角冒号：'：' 或 ':'
    const re = new RegExp('^\\s*' + label + '\\s*[：:]');
    return re.test(line);
  };

  const readValue = (line, label) => {
    return line.replace(/^\s*'+label+'：/, '');
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimStart();

    if (isLabel(line, '姓名')) {
      // New record begins
      if (current) pushCurrent();
      const value = line.replace(/^\s*姓名：\s*/, '').trim();
      current = { name: value, address: '', title: '', summary: '' };
      inSummary = false;
      continue;
    }

    if (!current) {
      // Skip lines until a record starts
      continue;
    }

    if (isLabel(line, '单位及职务')) {
      current.address = line.replace(/^\s*单位及职务：\s*/, '').trim();
      inSummary = false;
      continue;
    }

    if (isLabel(line, '荣誉')) {
      current.title = line.replace(/^\s*荣誉：\s*/, '').trim();
      inSummary = false;
      continue;
    }

    if (isLabel(line, '简介')) {
      const first = line.replace(/^\s*简介：\s*/, '');
      summaryLines = [];
      if (first.length) summaryLines.push(first);
      inSummary = true;
      continue;
    }

    // Accumulate summary until images or next record labels
    if (inSummary) {
      // Stop if another record label appears
      if (isLabel(line, '姓名') || isLabel(line, '单位及职务') || isLabel(line, '荣誉') || isLabel(line, '简介')) {
        // finalize summary
        current.summary = summaryLines.join('\n');
        inSummary = false;
        summaryLines = [];
        // reprocess this line in outer loop
        i--; 
        continue;
      }
      // Detect first image marker and stop before it
      const nextRaw = lines[i + 1] || '';
      const providerRe = /(本图片由|图片由|图片来源|照片来源|来源|供图|摄影)\s*[：:]/;
      const isCaptionLine = (l) => {
        const short = l.trim().length <= 60;
        const kw = /(图\s*\d+|图片|照片|留影|合影|工作照|证书|大会|现场)/;
        const hasDate = /(\d{4}年|\d{1,2}月|\d{1,2}日)/;
        const hasQuotes = /[“”]/;
        return short && (kw.test(l) || hasDate.test(l) || hasQuotes.test(l));
      };

      if (providerRe.test(line) || providerRe.test(nextRaw) || isCaptionLine(line)) {
        // 如果下一行是“提供/来源”行，上一行视为图片标题，需要排除
        if (providerRe.test(nextRaw)) {
          while (summaryLines.length && summaryLines[summaryLines.length - 1].trim() === '') {
            summaryLines.pop();
          }
          if (summaryLines.length && summaryLines[summaryLines.length - 1].trim() !== '') {
            summaryLines.pop();
          }
        } else if (providerRe.test(line)) {
          // 当前行是提供/来源行，仅收束摘要
          while (summaryLines.length && summaryLines[summaryLines.length - 1].trim() === '') {
            summaryLines.pop();
          }
        } else if (isCaptionLine(line)) {
          // 当前行是图片标题行，不纳入摘要
          while (summaryLines.length && summaryLines[summaryLines.length - 1].trim() === '') {
            summaryLines.pop();
          }
        }
        current.summary = summaryLines.join('\n');
        inSummary = false;
        summaryLines = [];
        continue;
      }
      summaryLines.push(raw);
      continue;
    }
  }

  // Flush last
  if (current) {
    if (inSummary) {
      current.summary = (current.summary && current.summary.length ? current.summary + '\n' : '') + summaryLines.join('\n');
      inSummary = false;
      summaryLines = [];
    }
    pushCurrent();
  }

  // Emit JSON, preserving \n in summary strings
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(people, null, 2), 'utf8');
  console.log(`Extracted ${people.length} people -> ${OUTPUT_JSON_PATH}`);
  // Remove intermediate txt if exists
  try { fs.unlinkSync(DOC_TXT_PATH); } catch (e) {}
}

extract();
