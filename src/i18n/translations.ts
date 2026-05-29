export type Lang = "en" | "vi" | "pl" | "de";

export const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: "en", label: "EN", full: "English" },
  { code: "vi", label: "VI", full: "Tiếng Việt" },
  { code: "pl", label: "PL", full: "Polski" },
  { code: "de", label: "DE", full: "Deutsch" },
];

export type StringKey =
  | "nav.menu"
  | "nav.reserve"
  | "nav.kitchen"
  | "nav.open"
  | "nav.lang"
  | "nav.order"
  | "hero.kicker"
  | "hero.cities"
  | "hero.title.line1"
  | "hero.title.line2"
  | "hero.lede"
  | "hero.cta.reserve"
  | "hero.cta.menu"
  | "hero.scroll"
  | "menu.kicker"
  | "menu.db"
  | "menu.records"
  | "menu.collection"
  | "menu.sushi"
  | "menu.grill"
  | "menu.loaded"
  | "menu.hint"
  | "menu.eur"
  | "menu.col.khai_vi.label"
  | "menu.col.khai_vi.sub"
  | "menu.col.mon_chinh.label"
  | "menu.col.mon_chinh.sub"
  | "menu.col.libations.label"
  | "menu.col.libations.sub"
  | "menu.col.soup.label"
  | "menu.col.soup.sub"
  | "menu.col.fampam_specialty.label"
  | "menu.col.fampam_specialty.sub"
  | "reserve.kicker"
  | "reserve.title"
  | "reserve.helper"
  | "reserve.field.date"
  | "reserve.field.time"
  | "reserve.field.party"
  | "reserve.guest"
  | "reserve.guests"
  | "reserve.submit"
  | "reserve.confirmed"
  | "reserve.confirmed.title"
  | "reserve.partyOf"
  | "reserve.edit"
  | "footer.tagline"
  | "footer.visit"
  | "footer.contact"
  | "footer.hours"
  | "footer.late"
  | "footer.built"
  | "footer.status"
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
  | "hero.subtitle"
  | "footer.delivery"
  | "footer.design"
  | "cookie.title"
  | "cookie.desc"
  | "cookie.necessary"
  | "cookie.analytics"
  | "cookie.marketing"
  | "cookie.accept"
  | "cookie.reject"
  | "cookie.prefs"
  | "cookie.save"
  | "cookie.cancel";

type Dict = Record<StringKey, string>;

const en: Dict = {
  "nav.menu": "Menu",
  "nav.reserve": "Reserve",
  "nav.kitchen": "/ kitchen",
  "nav.open": "OPEN",
  "nav.lang": "Language",
  "nav.order": "Order",
  "hero.kicker": "EST · 1972 / RE-IMAGINED · 2024",
  "hero.cities": "Saigon ↔ Tokyo ↔ Seoul",
  "hero.title.line1": "Centuries of Flavor.",
  "hero.title.line2": "A New Era of Taste.",
  "hero.lede":
    "Traditional Vietnamese heritage re-imagined through a neo-modern Asian lens where slow-simmered broths meet engineered precision.",
  "hero.cta.reserve": "Reserve a Table",
  "hero.cta.menu": "View the Menu",
  "hero.scroll": "scroll · enter the kitchen",
  "menu.kicker": "/ collection",
  "menu.db": "menu_db",
  "menu.records": "records",
  "menu.collection": "collection",
  "menu.loaded": "loaded",
  "menu.hint": "// hover any record to preview the dish.",
  "menu.eur": "EUR · incl.",
  "menu.col.khai_vi.label": "APPETIZERS",
  "menu.col.khai_vi.sub": "small plates / to begin",
  "menu.col.mon_chinh.label": "MAIN DISH",
  "menu.col.mon_chinh.sub": "large plates / the core",
  "menu.col.libations.label": "DRINK",
  "menu.col.libations.sub": "the bar",
  "menu.col.soup.label": "SOUP",
  "menu.col.soup.sub": "warm bowls",
  "menu.col.fampam_specialty.label": "FAMPAM SPECIALTY",
  "menu.col.fampam_specialty.sub": "house signatures",
  "reserve.kicker": "/ reservations",
  "reserve.title": "Book a table.",
  "reserve.helper": "Tables released 14 days in advance. We'll confirm by email.",
  "reserve.field.date": "DATE",
  "reserve.field.time": "TIME",
  "reserve.field.party": "PARTY",
  "reserve.guest": "guest",
  "reserve.guests": "guests",
  "reserve.submit": "Confirm reservation",
  "reserve.confirmed": "CONFIRMED",
  "reserve.confirmed.title": "See you soon.",
  "reserve.partyOf": "party of",
  "reserve.edit": "← edit reservation",
  "footer.tagline": "Centuries of flavor. A new era of taste.",
  "footer.visit": "visit",
  "footer.contact": "contact",
  "footer.hours": "Wed–Sun · 17:00 — 23:00",
  "footer.late": "Fri / Sat late · 23:00 — 01:00",
  "footer.built": "built with heritage + heat",
  "footer.status": "SYS · v1.0 · ALL_GREEN",

  "menu.title": "Our highlights",
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
  "footer.delivery": "Delivery Partner",
  "footer.design": "Designed by fampam.",
  "cookie.title": "We value your privacy",
  "cookie.desc": "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies.",
  "cookie.necessary": "Necessary (Always Active)",
  "cookie.analytics": "Analytics",
  "cookie.marketing": "Marketing",
  "cookie.accept": "Accept All",
  "cookie.reject": "Reject All",
  "cookie.prefs": "Preferences",
  "cookie.save": "Save Preferences",
  "cookie.cancel": "Cancel",
};

