const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = '/Users/tree/Desktop/全国优秀共产党员、全国优秀党务工作者、全国先进基层党组织';
const PEOPLE_JS = path.join(ROOT, 'src/assets/newPeopleData.js');
const ZUZHI_JS = path.join(ROOT, 'src/assets/zuzhiData.js');
const PEOPLE_PUBLIC_ROOT = path.join(ROOT, 'public/peopleImages');
const ZUZHI_PUBLIC_ROOT = path.join(ROOT, 'public/zuzhiImages');

const CONTROL_CHARS_RE = /[\u200e\u200f\u202a-\u202e\u2066-\u2069\uFEFF]/g;
const DOC_EXT_RE = /\.(docx?|wps)$/i;

function readJsArray(filePath, exportName) {
  const text = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*\\]);?\\s*$`);
  const match = text.match(re);
  if (!match) {
    throw new Error(`Cannot parse ${exportName} from ${filePath}`);
  }
  const arr = vm.runInNewContext(`(${match[1]})`, {}, { filename: path.basename(filePath) });
  return { text, arr };
}

function writeJsArray(filePath, exportName, arr) {
  const out = `export const ${exportName} = ${JSON.stringify(arr, null, 2)};\n`;
  fs.writeFileSync(filePath, out, 'utf8');
}

function cleanText(value) {
  return String(value ?? '')
    .replace(CONTROL_CHARS_RE, '')
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ');
}

function cleanLine(value) {
  return cleanText(value).replace(/[ \t]+/g, ' ').trim();
}

function normalizeComparable(value) {
  return cleanLine(value)
    .replace(/[，,。．、；;：:\s]/g, '')
    .replace(/[—－-]/g, '')
    .replace(/[“”"']/g, '')
    .replace(/[()（）\[\]【】<>《》]/g, '')
    .replace(/[·•]/g, '·');
}

function provinceKey(value) {
  let s = cleanLine(value);
  s = s.replace(/^\d+[\.\s]*/, '');
  s = s.replace(/[（(].*?[）)]/g, '');
  s = s.replace(/[.。．\s]/g, '');
  if (/新疆.*兵团/.test(s)) return '新疆生产建设兵团';
  s = s.replace(/(壮族自治区|回族自治区|维吾尔自治区|自治区|省|市|特别行政区)$/, '');
  s = s.replace(/\d+$/, '');
  return s;
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => path.join(dir, entry.name));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => path.join(dir, entry.name));
}

function hasSentencePunctuation(line) {
  return /[。！？；]/.test(line);
}

function isPeopleHeaderLine(line) {
  const s = cleanLine(line);
  if (!s) return true;
  if (s.includes('事迹材料')) return true;
  if (!hasSentencePunctuation(s) && /[—－-]/.test(s)) return true;
  if (!hasSentencePunctuation(s) && s.length <= 90 && /(社区党委|党工委|党支部|党委|支部|居委会主任|书记|主任|社区|街道|镇|乡|服务中心|工作站)/.test(s)) {
    return true;
  }
  return false;
}

function isOrgHeaderLine(line) {
  const s = cleanLine(line);
  if (!s) return true;
  if (!hasSentencePunctuation(s) && /[—－-]/.test(s)) return true;
  if (!hasSentencePunctuation(s) && s.length <= 80 && /(党工委|党支部|党委|社区|街道|镇|乡|服务中心|工作站)/.test(s)) {
    return true;
  }
  return false;
}

function extractDocText(filePath) {
  const tries = [
    ['textutil', ['-convert', 'txt', '-stdout', filePath]],
    ['strings', [filePath]],
  ];
  for (const [cmd, args] of tries) {
    try {
      const out = execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
      return cleanText(out);
    } catch {
      // continue
    }
  }
  return '';
}

function splitDocLines(text) {
  return cleanText(text)
    .split('\n')
    .map(cleanLine)
    .filter((line) => line !== undefined);
}

function extractTrailingName(baseName) {
  const compact = cleanLine(baseName)
    .replace(/[—－-]+/g, '')
    .replace(/[，,。．、；;：:\s]/g, '');
  const match = compact.match(/([A-Za-z\u4e00-\u9fa5·]{2,8})$/);
  return match ? match[1] : '';
}

function stripTrailingName(baseName, name) {
  if (!name) return cleanLine(baseName);
  let s = cleanLine(baseName).trim();
  if (s.endsWith(name)) {
    s = s.slice(0, -name.length);
  }
  s = s.replace(/[—－-]+$/, '');
  s = s.replace(/[，,。．、；;：:\s]+$/, '');
  return s.trim();
}

function replaceLeadingProvince(address, canonicalProvince, knownProvinceNames) {
  let s = cleanLine(address);
  for (const prov of knownProvinceNames) {
    if (provinceKey(prov) !== provinceKey(canonicalProvince) && s.startsWith(prov)) {
      return canonicalProvince + s.slice(prov.length);
    }
  }
  if (canonicalProvince && s.startsWith(canonicalProvince.slice(1)) && canonicalProvince.length > 1) {
    return canonicalProvince + s.slice(canonicalProvince.slice(1).length);
  }
  if (canonicalProvince && !s.startsWith(canonicalProvince) && !knownProvinceNames.some((prov) => s.startsWith(prov))) {
    return canonicalProvince + s;
  }
  return s;
}

function extractPeopleAddressFromDoc(baseName, name, canonicalProvince, knownProvinceNames, bodyLines) {
  let address = stripTrailingName(baseName, name);
  address = address.replace(/[—－-]+/g, '');
  address = address.replace(/[，,。．、；;：:\s]+$/, '');
  address = replaceLeadingProvince(address, canonicalProvince, knownProvinceNames);

  if (!address || provinceKey(address) === provinceKey(name)) {
    const firstBody = bodyLines.find((line) => cleanLine(line)) || '';
    const body = cleanLine(firstBody);
    const patterns = [
      new RegExp(`^${escapeRegExp(name)}[，,](?:女|男|[^。！？]{0,40}?)(?:现任|担任|任|是|为)?([^。！？]+)`),
      new RegExp(`^${escapeRegExp(name)}是([^。！？]+)`),
      new RegExp(`^${escapeRegExp(name)}[，,](?:现任|担任|任|是|为)([^。！？]+)`),
      new RegExp(`^${escapeRegExp(name)}，([^。！？]+)`),
    ];
    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        let candidate = cleanLine(match[1]).replace(/[—－-]+/g, '');
        candidate = replaceLeadingProvince(candidate, canonicalProvince, knownProvinceNames);
        if (candidate) {
          address = candidate;
          break;
        }
      }
    }
  }

  return cleanLine(address);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSummary(text, mode) {
  const lines = splitDocLines(text);
  let start = 0;
  while (start < lines.length && !lines[start]) start++;

  if (mode === 'org') {
    while (start < lines.length && isOrgHeaderLine(lines[start])) start++;
  } else {
    while (start < lines.length && isPeopleHeaderLine(lines[start])) start++;
  }

  const bodyLines = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (line) bodyLines.push(line);
  }
  return bodyLines.join('\n').trim();
}

function detectImageKind(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length >= 12) {
    if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
      return 'webp';
    }
  }
  if (buf.length >= 8) {
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return 'png';
    }
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'jpg';
  }
  if (buf.length >= 4 && buf.slice(0, 4).toString('ascii') === 'GIF8') {
    return 'gif';
  }
  if (buf.length >= 2 && buf.slice(0, 2).toString('ascii') === 'BM') {
    return 'bmp';
  }
  if (buf.length >= 4) {
    if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0x00) ||
        (buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0x00 && buf[3] === 0x2a)) {
      return 'tif';
    }
  }
  return '';
}

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tif', '.tiff'].includes(ext)) {
    return true;
  }
  return Boolean(detectImageKind(filePath));
}

function imageTargetName(sourceFile) {
  const base = path.basename(sourceFile);
  const ext = path.extname(base);
  if (ext) return base;
  const kind = detectImageKind(sourceFile);
  return kind ? `${base}.${kind}` : base;
}

function clearDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyImages(sourceDir, targetDir, publicPrefix) {
  const files = walkFiles(sourceDir).filter((filePath) => {
    const lower = path.extname(filePath).toLowerCase();
    return !DOC_EXT_RE.test(lower) && isImageFile(filePath);
  });
  if (!files.length) {
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    return [];
  }

  clearDir(targetDir);
  const copied = [];
  const sortedFiles = files.sort((a, b) => path.basename(a).localeCompare(path.basename(b), 'zh-Hans-CN'));
  for (const sourceFile of sortedFiles) {
    const targetFileName = imageTargetName(sourceFile);
    const targetFilePath = path.join(targetDir, targetFileName);
    fs.copyFileSync(sourceFile, targetFilePath);
    copied.push({
      name: path.basename(targetFileName, path.extname(targetFileName)),
      url: `${publicPrefix}/${targetFileName}`.replace(/\\/g, '/'),
    });
  }
  return copied;
}

function walkFiles(dir, result = []) {
  for (const entry of fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []) {
    if (entry.name.startsWith('.')) continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isFile()) {
      result.push(filePath);
    } else if (entry.isDirectory()) {
      walkFiles(filePath, result);
    }
  }
  return result;
}

function getProvinceDataMap(data) {
  const map = new Map();
  for (const province of data) {
    map.set(provinceKey(province.name), province);
  }
  return map;
}

function getKnownProvinceNames(data) {
  return data.map((province) => cleanLine(province.name)).filter(Boolean).sort((a, b) => b.length - a.length);
}

function isBadProvinceName(name) {
  const s = cleanLine(name);
  if (!s) return true;
  if (/\d/.test(s)) return true;
  if (/(新增内容|现有内容|更新|全国|优秀|先进|共产党员|党务工作者|基层党组织)/.test(s)) return true;
  return false;
}

function normalizeProvinceEntries(data) {
  const normalized = [];
  const keyToIndex = new Map();
  for (const province of data) {
    const name = cleanLine(province?.name);
    const key = provinceKey(name);
    if (!key || isBadProvinceName(name)) continue;
    const existingIndex = keyToIndex.get(key);
    if (existingIndex === undefined) {
      keyToIndex.set(key, normalized.length);
      normalized.push(province);
      continue;
    }
    const existing = normalized[existingIndex];
    if (existing && isBadProvinceName(existing.name) && !isBadProvinceName(name)) {
      normalized[existingIndex] = province;
    }
  }
  return normalized;
}

function buildProvinceNameMap(data) {
  const map = new Map();
  for (const province of data) {
    const name = cleanLine(province.name);
    const key = provinceKey(name);
    if (!key || !name) continue;
    if (!map.has(key)) {
      map.set(key, name);
    }
  }
  return map;
}

function findProvinceEntry(data, provinceFolderName) {
  const key = provinceKey(provinceFolderName);
  return data.find((province) => provinceKey(province.name) === key) || null;
}

function resolveProvinceName(provinceFolderName, provinceNameMap) {
  const key = provinceKey(provinceFolderName);
  if (provinceNameMap.has(key)) return provinceNameMap.get(key);
  if (key === '新疆生产建设兵团') return '新疆生产建设兵团';
  if (/^(北京|天津|上海|重庆)$/.test(key)) return `${key}市`;
  if (/^(内蒙古|广西|西藏|宁夏)$/.test(key)) return `${key}自治区`;
  if (key === '新疆') return '新疆维吾尔自治区';
  return `${key}省`;
}

function detectProvinceName(text, knownProvinceNames) {
  const s = cleanLine(text);
  for (const provinceName of knownProvinceNames) {
    if (provinceName && s.startsWith(provinceName)) {
      return provinceName;
    }
  }
  return '';
}

function hasNumericPrefix(items, fieldName) {
  return items.some((item) => /^\s*\d+/.test(cleanLine(item[fieldName])));
}

function nextNumericPrefix(items, fieldName) {
  let max = 0;
  for (const item of items) {
    const match = cleanLine(item[fieldName]).match(/^\s*(\d+)/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max + 1;
}

function pickPeopleTitle(categoryFolder) {
  if (/七一勋章/.test(categoryFolder)) return '七一勋章';
  if (/全国优秀共产党员/.test(categoryFolder)) return '全国优秀共产党员';
  if (/全国优秀党务工作者/.test(categoryFolder)) return '全国优秀党务工作者';
  return cleanLine(categoryFolder);
}

function parsePeopleRecord({ docBase, docText, provinceName, categoryFolder, provinceEntry, knownProvinceNames }) {
  const title = pickPeopleTitle(categoryFolder);
  const name = extractTrailingName(docBase);
  const summary = extractSummary(docText, 'people');
  const summaryLines = summary ? summary.split('\n').map(cleanLine).filter(Boolean) : [];
  const address = extractPeopleAddressFromDoc(docBase, name, provinceName, knownProvinceNames, summaryLines);
  const trueName = `${address}－${name}－${title}`;
  const usePrefix = hasNumericPrefix(provinceEntry.children || [], 'name');
  const prefix = usePrefix ? `${nextNumericPrefix(provinceEntry.children || [], 'name')}` : '';
  const fullName = prefix ? `${prefix}${trueName}` : trueName;
  return {
    name: fullName,
    trueName,
    address,
    people: name,
    title,
    summary,
  };
}

function parseOrgRecord({ docBase, docText, provinceName, provinceEntry, categoryFolder }) {
  const title = '全国先进基层党组织';
  const name = cleanLine(docBase);
  const summary = extractSummary(docText, 'org');
  const trueName = `${name}-${title}`;
  const usePrefix = hasNumericPrefix(provinceEntry.children || [], 'originName');
  const prefixNum = usePrefix ? nextNumericPrefix(provinceEntry.children || [], 'originName') : null;
  const originName = prefixNum ? `${prefixNum}. ${trueName}` : trueName;
  return {
    originName,
    name,
    title,
    trueName,
    summary,
  };
}

function buildTargetPaths(type, provinceName, recordName) {
  if (type === 'people') {
    return {
      folder: path.join(PEOPLE_PUBLIC_ROOT, recordName),
      urlPrefix: `peopleImages/${recordName}`,
    };
  }
  return {
    folder: path.join(ZUZHI_PUBLIC_ROOT, provinceName, recordName),
    urlPrefix: `/zuzhiImages/${provinceName}/${recordName}`,
  };
}

function walkSourceDirectories(dir, result = []) {
  const files = listFiles(dir);
  const docFiles = files.filter((filePath) => DOC_EXT_RE.test(path.extname(filePath)));
  if (docFiles.length) {
    result.push({
      dir,
      docFiles,
      files,
    });
  }
  for (const childDir of listDirs(dir)) {
    walkSourceDirectories(childDir, result);
  }
  return result;
}

function findPeopleMatch(provinceEntry, record) {
  const target = normalizeComparable(record.people);
  return (provinceEntry.children || []).find((child) => normalizeComparable(child.people) === target) || null;
}

function findOrgMatch(provinceEntry, record) {
  const target = normalizeComparable(record.name);
  return (provinceEntry.children || []).find((child) => normalizeComparable(child.name) === target) || null;
}

function sync() {
  let { arr: peopleData } = readJsArray(PEOPLE_JS, 'newPeopleData');
  let { arr: zuzhiData } = readJsArray(ZUZHI_JS, 'zuzhiData');

  peopleData = normalizeProvinceEntries(peopleData);
  zuzhiData = normalizeProvinceEntries(zuzhiData);

  const peopleProvinceMap = getProvinceDataMap(peopleData);
  const orgProvinceMap = getProvinceDataMap(zuzhiData);
  const peopleProvinceNames = getKnownProvinceNames(peopleData);
  const orgProvinceNames = getKnownProvinceNames(zuzhiData);
  const peopleProvinceNameMap = buildProvinceNameMap(peopleData);
  const orgProvinceNameMap = buildProvinceNameMap(zuzhiData);

  const sourceDirs = walkSourceDirectories(SOURCE_ROOT).sort((a, b) => a.dir.localeCompare(b.dir, 'zh-Hans-CN'));

  let addedPeople = 0;
  let updatedPeople = 0;
  let addedOrg = 0;
  let updatedOrg = 0;
  let copiedImages = 0;

  for (const sourceDir of sourceDirs) {
    const rel = path.relative(SOURCE_ROOT, sourceDir.dir).split(path.sep).filter(Boolean);
    if (rel.length < 3) continue;
    const rootFolder = rel[0];
    const isUpdateRoot = rootFolder === '现有内容只需更新';
    const categoryFolder = isUpdateRoot ? rel[1] : rel[2];
    const isOrg = /全国先进基层党组织/.test(categoryFolder);
    const provinceNames = isOrg ? orgProvinceNames : peopleProvinceNames;
    const provinceNameMap = isOrg ? orgProvinceMap : peopleProvinceMap;
    const provinceLabelMap = isOrg ? orgProvinceNameMap : peopleProvinceNameMap;
    let provinceFolder = isUpdateRoot
      ? detectProvinceName(path.basename(sourceDir.dir), provinceNames)
      : rel[1];
    if (!provinceFolder && isUpdateRoot) {
      const docProbe = sourceDir.docFiles.map((filePath) => path.basename(filePath, path.extname(filePath)));
      for (const probe of docProbe) {
        provinceFolder = detectProvinceName(probe, provinceNames);
        if (provinceFolder) break;
      }
    }
    if (!provinceFolder && isUpdateRoot) {
      console.warn(`Skip update folder without province match: ${sourceDir.dir}`);
      continue;
    }
    if (!provinceFolder) {
      provinceFolder = rel[1];
    }
    let provinceEntry = provinceNameMap.get(provinceKey(provinceFolder));
    if (!provinceEntry) {
      const fallbackName = resolveProvinceName(provinceFolder, provinceLabelMap);
      provinceEntry = { name: fallbackName, children: [] };
      if (isOrg) {
        zuzhiData.push(provinceEntry);
        orgProvinceMap.set(provinceKey(fallbackName), provinceEntry);
        orgProvinceNameMap.set(provinceKey(fallbackName), fallbackName);
        orgProvinceNames.push(fallbackName);
      } else {
        peopleData.push(provinceEntry);
        peopleProvinceMap.set(provinceKey(fallbackName), provinceEntry);
        peopleProvinceNameMap.set(provinceKey(fallbackName), fallbackName);
        peopleProvinceNames.push(fallbackName);
      }
    }

    const docFiles = sourceDir.docFiles.slice().sort((a, b) => path.basename(a).localeCompare(path.basename(b), 'zh-Hans-CN'));
    for (const docFile of docFiles) {
      const docBase = path.basename(docFile, path.extname(docFile));
      const docText = extractDocText(docFile);

      if (isOrg) {
        const record = parseOrgRecord({
          docBase,
          docText,
          provinceName: provinceEntry.name,
          provinceEntry,
          categoryFolder,
        });
        const matched = findOrgMatch(provinceEntry, record);
        const targetName = matched ? cleanLine(matched.originName || `${matched.name}-${matched.title || record.title}`) : cleanLine(record.originName);
        const targetPaths = buildTargetPaths('org', provinceEntry.name, targetName);
        const imageFiles = copyImages(sourceDir.dir, targetPaths.folder, targetPaths.urlPrefix);
        copiedImages += imageFiles.length;

        if (matched) {
          matched.summary = record.summary || matched.summary || '';
          matched.images = imageFiles;
          if (!matched.title) matched.title = record.title;
          if (!matched.trueName) matched.trueName = record.trueName;
          if (!matched.name) matched.name = record.name;
          updatedOrg++;
        } else {
          record.images = imageFiles;
          provinceEntry.children = provinceEntry.children || [];
          provinceEntry.children.push(record);
          addedOrg++;
        }
        continue;
      }

      const record = parsePeopleRecord({
        docBase,
        docText,
        provinceName: provinceEntry.name,
        categoryFolder,
        provinceEntry,
        knownProvinceNames: provinceNames,
      });
      const matched = findPeopleMatch(provinceEntry, record);
      const targetName = matched ? cleanLine(matched.name || `${matched.address}－${matched.people}－${matched.title || record.title}`) : cleanLine(record.name);
      const targetPaths = buildTargetPaths('people', provinceEntry.name, targetName);
      const imageFiles = copyImages(sourceDir.dir, targetPaths.folder, targetPaths.urlPrefix);
      copiedImages += imageFiles.length;

      if (matched) {
        matched.summary = record.summary || matched.summary || '';
        matched.images = imageFiles;
        if (!matched.title) matched.title = record.title;
        if (!matched.address) matched.address = record.address;
        if (!matched.people) matched.people = record.people;
        if (!matched.trueName) matched.trueName = record.trueName;
        updatedPeople++;
      } else {
        record.images = imageFiles;
        provinceEntry.children = provinceEntry.children || [];
        provinceEntry.children.push(record);
        addedPeople++;
      }
    }
  }

  writeJsArray(PEOPLE_JS, 'newPeopleData', peopleData);
  writeJsArray(ZUZHI_JS, 'zuzhiData', zuzhiData);

  console.log(`Added people: ${addedPeople}`);
  console.log(`Updated people: ${updatedPeople}`);
  console.log(`Added orgs: ${addedOrg}`);
  console.log(`Updated orgs: ${updatedOrg}`);
  console.log(`Copied images: ${copiedImages}`);
}

sync();
