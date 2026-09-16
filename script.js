const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const skillsCarousel = document.querySelector(".skills-carousel");
const certificateCards = document.querySelectorAll(".certificate-card");
const certModal = document.querySelector(".cert-modal");
const certModalImage = document.querySelector(".cert-modal img");
const certModalClose = document.querySelector(".cert-modal-close");
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

const closeCertificateModal = () => {
  if (!certModal || !certModalImage) return;

  certModal.classList.remove("is-open");
  certModal.setAttribute("aria-hidden", "true");
  certModalImage.src = "";
  certModalImage.alt = "";
  document.body.classList.remove("modal-open");
};

const openCertificateModal = (card) => {
  if (!certModal || !certModalImage) return;

  const image = card.querySelector("img");
  if (!image) return;

  certModalImage.src = image.src;
  certModalImage.alt = image.alt;
  certModal.classList.add("is-open");
  certModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  certModalClose?.focus();
};

certificateCards.forEach((card) => {
  card.addEventListener("click", () => openCertificateModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCertificateModal(card);
    }
  });
});

certModalClose?.addEventListener("click", closeCertificateModal);
certModal?.addEventListener("click", (event) => {
  if (event.target === certModal) {
    closeCertificateModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && certModal?.classList.contains("is-open")) {
    closeCertificateModal();
  }
});

requestAnimationFrame(() => {
  const currentHash = window.location.hash.replace("#", "");
  if (currentHash) {
    setActiveNav(currentHash);
  }
  requestAnimationFrame(updateActiveNavFromScroll);
});