const vi: Dict = {
  "nav.menu": "Thực đơn",
  "nav.reserve": "Đặt bàn",
  "nav.kitchen": "/ bếp",
  "nav.open": "MỞ CỬA",
  "nav.lang": "Ngôn ngữ",
  "nav.order": "Đặt món",
  "hero.kicker": "THÀNH LẬP · 1972 / TÁI HIỆN · 2024",
  "hero.cities": "Sài Gòn ↔ Tokyo ↔ Seoul",
  "hero.title.line1": "Hương vị truyền đời.",
  "hero.title.line2": "Một kỷ nguyên mới của vị giác.",
  "hero.lede":
    "Di sản ẩm thực Việt được tái hiện qua lăng kính Á Đông tân tiến nơi nồi nước dùng hầm chậm gặp gỡ độ chính xác kỹ thuật.",
  "hero.cta.reserve": "Đặt bàn",
  "hero.cta.menu": "Xem thực đơn",
  "hero.scroll": "cuộn · bước vào bếp",
  "menu.kicker": "/ bộ sưu tập",
  "menu.db": "menu_db",
  "menu.records": "món",
  "menu.collection": "bộ sưu tập",
  "menu.loaded": "đã tải",
  "menu.hint": "// di chuột lên món để xem hình minh họa.",
  "menu.eur": "EUR · gồm thuế",
  "menu.col.khai_vi.label": "KHAI VỊ",
  "menu.col.khai_vi.sub": "khai vị / mở đầu",
  "menu.col.mon_chinh.label": "MÓN CHÍNH",
  "menu.col.mon_chinh.sub": "món chính / trọng tâm",
  "menu.col.libations.label": "ĐỒ UỐNG",
  "menu.col.libations.sub": "quầy bar",
  "menu.col.soup.label": "SÚP",
  "menu.col.soup.sub": "chén súp ấm",
  "menu.col.fampam_specialty.label": "ĐẶC SẢN FAMPAM",
  "menu.col.fampam_specialty.sub": "món ngon độc quyền",
  "reserve.kicker": "/ đặt bàn",
  "reserve.title": "Đặt một bàn.",
  "reserve.helper": "Bàn được mở trước 14 ngày. Chúng tôi sẽ xác nhận qua email.",
  "reserve.field.date": "NGÀY",
  "reserve.field.time": "GIỜ",
  "reserve.field.party": "SỐ KHÁCH",
  "reserve.guest": "khách",
  "reserve.guests": "khách",
  "reserve.submit": "Xác nhận đặt bàn",
  "reserve.confirmed": "ĐÃ XÁC NHẬN",
  "reserve.confirmed.title": "Hẹn gặp lại.",
  "reserve.partyOf": "nhóm",
  "reserve.edit": "← sửa đặt bàn",
  "footer.tagline": "Hương vị truyền đời. Một kỷ nguyên mới của vị giác.",
  "footer.visit": "ghé thăm",
  "footer.contact": "liên hệ",
  "footer.hours": "Thứ 4–CN · 17:00 — 23:00",
  "footer.late": "Thứ 6 / Thứ 7 muộn · 23:00 — 01:00",
  "footer.built": "làm bằng di sản + lửa",
  "footer.status": "SYS · v1.0 · ALL_GREEN",
  "menu.title": "Thực đơn nổi bật",
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
  "footer.delivery": "Đối Tác Giao Hàng",
  "footer.design": "Thiết kế bởi fampam.",
  "cookie.title": "Chúng tôi tôn trọng quyền riêng tư",
  "cookie.desc": "Chúng tôi sử dụng cookie để nâng cao trải nghiệm duyệt web, cá nhân hóa nội dung và phân tích lưu lượng. Bằng cách nhấp vào \"Chấp nhận tất cả\", bạn đồng ý với việc chúng tôi sử dụng cookie.",
  "cookie.necessary": "Cần thiết (Luôn hoạt động)",
  "cookie.analytics": "Phân tích",
  "cookie.marketing": "Tiếp thị",
  "cookie.accept": "Chấp nhận tất cả",
  "cookie.reject": "Từ chối tất cả",
  "cookie.prefs": "Tùy chọn",
  "cookie.save": "Lưu tùy chọn",
  "cookie.cancel": "Hủy",
};

