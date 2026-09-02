// Tournament page logic
document.addEventListener("DOMContentLoaded", function () {
  loadTournamentsContent();
});

let allTournaments = [];
let currentFilter = "all";
let searchQuery = "";

async function loadTournamentsContent() {
  try {
    const response = await fetch("data/tournaments.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allTournaments = data.tournaments || [];
    renderTournamentCards(allTournaments);
    setupFilters();
    setupSearch();
    setupBackButton();
  } catch (error) {
    console.error("Error loading tournaments:", error);
    const grid = document.getElementById("tournamentsGrid");
    if (grid) {
      grid.innerHTML = '<p class="text-center text-danger">Failed to load tournaments. Please try again later.</p>';
    }
  }
}

// ── Search & Filter Helper ───────────────────────────────────────────────────

function applyFiltersAndSearch() {
  const query = searchQuery.trim().toLowerCase();
  const filtered = allTournaments.filter((t) => {
    const matchesStatus = currentFilter === "all" || t.status === currentFilter;
    const matchesSearch = !query || t.name.toLowerCase().includes(query) || (t.game && t.game.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });
  renderTournamentCards(filtered);
}

function setupSearch() {
  const searchInput = document.getElementById("tournamentSearchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    applyFiltersAndSearch();
  });
}

// ── Render Cards ────────────────────────────────────────────────────────────

function renderTournamentCards(tournaments) {
  const grid = document.getElementById("tournamentsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (tournaments.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5"><p class="esports-subtitle">No tournaments found matching your criteria.</p></div>';
    return;
  }

  let cardsHTML = "";
  tournaments.forEach((t) => {
    cardsHTML += buildTournamentCard(t);
  });
  grid.innerHTML = cardsHTML;

  // Attach click and keyboard handlers after rendering
  grid.querySelectorAll(".tournament-card").forEach((card) => {
    const handler = () => {
      const id = parseInt(card.dataset.id, 10);
      const tournament = allTournaments.find((t) => t.id === id);
      if (tournament) openTournamentDetail(tournament);
    };

    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  });
}

function buildTournamentCard(t) {
  const statusLabel = getStatusLabel(t.status);
  const statusClass = t.status;
  const dateRange = t.endDate && t.endDate !== t.date ? `${t.date} – ${t.endDate}` : t.date;

  const winnerBadge = t.winner ? `<div class="card-winner-badge"><i class="bi bi-trophy-fill text-warning me-1"></i>${t.winner}</div>` : "";

  return `
    <div class="col-sm-6 col-lg-4">
      <div class="tournament-card" data-id="${t.id}" data-status="${t.status}" role="button" tabindex="0"
           aria-label="View details for ${t.name}">
        <div class="card-game-logo-wrapper">
          <img src="${resolveImageSrc(t.image || t.gameLogo)}" alt="${t.game}" class="card-game-logo" loading="lazy"
               onerror="this.onerror=null;this.src='${resolveImageSrc(t.gameLogo)}';" />
        </div>
        <div class="card-body-inner">
          <div class="card-top-row">
            <span class="card-status-badge ${statusClass}">${statusLabel}</span>
            <span class="card-game-tag">${t.game}</span>
          </div>
          <h3 class="card-tournament-name">${t.name}</h3>
          <div class="card-meta">
            <span class="card-meta-item"><i class="bi bi-calendar-event me-1"></i>${dateRange}</span>
            <span class="card-meta-item"><i class="bi bi-people-fill me-1"></i>${t.teams} Teams</span>
          </div>
          ${winnerBadge}
          <div class="card-view-btn">View Details & Bracket →</div>
        </div>
      </div>
    </div>
  `;
}

// ── Filters ─────────────────────────────────────────────────────────────────

function setupFilters() {
  document.querySelectorAll(".tournament-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tournament-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      applyFiltersAndSearch();
    });
  });
}

// ── Detail Panel ─────────────────────────────────────────────────────────────

