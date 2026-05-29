const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Update StringKey
content = content.replace(
  '  | "menu.col.libations.sub"',
  '  | "menu.col.libations.sub"\n  | "menu.col.soup.label"\n  | "menu.col.soup.sub"\n  | "menu.col.fampam_specialty.label"\n  | "menu.col.fampam_specialty.sub"'
);

// Update English
content = content.replace(
  '  "menu.col.khai_vi.label": "STARTERS",',
  '  "menu.col.khai_vi.label": "APPETIZERS",'
).replace(
  '  "menu.col.mon_chinh.label": "MAINS",',
  '  "menu.col.mon_chinh.label": "MAIN DISH",'
).replace(
  '  "menu.col.libations.label": "LIBATIONS",',
  '  "menu.col.libations.label": "DRINK",'
).replace(
  '  "menu.col.libations.sub": "the bar",',
  '  "menu.col.libations.sub": "the bar",\n  "menu.col.soup.label": "SOUP",\n  "menu.col.soup.sub": "warm bowls",\n  "menu.col.fampam_specialty.label": "FAMPAM SPECIALTY",\n  "menu.col.fampam_specialty.sub": "house signatures",'
);

// Update Vietnamese
content = content.replace(
  '  "menu.col.khai_vi.label": "KHAI_VỊ",',
  '  "menu.col.khai_vi.label": "KHAI VỊ",'
).replace(
  '  "menu.col.mon_chinh.label": "MÓN_CHÍNH",',
  '  "menu.col.mon_chinh.label": "MÓN CHÍNH",'
).replace(
  '  "menu.col.libations.label": "ĐỒ_UỐNG",',
  '  "menu.col.libations.label": "ĐỒ UỐNG",'
).replace(
  '  "menu.col.libations.sub": "quầy bar",',
  '  "menu.col.libations.sub": "quầy bar",\n  "menu.col.soup.label": "SÚP",\n  "menu.col.soup.sub": "chén súp ấm",\n  "menu.col.fampam_specialty.label": "ĐẶC SẢN FAMPAM",\n  "menu.col.fampam_specialty.sub": "món ngon độc quyền",'
);

// Update Polish
content = content.replace(
  '  "menu.col.libations.sub": "bar",',
  '  "menu.col.libations.sub": "bar",\n  "menu.col.soup.label": "ZUPY",\n  "menu.col.soup.sub": "ciepłe miski",\n  "menu.col.fampam_specialty.label": "SPECJALNOŚCI FAMPAM",\n  "menu.col.fampam_specialty.sub": "nasze podpisy",'
);

// Update German
content = content.replace(
  '  "menu.col.libations.sub": "die Bar",',
  '  "menu.col.libations.sub": "die Bar",\n  "menu.col.soup.label": "SUPPEN",\n  "menu.col.soup.sub": "warme Schüsseln",\n  "menu.col.fampam_specialty.label": "FAMPAM SPEZIALITÄTEN",\n  "menu.col.fampam_specialty.sub": "unsere Handschrift",'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Translations updated.');
