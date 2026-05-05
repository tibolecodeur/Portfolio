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
  // 4. LOADING SCREEN (Insane Preloader)
  // ============================================
  const homeContent = document.getElementById("home-content");

  // Génération dynamique des chiffres counter-3
  const counter3 = document.querySelector(".counter-3");
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 10; j++) {
      const div = document.createElement("div");
      div.className = "num";
      div.textContent = j;
      counter3.appendChild(div);
    }
  }
  const finalDiv = document.createElement("div");
  finalDiv.className = "num";
  finalDiv.textContent = "0";
  counter3.appendChild(finalDiv);

  function animateCounter(counter, duration, delay = 0) {
    const numHeight = counter.querySelector(".num").clientHeight;
    const totalDistance =
      (counter.querySelectorAll(".num").length - 1) * numHeight;
    gsap.to(counter, {
      y: -totalDistance,
      duration: duration,
      delay: delay,
      ease: "power2.inOut",
    });
  }

  animateCounter(counter3, 5);
  animateCounter(document.querySelector(".counter-2"), 6);
  animateCounter(document.querySelector(".counter-1"), 2, 4);

  // Sortie des chiffres
  gsap.to(".digit", {
    top: "-150px",
    stagger: { amount: 0.25 },
    delay: 6,
    duration: 1,
    ease: "power4.inOut",
  });

  // Animation des barres
  gsap.from(".loader-1", { width: 0, duration: 6, ease: "power2.inOut" });
  gsap.from(".loader-2", {
    width: 0,
    delay: 1.9,
    duration: 2,
    ease: "power2.inOut",
  });

  // Explosion des barres
  gsap.to(".loader", { background: "none", delay: 6, duration: 0.1 });
  gsap.to(".loader-1", { rotate: 90, y: -50, duration: 0.5, delay: 6 });
  gsap.to(".loader-2", { x: -75, y: 75, duration: 0.5 }, "<");

  // Scale explosion → transition de couleur
  gsap.to(".loader", {
    scale: 40,
    duration: 1,
    delay: 7,
    ease: "power2.inOut",
  });
  gsap.to(".loader", {
    rotate: 45,
    y: 500,
    x: 2000,
    duration: 1,
    delay: 7,
    ease: "power2.inOut",
  });

  // Fade out du loading screen
  gsap.to(".loading-screen", {
    opacity: 0,
    duration: 0.5,
    delay: 7.5,
    ease: "power1.inOut",
    onComplete: () => {
      document.querySelector(".loading-screen").remove();
      homeContent.classList.add("content-visible");
      document.body.classList.remove("no-scroll");
      initHomeAnimations();
    },
  });

  // ============================================
  // 5. HOME ANIMATIONS — révélation smooth après le loader
  // ============================================
  function initHomeAnimations() {
    // Préparer les stickers : composer rotation (depuis --rot CSS) + scale + opacity initiale
    document.querySelectorAll(".sticker").forEach((el) => {
      const rot =
        getComputedStyle(el).getPropertyValue("--rot").trim() || "0deg";
      gsap.set(el, {
        rotation: parseFloat(rot),
        scale: 0.4,
        opacity: 0,
      });
    });

    // Timeline de révélation
    const reveal = gsap.timeline();

    reveal
      // 1. Le conteneur entier : translate + scale + deblur
      .to(homeContent, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "expo.out",
      })

      // 2. Les mots du nom slident depuis le bas (effet masque)
      .to(
        ".name-word",
        {
          y: "0%",
          duration: 1.3,
          stagger: 0.12,
          ease: "expo.out",
        },
        "-=1.0",
      )

      // 3. Paragraphes + CTA
      .to(
        ".hero-info",
        {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        },
        "-=0.7",
      )

      // 4. Grille
      .to(
        ".hero-grid",
        {
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
        },
        "-=0.9",
      )

      // 5. Stickers : pop avec rotation conservée
      .to(
        ".sticker",
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(2)",
        },
        "-=1.0",
      )

      // 6. Démarrer la flottaison continue après l'intro
      .add(() => {
        document.querySelectorAll(".sticker").forEach((el, i) => {
          gsap.to(el, {
            y: "+=10",
            duration: 2.4 + (i % 3) * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      });
  }
});
