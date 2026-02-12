document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // 0. INIT SMOOTH SCROLL (LENIS) - FIX JITTER
    // ============================================
    // L'ajout de Lenis corrige le problème de tremblement 
    // en lissant le scroll delta entre le navigateur et GSAP.
    const lenis = new Lenis({
        lerp: 0.1, // Douceur du scroll
        smoothWheel: true
    });

    // Synchronisation de Lenis avec GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ============================================
    // 1. CUSTOM CURSOR
    // ============================================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    // Déplacement de base
    let lastMouseMove = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMove > 16) { 
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.set(cursor, { x: mouseX, y: mouseY });
            lastMouseMove = now;
        }
    }, { passive: true });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15; 
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(follower, { x: followerX, y: followerY });
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverables = document.querySelectorAll('a, button');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    // ============================================
    // 1.5 BUBBLE MENU
    // ============================================
    const MENU_BG           = '#ffffff';
    const MENU_CONTENT_COLOR = '#000000';
    const ANIMATION_EASE    = 'back.out(1.5)';
    const ANIMATION_DURATION = 0.5;
    const STAGGER_DELAY     = 0.12;

    const menuItems = [
      { label: 'home',     href: '#', ariaLabel: 'Home',     rotation: -8, hoverStyles: { bgColor: '#ed6a5a', textColor: '#ffffff' } },
      { label: 'about',    href: '#', ariaLabel: 'About',    rotation:  8, hoverStyles: { bgColor: '#f4f1bb', textColor: '#111111' } },
      { label: 'projects', href: '#', ariaLabel: 'Projects', rotation:  8, hoverStyles: { bgColor: '#9bc1bc', textColor: '#111111' } },
      { label: 'contact',  href: '#', ariaLabel: 'Contact',  rotation: -8, hoverStyles: { bgColor: '#5d576b', textColor: '#ffffff' } },
      { label: 'blog',     href: '#', ariaLabel: 'Blog',     rotation: -8, hoverStyles: { bgColor: '#5d576b', textColor: '#ffffff' } },
    ];

    const pillList   = document.querySelector('.pill-list');
    const bubbleEls  = [];
    const labelEls   = [];

    menuItems.forEach((item) => {
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

    let isMenuOpen = false;
    const toggleBtn = document.getElementById('menuToggle');
    const overlay   = document.getElementById('menuOverlay');

    toggleBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      toggleBtn.setAttribute('aria-pressed', String(isMenuOpen));
      toggleBtn.classList.toggle('open', isMenuOpen);
      overlay.setAttribute('aria-hidden', String(!isMenuOpen));

      // Gestion de la scrollbar quand le menu est ouvert
      if (isMenuOpen) {
        document.body.classList.add('no-scroll');
        // Stop Lenis
        lenis.stop();
        openMenu();
      } else {
        document.body.classList.remove('no-scroll');
        // Restart Lenis
        lenis.start();
        closeMenu();
      }
    });

    function openMenu() {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbleEls, ...labelEls]);
      gsap.set(bubbleEls, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labelEls,  { y: 24, autoAlpha: 0 });

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

    function closeMenu() {
      gsap.killTweensOf([...bubbleEls, ...labelEls]);

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

    window.addEventListener('resize', () => {
      if (!isMenuOpen) return;
      const isDesktop = window.innerWidth >= 900;
      bubbleEls.forEach((bubble, i) => {
        const rotation = isDesktop ? (menuItems[i].rotation ?? 0) : 0;
        gsap.set(bubble, { rotation });
      });
    });


    // ============================================
    // 2. LOADING SCREEN & TRANSITION
    // ============================================
    const loadingScreen = document.getElementById('loading-screen');
    const homeContent = document.getElementById('home-content');

    const LOADING_DURATION = 1800; 
    const FADE_OUT_DELAY = 400; 
    const REVEAL_DELAY = 700; 

    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            revealTransition();

            setTimeout(() => {
                homeContent.classList.add('content-visible');
                
                // C'est ICI qu'on rend la main à l'utilisateur
                // On enlève la classe qui bloque le scroll
                document.body.classList.remove('no-scroll');
                
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
            ease: "power2.inOut"
        });
    }

    // ============================================
    // 3. ANIMATIONS HOME & SCROLL
    // ============================================
    function initHomeAnimations() {
        const tl = gsap.timeline();
        tl.to(".name", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" })
          .to(".subtitle", { opacity: 1, duration: 1 }, "-=1");

        gsap.to(".hero-img", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.5 
            }
        });

        gsap.to(".hero-text-container", {
            y: -100,
            opacity: 0,
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom 30%",
                scrub: 0.3 
            }
        });
    }

    // ============================================
    // 4. SCROLL STACK EFFECT (Optimized)
    // ============================================
    const CONFIG = {
        itemDistance:      100,
        itemScale:         0.03,
        itemStackDistance: 30,
        stackPosition:     '20%',
        scaleEndPosition:  '10%',
        baseScale:         0.85,
        rotationAmount:    0,
    };

    const cards    = Array.from(document.querySelectorAll('.scroll-stack-card'));
    const stackEnd = document.getElementById('stackEnd');

    let cardOffsets = [];
    let endOffset   = 0;
    let viewportH   = window.innerHeight;

    function cacheOffsets() {
        viewportH   = window.innerHeight;
        // Correction du calcul des offsets avec Lenis (window.scrollY)
        const currentScroll = window.scrollY;
        cardOffsets = cards.map(c => c.getBoundingClientRect().top + currentScroll);
        endOffset   = stackEnd.getBoundingClientRect().top + currentScroll;
    }

    cards.forEach((card, i) => {
        if (i < cards.length - 1) card.style.marginBottom = `${CONFIG.itemDistance}px`;
        card.style.willChange         = 'transform';
        card.style.transformOrigin    = 'top center';
        card.style.backfaceVisibility = 'hidden';
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

            let translateY = 0;
            if (scrollTop >= pinStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackPx + CONFIG.itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd   - cardTop + stackPx + CONFIG.itemStackDistance * i;
            }

            // OPTIMISATION : Retrait du Math.round agressif qui causait le tremblement
            // On garde 3 décimales pour la précision sans saccade
            const t = {
                ty:  Math.round(translateY * 1000) / 1000,
                s:   Math.round(scale      * 1000) / 1000,
                r:   Math.round(rotation   * 100) / 100,
            };

            const prev    = lastTransforms.get(i);
            const changed = !prev
                || Math.abs(prev.ty - t.ty) > 0.1 
                || Math.abs(prev.s  - t.s)  > 0.0001;

            if (changed) {
                cards[i].style.transform = `translate3d(0,${t.ty}px,0) scale(${t.s}) rotate(${t.r}deg)`;
                lastTransforms.set(i, t);
            }
        }
    }

    // IMPORTANT : On utilise le ticker GSAP au lieu de 'scroll' event
    // Cela synchronise le calcul avec le rafraîchissement écran (60/120fps)
    gsap.ticker.add(() => {
        updateCardTransforms(window.scrollY);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cacheOffsets();
        }, 100);
    });

    // Boot
    cacheOffsets();
});