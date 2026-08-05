(() => {
  "use strict";

  const drawer = document.querySelector(".mobile-nav-drawer");
  const drawerToggle = document.querySelector(".mobile-nav-toggle");
  const drawerClose = document.querySelector(".btn-close-drawer");

  const setDrawerOpen = (open) => {
    if (!drawer || !drawerToggle) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    drawerToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  drawerToggle?.addEventListener("click", () => setDrawerOpen(true));
  drawerClose?.addEventListener("click", () => setDrawerOpen(false));
  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setDrawerOpen(false));
  });

  const modal = document.querySelector(".lightbox-modal");
  const modalImage = modal?.querySelector(".lightbox-content");
  const modalCaption = modal?.querySelector(".lightbox-caption");
  const modalClose = modal?.querySelector(".lightbox-close");
  const modalPrevious = modal?.querySelector(".lightbox-previous");
  const modalNext = modal?.querySelector(".lightbox-next");
  let lightboxItems = [];
  let lightboxIndex = -1;
  let lightboxTrigger = null;

  const renderLightbox = () => {
    const item = lightboxItems[lightboxIndex];
    if (!item || !modal || !modalImage || !modalCaption) return;
    const src = item.getAttribute("data-lightbox-src");
    const caption = item.getAttribute("data-lightbox-caption") || "";
    modalImage.style.backgroundImage = src ? `url('${src}')` : "none";
    modalCaption.textContent = caption;
    const hideArrows = lightboxItems.length <= 1;
    if (modalPrevious) modalPrevious.hidden = hideArrows;
    if (modalNext) modalNext.hidden = hideArrows;
  };

  const closeLightbox = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxIndex = -1;
    lightboxTrigger?.focus?.();
  };

  const moveLightbox = (offset) => {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + offset + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-src]");
    if (!trigger || trigger.hidden) return;
    event.preventDefault();
    lightboxItems = [...document.querySelectorAll("[data-lightbox-src]:not([hidden])")];
    lightboxIndex = lightboxItems.indexOf(trigger);
    lightboxTrigger = trigger;
    if (lightboxIndex < 0 || !modal) return;
    renderLightbox();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose?.focus();
  });

  modalClose?.addEventListener("click", closeLightbox);
  modalPrevious?.addEventListener("click", () => moveLightbox(-1));
  modalNext?.addEventListener("click", () => moveLightbox(1));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal?.classList.contains("open")) closeLightbox();
      else setDrawerOpen(false);
    }
    if (!modal?.classList.contains("open")) return;
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  const deferredImages = [...document.querySelectorAll("img[data-src]")];
  const loadImage = (image) => {
    const src = image.getAttribute("data-src");
    if (!src) return;
    image.src = src;
    image.removeAttribute("data-src");
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "400px 0px" });
    deferredImages.forEach((image) => observer.observe(image));
  } else {
    deferredImages.forEach(loadImage);
  }

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-enquiry-form]");
    if (!form) return;
    event.preventDefault();
    const ceramics = form.dataset.enquiryKind === "ceramics";
    window.alert(ceramics
      ? "Thank you for your ceramic workshop enquiry. We will reply shortly!"
      : "Thank you for your enquiry. We will reply shortly!");
  });
})();