const pl: Dict = {
  "nav.menu": "Menu",
  "nav.reserve": "Rezerwacja",
  "nav.kitchen": "/ kuchnia",
  "nav.open": "OTWARTE",
  "nav.lang": "Język",
  "nav.order": "Zamów",
  "hero.kicker": "ZAŁ. · 1972 / NA NOWO · 2024",
  "hero.cities": "Sajgon ↔ Tokio ↔ Seul",
  "hero.title.line1": "Wieki smaku.",
  "hero.title.line2": "Nowa era doznań.",
  "hero.lede":
    "Wietnamskie dziedzictwo kulinarne odczytane na nowo przez neo-nowoczesny azjatycki obiektyw wolno duszony bulion spotyka inżynieryjną precyzję.",
  "hero.cta.reserve": "Zarezerwuj stolik",
  "hero.cta.menu": "Zobacz menu",
  "hero.scroll": "przewiń · wejdź do kuchni",
  "menu.kicker": "/ kolekcja",
  "menu.db": "menu_db",
  "menu.records": "pozycji",
  "menu.collection": "kolekcja",
  "menu.loaded": "załadowane",
  "menu.hint": "// najedź na pozycję, aby zobaczyć danie.",
  "menu.eur": "EUR · brutto",
  "menu.col.khai_vi.label": "PRZYSTAWKI",
  "menu.col.khai_vi.sub": "przystawki / na początek",
  "menu.col.mon_chinh.label": "DANIA_GŁÓWNE",
  "menu.col.mon_chinh.sub": "dania główne / rdzeń",
  "menu.col.libations.label": "NAPOJE",
  "menu.col.libations.sub": "bar",
  "menu.col.soup.label": "ZUPY",
  "menu.col.soup.sub": "ciepłe miski",
  "menu.col.fampam_specialty.label": "SPECJALNOŚCI FAMPAM",
  "menu.col.fampam_specialty.sub": "nasze podpisy",
  "reserve.kicker": "/ rezerwacje",
  "reserve.title": "Zarezerwuj stolik.",
  "reserve.helper": "Stoliki dostępne na 14 dni naprzód. Potwierdzimy mailem.",
  "reserve.field.date": "DATA",
  "reserve.field.time": "GODZ.",
  "reserve.field.party": "OSÓB",
  "reserve.guest": "osoba",
  "reserve.guests": "osób",
  "reserve.submit": "Potwierdź rezerwację",
  "reserve.confirmed": "POTWIERDZONE",
  "reserve.confirmed.title": "Do zobaczenia.",
  "reserve.partyOf": "stolik na",
  "reserve.edit": "← edytuj rezerwację",
  "footer.tagline": "Wieki smaku. Nowa era doznań.",
  "footer.visit": "odwiedź",
  "footer.contact": "kontakt",
  "footer.hours": "Śr–Nd · 17:00 — 23:00",
  "footer.late": "Pt / Sob późno · 23:00 — 01:00",
  "footer.built": "zbudowane z dziedzictwa + ognia",
  "footer.status": "SYS · v1.0 · ALL_GREEN",
  "menu.title": "Nasze specjały",
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
  "footer.delivery": "Partner Dostawy",
  "footer.design": "Zaprojektowane przez fampam.",
  "cookie.title": "Szanujemy Twoją prywatność",
  "cookie.desc": "Używamy plików cookie, aby poprawić jakość przeglądania, wyświetlać spersonalizowane treści i analizować nasz ruch. Klikając \"Akceptuj wszystkie\", wyrażasz zgodę na używanie plików cookie.",
  "cookie.necessary": "Niezbędne (Zawsze aktywne)",
  "cookie.analytics": "Analityczne",
  "cookie.marketing": "Marketingowe",
  "cookie.accept": "Akceptuj wszystkie",
  "cookie.reject": "Odrzuć wszystkie",
  "cookie.prefs": "Preferencje",
  "cookie.save": "Zapisz preferencje",
  "cookie.cancel": "Anuluj",
};

