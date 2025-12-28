// js/app.js

// ============ Helpers ============
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Theme (Light/Dark optional) ============
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  });
}

// Optional light theme CSS via class
// (kalau kamu mau full light theme, nanti aku bisa bikinin versi lengkapnya)

// ============ Mobile Nav ============
const navToggle = $("#navToggle");
const navPanel = $("#navPanel");

if (navToggle && navPanel) {
  navToggle.addEventListener("click", () => {
    const open = navPanel.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // close menu after click link (mobile)
  $$(".nav__link", navPanel).forEach((a) => {
    a.addEventListener("click", () => {
      navPanel.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // close when click outside
  document.addEventListener("click", (e) => {
    const isInside = navPanel.contains(e.target) || navToggle.contains(e.target);
    if (!isInside) {
      navPanel.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ============ Active Nav on Scroll ============
const sections = $$("main section[id]");
const navLinks = $$(".nav__link");

const setActive = () => {
  const scrollY = window.scrollY + 120;
  let currentId = "home";

  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollY >= top && scrollY < top + height) currentId = sec.id;
  });

  navLinks.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActive);
window.addEventListener("load", setActive);

// ============ Reveal on Scroll ============
const revealEls = $$(".reveal");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) ent.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

// ============ Projects Render + Filter ============
const grid = $("#projectGrid");
const chipContainer = $("#chipContainer");
const searchInput = $("#searchInput");

let activeTag = "All";
let keyword = "";

const uniqTags = () => {
  const set = new Set(["All"]);
  PROJECTS.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
  return [...set];
};

const renderChips = () => {
  if (!chipContainer) return;

  chipContainer.innerHTML = "";
  uniqTags().forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (tag === activeTag ? " active" : "");
    btn.textContent = tag;

    btn.addEventListener("click", () => {
      activeTag = tag;
      renderChips();
      renderProjects();
    });

    chipContainer.appendChild(btn);
  });
};

const matches = (p) => {
  const tagOk = activeTag === "All" || (p.tags || []).includes(activeTag);
  const text = `${p.title} ${p.summary} ${p.description} ${(p.tags || []).join(" ")}`.toLowerCase();
  const keyOk = !keyword || text.includes(keyword.toLowerCase());
  return tagOk && keyOk;
};

const projectCard = (p) => {
  const div = document.createElement("article");
  div.className = "project";
  div.tabIndex = 0;

  div.innerHTML = `
    <img class="project__img" src="${p.image}" alt="${p.title}" loading="lazy" />
    <div class="project__body">
      <div class="project__title">${p.title}</div>
      <div class="project__meta">${p.summary}</div>
      <div class="project__tags">
        ${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>
  `;

  const open = () => openModal(p);
  div.addEventListener("click", open);
  div.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") open();
  });

  return div;
};

const renderProjects = () => {
  if (!grid) return;

  const data = PROJECTS.filter(matches);
  grid.innerHTML = "";

  if (data.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sub";
    empty.textContent = "Project tidak ditemukan. Coba kata kunci lain.";
    grid.appendChild(empty);
    return;
  }

  data.forEach((p) => grid.appendChild(projectCard(p)));
};

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    keyword = e.target.value.trim();
    renderProjects();
  });
}

renderChips();
renderProjects();

// ============ Modal ============
const modal = $("#projectModal");
const modalContent = $("#modalContent");

function openModal(p) {
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal__hero">
      <img src="${p.image}" alt="${p.title}" />
    </div>

    <div class="modal__title">${p.title}</div>
    <div class="modal__desc">${p.description || p.summary}</div>

    <div class="project__tags" style="margin-top:12px;">
      ${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}
      ${p.year ? `<span class="tag">${p.year}</span>` : ""}
    </div>

    <div class="modal__links">
      ${p.liveUrl && p.liveUrl !== "#" ? `<a class="btn" href="${p.liveUrl}" target="_blank" rel="noreferrer">Live Demo <i class="bx bx-link-external"></i></a>` : ""}
      ${p.repoUrl && p.repoUrl !== "#" ? `<a class="btn btn--ghost" href="${p.repoUrl}" target="_blank" rel="noreferrer">Repository <i class="bx bxl-github"></i></a>` : ""}
    </div>
  `;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close === "true") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });
}

// ============ Contact Form (opens mail client) ============
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#name")?.value?.trim() || "";
    const email = $("#email")?.value?.trim() || "";
    const subject = $("#subject")?.value?.trim() || "";
    const message = $("#message")?.value?.trim() || "";

    const to = "galuh_abada@teknokrat.ac.id";
    const body = `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`;
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}
