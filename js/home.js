// ===========================================================
// Oh, mon Dieu! — home.js
// Kerzenlicht, Weihrauch, Horarium, Flakon-Neigung, Vers, Siegel
// ===========================================================

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- Header: Hintergrund beim Scrollen ---------- */
  var hdr = document.getElementById("hdr");

  /* ---------- Kerzenlicht am Cursor ---------- */
  var nave = document.getElementById("nave");
  if (nave) {
    nave.addEventListener("pointermove", function (e) {
      var r = nave.getBoundingClientRect();
      nave.style.setProperty("--mx", (e.clientX - r.left) + "px");
      nave.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }

  /* ---------- Weihrauch (Canvas) ---------- */
  var canvas = document.getElementById("smoke");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, particles = [], running = false, last = 0;
    var MAX = finePointer ? 190 : 110;
    var pointer = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 };

    // weiches Rauch-Sprite einmal vorrendern
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 128;
    var sctx = sprite.getContext("2d");
    var g = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(236,214,186,0.55)");
    g.addColorStop(0.45, "rgba(214,184,150,0.22)");
    g.addColorStop(1, "rgba(200,170,140,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 128, 128);

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      var fromCenser = Math.random() < 0.8;
      particles.push({
        x: fromCenser ? W * 0.5 + (Math.random() - 0.5) * 36 : Math.random() * W,
        y: fromCenser ? H * 0.9 : H + 30,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.35 + Math.random() * 0.5),
        age: 0,
        life: 420 + Math.random() * 380,
        size: 18 + Math.random() * 22,
        seed: Math.random() * 1000,
        a: fromCenser ? 0.12 + Math.random() * 0.08 : 0.05
      });
    }

    function step(now) {
      if (!running) return;
      var dt = Math.min(2.5, (now - last) / 16.67 || 1);
      last = now;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";

      for (var s = 0; s < 3 && particles.length < MAX; s++) spawn();

      var t = now * 0.00045;
      var pActive = now - pointer.t < 120;
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.age += dt;
        if (p.age > p.life || p.y < -120) { particles.splice(i, 1); continue; }

        // Auftrieb + sanftes Wirbeln
        p.vy -= 0.0035 * dt;
        p.vx += Math.sin(p.y * 0.012 + t * 3 + p.seed) * 0.018 * dt;
        p.vx += Math.cos(p.x * 0.008 - t * 2 + p.seed) * 0.008 * dt;

        // Hand durch den Rauch: der Cursor schiebt ihn weg
        if (pActive) {
          var dx = p.x - pointer.x, dy = p.y - pointer.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) {
            var f = 1 - Math.sqrt(d2) / 160;
            p.vx += pointer.vx * 0.05 * f + (dx / 160) * 0.6 * f;
            p.vy += pointer.vy * 0.05 * f + (dy / 160) * 0.3 * f;
          }
        }

        p.vx *= 0.975; p.vy *= 0.985;
        p.x += p.vx * dt; p.y += p.vy * dt;

        var k = p.age / p.life;
        var alpha = Math.sin(Math.PI * k) * p.a;
        var size = p.size + p.age * 0.22;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p.x - size, p.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(step);
    }

    function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); } }
    function stop() { running = false; }

    nave.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (pointer.t) { pointer.vx = clamp(x - pointer.x, -40, 40); pointer.vy = clamp(y - pointer.y, -40, 40); }
      pointer.x = x; pointer.y = y; pointer.t = performance.now();
    });

    resize();
    window.addEventListener("resize", resize);
    // Vorlauf, damit der Rauch beim Öffnen schon steht
    for (var w = 0; w < 120; w++) spawn();
    particles.forEach(function (p) { p.age = Math.random() * p.life * 0.6; p.y -= p.age * 0.7; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(nave);
    } else { start(); }
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });
  }


  /* ---------- Kampagne: Platzhalterbilder ---------- */
  // Fällt ein Bild aus, zeigt der Rahmen stattdessen das Bildbriefing
  document.querySelectorAll(".shot").forEach(function (sh) {
    var img = sh.querySelector("img");
    if (!img) return;
    function miss() { sh.classList.add("is-missing"); }
    img.addEventListener("error", miss);
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) miss();
  });

  /* ---------- Horarium: Tag im Kloster ---------- */
  var hor = document.getElementById("horarium");
  var sticky = document.getElementById("hor-sticky");
  var hours = hor ? Array.prototype.slice.call(hor.querySelectorAll(".hour")) : [];
  var ticks = hor ? Array.prototype.slice.call(hor.querySelectorAll(".dial-tick")) : [];

  function hexToRgb(h) {
    h = h.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(a, b, t) {
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," + Math.round(a[1] + (b[1] - a[1]) * t) + "," + Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }
  var skies = hours.map(function (h) {
    var c = h.getAttribute("data-sky").split(",");
    return { top: hexToRgb(c[0]), bot: hexToRgb(c[1]), night: parseFloat(h.getAttribute("data-night")) };
  });
  var activeHour = -1;

  function updateHorarium() {
    if (!hours.length) return;
    var r = hor.getBoundingClientRect();
    var total = hor.offsetHeight - window.innerHeight;
    var p = clamp(-r.top / total, 0, 1);
    var n = hours.length;
    var f = p * (n - 1);
    var i0 = Math.floor(f), i1 = Math.min(n - 1, i0 + 1), t = f - i0;
    // Übergang nur im letzten Drittel jeder Stunde → jede Stunde „steht“ eine Weile
    var e = clamp((t - 0.55) / 0.45, 0, 1);
    e = e * e * (3 - 2 * e);

    sticky.style.setProperty("--sky-top", mix(skies[i0].top, skies[i1].top, e));
    sticky.style.setProperty("--sky-bot", mix(skies[i0].bot, skies[i1].bot, e));
    sticky.style.setProperty("--night", (skies[i0].night + (skies[i1].night - skies[i0].night) * e).toFixed(3));

    // Sonnenbogen von Ost (links) nach West (rechts)
    var ang = Math.PI * (1 - (f + e - t) / (n - 1));
    sticky.style.setProperty("--sun-x", (50 + Math.cos(ang) * 44).toFixed(2) + "%");
    sticky.style.setProperty("--sun-y", (74 - Math.sin(ang) * 58).toFixed(2) + "%");

    var idx = e > 0.5 ? i1 : i0;
    if (idx !== activeHour) {
      activeHour = idx;
      hours.forEach(function (h, k) {
        h.classList.toggle("is-active", k === idx);
        h.classList.toggle("is-past", k < idx);
      });
      ticks.forEach(function (tk, k) {
        tk.classList.toggle("is-active", k === idx);
        tk.classList.toggle("is-past", k < idx);
        tk.setAttribute("aria-current", k === idx ? "true" : "false");
      });
    }
  }

  ticks.forEach(function (tk) {
    tk.addEventListener("click", function () {
      var k = parseInt(tk.getAttribute("data-go"), 10);
      var total = hor.offsetHeight - window.innerHeight;
      var y = hor.getBoundingClientRect().top + window.scrollY + total * (k / (hours.length - 1));
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- Vers: Wort für Wort erleuchten ---------- */
  var verse = document.getElementById("verse");
  var verseWords = [];
  if (verse) {
    var vp = verse.querySelector(".verse-quote p");
    var words = vp.textContent.trim().split(/\s+/);
    vp.textContent = "";
    words.forEach(function (w, k) {
      var s = document.createElement("span");
      s.className = "w";
      if (/duftenden|Ölen/.test(w)) s.className += " gild";
      s.textContent = w;
      vp.appendChild(s);
      if (k < words.length - 1) vp.appendChild(document.createTextNode(" "));
    });
    verseWords = Array.prototype.slice.call(vp.querySelectorAll(".w"));
    if (reduceMotion) verseWords.forEach(function (s) { s.classList.add("lit"); });
  }
  function updateVerse() {
    if (!verseWords.length || reduceMotion) return;
    var r = verse.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = clamp((vh * 0.85 - r.top) / (r.height * 0.8), 0, 1);
    var lit = Math.round(p * verseWords.length);
    verseWords.forEach(function (s, k) { s.classList.toggle("lit", k < lit); });
  }

  /* ---------- Scroll-Schleife ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (hdr) hdr.classList.toggle("is-scrolled", window.scrollY > 40);
      updateHorarium();
      updateVerse();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Flakons: Neigung & Lichtreflex ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".niche").forEach(function (niche) {
      var fl = niche.querySelector(".flakon");
      niche.addEventListener("pointermove", function (e) {
        var r = niche.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        fl.style.setProperty("--rx", (-y * 14).toFixed(2) + "deg");
        fl.style.setProperty("--ry", (x * 24).toFixed(2) + "deg");
        fl.style.setProperty("--gx", (x * 90 + 50).toFixed(1) + "%");
      });
      niche.addEventListener("pointerleave", function () {
        fl.style.setProperty("--rx", "0deg");
        fl.style.setProperty("--ry", "0deg");
        fl.style.setProperty("--gx", "30%");
      });
    });
  }

  /* ---------- Siegel-Formular (Newsletter) ---------- */
  // Hinweis: Noch kein echter Versand angebunden (z.B. Brevo/Mailchimp).
  var form = document.getElementById("seal-form");
  if (form) {
    var input = document.getElementById("seal-email");
    var msg = document.getElementById("seal-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        form.classList.add("has-error");
        msg.textContent = "Bitte gib eine gültige E-Mail-Adresse ein, z.B. name@beispiel.ch.";
        input.focus();
        return;
      }
      form.classList.remove("has-error", "is-sealed");
      void form.offsetWidth; // Animation neu starten
      form.classList.add("is-sealed");
      msg.textContent = "Versiegelt. Du hörst von uns, sobald sich die Pforte öffnet.";
      form.reset();
    });
    input.addEventListener("input", function () {
      form.classList.remove("has-error");
      if (msg.textContent.indexOf("gültige") > -1) msg.textContent = "";
    });
  }
})();
