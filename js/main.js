/* =============================================
   THE THEATRE RESTAURANT — Main JavaScript
   Premium effects: custom cursor, preloader, 
   scroll reveals, parallax, particles, lightbox,
   magnetic buttons, menu nav, language switcher
   ============================================= */

(function () {
    'use strict';

    /* ----- UTILS ----- */
    const qs = (sel, ctx = document) => ctx.querySelector(sel);
    const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

    /* ===================================================
       1. CURTAIN INTRO / PRELOADER
       =================================================== */
    const preloader = qs('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Let the center content animate in first, then open curtains
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.add('loaded');
                // Remove after curtain transition completes
                setTimeout(() => preloader.remove(), 1800);
            }, 1800);
        });
    }

    /* ===================================================
       2. CUSTOM CURSOR
       =================================================== */
    const cursorDot = qs('#cursorDot');
    const cursorRing = qs('#cursorRing');

    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
        let mx = -100, my = -100;
        let rx = -100, ry = -100;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            cursorDot.style.transform = `translate(${mx}px, ${my}px)`;
        });

        // Smooth follow ring
        function animateRing() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover states
        const hoverTargets = 'a, button, .btn, .magnetic-wrap, .gallery-item, .showcase-card, .lang-btn, input, select, textarea';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(hoverTargets)) {
                cursorDot.classList.add('cursor-hover');
                cursorRing.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(hoverTargets)) {
                cursorDot.classList.remove('cursor-hover');
                cursorRing.classList.remove('cursor-hover');
            }
        });

        // Hide on leave
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
    } else {
        // Remove cursor elements on touch devices
        cursorDot && cursorDot.remove();
        cursorRing && cursorRing.remove();
    }

    /* ===================================================
       3. SCROLL PROGRESS BAR
       =================================================== */
    const scrollProgress = qs('#scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }, { passive: true });
    }

    /* ===================================================
       4. NAVBAR — scroll, hamburger, mobile nav
       =================================================== */
    const navbar = qs('#navbar');
    const hamburger = qs('#hamburger');
    const mobileNav = qs('#mobileNav');

    // Navbar scroll state
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            navbar.classList.toggle('scrolled', y > 60);
            // Hide on scroll down, show on up (after 300px)
            if (y > 300) {
                navbar.classList.toggle('nav-hidden', y > lastScroll && y - lastScroll > 5);
            } else {
                navbar.classList.remove('nav-hidden');
            }
            lastScroll = y;
        }, { passive: true });
    }

    // Hamburger toggle
    if (hamburger && mobileNav) {
        on(hamburger, 'click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close on link click
        qsa('a', mobileNav).forEach(link => {
            on(link, 'click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    /* ===================================================
       5. SCROLL REVEAL ANIMATIONS
       =================================================== */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    function initReveals() {
        qsa('[data-reveal]').forEach(el => {
            el.classList.add('reveal', `reveal-${el.dataset.reveal}`);
            revealObserver.observe(el);
        });
    }

    /* ===================================================
       6. HERO TITLE REVEAL ANIMATION (Cinematic)
       =================================================== */
    function initHeroReveal() {
        const titleLines = qsa('.hst-line');
        if (!titleLines.length) return;

        setTimeout(() => {
            titleLines.forEach((line, i) => {
                setTimeout(() => line.classList.add('visible'), i * 250);
            });
        }, 800);
    }

    /* ===================================================
       6b. HERO MOUSE PARALLAX
       =================================================== */
    function initHeroParallax() {
        const frame = qs('.hero-stage-frame');
        const img = qs('.hero-stage-img');
        if (!frame || !img || !window.matchMedia('(pointer: fine)').matches) return;

        frame.addEventListener('mousemove', e => {
            const rect = frame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `translate(${-x * 10}px, ${-y * 10}px) scale(1.08)`;
        });
        frame.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1.05)';
            img.style.transition = 'transform 0.8s ease';
            setTimeout(() => { img.style.transition = 'transform 12s ease'; }, 800);
        });
    }

    /* ===================================================
       7. HERO PARTICLES
       =================================================== */
    function initParticles() {
        const container = qs('#heroParticles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            const size = 2 + Math.random() * 4;
            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${4 + Math.random() * 6}s;
                opacity: ${0.2 + Math.random() * 0.4};
            `;
            container.appendChild(p);
        }
    }

    /* ===================================================
       8. PARALLAX EFFECTS
       =================================================== */
    function initParallax() {
        const farmBg = qs('.farm-bg');
        if (!farmBg) return;

        window.addEventListener('scroll', () => {
            const farmSection = farmBg.closest('.farm-section');
            if (farmSection) {
                const rect = farmSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (rect.top / window.innerHeight) * 60;
                    farmBg.style.transform = `translateY(${offset}px) scale(1.1)`;
                }
            }
        }, { passive: true });
    }

    /* ===================================================
       8b. COUNTER ANIMATION
       =================================================== */
    function initCounters() {
        const counters = qsa('.number-value[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out expo
                        const eased = 1 - Math.pow(1 - progress, 4);
                        el.textContent = Math.round(target * eased);
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    /* ===================================================
       9. MAGNETIC BUTTON EFFECT
       =================================================== */
    function initMagnetic() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        qsa('.magnetic-wrap').forEach(btn => {
            on(btn, 'mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            on(btn, 'mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                setTimeout(() => { btn.style.transition = ''; }, 400);
            });
        });
    }

    /* ===================================================
       10. GALLERY LIGHTBOX
       =================================================== */
    function initLightbox() {
        const lightbox = qs('#lightbox');
        if (!lightbox) return;

        const img = qs('#lightboxImg');
        const closeBtn = qs('#lightboxClose');
        const prevBtn = qs('#lightboxPrev');
        const nextBtn = qs('#lightboxNext');
        const counter = qs('#lightboxCounter');
        const items = qsa('.gallery-item');

        if (!items.length) return;

        let current = 0;

        function show(idx) {
            current = idx;
            const src = items[idx].getAttribute('href');
            img.src = src;
            counter.textContent = `${idx + 1} / ${items.length}`;
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        }

        function hide() {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
            setTimeout(() => { img.src = ''; }, 300);
        }

        function next() { show((current + 1) % items.length); }
        function prev() { show((current - 1 + items.length) % items.length); }

        items.forEach((item, i) => {
            on(item, 'click', e => { e.preventDefault(); show(i); });
        });

        on(closeBtn, 'click', hide);
        on(prevBtn, 'click', prev);
        on(nextBtn, 'click', next);

        // Close on backdrop click
        on(lightbox, 'click', e => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-image-wrap')) hide();
        });

        // Keyboard nav
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') hide();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });

        // Swipe on mobile
        let touchStartX = 0;
        on(lightbox, 'touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        on(lightbox, 'touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        });
    }

    /* ===================================================
       11. MENU STICKY NAV — Active tracking
       =================================================== */
    function initMenuNav() {
        const catNav = qs('#menuCatNav');
        if (!catNav) return;

        const links = qsa('.menu-cat-link', catNav);
        const categories = qsa('.menu-category');

        if (!categories.length) return;

        // Scroll to category on click
        links.forEach(link => {
            on(link, 'click', e => {
                e.preventDefault();
                const target = qs(link.getAttribute('href'));
                if (target) {
                    const offset = (catNav.offsetHeight || 60) + (navbar ? navbar.offsetHeight : 0) + 20;
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Active tracking on scroll
        const observerOptions = {
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const catObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
                    // Scroll nav to make active visible
                    const activeLink = qs('.menu-cat-link.active', catNav);
                    if (activeLink) {
                        const navInner = qs('.menu-cat-nav-inner', catNav);
                        if (navInner) {
                            navInner.scrollTo({
                                left: activeLink.offsetLeft - navInner.offsetWidth / 2 + activeLink.offsetWidth / 2,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        }, observerOptions);

        categories.forEach(cat => catObserver.observe(cat));
    }

    /* ===================================================
       12. RESERVATION FORM
       =================================================== */
    function initForm() {
        const form = qs('#reservationForm');
        if (!form) return;

        const success = qs('#reservSuccess');

        // Set minimum date to today
        const dateInput = qs('#date', form);
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        on(form, 'submit', e => {
            e.preventDefault();

            // Simulate success
            form.style.opacity = '0';
            form.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                form.style.display = 'none';
                if (success) {
                    success.style.display = 'flex';
                    setTimeout(() => success.classList.add('visible'), 50);
                }
            }, 400);
        });
    }

    /* ===================================================
       13. BACK TO TOP
       =================================================== */
    const backToTop = qs('#backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        on(backToTop, 'click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ===================================================
       14. SMOOTH SCROLL for anchor links
       =================================================== */
    qsa('a[href^="#"]').forEach(link => {
        on(link, 'click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = qs(href);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight + 20 : 80;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===================================================
       15. LANGUAGE SWITCHER
       =================================================== */
    function initLangSwitcher() {
        const langBtns = qsa('.lang-btn');
        if (!langBtns.length) return;

        // Check stored language
        const stored = localStorage.getItem('theatre-lang');
        if (stored && window.translations && window.translations[stored]) {
            applyTranslations(stored);
            langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === stored));
            document.documentElement.setAttribute('data-lang', stored);
        }

        langBtns.forEach(btn => {
            on(btn, 'click', () => {
                const lang = btn.dataset.lang;
                langBtns.forEach(b => b.classList.toggle('active', b === btn));
                applyTranslations(lang);
                localStorage.setItem('theatre-lang', lang);
                document.documentElement.setAttribute('data-lang', lang);
            });
        });
    }

    function applyTranslations(lang) {
        if (!window.translations || !window.translations[lang]) return;
        const t = window.translations[lang];

        qsa('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const val = resolveKey(t, key);
            if (val !== undefined) {
                if (el.tagName === 'INPUT' && el.type !== 'submit') {
                    el.placeholder = val;
                } else {
                    el.innerHTML = val;
                }
            }
        });
    }

    function resolveKey(obj, path) {
        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    }

    /* ===================================================
       16. SHOWCASE HORIZONTAL AUTO-SCROLL PAUSE ON HOVER
       =================================================== */
    function initShowcase() {
        const scroll = qs('.showcase-scroll');
        if (!scroll) return;

        on(scroll, 'mouseenter', () => {
            scroll.style.animationPlayState = 'paused';
        });
        on(scroll, 'mouseleave', () => {
            scroll.style.animationPlayState = 'running';
        });
    }

    /* ===================================================
       17. TILT EFFECT on showcase cards
       =================================================== */
    function initTilt() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        qsa('.showcase-card, .contact-card').forEach(card => {
            on(card, 'mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
            });
            on(card, 'mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });
    }

    /* ===================================================
       18. TEXT SPLIT REVEAL (for headings with .split-reveal)
       =================================================== */
    function initSplitReveal() {
        qsa('.split-reveal').forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            el.setAttribute('aria-label', text);

            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'split-char';
                span.style.animationDelay = `${i * 0.03}s`;
                el.appendChild(span);
            });

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.classList.add('split-visible');
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(el);
        });
    }

    /* ===================================================
       INIT ALL
       =================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        initReveals();
        initHeroReveal();
        initHeroParallax();
        initParticles();
        initParallax();
        initMagnetic();
        initLightbox();
        initMenuNav();
        initForm();
        initLangSwitcher();
        initShowcase();
        initTilt();
        initSplitReveal();
        initCounters();
    });

})();
