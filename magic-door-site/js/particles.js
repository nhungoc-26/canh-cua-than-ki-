/* ==========================================================================
   particles.js — các hạt sáng (bụi vàng / cánh hoa) bay lơ lửng trên canvas
   ========================================================================== */

const canvas = $('#fx');
const ctx = canvas.getContext('2d');

const particles = Array.from({ length: 45 }, () => ({
  x: rand(0, innerWidth),
  y: rand(0, innerHeight),
  vx: rand(-0.15, 0.15),   // vận tốc ngang
  vy: rand(-0.4, -0.05),   // vận tốc dọc (bay lên)
  size: rand(0.8, 2.6),
  phase: rand(0, 6),       // pha nhấp nháy
  tint: pick([0, 1, 2]),   // mức lệch màu so với màu chính
}));

/** Đặt kích thước canvas theo màn hình (tối đa 2x cho máy retina) */
function resizeCanvas() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

/** Vẽ một khung hình; parallaxX (-1..1) làm hạt trôi nhẹ theo chuột */
function drawParticles(parallaxX) {
  const centerX = innerWidth / 2;
  const centerY = innerHeight * 0.5;

  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.globalCompositeOperation = 'lighter';

  for (const p of particles) {
    p.phase += 0.03;

    // Khi mở cửa: hút dần các hạt về phía cửa
    if (state.pull) {
      p.vx += (centerX - p.x) * 0.0009;
      p.vy += (centerY - p.y) * 0.0009;
      p.vx *= 0.985;
      p.vy *= 0.985;
    }

    // Vừa bị bung ra khỏi cổng: chậm dần về trạng thái bay lơ lửng bình thường
    if (p.burst) {
      p.vx *= 0.95;
      p.vy *= 0.95;
      if (Math.abs(p.vx) + Math.abs(p.vy) < 0.5) {
        p.burst = false;
        p.vx = rand(-0.15, 0.15);
        p.vy = rand(-0.4, -0.05);
      }
    }

    p.x += p.vx - parallaxX * p.size * 0.4;
    p.y += p.vy;

    // Bay ra khỏi màn hình thì xuất hiện lại phía đối diện
    if (p.y < -10) p.y = innerHeight + 10;
    if (p.x < -10) p.x = innerWidth + 10;
    if (p.x > innerWidth + 10) p.x = -10;

    const hue = state.hue + p.tint * state.hueDir * 14;

    ctx.beginPath();
    if (p.size > 1.7) {
      ctx.ellipse(p.x, p.y, p.size * 2, p.size * 0.9, p.phase, 0, 6.3);  // hạt to → cánh hoa
    } else {
      ctx.arc(p.x, p.y, p.size, 0, 6.3);                                  // hạt nhỏ → đốm sáng
    }
    ctx.fillStyle = `hsla(${hue}, 100%, 78%, ${0.28 + 0.25 * Math.sin(p.phase)})`;
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
    ctx.shadowBlur = 8;
    ctx.fill();
  }
}

/** Bung các hạt sáng ra xa khỏi cổng (lúc vòng tròn phép thuật nổ sáng) */
function burstParticles() {
  const centerX = innerWidth / 2;
  const centerY = innerHeight * 0.5;

  for (const p of particles) {
    const angle = Math.atan2(p.y - centerY, p.x - centerX);
    const speed = rand(2, 6);
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.burst = true;
  }
}
