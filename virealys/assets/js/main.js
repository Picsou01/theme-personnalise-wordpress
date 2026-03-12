/**
 * Virealys - Revolutionary Adaptive Engine v4.0
 * A site that adapts to the user, not the other way around.
 *
 * Systems:
 * 1. Cursor Light    - Ambient light follows the mouse
 * 2. Magnetic UI     - Interactive elements pull toward cursor
 * 3. Card Tilt       - 3D perspective tilt on cards
 * 4. Click Ripple    - Neon ripple wave on every click
 * 5. Adaptive Nav    - Context-aware floating dock with progress
 * 6. Section Morph   - Ambient colors shift per section
 * 7. Idle Breathing  - Site breathes when user is idle
 * 8. Parallax Depth  - Multi-layer cursor parallax
 * 9. Scroll Velocity - Speed-aware visual feedback
 * 10. Smart Reveals  - Proximity + scroll reveals
 */

(function () {
    'use strict';

    /* ==============================================
       CONFIGURATION
       ============================================== */
    var CFG = {
        CURSOR_SIZE: 600,
        MAGNETIC_RADIUS: 100,
        MAGNETIC_STRENGTH: 0.25,
        TILT_MAX: 6,
        TILT_PERSPECTIVE: 900,
        IDLE_TIMEOUT: 4000,
        DOCK_HIDE_THRESHOLD: 80,
        DOCK_SHOW_PAUSE: 1500,
        PARALLAX_FACTOR: 0.015,
        RIPPLE_DURATION: 700,
        LERP_SPEED: 0.12,
    };

    /* ==============================================
       STATE
       ============================================== */
    var S = {
        mx: window.innerWidth / 2,
        my: window.innerHeight / 2,
        tx: window.innerWidth / 2,
        ty: window.innerHeight / 2,
        scrollY: window.scrollY,
        lastScrollY: window.scrollY,
        scrollDelta: 0,
        scrollVelocity: 0,
        dockHidden: false,
        idle: false,
        idleTimer: null,
        mobile: window.matchMedia('(max-width: 768px)').matches,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        raf: null,
    };

    // Reduced motion: only init essentials
    if (S.reducedMotion) {
        initReveals();
        initNavDock();
        initMenuOverlay();
        initSmoothScroll();
        return;
    }

    /* ==============================================
       1. CURSOR LIGHT SYSTEM
       Ambient radial glow follows the mouse like
       a soft flashlight in a dark environment.
       ============================================== */
    var cursorLight = null;

    if (!S.mobile) {
        cursorLight = document.createElement('div');
        cursorLight.className = 'vr-cursor-light';
        cursorLight.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorLight);
    }

    /* ==============================================
       2. MAGNETIC UI ELEMENTS
       Buttons and links subtly pull toward cursor
       when nearby - makes clicking feel natural.
       ============================================== */
    function initMagnetics() {
        if (S.mobile) return;
        var selectors = [
            '.btn',
            '.nav-dock-link',
            '.nav-dock-menu-btn',
            '.nav-dock-cta',
            '.overlay-social-link',
            '.footer-social a',
            '.ambiance-card-cta',
        ];
        document.querySelectorAll(selectors.join(',')).forEach(function (el) {
            el.setAttribute('data-magnetic', '');
        });
    }

    function updateMagnetics() {
        var magnets = document.querySelectorAll('[data-magnetic]');
        for (var i = 0; i < magnets.length; i++) {
            var el = magnets[i];
            var rect = el.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dx = S.mx - cx;
            var dy = S.my - cy;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CFG.MAGNETIC_RADIUS) {
                var pull = (1 - dist / CFG.MAGNETIC_RADIUS) * CFG.MAGNETIC_STRENGTH;
                el.style.transform = 'translate(' + (dx * pull).toFixed(1) + 'px,' + (dy * pull).toFixed(1) + 'px)';
            } else if (el.style.transform) {
                el.style.transform = '';
            }
        }
    }

    /* ==============================================
       3. CARD TILT (3D Perspective)
       Cards tilt toward cursor, creating a tactile
       physical sensation.
       ============================================== */
    function initTilt() {
        if (S.mobile) return;
        var cards = document.querySelectorAll(
            '.concept-card, .zone-card, .menu-card, .menu-card-detailed, ' +
            '.ambiance-card, .passport-card, .contact-card, .level-card, .step-card'
        );
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width;
                var y = (e.clientY - rect.top) / rect.height;
                var tiltX = (0.5 - y) * CFG.TILT_MAX;
                var tiltY = (x - 0.5) * CFG.TILT_MAX;
                card.style.transform =
                    'perspective(' + CFG.TILT_PERSPECTIVE + 'px) rotateX(' + tiltX.toFixed(2) +
                    'deg) rotateY(' + tiltY.toFixed(2) + 'deg) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(function () { card.style.transition = ''; }, 500);
            });

            card.addEventListener('mouseenter', function () {
                card.style.transition = 'none';
            });
        });
    }

    /* ==============================================
       4. CLICK RIPPLE
       Neon ripple wave radiates from every click.
       ============================================== */
    document.addEventListener('click', function (e) {
        if (S.mobile) return;
        var ripple = document.createElement('div');
        ripple.className = 'vr-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        setTimeout(function () {
            if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, CFG.RIPPLE_DURATION + 100);
    });

    /* ==============================================
       5. ADAPTIVE NAVIGATION DOCK
       - Scroll-aware hide/show
       - Section tracking with progress indicator
       - Shows on scroll pause
       ============================================== */
    var navDock = document.getElementById('nav-dock');
    var dockProgress = null;
    var scrollTimeout = null;

    function initNavDock() {
        if (!navDock) return;

        // Create progress bar
        dockProgress = document.createElement('div');
        dockProgress.className = 'nav-dock-progress';
        dockProgress.setAttribute('aria-hidden', 'true');
        navDock.appendChild(dockProgress);

        window.addEventListener('scroll', onScroll, { passive: true });
        updateProgress();
    }

    function onScroll() {
        var currentY = window.scrollY;
        var diff = currentY - S.lastScrollY;

        updateProgress();

        if (currentY < 100) {
            showDock();
            S.lastScrollY = currentY;
            S.scrollDelta = 0;
            return;
        }

        if (diff > 0) {
            S.scrollDelta += diff;
            if (S.scrollDelta > CFG.DOCK_HIDE_THRESHOLD && !S.dockHidden) hideDock();
        } else {
            S.scrollDelta = 0;
            if (S.dockHidden) showDock();
        }

        S.lastScrollY = currentY;
        S.scrollVelocity = Math.abs(diff);

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            if (S.dockHidden) showDock();
        }, CFG.DOCK_SHOW_PAUSE);
    }

    function hideDock() {
        if (navDock) { navDock.classList.add('dock-hidden'); S.dockHidden = true; }
    }

    function showDock() {
        if (navDock) { navDock.classList.remove('dock-hidden'); S.dockHidden = false; }
    }

    function updateProgress() {
        if (!dockProgress) return;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        dockProgress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }

    function initSectionTracking() {
        var links = document.querySelectorAll('.nav-dock-link[data-section]');
        var sections = [];

        links.forEach(function (link) {
            var id = link.getAttribute('data-section');
            var el = document.getElementById(id);
            if (el) sections.push({ id: id, el: el, link: link });
        });

        if (sections.length > 0 && 'IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        links.forEach(function (l) { l.classList.remove('active'); });
                        for (var i = 0; i < sections.length; i++) {
                            if (sections[i].id === entry.target.id) {
                                sections[i].link.classList.add('active');
                                break;
                            }
                        }
                    }
                });
            }, { threshold: 0.3, rootMargin: '-10% 0px -40% 0px' });

            sections.forEach(function (s) { obs.observe(s.el); });
        }
    }

    /* ==============================================
       6. SECTION COLOR MORPHING
       Ambient palette shifts per section for mood.
       ============================================== */
    function initSectionMorph() {
        var sections = document.querySelectorAll('[data-section-color]');
        if (sections.length === 0 || !('IntersectionObserver' in window)) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var color = entry.target.getAttribute('data-section-color');
                    if (color) document.documentElement.style.setProperty('--section-accent', color);
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(function (s) { obs.observe(s); });
    }

    /* ==============================================
       7. IDLE BREATHING
       Site enters subtle breathing mode when user
       stops interacting for a few seconds.
       ============================================== */
    function resetIdle() {
        if (S.idle) {
            S.idle = false;
            document.body.classList.remove('vr-idle');
        }
        clearTimeout(S.idleTimer);
        S.idleTimer = setTimeout(function () {
            S.idle = true;
            document.body.classList.add('vr-idle');
        }, CFG.IDLE_TIMEOUT);
    }

    /* ==============================================
       8. PARALLAX DEPTH
       Elements shift relative to cursor position
       creating layers of depth.
       ============================================== */
    function initParallax() {
        if (S.mobile) return;
        document.querySelectorAll('.hero-orb').forEach(function (orb, i) {
            orb.setAttribute('data-parallax', ((i + 1) * 0.8).toFixed(1));
        });
        document.querySelectorAll('.hero-grid-bg').forEach(function (el) {
            el.setAttribute('data-parallax', '0.3');
        });
    }

    function updateParallax() {
        var els = document.querySelectorAll('[data-parallax]');
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        var dx = (S.tx - cx) * CFG.PARALLAX_FACTOR;
        var dy = (S.ty - cy) * CFG.PARALLAX_FACTOR;

        for (var i = 0; i < els.length; i++) {
            var depth = parseFloat(els[i].getAttribute('data-parallax')) || 1;
            els[i].style.transform = 'translate(' + (dx * depth).toFixed(1) + 'px,' + (dy * depth).toFixed(1) + 'px)';
        }
    }

    /* ==============================================
       9. SCROLL VELOCITY
       Exposes --scroll-velocity CSS variable for
       speed-reactive visual effects.
       ============================================== */
    function updateScrollVelocity() {
        var v = Math.min(S.scrollVelocity / 50, 1);
        document.documentElement.style.setProperty('--scroll-velocity', v.toFixed(3));
        S.scrollVelocity *= 0.92;
        if (S.scrollVelocity < 0.1) S.scrollVelocity = 0;
    }

    /* ==============================================
       10. SMART REVEALS (Scroll-based)
       ============================================== */
    function initReveals() {
        var els = document.querySelectorAll('[data-reveal]');
        if (els.length > 0 && 'IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            els.forEach(function (el) { obs.observe(el); });
        } else {
            els.forEach(function (el) { el.classList.add('revealed'); });
        }
    }

    /* ==============================================
       MENU OVERLAY
       ============================================== */
    function initMenuOverlay() {
        var menuBtn = document.getElementById('nav-dock-menu-btn');
        var overlay = document.getElementById('menu-overlay');
        var closeBtn = document.getElementById('menu-overlay-close');

        function open() {
            if (overlay) { overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false'); }
            if (menuBtn) { menuBtn.classList.add('active'); menuBtn.setAttribute('aria-expanded', 'true'); }
            document.body.style.overflow = 'hidden';
        }

        function close() {
            if (overlay) { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); }
            if (menuBtn) { menuBtn.classList.remove('active'); menuBtn.setAttribute('aria-expanded', 'false'); }
            document.body.style.overflow = '';
        }

        if (menuBtn) menuBtn.addEventListener('click', function () {
            overlay && overlay.classList.contains('open') ? close() : open();
        });
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (overlay) {
            overlay.querySelectorAll('.nav-link, .overlay-nav-link').forEach(function (l) {
                l.addEventListener('click', close);
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) close();
        });
    }

    /* ==============================================
       SMOOTH SCROLL
       ============================================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 20,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ==============================================
       HERO PARTICLES
       ============================================== */
    function initParticles() {
        var container = document.getElementById('hero-particles');
        if (!container) return;
        for (var i = 0; i < 30; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText =
                'left:' + (Math.random() * 100) + '%;bottom:-10px;width:' + (1 + Math.random() * 2) +
                'px;height:' + (1 + Math.random() * 2) + 'px;animation-delay:' + (Math.random() * 8) +
                's;animation-duration:' + (6 + Math.random() * 8) + 's;';
            if (i % 3 === 1) { p.style.background = '#a855f7'; p.style.boxShadow = '0 0 6px rgba(168,85,247,0.5)'; }
            else if (i % 3 === 2) { p.style.background = '#4d7cff'; p.style.boxShadow = '0 0 6px rgba(77,124,255,0.5)'; }
            container.appendChild(p);
        }
    }

    /* ==============================================
       CARD GLOW (mouse-following highlight)
       ============================================== */
    function initCardGlow() {
        document.querySelectorAll('.menu-card, .zone-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var glow = card.querySelector('.menu-card-glow');
                if (glow) {
                    glow.style.background = 'radial-gradient(circle at ' + (e.clientX - rect.left) + 'px ' + (e.clientY - rect.top) + 'px, rgba(0,229,255,0.06), transparent 60%)';
                    glow.style.opacity = '1';
                }
            });
            card.addEventListener('mouseleave', function () {
                var glow = card.querySelector('.menu-card-glow');
                if (glow) glow.style.opacity = '0';
            });
        });
    }

    /* ==============================================
       MAIN ANIMATION LOOP (60fps with lerp)
       ============================================== */
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        S.tx = lerp(S.tx, S.mx, CFG.LERP_SPEED);
        S.ty = lerp(S.ty, S.my, CFG.LERP_SPEED);

        if (cursorLight) {
            cursorLight.style.transform =
                'translate3d(' + (S.tx - CFG.CURSOR_SIZE / 2).toFixed(0) + 'px,' +
                (S.ty - CFG.CURSOR_SIZE / 2).toFixed(0) + 'px,0)';
        }

        updateMagnetics();
        updateParallax();
        updateScrollVelocity();

        S.raf = requestAnimationFrame(animate);
    }

    /* ==============================================
       EVENT LISTENERS
       ============================================== */
    document.addEventListener('mousemove', function (e) {
        S.mx = e.clientX;
        S.my = e.clientY;
        resetIdle();
    });

    document.addEventListener('touchmove', function (e) {
        if (e.touches.length > 0) {
            S.mx = e.touches[0].clientX;
            S.my = e.touches[0].clientY;
        }
        resetIdle();
    }, { passive: true });

    window.addEventListener('resize', function () {
        S.mobile = window.matchMedia('(max-width: 768px)').matches;
    });

    document.addEventListener('keydown', resetIdle);
    document.addEventListener('click', resetIdle);

    /* ==============================================
       INITIALIZATION
       ============================================== */
    initMagnetics();
    initTilt();
    initNavDock();
    initSectionTracking();
    initSectionMorph();
    initParallax();
    initReveals();
    initMenuOverlay();
    initSmoothScroll();
    initParticles();
    initCardGlow();
    resetIdle();

    if (!S.mobile) animate();

})();
