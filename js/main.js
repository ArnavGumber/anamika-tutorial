(function () {
  "use strict";

  const content = window.siteContent;
  const whatsappNumber = content.phone;

  function createWhatsAppUrl(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  menuToggle.addEventListener("click", function () {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    menuToggle.classList.toggle("active", !isOpen);
    navigation.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.classList.remove("active");
      navigation.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  const courseList = document.getElementById("course-list");
  const enabledCourses = content.courses.filter(function (course) { return course.enabled !== false; });
  if (enabledCourses.length) {
    courseList.innerHTML = enabledCourses.map(function (course) {
      const subjects = Array.isArray(course.subjects) ? course.subjects : [];
      return `
        <article class="course-card reveal">
          <div class="course-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm2.5-.5A.5.5 0 0 0 6 5.5V17h12V5H6.5ZM4 19.5A.5.5 0 0 0 4.5 20H18v-1H6.5a2.5 2.5 0 0 1-2.5-.5Z"/></svg>
          </div>
          <p class="section-label">${escapeHtml(course.level || "Academic programme")}</p>
          <h3>${escapeHtml(course.title)}</h3>
          <p>${escapeHtml(course.description)}</p>
          ${subjects.length ? `<p><strong>Subjects:</strong> ${subjects.map(escapeHtml).join(", ")}</p>` : ""}
          <a class="text-link" href="#enquiry">Enquire <span aria-hidden="true">→</span></a>
        </article>`;
    }).join("");
  } else {
    courseList.innerHTML = `
      <div class="empty-state reveal">
        <div>
          <p class="section-label">Programme information</p>
          <h3>Academic programmes are being updated</h3>
          <p>Contact us to learn more about available classes.</p>
          <a class="button button-primary" href="#enquiry">Enquire Now</a>
        </div>
      </div>`;
  }

  document.getElementById("feature-list").innerHTML = content.features.map(function (feature, index) {
    return `
      <article class="feature reveal">
        <span class="feature-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(feature.title)}</h3>
        <p>${escapeHtml(feature.description)}</p>
      </article>`;
  }).join("");

  const galleryGrid = document.getElementById("gallery-grid");
  galleryGrid.innerHTML = content.gallery.map(function (image) {
    return `
      <button class="gallery-item reveal" type="button" data-full="${escapeHtml(image.src)}" aria-label="Open image: ${escapeHtml(image.caption)}">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" width="800" height="600">
      </button>`;
  }).join("");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  let lightboxTrigger = null;
  galleryGrid.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      lightboxTrigger = item;
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = item.querySelector("img").alt;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightboxClose.focus();
    });
  });
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lightboxTrigger) lightboxTrigger.focus();
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  const resultsContent = document.getElementById("results-content");
  if (content.achievements.length) {
    resultsContent.innerHTML = `<div class="section-heading reveal"><div><p class="section-label">Achievements</p><h2>Celebrating Academic Progress</h2></div><p>Every achievement begins with consistent effort and a strong foundation.</p></div><div class="course-grid"></div>`;
  } else {
    resultsContent.closest("section").remove();
  }

  const testimonialContent = document.getElementById("testimonial-content");
  if (content.testimonials.length) {
    testimonialContent.innerHTML = `<div class="section-heading reveal"><div><p class="section-label">Testimonials</p><h2>What Students and Parents Say</h2></div></div><div class="course-grid"></div>`;
  } else {
    testimonialContent.closest("section").remove();
  }

  const faqList = document.getElementById("faq-list");
  faqList.innerHTML = content.faqs.map(function (faq, index) {
    const panelId = `faq-panel-${index}`;
    const triggerId = `faq-trigger-${index}`;
    return `
      <div class="accordion-item">
        <button class="accordion-trigger" id="${triggerId}" type="button" aria-expanded="false" aria-controls="${panelId}">
          ${escapeHtml(faq.question)} <span aria-hidden="true">+</span>
        </button>
        <div class="accordion-panel" id="${panelId}" role="region" aria-labelledby="${triggerId}">
          <p>${escapeHtml(faq.answer)}</p>
        </div>
      </div>`;
  }).join("");
  faqList.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      faqList.querySelectorAll(".accordion-trigger").forEach(function (otherTrigger) {
        otherTrigger.setAttribute("aria-expanded", "false");
        document.getElementById(otherTrigger.getAttribute("aria-controls")).style.maxHeight = null;
      });
      if (!expanded) {
        trigger.setAttribute("aria-expanded", "true");
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  const form = document.getElementById("enquiry-form");
  const formStatus = document.getElementById("form-status");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const requiredFields = form.querySelectorAll("[required]");
    let firstInvalid = null;
    requiredFields.forEach(function (field) {
      const invalid = !field.value.trim();
      field.classList.toggle("invalid", invalid);
      field.setAttribute("aria-invalid", String(invalid));
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      formStatus.className = "form-status";
      formStatus.textContent = "Please complete the required fields.";
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const phone = String(data.get("phone")).trim();
    const message = [
      "Hello, I would like to enquire about admission at Anamika Tutorial.",
      "",
      `Student Name: ${data.get("studentName")}`,
      `Parent Name: ${data.get("guardianName") || "Not provided"}`,
      `Phone: ${phone}`,
      `Class: ${data.get("class")}`,
      `Subject/Course: ${data.get("interest") || "To be confirmed"}`,
      `Message: ${data.get("message") || "Not provided"}`,
      "",
      "Please provide further details."
    ].join("\n");
    formStatus.className = "form-status success";
    formStatus.textContent = "Your enquiry is ready. You will now be redirected to WhatsApp.";
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Opening WhatsApp...";
    window.setTimeout(function () {
      window.open(createWhatsAppUrl(message), "_blank", "noopener");
      submitButton.disabled = false;
      submitButton.textContent = "Send Enquiry via WhatsApp";
    }, 350);
  });

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.hasAttribute("required") && field.value.trim()) {
        field.classList.remove("invalid");
        field.setAttribute("aria-invalid", "false");
      }
    });
  });

  const prefilledMessage = "Hello, I would like to know more about Anamika Tutorial.";
  const whatsappUrl = createWhatsAppUrl(prefilledMessage);
  ["floating-whatsapp", "contact-whatsapp", "footer-whatsapp"].forEach(function (id) {
    document.getElementById(id).href = whatsappUrl;
  });
  document.getElementById("copyright-year").textContent = new Date().getFullYear();

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(function (element) { observer.observe(element); });
  } else {
    revealElements.forEach(function (element) { element.classList.add("visible"); });
  }
})();
