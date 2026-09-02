// Load teams page content
document.addEventListener("DOMContentLoaded", function () {
  loadTeamsContent();
});

async function loadTeamsContent() {
  try {
    const response = await fetch("data/teams.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const teamsContainer = document.getElementById("teamsContainer");
    if (!teamsContainer || !Array.isArray(data.teams)) return;

    let allTeamsHTML = "";

    data.teams.forEach((team) => {
      let playersHTML = "";
      (team.players || []).forEach((player) => {
        const profileImg = player.profileImage && player.profileImage !== "N/A" ? player.profileImage : "data/images/DEC.png";
        const deptLogo = player.departmentLogo && player.departmentLogo !== "N/A" ? player.departmentLogo : "data/images/DEC.png";
        const details = [player.age, player.position].filter(Boolean).join(" | ");

        playersHTML += `
          <div class="player-card-wrapper">
              <div class="player-card-new">
                  <div class="player-image" style="background-image: url('${profileImg}');">
                      <img src="${deptLogo}" alt="${player.department || "Department"}" class="player-dept-logo" loading="lazy" onerror="this.onerror=null;this.src='data/images/DEC.png';" />
                  </div>
                  <div class="player-info">
                      <div class="player-ign">${player.ign || "N/A"}</div>
                      <div class="player-real-name">${player.name || ""}</div>
                      <div class="player-details">${details}</div>
                  </div>
              </div>
          </div>
        `;
      });

      const gameLogoSrc = team.name && team.name.includes("/") ? team.name : "data/images/DEC.png";
      const teamDescription = team.description || "";

      allTeamsHTML += `
        <div class="team-section" style="background-image: url('${team.backgroundImage || ""}');">
            <div class="team-section-overlay"></div>
            <div class="team-content">
                <div class="team-header">
                    <img src="${gameLogoSrc}" alt="${teamDescription || "Game Logo"}" class="game-logo" loading="lazy" onerror="this.onerror=null;this.src='data/images/DEC.png';" />
                    ${teamDescription ? `<span class="team-title d-none d-md-inline ms-3">${teamDescription}</span>` : ""}
                </div>
                <div class="players-carousel">
                    ${playersHTML}
                </div>
            </div>
        </div>
      `;
    });

    teamsContainer.innerHTML = allTeamsHTML;

    // Update footer
    const footerText = document.getElementById("footerText");
    if (footerText) {
      footerText.textContent = "DOrSU Esports Community - Where strategy meets skills.";
    }
  } catch (error) {
    console.error("Error loading teams content:", error);
  }
}