const de: Dict = {
  "nav.menu": "Karte",
  "nav.reserve": "Reservieren",
  "nav.kitchen": "/ küche",
  "nav.open": "GEÖFFNET",
  "nav.lang": "Sprache",
  "nav.order": "Bestellen",
  "hero.kicker": "GEGR. · 1972 / NEU GEDACHT · 2024",
  "hero.cities": "Saigon ↔ Tokio ↔ Seoul",
  "hero.title.line1": "Jahrhunderte des Geschmacks.",
  "hero.title.line2": "Eine neue Ära des Genusses.",
  "hero.lede":
    "Vietnamesisches Erbe neu interpretiert durch eine neo-moderne asiatische Linse langsam geköchelte Brühen treffen auf konstruierte Präzision.",
  "hero.cta.reserve": "Tisch reservieren",
  "hero.cta.menu": "Karte ansehen",
  "hero.scroll": "scrollen · in die Küche",
  "menu.kicker": "/ kollektion",
  "menu.db": "menu_db",
  "menu.records": "Einträge",
  "menu.collection": "Kollektion",
  "menu.sushi": "Sushi & Rolls",
  "menu.grill": "Grill Spezialität",
  "menu.loaded": "geladen",
  "menu.hint": "// fahren Sie über einen Eintrag, um das Gericht zu sehen.",
  "menu.eur": "EUR · inkl.",
  "menu.col.khai_vi.label": "VORSPEISEN",
  "menu.col.khai_vi.sub": "kleine Teller / zum Auftakt",
  "menu.col.mon_chinh.label": "HAUPTGERICHTE",
  "menu.col.mon_chinh.sub": "Hauptgerichte / der Kern",
  "menu.col.libations.label": "GETRÄNKE",
  "menu.col.libations.sub": "die Bar",
  "menu.col.soup.label": "SUPPEN",
  "menu.col.soup.sub": "warme Schüsseln",
  "menu.col.fampam_specialty.label": "FAMPAM SPEZIALITÄTEN",
  "menu.col.fampam_specialty.sub": "unsere Handschrift",
  "reserve.kicker": "/ reservierungen",
  "reserve.title": "Tisch buchen.",
  "reserve.helper": "Tische werden 14 Tage im Voraus freigegeben. Bestätigung per E-Mail.",
  "reserve.field.date": "DATUM",
  "reserve.field.time": "ZEIT",
  "reserve.field.party": "GÄSTE",
  "reserve.guest": "Gast",
  "reserve.guests": "Gäste",
  "reserve.submit": "Reservierung bestätigen",
  "reserve.confirmed": "BESTÄTIGT",
  "reserve.confirmed.title": "Bis bald.",
  "reserve.partyOf": "Tisch für",
  "reserve.edit": "← Reservierung bearbeiten",
  "footer.tagline": "Jahrhunderte des Geschmacks. Eine neue Ära des Genusses.",
  "footer.visit": "besuchen",
  "footer.contact": "kontakt",
  "footer.hours": "Mi–So · 17:00 — 23:00",
  "footer.late": "Fr / Sa spät · 23:00 — 01:00",
  "footer.built": "gebaut mit Erbe + Hitze",
  "footer.status": "SYS · v1.0 · ALL_GREEN",
  "menu.title": "Unsere Highlights",
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
  "footer.delivery": "Lieferpartner",
  "footer.design": "Entworfen von fampam.",
  "cookie.title": "Wir schätzen Ihre Privatsphäre",
  "cookie.desc": "Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Inhalte bereitzustellen und unseren Datenverkehr zu analysieren. Mit Klick auf \"Alle akzeptieren\" stimmen Sie der Verwendung zu.",
  "cookie.necessary": "Notwendig (Immer aktiv)",
  "cookie.analytics": "Analysen",
  "cookie.marketing": "Marketing",
  "cookie.accept": "Alle akzeptieren",
  "cookie.reject": "Alle ablehnen",
  "cookie.prefs": "Präferenzen",
  "cookie.save": "Präferenzen speichern",
  "cookie.cancel": "Abbrechen",
};

