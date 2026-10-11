/* ==========================================================================
   destinations.js — danh sách điểm đến (thêm / sửa / xóa tại đây)

   Mỗi điểm đến gồm:
     name, place     tên và nơi chốn hiển thị
     type            'karst' (đảo đá trên biển) hoặc 'ridge' (dãy núi)
     sky             màu bầu trời: top (trên) → bottom (sát chân trời)
     sun             vị trí x, y (0..1) và màu mặt trời / mặt trăng
     layers          màu lớp núi xa (far) → gần (near)
     water           (tuỳ chọn) màu mặt nước; không có = cảnh trên đất liền
     night           (tuỳ chọn) true = cảnh ban đêm có sao
     terraces        (tuỳ chọn) true = vẽ ruộng bậc thang
     season          mùa đẹp nhất;  activity  hoạt động gợi ý;  desc  mô tả
   ========================================================================== */

const DESTINATIONS = [
  {
    name: 'Vịnh Hạ Long',
    place: 'Quảng Ninh · Việt Nam',
    type: 'karst',
    sky: { top: '#2b3566', bottom: '#ffb98a' },
    sun: { x: 0.55, y: 0.5, color: '#ffe1b0' },
    layers: { far: '#8a7a9c', near: '#1b2144' },
    water: '#25365f',
    season: 'Tháng 9 – 11',
    activity: 'Du thuyền · Kayak',
    desc: 'Hàng nghìn đảo đá vôi nhô lên từ làn nước ngọc bích. Chèo kayak giữa sương sớm, rồi ngủ đêm trên du thuyền dưới bầu trời đầy sao.',
  },
  {
    name: 'El Nido',
    place: 'Palawan · Philippines',
    type: 'karst',
    sky: { top: '#14527a', bottom: '#ffd9a0' },
    sun: { x: 0.3, y: 0.55, color: '#fff0b8' },
    layers: { far: '#79b5a8', near: '#0e4b49' },
    water: '#0e7f93',
    season: 'Tháng 11 – 5',
    activity: 'Đảo hoang · Lặn biển',
    desc: 'Những vách đá phủ xanh bao quanh các đầm nước trong như pha lê. Hành trình nhảy đảo ở đây sẽ khiến bạn quên mất thời gian.',
  },
  {
    name: 'Sa Pa',
    place: 'Lào Cai · Việt Nam',
    type: 'ridge',
    terraces: true,
    sky: { top: '#6fa6c9', bottom: '#fbe9cf' },
    sun: { x: 0.75, y: 0.4, color: '#fff6d8' },
    layers: { far: '#a9c3b8', near: '#2c4a2a' },
    season: 'Tháng 9 – 10',
    activity: 'Ruộng bậc thang · Trekking',
    desc: 'Ruộng bậc thang uốn lượn trong biển mây, mùa lúa chín vàng cả thung lũng. Đi bộ qua các bản làng và uống ly trà nóng giữa sương.',
  },
  {
    name: 'Dolomites',
    place: 'Nam Tyrol · Ý',
    type: 'ridge',
    sky: { top: '#3a2f5b', bottom: '#f2a38f' },
    sun: { x: 0.5, y: 0.58, color: '#ffd2a1' },
    layers: { far: '#b79fb3', near: '#2a2236' },
    season: 'Tháng 6 – 9',
    activity: 'Hiking · Nhà gỗ trên núi',
    desc: 'Những đỉnh núi đá nhuộm hồng lúc hoàng hôn, các con đường mòn dẫn qua đồng cỏ và nhà gỗ nhỏ. Thiên đường của người yêu núi.',
  },
  {
    name: 'Lofoten',
    place: 'Nordland · Na Uy',
    type: 'ridge',
    night: true,
    sky: { top: '#050b24', bottom: '#2a4a7a' },
    sun: { x: 0.72, y: 0.2, color: '#e6f4ff' },
    layers: { far: '#2b4466', near: '#050a18' },
    water: '#07102a',
    season: 'Tháng 9 – 3',
    activity: 'Săn cực quang · Làng chài',
    desc: 'Quần đảo đá dựng đứng giữa biển Bắc, những làng chài đỏ lặng lẽ dưới ánh trăng. Đêm đẹp trời, cực quang sẽ múa trên đầu bạn.',
  },
  {
    name: 'Hồ Kawaguchi',
    place: 'Yamanashi · Nhật Bản',
    type: 'ridge',
    sky: { top: '#f7b3c8', bottom: '#fff2e0' },
    sun: { x: 0.3, y: 0.35, color: '#ffffff' },
    layers: { far: '#c7b3d6', near: '#4a3b6e' },
    water: '#6d7fb0',
    season: 'Tháng 4 · Tháng 11',
    activity: 'Ngắm núi Phú Sĩ · Onsen',
    desc: 'Mặt hồ phẳng lặng soi bóng bình minh hồng nhạt, mùa xuân có hoa anh đào, mùa thu có lá đỏ. Ngâm onsen sau một ngày dạo quanh hồ.',
  },
];
