const body = document.body;
const burgerButton = document.querySelector(".burger");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const animatedSections = document.querySelectorAll(".section-hidden");
const langToggle = document.querySelector(".lang-toggle");
const langLabels = document.querySelectorAll("[data-lang-label]");
const translatableElements = document.querySelectorAll("[data-ru][data-en]");
const messengerWidget = document.querySelector(".messenger-widget");
const messengerToggle = document.querySelector(".messenger-toggle");

function setMobileMenuState(isOpen) {
  if (!burgerButton || !siteNav) {
    return;
  }

  siteNav.classList.toggle("open", isOpen);
  burgerButton.classList.toggle("open", isOpen);
  burgerButton.setAttribute("aria-expanded", String(isOpen));
  burgerButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  body.classList.toggle("nav-open", isOpen);
}

if (burgerButton && siteNav) {
  burgerButton.addEventListener("click", () => {
    setMobileMenuState(!siteNav.classList.contains("open"));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMobileMenuState(false);
  });
});

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.12
    }
  );

  animatedSections.forEach((section) => sectionObserver.observe(section));
} else {
  animatedSections.forEach((section) => section.classList.add("section-visible"));
}

function applyLanguage(language) {
  const nextLanguage = language === "en" ? "en" : "ru";

  translatableElements.forEach((element) => {
    const translation = element.dataset[nextLanguage];

    if (translation) {
      element.textContent = translation;
    }
  });

  langLabels.forEach((label) => {
    label.classList.toggle("is-active", label.dataset.langLabel === nextLanguage);
  });

  if (langToggle) {
    langToggle.setAttribute("aria-pressed", String(nextLanguage === "en"));
  }

  document.documentElement.lang = nextLanguage;
  localStorage.setItem("siteLanguage", nextLanguage);
}

if (langToggle) {
  const savedLanguage = localStorage.getItem("siteLanguage");
  applyLanguage(savedLanguage || "ru");

  langToggle.addEventListener("click", () => {
    const currentLanguage = document.documentElement.lang === "en" ? "en" : "ru";
    applyLanguage(currentLanguage === "ru" ? "en" : "ru");
  });
}

function setMessengerState(isOpen) {
  if (!messengerWidget || !messengerToggle) {
    return;
  }

  messengerWidget.classList.toggle("open", isOpen);
  messengerToggle.setAttribute("aria-expanded", String(isOpen));
  messengerToggle.setAttribute("aria-label", isOpen ? "Закрыть мессенджеры" : "Открыть мессенджеры");
}

if (messengerToggle && messengerWidget) {
  messengerToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setMessengerState(!messengerWidget.classList.contains("open"));
  });

  document.addEventListener("click", (event) => {
    if (!messengerWidget.contains(event.target)) {
      setMessengerState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
      setMessengerState(false);
    }
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    setMobileMenuState(false);
  }
});
