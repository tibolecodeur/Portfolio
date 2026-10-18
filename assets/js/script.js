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
    gsap.set(".hero-meta > *, .hero-bottom > *", { y: 40, opacity: 0 });
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
        ".hero-meta > *",
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "expo.out" },
        0.15,
      )
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
  // 4. HEADER : horloge + masquage au scroll
  // ============================================
  function initHeader() {
    const header = $(".header");
    const clockEls = $$("[data-clock]");
    const footerClock = $("[data-clock-footer]");
    const fmt = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Paris",
    });
    const tick = () => {
      const t = fmt.format(new Date());
      clockEls.forEach((el) => (el.textContent = t));
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
      gsap.to(".hero-stickers", { y: -140, scrollTrigger: { ...st } });
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
    const grid = $("[data-skills-grid]");
    if (!grid || typeof SKILLS === "undefined") return;

    const GROUPS = {
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
    const COLORS = ["var(--tomato)", "var(--blue)", "var(--lime)", "var(--pink)", "var(--sun)"];

    grid.innerHTML = SKILLS.map((s, i) => {
      const level = parseInt(s.level, 10) / 100;
      const logo = s.image
        ? `<span class="skill-logo"><img src="${s.image}" alt="" loading="lazy" decoding="async" width="34" height="34" /></span>`
        : `<span class="skill-logo skill-logo--mono" aria-hidden="true">${s.name}</span>`;
      return `
        <li data-group="${GROUPS[s.category] || "tools"}">
          <article class="skill" style="--c: ${COLORS[i % COLORS.length]}; --lvl: ${level}; --tilt: ${i % 2 ? 1.5 : -1.5}deg">
            <div class="skill-top">${logo}<span class="skill-cat">${s.category}</span></div>
            <h3 class="skill-name">${s.name}</h3>
            <p class="skill-desc">${s.desc}</p>
            <div class="skill-meter" aria-label="Niveau ${s.level}">
              <span class="skill-bar"><i></i></span>
              <span class="skill-level">${s.level}</span>
            </div>
          </article>
        </li>`;
    }).join("");

    const items = $$("li", grid);
    const count = $("[data-skills-count]");
    if (count) count.textContent = items.length;

    // Entrée : cartes + jauges
    if (animate) {
      gsap.set(items, { y: 70, opacity: 0, rotate: () => gsap.utils.random(-6, 6) });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.9,
            stagger: 0.05,
            ease: "back.out(1.4)",
          }),
      });
      $$(".skill-bar i", grid).forEach((barEl) => {
        gsap.from(barEl, {
          scaleX: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: barEl, start: "top 92%", once: true },
        });
      });
    }

    // Filtres
    const filters = $$(".filter");
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        filters.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });
        const visible = [];
        items.forEach((li) => {
          const show = f === "all" || li.dataset.group === f;
          li.classList.toggle("is-hidden", !show);
          if (show) visible.push(li);
        });
        if (count) count.textContent = visible.length;
        if (animate) {
          gsap.fromTo(
            visible,
            { scale: 0.85, opacity: 0, rotate: () => gsap.utils.random(-5, 5) },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              y: 0,
              duration: 0.6,
              stagger: 0.03,
              ease: "back.out(1.6)",
              overwrite: true,
            },
          );
          ScrollTrigger.refresh();
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

  // Échap ferme ce qui est ouvert, du plus haut au plus bas
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (viewer.classList.contains("is-open")) closeViewer();
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
