(function () {
  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str = "") {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cardTemplate(p) {
    const title = escapeHtml(p.title);
    const desc = escapeHtml(p.description);
    const img = escapeHtml(p.image || "");
    const tags = Array.isArray(p.tags) ? p.tags : [];

    const liveBtn = p.live
      ? `<a class="link-btn" href="${p.live}" target="_blank" rel="noreferrer">
           <i class="bx bx-link-external"></i> Live
         </a>`
      : "";

    const repoBtn = p.repo
      ? `<a class="link-btn" href="${p.repo}" target="_blank" rel="noreferrer">
           <i class="bx bxl-github"></i> Repo
         </a>`
      : "";

    return `
      <article class="project-card">
        <div class="project-thumb">
          <img src="${img}" alt="${title}">
        </div>

        <div class="project-body">
          <div class="project-title">${title}</div>
          <div class="project-desc">${desc}</div>

          <div class="project-tags">
            ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
          </div>

          <div class="project-actions">
            ${liveBtn}
            ${repoBtn}
          </div>
        </div>
      </article>
    `;
  }

  function render(list) {
    const grid = el("projectsGrid");
    const empty = el("projectsEmpty");

    if (!grid || !empty) return;

    if (!list || list.length === 0) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");
    grid.innerHTML = list.map(cardTemplate).join("");
  }

  function normalize(s = "") {
    return String(s).toLowerCase().trim();
  }

  function filterProjects(q) {
    const query = normalize(q);
    const data = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

    if (!query) return data;

    return data.filter(p => {
      const inTitle = normalize(p.title).includes(query);
      const inDesc = normalize(p.description).includes(query);
      const inTags = (p.tags || []).some(t => normalize(t).includes(query));
      return inTitle || inDesc || inTags;
    });
  }

  // init saat DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    // render pertama
    render(Array.isArray(window.PROJECTS) ? window.PROJECTS : []);

    // search
    const search = el("projectSearch");
    if (search) {
      search.addEventListener("input", (e) => {
        const filtered = filterProjects(e.target.value);
        render(filtered);
      });
    }
  });
})();
