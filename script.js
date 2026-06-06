const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const skillsCarousel = document.querySelector(".skills-carousel");
const trackedSections = ["profil", "skills", "nachweis"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
let navTicking = false;

const setActiveNav = (sectionId) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
  });
};

const updateActiveNavFromScroll = () => {
  if (!trackedSections.length) return;

  const marker = window.innerHeight * 0.42;
  const firstSectionTop = trackedSections[0].getBoundingClientRect().top;
  const lastSectionBottom = trackedSections[trackedSections.length - 1].getBoundingClientRect().bottom;
  let activeSection = null;

  if (firstSectionTop > marker || lastSectionBottom < marker) {
    setActiveNav(null);
    return;
  }

  trackedSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom >= marker) {
      activeSection = section;
    }
  });

  if (activeSection?.id) {
    setActiveNav(activeSection.id);
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener(
  "scroll",
  () => {
    if (navTicking) return;

    navTicking = true;
    requestAnimationFrame(() => {
      updateActiveNavFromScroll();
      navTicking = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveNavFromScroll);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.replace("#", "");
    if (id) {
      setActiveNav(id);
    }
  });
});

if (skillsCarousel && !skillsCarousel.dataset.looped) {
  const cards = Array.from(skillsCarousel.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    skillsCarousel.appendChild(clone);
  });
  skillsCarousel.dataset.looped = "true";
}

requestAnimationFrame(() => {
  const currentHash = window.location.hash.replace("#", "");
  if (currentHash) {
    setActiveNav(currentHash);
  }
  requestAnimationFrame(updateActiveNavFromScroll);
});