function openTournamentDetail(t) {
  // Populate all fields
  setImageWithFallback(document.getElementById("detailGameLogo"), t.image || t.gameLogo, resolveImageSrc(t.gameLogo));
  const detailLogo = document.getElementById("detailGameLogo");
  if (detailLogo) detailLogo.alt = t.game;

  const detailName = document.getElementById("detailName");
  if (detailName) detailName.textContent = t.name;

  const detailGame = document.getElementById("detailGame");
  if (detailGame) detailGame.textContent = t.game;

  const statusBadge = document.getElementById("detailStatusBadge");
  if (statusBadge) {
    statusBadge.innerHTML = getStatusLabel(t.status);
    statusBadge.className = "detail-status-badge " + t.status;
  }

  const dateRange = t.endDate && t.endDate !== t.date ? `${t.date} – ${t.endDate}` : t.date;
  const detailDate = document.getElementById("detailDate");
  if (detailDate) detailDate.textContent = dateRange;

  const detailLocation = document.getElementById("detailLocation");
  if (detailLocation) detailLocation.textContent = t.location;

  const detailFormat = document.getElementById("detailFormat");
  if (detailFormat) detailFormat.textContent = t.format;

  const detailTeams = document.getElementById("detailTeams");
  if (detailTeams) detailTeams.textContent = `${t.teams} Teams`;

  const detailPrize = document.getElementById("detailPrize");
  if (detailPrize) detailPrize.textContent = t.prizePool || "Certificates & Medals";

  const detailDesc = document.getElementById("detailDescription");
  if (detailDesc) detailDesc.textContent = t.description || "";

  const detailLink = document.getElementById("detailChallongeLink");
  if (detailLink) detailLink.href = t.challongeUrl || "#";

  const detailStream = document.getElementById("detailStreamLink");
  if (detailStream) detailStream.href = t.streamUrl || "https://www.facebook.com/share/p/1DULPU6nF7/";

  // Winner box
  const winnerBox = document.getElementById("detailWinnerBox");
  if (winnerBox) {
    if (t.winner) {
      const winnerName = document.getElementById("detailWinner");
      if (winnerName) winnerName.textContent = t.winner;
      winnerBox.style.display = "block";
    } else {
      winnerBox.style.display = "none";
    }
  }

  // Bracket iframe
  loadBracket(t.challongeEmbed, t.challongeUrl);

  // Show detail panel, hide list section
  const listSection = document.querySelector(".tournament-section");
  if (listSection) listSection.style.display = "none";
  const detailSection = document.getElementById("tournamentDetailSection");
  if (detailSection) detailSection.style.display = "block";

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadBracket(embedUrl, fallbackUrl) {
  const iframe = document.getElementById("challongeBracket");
  const loading = document.getElementById("bracketLoading");
  const fallback = document.getElementById("bracketFallback");
  const fallbackLink = document.getElementById("bracketFallbackLink");

  if (!iframe || !loading || !fallback) return;

  // Reset state
  iframe.style.display = "none";
  loading.style.display = "flex";
  fallback.style.display = "none";
  iframe.src = "";

  if (fallbackLink) fallbackLink.href = fallbackUrl || "#";

  if (embedUrl) {
    const src = embedUrl.endsWith("/module") ? embedUrl : embedUrl + "/module";
    iframe.src = src;

    iframe.onload = () => {
      loading.style.display = "none";
      iframe.style.display = "block";
    };

    iframe.onerror = () => {
      loading.style.display = "none";
      iframe.style.display = "none";
      fallback.style.display = "flex";
    };
  } else {
    loading.style.display = "none";
    fallback.style.display = "flex";
  }

  // Fallback timeout: if iframe doesn't load in 8s show fallback state
  setTimeout(() => {
    if (loading.style.display !== "none") {
      loading.style.display = "none";
      iframe.style.display = "block";
    }
  }, 8000);
}

// ── Back Button ───────────────────────────────────────────────────────────────

function setupBackButton() {
  document.getElementById("tournamentBackBtn").addEventListener("click", () => {
    // Stop the bracket iframe to avoid background loading
    document.getElementById("challongeBracket").src = "";

    document.getElementById("tournamentDetailSection").style.display = "none";
    document.querySelector(".tournament-section").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ── Image Helpers ────────────────────────────────────────────────────────────

/**
 * Resolves an image source that can be:
 *  - A local relative path with any extension (png, jpg, jpeg, webp, gif, svg…)
 *  - A full external URL (http:// or https://)
 * Returns the src string as-is; browsers handle both natively.
 * Falls back to a placeholder if the src is empty/null.
 */
function resolveImageSrc(src) {
  if (!src || src.trim() === "") return "data/images/DEC.png";
  return src.trim();
}

/**
 * Attaches an onerror fallback to an <img> element so a broken
 * image (wrong path, unsupported format, dead URL) shows the
 * provided fallback src instead.
 */
function setImageWithFallback(imgEl, src, fallback) {
  imgEl.src = resolveImageSrc(src);
  imgEl.onerror = function () {
    this.onerror = null; // prevent infinite loop if fallback also fails
    this.src = fallback || "data/images/DEC.png";
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStatusLabel(status) {
  const labels = {
    ongoing: '<i class="bi bi-record-fill me-1"></i> Ongoing',
    upcoming: '<i class="bi bi-clock-history me-1"></i> Upcoming',
    completed: '<i class="bi bi-check-circle-fill me-1"></i> Completed',
  };
  return labels[status] || status;
}
