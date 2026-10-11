/* ==========================================================================
   main.js — khởi động trang, hiệu ứng parallax theo chuột, vòng lặp chính
   (file này phải được nạp cuối cùng)
   ========================================================================== */

const layers = {
  bg: $('#bg'),
  mistNear: $('.m1'),
  mistFar: $('.m2'),
  doorTilt: $('#tilt'),
  destScene: $('#dscene'),
};

const pointer = { x: 0, y: 0 };   // vị trí chuột, chuẩn hóa -1..1
const smooth = { x: 0, y: 0 };    // vị trí đã làm mượt (đuổi theo chuột)

addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = (e.clientY / innerHeight) * 2 - 1;
});

/** Mỗi khung hình: làm mượt chuyển động, dịch các lớp theo chuột, vẽ hạt sáng */
function animate() {
  smooth.x += (pointer.x - smooth.x) * 0.06;
  smooth.y += (pointer.y - smooth.y) * 0.06;
  const { x, y } = smooth;

  // Lớp càng xa dịch càng ít, lớp càng gần dịch càng nhiều → cảm giác chiều sâu
  layers.bg.style.transform =
    `translate3d(${-x * 30}px, ${-y * 18}px, 0) scale(1.1)`;
  layers.mistNear.style.transform =
    `translate3d(${-x * 45}px, ${-y * 8}px, 0)`;
  layers.mistFar.style.transform =
    `translate3d(${-x * 80}px, ${-y * 12}px, 0)`;
  layers.doorTilt.style.transform =
    `perspective(1300px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translate3d(${x * 10}px, ${y * 6}px, 0)`;
  layers.destScene.style.transform =
    `translate3d(${-x * 26}px, ${-y * 16}px, 0) scale(1.08)`;

  drawParticles(x);
  requestAnimationFrame(animate);
}

/* --- Khởi động ---------------------------------------------------------------- */
$('#open').addEventListener('click', openDoor);
$('#again').addEventListener('click', resetDoor);
addEventListener('resize', resizeCanvas);

resizeCanvas();
randomizeDoor();
animate();
