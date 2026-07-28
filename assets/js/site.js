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

  const viewer = document.querySelector("[data-results-viewer]");
  if (viewer) {
    const frame = viewer.querySelector("[data-results-frame]");
    const openResult = viewer.querySelector("[data-open-result]");
    const loading = viewer.querySelector("[data-frame-loading]");
    const tabs = [...viewer.querySelectorAll("[data-result-src]")];

    const resizeFrame = () => {
      try {
        const html = frame.contentDocument.documentElement.scrollHeight;
        const body = frame.contentDocument.body.scrollHeight;
        frame.style.height = `${Math.max(html, body, 760) + 18}px`;
      } catch {
        frame.style.height = "1080px";
      }
    };
    frame.addEventListener("load", () => {
      loading.hidden = true;
      resizeFrame();
      setTimeout(resizeFrame, 350);
    });
    addEventListener("resize", resizeFrame);

    tabs.forEach((tab) => tab.addEventListener("click", () => {
      if (tab.classList.contains("is-active")) return;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      loading.hidden = false;
      frame.title = `${tab.dataset.resultLabel} del torneo Yago Arena Swiss 2026`;
      frame.src = tab.dataset.resultSrc;
      openResult.href = tab.dataset.resultSrc;
    }));
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
