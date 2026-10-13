/* ==========================================================================
   door.js — random ánh sáng cánh cửa, mở cửa, chọn điểm đến, quay lại
   ========================================================================== */

const world = $('#world');
const flash = $('#flash');
const dest = $('#dest');
const door = $('#door');

/** Đổi ngẫu nhiên tông ánh sáng ma thuật (hồng đào / cam ấm) */
function randomizeDoor() {
  state.hue = pick([18, 24, 30, 350]);
  state.hueDir = pick([1, -1]);
  document.documentElement.style.setProperty('--h', state.hue);
}

/** Chọn ngẫu nhiên một điểm đến, không trùng điểm vừa rồi */
function pickDestination() {
  let index;
  do {
    index = Math.floor(Math.random() * DESTINATIONS.length);
  } while (index === state.lastIndex);

  state.lastIndex = index;
  return DESTINATIONS[index];
}

/** Các đuôi ảnh sẽ được thử lần lượt nếu file không đúng đuôi đã ghi */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.PNG'];

/** Các thư mục sẽ được tìm ảnh (ngoài thư mục ghi trong destinations.js) */
const IMAGE_FOLDERS = ['assets/images/', 'images/', 'assets/', ''];

/** Từ danh sách đường dẫn ảnh, sinh ra các đường dẫn có thể đúng, theo thứ tự nên thử:
 *  - nhiều thư mục (phòng khi thư mục ảnh đặt khác chỗ)
 *  - nhiều đuôi file (Windows ẩn đuôi nên khó biết là .jpg hay .png)
 *  - hai cách mã hoá chữ có dấu NFC / NFD (tên "Hà Nội" có thể được lưu khác kiểu gõ)
 *  Đuôi đúng được thử trước ở mọi thư mục và mọi tên, đuôi lạ để sau cùng cho đỡ chậm. */
function imageCandidates(paths) {
  const rows = [];

  for (const path of paths) {
    const file = path.split('/').pop();
    const folder = path.slice(0, path.length - file.length);
    const [, base, ext = ''] = file.match(/^(.*?)(\.[A-Za-z0-9]+)?$/);

    const names = new Set([base, base.normalize('NFC'), base.normalize('NFD')]);
    const folders = new Set([folder, ...IMAGE_FOLDERS]);
    const exts = [...new Set([ext, ...IMAGE_EXTENSIONS].filter(Boolean))];

    exts.forEach((e, rank) => {
      for (const dir of folders) {
        for (const name of names) rows.push({ rank, url: dir + name + e });
      }
    });
  }

  rows.sort((a, b) => a.rank - b.rank);        // giữ nguyên thứ tự trong cùng mức
  return [...new Set(rows.map((r) => r.url))];
}

/** Vẽ phong cảnh SVG dự phòng; nếu lỗi thì dùng nền màu đơn giản (không bao giờ để trống) */
function safeScene(d) {
  try {
    return renderScene(d);
  } catch (err) {
    console.warn('Không vẽ được phong cảnh dự phòng cho', d.name, err);
    return '<div style="width:100%;height:100%;background:linear-gradient(#4f7191,#f5c7a5)"></div>';
  }
}

/** Chờ ảnh tối đa bao lâu (ms). Quá lâu thì dùng phong cảnh vẽ sẵn để trang không bị kẹt. */
const PHOTO_TIMEOUT = 15000;

/** Tải TRỌN ảnh của điểm đến: thử lần lượt các đường dẫn rồi chờ ảnh giải mã xong.
 *  Trả về đường dẫn ảnh dùng được, hoặc null nếu điểm đến không có ảnh / không tải được. */
function loadPhoto(d) {
  const sources = imageCandidates([].concat(d.image || []));
  if (sources.length === 0) return Promise.resolve(null);

  const attempt = new Promise((resolve) => {
    const probe = new Image();
    let tried = 0;

    probe.onload = async () => {
      try { await probe.decode(); } catch (err) { /* không giải mã được trước thì trình duyệt vẫn vẽ được */ }
      resolve(probe.src);
    };

    probe.onerror = () => {
      tried += 1;
      if (tried < sources.length) {
        probe.src = encodeURI(sources[tried]);
      } else {
        console.warn(`Không tìm thấy ảnh "${d.name}". Đã thử ${sources.length} đường dẫn, ví dụ:`, sources.slice(0, 3));
        resolve(null);
      }
    };

    probe.src = encodeURI(sources[0]);
  });

  const giveUp = new Promise((resolve) => {
    setTimeout(() => {
      console.warn(`Ảnh "${d.name}" tải quá ${PHOTO_TIMEOUT / 1000}s, dùng phong cảnh vẽ sẵn.`);
      resolve(null);
    }, PHOTO_TIMEOUT);
  });

  return Promise.race([attempt, giveUp]);
}

