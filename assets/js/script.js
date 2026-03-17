document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // 1. SMOOTH SCROLL SETUP (Lenis)
  // ============================================
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ============================================
  // 2. CUSTOM CURSOR
  // ============================================
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  let mouseX = 0,
    mouseY = 0;
  let followerX = 0,
    followerY = 0;

  let lastMouseMove = 0;
  document.addEventListener(
    "mousemove",
    (e) => {
      const now = Date.now();
      if (now - lastMouseMove > 16) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.set(cursor, { x: mouseX, y: mouseY });
        lastMouseMove = now;
      }
    },
    { passive: true },
  );

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverables = document.querySelectorAll("a, button");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

  // ============================================
  // 3. BUBBLE MENU
  // ============================================
  const MENU_BG = "#ffffff";
  const MENU_CONTENT_COLOR = "#000000";
  const ANIMATION_EASE = "back.out(1.5)";
  const ANIMATION_DURATION = 0.5;
  const STAGGER_DELAY = 0.12;

  const menuItems = [
    {
      label: "home",
      href: "#",
      ariaLabel: "Home",
      rotation: -8,
      hoverStyles: { bgColor: "#ed6a5a", textColor: "#ffffff" },
    },
    {
      label: "about",
      href: "#",
      ariaLabel: "About",
      rotation: 8,
      hoverStyles: { bgColor: "#f4f1bb", textColor: "#111111" },
    },
    {
      label: "projects",
      href: "#",
      ariaLabel: "Projects",
      rotation: 8,
      hoverStyles: { bgColor: "#9bc1bc", textColor: "#111111" },
    },
    {
      label: "contact",
      href: "#",
      ariaLabel: "Contact",
      rotation: -8,
      hoverStyles: { bgColor: "#5d576b", textColor: "#ffffff" },
    },
    {
      label: "blog",
      href: "#",
      ariaLabel: "Blog",
      rotation: -8,
      hoverStyles: { bgColor: "#5d576b", textColor: "#ffffff" },
    },
  ];

  const pillList = document.querySelector(".pill-list");
  const bubbleEls = [];
  const labelEls = [];

  menuItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "pill-col";
    li.setAttribute("role", "none");

    const a = document.createElement("a");
    a.className = "pill-link";
    a.href = item.href;
    a.setAttribute("role", "menuitem");
    a.setAttribute("aria-label", item.ariaLabel || item.label);
    a.style.setProperty("--item-rot", `${item.rotation ?? 0}deg`);
    a.style.setProperty("--pill-bg", MENU_BG);
    a.style.setProperty("--pill-color", MENU_CONTENT_COLOR);
    a.style.setProperty("--hover-bg", item.hoverStyles?.bgColor || "#1a1a1a");
    a.style.setProperty(
      "--hover-color",
      item.hoverStyles?.textColor || MENU_CONTENT_COLOR,
    );

    const span = document.createElement("span");
    span.className = "pill-label";
    span.textContent = item.label;

    a.appendChild(span);
    li.appendChild(a);
    pillList.appendChild(li);

    bubbleEls.push(a);
    labelEls.push(span);
  });

  let isMenuOpen = false;
  const toggleBtn = document.getElementById("menuToggle");
  const overlay = document.getElementById("menuOverlay");

  toggleBtn.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    toggleBtn.setAttribute("aria-pressed", String(isMenuOpen));
    toggleBtn.classList.toggle("open", isMenuOpen);
    overlay.setAttribute("aria-hidden", String(!isMenuOpen));

    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
      lenis.stop();
      openMenu();
    } else {
      document.body.classList.remove("no-scroll");
      lenis.start();
      closeMenu();
    }
  });

  function openMenu() {
    gsap.set(overlay, { display: "flex" });
    gsap.killTweensOf([...bubbleEls, ...labelEls]);
    gsap.set(bubbleEls, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(labelEls, { y: 24, autoAlpha: 0 });

    gsap.to(document.documentElement, {
      "--blur-amount": "8px",
      duration: 0.6,
      ease: "power2.out",
    });

    bubbleEls.forEach((bubble, i) => {
      const jitter = gsap.utils.random(-0.05, 0.05);
      const delay = i * STAGGER_DELAY + jitter;
      const tl = gsap.timeline({ delay });

      tl.to(bubble, {
        scale: 1,
        duration: ANIMATION_DURATION,
        ease: ANIMATION_EASE,
      });

      if (labelEls[i]) {
        tl.to(
          labelEls[i],
          {
            y: 0,
            autoAlpha: 1,
            duration: ANIMATION_DURATION,
            ease: "power3.out",
          },
          `-=${ANIMATION_DURATION * 0.9}`,
        );
      }
    });
  }

  function closeMenu() {
    gsap.killTweensOf([...bubbleEls, ...labelEls]);

    gsap.to(document.documentElement, {
      "--blur-amount": "0px",
      duration: 0.4,
      ease: "power2.in",
    });

    gsap.to(labelEls, {
      y: 24,
      autoAlpha: 0,
      duration: 0.2,
      ease: "power3.in",
    });

    gsap.to(bubbleEls, {
      scale: 0,
      duration: 0.2,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
      },
    });
  }

  window.addEventListener("resize", () => {
    if (!isMenuOpen) return;
    const isDesktop = window.innerWidth >= 900;
    bubbleEls.forEach((bubble, i) => {
      const rotation = isDesktop ? (menuItems[i].rotation ?? 0) : 0;
      gsap.set(bubble, { rotation });
    });
  });

  // ============================================
  // 4. LOADING SCREEN & TRANSITION
  // ============================================
  const loadingScreen = document.getElementById("loading-screen");
  const homeContent = document.getElementById("home-content");

  const LOADING_DURATION = 1800;
  const FADE_OUT_DELAY = 400;
  const REVEAL_DELAY = 700;

  setTimeout(() => {
    loadingScreen.classList.add("fade-out");

    setTimeout(() => {
      revealTransition();

      setTimeout(() => {
        homeContent.classList.add("content-visible");
        document.body.classList.remove("no-scroll");

        initHomeAnimations();

        setTimeout(() => {
          if (loadingScreen.parentNode) {
            loadingScreen.remove();
          }
        }, 1000);
      }, REVEAL_DELAY);
    }, FADE_OUT_DELAY);
  }, LOADING_DURATION);

  function revealTransition() {
    gsap.set(".curtain-layer", { scaleY: 1, transformOrigin: "top" });
    gsap.to(".curtain-layer", {
      scaleY: 0,
      duration: 0.8,
      stagger: -0.1,
      ease: "power2.inOut",
    });
  }

  // ============================================
  // 5. HOME ANIMATIONS & SCROLL EFFECTS
  // ============================================
  function initHomeAnimations() {
    const tl = gsap.timeline();
    tl.to(".name", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }).to(
      ".subtitle",
      { opacity: 1, duration: 1 },
      "-=1",
    );

    gsap.to(".hero-img", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    gsap.to(".hero-text-container", {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom 30%",
        scrub: 0.3,
      },
    });
  }

  // ============================================
  // 6. SCROLL STACK CARD EFFECT
  // ============================================
  const CONFIG = {
    itemDistance: 100,
    itemScale: 0.03,
    itemStackDistance: 30,
    stackPosition: "20%",
    scaleEndPosition: "10%",
    baseScale: 0.85,
    rotationAmount: 0,
  };

  const cards = Array.from(document.querySelectorAll(".scroll-stack-card"));
  const stackEnd = document.getElementById("stackEnd");

  let cardOffsets = [];
  let endOffset = 0;
  let viewportH = window.innerHeight;

  function cacheOffsets() {
    viewportH = window.innerHeight;
    const currentScroll = window.scrollY;
    cardOffsets = cards.map(
      (c) => c.getBoundingClientRect().top + currentScroll,
    );
    endOffset = stackEnd.getBoundingClientRect().top + currentScroll;
  }

  cards.forEach((card, i) => {
    if (i < cards.length - 1)
      card.style.marginBottom = `${CONFIG.itemDistance}px`;
    card.style.willChange = "transform";
    card.style.transformOrigin = "top center";
    card.style.backfaceVisibility = "hidden";
  });

  const lastTransforms = new Map();

  function parsePercentage(value, h) {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * h;
    }
    return parseFloat(value);
  }

  function clampedProgress(scroll, start, end) {
    if (scroll <= start) return 0;
    if (scroll >= end) return 1;
    return (scroll - start) / (end - start);
  }

  function updateCardTransforms(scrollTop) {
    const stackPx = parsePercentage(CONFIG.stackPosition, viewportH);
    const scaleEndPx = parsePercentage(CONFIG.scaleEndPosition, viewportH);
    const pinEnd = endOffset - viewportH / 2;

    for (let i = 0; i < cards.length; i++) {
      const cardTop = cardOffsets[i];
      const triggerStart = cardTop - stackPx - CONFIG.itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPx;
      const pinStart = triggerStart;

      const scaleProgress = clampedProgress(
        scrollTop,
        triggerStart,
        triggerEnd,
      );
      const targetScale = CONFIG.baseScale + i * CONFIG.itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = CONFIG.rotationAmount
        ? i * CONFIG.rotationAmount * scaleProgress
        : 0;

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY =
          scrollTop - cardTop + stackPx + CONFIG.itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPx + CONFIG.itemStackDistance * i;
      }

      const t = {
        ty: Math.round(translateY * 1000) / 1000,
        s: Math.round(scale * 1000) / 1000,
        r: Math.round(rotation * 100) / 100,
      };

      const prev = lastTransforms.get(i);
      const changed =
        !prev ||
        Math.abs(prev.ty - t.ty) > 0.1 ||
        Math.abs(prev.s - t.s) > 0.0001;

      if (changed) {
        cards[i].style.transform =
          `translate3d(0,${t.ty}px,0) scale(${t.s}) rotate(${t.r}deg)`;
        lastTransforms.set(i, t);
      }
    }
  }

  // Utilisation du ticker GSAP pour synchroniser avec le rafraîchissement écran
  gsap.ticker.add(() => {
    updateCardTransforms(window.scrollY);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cacheOffsets();
    }, 100);
  });

  // Initialisation
  cacheOffsets();

  // ============================================
  // 7. TECH STACK INTERACTIVE MARQUEE
  // ============================================
  const techRows = document.querySelectorAll(".tech-row");

  techRows.forEach((row) => {
    const marqueeInner = row.querySelector(".tech-marquee-inner");

    // 1. On clone le contenu pour créer une boucle infinie parfaite
    const content = marqueeInner.innerHTML;
    marqueeInner.innerHTML = content + content + content; // On triple pour être sûr d'avoir de la marge

    // 2. On crée l'animation GSAP du bandeau défilant
    const tween = gsap.to(marqueeInner, {
      xPercent: -33.33, // On décale d'un tiers (puisqu'on a triplé le contenu)
      duration: 10,
      ease: "none",
      repeat: -1,
      paused: true,
    });

    // 3. Interactions au survol
    row.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover"); // Fait grossir ton curseur custom
      tween.play(); // Lance le défilement
    });

    row.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
      tween.pause(); // Met en pause le défilement
    });
  });

  // Animation d'entrée au scroll
  gsap.from(".tech-row", {
    scrollTrigger: {
      trigger: ".tech-list",
      start: "top 85%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
  });

  // ============================================
  // 8. ABOUT SECTION ANIMATIONS
  // ============================================

  // Compteur animé pour les stats
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    gsap.to(
      { val: 0 },
      {
        val: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val);
        },
      },
    );
  }

  ScrollTrigger.create({
    trigger: ".about-stats",
    start: "top 80%",
    once: true,
    onEnter: () => {
      document.querySelectorAll(".stat-number").forEach(animateCounter);
    },
  });

  // Révélation des mots de la grande phrase au scroll
  const wordSpans = document.querySelectorAll(".word-reveal");
  if (wordSpans.length) {
    ScrollTrigger.create({
      trigger: ".about-statement",
      start: "top 75%",
      end: "bottom 30%",
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        wordSpans.forEach((span, i) => {
          const threshold = i / wordSpans.length;
          if (progress >= threshold) {
            span.classList.add("lit");
          } else {
            span.classList.remove("lit");
          }
        });
      },
    });
  }

  // Animation d'entrée de la grille about
  gsap.from(".about-photo-frame", {
    scrollTrigger: { trigger: ".about-grid", start: "top 80%" },
    x: -60,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
  });

  gsap.from(".about-content-col > *", {
    scrollTrigger: { trigger: ".about-grid", start: "top 80%" },
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
  });

  // ============================================
  // 9. PROJECTS SECTION ANIMATIONS
  // ============================================

  // Titre projects — reveal au scroll
  gsap.from(".projects-title", {
    scrollTrigger: { trigger: ".projects-header", start: "top 85%" },
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
  });

  // Items de la liste — stagger au scroll
  gsap.from(".project-item", {
    scrollTrigger: { trigger: ".projects-list", start: "top 85%" },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
  });

  // ============================================
  // 10. PROJECT TRANSITIONS — "THE ORIGIN"
  // Concept : un cercle coloré explose depuis
  // le point de clic exact, le numéro du projet
  // se matérialise en géant puis s'implose avant
  // que la page vole en éclats verticaux.
  // ============================================

  (function initProjectTransitions() {
    // ── Détecte si on revient d'une page projet ──
    if (document.referrer.includes("projects/")) {
      playReturnTransition();
    }

    // ── Attache les handlers sur chaque projet ──
    document.querySelectorAll(".project-item[data-href]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        const href = item.dataset.href;
        const color = item.dataset.color || "#ed6a5a";
        const num = item.querySelector(".project-num").textContent.trim();

        // Micro-feedback immédiat sur l'élément cliqué
        gsap.to(item, {
          scale: 1.015,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () => gsap.set(item, { scale: 1 }),
        });

        playOriginTransition(e.clientX, e.clientY, color, num, href);
      });
    });

    // ─────────────────────────────────────────
    // TRANSITION SORTIE — "THE ORIGIN"
    // ─────────────────────────────────────────
    function playOriginTransition(ox, oy, color, num, href) {
      // Rayon max pour couvrir tout le viewport depuis le point de clic
      const maxR =
        Math.hypot(
          Math.max(ox, innerWidth - ox),
          Math.max(oy, innerHeight - oy),
        ) * 1.15;

      // ── Construire les éléments overlay ──
      const wrap = document.createElement("div");
      wrap.className = "pt-wrap";

      // 1. Barres verticales (déchirure finale)
      const SHARDS = 9;
      const shardsEl = document.createElement("div");
      shardsEl.className = "pt-shards";
      for (let i = 0; i < SHARDS; i++) {
        const s = document.createElement("div");
        s.className = "pt-shard";
        s.style.background = color;
        s.style.transform = "scaleY(0)";
        shardsEl.appendChild(s);
      }

      // 2. Cercle coloré (clip-path expand depuis le clic)
      const circle = document.createElement("div");
      circle.className = "pt-circle";
      circle.style.background = color;
      circle.style.clipPath = `circle(0px at ${ox}px ${oy}px)`;

      // 3. Numéro géant fantôme centré
      const numEl = document.createElement("div");
      numEl.className = "pt-number";
      numEl.textContent = num;
      numEl.style.opacity = "0";
      numEl.style.transform = "scale(0.4)";

      // 4. Flash de fin
      const flash = document.createElement("div");
      flash.className = "pt-flash";

      wrap.appendChild(shardsEl);
      wrap.appendChild(circle);
      wrap.appendChild(numEl);
      wrap.appendChild(flash);
      document.body.appendChild(wrap);

      lenis.stop(); // Stoppe le smooth scroll

      // ── Timeline ──
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      // Phase 1 — Les sections de la page tombent de façon alternée (0 → 0.45s)
      tl.to(
        [
          ".hero",
          ".scroll-stack-section",
          ".about-section",
          ".projects-section",
          ".tech-stack-section",
          ".footer",
        ],
        {
          y: (i) => (i % 2 === 0 ? -60 : 60),
          opacity: 0,
          duration: 0.45,
          ease: "power3.in",
          stagger: { each: 0.04, from: "center" },
        },
        0,
      );

      // Phase 2 — Le cercle coloré explose depuis le point de clic (0.1 → 0.9s)
      tl.to(
        circle,
        {
          clipPath: `circle(${maxR}px at ${ox}px ${oy}px)`,
          duration: 0.8,
          ease: "expo.inOut",
        },
        0.1,
      );

      // Phase 3 — Le numéro géant se matérialise au centre (0.45 → 0.85s)
      tl.to(
        numEl,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        0.45,
      );

      // Phase 4 — Le numéro s'implose (0.85 → 1.2s)
      tl.to(
        numEl,
        {
          scale: 0.05,
          opacity: 0,
          duration: 0.35,
          ease: "power4.in",
        },
        0.85,
      );

      // Phase 5 — Barres verticales déchirent l'écran depuis le centre (1.0 → 1.35s)
      tl.to(
        ".pt-shard",
        {
          scaleY: 1,
          transformOrigin: "top center",
          duration: 0.3,
          ease: "power3.in",
          stagger: {
            each: 0.025,
            from: "center",
          },
        },
        1.0,
      );

      // Phase 6 — Flash final puis navigation (1.3 → 1.45s)
      tl.to(
        flash,
        {
          opacity: 1,
          duration: 0.15,
          ease: "none",
          onComplete() {
            window.location.href = href;
          },
        },
        1.3,
      );
    }

    // ─────────────────────────────────────────
    // TRANSITION RETOUR
    // Dans tes pages projet, ajoute un lien retour
    // vers index.html?from=project pour activer
    // cette animation d'entrée.
    // ─────────────────────────────────────────
    function playReturnTransition() {
      const curtain = document.createElement("div");
      curtain.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:9999999",
        "background:#0a0a0a",
        "pointer-events:all",
        "transform-origin:top",
      ].join(";");
      document.body.appendChild(curtain);

      gsap.to(curtain, {
        scaleY: 0,
        duration: 0.9,
        ease: "expo.inOut",
        delay: 0.1,
        onComplete: () => curtain.remove(),
      });
    }
  })(); // fin initProjectTransitions
});
