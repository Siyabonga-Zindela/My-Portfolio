/* ============================================================
   animations.js — the motion engine
   GSAP + ScrollTrigger + Lenis. Everything degrades gracefully:
   - no GSAP  -> html.no-anim, content shown statically
   - prefers-reduced-motion -> html.no-anim, all motion skipped
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = typeof window.ScrollTrigger !== "undefined";

  window.PortfolioFX = { reduced: reduced, motionOn: false };

  /* ---------- graceful fallback ---------- */
  if (reduced || !hasGSAP || !hasST) {
    document.documentElement.classList.add("no-anim");
    var pl = document.getElementById("preloader");
    if (pl) pl.style.display = "none";
    // paint final counter values instantly
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
    return;
  }

  document.documentElement.classList.add("has-anim");
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var DESKTOP = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ============================================================
     Lenis smooth scroll (synced with ScrollTrigger)
     ============================================================ */
  var lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ============================================================
     helpers
     ============================================================ */
  function countTo(el, target, suffix, duration) {
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: duration || 1.6,
      ease: "power2.out",
      onUpdate: function () {
        el.textContent = Math.round(obj.v) + (suffix || "");
      },
    });
  }

  function scramble(el, finalText, duration) {
    var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/\\<>_";
    var len = finalText.length;
    var obj = { p: 0 };
    gsap.to(obj, {
      p: 1,
      duration: duration || 1.1,
      ease: "power2.inOut",
      onUpdate: function () {
        var reveal = Math.floor(obj.p * len);
        var out = "";
        for (var i = 0; i < len; i++) {
          if (finalText[i] === " ") { out += " "; continue; }
          out += i < reveal ? finalText[i] : glyphs[(Math.random() * glyphs.length) | 0];
        }
        el.textContent = out;
      },
      onComplete: function () { el.textContent = finalText; },
    });
  }

  /* ============================================================
     PRELOADER + HERO INTRO
     ============================================================ */
  var preloader = document.getElementById("preloader");
  var plFill = document.getElementById("pl-fill");
  var plCount = document.getElementById("pl-count");
  var plStatus = document.getElementById("pl-status");

  var introPlayed = false;

  function heroIntro() {
    if (introPlayed) return;
    introPlayed = true;

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".nav-inner", { yPercent: -120, duration: 0.9 })
      .to("#hero-eyebrow", { opacity: 1, duration: 0.5 }, "-=0.5")
      .to("#hero-title .line-inner", {
        y: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
      }, "-=0.35")
      .to("#hero-sub", { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
      .to("#hero-actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.65")
      .to("#hero-stats", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to("#hero-visual", { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.9")
      .to(".photo-chip", { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.8")
      .to(".marquee", { opacity: 1, duration: 0.9 }, "-=0.6")
      .add(function () {
        document.querySelectorAll("#hero-stats [data-count]").forEach(function (el) {
          countTo(el, parseInt(el.getAttribute("data-count"), 10), el.getAttribute("data-suffix") || "", 1.4);
        });
      }, "-=1.0");

    // eyebrow typing effect
    var eyebrow = document.getElementById("hero-eyebrow");
    var txt = eyebrow.textContent;
    scramble(eyebrow, txt, 1.3);

    // hero background slow parallax drift
    gsap.to(".glow-a", { x: -60, y: 40, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".glow-b", { x: 50, y: -30, duration: 26, repeat: -1, yoyo: true, ease: "sine.inOut" });

    ScrollTrigger.refresh();
  }

  function runPreloader() {
    var progress = { v: 0 };
    var statuses = ["Initialising", "Loading assets", "Compiling interface", "Ready"];
    var statusIdx = 0;

    var tl = gsap.timeline({
      onComplete: function () {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onComplete: function () {
            preloader.style.display = "none";
            heroIntro();
          },
        });
      },
    });

    tl.to(progress, {
      v: 100,
      duration: 1.7,
      ease: "power2.inOut",
      onUpdate: function () {
        var v = Math.round(progress.v);
        plCount.textContent = String(v).padStart(3, "0");
        plFill.style.transform = "scaleX(" + progress.v / 100 + ")";
        var idx = Math.min(statuses.length - 1, Math.floor(progress.v / 28));
        if (idx !== statusIdx) {
          statusIdx = idx;
          plStatus.textContent = statuses[idx];
        }
      },
    })
      .to(".preloader-inner", { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, "+=0.12");
  }

  window.PortfolioFX.playIntro = function () {
    if (reduced) return;
    runPreloader();
  };

  /* ============================================================
     SCROLL-TRIGGERED ANIMATIONS (built after intro starts)
     ============================================================ */
  window.PortfolioFX.buildScrollAnimations = function () {
    if (reduced) return;

    /* generic reveals */
    gsap.utils.toArray("main .reveal").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          delay: parseFloat(el.getAttribute("data-delay") || 0),
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }
      );
    });

    /* hero reveal elements should not be re-hidden by scroll system */
    gsap.set(["#hero-sub", "#hero-actions", "#hero-stats"], { opacity: 0, y: 26 });
    gsap.set("#hero-visual", { opacity: 0, scale: 0.92 });
    gsap.set(".photo-chip", { opacity: 0, y: 14 });
    gsap.set(".marquee", { opacity: 0 });
    gsap.set("#hero-eyebrow", { opacity: 0 });

    /* section divider lines draw */
    gsap.utils.toArray(".hr-anim").forEach(function (hr) {
      gsap.fromTo(hr, { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, ease: "power3.inOut",
        scrollTrigger: { trigger: hr, start: "top 92%", once: true },
      });
    });

    /* sec-line micro draw */
    gsap.utils.toArray(".sec-line").forEach(function (line) {
      gsap.fromTo(line, { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: "power3.inOut",
        scrollTrigger: { trigger: line, start: "top 92%", once: true },
      });
    });

    /* counters outside hero (394 etc.) */
    gsap.utils.toArray(".fact [data-count]").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          countTo(el, parseInt(el.getAttribute("data-count"), 10), el.getAttribute("data-suffix") || "", 1.8);
        },
      });
    });

    /* BUILD FOR USE scramble on enter */
    var theme = document.getElementById("theme-line");
    if (theme) {
      ScrollTrigger.create({
        trigger: theme,
        start: "top 85%",
        once: true,
        onEnter: function () { scramble(theme, "BUILD FOR USE", 1.2); },
      });
    }

    /* project image parallax */
    gsap.utils.toArray(".project-row .media-mask img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: img.closest(".project-row"), start: "top bottom", end: "bottom top", scrub: 1.1 },
      });
    });

    /* gallery staggered clip reveal */
    gsap.utils.toArray(".g-item").forEach(function (item, i) {
      gsap.fromTo(item, { opacity: 0, y: 44, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9, delay: (i % 3) * 0.08, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 90%", once: true },
      });
    });

    /* hero exit parallax */
    gsap.to(".hero-inner", {
      yPercent: -7, opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
    });

    /* scroll progress bar */
    var fill = document.getElementById("progress-fill");
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: function (self) {
        fill.style.transform = "scaleX(" + self.progress + ")";
      },
    });

    /* mouse parallax on hero (desktop) */
    if (DESKTOP) {
      var hero = document.querySelector(".hero");
      var qx = gsap.quickTo(".hero-inner", "x", { duration: 0.9, ease: "power3.out" });
      var qy = gsap.quickTo(".hero-inner", "y", { duration: 0.9, ease: "power3.out" });
      hero.addEventListener("mousemove", function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5) * 2;
        var cy = (e.clientY / window.innerHeight - 0.5) * 2;
        qx(cx * 10); qy(cy * 6);
      });
      hero.addEventListener("mouseleave", function () { qx(0); qy(0); });
    }
  };

  /* ============================================================
     MICRO-INTERACTIONS: magnetic buttons + card tilt (desktop)
     ============================================================ */
  window.PortfolioFX.buildMicroInteractions = function () {
    if (reduced || !DESKTOP) return;

    /* magnetic pull */
    document.querySelectorAll(".btn, .socials a, .to-top, .brand-mark").forEach(function (el) {
      var xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var relX = e.clientX - (r.left + r.width / 2);
        var relY = e.clientY - (r.top + r.height / 2);
        xTo(relX * 0.22); yTo(relY * 0.22);
      });
      el.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });

    /* skill card tilt */
    document.querySelectorAll(".skill-card").forEach(function (card) {
      var rX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
      var rY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
      gsap.set(card, { transformPerspective: 700 });

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        rY(px * 5); rX(-py * 5);
      });
      card.addEventListener("mouseleave", function () { rX(0); rY(0); });
    });
  };
})();
