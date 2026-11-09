/* ============================================================
   main.js — application logic
   Renders data-driven sections, navigation, cursor, lightbox,
   contact form (EmailJS) and the ambient hero canvas.
   ============================================================ */

(function () {
  "use strict";

  var FX = window.PortfolioFX || { motionOn: false, reduced: false };
  var REDUCED = FX.reduced;
  var root = document.documentElement;

  /* ============================================================
     1. RENDER: certificates
     ============================================================ */
  function renderCertificates() {
    var grid = document.getElementById("cert-grid");
    if (!grid || typeof CERTIFICATES === "undefined") return;

    grid.innerHTML = "";
    CERTIFICATES.forEach(function (cert, i) {
      var btn = document.createElement("button");
      btn.className = "cert-card reveal" + (cert.placeholder ? " is-placeholder" : "");
      btn.setAttribute("data-delay", String((i % 3) * 0.08));
      btn.setAttribute("aria-label", "View certificate: " + cert.title);

      var media = document.createElement("div");
      media.className = "cert-media";
      var img = document.createElement("img");
      img.src = cert.image;
      img.alt = cert.placeholder ? "Certificate image placeholder" : cert.title + " certificate";
      img.loading = "lazy";
      var zoom = document.createElement("div");
      zoom.className = "cert-zoom";
      var zl = document.createElement("span");
      zl.textContent = "View certificate";
      zoom.appendChild(zl);
      media.appendChild(img);
      media.appendChild(zoom);

      var body = document.createElement("div");
      body.className = "cert-body";
      var h = document.createElement("h3");
      h.textContent = cert.title;
      var meta = document.createElement("div");
      meta.className = "cert-meta";
      var issuer = document.createElement("span");
      issuer.className = "issuer";
      issuer.textContent = cert.issuer;
      var year = document.createElement("span");
      year.textContent = cert.year;
      meta.appendChild(issuer);
      meta.appendChild(year);

      body.appendChild(h);
      body.appendChild(meta);
      btn.appendChild(media);
      btn.appendChild(body);

      btn.addEventListener("click", function () {
        openLightbox(cert.image, cert.title, cert.issuer + (cert.year ? " — " + cert.year : ""), cert.placeholder ? "Certificate image placeholder" : cert.title + " certificate");
      });

      grid.appendChild(btn);
    });
  }

  /* ============================================================
     2. RENDER: hackathon gallery
     ============================================================ */
  function renderGallery() {
    var wrap = document.getElementById("hack-gallery");
    if (!wrap || typeof HACKATHON_PHOTOS === "undefined") return;

    wrap.innerHTML = "";
    HACKATHON_PHOTOS.forEach(function (photo) {
      var fig = document.createElement("figure");
      fig.className = "g-item";
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "View photo: " + (photo.caption || ""));

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "";
      img.loading = "lazy";

      var cap = document.createElement("figcaption");
      cap.textContent = photo.caption || "";

      fig.appendChild(img);
      fig.appendChild(cap);

      function open() {
        openLightbox(photo.src, "Geekulcha Annual Hackathon 2026", photo.caption || "", photo.alt || "Hackathon photograph");
      }
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });

      wrap.appendChild(fig);
    });
  }

  /* ============================================================
     3. LIGHTBOX (shared)
     ============================================================ */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbTitle = document.getElementById("lb-title");
  var lbSub = document.getElementById("lb-sub");
  var lbClose = document.getElementById("lb-close");
  var lbBackdrop = document.getElementById("lb-backdrop");
  var lastFocus = null;

  function openLightbox(src, title, sub, alt) {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || title || "";
    lbTitle.textContent = title || "";
    lbSub.textContent = sub || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
    if (window.__lenis) window.__lenis.stop();
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (window.__lenis) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) closeLightbox();
  });

  /* ============================================================
     4. NAVIGATION: scrolled state, scrollspy, mobile menu
     ============================================================ */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    if (mobileMenu) mobileMenu.classList.toggle("is-open", open);
    if (toggle) {
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    document.body.classList.toggle("no-scroll", open);
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }

  if (toggle) toggle.addEventListener("click", function () { setMenu(!menuOpen); });
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* smooth anchor scrolling (Lenis when available) */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: id === "#home" ? 0 : -72, duration: 1.25 });
      } else {
        var top = id === "#home" ? 0 : target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: REDUCED ? "auto" : "smooth" });
      }
    });
  });

  /* nav background + progress (works with and without motion) */
  var progressFill = document.getElementById("progress-fill");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
    if (progressFill && !FX.motionOn) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressFill.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* scrollspy */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ============================================================
     5. CUSTOM CURSOR
     ============================================================ */
  function initCursor() {
    if (REDUCED) return;
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    root.classList.add("cursor-on");
    var x = -100, y = -100, rx = -100, ry = -100;

    window.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
    }, { passive: true });

    (function loop() {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();

    var hoverSelector = "a, button, .g-item, .cert-card, input, textarea, .chip, .fact";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverSelector)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverSelector)) ring.classList.remove("is-hover");
    });
    document.addEventListener("mousedown", function () { ring.classList.add("is-pressed"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("is-pressed"); });
    document.addEventListener("mouseleave", function () { root.classList.remove("cursor-on"); });
    document.addEventListener("mouseenter", function () { root.classList.add("cursor-on"); });
  }

  /* ============================================================
     6. HERO AMBIENT CANVAS — drifting data motes
     ============================================================ */
  function initField() {
    if (REDUCED) return;
    var canvas = document.getElementById("field-canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var hero = document.querySelector(".hero");
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var running = false;
    var raf = null;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas() {
      var w = hero.offsetWidth, h = hero.offsetHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      var count = Math.min(window.innerWidth < 720 ? 34 : 80, Math.floor(w / 16));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(Math.random() * 0.22 + 0.05),
          a: Math.random() * 0.35 + 0.12,
        });
      }
    }

    function draw() {
      var w = canvas.width / DPR, h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        /* gentle push away from cursor */
        var dxm = p.x - mouse.x, dym = p.y - mouse.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 110 && dm > 0.01) {
          p.x += (dxm / dm) * 0.45;
          p.y += (dym / dm) * 0.45;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(24, 218, 224, " + p.a + ")";
        ctx.fill();

        /* connective lines — the "system" */
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 115 * 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(24, 218, 224, " + 0.05 * (1 - d2 / (115 * 115)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    function start() { if (!running) { running = true; draw(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    hero.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener("mouseleave", function () { mouse.x = -9999; mouse.y = -9999; });

    window.addEventListener("resize", function () { sizeCanvas(); });

    /* only run while hero is on screen */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.02 }).observe(hero);
    } else {
      start();
    }

    sizeCanvas();
  }

  /* ============================================================
     7. CONTACT FORM — EmailJS (same service/template as before)
     ============================================================ */
  function initForm() {
    var form = document.getElementById("form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var sendBtn = document.getElementById("btnSendMessage");

    function setStatus(msg, cls) {
      status.textContent = msg;
      status.className = "form-status" + (cls ? " " + cls : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = {
        name: document.getElementById("user_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim(),
      };

      if (!fields.name || !fields.email || !fields.subject || !fields.message) {
        setStatus("Please complete every field before sending.", "err");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        setStatus("Please enter a valid email address.", "err");
        return;
      }

      if (typeof emailjs === "undefined") {
        setStatus("Email service unavailable — please email me directly.", "err");
        return;
      }

      sendBtn.disabled = true;
      sendBtn.style.opacity = "0.6";
      setStatus("Sending...", "");

      emailjs
        .send("service_mh3xsnz", "template_m3xxftl", fields)
        .then(function () {
          setStatus("Message sent successfully. I will get back to you soon.", "ok");
          form.reset();
        })
        .catch(function () {
          setStatus("Could not send right now — please try again or email me directly.", "err");
        })
        .finally(function () {
          sendBtn.disabled = false;
          sendBtn.style.opacity = "";
        });
    });
  }

  /* ============================================================
     8. BOOT
     ============================================================ */
  renderCertificates();
  renderGallery();
  initCursor();
  initField();
  initForm();

  /* duplicate marquee content for a seamless loop */
  var track = document.getElementById("marquee-track");
  if (track) track.innerHTML += track.innerHTML;

  function startExperience() {
    if (typeof PortfolioFX !== "undefined" && PortfolioFX.playIntro) {
      PortfolioFX.playIntro();
      if (PortfolioFX.buildScrollAnimations) PortfolioFX.buildScrollAnimations();
      if (PortfolioFX.buildMicroInteractions) PortfolioFX.buildMicroInteractions();
    }
    window.addEventListener("load", function () {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startExperience);
  } else {
    startExperience();
  }
})();
