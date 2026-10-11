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

/** Đổ thông tin điểm đến vào cổng (sau cánh cửa) và màn hình điểm đến */
function fillDestination(d) {
  const sceneSvg = renderScene(d);
  $('#pscene').innerHTML = sceneSvg;
  $('#dscene').innerHTML = sceneSvg;

  $('#dn').textContent = d.name;
  $('#dc').textContent = d.place;
  $('#dd').textContent = d.desc;
  $('#dch').innerHTML = `<span>🗓 ${d.season}</span><span>✦ ${d.activity}</span>`;
}

/** Bấm "Mở cửa": mở cánh → lao vào cổng → chớp sáng → hiện điểm đến */
function openDoor() {
  if (state.busy) return;
  state.busy = true;

  fillDestination(pickDestination());

  door.classList.add('open');                // hai cánh xoay ra
  document.body.classList.add('opening');    // ẩn tiêu đề và nút
  state.pull = true;                         // hạt sáng bị hút vào cửa

  after(1900, () => {                        // camera lao vào giữa cổng
    const rect = $('.portal').getBoundingClientRect();
    world.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
    world.classList.add('dive');
  });

  after(3800, () => { flash.style.opacity = 1; });       // chớp sáng che chuyển cảnh

  after(4600, () => {                                    // hiện màn hình điểm đến
    dest.classList.add('on');
    world.style.visibility = 'hidden';
    state.pull = false;
  });

  after(4700, () => { flash.style.opacity = 0; });       // tan chớp sáng
}

/** Bấm "Mở cánh cửa khác": chớp sáng → trả mọi thứ về ban đầu với cánh cửa mới */
function resetDoor() {
  flash.style.opacity = 1;

  after(1100, () => {
    document.body.classList.add('instant');              // tạm tắt transition để reset tức thì

    dest.classList.remove('on');
    world.classList.remove('dive');
    world.style.visibility = '';
    door.classList.remove('open');
    document.body.classList.remove('opening');
    randomizeDoor();

    void world.offsetWidth;                              // ép trình duyệt áp dụng thay đổi
    document.body.classList.remove('instant');
    state.busy = false;
    flash.style.opacity = 0;
  });
}
