const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

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

// Inject into vi
content = content.replace(
  '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n};\n\nconst pl: Dict = {', 
  '  "footer.status": "SYS · v1.0 · ALL_GREEN",\n' + viDict + '};\n\nconst pl: Dict = {'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed vi translations');
