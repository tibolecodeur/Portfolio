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
      initJourneySection();
      initCircularGallery();
    },
  });

  // ============================================
  // 5. HOME ANIMATIONS — révélation smooth après le loader
  // ============================================
  function initHomeAnimations() {
    // Préparer les stickers : composer rotation (depuis --rot CSS) + scale + opacity initiale
    // Préparer les stickers : on lit la rotation cible depuis --rot,
    // on les met scale 0.4 + opacity 0 pour l'animation d'entrée
    document.querySelectorAll(".sticker").forEach((el) => {
      const rotStr = getComputedStyle(el).getPropertyValue("--rot").trim();
      const rot = parseFloat(rotStr) || 0;
      // Stocker la rotation cible pour la réutiliser à la fin
      el.dataset.targetRot = rot;
      gsap.set(el, {
        rotation: rot,
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

  // ============================================
  // 6. JOURNEY SECTION — Année dynamique + reveal cards
  // ============================================
  function initJourneySection() {
    const cards = document.querySelectorAll(".journey-card");
    const yearDisplay = document.querySelector("[data-year-display]");
    const progressBar = document.querySelector("[data-progress-bar]");
    const counterCurrent = document.querySelector("[data-counter-current]");
    const counterTotal = document.querySelector("[data-counter-total]");
    if (!cards.length || !yearDisplay) return;

    // Total
    if (counterTotal) {
      counterTotal.textContent = String(cards.length).padStart(2, "0");
    }

    // 1. Reveal des cartes au scroll (IntersectionObserver, robuste)
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    cards.forEach((card) => revealObserver.observe(card));

    // 2. Suivre la carte "active" (la plus proche du centre du viewport)
    let currentActiveIndex = -1;

    function updateActiveCard() {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== currentActiveIndex) {
        currentActiveIndex = closestIndex;
        const activeCard = cards[closestIndex];
        const newYear = activeCard.dataset.year || "";

        // Animation année : fade out → change texte → fade in
        yearDisplay.classList.add("is-changing");
        setTimeout(() => {
          yearDisplay.textContent = newYear;
          yearDisplay.classList.remove("is-changing");
        }, 200);

        // Compteur
        if (counterCurrent) {
          counterCurrent.textContent = String(closestIndex + 1).padStart(
            2,
            "0",
          );
        }
      }

      // Progression : position de la section dans le viewport
      const section = document.querySelector(".journey-section");
      if (section && progressBar) {
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowH = window.innerHeight;

        // Progression : 0 quand le top arrive en bas du viewport,
        // 1 quand le bottom remonte en haut du viewport
        const totalScroll = sectionHeight + windowH;
        const scrolled = windowH - sectionTop;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        progressBar.style.width = `${progress * 100}%`;
      }
    }

    // Plug sur Lenis pour avoir le scroll smooth
    if (typeof lenis !== "undefined") {
      lenis.on("scroll", updateActiveCard);
    } else {
      window.addEventListener("scroll", updateActiveCard, { passive: true });
    }
    window.addEventListener("resize", updateActiveCard);

    // Premier appel pour initialiser
    updateActiveCard();
  }

  // ============================================
  // 7. CIRCULAR GALLERY — Compétences (copié-collé)
  // ============================================
  function initCircularGallery() {
    if (typeof gsap === "undefined") return;
    // Enregistrer SplitText si présent
    if (typeof SplitText !== "undefined") {
      gsap.registerPlugin(SplitText);
    }

    const gallery = document.querySelector(".cg-gallery");
    const galleryContainer = document.querySelector(".cg-gallery-container");
    const titleContainer = document.querySelector(".cg-title-container");
    if (!gallery || !galleryContainer || !titleContainer) return;

    // ─── DATA : tes compétences avec catégorie + niveau
    const collection = [
      // Langages
      {
        name: "PHP",
        level: "80%",
        category: "Langage",
        desc: "Langage de prédilection backend",
        image: "",
      },
      {
        name: "JavaScript",
        level: "75%",
        category: "Langage",
        desc: "Front + animations",
        image: "",
      },
      {
        name: "Python",
        level: "90%",
        category: "Langage",
        desc: "Scripting & automatisation",
        image: "",
      },
      {
        name: "C++",
        level: "70%",
        category: "Langage",
        desc: "Programmation système",
        image: "",
      },
      {
        name: "Java",
        level: "65%",
        category: "Langage",
        desc: "Android & POO",
        image: "",
      },
      {
        name: "HTML/CSS",
        level: "90%",
        category: "Langage",
        desc: "Mise en forme web",
        image: "",
      },
      {
        name: "SQL",
        level: "65%",
        category: "Langage",
        desc: "Bases de données",
        image: "",
      },
      // Frameworks
      {
        name: "Symfony",
        level: "70%",
        category: "Framework",
        desc: "API REST & MVC",
        image: "",
      },
      {
        name: "Laravel",
        level: "80%",
        category: "Framework",
        desc: "Framework PHP moderne",
        image: "",
      },
      {
        name: "Bootstrap",
        level: "75%",
        category: "Framework",
        desc: "UI responsive rapide",
        image: "",
      },
      // Outils
      {
        name: "Git",
        level: "85%",
        category: "Outil",
        desc: "Versioning de code",
        image: "",
      },
      {
        name: "MySQL",
        level: "75%",
        category: "Base",
        desc: "SGBD relationnel",
        image: "",
      },
      {
        name: "Linux",
        level: "70%",
        category: "OS",
        desc: "Environnement serveur",
        image: "",
      },
      {
        name: "VS Code",
        level: "95%",
        category: "IDE",
        desc: "Éditeur principal",
        image: "g",
      },
      {
        name: "Figma",
        level: "70%",
        category: "Design",
        desc: "UI/UX & prototypage",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Apache",
        level: "65%",
        category: "Serveur",
        desc: "Serveur HTTP",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
      },
      {
        name: "Agile",
        level: "75%",
        category: "Méthode",
        desc: "Scrum & Kanban",
        image: "https://via.placeholder.com/70x90/ffffff/000000?text=Agile",
      },
      {
        name: "UML",
        level: "70%",
        category: "Modélisation",
        desc: "Diagrammes & analyse",
        image: "https://via.placeholder.com/70x90/ffffff/000000?text=UML",
      },
      // Doublons pour remplir 25 (l'original utilise 25 cartes pour 20 items via modulo)
      {
        name: "Android",
        level: "75%",
        category: "Mobile",
        desc: "Développement natif",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
      },
      {
        name: "REST",
        level: "80%",
        category: "Architecture",
        desc: "API design",
        image: "https://via.placeholder.com/70x90/ffffff/000000?text=REST",
      },
    ];

    const cards = [];
    const transformState = [];

    let currentTitle = null;
    let isPreviewActive = false;
    let isTransitioning = false;

    const config = {
      imageCount: 25,
      radius: 275,
      sensitivity: 500,
      effectFalloff: 250,
      cardMoveAmount: 50,
      lerpFactor: 0.15,
      isMobile: window.innerWidth < 1000,
    };

    const parallaxState = {
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      currentX: 0,
      currentY: 0,
      currentZ: 0,
    };

    for (let i = 0; i < config.imageCount; i++) {
      const angle = (i / config.imageCount) * Math.PI * 2;
      const x = config.radius * Math.cos(angle);
      const y = config.radius * Math.sin(angle);
      const cardIndex = i % collection.length;
      const skill = collection[cardIndex];

      const card = document.createElement("div");
      // Alterner light/dark pour rythmer visuellement
      card.className = i % 3 === 0 ? "cg-card cg-card--dark" : "cg-card";
      card.dataset.index = i;
      card.dataset.name = skill.name;
      card.dataset.level = skill.level;
      card.dataset.category = skill.category;
      card.dataset.desc = skill.desc;

      // Au lieu de texte, on met une image du logo
      const imgEl = document.createElement("img");
      imgEl.src = skill.image;
      imgEl.alt = skill.name;
      imgEl.style.width = "100%";
      imgEl.style.height = "100%";
      imgEl.style.objectFit = "contain";
      card.appendChild(imgEl);

      gsap.set(card, {
        x,
        y,
        rotation: (angle * 180) / Math.PI + 90,
        transformPerspective: 1200,
        transformOrigin: "center center",
      });

      gallery.appendChild(card);
      cards.push(card);
      transformState.push({
        currentRotation: 0,
        targetRotation: 0,
        currentX: 0,
        targetX: 0,
        currentY: 0,
        targetY: 0,
        currentScale: 1,
        targetScale: 1,
        angle,
      });

      card.addEventListener("click", (e) => {
        if (!isPreviewActive && !isTransitioning) {
          togglePreview(parseInt(card.dataset.index));
          e.stopPropagation();
        }
      });
    }

    function togglePreview(index) {
      isPreviewActive = true;
      isTransitioning = true;

      const angle = transformState[index].angle;
      const targetPosition = (Math.PI * 3) / 2;
      let rotationRadians = targetPosition - angle;

      if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
      else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

      transformState.forEach((state) => {
        state.currentRotation = state.targetRotation = 0;
        state.currentScale = state.targetScale = 1;
        state.currentX = state.targetX = state.currentY = state.targetY = 0;
      });

      gsap.to(gallery, {
        onStart: () => {
          cards.forEach((card, i) => {
            gsap.to(card, {
              x: config.radius * Math.cos(transformState[i].angle),
              y: config.radius * Math.sin(transformState[i].angle),
              rotationY: 0,
              scale: 1,
              duration: 1.25,
              ease: "power4.out",
            });
          });
        },
        scale: 5,
        y: 1300,
        rotation: (rotationRadians * 180) / Math.PI + 360,
        duration: 2,
        ease: "power4.inOut",
        onComplete: () => (isTransitioning = false),
      });

      gsap.to(parallaxState, {
        currentX: 0,
        currentY: 0,
        currentZ: 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          gsap.set(galleryContainer, {
            rotateX: parallaxState.currentX,
            rotateY: parallaxState.currentY,
            rotation: parallaxState.currentZ,
            transformOrigin: "center center",
          });
        },
      });

      // Affichage du titre + sous-titre (catégorie • niveau)
      const card = cards[index];
      const skillName = card.dataset.name;
      const skillCat = card.dataset.category;
      const skillLevel = card.dataset.level;
      const skillDesc = card.dataset.desc;

      const titleEl = document.createElement("p");
      titleEl.className = "cg-detail";
      titleEl.textContent = skillName;
      titleContainer.appendChild(titleEl);

      const subEl = document.createElement("p");
      subEl.className = "cg-detail-sub";
      subEl.textContent = `${skillCat} • ${skillLevel} • ${skillDesc}`;
      titleContainer.appendChild(subEl);

      currentTitle = { title: titleEl, sub: subEl };

      // Animation des mots avec SplitText si dispo, sinon fallback simple
      if (typeof SplitText !== "undefined") {
        const splitText = new SplitText(titleEl, {
          type: "words",
          wordsClass: "cg-word",
        });
        const words = splitText.words;

        gsap.set(words, { y: "125%" });
        gsap.to(words, {
          y: "0%",
          duration: 0.75,
          delay: 1.25,
          stagger: 0.1,
          ease: "power4.out",
        });

        gsap.set(subEl, { y: "125%", opacity: 0 });
        gsap.to(subEl, {
          y: "0%",
          opacity: 1,
          duration: 0.75,
          delay: 1.5,
          ease: "power4.out",
        });
      } else {
        // Fallback sans SplitText
        gsap.set([titleEl, subEl], { y: "125%", opacity: 0 });
        gsap.to([titleEl, subEl], {
          y: "0%",
          opacity: 1,
          duration: 0.75,
          delay: 1.25,
          stagger: 0.1,
          ease: "power4.out",
        });
      }
    }

    function resetGallery() {
      if (isTransitioning) return;
      isTransitioning = true;

      if (currentTitle) {
        const titleNodes = [currentTitle.title, currentTitle.sub];
        const allTargets = [];
        titleNodes.forEach((node) => {
          if (!node) return;
          const words = node.querySelectorAll(".cg-word");
          if (words.length) allTargets.push(...words);
          else allTargets.push(node);
        });

        gsap.to(allTargets, {
          y: "-125%",
          duration: 0.75,
          delay: 0.5,
          stagger: 0.1,
          ease: "power4.out",
          onComplete: () => {
            titleNodes.forEach((n) => n && n.remove());
            currentTitle = null;
          },
        });
      }

      const viewportWidth = window.innerWidth;
      let galleryScale = 1;
      if (viewportWidth < 768) galleryScale = 0.6;
      else if (viewportWidth < 1200) galleryScale = 0.85;

      gsap.to(gallery, {
        scale: galleryScale,
        y: 0,
        x: 0,
        rotation: 0,
        duration: 2.5,
        ease: "power4.inOut",
        onComplete: () => {
          isPreviewActive = isTransitioning = false;
          Object.assign(parallaxState, {
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            currentX: 0,
            currentY: 0,
            currentZ: 0,
          });
        },
      });
    }

    function handleResize() {
      const viewportWidth = window.innerWidth;
      config.isMobile = viewportWidth < 1000;

      let galleryScale = 1;
      if (viewportWidth < 768) galleryScale = 0.6;
      else if (viewportWidth < 1200) galleryScale = 0.85;

      gsap.set(gallery, { scale: galleryScale });

      if (!isPreviewActive) {
        parallaxState.targetX = 0;
        parallaxState.targetY = 0;
        parallaxState.targetZ = 0;
        parallaxState.currentX = 0;
        parallaxState.currentY = 0;
        parallaxState.currentZ = 0;

        transformState.forEach((state) => {
          state.targetRotation = 0;
          state.currentRotation = 0;
          state.targetScale = 1;
          state.currentScale = 1;
          state.targetX = 0;
          state.currentX = 0;
          state.targetY = 0;
          state.currentY = 0;
        });
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // Click n'importe où → reset (mais uniquement dans la section)
    const skillsSection = document.querySelector(".skills-circular");
    skillsSection.addEventListener("click", () => {
      if (isPreviewActive && !isTransitioning) resetGallery();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isPreviewActive && !isTransitioning)
        resetGallery();
    });

    // Parallax + flip cards au survol — uniquement quand la souris est dans la section
    skillsSection.addEventListener("mousemove", (e) => {
      if (isPreviewActive || isTransitioning || config.isMobile) return;

      const rect = skillsSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      parallaxState.targetY = percentX * 15;
      parallaxState.targetX = -percentY * 15;
      parallaxState.targetZ = (percentX + percentY) * 5;

      cards.forEach((card, index) => {
        const rectCard = card.getBoundingClientRect();
        const dx = e.clientX - (rectCard.left + rectCard.width / 2);
        const dy = e.clientY - (rectCard.top + rectCard.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.sensitivity && !config.isMobile) {
          const flipFactor = Math.max(0, 1 - distance / config.effectFalloff);
          const angle = transformState[index].angle;
          const moveAmount = config.cardMoveAmount * flipFactor;

          transformState[index].targetRotation = 180 * flipFactor;
          transformState[index].targetScale = 1 + 0.3 * flipFactor;
          transformState[index].targetX = moveAmount * Math.cos(angle);
          transformState[index].targetY = moveAmount * Math.sin(angle);
        } else {
          transformState[index].targetRotation = 0;
          transformState[index].targetScale = 1;
          transformState[index].targetX = 0;
          transformState[index].targetY = 0;
        }
      });
    });

    skillsSection.addEventListener("mouseleave", () => {
      if (!isPreviewActive && !isTransitioning) {
        transformState.forEach((state) => {
          state.targetRotation = 0;
          state.targetScale = 1;
          state.targetX = 0;
          state.targetY = 0;
        });
        parallaxState.targetX = 0;
        parallaxState.targetY = 0;
        parallaxState.targetZ = 0;
      }
    });

    function animate() {
      if (!isPreviewActive && !isTransitioning) {
        parallaxState.currentX +=
          (parallaxState.targetX - parallaxState.currentX) * config.lerpFactor;
        parallaxState.currentY +=
          (parallaxState.targetY - parallaxState.currentY) * config.lerpFactor;
        parallaxState.currentZ +=
          (parallaxState.targetZ - parallaxState.currentZ) * config.lerpFactor;

        gsap.set(galleryContainer, {
          rotateX: parallaxState.currentX,
          rotateY: parallaxState.currentY,
          rotation: parallaxState.currentZ,
          transformOrigin: "center center",
        });

        cards.forEach((card, index) => {
          const state = transformState[index];

          state.currentRotation +=
            (state.targetRotation - state.currentRotation) * config.lerpFactor;
          state.currentScale +=
            (state.targetScale - state.currentScale) * config.lerpFactor;
          state.currentX +=
            (state.targetX - state.currentX) * config.lerpFactor;
          state.currentY +=
            (state.targetY - state.currentY) * config.lerpFactor;

          const angle = state.angle;
          const x = config.radius * Math.cos(angle);
          const y = config.radius * Math.sin(angle);

          gsap.set(card, {
            x: x + state.currentX,
            y: y + state.currentY,
            rotationY: state.currentRotation,
            scale: state.currentScale,
            rotation: (angle * 180) / Math.PI + 90,
            transformOrigin: "center center",
            transformPerspective: 1200,
          });
        });
      }
      requestAnimationFrame(animate);
    }

    animate();
  }
});
