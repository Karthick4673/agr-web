/* ===================================================================
   AGR MARKETING & SERVICE — SCRIPT
   Mobile nav, scroll effects, active link tracking, reveal animation,
   scroll-to-top, contact form handling.
=================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar background on scroll ---------- */
  const navbar = document.getElementById("navbar");
  const scrollTopBtn = document.getElementById("scrollTop");

  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    navbar.classList.toggle("is-scrolled", scrolled);
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 500);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const sections = ["home", "services", "about", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinkMap = {};
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    navLinkMap[link.getAttribute("href").replace("#", "")] = link;
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Object.values(navLinkMap).forEach((l) => l.classList.remove("is-active"));
          const activeLink = navLinkMap[entry.target.id];
          if (activeLink) activeLink.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal-on-scroll animation ---------- */
  const revealTargets = document.querySelectorAll(
    ".service-card, .about-copy, .about-graphic, .contact-form, .contact-info, .section-title, .section-sub"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Contact form handling ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const contact = form.contact.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();

      if (!name || !contact || !service || !message) {
        status.textContent = "Please fill in every field before sending.";
        status.style.color = "#e07a5f";
        return;
      }

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      status.style.color = "#e9c767";
      status.textContent = "";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          status.textContent = "Thank you! Your message has been sent — we'll be in touch shortly.";
          form.reset();
        } else {
          status.style.color = "#e07a5f";
          status.textContent = "Something went wrong. Please try again or contact us directly.";
        }
      } catch (err) {
        status.style.color = "#e07a5f";
        status.textContent = "Network error. Please check your connection and try again.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- Google Maps placeholder link guard ---------- */
  const mapsLink = document.getElementById("mapsLink");
  if (mapsLink) {
    mapsLink.addEventListener("click", (e) => {
      if (mapsLink.getAttribute("href") === "#") {
        e.preventDefault();
      }
    });
  }
});