/** Đưa cảnh của điểm đến vào một khung: ảnh thật nếu đã tải được, ngược lại vẽ SVG.
 *  Ảnh phủ kín màn hình (object-fit: cover). */
function mountScene(container, d, photoUrl) {
  container.innerHTML = '';
  delete container.dataset.zoom;

  if (!photoUrl) {
    container.innerHTML = safeScene(d);
    return;
  }

  const photo = new Image();

  photo.className = 'photo';
  photo.alt = d.name;
  photo.draggable = false;
  // Ảnh phủ kín toàn màn hình (cắt bớt phần thừa ở mép, không chừa khoảng trống).
  // Muốn hiện trọn ảnh không cắt thì đổi `cover` thành `contain`.
  photo.style.cssText = 'display:block;width:100%;height:100%;max-width:none;' +
    'object-fit:cover;object-position:center;';

  photo.onerror = () => {
    delete container.dataset.zoom;
    container.innerHTML = safeScene(d);
  };
  photo.src = photoUrl;
  container.appendChild(photo);
}

/** Đổ thông tin điểm đến vào cổng (sau cánh cửa) và màn hình điểm đến */
function fillDestination(d, photoUrl) {
  mountScene($('#pscene'), d, photoUrl);
  mountScene($('#dscene'), d, photoUrl);

  $('#dn').textContent = d.name;
  $('#dc').textContent = d.place || '';
  $('#dd').textContent = d.desc;

  const chips = [];
  if (d.season) chips.push(`<span>🗓 ${d.season}</span>`);
  if (d.activity) chips.push(`<span>✦ ${d.activity}</span>`);
  $('#dch').innerHTML = chips.join('');
}

/** Thời lượng từng giai đoạn (ms) — chỉnh số ở đây để nhanh / chậm hơn. */
const TIMELINE = {
  circle: 1800,   // thời gian tối thiểu vòng tròn quay (vẽ xong) trước khi bắt đầu lao vào cổng
  dive: 2300,     // thời gian lao vào cổng (khớp transition của #world.dive trong base.css)
  arrive: 1000,   // từ lúc chớp sáng đến lúc hiện màn hình điểm đến
  settle: 100,    // tan chớp sáng
};

/** Bấm "Mở cửa": mở cánh → vòng tròn phép thuật quay → (ảnh tải xong) vừa quay vừa
 *  phóng to lao vào cổng → xuyên qua cửa thì vòng tròn mất, hiện điểm đến */
async function openDoor() {
  if (state.busy) return;
  state.busy = true;

  const destination = pickDestination();

  startMagicCircle();                        // vòng tròn ngẫu nhiên + đổi màu ánh sáng theo nó
  door.classList.add('open');                // hai cánh xoay ra, vòng tròn bắt đầu được vẽ
  document.body.classList.add('opening');    // ẩn tiêu đề và nút
  state.pull = true;                         // hạt sáng bị hút vào cửa

  // Tải ảnh điểm đến trong lúc vòng tròn đang quay
  const photoReady = loadPhoto(destination)
    .then((url) => fillDestination(destination, url))
    .catch((err) => console.error('Không chuẩn bị được điểm đến', err));

  // Vòng tròn quay cho tới khi ảnh tải trọn rồi mới bắt đầu lao vào
  await Promise.all([wait(TIMELINE.circle), photoReady]);

  // Phóng to vào cổng, vòng tròn VẪN quay suốt quãng này
  const rect = $('.portal').getBoundingClientRect();
  world.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
  world.classList.add('dive');
  await wait(TIMELINE.dive);

  // Đã xuyên qua cửa: chớp sáng, vòng tròn biến mất, hiện điểm đến
  flash.style.opacity = 1;
  state.pull = false;
  burstParticles();
  await wait(TIMELINE.arrive);

  door.classList.add('reveal');              // ẩn vòng tròn (đang nằm sau chớp sáng)
  dest.classList.add('on');
  world.style.visibility = 'hidden';
  await wait(TIMELINE.settle);

  flash.style.opacity = 0;                   // tan chớp sáng
}

/** Bấm "Mở cánh cửa khác": chớp sáng → trả mọi thứ về ban đầu với cánh cửa mới */
function resetDoor() {
  flash.style.opacity = 1;

  after(1100, () => {
    document.body.classList.add('instant');              // tạm tắt transition để reset tức thì

    dest.classList.remove('on');
    world.classList.remove('dive');
    world.style.visibility = '';
    door.classList.remove('open', 'charge', 'reveal');
    clearMagicCircle();
    document.body.classList.remove('opening');
    randomizeDoor();

    void world.offsetWidth;                              // ép trình duyệt áp dụng thay đổi
    document.body.classList.remove('instant');
    state.busy = false;
    flash.style.opacity = 0;
  });
}