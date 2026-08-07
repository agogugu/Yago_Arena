(() => {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const updateHeader = () => header?.classList.toggle("is-scrolled", scrollY > 140);
  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });

  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -35px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) {
    heroStats.setAttribute("aria-label", "Statistiche dell'ultimo torneo");
    heroStats.innerHTML = `
      <div><dt>16</dt><dd>motori</dd></div>
      <div><dt>160</dt><dd>partite</dd></div>
      <div><dt>15+3</dt><dd>tempo</dd></div>`;
  }

  const resultsHeading = document.querySelector("#risultati .section-heading > p");
  if (resultsHeading) {
    resultsHeading.textContent = "Consulta i risultati del torneo Swiss e del successivo Top 16 a eliminazione diretta. I dati sono esportati direttamente da Yago Arena.";
  }

  const oldKnockoutNote = [...document.querySelectorAll("#note li p")]
    .find((node) => node.textContent.includes("Tra pochi giorni inizierà un torneo a eliminazione diretta"));
  if (oldKnockoutNote) {
    oldKnockoutNote.textContent = "Il torneo a eliminazione diretta tra i migliori sedici engine della classifica Swiss si è concluso il 7 agosto 2026: Pikafish 2026-01-31 ha vinto il titolo davanti a Pikafish 2026-01-02 OS e CCStockfish 2022-11-25.";
  }

  const viewer = document.querySelector("[data-results-viewer]");
  let selectResult = null;
  if (viewer) {
    const frame = viewer.querySelector("[data-results-frame]");
    const frameShell = viewer.querySelector(".frame-shell");
    const openResult = viewer.querySelector("[data-open-result]");
    const loading = viewer.querySelector("[data-frame-loading]");
    const tabsRoot = viewer.querySelector(".tabs");

    frameShell.style.minHeight = "0";
    const resultsSection = document.querySelector(".results-section");
    if (resultsSection) resultsSection.style.paddingBottom = "48px";

    tabsRoot.innerHTML = `
      <button class="tab is-active" type="button" role="tab" aria-selected="true"
        data-result-src="swiss_arena_Swiss_20260724_1310.html"
        data-result-label="Classifica e turni"
        data-result-tournament="Yago Arena Swiss 2026"
        data-result-hash="risultati-swiss">Swiss · classifica</button>
      <button class="tab" type="button" role="tab" aria-selected="false"
        data-result-src="crosstable_arena_Swiss_20260724_1310.html"
        data-result-label="Tabellone incrociato"
        data-result-tournament="Yago Arena Swiss 2026"
        data-result-hash="risultati-swiss-incroci">Swiss · incroci</button>
      <button class="tab" type="button" role="tab" aria-selected="false"
        data-result-src="knockout_arena_knockout_20260728_1702.html"
        data-result-label="Tabellone knockout"
        data-result-tournament="Top 16 Knockout 2026"
        data-result-hash="risultati-knockout">Knockout · tabellone</button>
      <button class="tab" type="button" role="tab" aria-selected="false"
        data-result-src="crosstable_arena_knockout_20260728_1702.html"
        data-result-label="Tabella risultati knockout"
        data-result-tournament="Top 16 Knockout 2026"
        data-result-hash="risultati-knockout-tabella">Knockout · tabella</button>`;

    const tabs = [...tabsRoot.querySelectorAll("[data-result-src]")];

    const resizeFrame = () => {
      try {
        frame.style.height = "1px";
        const doc = frame.contentDocument;
        const html = doc.documentElement;
        const body = doc.body;
        const contentHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        frame.style.height = `${Math.max(contentHeight, 80) + 4}px`;
      } catch {
        frame.style.height = "1080px";
      }
    };

    frame.addEventListener("load", () => {
      loading.hidden = true;
      resizeFrame();
      setTimeout(resizeFrame, 100);
      setTimeout(resizeFrame, 400);
    });
    addEventListener("resize", resizeFrame);

    selectResult = (tab, updateHash = true) => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      loading.hidden = false;
      frame.style.height = "160px";
      frame.title = `${tab.dataset.resultLabel} del torneo ${tab.dataset.resultTournament}`;
      frame.src = tab.dataset.resultSrc;
      openResult.href = tab.dataset.resultSrc;
      if (updateHash && tab.dataset.resultHash) {
        history.replaceState(null, "", `#${tab.dataset.resultHash}`);
      }
    };

    tabs.forEach((tab) => tab.addEventListener("click", () => {
      if (!tab.classList.contains("is-active")) selectResult(tab);
      else if (tab.dataset.resultHash) history.replaceState(null, "", `#${tab.dataset.resultHash}`);
    }));

    const openFromHash = () => {
      const hash = location.hash.replace(/^#/, "");
      if (!hash) return false;
      const target = tabs.find((tab) => tab.dataset.resultHash === hash);
      if (!target) return false;
      selectResult(target, false);
      requestAnimationFrame(() => document.querySelector("#risultati")?.scrollIntoView());
      return true;
    };

    openFromHash();
    addEventListener("hashchange", openFromHash);
  }

  const knockoutCard = document.querySelector(".next-card");
  if (knockoutCard) {
    knockoutCard.innerHTML = `
      <div class="next-piece" aria-hidden="true">將</div>
      <p class="kicker">7 agosto 2026 · Knockout concluso</p>
      <h3>Top 16 Engine</h3>
      <p>Pikafish 2026-01-31 conquista il torneo a eliminazione diretta. Secondo Pikafish 2026-01-02 OS; terzo CCStockfish 2022-11-25.</p>
      <small><span aria-hidden="true"></span>16 engine · 160 partite · 15min + 3s</small>`;
    knockoutCard.setAttribute("role", "button");
    knockoutCard.setAttribute("tabindex", "0");
    knockoutCard.setAttribute("aria-label", "Apri i risultati del torneo Top 16 Knockout 2026");
    knockoutCard.style.cursor = "pointer";

    const openKnockout = () => {
      const knockoutTab = viewer?.querySelector('[data-result-hash="risultati-knockout"]');
      if (knockoutTab && selectResult) selectResult(knockoutTab);
      else history.replaceState(null, "", "#risultati-knockout");
      document.querySelector("#risultati")?.scrollIntoView({ behavior: "smooth" });
    };
    knockoutCard.addEventListener("click", openKnockout);
    knockoutCard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openKnockout();
      }
    });
  }

  const body = document.querySelector("[data-engine-body]");
  if (body) {
    const rows = [...body.querySelectorAll("tr")];
    const search = document.querySelector("[data-engine-search]");
    const filters = [...document.querySelectorAll("[data-engine-filter]")];
    const count = document.querySelector("[data-engine-count]");
    const noResults = document.querySelector("[data-no-engines]");
    let active = "all";

    const update = () => {
      const query = search.value.trim().toLocaleLowerCase("it");
      let visible = 0;
      rows.forEach((row) => {
        const filterMatch = active === "all" || row.dataset.nnue === active || (active === "yes" && row.dataset.nnue === "bin");
        const searchMatch = !query || row.textContent.toLocaleLowerCase("it").includes(query);
        row.hidden = !(filterMatch && searchMatch);
        if (!row.hidden) visible += 1;
      });
      count.textContent = visible;
      noResults.hidden = visible !== 0;
    };
    search.addEventListener("input", update);
    filters.forEach((button) => button.addEventListener("click", () => {
      active = button.dataset.engineFilter;
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      update();
    }));
  }
})();
