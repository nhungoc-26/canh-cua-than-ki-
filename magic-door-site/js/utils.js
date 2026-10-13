/* ==========================================================================
   utils.js — tiện ích và trạng thái dùng chung cho các file JS khác
   ========================================================================== */

/** Lấy phần tử theo CSS selector */
const $ = (selector) => document.querySelector(selector);

/** Số ngẫu nhiên trong khoảng [min, max) */
const rand = (min, max) => min + Math.random() * (max - min);

/** Chọn ngẫu nhiên một phần tử trong mảng */
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** Chạy hàm sau một khoảng thời gian (ms) — viết ngược cho dễ đọc timeline */
const after = (ms, fn) => setTimeout(fn, ms);

/** Chờ một khoảng thời gian (ms): dùng với await để viết timeline từ trên xuống dưới */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Trạng thái chung giữa các file */
const state = {
  hue: 22,        // màu ánh sáng ma thuật (độ màu HSL)
  hueDir: 1,      // chiều lệch màu của các hạt sáng (1 hoặc -1)
  pull: false,    // true khi hạt sáng đang bị hút vào cửa
  busy: false,    // true khi đang chạy hiệu ứng mở cửa
  lastIndex: -1,  // chỉ số điểm đến vừa hiện (để không lặp liền nhau)
};
