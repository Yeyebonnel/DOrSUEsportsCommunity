// Load home page content
document.addEventListener("DOMContentLoaded", function () {
  loadHomeContent();
});

async function loadHomeContent() {
  try {
    const response = await fetch("data/home.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Update hero section
    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    if (heroTitle && data.hero?.title) heroTitle.textContent = data.hero.title;
    if (heroSubtitle && data.hero?.subtitle) heroSubtitle.textContent = data.hero.subtitle;

    // Load features
    const featuresContainer = document.getElementById("featuresContainer");
    if (featuresContainer && Array.isArray(data.features)) {
      let featuresHTML = "";
      data.features.forEach((feature) => {
        const iconHTML = feature.icon ? (feature.icon.startsWith("bi ") ? `<i class="${feature.icon}"></i>` : feature.icon) : "";
        featuresHTML += `
          <div class="col-md-6 col-lg-3 mb-4">
              <div class="card text-center h-100">
                  <div class="card-body">
                      <div class="feature-icon">${iconHTML}</div>
                      <h3 class="card-title h5">${feature.title}</h3>
                      <p class="card-text">${feature.description}</p>
                  </div>
              </div>
          </div>
        `;
      });
      featuresContainer.innerHTML = featuresHTML;
    }

    // Load news
    const newsContainer = document.getElementById("newsContainer");
    if (newsContainer && Array.isArray(data.news) && data.news.length > 0) {
      let newsHTML = "";
      // First large card (left side)
      const firstCard = data.news[0];
      newsHTML += `
        <div class="col-md-6 mb-4">
          <div class="news-card-tl news-card-large" style="background-image: url('${firstCard.image}');">
            <div class="news-card-overlay"></div>
            <div class="news-card-badge">${firstCard.category}</div>
            <div class="news-card-content">
              <h3 class="news-card-title">${firstCard.title}</h3>
              <a href="${firstCard.link}" class="news-card-btn" target="_blank" rel="noopener noreferrer">
                Read More <span class="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      `;

      // Right side column with stacked cards
      let rightCards = "";
      for (let i = 1; i < Math.min(3, data.news.length); i++) {
        const news = data.news[i];
        rightCards += `
          <div class="mb-4">
            <div class="news-card-tl" style="background-image: url('${news.image}');">
              <div class="news-card-overlay"></div>
              <div class="news-card-badge">${news.category}</div>
              <div class="news-card-content">
                <h3 class="news-card-title">${news.title}</h3>
                <a href="${news.link}" class="news-card-btn" target="_blank" rel="noopener noreferrer">
                  Read More <span class="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        `;
      }

      if (rightCards) {
        newsHTML += `
          <div class="col-md-6">
            ${rightCards}
          </div>
        `;
      }

      newsContainer.innerHTML = newsHTML;
    }

    // Load achievements
    const achievementsContainer = document.getElementById("achievementsContainer");
    if (achievementsContainer && Array.isArray(data.achievements)) {
      let achievementsHTML = "";
      data.achievements.forEach((achievement) => {
        achievementsHTML += `
          <div class="col-md-6 col-lg-4 mb-4">
              <div class="card h-100 achievement-card">
                  ${achievement.image ? `<img src="${achievement.image}" class="card-img-top" alt="${achievement.title}" loading="lazy" />` : ""}
                  <div class="card-body">
                      <div class="achievement-meta">
                          <span class="achievement-year-badge">${achievement.year}</span>
                          ${achievement.icon ? `<span class="achievement-icon-badge">${achievement.icon}</span>` : ""}
                      </div>
                      <h3 class="card-title h5">${achievement.title}</h3>
                      <p class="card-text">${achievement.description}</p>
                  </div>
              </div>
          </div>
        `;
      });
      achievementsContainer.innerHTML = achievementsHTML;
    }

    // Update footer
    const footerText = document.getElementById("footerText");
    if (footerText && data.footer?.text) {
      footerText.textContent = data.footer.text;
    }
  } catch (error) {
    console.error("Error loading home content:", error);
  }
}
