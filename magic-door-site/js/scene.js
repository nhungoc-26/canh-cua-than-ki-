/* ==========================================================================
   scene.js — vẽ phong cảnh điểm đến bằng SVG
   Không cần ảnh ngoài: bầu trời, mặt trời, núi, đảo đá và mặt nước
   đều được sinh ra bằng code, mỗi lần vẽ sẽ hơi khác nhau.
   ========================================================================== */

const SCENE_W = 1600;
const SCENE_H = 900;

/** Trộn hai màu hex (#rrggbb) theo tỉ lệ t từ 0 đến 1 */
function mixColor(a, b, t) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
  const colorA = parse(a);
  const colorB = parse(b);
  return '#' + colorA
    .map((v, i) => Math.round(v + (colorB[i] - v) * t).toString(16).padStart(2, '0'))
    .join('');
}

/** Sinh đường núi lượn sóng (cộng 3 sóng sin ngẫu nhiên) → mảng điểm [x, y] */
function ridgePoints(baseY, amplitude) {
  const freq = [rand(0.004, 0.008), rand(0.012, 0.02), rand(0.03, 0.05)];
  const phase = [rand(0, 6.3), rand(0, 6.3), rand(0, 6.3)];
  const points = [];

  for (let x = 0; x <= SCENE_W; x += 16) {
    const wave =
      Math.sin(x * freq[0] + phase[0]) * 0.55 +
      Math.sin(x * freq[1] + phase[1]) * 0.3 +
      Math.sin(x * freq[2] + phase[2]) * 0.15;
    points.push([x, Math.round(baseY - amplitude * (0.5 + 0.5 * wave))]);
  }
  return points;
}

/** Dải sương mỏng phủ ngang */
const fogBand = (y, height, opacity) =>
  `<rect y="${y}" width="${SCENE_W}" height="${height}" fill="url(#fog)" opacity="${opacity}"/>`;

/* --- Các thành phần của cảnh ------------------------------------------------ */

function sceneDefs(d) {
  const waterColor = d.water || '#000000';
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${d.sky.top}"/>
        <stop offset="1" stop-color="${d.sky.bottom}"/>
      </linearGradient>
      <radialGradient id="sunGlow">
        <stop offset="0"   stop-color="${d.sun.color}"/>
        <stop offset=".25" stop-color="${d.sun.color}" stop-opacity=".55"/>
        <stop offset="1"   stop-color="${d.sun.color}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${mixColor(d.sky.bottom, waterColor, 0.5)}"/>
        <stop offset="1" stop-color="${waterColor}"/>
      </linearGradient>
      <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0"  stop-color="#fff" stop-opacity="0"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".35"/>
        <stop offset="1"  stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>`;
}

function sceneStars(horizon) {
  let out = '';
  for (let i = 0; i < 90; i++) {
    out += `<circle cx="${rand(0, SCENE_W)}" cy="${rand(0, horizon * 0.8)}" ` +
           `r="${rand(0.4, 1.6)}" fill="#fff" opacity="${rand(0.3, 0.9)}"/>`;
  }
  return out;
}

/** Mặt trời (hoặc mặt trăng nếu cảnh ban đêm) + quầng sáng */
function sceneSun(d) {
  const cx = d.sun.x * SCENE_W;
  const cy = d.sun.y * SCENE_H;
  const radius = d.night ? 34 : 46;
  return `<circle cx="${cx}" cy="${cy}" r="320" fill="url(#sunGlow)"/>` +
         `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${d.sun.color}"/>`;
}

/** Mặt nước + vệt phản chiếu mặt trời */
function sceneWater(d, horizon) {
  let out = `<rect y="${horizon}" width="${SCENE_W}" height="${SCENE_H - horizon}" fill="url(#water)"/>`;

  for (let k = 0; k < 16; k++) {
    const w = rand(30, 220) * (1 - k / 20);
    const x = d.sun.x * SCENE_W - w / 2 + rand(-20, 20);
    out += `<rect x="${x}" y="${horizon + 6 + k * 19}" width="${w}" height="3" rx="2" ` +
           `fill="${d.sun.color}" opacity="${Math.max(0.05, 0.5 - k * 0.03)}"/>`;
  }
  return out;
}

