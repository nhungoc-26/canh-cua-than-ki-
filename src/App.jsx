import "./App.css";

function App() {
  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Cánh Cửa Thần Kì</h1>

          <p className="subtitle">Mở cửa - Một hành trình mới đang chờ bạn</p>

          {/* 10 ẢNH ĐỊA ĐIỂM */}
          <div className="floating-images">
            <img
              src="/images/hanoi.jpg"
              alt="Hà Nội"
              className="travel-image image-1"
            />

            <img
              src="/images/london.jpg"
              alt="London"
              className="travel-image image-2"
            />

            <img
              src="/images/newyork.jpg"
              alt="New York"
              className="travel-image image-3"
            />

            <img
              src="/images/japan.jpg"
              alt="Nhật Bản"
              className="travel-image image-4"
            />

            <img
              src="/images/aicap.jpg"
              alt="Ai Cập"
              className="travel-image image-5"
            />

            <img
              src="/images/baccuc.jpg"
              alt="Bắc Cực"
              className="travel-image image-6"
            />

            <img
              src="/images/china.jpg"
              alt="Trung Quốc"
              className="travel-image image-7"
            />

            <img
              src="/images/halan.jpg"
              alt="Hà Lan"
              className="travel-image image-8"
            />

            <img
              src="/images/singapore.jpg"
              alt="Singapore"
              className="travel-image image-9"
            />

            <img
              src="/images/uc.jpg"
              alt="Úc"
              className="travel-image image-10"
            />
          </div>

          {/* MAGIC DOOR */}
          <div className="magic-door">
            <div className="sparkle sparkle-1">✦</div>
            <div className="sparkle sparkle-2">✧</div>
            <div className="sparkle sparkle-3">✦</div>

            <div className="door">
              <div className="door-panel">
                <div className="door-knob"></div>
              </div>
            </div>
          </div>

          <button className="open-button">
            <span>🎲</span>
            MỞ CỬA
            <span>→</span>
          </button>

          <p className="hint">
            Mở cửa một lần,
            <br />
            khám phá một nơi chưa từng biết!
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="experience">
        <div className="section-title">
          <span className="decoration">✈</span>
          <h2>Bạn sẽ trải nghiệm gì?</h2>
          <span className="decoration">✦</span>
        </div>

        <p className="description">
          Chỉ với một lần bấm, bạn sẽ được đưa đến một địa điểm bất ngờ
          <br />
          cùng những trải nghiệm thú vị!
        </p>

        {/* 3 CARDS */}
        <div className="cards">
          <div className="card">
            <div className="card-icon">🎲</div>

            <h3>Random địa điểm</h3>

            <p>
              Mỗi lần bấm là một địa điểm mới, khám phá thế giới theo cách bất
              ngờ nhất!
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🌐</div>

            <h3>Khám phá 360°</h3>

            <p>
              Trải nghiệm không gian thực tế qua hình ảnh 360° sống động như
              đang ở ngay đó.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">📍</div>

            <h3>Gợi ý địa điểm nổi bật</h3>

            <p>
              Địa danh nổi tiếng, cảnh đẹp và những trải nghiệm đặc trưng của
              địa phương.
            </p>
          </div>
        </div>

        {/* BOTTOM MESSAGE */}
        <div className="bottom-message">
          <div className="message-left">
            ✈️
            <span>
              Đi đâu cũng được,
              <br />
              miễn là có cửa!
            </span>
          </div>

          <div className="message-right">
            Thế giới rộng lớn
            <br />
            và những hành trình bất ngờ đang chờ bạn!
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
