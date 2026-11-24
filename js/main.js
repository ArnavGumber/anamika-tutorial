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
  const enabledPrograms = (content.academicPrograms || []).filter(function (program) {
    return program.verified === true && program.enabled !== false;
  });
  if (enabledPrograms.length) {
    courseList.innerHTML = enabledPrograms.map(function (program) {
      const academicMessage = "Hello, I would like to enquire about academic classes at Anamika Tutorial.\n\nI am interested in " + program.className + " - " + program.subject + ".\n\nPlease share the details about availability, timings and fees.";
      const enquiryUrl = createWhatsAppUrl(academicMessage);
      return `
        <article class="academic-card reveal">
          <div class="academic-body">
            <div class="academic-labels">
              <span>${escapeHtml(program.className)}</span>
              <span>${escapeHtml(program.subject)}</span>
            </div>
            <a class="button button-primary" href="${escapeHtml(enquiryUrl)}" target="_blank" rel="noopener">Enquire About Classes</a>
          </div>
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

  const facultyList = document.getElementById("faculty-list");
  if (content.faculty && content.faculty.length) {
    facultyList.innerHTML = `<div class="faculty-grid">${content.faculty.map(function (faculty) {
      return `
        <article class="faculty-card reveal">
          ${faculty.photograph ? `<img src="${escapeHtml(faculty.photograph)}" alt="${escapeHtml(faculty.name)}" loading="lazy">` : ""}
          <h3>${escapeHtml(faculty.name)}</h3>
          ${faculty.qualifications ? `<p>${escapeHtml(faculty.qualifications)}</p>` : ""}
          ${faculty.subjectSpecialisation ? `<p><strong>Specialisation:</strong> ${escapeHtml(faculty.subjectSpecialisation)}</p>` : ""}
          ${faculty.classesTaught ? `<p><strong>Classes:</strong> ${escapeHtml(faculty.classesTaught)}</p>` : ""}
          ${faculty.experience ? `<p>${escapeHtml(faculty.experience)}</p>` : ""}
          ${faculty.biography ? `<p>${escapeHtml(faculty.biography)}</p>` : ""}
        </article>`;
    }).join("")}</div>`;
  } else {
    facultyList.innerHTML = `
      <div class="faculty-empty reveal">
        <div class="faculty-empty-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 8c0-4.4 3.6-8 8-8s8 3.6 8 8v2H4v-2Z"/></svg>
        </div>
        <div>
          <p class="section-label">Our teaching team</p>
          <h3>Meet the educators of Anamika Tutorial.</h3>
          <p>Faculty profiles and academic guidance information will be available here.</p>
        </div>
        <a class="button button-primary" href="#enquiry">Contact Us</a>
      </div>`;
  }

  const resultsContent = document.getElementById("results-content");
  if (content.achievements.length) {
    resultsContent.innerHTML = `<div class="section-heading reveal"><div><p class="section-label">Achievements</p><h2>Celebrating Academic Progress</h2></div><p>Every achievement begins with consistent effort and a strong foundation.</p></div><div class="course-grid"></div>`;
  } else {
    resultsContent.innerHTML = `
      <div class="compact-empty reveal">
        <div>
          <p class="section-label">Academic progress</p>
          <h2>Celebrating Academic Progress</h2>
          <p>Verified student achievements will be shared here when available.</p>
        </div>
      </div>`;
  }

  const testimonialContent = document.getElementById("testimonial-content");
  if (content.testimonials.length) {
    testimonialContent.innerHTML = `<div class="section-heading reveal"><div><p class="section-label">Testimonials</p><h2>What Students and Parents Say</h2></div></div><div class="course-grid"></div>`;
  } else {
    testimonialContent.innerHTML = `
      <div class="compact-empty reveal">
        <div>
          <p class="section-label">Student and parent experiences</p>
          <h2>What Students and Parents Say</h2>
          <p>Genuine testimonials will be featured here with permission.</p>
        </div>
      </div>`;
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