/** Đảo đá vôi trên mặt nước (kiểu Hạ Long, El Nido): 3 lớp từ xa đến gần */
function sceneKarst(d, horizon) {
  let out = sceneWater(d, horizon);

  for (let layer = 0; layer < 3; layer++) {
    const scale = 0.55 + layer * 0.4;
    const color = mixColor(d.layers.far, d.layers.near, layer / 2);
    const baseY = horizon + layer * 26;
    let path = '';

    for (let k = 0; k < 5 + layer; k++) {
      const x = rand(-50, SCENE_W + 50);
      const w = rand(60, 120) * scale;
      const h = rand(150, 320) * scale;
      const y = baseY + rand(-6, 10);

      path += `M${x - w} ${y}` +
              `C${x - w * 0.95} ${y - h * 0.4} ${x - w * 0.7} ${y - h * 0.85} ${x - w * 0.3} ${y - h}` +
              `S${x + w * 0.5} ${y - h * 0.95} ${x + w * 0.75} ${y - h * 0.45}` +
              `S${x + w} ${y - h * 0.1} ${x + w} ${y}Z`;
    }

    out += `<g transform="translate(0 ${2 * baseY}) scale(1 -1)" opacity=".2"><path d="${path}" fill="${color}"/></g>` +  // bóng phản chiếu
           `<path d="${path}" fill="${color}"/>` +
           fogBand(baseY - 50, 110, 0.5 - layer * 0.12);
  }
  return out;
}

/** Ruộng bậc thang: nhiều đường mảnh chạy song song theo dáng núi gần nhất */
function sceneTerraces(points) {
  let out = '';
  for (let k = 1; k < 10; k++) {
    const line = points.map((p) => `${p[0]} ${p[1] + k * 14}`).join('L');
    out += `<path d="M${line}" fill="none" stroke="#e8f2b0" stroke-opacity=".13" stroke-width="2"/>`;
  }
  return out;
}

/** Các lớp núi chồng lên nhau (có sương xen giữa); thêm mặt nước nếu có */
function sceneRidges(d, horizon) {
  const hasWater = Boolean(d.water);
  const count = hasWater ? 4 : 5;
  let out = '';
  let nearest;

  for (let i = 0; i < count; i++) {
    const baseY = hasWater ? horizon - 90 + i * 22 : horizon - 140 + i * 72;
    const amplitude = 230 - i * (hasWater ? 45 : 35);
    const color = mixColor(d.layers.far, d.layers.near, i / (count - 1));

    nearest = ridgePoints(baseY, amplitude);
    const outline = nearest.map((p) => p.join(' ')).join('L');
    out += `<path d="M${outline}L${SCENE_W} ${SCENE_H}L0 ${SCENE_H}Z" fill="${color}"/>`;

    if (i < count - 1) out += fogBand(baseY - 30, 110, 0.5);
  }

  if (d.terraces) out += sceneTerraces(nearest);
  if (hasWater) out += sceneWater(d, horizon);
  return out;
}

/* --- Hàm chính ----------------------------------------------------------------- */

/** Trả về chuỗi SVG hoàn chỉnh của một điểm đến */
function renderScene(d) {
  const horizon = d.water ? 580 : 620;

  return `<svg viewBox="0 0 ${SCENE_W} ${SCENE_H}" preserveAspectRatio="xMidYMid slice">` +
         sceneDefs(d) +
         `<rect width="${SCENE_W}" height="${SCENE_H}" fill="url(#sky)"/>` +
         (d.night ? sceneStars(horizon) : '') +
         sceneSun(d) +
         (d.type === 'karst' ? sceneKarst(d, horizon) : sceneRidges(d, horizon)) +
         `</svg>`;
}