export const translations: Record<Lang, Dict> = { en, vi, pl, de };

// ===== Dish translations (name + desc per dish ID) =====
export interface DishCopy {
  name: string;
  desc: string;
}
export type DishId =
  | "K01" | "K02" | "K03" | "K04" | "K05" | "K06" | "K07" | "K08"
  | "M01" | "M02" | "M03" | "M04" | "M05" | "M06" | "M07" | "M08" | "M09" | "M10"
  | "L01" | "L02" | "L03" | "L04" | "L05" | "L06";

type DishDict = Record<DishId, DishCopy>;

const dishesEn: DishDict = {
  K01: { name: "Charcoal-Blistered Edamame", desc: "Nuoc cham butter, crispy fried shallots, sea salt." },
  K02: { name: "Smoked Duck Summer Rolls", desc: "Rice paper, duck confit, shiso leaf, pickled daikon, hoisin-tamarind emulsion." },
  K03: { name: "Wagyu Beef Carpaccio", desc: "Seared A5 Wagyu, calamansi ponzu, Thai basil oil, toasted rice powder, micro-cilantro." },
  K04: { name: "Crispy Lotus Root Chips", desc: "Hand-sliced lotus root, chili-lime salt, smoked paprika dust." },
  K05: { name: "Green Papaya & Pomelo Salad", desc: "Shaved papaya, pomelo segments, candied cashews, fish-sauce vinaigrette." },
  K06: { name: "Crispy Quail Eggs", desc: "Soy-cured, panko-crusted, smoked chili mayo, micro herbs." },
  K07: { name: "Bone Marrow Bánh Tráng", desc: "Torched marrow, rice cracker, herb salad, nuoc cham gel." },
  K08: { name: "Charred Eggplant Nem", desc: "Smoked aubergine, peanut, perilla, rice paper crisp." },
  M01: { name: "The 48-Hour Neo-Pho", desc: "Clarified bone broth infused with black cardamom and smoked kelp. Flat rice noodles, thinly sliced ribeye, yuzu-chili paste." },
  M02: { name: "Miso-Glazed Cha Ca", desc: "Turmeric and dill marinated black cod over cold matcha vermicelli, peanuts, fermented shrimp aioli." },
  M03: { name: "Lemongrass Sous-Vide Pork Belly", desc: "24-hour slow-cooked pork belly, scallion oil, pickled lotus root, crispy rice galette." },
  M04: { name: "Bánh Mì 2.0", desc: "House-baked rice baguette, seared pork pâté, pickled daikon and carrot, cilantro, jalapeño nam prik." },
  M05: { name: "Claypot Caramelized Prawns", desc: "Tiger prawns, palm-sugar caramel, black pepper, scallion, served bubbling in clay." },
  M06: { name: "Caramel Black Cod Clay", desc: "Palm-sugar braise, ginger threads, scallion oil, single red chili." },
  M07: { name: "Smoked Bún Bò Huế", desc: "Beef shank, lemongrass-chili broth, banana blossom, sawtooth coriander." },
  M08: { name: "Duck Leg Cơm Tấm", desc: "Broken rice, confit duck leg, nuoc cham, pickled mustard greens." },
  M09: { name: "Bamboo Charcoal Bao", desc: "Pulled short rib, hoisin reduction, pickled cucumber, sesame." },
  M10: { name: "Saigon Curry Lobster", desc: "Coconut-turmeric curry, kaffir lime, lobster claw and tail." },
  L01: { name: "Saigon Smoke", desc: "Mezcal, charred pineapple, Thai basil, bird's-eye chili tincture." },
  L02: { name: "The Pho Old Fashioned", desc: "Bourbon washed with toasted star anise and cinnamon, aromatic bitters, burnt orange peel." },
  L03: { name: "Hà Nội Egg Coffee", desc: "Robusta espresso, whipped condensed-milk yolk crema, vanilla bean." },
  L04: { name: "Lemongrass Gimlet", desc: "Gin, lemongrass cordial, lime leaf." },
  L05: { name: "Pandan Highball", desc: "Japanese whisky, pandan syrup, soda, ice spear." },
  L06: { name: "Tamarind Margarita", desc: "Tequila, tamarind, chili-salt rim, dehydrated lime." },
};

