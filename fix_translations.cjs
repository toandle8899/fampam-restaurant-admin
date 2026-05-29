const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove the injected plDict from enDict
// The plDict in enDict starts with:
//   "menu.title": "Nasze specjały",
// and ends with:
//   "hero.subtitle": "Kuchnia Wietnamska",
const plInEn = `  "menu.title": "Nasze specjały",
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
content = content.replace(plInEn, "");

// 2. Add plDict to pl
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
content = content.replace(
  '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n};\n\nconst de: Dict = {', 
  '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n' + plDict + '};\n\nconst de: Dict = {'
);

// 3. Add deDict to de
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
content = content.replace(
  '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n};\n\nexport const translations', 
  '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n' + deDict + '};\n\nexport const translations'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed translations');
