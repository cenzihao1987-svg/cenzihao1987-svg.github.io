const revealItems = document.querySelectorAll(".reveal");
const siteHeader = document.querySelector(".site-header");
const heroPortrait = document.querySelector(".hero-portrait");
const profileCard = document.querySelector(".profile-card");
const projectTocLinks = Array.from(document.querySelectorAll(".project-toc a"));

const syncHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 48);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", link.getAttribute("href"));
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
  });
});

const workCards = Array.from(document.querySelectorAll(".work-card"));
const workTabs = document.querySelectorAll(".tab");

const applyWorkFilter = (filter) => {
  workCards.forEach((card, index) => {
    const show =
      filter === "all" || (filter === "ux" && index < 3) || (filter === "ai" && index >= 3);
    card.classList.toggle("is-hidden", !show);
  });
};

workTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    applyWorkFilter(tab.dataset.filter || "all");
  });
});

applyWorkFilter("all");

if (projectTocLinks.length && "IntersectionObserver" in window) {
  const sectionMap = new Map(
    projectTocLinks
      .map((link) => [link.getAttribute("href"), link])
      .filter(([href]) => href && href.startsWith("#"))
  );

  const tocObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visibleEntry) return;

      projectTocLinks.forEach((link) => link.classList.remove("active"));
      sectionMap.get(`#${visibleEntry.target.id}`)?.classList.add("active");
    },
    {
      rootMargin: "-18% 0px -68% 0px",
      threshold: 0.01,
    }
  );

  sectionMap.forEach((_, href) => {
    const section = document.querySelector(href);
    if (section) tocObserver.observe(section);
  });
}

if (heroPortrait && profileCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const maxShift = 20;

  const resetProfileCard = () => {
    profileCard.style.setProperty("--card-shift-x", "0px");
    profileCard.style.setProperty("--card-shift-y", "0px");
  };

  heroPortrait.addEventListener("pointerleave", resetProfileCard);
  heroPortrait.addEventListener("pointercancel", resetProfileCard);
  heroPortrait.addEventListener("pointermove", (event) => {
    const rect = heroPortrait.getBoundingClientRect();
    const percentX = (event.clientX - rect.left) / rect.width - 0.5;
    const percentY = (event.clientY - rect.top) / rect.height - 0.5;
    const shiftX = Math.max(-maxShift, Math.min(maxShift, percentX * maxShift * 2));
    const shiftY = Math.max(-maxShift, Math.min(maxShift, percentY * maxShift * 2));

    profileCard.style.setProperty("--card-shift-x", `${shiftX.toFixed(1)}px`);
    profileCard.style.setProperty("--card-shift-y", `${shiftY.toFixed(1)}px`);
  });
}