const dishesVi: DishDict = {
  K01: { name: "Đậu nành nướng than", desc: "Bơ nước mắm, hành phi giòn, muối biển." },
  K02: { name: "Gỏi cuốn vịt xông khói", desc: "Bánh tráng, vịt confit, lá tía tô, củ cải muối, sốt hoisin-me." },
  K03: { name: "Bò Wagyu Carpaccio", desc: "Wagyu A5 áp chảo, ponzu calamansi, dầu húng quế Thái, cơm rang giã, ngò non." },
  K04: { name: "Củ sen chiên giòn", desc: "Củ sen thái tay, muối ớt chanh, ớt bột xông khói." },
  K05: { name: "Gỏi đu đủ bưởi", desc: "Đu đủ bào, múi bưởi, hạt điều rang đường, sốt nước mắm." },
  K06: { name: "Trứng cút chiên giòn", desc: "Tẩm xì dầu, lăn panko, mayo ớt xông khói, rau thơm." },
  K07: { name: "Tủy bò bánh tráng", desc: "Tủy bò nướng, bánh tráng giòn, rau sống, gel nước mắm." },
  K08: { name: "Cà tím nướng cuốn", desc: "Cà tím xông khói, đậu phộng, lá tía tô, bánh tráng giòn." },
  M01: { name: "Phở Tân Thời 48 giờ", desc: "Nước dùng xương trong, thảo quả đen, tảo bẹ xông khói. Bánh phở dẹt, thăn bò thái mỏng, tương yuzu ớt." },
  M02: { name: "Chả Cá tẩm miso", desc: "Cá tuyết đen ướp nghệ và thì là, bún matcha lạnh, đậu phộng, sốt mắm tôm lên men." },
  M03: { name: "Ba chỉ heo sous-vide sả", desc: "Ba chỉ nấu chậm 24 giờ, mỡ hành, củ sen muối, bánh cơm cháy giòn." },
  M04: { name: "Bánh Mì 2.0", desc: "Bánh mì gạo nướng nhà làm, pâté heo áp chảo, đồ chua, ngò, nam prik ớt." },
  M05: { name: "Tôm rim niêu đất", desc: "Tôm sú, đường thốt nốt cháy, tiêu đen, hành lá, nóng hổi trong niêu đất." },
  M06: { name: "Cá tuyết đen kho tộ", desc: "Đường thốt nốt kho rim, gừng sợi, mỡ hành, ớt đỏ." },
  M07: { name: "Bún Bò Huế xông khói", desc: "Bắp bò, nước dùng sả ớt, hoa chuối, ngò gai." },
  M08: { name: "Cơm Tấm đùi vịt", desc: "Cơm tấm, đùi vịt confit, nước mắm, dưa cải muối." },
  M09: { name: "Bánh Bao Than Tre", desc: "Sườn bò xé, sốt hoisin, dưa leo muối, mè rang." },
  M10: { name: "Tôm hùm cà ri Sài Gòn", desc: "Cà ri dừa nghệ, lá chanh kaffir, càng và đuôi tôm hùm." },
  L01: { name: "Khói Sài Gòn", desc: "Mezcal, dứa nướng, húng quế Thái, tinh dầu ớt hiểm." },
  L02: { name: "Phở Old Fashioned", desc: "Bourbon ngâm hồi và quế rang, bitters thơm, vỏ cam đốt." },
  L03: { name: "Cà phê trứng Hà Nội", desc: "Espresso Robusta, kem trứng sữa đặc đánh bông, vanilla." },
  L04: { name: "Gimlet Sả", desc: "Gin, syrup sả, lá chanh." },
  L05: { name: "Highball Lá Dứa", desc: "Whisky Nhật, syrup lá dứa, soda, đá thanh." },
  L06: { name: "Margarita Me", desc: "Tequila, me, viền muối ớt, chanh khô." },
};

