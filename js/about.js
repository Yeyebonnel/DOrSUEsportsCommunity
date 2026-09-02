// Load about page content
document.addEventListener("DOMContentLoaded", function () {
  loadAboutContent();
});

async function loadAboutContent() {
  try {
    const response = await fetch("data/about.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Update header
    const aboutTitle = document.getElementById("aboutTitle");
    const aboutSubtitle = document.getElementById("aboutSubtitle");
    if (aboutTitle && data.header?.title) aboutTitle.textContent = data.header.title;
    if (aboutSubtitle && data.header?.subtitle) aboutSubtitle.textContent = data.header.subtitle;

    // Update mission
    const missionTitle = document.getElementById("missionTitle");
    const missionText = document.getElementById("missionText");
    if (missionTitle && data.mission?.title) missionTitle.textContent = data.mission.title;
    if (missionText && data.mission?.text) missionText.textContent = data.mission.text;

    // Load values
    const valuesContainer = document.getElementById("valuesContainer");
    if (valuesContainer && Array.isArray(data.values)) {
      let valuesHTML = "";
      data.values.forEach((value) => {
        const iconHTML = value.icon ? (value.icon.startsWith("bi ") ? `<i class="${value.icon}"></i>` : value.icon) : "";
        valuesHTML += `
          <div class="col-md-6 col-lg-3 mb-4">
              <div class="card text-center h-100">
                  <div class="card-body">
                      <div class="feature-icon">${iconHTML}</div>
                      <h3 class="card-title h5">${value.title}</h3>
                      <p class="card-text">${value.description}</p>
                  </div>
              </div>
          </div>
        `;
      });
      valuesContainer.innerHTML = valuesHTML;
    }

    // Update footer
    const footerText = document.getElementById("footerText");
    if (footerText) {
      footerText.textContent = "DOrSU Esports Community - Where strategy meets skills.";
    }

    // Load organizational chart from separate file
    loadOrganizationalChart();
  } catch (error) {
    console.error("Error loading about content:", error);
  }
}

async function loadOrganizationalChart() {
  try {
    const response = await fetch("data/officers.json?v=" + new Date().getTime());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const orgData = data.organizationalChart;
    renderOrganizationalChart(orgData);
    renderCommitteeCharts(orgData);
  } catch (error) {
    console.error("Error loading organizational chart:", error);
  }
}

function renderOrganizationalChart(orgData) {
  const container = document.getElementById("orgChartContainer");
  if (!container || !orgData || !Array.isArray(orgData.officers)) return;

  const sortedOfficers = orgData.officers;

  let chartHTML = `
    <div class="org-chart-header">
      <h2 class="org-chart-title">Leadership</h2>
    </div>
    <div class="org-carousel-container">
      <div class="org-carousel" id="orgCarousel">
  `;

  sortedOfficers.forEach((officer) => {
    chartHTML += `
      <div class="org-card">
        <div class="org-card-level-badge">${officer.level || "Member"}</div>
        <div class="org-card-image-container">
          <img src="${officer.image || "data/images/DEC.png"}" alt="${officer.name}" class="org-card-image" loading="lazy" onerror="this.onerror=null;this.src='data/images/DEC.png'" />
        </div>
        <div class="org-card-content">
          <h3 class="org-card-name">${officer.name}</h3>
          <div class="org-card-position">${officer.position}</div>
          <div class="org-card-year-program">${officer.yearProgram}</div>
        </div>
      </div>
    `;
  });

  chartHTML += `
      </div>
    </div>
  `;

  container.innerHTML = chartHTML;
}

function renderCommitteeCharts(orgData) {
  if (!orgData) return;
  const committees = orgData.committees || {};

  const committeeMap = [
    { id: "committee-media", name: "Media" },
    { id: "committee-logistics", name: "Logistics" },
    { id: "committee-groupprep", name: "Group Prep" },
    { id: "committee-intelligence", name: "Intelligence" },
  ];

  committeeMap.forEach((c) => {
    const container = document.getElementById(c.id);
    if (!container) return;

    const members = committees[c.name] || [];

    let html = `
      <div class="org-chart-header">
        <h3 class="org-chart-title">${c.name} Committee</h3>
      </div>
      <div class="org-carousel-container">
        <div class="org-carousel">
    `;

    if (members.length === 0) {
      html += `
        <div class="org-card">
          <div class="org-card-content">
            <p class="text-muted">No members listed.</p>
          </div>
        </div>
      `;
    } else {
      members.forEach((member) => {
        html += `
          <div class="org-card">
            <div class="org-card-level-badge">${member.level || "Member"}</div>
            <div class="org-card-image-container">
              <img src="${member.image || "data/images/DEC.png"}" alt="${member.name}" class="org-card-image" loading="lazy" onerror="this.onerror=null;this.src='data/images/DEC.png'" />
            </div>
            <div class="org-card-content">
              <h3 class="org-card-name">${member.name}</h3>
              <div class="org-card-position">${member.position || member.role || ""}</div>
              <div class="org-card-year-program">${member.yearProgram || ""}</div>
            </div>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  });
}
