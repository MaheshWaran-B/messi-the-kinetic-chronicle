/* The Retirement Park — main.js */
(function () {
  const introRoot = document.getElementById("cinematic-intro");

  /* Failsafe: if GSAP's plugins aren't present, still reveal the intro
     contents and clear the overlay rather than trapping the visitor on black. */
  function safeGsap() {
    return typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  }

  if (introRoot) {
    if (safeGsap()) {
      introRoot.classList.add("js-intro-ready");
    } else {
      introRoot.classList.remove("js-intro-ready");
    }
  }

  try {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.globalTimeline.timeScale(999);
  }

  /* ===== CINEMATIC INTRO (landing page) ===== */
  const intro = document.getElementById("cinematic-intro");
  if (intro) {
    const introDone = () => {
      document.body.style.overflow = "";
      gsap.to(intro, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut", onComplete: () => {
        intro.style.display = "none";
        window.dispatchEvent(new Event("resize"));
      } });
    };
    const skipIntro = () => {
      if (!intro.dataset.done) {
        intro.dataset.done = "1";
        introDone();
      }
    };
    const engage = () => {
      if (intro.dataset.done) return;
      intro.dataset.done = "1";
      gsap.to(introBegins, { autoAlpha: 1, duration: 0.35, ease: "sine.out" });
      gsap.to("#intro-begins span", {
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "0.35em",
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.to(introBegins, { autoAlpha: 0, delay: 1.6, duration: 0.6, ease: "sine.in" });
      gsap.to("#intro-content", { autoAlpha: 0, y: -30, delay: 1.4, duration: 0.7, ease: "power2.in" });
      gsap.to(intro, { autoAlpha: 0, delay: 2.0, duration: 1.0, ease: "power2.inOut", onComplete: () => {
        intro.style.display = "none";
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("resize"));
        document.getElementById("hero") && document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
      } });
    };

    const introContent = document.getElementById("intro-content");
    const introBegins = document.getElementById("intro-begins");

    document.body.style.overflow = "hidden";
    const enterBtn = document.getElementById("intro-enter");
    const skipBtn = document.getElementById("intro-skip");
    if (enterBtn) enterBtn.addEventListener("click", engage);
    if (skipBtn) skipBtn.addEventListener("click", skipIntro);
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") skipIntro(); });

    gsap.set("#intro-content", { autoAlpha: 1 });

    gsap.to("#intro-beams", { autoAlpha: 1, duration: 2.2, ease: "power2.inOut" });
    gsap.to("#intro-vignette", { autoAlpha: 1, duration: 2.2, ease: "power2.inOut", delay: 0.2 });
    gsap.to("#intro-silhouette", { autoAlpha: 1, y: -10, duration: 1.6, ease: "power3.out", delay: 0.9 });
    gsap.to("#intro-kicker", { autoAlpha: 1, duration: 1, ease: "power2.out", delay: 1.5 });
    gsap.to("#intro-title", { autoAlpha: 1, y: 10, duration: 1.2, ease: "power3.out", delay: 1.7 });
    gsap.to("#intro-sub", { autoAlpha: 1, duration: 1, ease: "power2.out", delay: 2.1 });
    gsap.to("#intro-quote", { autoAlpha: 1, duration: 1.1, ease: "power2.out", delay: 2.4 });
    gsap.to("#intro-stats", { autoAlpha: 1, duration: 1, ease: "power2.out", delay: 2.7 });

    const introTargets = [8, 872, 45, 1];
    gsap.utils.toArray("#intro-stats .intro-num").forEach((el, i) => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: introTargets[i],
        duration: 2,
        ease: "power2.out",
        delay: 2.8 + i * 0.12,
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); },
      });
    });

    gsap.to(".intro-cta", { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 3.4 });
  }

  /* ===== SCROLL PROGRESS BAR ===== */
  const scrollBar = document.getElementById("scroll-bar");
  const scrollPct = document.getElementById("scroll-pct");
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollBar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      scrollBar.style.transform = `scaleX(${p})`;
      if (scrollPct) scrollPct.textContent = String(Math.round(p * 100)).padStart(2, "0");
    },
    { passive: true }
  );

  /* ===== UNIFIED SPARKLE PARTICLES ===== */
  const canvas = document.getElementById("particle-canvas");
  if (canvas && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let scrollVel = 0;
  let lastY = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "scroll",
    () => {
      const dy = window.scrollY - lastY;
      scrollVel = scrollVel * 0.8 + dy * 0.2;
      lastY = window.scrollY;
    },
    { passive: true }
  );

  const colors = ["#d4af37", "#f5d77a", "#a0c4ff", "#ffffff"];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.3 - 0.1,
      r: 1 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.15 + Math.random() * 0.6,
      twinkle: 0.005 + Math.random() * 0.015,
    });
  }

  (function render() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    scrollVel *= 0.95;
    particles.forEach((p) => {
      p.y -= scrollVel * 0.05;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      p.alpha += p.twinkle;
      const a = 0.1 + Math.abs(Math.sin(p.alpha)) * 0.8;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, p.color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = a;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  })();
  } /* end particle canvas */

  /* ===== HERO LETTER REVEAL ===== */
  const heroLetters = document.querySelectorAll(".hero-letter");
  if (heroLetters.length) gsap.set(heroLetters, { y: 120, opacity: 0, rotate: 45 });
  if (heroLetters.length)
  gsap.to(heroLetters, {
    y: 0,
    opacity: 1,
    rotate: 0,
    duration: 1.3,
    ease: "expo.out",
    stagger: 0.06,
    delay: 0.2,
  });
  gsap.from(".hero-sub > span", {
    y: 24,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.12,
    delay: 1,
  });
  gsap.to("#hero .relative.z-10", {
    yPercent: -40,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* ===== UNIVERSAL REVEAL-ON-SCROLL ===== */
  gsap.utils.toArray(".reveal").forEach((el) => {
    if (el.classList.contains("trophy-card") || el.classList.contains("record-card") || el.classList.contains("tl-step")) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
  });

  /* ===== ACT I COUNTERS ===== */
  gsap.utils.toArray(".counter").forEach((el) => {
    const end = Number(el.dataset.v);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toString().padStart(2, "0");
      },
    });
  });

  /* ===== ACT II LA MASIA PARALLAX ===== */
  gsap.to(".bb-left", {
    yPercent: -15,
    ease: "none",
    scrollTrigger: { trigger: "#barcelona", start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.to(".bb-right", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: { trigger: "#barcelona", start: "top bottom", end: "bottom top", scrub: true },
  });

  /* ===== ACT III DYNASTY ===== */
  gsap.from(".dyn-stat", {
    y: 70,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: { trigger: ".dyn-stats", start: "top 80%" },
  });

  /* ===== ACT IV GLORY ===== */
  gsap.fromTo(
    ".glory-wrap",
    { filter: "grayscale(1) brightness(0.7)" },
    {
      filter: "grayscale(0) brightness(1)",
      ease: "none",
      scrollTrigger: { trigger: "#glory", start: "top 60%", end: "bottom 70%", scrub: true },
    }
  );
  gsap.from(".glory-row", {
    opacity: 0,
    y: 50,
    ease: "power3.out",
    stagger: 0.18,
    scrollTrigger: { trigger: ".glory-arc", start: "top 80%" },
  });

  /* ===== GOAT COUNTERS (scrub) ===== */
  gsap.utils.toArray(".goat-num").forEach((el) => {
    const end = Number(el.dataset.v);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: 1 },
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString();
      },
    });
  });

  /* ===== TACTICAL PLAYBOOK — GETAFE RUN ===== */
  const shotPath = document.getElementById("shotPath");
  if (shotPath) {
    const len = shotPath.getTotalLength();
    shotPath.style.strokeDasharray = len;
    shotPath.style.strokeDashoffset = len;
    const opts = {
      ease: "none",
      scrollTrigger: { trigger: "#tactical", start: "top 70%", end: "bottom 40%", scrub: 1 },
    };
    gsap.to(shotPath, { strokeDashoffset: 0, ...opts });
    gsap.to("#ball", {
      motionPath: { path: "#shotPath", align: "#shotPath", autoRotate: false, alignOrigin: [0.5, 0.5] },
      ...opts,
    });
    gsap.to("#ballGlow", {
      motionPath: { path: "#shotPath", align: "#shotPath", autoRotate: false, alignOrigin: [0.5, 0.5] },
      scale: 1.6,
      ...opts,
    });
  }
  ["d1", "d2", "d3", "d4"].forEach((id) => {
    gsap.fromTo(
      "#" + id,
      { x: 0, y: 0 },
      {
        x: () => (Math.random() - 0.5) * 30,
        y: () => (Math.random() - 0.5) * 30,
        ease: "power2.inOut",
        scrollTrigger: { trigger: "#tactical", start: "top 60%", end: "bottom 50%", scrub: 1.2 },
      }
    );
  });

  /* ===== TROPHY CARD 3D HOVER ===== */
  document.querySelectorAll(".trophy-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
      card.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg) translateZ(40px) scale(1.03)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0) scale(1)";
    });
  });

  /* ===== TIMELINE: scroll-drawn line + step stagger ===== */
  const tlWrap = document.querySelector(".tl-reveal");
  if (tlWrap) {
    const tlFill = document.createElement("div");
    tlFill.style.cssText = "position:absolute;left:-2px;top:0;width:2px;height:100%;background:linear-gradient(180deg,#38bdf8,#d4af37);transform-origin:top;box-shadow:0 0 12px rgba(212,175,55,0.45);z-index:1;";
    tlWrap.appendChild(tlFill);
    gsap.fromTo(tlFill, { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: tlWrap, start: "top 75%", end: "bottom 70%", scrub: 0.5 },
    });
    gsap.utils.toArray(".tl-step").forEach((step) => {
      gsap.fromTo(step, { opacity: 0, x: -40 }, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 85%" },
      });
    });
  }

  /* ===== RECORDS: staggered card cascade ===== */
  gsap.utils.toArray(".record-card").forEach((card, i) => {
    gsap.fromTo(card, { opacity: 0, y: 50, rotate: i % 2 ? 2 : -2 }, {
      opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: "power3.out", delay: (i % 3) * 0.12,
      scrollTrigger: { trigger: card, start: "top 92%" },
    });
  });

  /* ===== TROPHY ROOM: 3D staggered entrance ===== */
  gsap.fromTo(".trophy-card", { opacity: 0, y: 80, rotationX: -24, scale: 0.94, transformPerspective: 1200 }, {
    opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1.1, ease: "power3.out", stagger: 0.14,
    scrollTrigger: { trigger: "#trophy-grid", start: "top 80%" },
  });

  /* ===== MEMORY CARDS (staggered reveal) ===== */
  gsap.utils.toArray(".memory-card").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 40, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
  });

  /* ===== VIDEO MOMENT CARDS (staggered reveal) ===== */
  gsap.utils.toArray(".legend-video").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 50, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  /* ===== MOUSE PARALLAX ON SHARED BACKGROUND ===== */
  const bg = document.getElementById("movie-bg");
  if (bg)
  window.addEventListener("mousemove", (e) => {
    const xP = (e.clientX / window.innerWidth - 0.5) * 10;
    const yP = (e.clientY / window.innerHeight - 0.5) * 10;
    gsap.to(bg, { x: xP, y: yP, duration: 1.2, ease: "power2.out" });
  });

  /* ===== RECALCULATE TRIGGERS ONCE ALL IMAGES/FONTS ARE IN ===== */
  window.addEventListener("load", () => ScrollTrigger.refresh());

  /* ===== FULLSCREEN GALLERY LIGHTBOX (PDF §8) ===== */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const cards = Array.from(document.querySelectorAll("#memory-grid .memory-card"));
    const lbImg = document.getElementById("lb-img");
    const lbCaption = document.getElementById("lb-caption");
    let lbIndex = 0;
    const show = (i) => {
      lbIndex = (i + cards.length) % cards.length;
      const img = cards[lbIndex].querySelector("img");
      lbImg.src = img.dataset.full || img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      document.body.style.overflow = "hidden";
    };
    const hide = () => {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
      document.body.style.overflow = "";
    };
    cards.forEach((card, i) => {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("click", () => show(i));
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(i); } });
    });
    document.getElementById("lb-close").addEventListener("click", hide);
    document.getElementById("lb-prev").addEventListener("click", () => show(lbIndex - 1));
    document.getElementById("lb-next").addEventListener("click", () => show(lbIndex + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) hide(); });
    window.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(lbIndex - 1);
      if (e.key === "ArrowRight") show(lbIndex + 1);
    });
  }
  } catch (err) {
    /* If anything above threw, never leave the visitor trapped on black
       or with hidden scroll-reveal sections. */
    if (introRoot) {
      introRoot.style.opacity = "0";
      introRoot.style.pointerEvents = "none";
      introRoot.style.display = "none";
    }
    document.body.style.overflow = "";
    document.querySelectorAll(".reveal, .hero-letter, .hero-sub, .rosario-card, .trophy-card, .glory-row, .memory-card, .legend-video, .dyn-stat, .tl-step, .final-stat").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "";
    });
  }
})();