const dishesPl: DishDict = {
  K01: { name: "Edamame z węgla drzewnego", desc: "Masło nuoc cham, chrupiąca smażona szalotka, sól morska." },
  K02: { name: "Sajgonki z wędzoną kaczką", desc: "Papier ryżowy, confit z kaczki, liść shiso, marynowana rzodkiew, emulsja hoisin-tamaryndowa." },
  K03: { name: "Carpaccio z wołowiny Wagyu", desc: "Opalane Wagyu A5, ponzu calamansi, olej z bazylii tajskiej, prażony ryż, mikro kolendra." },
  K04: { name: "Chipsy z korzenia lotosu", desc: "Krojony ręcznie korzeń lotosu, sól chili-limonkowa, wędzona papryka." },
  K05: { name: "Sałatka z papai i pomelo", desc: "Strugana papaja, pomelo, kandyzowane orzechy nerkowca, sos rybny." },
  K06: { name: "Chrupiące jajka przepiórcze", desc: "Marynowane w soi, panierowane w panko, majonez z wędzonym chili." },
  K07: { name: "Szpik wołowy bánh tráng", desc: "Opalany szpik, krakers ryżowy, sałatka ziołowa, żel nuoc cham." },
  K08: { name: "Opalany bakłażan nem", desc: "Wędzony bakłażan, orzeszki ziemne, perilla, chrupki ryżowe." },
  M01: { name: "48-godzinne Neo-Pho", desc: "Klarowny bulion kostny z czarnym kardamonem i wędzonymi wodorostami. Płaskie kluski ryżowe, plastry rostbefu, pasta yuzu-chili." },
  M02: { name: "Cha Ca w glazurze miso", desc: "Czarny dorsz w kurkumie i koperku na zimnym makaronie matcha, orzeszki, fermentowane aioli krewetkowe." },
  M03: { name: "Boczek sous-vide z trawą cytrynową", desc: "24-godzinny boczek, olej z dymki, marynowany lotos, chrupiący placek ryżowy." },
  M04: { name: "Bánh Mì 2.0", desc: "Domowa bagietka ryżowa, pasztet wieprzowy, marynowana rzodkiew i marchew, kolendra, nam prik z jalapeño." },
  M05: { name: "Krewetki w karmelu", desc: "Krewetki tygrysie, karmel z cukru palmowego, czarny pieprz, dymka, w glinianym garnku." },
  M06: { name: "Czarny dorsz w karmelu", desc: "Duszony w cukrze palmowym, imbir, olej z dymki, czerwone chili." },
  M07: { name: "Wędzone Bún Bò Huế", desc: "Pręga wołowa, bulion z trawy cytrynowej i chili, kwiat banana, kolendra piłkowana." },
  M08: { name: "Cơm Tấm z udkiem kaczki", desc: "Łamany ryż, confit z kaczki, nuoc cham, marynowana gorczyca." },
  M09: { name: "Bao z węglem bambusowym", desc: "Szarpane żeberka, redukcja hoisin, marynowany ogórek, sezam." },
  M10: { name: "Homar w curry Saigon", desc: "Curry kokosowo-kurkumowe, liść kaffir, szczypce i ogon homara." },
  L01: { name: "Dym Saigon", desc: "Mezcal, opalany ananas, bazylia tajska, nalewka z chili." },
  L02: { name: "Pho Old Fashioned", desc: "Bourbon płukany prażonym anyżem i cynamonem, aromatyczne bitters, opalona skórka pomarańczy." },
  L03: { name: "Hanojska kawa jajeczna", desc: "Espresso Robusta, ubita pianka żółtkowa z mlekiem skondensowanym, wanilia." },
  L04: { name: "Gimlet z trawą cytrynową", desc: "Gin, kordiał z trawy cytrynowej, liść limonki." },
  L05: { name: "Highball Pandan", desc: "Japońska whisky, syrop pandan, soda, lodowa włócznia." },
  L06: { name: "Tamarynda Margarita", desc: "Tequila, tamaryndowiec, sól chili na rancie, suszona limonka." },
};

