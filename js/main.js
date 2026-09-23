// ===========================================================
// Oh, mon Dieu! — main.js
// Mobile-Navigation, Formularvalidierung, Newsletter-Feedback
// ===========================================================

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile Navigation ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Kontaktformular ---------- */
  var contactForm = document.getElementById("contact-form");

  if (contactForm) {
    // Vorbefüllung, falls über produkte.html mit ?produkt=... verlinkt wurde
    var params = new URLSearchParams(window.location.search);
    var produkt = params.get("produkt");
    var messageField = document.getElementById("message");
    if (produkt && messageField && !messageField.value) {
      messageField.value = "Ich interessiere mich für den Duft „" + produkt + "" und möchte informiert werden, sobald er erhältlich ist.";
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;

      var fields = [
        { input: document.getElementById("name"), check: function (v) { return v.trim().length > 0; } },
        { input: document.getElementById("email"), check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
        { input: document.getElementById("message"), check: function (v) { return v.trim().length > 0; } }
      ];

      fields.forEach(function (f) {
        var wrapper = f.input.closest(".field");
        if (!f.check(f.input.value)) {
          wrapper.classList.add("has-error");
          valid = false;
        } else {
          wrapper.classList.remove("has-error");
        }
      });

      if (!valid) {
        return;
      }

      // Hinweis: Hier ist noch kein echter Versand angebunden.
      // Sobald ein Formular-Dienst (z.B. Formspree) eingerichtet ist,
      // kann dieser Block durch einen echten fetch()-Aufruf ersetzt werden.
      var successBox = document.getElementById("form-success");
      if (successBox) {
        successBox.classList.add("visible");
      }
      contactForm.reset();
    });

    contactForm.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        el.closest(".field").classList.remove("has-error");
      });
    });
  }

  /* ---------- Newsletter ---------- */
  var newsletterForm = document.getElementById("newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var emailInput = newsletterForm.querySelector("input[type=email]");

      if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailInput.style.borderColor = "var(--color-bordeaux)";
        return;
      }

      emailInput.style.borderColor = "";
      var button = newsletterForm.querySelector("button");
      var originalText = button.textContent;
      button.textContent = "Danke!";
      newsletterForm.reset();

      setTimeout(function () {
        button.textContent = originalText;
      }, 2500);
    });
  }

});
