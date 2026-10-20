/* ==========================================================================
   PORTFOLIO — Thibault Brebion
   Animations (GSAP + ScrollTrigger + Draggable), scroll fluide (Lenis),
   panneaux projets / stages, filtres, formulaire.
   Le contenu (skills, projets, stages) vient de data.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // 0. HELPERS
  // ============================================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const hasGsap = typeof gsap !== "undefined";
  const animate = hasGsap && !reduceMotion;

  if (hasGsap) {
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    if (typeof Draggable !== "undefined") gsap.registerPlugin(Draggable);
  }

  const THEME_COLORS = {
    paper: "#f4efe6",
    ink: "#121212",
    sun: "#ffc733",
    blue: "#3048ff",
    pink: "#ffa6d2",
    lime: "#c8f542",
    tomato: "#ff5b37",
  };

  // Famille de chaque catégorie de compétence (filtres + palette)
  const SKILL_GROUPS = {
    Front: "dev",
    Langage: "dev",
    Framework: "dev",
    Mobile: "dev",
    Architecture: "dev",
    Base: "data",
    NoSQL: "data",
    Modélisation: "data",
    ETL: "data",
    Middleware: "data",
    Scripting: "script",
    OS: "script",
    Outil: "tools",
    Design: "tools",
    Méthode: "tools",
    IDE: "tools",
  };

  const FOCUSABLE =
    'a[href], button:not([disabled]), input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])';

  // Focus initial, piège du focus (Tab) et retour du focus à la fermeture
  function createModalFocus(modal) {
    let lastFocused = null;
    function onKeydown(e) {
      if (e.key !== "Tab") return;
      const items = $$(FOCUSABLE, modal).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    return {
      open(focusEl) {
        lastFocused = document.activeElement;
        modal.addEventListener("keydown", onKeydown);
        if (focusEl) focusEl.focus({ preventScroll: true });
      },
      close() {
        modal.removeEventListener("keydown", onKeydown);
        if (lastFocused && lastFocused.focus) {
          lastFocused.focus({ preventScroll: true });
        }
      },
    };
  }

  // ============================================
  // 1. SCROLL FLUIDE (Lenis) + verrouillage
  // ============================================
  window.scrollTo(0, 0);
  let lenis = null;
  if (typeof Lenis !== "undefined" && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    if (hasGsap && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  let lockCount = 0;
  const scrollLock = {
    stop() {
      lockCount++;
      if (lenis) lenis.stop();
      else document.documentElement.style.overflow = "hidden";
    },
    start() {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount) return;
      if (lenis) lenis.start();
      else document.documentElement.style.overflow = "";
    },
  };

  function scrollToTarget(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, {
        duration: 1.5,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
    } else {
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  // ============================================
  // 2. ÉTAT INITIAL DES ANIMATIONS D'ENTRÉE
  // ============================================
  if (animate) {
    gsap.set(".hero .line-inner", { yPercent: 115 });
    gsap.set(".hero-bottom > *", { y: 40, opacity: 0 });
    gsap.set(".sticker", { scale: 0 });
    gsap.set(".hero-marquee", { yPercent: 160 });
    gsap.set(".header", { yPercent: -120 });
  }

  // ============================================
  // 3. LOADER
  // ============================================
  function runLoader() {
    return new Promise((resolve) => {
      const loader = $("#loader");
      if (!loader) return resolve();
      if (!animate) {
        loader.remove();
        return resolve();
      }

      if (lenis) lenis.stop();
      const count = $("[data-loader-count]", loader);
      const bar = $("[data-loader-bar]", loader);
      const track = $(".loader-words-track", loader);
      const words = track.children.length;
      const panels = $$(".loader-panels span", loader);
      const state = { p: 0 };

      gsap.set(panels, { y: 0, yPercent: 101 });

      const tl = gsap.timeline({ paused: true });

      // Compteur 0 → 100 + barre
      tl.to(
        state,
        {
          p: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            count.textContent = Math.round(state.p);
            bar.style.transform = `scaleX(${state.p / 100})`;
          },
        },
        0,
      );

      // Les mots défilent un par un
      for (let i = 1; i < words; i++) {
        tl.to(
          track,
          { yPercent: (-100 * i) / words, duration: 0.32, ease: "expo.inOut" },
          0.12 + i * 0.36,
        );
      }

      // Rideaux de couleur qui montent… puis repartent vers le haut
      tl.to(panels, {
        yPercent: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "expo.inOut",
      })
        .set([".loader-top", ".loader-words", ".loader-bottom"], { autoAlpha: 0 })
        .set(loader, { backgroundColor: "transparent" })
        .add(() => {
          document.body.classList.remove("is-loading");
          heroIntro();
        })
        .to(panels, {
          yPercent: -101,
          duration: 0.8,
          stagger: 0.06,
          ease: "expo.inOut",
        })
        .add(() => {
          loader.remove();
          resolve();
        });

      // Démarre quand les polices sont prêtes (max 1,2 s d'attente)
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]).then(() =>
        tl.play(),
      );
    });
  }

  function heroIntro() {
    if (!animate) return;
    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(".hero .line-inner", {
      yPercent: 0,
      duration: 1.3,
      stagger: 0.12,
      ease: "expo.out",
    })
      .to(".header", { yPercent: 0, duration: 1, ease: "expo.out", clearProps: "transform" }, 0.1)
      .to(
        ".hero-bottom > *",
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out" },
        0.35,
      )
      .to(
        ".sticker",
        {
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "back.out(1.9)",
          clearProps: "scale",
        },
        0.55,
      )
      .to(".hero-marquee", { yPercent: 0, duration: 1.2, ease: "expo.out" }, 0.45);
  }

  // ============================================
  // 4. HEADER : horloge du footer + masquage au scroll
  // ============================================
  function initHeader() {
    const header = $(".header");
    const footerClock = $("[data-clock-footer]");
    const fmt = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Paris",
    });
    const tick = () => {
      const t = fmt.format(new Date());
      if (footerClock) footerClock.textContent = `Vendée, FR — ${t}`;
    };
    tick();
    setInterval(tick, 1000);

    let lastY = window.scrollY;
    const onScroll = (y, direction) => {
      const hide =
        direction > 0 && y > 240 && !document.body.classList.contains("menu-open");
      header.classList.toggle("is-hidden", hide);
    };
    if (lenis) {
      lenis.on("scroll", (l) => onScroll(l.scroll, l.direction));
    } else {
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY;
          onScroll(y, y - lastY);
          lastY = y;
        },
        { passive: true },
      );
    }
  }

  // ============================================
  // 5. MENU PLEIN ÉCRAN
  // ============================================
  const menu = $("#menu");
  const menuBtn = $("#menuBtn");
  let menuOpen = false;

  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    $(".menu-btn-label", menuBtn).textContent = open ? "Fermer" : "Menu";

    if (open) {
      scrollLock.stop();
      $(".header").classList.remove("is-hidden");
      if (animate) {
        gsap.fromTo(
          ".menu-links a",
          { yPercent: 110 },
          { yPercent: 0, duration: 1, stagger: 0.045, ease: "expo.out", delay: 0.2 },
        );
        gsap.fromTo(
          ".menu-aside > *",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out", delay: 0.45 },
        );
      }
    } else {
      scrollLock.start();
    }
  }

  function initMenu() {
    menu.inert = true;
    menuBtn.addEventListener("click", () => setMenu(!menuOpen));

    // Tous les liens d'ancre internes passent par le scroll fluide
    $$("[data-scroll-to]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        e.preventDefault();
        const wasOpen = menuOpen;
        setMenu(false);
        setTimeout(() => scrollToTarget(href), wasOpen ? 150 : 0);
      });
    });
  }

  // Effets du menu : lettres qui roulent, couleur qui envahit l'écran depuis
  // le curseur, grand numéro + phrase de la section, repère « vous êtes ici »
  function initMenuFx() {
    const links = $$(".menu-links a");
    const flood = $(".menu-flood", menu);
    const num = $("[data-menu-num]", menu);
    const blurb = $("[data-menu-blurb]", menu);
    if (!links.length || !flood) return;

    // Chaque lettre est doublée pour rouler au survol ; le nom reste lisible via aria-label
    links.forEach((a) => {
      const numEl = a.querySelector("span");
      const name = a.textContent.replace(numEl?.textContent || "", "").trim();
      a.setAttribute("aria-label", name);
      const word = document.createElement("span");
      word.className = "ml-word";
      word.setAttribute("aria-hidden", "true");
      word.innerHTML = [...name]
        .map((c, i) => `<span class="ml-ch" style="--i: ${i}"><span>${c}</span><span>${c}</span></span>`)
        .join("");
      [...a.childNodes].forEach((n) => n.nodeType === Node.TEXT_NODE && n.remove());
      a.appendChild(word);
    });

    let current = null;
    let here = null;
    let toneTimer = 0;

    const setPreview = (link) => {
      if (!link) return;
      num.textContent = link.querySelector("span").textContent;
      blurb.textContent = link.dataset.blurb || "";
      if (!animate) return;
      gsap.fromTo(num, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out", overwrite: true });
      gsap.fromTo(blurb, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.05, ease: "expo.out", overwrite: true });
    };

    // Nouvelle couche de couleur qui grandit depuis (x, y) ; les anciennes sont retirées dessous
    const pour = (color, tone, x, y) => {
      const layer = document.createElement("span");
      layer.className = "menu-flood-layer";
      layer.style.background = color;
      layer.style.setProperty("--fx", `${x}px`);
      layer.style.setProperty("--fy", `${y}px`);
      flood.appendChild(layer);
      layer.getBoundingClientRect(); // force le point de départ de la transition
      layer.classList.add("is-in");
      const clear = () => {
        while (flood.firstChild && flood.firstChild !== layer) flood.firstChild.remove();
      };
      if (animate) layer.addEventListener("transitionend", clear, { once: true });
      else clear();
      // Le texte change de teinte une fois que la couleur a couvert le lien survolé
      clearTimeout(toneTimer);
      toneTimer = setTimeout(
        () => {
          menu.dataset.tone = tone;
          document.body.dataset.menuTone = tone;
        },
        animate ? 160 : 0,
      );
    };

    const activate = (link, x, y) => {
      if (link === current) return;
      current = link;
      pour(link.style.getPropertyValue("--h"), link.dataset.tone || "ink", x, y);
      links.forEach((l) => l.classList.toggle("is-dim", l !== link));
      setPreview(link);
    };

    const release = (x, y) => {
      if (!current) return;
      current = null;
      pour("var(--ink)", "paper", x, y);
      links.forEach((l) => l.classList.remove("is-dim"));
      setPreview(here);
    };

    const list = $(".menu-links", menu);
    links.forEach((link) => {
      link.addEventListener("pointerenter", (e) => activate(link, e.clientX, e.clientY));
      // Tactile : la couleur jaillit du doigt juste avant de naviguer
      link.addEventListener("pointerdown", (e) => e.pointerType !== "mouse" && activate(link, e.clientX, e.clientY));
      link.addEventListener("focus", () => {
        const r = link.getBoundingClientRect();
        activate(link, r.left + 24, r.top + r.height / 2);
      });
    });
    list.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && release(e.clientX, e.clientY));

    // À l'ouverture : section en cours de lecture + menu remis à l'encre
    menuBtn.addEventListener("click", () => {
      if (!menuOpen) return;
      const mid = window.innerHeight / 2;
      const section = $$("main > section[id]").find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      here = links.find((l) => l.getAttribute("href") === `#${section?.id}`) || links[0];
      links.forEach((l) => l.classList.toggle("is-current", l === here));
      current = null;
      clearTimeout(toneTimer);
      flood.innerHTML = "";
      links.forEach((l) => l.classList.remove("is-dim"));
      menu.dataset.tone = "paper";
      document.body.dataset.menuTone = "paper";
      num.textContent = here.querySelector("span").textContent;
      blurb.textContent = here.dataset.blurb || "";
    });
  }

  // ============================================
  // 6. THÈME DE COULEUR SELON LA SECTION
  // ============================================
  function initThemes() {
    const meta = $('meta[name="theme-color"]');
    const setTheme = (theme) => {
      if (document.body.dataset.theme === theme) return;
      document.body.dataset.theme = theme;
      if (meta) meta.setAttribute("content", THEME_COLORS[theme] || "#f4efe6");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setTheme(entry.target.dataset.theme);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    $$("main > section[data-theme]").forEach((s) => observer.observe(s));

    // Marquees et stickers qui tournent : en pause quand ils ne sont pas visibles
    const pauser = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-offscreen", !entry.isIntersecting));
    });
    $$(".hero, .watch-bands").forEach((el) => pauser.observe(el));
  }

  // ============================================
  // 7. CURSEUR CONTEXTUEL + BOUTONS MAGNÉTIQUES
  // ============================================
  function initCursor() {
    if (!finePointer) return;
    const cursor = $(".cursor");
    const label = $(".cursor-label");
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      running = false;

    // La boucle s'arrête quand la bulle a rejoint la souris
    const tick = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cursor.style.translate = `${cx}px ${cy}px`;
      if (Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    window.addEventListener(
      "mousemove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        if (!running) {
          running = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true },
    );

    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("[data-cursor]");
      if (target) {
        label.textContent = target.dataset.cursor;
        cursor.classList.add("is-active");
      } else {
        cursor.classList.remove("is-active");
      }
    });
  }

  function initMagnetic() {
    if (!finePointer || !animate) return;
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // ============================================
  // 8. HERO : mot qui tourne, stickers, parallaxe
  // ============================================
  function initHero() {
    // Mot qui tourne
    const rotator = $(".hero-rotator");
    const track = $(".hero-rotator-track");
    const items = $$("em", track);
    if (animate && items.length) {
      let i = 0;
      gsap.set(rotator, { width: items[0].offsetWidth });
      setInterval(() => {
        i = (i + 1) % items.length;
        gsap.to(track, {
          yPercent: (-100 * i) / items.length,
          duration: 0.9,
          ease: "expo.inOut",
        });
        gsap.to(rotator, {
          width: items[i].offsetWidth,
          duration: 0.9,
          ease: "expo.inOut",
        });
      }, 2400);
    }

    // Stickers déplaçables (souris uniquement : sur mobile ils gênent le scroll)
    if (hasGsap && typeof Draggable !== "undefined" && finePointer) {
      $$(".sticker").forEach((sticker) => {
        Draggable.create(sticker, {
          bounds: ".hero",
          zIndexBoost: true,
          onPress() {
            sticker.classList.add("is-dragging");
            $(".hero-hint")?.classList.add("is-done");
          },
          onRelease() {
            sticker.classList.remove("is-dragging");
          },
        });
      });
    }

    // Parallaxe au scroll : les deux lignes du nom s'écartent
    if (animate && typeof ScrollTrigger !== "undefined") {
      const st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to(".hero-title .line:first-child .line-inner", { xPercent: -10, scrollTrigger: st });
      gsap.to(".hero-title .line--2 .line-inner", { xPercent: 8, scrollTrigger: { ...st } });
      // Sur mobile les stickers sont dans le flux : la parallaxe creuserait un trou
      gsap.matchMedia().add("(min-width: 801px)", () => {
        gsap.to(".hero-stickers", { y: -140, scrollTrigger: { ...st } });
      });
    }
  }

  // ============================================
  // 9. PARCOURS : scroll horizontal (desktop)
  // ============================================
  function initJourney() {
    const track = $(".journey-track");
    const cards = $$(".j-card", track);
    const current = $("[data-journey-current]");
    const total = $("[data-journey-total]");
    const bar = $("[data-journey-bar]");
    if (!track || !cards.length) return;
    if (total) total.textContent = String(cards.length).padStart(2, "0");
    if (!animate || typeof ScrollTrigger === "undefined") return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".journey-pin",
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            const i = Math.min(
              cards.length - 1,
              Math.round(self.progress * (cards.length - 1)),
            );
            if (current) current.textContent = String(i + 1).padStart(2, "0");
          },
        },
      });

      // Chaque carte « tombe » en place quand elle entre par la droite
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 90,
          rotate: i % 2 ? 9 : -9,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 100%",
            end: "left 65%",
            scrub: true,
          },
        });
      });
    });
  }

  // ============================================
  // 10. COMPÉTENCES : rendu + filtres
  // ============================================
  function initSkills() {
    const wall = $("[data-skills-wall]");
    const plane = $("[data-skills-plane]");
    const list = $("[data-skills-list]");
    if (!wall || !plane || typeof SKILLS === "undefined") return;

    const COLORS = ["var(--tomato)", "var(--blue)", "var(--lime)", "var(--pink)", "var(--sun)"];

    const skills = SKILLS.map((s, i) => ({
      ...s,
      group: SKILL_GROUPS[s.category] || "tools",
      color: COLORS[i % COLORS.length],
    }));

    // Le mur est décoratif (tuiles dupliquées) : la liste lisible est à part
    if (list) {
      list.innerHTML = skills
        .map((s) => `<li>${s.name} — ${s.category}, niveau ${s.level}</li>`)
        .join("");
    }
    const count = $("[data-skills-count]");
    if (count) count.textContent = skills.length;

    // ---- Mur 3D en dérive ----
    const TILE_W = 200;
    const UNIT = 132 + 18; // hauteur de tuile + gap
    const SPEED = 38; // px/s
    const VARIANCE = 0.45;
    const PARALLAX = 0.6;
    const BASE = { tilt: 18, turn: 0, depth: 120 };

    const tileHTML = (s, c) => {
      const logo = s.image
        ? `<span class="dw-logo"><img src="${s.image}" alt="" loading="lazy" decoding="async" width="28" height="28" draggable="false" /></span>`
        : `<span class="dw-logo dw-logo--mono">${s.name}</span>`;
      return `<div class="dw-tile" data-col="${c}" data-group="${s.group}" style="--c: ${s.color}; --lvl: ${parseInt(s.level, 10) / 100}">
          <div class="dw-inner">
            ${logo}<span class="dw-level">${s.level}</span>
            <span class="dw-name">${s.name}</span>
            <span class="dw-cat">${s.category}</span>
            <span class="dw-bar"><i></i></span>
          </div>
        </div>`;
    };

    let cols = [];
    let layoutKey = "";

    // Ne reconstruit le DOM que si le nombre de colonnes / copies change
    const build = () => {
      const w = wall.clientWidth;
      const h = wall.clientHeight;
      if (!w || !h) return;
      const n = Math.min(7, Math.max(3, Math.ceil((w * 1.25) / (TILE_W + 18))));
      const groups = Array.from({ length: n }, () => []);
      skills.forEach((s, i) => groups[i % n].push(s));
      const metas = groups.map((g) => {
        const copyH = Math.max(UNIT, g.length * UNIT);
        return { g, copyH, copies: Math.max(2, Math.ceil((h * 1.6) / copyH) + 1) };
      });
      const key = metas.map((m) => `${m.g.length}x${m.copies}`).join("|");
      if (key === layoutKey) return;
      layoutKey = key;

      plane.innerHTML = metas
        .map(({ g, copies }, c) => {
          const tiles = g.map((s) => tileHTML(s, c)).join("");
          return `<div class="dw-col"><div class="dw-track">${tiles.repeat(copies)}</div></div>`;
        })
        .join("");

      cols = $$(".dw-track", plane).map((track, c) => {
        const pseudo = ((c * 0.6180339887 + 0.35) % 1) * 2 - 1;
        const base = SPEED * (1 + VARIANCE * pseudo) * (c % 2 ? -1 : 1);
        const copyH = metas[c].copyH;
        return { track, copyH, base, vel: base, offset: copyH * ((c * 0.37) % 1) };
      });
      active = null;
      hoveredCol = -1;
      render(0);
    };

    // ---- Boucle d'animation (s'arrête hors écran / onglet caché) ----
    const pointer = { x: 0, y: 0, dx: 0, dy: 0 };
    let hoveredCol = -1;
    let active = null;
    let raf = 0;
    let last = 0;
    let visible = false;
    let planeKey = "";

    const setPlane = () => {
      const key = `${pointer.dx.toFixed(2)},${pointer.dy.toFixed(2)}`;
      if (key === planeKey) return;
      planeKey = key;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) rotateX(${BASE.tilt + pointer.dy}deg) ` +
        `rotateY(${BASE.turn + pointer.dx}deg) translateZ(${-BASE.depth}px)`;
    };

    const render = (dt) => {
      const damp = 1 - Math.exp(-dt / 0.12);
      pointer.dx += (pointer.x * PARALLAX * 8 - pointer.dx) * damp;
      pointer.dy += (-pointer.y * PARALLAX * 8 - pointer.dy) * damp;
      setPlane();
      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        if (dt) {
          const target = hoveredCol === c ? 0 : col.base;
          col.vel += (target - col.vel) * (1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28)));
          col.offset = (((col.offset + col.vel * dt) % col.copyH) + col.copyH) % col.copyH;
        }
        col.track.style.transform = `translate3d(0, ${-col.offset.toFixed(2)}px, 0)`;
      }
    };

    const tick = (ts) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      render(dt);
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !animate || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        start();
      },
      { rootMargin: "100px 0px" },
    ).observe(wall);
    document.addEventListener("visibilitychange", start);

    let resizeRaf = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(build);
    }).observe(wall);
    build();

    // ---- Survol : délégation, pas de hit-test à chaque mouvement ----
    const setActive = (tile) => {
      if (tile === active) return;
      active?.classList.remove("is-active");
      tile?.classList.add("is-active");
      active = tile;
      hoveredCol = tile ? Number(tile.dataset.col) : -1;
    };
    wall.addEventListener("pointerover", (e) => setActive(e.target.closest(".dw-tile")));
    wall.addEventListener("pointerleave", () => {
      setActive(null);
      pointer.x = 0;
      pointer.y = 0;
    });
    if (finePointer && animate) {
      let rect = null;
      wall.addEventListener("pointerenter", () => (rect = wall.getBoundingClientRect()));
      wall.addEventListener("pointermove", (e) => {
        if (!rect) rect = wall.getBoundingClientRect();
        pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
        pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
      });
      window.addEventListener("scroll", () => (rect = null), { passive: true });
    }

    // ---- Filtres : on met en avant une famille sans recalculer le mur ----
    const filters = $$(".filter");
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        filters.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        wall.dataset.filter = f;
        if (count) {
          count.textContent = f === "all" ? skills.length : skills.filter((s) => s.group === f).length;
        }
      });
    });
  }

  // ============================================
  // 11. CERTIFICATIONS : retournement tactile / clavier
  // ============================================
  function initCerts() {
    $$(".cert").forEach((card) => {
      card.addEventListener("keydown", (e) => {
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
      if (!finePointer) {
        card.addEventListener("click", (e) => {
          if (e.target.closest("a")) return;
          $$(".cert.is-flipped").forEach((c) => c !== card && c.classList.remove("is-flipped"));
          card.classList.toggle("is-flipped");
        });
      }
    });
  }

  // ============================================
  // 12. PANNEAU LATÉRAL (projets & stages)
  // ============================================
  const sheet = $("#sheet");
  const sheetPanel = $(".sheet-panel", sheet);
  const sheetTag = $("[data-sheet-tag]", sheet);
  const sheetTitle = $("[data-sheet-title]", sheet);
  const sheetNav = $("[data-sheet-nav]", sheet);
  const sheetContent = $("[data-sheet-content]", sheet);
  const sheetFocus = createModalFocus(sheet);
  sheet.inert = true;

  function openSheet({ tag, title, html, nav, color }) {
    sheetTag.textContent = tag;
    sheetTitle.textContent = title;
    sheetNav.innerHTML = (nav || [])
      .map((n) => `<a href="#stage-${n.id}" data-sheet-link="stage-${n.id}">${n.label}</a>`)
      .join("");
    sheetContent.innerHTML = html;
    sheetContent.scrollTop = 0;
    sheetPanel.style.setProperty("--sheet-c", color || "var(--lime)");

    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    sheet.inert = false;
    scrollLock.stop();
    sheetFocus.open($(".sheet-close", sheet));

    if (animate) {
      gsap.from(sheetContent.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        delay: 0.35,
        ease: "expo.out",
        clearProps: "all",
      });
    }
  }

  function closeSheet() {
    if (!sheet.classList.contains("is-open")) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    sheet.inert = true;
    scrollLock.start();
    sheetFocus.close();
  }

  function initSheet() {
    $$("[data-sheet-close]", sheet).forEach((el) => el.addEventListener("click", closeSheet));

    // Navigation interne du rapport de stage
    const goTo = (id) => {
      const target = sheetContent.querySelector(`#${id}`);
      if (!target) return;
      sheetContent.scrollTo({
        top: target.offsetTop - 16,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };
    sheetNav.addEventListener("click", (e) => {
      const link = e.target.closest("[data-sheet-link]");
      if (!link) return;
      e.preventDefault();
      goTo(link.dataset.sheetLink);
    });

    sheetContent.addEventListener(
      "scroll",
      () => {
        const links = $$("[data-sheet-link]", sheetNav);
        if (!links.length) return;
        let active = links[0].dataset.sheetLink;
        $$(".stage-block", sheetContent).forEach((block) => {
          if (block.offsetTop - sheetContent.scrollTop < 140) active = block.id;
        });
        links.forEach((a) => a.classList.toggle("is-active", a.dataset.sheetLink === active));
      },
      { passive: true },
    );
  }

  // --- Projets
  const PROJECT_COLORS = {
    ap11: "var(--lime)",
    ap12: "var(--sun)",
    ap2: "var(--pink)",
    ap3: "var(--tomato)",
    ap4: "var(--lime)",
  };

  function initProjects() {
    const rows = $$(".p-row");
    rows.forEach((row) => {
      row.addEventListener("click", () => {
        const data = typeof PROJECTS !== "undefined" && PROJECTS[row.dataset.project];
        if (!data) return;
        openSheet({
          tag: data.tag,
          title: data.title,
          html: data.content,
          color: PROJECT_COLORS[row.dataset.project],
        });
      });
    });

    // Aperçu qui suit la souris
    if (!finePointer || !animate) return;
    const list = $(".p-list");
    const preview = $(".p-preview");
    const track = $(".p-preview-track");
    gsap.set(preview, { scale: 0 });
    const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3" });
    const rTo = gsap.quickTo(preview, "rotation", { duration: 0.9, ease: "power3" });
    let lastX = null;
    let settle;

    list.addEventListener("mousemove", (e) => {
      if (lastX === null) gsap.set(preview, { x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-14, 14, (e.clientX - (lastX ?? e.clientX)) * 0.7));
      lastX = e.clientX;
      clearTimeout(settle);
      settle = setTimeout(() => rTo(0), 120);
    });

    rows.forEach((row, i) => {
      row.addEventListener("mouseenter", () => {
        gsap.to(preview, { scale: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
        gsap.to(track, { yPercent: -100 * i, duration: 0.7, ease: "expo.out", overwrite: "auto" });
      });
    });

    list.addEventListener("mouseleave", () => {
      lastX = null;
      gsap.to(preview, { scale: 0, duration: 0.45, ease: "power3.in", overwrite: "auto" });
    });
  }

  // --- Stages
  const STAGE_COLORS = {
    "hygiene-expert": "var(--sun)",
    blackfox: "var(--pink)",
  };

  function renderActivity(a) {
    const tags = (a.tags || []).map((t) => `<span>${t}</span>`).join("");
    const bullets = (a.bullets || []).map((b) => `<li>${b}</li>`).join("");
    return `
      <article class="stage-activity">
        <header class="stage-activity-header">
          <span class="stage-activity-num">${a.num}</span>
          <div>
            <h4 class="stage-activity-title">${a.title}</h4>
            <span class="stage-activity-period">${a.period}</span>
          </div>
        </header>
        ${tags ? `<div class="stage-activity-tags">${tags}</div>` : ""}
        <p>${a.description}</p>
        ${bullets ? `<ul class="stage-activity-bullets">${bullets}</ul>` : ""}
        ${
          a.difficulty
            ? `<div class="stage-activity-difficulty"><h6>${a.difficulty.title}</h6><p>${a.difficulty.text}</p></div>`
            : ""
        }
      </article>`;
  }

  function renderStage(d) {
    let html = `
      <header class="stage-hero">
        <div class="stage-hero-meta"><span>${d.hero.metaLeft}</span><span>${d.hero.metaRight}</span></div>
        <h2 class="stage-hero-title">${d.hero.title}</h2>
        <p class="stage-hero-subtitle">${d.hero.subtitle}</p>
        <div class="stage-overview">
          ${d.overview
            .map((o) => `<div class="stage-overview-item"><span>${o.label}</span><strong>${o.value}</strong></div>`)
            .join("")}
        </div>
      </header>`;
    d.sections.forEach((s) => {
      const body = s.activities
        ? `<div class="stage-activities">${s.activities.map(renderActivity).join("")}</div>`
        : s.html;
      html += `
        <section class="stage-block" id="stage-${s.id}">
          <span class="stage-block-tag">${s.tag}</span>
          <h3 class="stage-block-title">${s.title}</h3>
          ${body}
        </section>`;
    });
    return html;
  }

  function initStages() {
    $$(".stage-card").forEach((card) => {
      card.addEventListener("click", () => {
        const key = card.dataset.stage;
        const data = typeof STAGES !== "undefined" && STAGES[key];
        if (!data) return;
        openSheet({
          tag: `Stage ${data.num} · ${data.hero.metaRight}`,
          title: data.name,
          html: renderStage(data),
          nav: data.nav,
          color: STAGE_COLORS[key],
        });
      });
    });
  }

  // ============================================
  // 13. VISIONNEUSE — tableau de synthèse
  // ============================================
  const viewer = $("#viewer");
  const viewerFocus = createModalFocus(viewer);
  viewer.inert = true;

  function openViewer() {
    const frame = $("#synthFrame");
    if (frame && !frame.getAttribute("src") && frame.dataset.src) {
      frame.setAttribute("src", frame.dataset.src);
    }
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    viewer.inert = false;
    scrollLock.stop();
    viewerFocus.open($(".sheet-close", viewer));
  }

  function closeViewer() {
    if (!viewer.classList.contains("is-open")) return;
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    viewer.inert = true;
    scrollLock.start();
    viewerFocus.close();
  }

  function initViewer() {
    $("#synthOpen")?.addEventListener("click", openViewer);
    $$("[data-viewer-close]", viewer).forEach((el) => el.addEventListener("click", closeViewer));
  }

  // ============================================
  // 13 bis. PALETTE DE COMMANDES (Ctrl/⌘ K, ou « / »)
  // ============================================
  const palette = $("#palette");
  const paletteInput = $(".palette-input", palette);
  const paletteList = $(".palette-list", palette);
  const paletteFocus = createModalFocus(palette);
  palette.inert = true;
  let paletteItems = null;
  let paletteResults = [];
  let paletteActive = 0;

  const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
  const plainText = (html) =>
    String(html || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&[a-z#0-9]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  // Minuscules sans accents, en gardant la longueur (indices alignés pour le surlignage)
  const fold = (s) => [...s].map((c) => c.normalize("NFD")[0]).join("").toLowerCase();

  const MAIL = "brebionthibault2006@gmail.com";
  const openUrl = (url) => window.open(url, "_blank", "noopener");

  // Construit l'index une seule fois, à la première ouverture
  function buildPaletteItems() {
    const items = [];
    const add = (item) =>
      items.push({
        keys: "",
        text: "",
        boost: 0,
        hidden: false,
        ...item,
        nTitle: fold(item.title),
        nSub: fold(item.sub || ""),
        nKeys: fold(item.keys || ""),
        nText: fold(item.text || ""),
      });

    $$(".menu-links a").forEach((a) => {
      const num = a.querySelector("span")?.textContent || "";
      add({
        group: "Sections",
        title: a.getAttribute("aria-label") || a.textContent.replace(num, "").trim(),
        sub: num,
        color: a.style.getPropertyValue("--h"),
        hint: "Aller",
        run: () => scrollToTarget(a.getAttribute("href")),
      });
    });

    if (typeof PROJECTS !== "undefined") {
      Object.entries(PROJECTS).forEach(([key, p]) => {
        add({
          group: "Projets",
          title: plainText(p.title),
          sub: plainText(p.tag).replace(/^\/\s*/, ""),
          text: plainText(p.content),
          color: PROJECT_COLORS[key],
          hint: "Ouvrir",
          boost: 4,
          run: () => $(`.p-row[data-project="${key}"]`)?.click(),
        });
      });
    }

    if (typeof STAGES !== "undefined") {
      Object.entries(STAGES).forEach(([key, s]) => {
        add({
          group: "Stages",
          title: `Stage — ${s.name}`,
          sub: plainText(s.hero.metaRight),
          keys: "stage rapport entreprise",
          text: plainText(JSON.stringify(s)),
          color: STAGE_COLORS[key],
          hint: "Lire",
          boost: 4,
          run: () => $(`.stage-card[data-stage="${key}"]`)?.click(),
        });
      });
    }

    // Compétences : uniquement en recherche, pour garder la liste par défaut courte
    if (typeof SKILLS !== "undefined") {
      SKILLS.forEach((s) => {
        const group = SKILL_GROUPS[s.category] || "tools";
        add({
          group: "Compétences",
          title: s.name,
          sub: `${s.category} · ${s.level}`,
          keys: `${s.desc} competence techno`,
          color: "var(--sun)",
          hint: "Voir",
          hidden: true,
          boost: 2,
          run: () => {
            $(`.filter[data-filter="${group}"]`)?.click();
            scrollToTarget("#skills");
          },
        });
      });
    }

    add({
      group: "Actions",
      title: "Copier mon e-mail",
      sub: MAIL,
      keys: "mail contact adresse",
      color: "var(--tomato)",
      hint: "Copier",
      boost: 3,
      keepOpen: true,
      run: async (el) => {
        try {
          await navigator.clipboard.writeText(MAIL);
          el.querySelector(".palette-hint").textContent = "Copié ✓";
          setTimeout(closePalette, 700);
        } catch {
          location.href = `mailto:${MAIL}`;
        }
      },
    });
    add({
      group: "Actions",
      title: "Écrire un e-mail",
      sub: "Ouvre votre messagerie",
      keys: "mail contact message",
      color: "var(--pink)",
      hint: "↗",
      run: () => (location.href = `mailto:${MAIL}`),
    });
    add({
      group: "Actions",
      title: "Voir le tableau de synthèse",
      sub: "Aperçu en ligne",
      keys: "synthese tableau competences bts",
      color: "var(--lime)",
      hint: "Ouvrir",
      run: openViewer,
    });
    add({
      group: "Actions",
      title: "Télécharger le tableau de synthèse",
      sub: "Fichier .xlsx",
      keys: "synthese tableau excel xlsx",
      color: "var(--lime)",
      hint: "↓",
      run: () => {
        const a = document.createElement("a");
        a.href = "assets/files/Tableau_De_Synthese.xlsx";
        a.download = "";
        a.click();
      },
    });
    add({
      group: "Actions",
      title: "Retour en haut",
      sub: "Accueil",
      keys: "top debut accueil",
      color: "var(--paper)",
      hint: "↑",
      run: () => scrollToTarget("#home"),
    });
    [
      ["GitHub", "https://github.com/tibolecodeur", "code depot repo"],
      ["LinkedIn", "https://www.linkedin.com/in/thibaultbrebion2103/", "reseau profil cv"],
      ["Instagram", "https://www.instagram.com/tibo_brb/", "reseau"],
    ].forEach(([title, url, keys]) =>
      add({
        group: "Liens",
        title,
        sub: url.replace(/^https:\/\/(www\.)?/, ""),
        keys,
        color: "var(--blue)",
        hint: "↗",
        run: () => openUrl(url),
      }),
    );
    return items;
  }

  // Score simple : début de titre > mot du titre > titre > mots-clés > contenu > lettres dans l'ordre
  function scoreItem(item, tokens) {
    let total = 0;
    let where = "title";
    for (const t of tokens) {
      let s;
      if (item.nTitle.startsWith(t)) s = 100;
      else if (item.nTitle.includes(` ${t}`)) s = 80;
      else if (item.nTitle.includes(t)) s = 60;
      else if (item.nKeys.includes(t) || item.nSub.includes(t)) s = 30;
      else if (item.nText.includes(t)) {
        s = 12;
        where = "text";
      } else {
        let i = 0;
        for (const c of item.nTitle) if (c === t[i]) i++;
        if (i < t.length) return null;
        s = 4;
      }
      total += s;
    }
    return { score: total + item.boost, where };
  }

  // Extrait du contenu autour du mot trouvé
  function excerpt(item, token) {
    const i = item.nText.indexOf(token);
    if (i < 0) return item.sub;
    const start = Math.max(0, i - 28);
    return `${start ? "…" : ""}${item.text.slice(start, i + token.length + 34)}…`;
  }

  function highlight(text, token) {
    const i = token ? fold(text).indexOf(token) : -1;
    if (i < 0) return escapeHtml(text);
    return (
      escapeHtml(text.slice(0, i)) +
      `<mark>${escapeHtml(text.slice(i, i + token.length))}</mark>` +
      escapeHtml(text.slice(i + token.length))
    );
  }

  function optionHtml(it, i, sub, token, badge) {
    return `<div class="palette-item" role="option" id="pal-${i}" data-i="${i}" aria-selected="false" style="--dot: ${it.color || "var(--lime)"}">
        <span class="palette-dot" aria-hidden="true"></span>
        <span class="palette-text">
          <span class="palette-title">${highlight(it.title, token)}</span>
          <span class="palette-sub">${highlight(sub || "", token)}</span>
        </span>
        ${badge ? `<span class="palette-badge">${badge}</span>` : ""}
        <span class="palette-hint">${it.hint || ""}</span>
      </div>`;
  }

  function renderPalette() {
    const raw = paletteInput.value.trim();
    const tokens = fold(raw).split(/\s+/).filter(Boolean);
    let html = "";

    if (!tokens.length) {
      paletteResults = paletteItems.filter((it) => !it.hidden);
      let group = "";
      paletteResults.forEach((it, i) => {
        if (it.group !== group) {
          group = it.group;
          html += `<div class="palette-group" role="presentation">${group}</div>`;
        }
        html += optionHtml(it, i, it.sub, "");
      });
    } else {
      paletteResults = paletteItems
        .map((it) => ({ it, r: scoreItem(it, tokens) }))
        .filter((x) => x.r)
        .sort((a, b) => b.r.score - a.r.score)
        .slice(0, 12)
        .map(({ it, r }) => ({ ...it, where: r.where }));
      if (paletteResults.length) {
        const n = paletteResults.length;
        html += `<div class="palette-group" role="presentation">${n} résultat${n > 1 ? "s" : ""}</div>`;
        paletteResults.forEach((it, i) => {
          const sub = it.where === "text" ? excerpt(it, tokens[0]) : it.sub;
          html += optionHtml(it, i, sub, tokens[0], it.group);
        });
      } else {
        html = `<div class="palette-empty">
            <p>Rien pour « ${escapeHtml(raw)} ».</p>
            <span>Une question ? <a href="mailto:${MAIL}">Écrivez-moi</a>, je réponds vite.</span>
          </div>`;
      }
    }

    paletteList.innerHTML = html;
    setPaletteActive(0);
  }

  function setPaletteActive(i) {
    const options = $$(".palette-item", paletteList);
    if (!options.length) {
      paletteInput.removeAttribute("aria-activedescendant");
      return;
    }
    paletteActive = (i + options.length) % options.length;
    options.forEach((el, k) => {
      const on = k === paletteActive;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-selected", String(on));
      if (on) {
        paletteInput.setAttribute("aria-activedescendant", el.id);
        el.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function runPaletteItem(i) {
    const item = paletteResults[i];
    const el = $(`#pal-${i}`, paletteList);
    if (!item || !el) return;
    if (item.keepOpen) {
      item.run(el);
      return;
    }
    closePalette(true);
    // Laisse la palette se fermer avant d'ouvrir un panneau ou de défiler
    setTimeout(() => item.run(el), 120);
  }

  function openPalette() {
    if (palette.classList.contains("is-open")) return;
    if (!paletteItems) paletteItems = buildPaletteItems();
    if (menuOpen) setMenu(false);
    closeViewer();
    closeSheet();
    paletteInput.value = "";
    renderPalette();
    palette.classList.add("is-open");
    palette.setAttribute("aria-hidden", "false");
    palette.inert = false;
    scrollLock.stop();
    paletteFocus.open(paletteInput);
  }

  function closePalette(skipFocus) {
    if (!palette.classList.contains("is-open")) return;
    palette.classList.remove("is-open");
    palette.setAttribute("aria-hidden", "true");
    palette.inert = true;
    scrollLock.start();
    if (skipFocus === true) document.activeElement?.blur();
    else paletteFocus.close();
  }

  function initPalette() {
    const kbds = $$("[data-palette-kbd]");
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) kbds.forEach((k) => (k.textContent = "⌘ K"));

    $$("[data-palette-open]").forEach((btn) => btn.addEventListener("click", openPalette));
    $$("[data-palette-close]", palette).forEach((el) => el.addEventListener("click", () => closePalette()));

    paletteInput.addEventListener("input", renderPalette);
    paletteInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setPaletteActive(paletteActive + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPaletteActive(paletteActive - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        runPaletteItem(paletteActive);
      }
    });
    paletteList.addEventListener("pointermove", (e) => {
      const opt = e.target.closest(".palette-item");
      if (opt && Number(opt.dataset.i) !== paletteActive) setPaletteActive(Number(opt.dataset.i));
    });
    paletteList.addEventListener("click", (e) => {
      const opt = e.target.closest(".palette-item");
      if (opt) runPaletteItem(Number(opt.dataset.i));
    });

    document.addEventListener("keydown", (e) => {
      const typing = e.target.closest?.("input, textarea, select, [contenteditable]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (palette.classList.contains("is-open")) closePalette();
        else openPalette();
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openPalette();
      }
    });
  }

  // Échap ferme ce qui est ouvert, du plus haut au plus bas
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (palette.classList.contains("is-open")) closePalette();
    else if (viewer.classList.contains("is-open")) closeViewer();
    else if (sheet.classList.contains("is-open")) closeSheet();
    else if (menuOpen) {
      setMenu(false);
      menuBtn.focus({ preventScroll: true });
    }
  });

  // ============================================
  // 14. VEILLE : phrases révélées mot à mot
  // ============================================
  function splitWords(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.replaceWith(frag);
    });
    return $$(".w", root);
  }

  function initStatements() {
    if (!animate || typeof ScrollTrigger === "undefined") return;
    $$("[data-words]").forEach((el) => {
      const words = splitWords(el);
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true },
      });
    });
  }

  // ============================================
  // 15. RÉVÉLATIONS GÉNÉRIQUES AU SCROLL
  // ============================================
  function reveal(targets, from = {}) {
    const els = typeof targets === "string" ? $$(targets) : targets;
    if (!els.length) return;
    gsap.set(els, { y: 70, opacity: 0, ...from });
    ScrollTrigger.batch(els, {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.1,
          stagger: 0.09,
          ease: "expo.out",
          overwrite: true,
        }),
    });
  }

  function initReveals() {
    if (!animate || typeof ScrollTrigger === "undefined") return;
    reveal(".section-head > *, .skills-filters");
    reveal(".cert", { rotate: 4 });
    reveal(".p-list li");
    reveal(".stage-card", { rotate: 3 });
    reveal(".source", { rotate: -3 });
    reveal(".risks-list li, .watch-outro > div");
    reveal(".synth-card, .contact-grid > *, .contact-head .label");

    // Titre « Let's talk » : lignes qui montent
    gsap.set(".contact-title .line-inner", { yPercent: 110 });
    ScrollTrigger.create({
      trigger: ".contact-title",
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(".contact-title .line-inner", {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: "expo.out",
        }),
    });

    // Parcours sur mobile : révélation simple des cartes
    gsap.matchMedia().add("(max-width: 899px)", () => {
      reveal(".j-card", { rotate: 3 });
    });

    // Bandes de la veille : légère dérive au scroll
    gsap.to(".band--lime", {
      xPercent: -6,
      scrollTrigger: { trigger: ".watch-bands", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".band--pink", {
      xPercent: 6,
      scrollTrigger: { trigger: ".watch-bands", start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  // ============================================
  // 16. CONTACT : formulaire + copie de l'e-mail
  // ============================================
  function initContact() {
    const form = $("#contactForm");
    const status = $("#contactStatus");
    const setStatus = (text, isError) => {
      status.textContent = text;
      status.classList.toggle("is-error", Boolean(isError));
    };

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#contactName").value.trim();
      const emailInput = $("#contactEmail");
      const email = emailInput.value.trim();
      const message = $("#contactMessage").value.trim();

      if (!name || !email || !message) {
        setStatus("Merci de remplir tous les champs.", true);
        return;
      }
      if (!emailInput.checkValidity()) {
        setStatus("Merci d'indiquer une adresse e-mail valide.", true);
        return;
      }
      setStatus(
        "Ouverture de votre messagerie… Si rien ne s'ouvre, écrivez-moi à brebionthibault2006@gmail.com.",
        false,
      );
      const subject = encodeURIComponent(`[Portfolio] Message de ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:brebionthibault2006@gmail.com?subject=${subject}&body=${body}`;
    });

    $$("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          btn.textContent = "Copié !";
        } catch {
          btn.textContent = "Sélectionnez l'adresse";
        }
        btn.classList.add("is-done");
        setTimeout(() => {
          btn.textContent = "Copier";
          btn.classList.remove("is-done");
        }, 2000);
      });
    });
  }

  // ============================================
  // 17. DÉMARRAGE
  // ============================================
  initHeader();
  initMenu();
  initMenuFx();
  initThemes();
  initCursor();
  initMagnetic();
  // Ordre = ordre de la page, pour que ScrollTrigger tienne compte du pin du parcours
  initHero();
  initJourney();
  initSkills();
  initCerts();
  initSheet();
  initProjects();
  initStages();
  initViewer();
  initPalette();
  initContact();
  initStatements();
  initReveals();

  runLoader().then(() => {
    if (lenis) lenis.start();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });

  if (document.fonts && typeof ScrollTrigger !== "undefined") {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
});
