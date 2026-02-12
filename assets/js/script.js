document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // 1. CUSTOM CURSOR
    // ============================================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    // Déplacement de base avec optimisation - throttle le mousemove
    let lastMouseMove = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMove > 16) { // ~60fps throttling
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.set(cursor, { x: mouseX, y: mouseY });
            lastMouseMove = now;
        }
    }, { passive: true });
    
    // Animation fluide du follower avec requestAnimationFrame
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15; // Easing
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(follower, { x: followerX, y: followerY });
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Effet hover sur les liens et boutons
    const hoverables = document.querySelectorAll('a, button');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    // ============================================
    // 1.5 BUBBLE MENU
    // ============================================
    const MENU_BG           = '#0a0a0a';
    const MENU_CONTENT_COLOR = '#ffffff';
    const ANIMATION_EASE    = 'back.out(1.5)';
    const ANIMATION_DURATION = 0.5;
    const STAGGER_DELAY     = 0.12;

    const menuItems = [
      { label: 'home',     href: '#', ariaLabel: 'Home',     rotation: -8, hoverStyles: { bgColor: '#ed6a5a', textColor: '#ffffff' } },
      { label: 'about',    href: '#', ariaLabel: 'About',    rotation:  8, hoverStyles: { bgColor: '#f4f1bb', textColor: '#111111' } },
      { label: 'projects', href: '#', ariaLabel: 'Projects', rotation:  8, hoverStyles: { bgColor: '#9bc1bc', textColor: '#111111' } },
      { label: 'contact',  href: '#', ariaLabel: 'Contact',  rotation: -8, hoverStyles: { bgColor: '#5d576b', textColor: '#ffffff' } },
      { label: 'blog',  href: '#', ariaLabel: 'Blog',  rotation: -8, hoverStyles: { bgColor: '#5d576b', textColor: '#ffffff' } },
    ];

    // Build pill items in DOM
    const pillList   = document.querySelector('.pill-list');
    const bubbleEls  = [];
    const labelEls   = [];

    menuItems.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'pill-col';
      li.setAttribute('role', 'none');

      const a = document.createElement('a');
      a.className = 'pill-link';
      a.href = item.href;
      a.setAttribute('role', 'menuitem');
      a.setAttribute('aria-label', item.ariaLabel || item.label);
      a.style.setProperty('--item-rot',    `${item.rotation ?? 0}deg`);
      a.style.setProperty('--pill-bg',     MENU_BG);
      a.style.setProperty('--pill-color',  MENU_CONTENT_COLOR);
      a.style.setProperty('--hover-bg',    item.hoverStyles?.bgColor  || '#1a1a1a');
      a.style.setProperty('--hover-color', item.hoverStyles?.textColor || MENU_CONTENT_COLOR);

      const span = document.createElement('span');
      span.className = 'pill-label';
      span.textContent = item.label;

      a.appendChild(span);
      li.appendChild(a);
      pillList.appendChild(li);

      bubbleEls.push(a);
      labelEls.push(span);
    });

    // State & Toggle logic
    let isMenuOpen = false;

    const toggleBtn = document.getElementById('menuToggle');
    const overlay   = document.getElementById('menuOverlay');

    toggleBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      toggleBtn.setAttribute('aria-pressed', String(isMenuOpen));
      toggleBtn.classList.toggle('open', isMenuOpen);
      overlay.setAttribute('aria-hidden', String(!isMenuOpen));

      if (isMenuOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    // Open animation
    function openMenu() {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbleEls, ...labelEls]);
      gsap.set(bubbleEls, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labelEls,  { y: 24, autoAlpha: 0 });

      // Blur animation
      gsap.to(document.documentElement, {
        '--blur-amount': '8px',
        duration: 0.6,
        ease: 'power2.out',
      });

      bubbleEls.forEach((bubble, i) => {
        const jitter = gsap.utils.random(-0.05, 0.05);
        const delay  = i * STAGGER_DELAY + jitter;
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE,
        });

        if (labelEls[i]) {
          tl.to(labelEls[i], {
            y: 0,
            autoAlpha: 1,
            duration: ANIMATION_DURATION,
            ease: 'power3.out',
          }, `-=${ANIMATION_DURATION * 0.9}`);
        }
      });
    }

    // Close animation
    function closeMenu() {
      gsap.killTweensOf([...bubbleEls, ...labelEls]);

      // Blur animation
      gsap.to(document.documentElement, {
        '--blur-amount': '0px',
        duration: 0.4,
        ease: 'power2.in',
      });

      gsap.to(labelEls, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in',
      });

      gsap.to(bubbleEls, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        },
      });
    }

    // Handle resize: sync rotation on desktop
    window.addEventListener('resize', () => {
      if (!isMenuOpen) return;
      const isDesktop = window.innerWidth >= 900;
      bubbleEls.forEach((bubble, i) => {
        const rotation = isDesktop ? (menuItems[i].rotation ?? 0) : 0;
        gsap.set(bubble, { rotation });
      });
    });


    const loadingScreen = document.getElementById('loading-screen');
    const homeContent = document.getElementById('home-content');

    // Optimisation : réduire les délais de transition pour meilleure UX
    const LOADING_DURATION = 1800; // Réduit de 2500 à 1800ms
    const FADE_OUT_DELAY = 400; // Réduit de 500 à 400ms
    const REVEAL_DELAY = 700; // Réduit de 800 à 700ms

    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            revealTransition();

            setTimeout(() => {
                homeContent.classList.add('content-visible');
                // Lancer les animations de la Home une fois visible
                initHomeAnimations();
                // Nettoyer le loading screen du DOM après animation
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
            ease: "power2.inOut"
        });
    }

    // ============================================
    // 3. ANIMATIONS HOME & SCROLL
    // ============================================
    function initHomeAnimations() {
        
        // A. Intro du texte Hero
        const tl = gsap.timeline();
        tl.to(".name", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" })
          .to(".subtitle", { opacity: 1, duration: 1 }, "-=1");

        // B. Parallax Image (optimisé - sans scrub)
        // L'image descend plus lentement que le scroll
        gsap.to(".hero-img", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.5 // Valeur réduite pour meilleure perf
            }
        });

        // C. Disparition du titre au scroll (optimisé)
        gsap.to(".hero-text-container", {
            y: -100,
            opacity: 0,
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom 30%",
                scrub: 0.3 // Valeur réduite pour meilleure perf
            }
        });
        /* Boucle sur .project-item supprimée - section projects supprimée du HTML */
    }

    // ============================================
    // 4. SCROLL STACK EFFECT (CARD SCROLL)
    // ============================================
    const CONFIG = {
        itemDistance:      100,
        itemScale:         0.03,
        itemStackDistance: 30,
        stackPosition:     '20%',
        scaleEndPosition:  '10%',
        baseScale:         0.85,
        rotationAmount:    0,
        blurAmount:        0,
    };

    const cards    = Array.from(document.querySelectorAll('.scroll-stack-card'));
    const stackEnd = document.getElementById('stackEnd');

    let cardOffsets = [];
    let endOffset   = 0;
    let viewportH   = window.innerHeight;

    function cacheOffsets() {
        viewportH   = window.innerHeight;
        cardOffsets = cards.map(c => c.getBoundingClientRect().top + window.scrollY);
        endOffset   = stackEnd.getBoundingClientRect().top + window.scrollY;
    }

    // Init card styles
    cards.forEach((card, i) => {
        if (i < cards.length - 1) card.style.marginBottom = `${CONFIG.itemDistance}px`;
        card.style.willChange         = 'transform, filter';
        card.style.transformOrigin    = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.transform          = 'translateZ(0)';
        card.style.perspective        = '1000px';
    });

    const lastTransforms = new Map();

    function parsePercentage(value, h) {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * h;
        }
        return parseFloat(value);
    }

    function clampedProgress(scroll, start, end) {
        if (scroll <= start) return 0;
        if (scroll >= end)   return 1;
        return (scroll - start) / (end - start);
    }

    function updateCardTransforms(scrollTop) {
        const stackPx    = parsePercentage(CONFIG.stackPosition,    viewportH);
        const scaleEndPx = parsePercentage(CONFIG.scaleEndPosition, viewportH);
        const pinEnd     = endOffset - viewportH / 2;

        let topCardIndex = 0;
        if (CONFIG.blurAmount) {
            for (let j = 0; j < cards.length; j++) {
                if (scrollTop >= cardOffsets[j] - stackPx - CONFIG.itemStackDistance * j) {
                    topCardIndex = j;
                }
            }
        }

        for (let i = 0; i < cards.length; i++) {
            const cardTop      = cardOffsets[i];
            const triggerStart = cardTop - stackPx - CONFIG.itemStackDistance * i;
            const triggerEnd   = cardTop - scaleEndPx;
            const pinStart     = triggerStart;

            const scaleProgress = clampedProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale   = CONFIG.baseScale + i * CONFIG.itemScale;
            const scale         = 1 - scaleProgress * (1 - targetScale);
            const rotation      = CONFIG.rotationAmount
                ? i * CONFIG.rotationAmount * scaleProgress : 0;

            const blur = (CONFIG.blurAmount && i < topCardIndex)
                ? Math.max(0, (topCardIndex - i) * CONFIG.blurAmount)
                : 0;

            let translateY = 0;
            if (scrollTop >= pinStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackPx + CONFIG.itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd   - cardTop + stackPx + CONFIG.itemStackDistance * i;
            }

            const t = {
                ty:  Math.round(translateY * 100) / 100,
                s:   Math.round(scale      * 1000) / 1000,
                r:   Math.round(rotation   * 100) / 100,
                b:   Math.round(blur       * 100) / 100,
            };

            const prev    = lastTransforms.get(i);
            const changed = !prev
                || Math.abs(prev.ty - t.ty) > 0.1
                || Math.abs(prev.s  - t.s)  > 0.001
                || Math.abs(prev.r  - t.r)  > 0.1
                || Math.abs(prev.b  - t.b)  > 0.1;

            if (changed) {
                cards[i].style.transform = `translate3d(0,${t.ty}px,0) scale(${t.s}) rotate(${t.r}deg)`;
                cards[i].style.filter    = t.b > 0 ? `blur(${t.b}px)` : '';
                lastTransforms.set(i, t);
            }
        }
    }

    // Scroll listener via window.scrollY (will-change optimized)
    let lastScrollTop = 0;
    function handleScroll() {
        lastScrollTop = window.scrollY;
        updateCardTransforms(lastScrollTop);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize: re-cache then re-render
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cacheOffsets();
            updateCardTransforms(lastScrollTop);
        }, 100);
    });

    // Boot: measure after first paint
    requestAnimationFrame(() => {
        cacheOffsets();
        updateCardTransforms(0);
    });
});