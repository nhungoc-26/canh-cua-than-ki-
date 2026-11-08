
/* =========================================
   THEME SWITCH - CANH CUA THAN KI
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const world = document.getElementById("world");
  const toggle = document.getElementById("theme-toggle");
  const bg = document.getElementById("bg");

// Ảnh nền riêng cho từng chế độ
const themeBackgrounds = {
  light: "assets/light.jpg",
  dark: "assets/dark.jpg"
};

// Tải trước ảnh để chuyển đổi mượt hơn
Object.values(themeBackgrounds).forEach((src) => {
  const image = new Image();
  image.src = src;
});

  if (!world || !toggle) {
    console.error("Không tìm thấy #world hoặc #theme-toggle");
    return;
  }

  const STORAGE_KEY = "magic-gate-home-theme";

  // Đọc chế độ đã lưu
  let currentTheme = "dark";

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      currentTheme = savedTheme;
    }
  } catch (error) {
    console.warn("Không thể truy cập localStorage.");
  }

  // Áp dụng giao diện
  function applyTheme(theme) {
    currentTheme = theme;
    world.setAttribute("data-theme", theme);
// Đổi ảnh nền theo chế độ sáng/tối
if (bg && themeBackgrounds[theme]) {
  bg.style.transition = "opacity .4s ease";
  bg.style.opacity = "0.2";

  setTimeout(() => {
    bg.style.backgroundImage =
      `url("${themeBackgrounds[theme]}")`;

    bg.style.opacity = "1";
  }, 180);
}
    toggle.setAttribute(
      "aria-pressed",
      String(theme === "light")
    );

    toggle.setAttribute(
      "aria-label",
      theme === "light"
        ? "Chuyển sang giao diện tối"
        : "Chuyển sang giao diện sáng"
    );

    // Lưu lựa chọn
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn("Không thể lưu chế độ giao diện.");
    }
  }

  // Thiết lập giao diện ban đầu
  applyTheme(currentTheme);

  // Chuyển đổi khi nhấn nút
  toggle.addEventListener("click", () => {
    const nextTheme =
      currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
  });
});
