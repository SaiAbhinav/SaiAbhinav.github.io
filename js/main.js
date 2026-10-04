/* =========================================================
   Portfolio — behaviour
   Plain script (no ES modules / fetch) so it runs from file://.
   Organised as small, self-contained modules inside one IIFE.
   ========================================================= */
(function () {
  "use strict";

  const DATA = window.PORTFOLIO_DATA || {};
  const PROFILE = window.PORTFOLIO_PROFILE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Utils ---------- */
  const Util = {
    esc(str = "") {
      return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },
    /** "Aug 2023" -> month index since year 0 */
    monthIndex(label) {
      const m = /^([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec((label || "").trim());
      if (!m) return null;
      const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const mi = months.indexOf(m[1].toLowerCase());
      return mi < 0 ? null : Number(m[2]) * 12 + mi;
    },
    /** inclusive month count; "Present" end uses today */
    monthsBetween(start, end) {
      const s = Util.monthIndex(start);
      const now = new Date();
      const e = /present|current|now/i.test(end || "") ? now.getFullYear() * 12 + now.getMonth() : Util.monthIndex(end);
      return s == null || e == null ? 0 : Math.max(1, e - s + 1);
    },
    durationLabel(months) {
      const y = Math.floor(months / 12), m = months % 12;
      const parts = [];
      if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
      if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
      return parts.join(" ");
    },
    /** Remove exact and near-duplicate bullet points */
    dedupe(list = []) {
      const seen = new Set();
      return list.filter((t) => {
        const key = t.toLowerCase().replace(/\b(with|by|backed|using|the|a|an)\b/g, "").replace(/[^a-z0-9]/g, "");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
    normTech(t) {
      return t.trim().toLowerCase().replace(/\s+/g, " ");
    },
    chips(list = []) {
      return list.map((t) => `<li class="chip">${Util.esc(t)}</li>`).join("");
    },
  };

  /* ---------- Icons (inline SVG) ---------- */
  const Icons = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    award: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.8 7 22l5-3 5 3-1.5-8.2"/><path d="m9.8 9 1.5 1.5L14.5 7.5"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.3V17h16V7.3l-8 5.6-8-5.6zM5.3 7 12 11.7 18.7 7H5.3z"/></svg>',
  };

  /* ---------- Skill icons (Devicon font, https://devicon.dev) ----------
     Keyed by the "icon" file name in data.json (or the skill name).
     [devicon class, colour] — colours tuned to read on the dark theme.
     Skills without a Devicon get a monogram badge.                       */
  const DEVICON = {
    javascript: ["devicon-javascript-plain", "#f0db4f"],
    typescript: ["devicon-typescript-plain", "#3b8eea"],
    php: ["devicon-php-plain", "#8892bf"],
    html5: ["devicon-html5-plain", "#e54d26"],
    css3: ["devicon-css3-plain", "#3d8fc6"],
    sass: ["devicon-sass-original", "#cc6699"],
    java: ["devicon-java-plain", "#ea2d2e"],
    python: ["devicon-python-plain", "#ffd845"],
    angular: ["devicon-angular-plain", "#e23237"],
    materialui: ["devicon-materialui-plain", "#1fa6ca"],
    react: ["devicon-react-original", "#61dafb"],
    flutter: ["devicon-flutter-plain", "#3fb6d3"],
    tailwindcss: ["devicon-tailwindcss-original", "#38bdf8"],
    bootstrap: ["devicon-bootstrap-plain", "#8c5cf9"],
    chartjs: ["devicon-chartjs-plain", "#ff6384"],
    nodejs: ["devicon-nodejs-plain", "#5fa04e"],
    express: ["devicon-express-original", "currentColor"],
    jquery: ["devicon-jquery-plain", "#1c8fd8"],
    json: ["devicon-json-plain", "currentColor"],
    mysql: ["devicon-mysql-original", "#4c9cc4"],
    mongodb: ["devicon-mongodb-plain", "#4faa41"],
    gitbash: ["devicon-git-plain", "#f34f29"],
    github: ["devicon-github-original", "currentColor"],
    gitlab: ["devicon-gitlab-plain", "#e24329"],
  };
  const SkillIcon = {
    key(skill) {
      return (skill.icon || skill.name).toLowerCase().replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]/g, "");
    },
    monogram(name) {
      const clean = name.replace(/\(.*?\)|\.js$/gi, "").trim();
      const words = clean.split(/\s+/);
      return (words.length > 1 ? words[0][0] + words[1][0] : clean.slice(0, 2)).toUpperCase();
    },
    html(skill) {
      const hit = DEVICON[SkillIcon.key(skill)];
      return hit
        ? `<span class="skill-icon"><i class="${hit[0]}" style="color:${hit[1]}" aria-hidden="true"></i></span>`
        : `<span class="skill-icon mono-fallback" aria-hidden="true">${Util.esc(SkillIcon.monogram(skill.name))}</span>`;
    },
  };

  /* ---------- Profile / hero ---------- */
  const Profile = {
    render() {
      const p = PROFILE;
      $$("[data-name]").forEach((el) => (el.textContent = p.name || ""));
      $$("[data-initials]").forEach((el) => (el.textContent = p.initials || ""));
      $("[data-role]").textContent = p.role || "";
      $("[data-tagline]").textContent = p.tagline || "";
      $("[data-location]").textContent = p.location ? `📍 ${p.location}` : "";
      $("[data-year]").textContent = new Date().getFullYear();

      // Hero actions
      $$("[data-email-link]").forEach((a) => (a.href = p.email ? `mailto:${p.email}` : "#"));
      $$("[data-linkedin-link]").forEach((a) => {
        if (p.socials && p.socials.linkedin) a.href = p.socials.linkedin;
        else console.warn("Add your LinkedIn URL in js/profile.js (socials.linkedin)");
      });

      // Avatar with initials fallback
      const frame = $("[data-avatar]");
      frame.innerHTML = `<span class="portrait-initials" aria-hidden="true">${Util.esc(p.initials || "")}</span>`;
      if (p.avatar) {
        const img = new Image();
        img.alt = `Portrait of ${p.name}`;
        img.onload = () => { frame.innerHTML = ""; frame.appendChild(img); };
        img.src = p.avatar;
      }

      // About + education
      $("[data-about]").innerHTML = (p.about || []).map((t) => `<p>${Util.esc(t)}</p>`).join("");
      $("[data-education]").innerHTML = (p.education || [])
        .map((e) => `<li><strong>${Util.esc(e.degree)}</strong><span>${Util.esc(e.school)}${e.place ? " · " + Util.esc(e.place) : ""}</span></li>`)
        .join("");
    },
  };

  /* ---------- Experience ---------- */
  const Experience = {
    PREVIEW: 3,
    logo(company) {
      const src = (PROFILE.companyLogos || {})[company];
      return src ? `<img class="tl-logo" src="${Util.esc(src)}" alt="" loading="lazy" onerror="this.remove()">` : "";
    },
    render() {
      const list = $("[data-experience]");
      list.innerHTML = (DATA.experiences || [])
        .map((x, i) => {
          const months = Util.monthsBetween(x.startDate, x.endDate);
          // The summary is often a repeat of the first bullet — skip it in that case.
          const bullets = Util.dedupe(x.responsibilities).filter((b) => b !== x.summary);
          const head = bullets.slice(0, Experience.PREVIEW);
          const rest = bullets.slice(Experience.PREVIEW);
          const id = `exp-more-${i}`;
          return `
          <li class="tl-item reveal">
            <div class="tl-when">
              <time>${Util.esc(x.startDate)} — ${Util.esc(x.endDate)}</time>
              <span class="dur">${Util.durationLabel(months)}</span>
            </div>
            <article class="tl-card card">
              <div class="tl-head">
                ${Experience.logo(x.company)}
                <div>
                  <h3>${Util.esc(x.role)}</h3>
                  <p class="tl-company">${Util.esc(x.company)}</p>
                </div>
              </div>
              <p class="tl-summary">${Util.esc(x.summary)}</p>
              <ul class="bullets">${head.map((b) => `<li>${Util.esc(b)}</li>`).join("")}</ul>
              ${rest.length ? `<div class="tl-details" id="${id}"><div><ul class="bullets" style="padding-top:10px">${rest.map((b) => `<li>${Util.esc(b)}</li>`).join("")}</ul></div></div>` : ""}
              <div class="tl-foot">
                ${rest.length ? `<button class="toggle-btn" type="button" aria-expanded="false" aria-controls="${id}" data-more="${rest.length}">Show ${rest.length} more</button>` : ""}
                <ul class="chips" aria-label="Technologies">${Util.chips(x.technologies)}</ul>
              </div>
            </article>
          </li>`;
        })
        .join("");

      list.addEventListener("click", (e) => {
        const btn = e.target.closest(".toggle-btn");
        if (!btn) return;
        const item = btn.closest(".tl-item");
        const open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
        btn.textContent = open ? "Show less" : `Show ${btn.dataset.more} more`;
      });
    },
  };

  /* ---------- Projects (+ filters + modal) ---------- */
  const Projects = {
    render() {
      const projects = DATA.projects || [];
      const grid = $("[data-projects]");

      grid.innerHTML =
        projects
          .map((p, i) => {
            const techs = (p.technologies || []).map(Util.normTech).join("|");
            return `
          <article class="project card reveal" role="button" tabindex="0" data-index="${i}" data-tech="${Util.esc(techs)}" style="--d:${(i % 3) * 0.08}s" aria-haspopup="dialog">
            <span class="project-top">
              <span class="project-idx">${String(i + 1).padStart(2, "0")}</span>
              <span class="project-arrow">${Icons.arrow}</span>
            </span>
            <h3>${Util.esc(p.title)}</h3>
            <p>${Util.esc(p.summary)}</p>
            ${p.technologies && p.technologies.length ? `<ul class="chips">${Util.chips(p.technologies.slice(0, 5))}${p.technologies.length > 5 ? `<li class="chip">+${p.technologies.length - 5}</li>` : ""}</ul>` : ""}
          </article>`;
          })
          .join("") + `<p class="project-empty" hidden>No projects with that technology yet.</p>`;

      Projects.renderFilters(projects);
      grid.addEventListener("click", (e) => {
        const card = e.target.closest(".project");
        if (card) Modal.open(projects[Number(card.dataset.index)], Number(card.dataset.index));
      });
      grid.addEventListener("keydown", (e) => {
        const card = e.target.closest(".project");
        if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); card.click(); }
      });
    },

    renderFilters(projects) {
      // Count technologies case-insensitively, keep first-seen display label
      const counts = new Map();
      projects.forEach((p) =>
        (p.technologies || []).forEach((t) => {
          const k = Util.normTech(t);
          const cur = counts.get(k) || { label: t, n: 0 };
          cur.n++;
          counts.set(k, cur);
        })
      );
      const sorted = [...counts.entries()].sort((a, b) => b[1].n - a[1].n || a[1].label.localeCompare(b[1].label));
      const bar = $("[data-filters]");
      if (!sorted.length) return bar.remove();

      bar.innerHTML =
        `<button class="filter" type="button" data-filter="*" aria-pressed="true">All · ${projects.length}</button>` +
        sorted.map(([k, v]) => `<button class="filter" type="button" data-filter="${Util.esc(k)}" aria-pressed="false">${Util.esc(v.label)}</button>`).join("");

      bar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter");
        if (!btn) return;
        $$(".filter", bar).forEach((b) => b.setAttribute("aria-pressed", b === btn));
        const f = btn.dataset.filter;
        let shown = 0;
        $$(".project").forEach((card) => {
          const match = f === "*" || card.dataset.tech.split("|").includes(f);
          card.classList.toggle("is-hidden", !match);
          if (match) { shown++; card.classList.add("in"); }
        });
        $(".project-empty").hidden = shown > 0;
      });
    },
  };

  const Modal = {
    el: null,
    init() {
      Modal.el = $("#project-modal");
      Modal.el.addEventListener("click", (e) => {
        // close on backdrop click or close button
        if (e.target === Modal.el || e.target.closest("[data-close]")) Modal.el.close();
      });
    },
    open(p, i) {
      if (!p) return;
      const m = Modal.el;
      $("[data-modal-index]", m).textContent = `Project ${String(i + 1).padStart(2, "0")}`;
      $("[data-modal-title]", m).textContent = p.title;
      $("[data-modal-summary]", m).textContent = p.summary;
      $("[data-modal-bullets]", m).innerHTML = Util.dedupe(p.responsibilities).map((b) => `<li>${Util.esc(b)}</li>`).join("");
      $("[data-modal-tech]", m).innerHTML = Util.chips(p.technologies);
      if (typeof m.showModal === "function") m.showModal();
      else m.setAttribute("open", "");
    },
  };

  /* ---------- Skills ---------- */
  const Skills = {
    render() {
      const wrap = $("[data-skills]");
      wrap.innerHTML = (DATA.skills || [])
        .map(
          (g, gi) => `
        <section class="skill-group card reveal" style="--d:${(gi % 3) * 0.08}s">
          <h3>${Util.esc(g.title)}</h3>
          <ul class="skill-list">
            ${(g.skills || []).map((s) => `<li class="skill">${SkillIcon.html(s)}${Util.esc(s.name)}</li>`).join("")}
          </ul>
        </section>`
        )
        .join("");
    },
  };

  /* ---------- Achievements ---------- */
  const Achievements = {
    render() {
      const list = DATA.achievements || [];
      const wrap = $("[data-achievements]");
      if (!list.length) return $("#achievements").remove();
      wrap.innerHTML = list
        .map(
          (a) => `
        <article class="achievement card reveal">
          <div class="badge">${Icons.award}</div>
          <div>
            <p class="mono label" style="margin:0">${Util.esc((a.type || "").toLowerCase())}</p>
            <h3>${a.link ? `<a href="${Util.esc(a.link)}" target="_blank" rel="noopener">${Util.esc(a.title)}</a>` : Util.esc(a.title)}</h3>
            <p class="muted" style="margin:0">${Util.esc(a.issuer || "")}</p>
          </div>
        </article>`
        )
        .join("");
    },
  };

  /* ---------- Navigation (floating dock) ---------- */
  const Nav = {
    init() {
      const dock = $(".dock");
      const indicator = $(".dock-indicator");
      const links = $$(".dock a");
      const progress = $(".scroll-progress");
      const hero = $("#home");

      // Slide the highlight pill under the active link
      const moveTo = (a) => {
        links.forEach((l) => l.classList.toggle("active", l === a));
        if (!a) return (indicator.style.opacity = 0);
        indicator.style.opacity = 1;
        indicator.style.width = `${a.offsetWidth}px`;
        indicator.style.transform = `translateX(${a.offsetLeft}px)`;
      };
      let current = null;

      // Show the dock once the hero is mostly out of view; update progress
      let ticking = false;
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
        dock.classList.toggle("show", scrollY > hero.offsetHeight * 0.55);
        ticking = false;
      };
      addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      addEventListener("resize", () => moveTo(current));
      onScroll();

      // Active section tracking
      const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return;
          current = map.get(e.target.id) || null;
          moveTo(current);
        }),
        { rootMargin: "-45% 0px -50% 0px" }
      );
      $$("main section[id]").forEach((s) => io.observe(s));
    },
  };

  /* ---------- Parallax ----------
     data-parallax="speed" on any element:
       speed > 0  -> lags behind the scroll (feels further away)
       speed < 0  -> runs ahead of the scroll (feels closer)
     data-parallax-x="speed" moves sideways instead.
     Uses the CSS `translate` property, so it composes with existing transforms.
     Disabled for prefers-reduced-motion.                                     */
  const Parallax = {
    items: [],
    init() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Section watermarks: big outlined copy of each section title
      $$(".section-head h2").forEach((h2) => {
        const w = document.createElement("span");
        w.className = "watermark";
        w.setAttribute("aria-hidden", "true");
        w.dataset.parallaxX = "-0.35";
        w.textContent = h2.textContent;
        h2.parentElement.prepend(w);
      });

      // Projects: the middle column floats at its own pace (wide screens only)
      const wide = matchMedia("(min-width: 900px)");
      const tagProjects = () => {
        const cards = $$(".project:not(.is-hidden)");
        const lefts = [...new Set(cards.map((c) => c.offsetLeft))].sort((a, b) => a - b);
        cards.forEach((c) => {
          const col = lefts.indexOf(c.offsetLeft);
          if (wide.matches && lefts.length === 3 && col === 1) c.dataset.parallax = "-0.08";
          else { delete c.dataset.parallax; c.style.translate = ""; }
        });
        Parallax.collect();
      };
      tagProjects();
      $("[data-filters]") && $("[data-filters]").addEventListener("click", () => requestAnimationFrame(tagProjects));
      addEventListener("resize", () => { tagProjects(); Parallax.update(); });

      // Only animate what's on screen
      Parallax.visible = new Set();
      Parallax.io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? Parallax.visible.add(e.target) : Parallax.visible.delete(e.target)));
      }, { rootMargin: "25% 0px" });
      Parallax.collect();

      let ticking = false;
      addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { Parallax.update(); ticking = false; });
      }, { passive: true });
      Parallax.update();
      Parallax.tilt();
    },

    collect() {
      if (!Parallax.io) return;
      Parallax.items.forEach((el) => Parallax.io.unobserve(el));
      Parallax.items = $$("[data-parallax], [data-parallax-x]");
      Parallax.items.forEach((el) => { el._p = el._p || { x: 0, y: 0 }; Parallax.io.observe(el); });
    },

    update() {
      const vh = innerHeight;
      document.documentElement.style.setProperty("--grid-y", `${(-scrollY * 0.3).toFixed(1)}px`);
      Parallax.items.forEach((el) => {
        if (!Parallax.visible.has(el)) return;
        const r = el.getBoundingClientRect();
        // distance of the element's untranslated centre from the viewport centre
        const d = r.top + r.height / 2 - el._p.y - vh / 2;
        const sy = parseFloat(el.dataset.parallax || 0);
        const sx = parseFloat(el.dataset.parallaxX || 0);
        el._p.y = -d * sy;
        el._p.x = -d * sx;
        el.style.translate = `${el._p.x.toFixed(1)}px ${el._p.y.toFixed(1)}px`;
      });
    },

    // Gentle 3D tilt of the avatar following the pointer (mouse only)
    tilt() {
      const frame = $("[data-tilt]");
      const hero = $("#home");
      if (!frame || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        frame.style.setProperty("--tilt-y", `${(nx * 10).toFixed(2)}deg`);
        frame.style.setProperty("--tilt-x", `${(-ny * 8).toFixed(2)}deg`);
      });
      hero.addEventListener("pointerleave", () => {
        frame.style.setProperty("--tilt-y", "0deg");
        frame.style.setProperty("--tilt-x", "0deg");
      });
    },
  };

  /* ---------- Reveal on scroll ---------- */
  const Reveal = {
    init() {
      const els = $$(".reveal");
      if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => io.observe(el));
    },
  };

  /* ---------- Boot ---------- */
  function boot() {
    Profile.render();
    Experience.render();
    Projects.render();
    Skills.render();
    Achievements.render();

    Nav.init();
    Modal.init();
    Reveal.init();
    Parallax.init();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
