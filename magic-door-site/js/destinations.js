/* ==========================================================================
   destinations.js — danh sách điểm đến (thêm / sửa / xóa tại đây)

   Mỗi điểm đến gồm:
     name     tên hiển thị
     image    ảnh thật trong thư mục assets/ (tên file giữ nguyên, có dấu cũng được).
              Có thể là một danh sách tên, vd ['assets/images/a', 'assets/images/b']:
              trang sẽ thử lần lượt cho đến khi tìm thấy ảnh.
     desc     mô tả ngắn

   Tuỳ chọn:
     place      dòng nhỏ dưới tên, vd 'Quảng Ninh · Việt Nam'
     season     mùa đẹp nhất;  activity  hoạt động gợi ý (hiện thành 2 nhãn nhỏ)

   Nếu ảnh không tải được, trang tự vẽ một phong cảnh SVG thay thế
   (có thể chỉnh màu bằng: sky, sun, layers, water, night, terraces, type).
   ========================================================================== */

const DESTINATIONS = [
  {
    name: 'Hà Nội',
    image: 'assets/images/Hà Nội',
    desc: 'Thủ đô nghìn năm văn hiến, nổi bật với những con phố cổ, di tích lịch sử và ẩm thực đặc sắc.',
  },
  {
    name: 'Tokyo',
    image: 'assets/images/tokyo',
    desc: 'Nổi bật với ánh đèn đô thị, những con phố đông đúc và sự kết hợp giữa nét đẹp truyền thống và hiện đại.',
  },
  {
    name: 'London',
    image: 'assets/images/Lon_Don',
    desc: 'Một trong những thành phố nổi tiếng nhất châu Âu, hấp dẫn bởi lịch sử, nghệ thuật và nền văn hóa phong phú.',
  },
  {
    name: 'Thượng Hải',
    image: 'assets/images/thuonghai',
    desc: 'Thành phố không ngủ với những con phố sầm uất, trung tâm mua sắm và khung cảnh lung linh về đêm.',
  },
  {
    name: 'Hàng Châu',
    image: 'assets/images/hangchau',
    desc: 'Một điểm đến nổi tiếng của Trung Quốc, hấp dẫn bởi phong cảnh hữu tình và nền văn hóa lâu đời.',
  },
  {
    name: 'Thụy Sĩ',
    image: 'assets/images/thuysy',
    desc: 'Quốc gia mang vẻ đẹp thanh bình, nổi bật với thiên nhiên hùng vĩ và những thị trấn cổ kính.',
  },
  {
    name: 'Paris',
    image: 'assets/images/phap',
    desc: 'Thủ đô nước Pháp, nổi tiếng với Tháp Eiffel, dòng sông Seine và những đại lộ tuyệt đẹp.',
  },
  {
    name: 'Kim Tự Tháp',
    image: 'assets/images/kimtuthap',
    desc: 'Biểu tượng cổ đại của Ai Cập, nổi bật với kiến trúc kỳ vĩ và vẻ đẹp huyền bí.',
  },
  {
    name: 'Bắc Cực',
    image: 'assets/images/bắc cực',
    desc: 'Vùng đất Bắc Cực hoang sơ nổi tiếng với những tảng băng khổng lồ, sông băng và những vịnh hẹp tuyệt đẹp.',
  },
  {
    name: 'Bangkok',
    image: 'assets/images/bangkok',
    desc: 'Nổi tiếng với những ngôi chùa mang nét kiến trúc độc đáo, cung điện cổ kính và những khu phố nhộn nhịp.',
  },
  {
    name: 'Canada',
    image: 'assets/images/canada',
    desc: 'Một điểm đến lý tưởng cho những ai yêu thích thiên nhiên, thích khám phá núi rừng và trải nghiệm bầu không khí trong lành.',
  },
  {
    name: 'Đà Lạt',
    image: 'assets/images/dalat',
    desc: 'Thành phố ngàn hoa nổi tiếng với khí hậu mát mẻ, những đồi thông xanh và khung cảnh thơ mộng.',
  },
  {
    name: 'Đà Nẵng',
    image: 'assets/images/danang',
    desc: 'Thành phố trẻ và hiện đại, nổi bật với cảnh biển tuyệt đẹp cùng những công trình kiến trúc độc đáo.',
  },
  {
    name: 'Hà Giang',
    image: 'assets/images/hagiang',
    desc: 'Một điểm đến đầy ấn tượng với những cung đường đèo uốn lượn giữa núi rừng, dòng sông xanh và cảnh quan thiên nhiên hùng vĩ.',
  },
  {
    name: 'Úc',
    image: 'assets/images/úc',
    desc: 'Sở hữu nhiều địa danh ấn tượng như Nhà hát Opera Sydney, Great Barrier Reef và những vùng đất hoang sơ rộng lớn.',
  },
  {
    name: 'Seoul',
    image: 'assets/images/seoul',
    desc: 'Điểm đến hấp dẫn dành cho những ai yêu thích văn hóa, ẩm thực, thời trang và không khí sôi động.',
  },
  {
    name: 'Berlin',
    image: 'assets/images/berlin',
    desc: 'Thành phố sôi động với nghệ thuật đường phố, văn hóa đa dạng và nhiều địa danh gắn liền với lịch sử châu Âu.',
  },
  {
    name: 'Mỹ',
    image: 'assets/images/mỹ',
    desc: 'Nổi bật với sự đa dạng về cảnh quan và văn hóa, từ những đô thị nhộn nhịp đến các vùng thiên nhiên rộng lớn.',
  },
  {
    name: 'Singapore',
    image: ['assets/images/singaporee', 'assets/images/singapore'],
    desc: 'Quốc đảo hiện đại nổi tiếng với những công trình kiến trúc độc đáo, không gian xanh và nhịp sống sôi động.',
  },
  {
    name: 'Hong Kong',
    image: 'assets/images/hongkong',
    desc: 'Một điểm đến sôi động với các khu mua sắm, chợ truyền thống, nhà hàng và những góc phố mang đậm nét văn hóa địa phương.',
  },
];
