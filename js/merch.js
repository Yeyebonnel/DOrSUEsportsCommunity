// Load merch page content
document.addEventListener("DOMContentLoaded", function () {
  loadMerchContent();
});

async function loadMerchContent() {
  try {
    const response = await fetch("data/merch.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Update header
    const merchTitle = document.getElementById("merchTitle");
    const merchSubtitle = document.getElementById("merchSubtitle");
    const merchCta = document.getElementById("merchCta");

    if (merchTitle) merchTitle.textContent = data.header.title;
    if (merchSubtitle) merchSubtitle.textContent = data.header.subtitle;
    if (merchCta) {
      merchCta.textContent = data.header.ctaText;
      merchCta.setAttribute("href", data.header.ctaLink || "#merchShop");
    }

    // Update section title
    const merchSectionHighlight = document.getElementById("merchSectionHighlight");
    const merchSectionTitle = document.getElementById("merchSectionTitle");
    if (merchSectionHighlight) merchSectionHighlight.textContent = data.section.highlight;
    if (merchSectionTitle) merchSectionTitle.textContent = data.section.title;

    // Render filters and products
    const filtersContainer = document.getElementById("merchFilters");
    const merchGrid = document.getElementById("merchGrid");

    if (!filtersContainer || !merchGrid) return;

    const categories = data.categories && data.categories.length ? data.categories : ["All"];
    let activeCategory = categories[0];

    const renderFilters = () => {
      filtersContainer.innerHTML = "";
      categories.forEach((category) => {
        const button = document.createElement("button");
        button.className = `merch-filter-btn ${category === activeCategory ? "active" : ""}`;
        button.type = "button";
        button.textContent = category;
        button.addEventListener("click", () => {
          activeCategory = category;
          renderFilters();
          renderProducts();
        });
        filtersContainer.appendChild(button);
      });
    };

    const renderProducts = () => {
      const products = data.products || [];
      const filtered = activeCategory === "All" ? products : products.filter((product) => product.category === activeCategory);

      merchGrid.innerHTML = "";

      filtered.forEach((product) => {
        const statusClass = product.status ? product.status.toLowerCase().replace(/\s+/g, "-") : "";
        const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : [];
        const ctaLabel = product.ctaText || data.ctaLabel || "Order";
        const ctaLink = product.link || "#";

        const card = document.createElement("div");
        card.className = "col-6 col-lg-4 mb-4";
        card.innerHTML = `
          <div class="card merch-card h-100">
            <div class="merch-image-wrapper">
              <img src="${product.image}" class="card-img-top merch-image" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='data/images/DEC.png';" />
              ${product.badge ? `<div class="merch-badge">${product.badge}</div>` : ""}
            </div>
            <div class="card-body">
              <div class="merch-meta">
                <span class="merch-category">${product.category}</span>
                ${product.status ? `<span class="merch-status ${statusClass}">${product.status}</span>` : ""}
              </div>
              <h3 class="card-title h5">${product.name}</h3>
              <p class="card-text">${product.description}</p>
              ${sizes.length ? `<div class="merch-sizes">${sizes.map((size) => `<span>${size}</span>`).join("")}</div>` : ""}
            </div>
            <div class="card-footer merch-footer">
              <span class="merch-price">${product.price}</span>
              ${ctaLink !== "#" ? `<a href="${ctaLink}" class="btn btn-sm btn-outline-light merch-buy" target="_blank" rel="noopener noreferrer">${ctaLabel}</a>` : `<button class="btn btn-sm btn-outline-light merch-buy" type="button" disabled>${ctaLabel}</button>`}
            </div>
          </div>
        `;
        merchGrid.appendChild(card);
      });
    };

    renderFilters();
    renderProducts();

    // Update footer
    const footerText = document.getElementById("footerText");
    if (footerText && data.footer && data.footer.text) {
      footerText.textContent = data.footer.text;
    }
  } catch (error) {
    console.error("Error loading merch content:", error);
  }
}
