/* ==========================================================================
   circle.js — vòng tròn phép thuật NGẪU NHIÊN hiện trong cổng khi mở cửa
   (hiện xong, nổ sáng rồi mới lộ ra điểm đến)

   Mỗi lần mở cửa, hình được ghép ngẫu nhiên từ các lớp:
     1. vành ngoài (+ vạch chia nhỏ)      4. vành trong + đa giác xoay ngược
     2. vành chữ rune                     5. quả cầu năng lượng quay quanh
     3. ngôi sao nhiều cánh               6. biểu tượng ở tâm (hoa / mắt / cầu)
   Màu, số cánh, số rune, tốc độ quay... đều ngẫu nhiên.
   Hiệu ứng vẽ nét, quay, tụ sáng, nổ sáng nằm trong css/door.css (mục 4).
   ========================================================================== */

/** Các tông màu phép thuật (độ màu HSL): vàng, hổ phách, hồng, tím, xanh băng, lục */
const MAGIC_HUES = [42, 28, 335, 275, 195, 160];

/** Toạ độ điểm trên đường tròn: bán kính r, góc deg (0° ở đỉnh, chiều kim đồng hồ) */
function polar(r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}

/** Làm tròn 2 chữ số cho gọn chuỗi SVG */
const num = (n) => n.toFixed(2);

/** Một "rune" ngẫu nhiên: nét đứng + vài nhánh xiên.
 *  Tự vẽ bằng nét nên không phụ thuộc font chữ của máy. */
function runeGlyph(size) {
  let d = `M0 ${-size}V${size}`;
  const branches = Math.floor(rand(1, 4));

  for (let i = 0; i < branches; i++) {
    const y = pick([-size, -size / 3, size / 3, size]);
    const side = pick([-1, 1]);
    const dy = pick([-1, 1]) * rand(0.4, 0.9) * size;
    d += `M0 ${num(y)}L${num(side * rand(0.5, 0.9) * size)} ${num(y + dy)}`;
  }
  return d;
}

/** Đường nối các đỉnh của đa giác n cạnh: bước k = 1 là đa giác, k >= 2 là ngôi sao */
function starPath(n, k, radius, rotation = 0) {
  const points = Array.from({ length: n }, (_, i) => polar(radius, rotation + (i * 360) / n));
  let d = '';

  for (let i = 0; i < n; i++) {
    const a = points[i];
    const b = points[(i + k) % n];
    d += `M${num(a[0])} ${num(a[1])}L${num(b[0])} ${num(b[1])}`;
  }
  return { d, points };
}

