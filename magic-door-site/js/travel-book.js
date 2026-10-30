/*
 * CẨM NANG DU LỊCH — DẠNG SÁCH LẬT
 * - Một trang bìa giới thiệu điểm đến.
 * - Một trang riêng cho thời điểm du lịch.
 * - Mỗi địa điểm 2.1, 2.2... là một trang có ảnh bên trái, ghi chú bên phải.
 * - Lịch trình và chi phí mỗi phần nằm gọn trên một trang, không có ảnh.
 * - Dữ liệu lấy nguyên từ TRAVEL_GUIDE trong js/travel-guide.js.
 */
(() => {
  'use strict';

  const GUIDE_ALIASES = {
    'Hà Nội': 'Hà Nội', Tokyo: 'Tokyo', London: 'London',
    'Thượng Hải': 'Thượng Hải', 'Hàng Châu': 'Hàng Châu',
    'Thụy Sĩ': 'Thụy Sĩ', Paris: 'Pháp', 'Kim Tự Tháp': 'Ai Cập',
    'Bắc Cực': 'Bắc cực', 'Bắc cực': 'Bắc cực', Bangkok: 'Bangkok',
    Canada: 'Canada', 'Đà Lạt': 'Đà Lạt', 'Đà Nẵng': 'Đà Nẵng',
    'Hà Giang': 'Hà Giang', Úc: 'Úc', Seoul: 'Seoul', Berlin: 'Berlin',
    Mỹ: 'Mỹ', Singapore: 'Singapore', 'Hong Kong': 'HongKong', HongKong: 'HongKong'
  };

  // Trong dự án của bạn, ảnh nằm ở assets/Camnagdulich/.
  // Những thư mục khác là đường dẫn dự phòng.
  const IMAGE_FOLDERS = [
    'assets/Camnagdulich/',
    'assets/images/',
    'images/',
    'assets/',
    'Camnagdulich/'
  ];

  const IMAGE_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.webp', '.avif',
    '.PNG', '.JPG', '.JPEG', '.WEBP'
  ];

  const IMAGE_ALIASES = {
    'Khu vực Phố Cổ': ['Phố Cổ 1', 'Phố cổ 2'],
    'Phố Cổ': ['Phố Cổ 1', 'Phố cổ 2'],
    'Quảng trường Ba Đình – Lăng Bác': ['Lăng Bác', 'Quảng trường Ba Đình – Lăng Bác'],
    'Tháp đồng hồ Big Ben và Cung điện Westminster': ['Big Ben'],
    'Cầu Tháp London (Tower Bridge)': ['Cầu Tháp London'],
    'Bà Nà Hills và Cầu Vàng': ['Bà Nà Hills và Cầu Vàng'],
    'Tháp Thượng Hải và Tháp truyền hình Minh Châu Phương Đông': ['Tháp Minh Châu Phương Đông'],
    'Tháp truyền hình Minh Châu Phương Đông': ['Tháp Minh Châu Phương Đông'],
    'Cung điện Hoàng gia Grand Palace': ['Cung điện Hoàng gia Grand Palace'],
    'Chùa Bình Minh Wat Arun': ['Chùa Bình Minh Wat Arun'],
    'Chùa Phật Ngọc Wat Phra Kaew': ['Chùa Phật Ngọc Wat Phra Kaew'],
    'Thành phố Lucerne (Luzern)': ['Thành phố Lucerne'],
    'Công viên quốc gia Uluru-Kata Tjuta': ['Công viên quốc gia Uluru-Kata Tjuta'],
    'Công viên Trung tâm Central Park': ['Công viên Trung tâm Central Park'],
    'Công viên quốc gia Grand Canyon': ['Công viên quốc gia Grand Canyon'],
    'Công viên quốc gia Banff': ['Công viên quốc gia Banff'],
    'Nhà hát Opera Sydney': ['Nhà hát Opera Sydney'],
    'Bãi biển Bondi': ['Bãi biển Bondi'],
    'Bãi biển Mỹ Khê': ['Bãi biển Mỹ Khê'],
    'Tháp N Seoul': ['Tháp N Seoul'],
    'Nhà thờ Đức Bà Paris': ['Nhà thờ Đức Bà Paris'],
    'Đèo Mã Pí Lèng': ['Đèo Mã Pí Lèng'],
    'Sông Nho Quế': ['Sông Nho Quế'],
    'Cột cờ Lũng Cú': ['Cột cờ Lũng Cú'],
    'Chợ đêm Đà Lạt': ['Chợ đêm Đà Lạt'],
    'Thác Pongour': ['Thác Pongour'],
    'Bến Thượng Hải': ['Bến Thượng Hải'],
    'Dự Viên': ['Dự Viên'],
    'Tây Hồ': ['Tây Hồ'],
    'Ô trấn Wuzhen': ['Ô trấn Wuzhen'],
    'Đền Senso-ji': ['Đền Senso-ji'],
    'Giao lộ Shibuya': ['Giao lộ Shibuya'],
    'Thác Niagara': ['Thác Niagara'],
    'Tượng Merlion': ['Tượng Merlion'],
    'Cảng Victoria': ['Cảng Victoria'],
    'Hong Kong Disneyland': ['Hong Kong Disneyland'],
    'Đảo Sentosa': ['Đảo Sentosa'],
    'Marina Bay Sands': ['Marina Bay Sands'],
    'Gardens by the Bay': ['Gardens by the Bay'],
    'Quảng trường Times Square': ['Quảng trường Times Square'],
    'Tượng Nữ thần Tự do': ['Tượng Nữ thần Tự do'],
    'Cầu Cổng Vàng Golden Gate Bridge': ['Cầu Cổng Vàng Golden Gate Bridge'],
    'Bảo tàng Bode': ['Bảo tàng Bode'],
    'Quảng trường Alexanderplatz': ['Quảng trường Alexanderplatz'],
    'Tòa nhà Reichstag': ['Tòa nhà Reichstag'],
    'Cổng Brandenburg': ['Cổng Brandenburg'],
    'Công viên Hyde Park': ['Công viên Hyde Park'],
    'Cầu Rồng': ['Cầu Rồng'],
    'Ngũ Hành Sơn': ['Ngũ Hành Sơn'],
    'Phố cổ Đồng Văn': ['Phố cổ Đồng Văn'],
    'Thung lũng Lauterbrunnen': ['Thung lũng Lauterbrunnen'],
    'Tháp Lôi Phong': ['Tháp Lôi Phong'],
    'Vương cung Thánh đường Fourvière': ['Vương cung Thánh đường Fourvière'],
    'Bảo tàng Louvre': ['Bảo tàng Louvre'],
    'Cung điện Versailles': ['Cung điện Versailles'],
    'Tháp Eiffel': ['Tháp Eiffel'],
    'Sông Nile': ['Sông Nile'],
    'Tượng Nhân Sư Giza': ['Tượng Nhân Sư Giza'],
    'Kim tự tháp Giza': ['Kim tự tháp Giza'],
    'Đại Phật Thiên Đàn và tu viện Po Lin': ['Đại Phật Thiên Đàn và tu viện Po Lin'],
    'Đỉnh Victoria Peak': ['Đỉnh Victoria Peak'],
    'Vườn quốc gia Ba Vì': ['Vườn quốc gia Ba Vì'],
    'Hồ Hoàn Kiếm': ['Hồ Hoàn Kiếm'],
    'Chùa Một Cột': ['Chùa Một Cột'],
    'Văn Miếu - Quốc Tử Giám': ['Văn Miếu- Quốc Tử Giám', 'Văn Miếu - Quốc Tử Giám']
  };

  const overlay = document.querySelector('#travel-book');
  const pageEl = document.querySelector('#book-page');
  const figureEl = document.querySelector('.book-photo-frame');
  const imageEl = document.querySelector('#book-image');
  const placeholderEl = document.querySelector('#book-image-placeholder');
  const guideTitleEl = document.querySelector('#guide-title');
  const categoryEl = document.querySelector('#book-category');
  const summaryEl = document.querySelector('#book-summary');
  const contentEl = document.querySelector('#guide-content');
  const copyEl = document.querySelector('.book-copy');

  if (
    !overlay || !pageEl || !figureEl || !imageEl ||
    !placeholderEl || !contentEl || !copyEl
  ) {
    console.error('[Cẩm nang] Không tìm thấy đủ thành phần sách trong index.html.');
    return;
  }

  let selectedDestination = '';
  let currentGuideKey = '';
  let pages = [];
  let pageIndex = 0;
  let imageToken = 0;
  let lastFocus = null;
  let lastDirection = 1;

  const $ = selector => document.querySelector(selector);

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, c => c === 'Đ' ? 'D' : 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  function findGuideKey(destination) {
  if (
    typeof TRAVEL_GUIDE === 'undefined' ||
    !TRAVEL_GUIDE ||
    typeof TRAVEL_GUIDE !== 'object'
  ) {
    console.error(
      '[Cẩm nang] Không tải được TRAVEL_GUIDE. Kiểm tra js/travel-guide.js.'
    );
    return '';
  }

  const keys = Object.keys(TRAVEL_GUIDE);
  const destinationNorm = normalize(destination);

  // Tìm khóa tương ứng trong bảng bí danh.
  const aliasEntry = Object.entries(GUIDE_ALIASES).find(
    ([name]) => normalize(name) === destinationNorm
  );

  // Thử cả tên khóa được ánh xạ và tên điểm đến ban đầu.
  const candidates = [
    aliasEntry ? aliasEntry[1] : '',
    destination
  ].filter(Boolean);

  for (const candidate of candidates) {
    const matchedKey = keys.find(
      key => normalize(key) === normalize(candidate)
    );

    if (matchedKey) {
      return matchedKey;
    }
  }

  // Dự phòng: tìm trực tiếp theo tên đã chuẩn hóa.
  const directMatch = keys.find(
    key => normalize(key) === destinationNorm
  );

  if (directMatch) { 
    return directMatch;
  }

  console.error(
    `[Cẩm nang] Không tìm thấy "${destination}". Các khóa hiện có:`,
    keys
  );

  return '';
}

  function makePage(type, title, body = [], options = {}) {
    return {
      type,
      title: String(title || '').trim(),
      category: options.category || 'CẨM NANG DU LỊCH',
      body: Array.isArray(body) ? body : [],
      imageName: options.imageName || '',
      wantsImage: Boolean(options.wantsImage),
      summary: options.summary || ''
    };
  }

  function isCoverHeading(line) {
    return /^1\s*\.\s*(thời điểm|thời gian|thời điểm thích hợp)/i.test(line);
  }

  function isPlacesHeading(line) {
    return /^2\s*\.\s*(địa điểm|các địa điểm)/i.test(line);
  }

  function isAttractionHeading(line) {
    return /^2\s*\.\s*\d+\s*\.?\s*\S/i.test(line);
  }

  function isItineraryHeading(line) {
    return /^3\s*\.\s*lịch trình/i.test(line);
  }

  function isCostHeading(line) {
    return /^4\s*\.\s*chi phí/i.test(line);
  }

  function stripMainNumber(line) {
    return String(line || '').replace(/^\s*\d+\s*\.\s*/, '').trim();
  }

  function attractionTitle(line) {
    return String(line || '')
      .replace(/^\s*2\s*\.\s*\d+\s*\.?\s*/, '')
      .trim();
  }

  /* Chia dữ liệu theo loại trang, nhưng không bỏ bất kỳ dòng nội dung nào. */
  function buildPages(destination, guideKey, source) {
    const lines = Array.isArray(source)
      ? source.map(item => String(item ?? '').trim()).filter(Boolean)
      : [];

    if (!lines.length) {
      return [
        makePage('missing', destination || 'Điểm đến', [
          'Chưa tìm thấy dữ liệu cho địa điểm này trong js/travel-guide.js.',
          'Kiểm tra tên địa điểm trong TRAVEL_GUIDE và tên được chọn trên cánh cửa.'
        ], { category: 'CHƯA CÓ CẨM NANG' })
      ];
    }

    const result = [];

    // Đưa tất cả các đoạn giới thiệu lên trang bìa.
    let introEnd = 1;

    while (
      introEnd < lines.length &&
      !isCoverHeading(lines[introEnd]) &&
      !isPlacesHeading(lines[introEnd]) &&
      !isAttractionHeading(lines[introEnd]) &&
      !isItineraryHeading(lines[introEnd]) &&
      !isCostHeading(lines[introEnd])
    ) {
      introEnd++;
    }

    const intro = lines[0];

    result.push(makePage('cover', destination, lines.slice(1, introEnd), {
      category: 'GIỚI THIỆU ĐIỂM ĐẾN',
      summary: intro,
      imageName: destination,
      wantsImage: true
    }));

    let state = '';
    let current = null;

    function flush() {
      if (!current) return;

      if (current.type === 'attraction') {
        result.push(makePage('attraction', current.title, current.body, {
          category: 'ĐỊA ĐIỂM THAM QUAN',
          imageName: current.imageName || current.title,
          wantsImage: true
        }));
      } else if (current.type === 'season') {
        result.push(makePage('season', current.title, current.body, {
          category: 'THỜI ĐIỂM DU LỊCH',
          wantsImage: false
        }));
      } else if (current.type === 'itinerary') {
        result.push(makePage('itinerary', current.title, current.body, {
          category: 'LỊCH TRÌNH GỢI Ý',
          wantsImage: false
        }));
      } else if (current.type === 'cost') {
        result.push(makePage('cost', current.title, current.body, {
          category: 'CHI PHÍ THAM KHẢO',
          wantsImage: false
        }));
      } else if (current.body.length) {
        result.push(makePage('notes', current.title || 'Thông tin thêm', current.body, {
          category: 'CẨM NANG DU LỊCH',
          wantsImage: false
        }));
      }

      current = null;
    }

    for (const line of lines.slice(introEnd)) {
      if (isCoverHeading(line)) {
        flush();
        state = 'season';
        current = {
          type: 'season',
          title: stripMainNumber(line),
          body: []
        };
        continue;
      }

      if (isPlacesHeading(line)) {
        flush();
        state = 'attractions';
        continue;
      }

      if (isAttractionHeading(line)) {
        flush();
        state = 'attractions';

        const name = attractionTitle(line);

        current = {
          type: 'attraction',
          title: line,
          imageName: name,
          body: []
        };
        continue;
      }

      if (isItineraryHeading(line)) {
        flush();
        state = 'itinerary';
        current = {
          type: 'itinerary',
          title: stripMainNumber(line),
          body: []
        };
        continue;
      }

      if (isCostHeading(line)) {
        flush();
        state = 'cost';
        current = {
          type: 'cost',
          title: 'Chi phí tham khảo',
          body: []
        };
        continue;
      }

      if (!current) {
        const type = state || 'notes';

        current = {
          type,
          title: type === 'notes' ? 'Thông tin thêm' : '',
          imageName: '',
          body: []
        };
      }

      current.body.push(line);
    }

    flush();
    return result;
  }

  function imageNamesForPage(p) {
    const names = [];

    if (p.type === 'cover') {
      // Nếu destinations.js có khai báo ảnh thì thử ảnh đó trước.
      if (typeof DESTINATIONS !== 'undefined' && Array.isArray(DESTINATIONS)) {
        const destination = DESTINATIONS.find(
          d => normalize(d.name) === normalize(selectedDestination)
        );

        if (destination?.image) {
          if (Array.isArray(destination.image)) {
            names.push(...destination.image);
          } else {
            names.push(destination.image);
          }
        }
      }

      names.push(selectedDestination, currentGuideKey);

      if (selectedDestination === 'Paris') {
        names.push('Pháp');
      }

      if (selectedDestination === 'Kim Tự Tháp') {
        names.push('Kim tự tháp Giza', 'Ai Cập');
      }

      if (selectedDestination === 'Hong Kong') {
        names.push('HongKong');
      }
    } else if (p.type === 'attraction') {
      names.push(...(IMAGE_ALIASES[p.imageName] || []));
      names.push(p.imageName, p.title);
    }

    const unique = [];
    const seen = new Set();

    for (const name of names.filter(Boolean)) {
      const value = String(name).trim();
      const key = value.normalize('NFC').toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(value);
      }
    }

    return unique;
  }

  function imageCandidatesForPage(p) {
    const paths = [];

    for (const name of imageNamesForPage(p)) {
      const raw = String(name).trim();
      const hasFolder = raw.includes('/');
      const hasExtension = /\.(png|jpe?g|webp|avif)$/i.test(raw);

      const variants = [
        ...new Set([raw, raw.normalize('NFC'), raw.normalize('NFD')])
      ];

      for (const variant of variants) {
        if (hasFolder) {
          if (hasExtension) {
            paths.push(variant);
          } else {
            IMAGE_EXTENSIONS.forEach(ext => paths.push(variant + ext));
          }
        } else {
          for (const folder of IMAGE_FOLDERS) {
            if (hasExtension) {
              paths.push(folder + variant);
            } else {
              IMAGE_EXTENSIONS.forEach(ext => paths.push(folder + variant + ext));
            }
          }
        }
      }
    }

    return [...new Set(paths)];
  }

  function encodePath(path) {
    return path.split('/').map(part => encodeURIComponent(part)).join('/');
  }

  function setPageImage(p) {
    const token = ++imageToken;
    const candidates = imageCandidatesForPage(p);
    let candidateIndex = 0;

    const placeholderTitle = $('#book-placeholder-title');
    const placeholderPath = $('#book-placeholder-path');
    const caption = $('#book-image-caption');

    imageEl.hidden = true;
    imageEl.removeAttribute('src');
    imageEl.alt = p.imageName || p.title;
    placeholderEl.hidden = false;
    figureEl.hidden = Boolean(!p.wantsImage);
    pageEl.classList.toggle('no-image', !p.wantsImage);

    if (placeholderTitle) {
      placeholderTitle.textContent = p.imageName || p.title;
    }

    if (placeholderPath) {
      placeholderPath.textContent = 'Đang tìm ảnh trong assets/Camnagdulich/…';
    }

    if (caption) {
      caption.textContent = p.imageName || p.title;
    }

    if (!p.wantsImage) {
      imageEl.removeAttribute('src');
      return;
    }

    function tryNext() {
      if (token !== imageToken) return;

      if (candidateIndex >= candidates.length) {
        figureEl.hidden = true;
        pageEl.classList.add('no-image');
        placeholderEl.hidden = true;

        if (placeholderPath) {
          placeholderPath.textContent =
            `Chưa tìm thấy ảnh “${p.imageName || p.title}”. Kiểm tra tên file trong assets/Camnagdulich/.`;
        }

        return;
      }

      const path = candidates[candidateIndex++];

      imageEl.onload = () => {
        if (token !== imageToken) return;

        figureEl.hidden = false;
        pageEl.classList.remove('no-image');
        imageEl.hidden = false;
        placeholderEl.hidden = true;

        if (caption) {
          caption.textContent = p.imageName || p.title;
        }
      };

      imageEl.onerror = tryNext;
      imageEl.src = encodePath(path);
    }

    tryNext();
  }

  function addTextLine(container, value, type, index, lines) {
    const text = String(value || '').trim();
    if (!text) return;

    const itineraryHeading = /^buổi\s+(sáng|trưa|chiều|tối)\b/i.test(text);
    const choicesHeading = /^hai lựa chọn cho chuyến đi riêng/i.test(text);
    const seasonHeading =
      /^(mùa\s+(xuân|hè|hạ|thu|đông)|tháng\s+\d|tháng\s+\d+\s*[–-])/i.test(text);

    const shortLabel = type === 'itinerary' &&
      text.length <= 62 &&
      !/[.!?;:]$/.test(text) &&
      index > 0 &&
      /^hai lựa chọn cho chuyến đi riêng/i.test(lines[index - 1] || '');

    if (itineraryHeading || choicesHeading || seasonHeading || shortLabel) {
      const heading = document.createElement(type === 'itinerary' ? 'h4' : 'h3');

      heading.textContent = text;

      if (choicesHeading) {
        heading.classList.add('itinerary-wide-heading');
      }

      container.appendChild(heading);
      return;
    }

    const p = document.createElement('p');
    p.textContent = text;

    if (/^[•\-–]\s*/.test(text)) {
      p.classList.add('guide-list-line');
    }

    container.appendChild(p);
  }

  function renderBody(p) {
    contentEl.replaceChildren();
    contentEl.className = 'book-guide-content';

    pageEl.classList.remove(
      'page-cover',
      'page-season',
      'page-attraction',
      'page-itinerary',
      'page-cost',
      'page-notes',
      'page-missing'
    );

    pageEl.classList.add(`page-${p.type}`);

    if (p.type === 'itinerary') {
      const grid = document.createElement('div');
      grid.className = 'itinerary-grid';

      let block = null;
      let insideOptions = false;

      p.body.forEach((line, index) => {
        const text = String(line || '').trim();
        if (!text) return;

        const isTimeHeading = /^buổi\s+(sáng|trưa|chiều|tối)\b/i.test(text);
        const isOptionsHeading = /^hai lựa chọn cho chuyến đi riêng/i.test(text);

        const isOptionName = insideOptions &&
          text.length <= 52 &&
          !/[.!?;:]$/.test(text) &&
          !/^lưu ý\s*:/i.test(text);

        if (isTimeHeading || isOptionsHeading) {
          block = document.createElement('section');
          block.className = 'itinerary-block';

          if (isOptionsHeading) {
            block.classList.add('itinerary-block-wide');
            insideOptions = true;
          } else {
            insideOptions = false;
          }

          // Tách nhãn buổi nếu nguồn viết "Buổi sáng: ...".
          const inlineTime = text.match(
            /^(Buổi\s+(?:sáng|trưa|chiều|tối))\s*[:：–—-]\s*(.+)$/i
          );

          const heading = document.createElement('h4');
          heading.textContent = inlineTime ? inlineTime[1] : text;
          block.appendChild(heading);

          if (inlineTime && inlineTime[2]) {
            const description = document.createElement('p');
            description.textContent = inlineTime[2];
            block.appendChild(description);
          }

          grid.appendChild(block);
          return;
        }

        if (isOptionName) {
          block = document.createElement('section');
          block.className = 'itinerary-block';

          const h = document.createElement('h5');
          h.textContent = text;
          block.appendChild(h);

          grid.appendChild(block);
          return;
        }

        if (!block) {
          block = document.createElement('section');
          block.className = 'itinerary-block itinerary-block-wide';
          grid.appendChild(block);
        }

        const pEl = document.createElement('p');
        pEl.textContent = text;
        block.appendChild(pEl);
      });

      contentEl.appendChild(grid);
      return;
    }

    p.body.forEach((line, index) => {
      addTextLine(contentEl, line, p.type, index, p.body);
    });
  }

  // Nếu nội dung một trang hơi dài, giảm cỡ chữ để vừa trang.
  function fitCurrentPage() {
    requestAnimationFrame(() => {
      const itineraryGrid = contentEl.querySelector('.itinerary-grid');

      const overflows = () => {
        const copyOverflow = copyEl.scrollHeight > copyEl.clientHeight + 3;
        const contentOverflow = contentEl.scrollHeight > contentEl.clientHeight + 3;
        const gridOverflow = itineraryGrid &&
          itineraryGrid.scrollHeight > itineraryGrid.clientHeight + 3;

        return copyOverflow || contentOverflow || Boolean(gridOverflow);
      };

      if (!overflows()) return;

      pageEl.classList.add('fit-compact');

      requestAnimationFrame(() => {
        if (!overflows()) return;
        pageEl.classList.add('fit-more-compact');
      });
    });
  }

  function renderPage(direction = 0) {
    if (!pages.length) return;

    const p = pages[pageIndex];
    const current = String(pageIndex + 1).padStart(2, '0');
    const total = String(pages.length).padStart(2, '0');

    guideTitleEl.textContent =
      p.title || selectedDestination || 'Cẩm nang du lịch';

    categoryEl.textContent = p.category;
    summaryEl.textContent = p.summary || '';

    renderBody(p);

    pageEl.classList.remove('fit-compact', 'fit-more-compact');

    setPageImage(p);
    fitCurrentPage();

    $('#book-page-number').textContent = `TRANG ${current}`;
    $('#book-page-footer-number').textContent = `${current} / ${total}`;
    $('#book-location-counter').textContent = `${current} / ${total} trang`;
    $('#book-progress-fill').style.width =
      `${((pageIndex + 1) / pages.length) * 100}%`;

    $('#book-prev').disabled = pageIndex <= 0;
    $('#book-next').disabled = pageIndex >= pages.length - 1;
    $('#book-first').disabled = pageIndex === 0;

    copyEl.scrollTop = 0;

    pageEl.classList.remove('turn-forward', 'turn-backward');
    void pageEl.offsetWidth;

    if (direction > 0) {
      pageEl.classList.add('turn-forward');
    } else if (direction < 0) {
      pageEl.classList.add('turn-backward');
    }
  }

  function openTravelBook(destinationName = '') {
    selectedDestination = String(destinationName || '').trim() || 'Điểm đến';
    currentGuideKey = findGuideKey(selectedDestination);
    pageIndex = 0;
    lastFocus = document.activeElement;

    const data = currentGuideKey && typeof TRAVEL_GUIDE !== 'undefined'
      ? TRAVEL_GUIDE[currentGuideKey]
      : null;

    pages = buildPages(selectedDestination, currentGuideKey, data);

    renderPage(0);

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('travel-book-open');

    $('#guide-close')?.focus();
  }

  function closeTravelBook() {
    if (!overlay.classList.contains('open')) return;

    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('travel-book-open');

    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function movePage(delta) {
    const next = pageIndex + delta;

    if (next < 0 || next >= pages.length) return;

    lastDirection = delta > 0 ? 1 : -1;
    pageIndex = next;
    renderPage(lastDirection);
  }

  $('#guide-open')?.addEventListener('click', () => {
    openTravelBook($('#dn')?.textContent?.trim() || '');
  });

  $('#guide-close')?.addEventListener('click', closeTravelBook);

  overlay.querySelector('[data-book-dismiss]')?.addEventListener(
    'click',
    closeTravelBook
  );

  $('#book-prev')?.addEventListener('click', () => movePage(-1));
  $('#book-next')?.addEventListener('click', () => movePage(1));

  $('#book-first')?.addEventListener('click', () => {
    const delta = -pageIndex;
    pageIndex = 0;
    renderPage(delta < 0 ? -1 : 0);
  });

  document.addEventListener('keydown', event => {
    if (!overlay.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeTravelBook();
    } else if (event.key === 'ArrowRight') {
      movePage(1);
    } else if (event.key === 'ArrowLeft') {
      movePage(-1);
    }
  });
})();