const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const newKeysStr = `
  | "menu.title"
  | "menu.cta.full"
  | "legend.veg"
  | "legend.vegan"
  | "legend.gf"
  | "legend.nf"
  | "legend.sf"
  | "legend.spice"
  | "legend.hot"
  | "legend.hotter"
  | "legend.hottest"
  | "reserve.field.name"
  | "reserve.placeholder.name"
  | "reserve.field.email"
  | "reserve.placeholder.email"
  | "reserve.field.requests"
  | "reserve.placeholder.requests"
  | "reserve.requested"
  | "reserve.received_part1"
  | "reserve.received_part2"
  | "reserve.make_another"
  | "reserve.submitting"
  | "delivery.title"
  | "delivery.subtitle"
  | "nav.closed"
  | "hero.subtitle"`;

// Update StringKey
content = content.replace(
  '  | "footer.status";',
  '  | "footer.status"' + newKeysStr + ';'
);

const enDict = `  "menu.title": "Our highlights",
  "menu.cta.full": "View full menu",
  "legend.veg": "vegetarian",
  "legend.vegan": "vegan",
  "legend.gf": "gluten-free",
  "legend.nf": "nut-free",
  "legend.sf": "shellfish-free",
  "legend.spice": "Spice Levels",
  "legend.hot": "Hot",
  "legend.hotter": "Hotter",
  "legend.hottest": "Hottest",
  "reserve.field.name": "Name",
  "reserve.placeholder.name": "Your full name",
  "reserve.field.email": "Email",
  "reserve.placeholder.email": "hello@example.com",
  "reserve.field.requests": "Special Requests / Message",
  "reserve.placeholder.requests": "Any dietary requirements or special occasions?",
  "reserve.requested": "Booking Requested",
  "reserve.received_part1": "We have received your request and will contact you at ",
  "reserve.received_part2": " shortly to confirm.",
  "reserve.make_another": "Make another reservation",
  "reserve.submitting": "Submitting...",
  "delivery.title": "Order Online",
  "delivery.subtitle": "Enjoy Fampam at home",
  "nav.closed": "CLOSED",
  "hero.subtitle": "Vietnamese Cuisine",
`;

const viDict = `  "menu.title": "Thực đơn nổi bật",
  "menu.cta.full": "Xem toàn bộ thực đơn",
  "legend.veg": "ăn chay",
  "legend.vegan": "thuần chay",
  "legend.gf": "không gluten",
  "legend.nf": "không hạt",
  "legend.sf": "không hải sản",
  "legend.spice": "Độ cay",
  "legend.hot": "Cay",
  "legend.hotter": "Cay hơn",
  "legend.hottest": "Cực cay",
  "reserve.field.name": "Tên",
  "reserve.placeholder.name": "Họ và tên",
  "reserve.field.email": "Email",
  "reserve.placeholder.email": "xin_chao@vidu.com",
  "reserve.field.requests": "Yêu cầu đặc biệt",
  "reserve.placeholder.requests": "Chế độ ăn uống hoặc dịp đặc biệt?",
  "reserve.requested": "Đã Yêu Cầu Đặt Bàn",
  "reserve.received_part1": "Chúng tôi đã nhận được yêu cầu và sẽ liên hệ qua ",
  "reserve.received_part2": " sớm nhất.",
  "reserve.make_another": "Đặt bàn khác",
  "reserve.submitting": "Đang gửi...",
  "delivery.title": "Đặt hàng trực tuyến",
  "delivery.subtitle": "Thưởng thức Fampam tại nhà",
  "nav.closed": "ĐÓNG CỬA",
  "hero.subtitle": "Ẩm Thực Việt Nam",
`;

const plDict = `  "menu.title": "Nasze specjały",
  "menu.cta.full": "Zobacz pełne menu",
  "legend.veg": "wegetariańskie",
  "legend.vegan": "wegańskie",
  "legend.gf": "bezglutenowe",
  "legend.nf": "bez orzechów",
  "legend.sf": "bez skorupiaków",
  "legend.spice": "Poziom ostrości",
  "legend.hot": "Ostre",
  "legend.hotter": "Bardziej ostre",
  "legend.hottest": "Najostrzejsze",
  "reserve.field.name": "Imię",
  "reserve.placeholder.name": "Twoje imię",
  "reserve.field.email": "E-mail",
  "reserve.placeholder.email": "czesc@przyklad.pl",
  "reserve.field.requests": "Specjalne życzenia",
  "reserve.placeholder.requests": "Wymagania dietetyczne lub specjalne okazje?",
  "reserve.requested": "Rezerwacja Wysłana",
  "reserve.received_part1": "Otrzymaliśmy Twoją rezerwację i skontaktujemy się z ",
  "reserve.received_part2": " wkrótce.",
  "reserve.make_another": "Zrób kolejną rezerwację",
  "reserve.submitting": "Wysyłanie...",
  "delivery.title": "Zamów online",
  "delivery.subtitle": "Ciesz się Fampam w domu",
  "nav.closed": "ZAMKNIĘTE",
  "hero.subtitle": "Kuchnia Wietnamska",
`;

const deDict = `  "menu.title": "Unsere Highlights",
  "menu.cta.full": "Komplettes Menü ansehen",
  "legend.veg": "vegetarisch",
  "legend.vegan": "vegan",
  "legend.gf": "glutenfrei",
  "legend.nf": "nussfrei",
  "legend.sf": "ohne Schalentiere",
  "legend.spice": "Schärfegrad",
  "legend.hot": "Scharf",
  "legend.hotter": "Schärfer",
  "legend.hottest": "Sehr scharf",
  "reserve.field.name": "Name",
  "reserve.placeholder.name": "Dein Name",
  "reserve.field.email": "E-Mail",
  "reserve.placeholder.email": "hallo@beispiel.de",
  "reserve.field.requests": "Besondere Wünsche",
  "reserve.placeholder.requests": "Ernährungsbedürfnisse oder besondere Anlässe?",
  "reserve.requested": "Reservierung Angefragt",
  "reserve.received_part1": "Wir haben deine Anfrage erhalten und kontaktieren dich unter ",
  "reserve.received_part2": " in Kürze.",
  "reserve.make_another": "Neue Reservierung",
  "reserve.submitting": "Wird gesendet...",
  "delivery.title": "Online Bestellen",
  "delivery.subtitle": "Genieße Fampam zu Hause",
  "nav.closed": "GESCHLOSSEN",
  "hero.subtitle": "Vietnamesische Küche",
`;

content = content.replace('  "footer.status": "SYS · v1.0 · ALL_GREEN",', '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n' + enDict);
content = content.replace('  "footer.status": "HỆ THỐNG · v1.0 · XANH",', '  "footer.status": "HỆ THỐNG · v1.0 · XANH",\n' + viDict);
content = content.replace('  "footer.status": "SYS · v1.0 · ALL_GREEN",', '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n' + plDict);
content = content.replace('  "footer.status": "SYS · v1.0 · ALLES_GRÜN",', '  "footer.status": "SYS · v1.0 · ALLES_GRÜN",\n' + deDict);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Translations updated.');