/** Tạo chuỗi SVG của một vòng tròn phép thuật mới */
function buildMagicCircle(hue) {
  const hue2 = hue + pick([-40, 40, 60]);   // màu phụ

  // Thời điểm bắt đầu vẽ lớp kế tiếp (giây) — mỗi lớp vẽ sau lớp trước một chút
  let t = 0.7;
  const at = (duration = 1.1, advance = true) => {
    const style = `--delay:${t.toFixed(2)}s;--dur:${duration}s`;
    if (advance) t += rand(0.2, 0.3);
    return style;
  };

  /** Bọc nội dung trong nhóm quay quanh tâm, tốc độ và chiều quay ngẫu nhiên */
  const spin = (inner, seconds) =>
    `<g class="mc-spin" style="animation-duration:${seconds.toFixed(1)}s;` +
    `animation-direction:${pick(['normal', 'reverse'])}">${inner}</g>`;

  /** Vòng tròn được "vẽ" dần ra */
  const ring = (r, width, cls = '') =>
    `<circle class="mc-draw ${cls}" pathLength="1" r="${r}" stroke-width="${width}" style="${at()}"/>`;

  const parts = [];

  // 1. Vành ngoài, thỉnh thoảng có thêm vạch chia nhỏ
  parts.push(ring(96, 1.6), ring(92, 0.6, 'alt'));

  if (Math.random() < 0.7) {
    const ticks = pick([48, 72, 96, 120]);
    const gap = (2 * Math.PI * 88) / ticks - 0.8;
    parts.push(spin(
      `<circle class="mc-fade" r="88" stroke-width="2.4" stroke-dasharray="0.8 ${num(gap)}" style="${at()}"/>`,
      rand(60, 120)
    ));
  }

  // 2. Vành chữ rune
  {
    const count = pick([12, 16, 20, 24]);
    const size = rand(3.6, 4.6);
    let runes = '';

    for (let i = 0; i < count; i++) {
      runes += `<path d="${runeGlyph(size)}" transform="rotate(${num((i * 360) / count)}) translate(0 -80)"/>`;
    }
    parts.push(
      ring(86, 0.8),
      ring(74, 0.8),
      spin(`<g class="mc-fade alt" stroke-width="1.1" style="${at(0.9)}">${runes}</g>`, rand(70, 130))
    );
  }

  // 3. Ngôi sao nhiều cánh + chấm ở các đỉnh
  {
    const n = pick([5, 6, 7, 8, 9, 10, 12]);
    const k = pick(Array.from({ length: Math.floor((n - 1) / 2) - 1 }, (_, i) => i + 2));
    const { d, points } = starPath(n, k, 70);
    const dots = points
      .map((p) => `<circle class="solid" r="1.7" cx="${num(p[0])}" cy="${num(p[1])}"/>`)
      .join('');

    parts.push(
      ring(70, 1.2),
      spin(
        `<path class="mc-draw" pathLength="1" d="${d}" stroke-width="1.1" style="${at(1.6)}"/>` +
        `<g class="mc-fade" style="${at(0.8)}">${dots}</g>`,
        rand(50, 100)
      )
    );
  }

  // 4. Vành trong + hai đa giác lồng nhau tạo thành ngôi sao
  {
    const sides = pick([3, 4, 5, 6]);
    const shape = starPath(sides, 1, 40).d + starPath(sides, 1, 40, 180 / sides).d;

    parts.push(
      ring(52, 0.5, 'alt'),
      ring(46, 1),
      spin(
        `<path class="mc-draw alt" pathLength="1" d="${shape}" stroke-width="1" style="${at(1.2)}"/>`,
        rand(30, 70)
      )
    );
  }

  // 5. Quả cầu năng lượng quay quanh vòng tròn
  for (let i = 0, orbs = pick([2, 3, 4]); i < orbs; i++) {
    const [x, y] = polar(pick([58, 64, 78, 90]), rand(0, 360));
    parts.push(spin(
      `<circle class="solid2 mc-fade" r="${num(rand(2, 3.2))}" cx="${num(x)}" cy="${num(y)}" style="${at(0.6, false)}"/>`,
      rand(8, 22)
    ));
  }

  // 6. Biểu tượng ở tâm
  {
    const kind = pick(['flower', 'eye', 'orb']);
    let center = '';

    if (kind === 'flower') {
      const petals = pick([5, 6, 8, 10]);
      for (let i = 0; i < petals; i++) {
        center += `<path class="soft" d="M0 0Q9 -11 0 -26Q-9 -11 0 0Z" transform="rotate(${num((i * 360) / petals)})"/>`;
      }
      center += '<circle class="solid" r="4"/>';
    } else if (kind === 'eye') {
      center =
        '<path class="soft" d="M-26 0Q0 -18 26 0Q0 18 -26 0Z"/>' +
        '<circle r="8"/><circle class="solid" r="3.2"/>';
    } else {
      center =
        '<circle class="soft" r="22"/><circle r="15"/><circle r="8"/>' +
        '<path d="M-27 0H27M0 -27V27" stroke-width="0.6"/><circle class="solid" r="2.6"/>';
    }
    parts.push(spin(`<g class="mc-fade" style="${at(1)}">${center}</g>`, rand(40, 90)));
  }

  // Ánh sáng nền toả ra từ tâm
  const glow =
    `<defs><radialGradient id="mcg">` +
    `<stop offset="0" stop-color="hsl(${hue} 95% 62%)" stop-opacity=".4"/>` +
    `<stop offset=".7" stop-color="hsl(${hue} 95% 55%)" stop-opacity=".1"/>` +
    `<stop offset="1" stop-color="hsl(${hue} 95% 55%)" stop-opacity="0"/>` +
    `</radialGradient></defs>` +
    `<circle class="mc-fade" r="100" fill="url(#mcg)" stroke="none" style="--delay:.4s"/>`;

  return `<svg class="mc" viewBox="-100 -100 200 200" aria-hidden="true" ` +
         `style="--mc:hsl(${hue} 95% 72%);--mc2:hsl(${hue2} 95% 78%)">${glow}${parts.join('')}</svg>`;
}

/** Tạo vòng tròn mới trong cổng và đổi toàn bộ ánh sáng của trang theo màu của nó */
function startMagicCircle() {
  const hue = pick(MAGIC_HUES);

  state.hue = hue;
  state.hueDir = pick([1, -1]);
  document.documentElement.style.setProperty('--h', hue);
  $('#mcircle').innerHTML = buildMagicCircle(hue);
}

/** Xoá vòng tròn (khi quay về trang đầu) */
function clearMagicCircle() {
  $('#mcircle').innerHTML = '';
}