const dishesDe: DishDict = {
  K01: { name: "Edamame vom Holzkohlefeuer", desc: "Nuoc-Cham-Butter, knusprige Schalotten, Meersalz." },
  K02: { name: "Sommerrollen mit geräucherter Ente", desc: "Reispapier, Entenconfit, Shiso, eingelegter Daikon, Hoisin-Tamarinden-Emulsion." },
  K03: { name: "Wagyu-Carpaccio", desc: "Angebratenes A5 Wagyu, Calamansi-Ponzu, Thai-Basilikumöl, geröstetes Reispulver, Mikro-Koriander." },
  K04: { name: "Knusprige Lotuswurzel-Chips", desc: "Handgeschnittene Lotuswurzel, Chili-Limetten-Salz, geräucherter Paprika." },
  K05: { name: "Grüne Papaya & Pomelo Salat", desc: "Geraspelte Papaya, Pomelo, kandierte Cashews, Fischsauce-Vinaigrette." },
  K06: { name: "Knusprige Wachteleier", desc: "Sojagebeizt, Panko, geräucherte Chili-Mayo, Mikro-Kräuter." },
  K07: { name: "Knochenmark Bánh Tráng", desc: "Flambiertes Mark, Reiscracker, Kräutersalat, Nuoc-Cham-Gel." },
  K08: { name: "Geflämmte Aubergine Nem", desc: "Geräucherte Aubergine, Erdnuss, Perilla, Reispapier-Crisp." },
  M01: { name: "48-Stunden Neo-Pho", desc: "Geklärte Knochenbrühe mit schwarzem Kardamom und geräuchertem Seetang. Flache Reisnudeln, dünn geschnittenes Ribeye, Yuzu-Chili-Paste." },
  M02: { name: "Miso-glasierter Cha Ca", desc: "In Kurkuma und Dill marinierter Schwarzer Kabeljau auf kalten Matcha-Glasnudeln, Erdnüsse, fermentierte Garnelen-Aioli." },
  M03: { name: "Schweinebauch sous-vide mit Zitronengras", desc: "24 Stunden langsam gegart, Frühlingszwiebelöl, eingelegte Lotuswurzel, knusprige Reisgalette." },
  M04: { name: "Bánh Mì 2.0", desc: "Hausgebackenes Reis-Baguette, angebratene Schweinepastete, eingelegter Daikon und Karotte, Koriander, Jalapeño-Nam-Prik." },
  M05: { name: "Karamellgarnelen im Tontopf", desc: "Tigergarnelen, Palmzucker-Karamell, schwarzer Pfeffer, Frühlingszwiebel, brodelnd im Ton serviert." },
  M06: { name: "Karamell-Kabeljau Tontopf", desc: "Palmzucker-Schmorbraten, Ingwerfäden, Frühlingszwiebelöl, einzelne rote Chili." },
  M07: { name: "Geräucherte Bún Bò Huế", desc: "Rinderhaxe, Zitronengras-Chili-Brühe, Bananenblüte, Sägezahn-Koriander." },
  M08: { name: "Entenkeule Cơm Tấm", desc: "Bruchreis, Entenconfit, Nuoc Cham, eingelegter Senfkohl." },
  M09: { name: "Bambuskohle Bao", desc: "Pulled Short Rib, Hoisin-Reduktion, eingelegte Gurke, Sesam." },
  M10: { name: "Saigon Curry Hummer", desc: "Kokos-Kurkuma-Curry, Kaffir-Limette, Hummerschere und Schwanz." },
  L01: { name: "Saigon Smoke", desc: "Mezcal, geflämmte Ananas, Thai-Basilikum, Vogelaugen-Chili-Tinktur." },
  L02: { name: "Pho Old Fashioned", desc: "Mit geröstetem Sternanis und Zimt gewaschener Bourbon, aromatische Bitters, geflämmte Orangenschale." },
  L03: { name: "Hanoier Eierkaffee", desc: "Robusta-Espresso, geschlagene Eigelb-Kondensmilch-Crema, Vanille." },
  L04: { name: "Zitronengras Gimlet", desc: "Gin, Zitronengras-Cordial, Limettenblatt." },
  L05: { name: "Pandan Highball", desc: "Japanischer Whisky, Pandan-Sirup, Soda, Eisspeer." },
  L06: { name: "Tamarinden Margarita", desc: "Tequila, Tamarinde, Chili-Salz-Rand, getrocknete Limette." },
};

export const dishCopy: Record<Lang, DishDict> = {
  en: dishesEn,
  vi: dishesVi,
  pl: dishesPl,
  de: dishesDe,
};
