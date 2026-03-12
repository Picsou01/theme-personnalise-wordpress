/**
 * Virealys - Constellation Engine v6.0
 *
 * Right-click hold = radial menu around cursor
 * Mouse wheel = normal page scroll (smooth)
 * Constellation hub = bird's-eye page selection
 * Bottom bar = always-visible return to constellation
 * Addictive micro-interactions throughout
 */
(function () {
    'use strict';

    /* =========================================
       CONFIGURATION
       ========================================= */
    var CFG = {
        CURSOR_SIZE: 600,
        MAGNETIC_RADIUS: 100,
        MAGNETIC_STRENGTH: 0.25,
        TILT_MAX: 6,
        IDLE_TIMEOUT: 4000,
        LERP: 0.12,
        RADIAL_RADIUS: 140,
        RADIAL_HOLD_DELAY: 200,
    };

    var S = {
        mx: window.innerWidth / 2, my: window.innerHeight / 2,
        tx: window.innerWidth / 2, ty: window.innerHeight / 2,
        idle: false, idleTimer: null,
        mobile: window.matchMedia('(max-width: 768px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        radialOpen: false, radialTimer: null, radialX: 0, radialY: 0,
    };

    /* =========================================
       USER PROFILE (localStorage)
       ========================================= */
    var PROFILE_KEY = 'vr_user_profile';
    var profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || {
        visits: 0, sections: {}, lastSections: [], lastVisitTime: 0,
    };
    profile.visits++;
    profile.lastVisitTime = Date.now();

    function saveProfile() {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }

    function trackSection(id) {
        profile.sections[id] = (profile.sections[id] || 0) + 1;
        profile.lastSections.unshift(id);
        if (profile.lastSections.length > 30) profile.lastSections.length = 30;
        saveProfile();
    }

    function getSectionPriority(id) {
        var freq = profile.sections[id] || 0;
        var recIdx = profile.lastSections.indexOf(id);
        var recency = recIdx >= 0 ? (20 - recIdx) : 0;
        var hour = new Date().getHours();
        var timeBonus = 0;
        if ((hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 22)) {
            if (id === 'reservation') timeBonus = 20;
            else if (id === 'menus') timeBonus = 10;
        }
        if (hour >= 10 && hour < 18 && id === 'concept') timeBonus = 5;
        return freq * 2 + recency + timeBonus;
    }

    saveProfile();

    // Track current page
    var currentSlug = document.body.getAttribute('data-page-slug');
    if (currentSlug) trackSection(currentSlug);

    /* =========================================
       EARLY BAILOUT FOR REDUCED MOTION
       ========================================= */
    if (S.reduced) {
        initReveals();
        initMenuOverlay();
        initConstellationHub();
        initRadialMenu();
        return;
    }

    /* =========================================
       1. CURSOR LIGHT
       ========================================= */
    var cursorLight = null;
    if (!S.mobile) {
        cursorLight = document.createElement('div');
        cursorLight.className = 'vr-cursor-light';
        cursorLight.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorLight);
    }

    /* =========================================
       2. MAGNETIC UI
       ========================================= */
    function initMagnetics() {
        if (S.mobile) return;
        document.querySelectorAll(
            '.btn, .vr-dock-btn, .overlay-social-link, .footer-social a, .constellation-node'
        ).forEach(function (el) { el.setAttribute('data-magnetic', ''); });
    }

    function updateMagnetics() {
        var els = document.querySelectorAll('[data-magnetic]');
        for (var i = 0; i < els.length; i++) {
            var el = els[i], rect = el.getBoundingClientRect();
            var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
            var dx = S.mx - cx, dy = S.my - cy;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CFG.MAGNETIC_RADIUS) {
                var pull = (1 - dist / CFG.MAGNETIC_RADIUS) * CFG.MAGNETIC_STRENGTH;
                el.style.transform = 'translate(' + (dx * pull).toFixed(1) + 'px,' + (dy * pull).toFixed(1) + 'px)';
            } else if (el.style.transform) {
                el.style.transform = '';
            }
        }
    }

    /* =========================================
       3. CARD TILT
       ========================================= */
    function initTilt() {
        if (S.mobile) return;
        document.querySelectorAll(
            '.concept-card, .zone-card, .menu-card, .ambiance-card, .passport-card, .contact-card, .step-card, .level-card'
        ).forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
                card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * CFG.TILT_MAX).toFixed(2) +
                    'deg) rotateY(' + ((x - 0.5) * CFG.TILT_MAX).toFixed(2) + 'deg) scale(1.02)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                setTimeout(function () { card.style.transition = ''; }, 500);
            });
            card.addEventListener('mouseenter', function () { card.style.transition = 'none'; });
        });
    }

    /* =========================================
       4. CLICK RIPPLE
       ========================================= */
    document.addEventListener('click', function (e) {
        if (S.mobile || S.radialOpen) return;
        var r = document.createElement('div');
        r.className = 'vr-ripple';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        document.body.appendChild(r);
        setTimeout(function () { if (r.parentNode) r.remove(); }, 800);
    });

    /* =========================================
       5. RADIAL MENU (right-click hold)
       ========================================= */
    var radialMenuEl = null;

    function initRadialMenu() {
        // Create radial menu container
        radialMenuEl = document.createElement('div');
        radialMenuEl.className = 'vr-radial-menu';
        radialMenuEl.id = 'vr-radial-menu';
        radialMenuEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(radialMenuEl);

        // Pages for the radial menu
        var pages = [
            { slug: 'concept', label: 'Concept', icon: 'layers', color: '#00e5ff' },
            { slug: 'menus', label: 'Formules', icon: 'utensils', color: '#4d7cff' },
            { slug: 'ambiances', label: 'Ambiances', icon: 'globe', color: '#a855f7' },
            { slug: 'zones', label: 'Zones', icon: 'grid', color: '#e040fb' },
            { slug: 'passeport', label: 'Passeport', icon: 'passport', color: '#f97316' },
            { slug: 'reservation', label: 'Réserver', icon: 'calendar', color: '#10b981' },
        ];

        // Bottom special: return to constellation
        var constellationItem = {
            slug: '__constellation__',
            label: 'Constellation',
            icon: 'star',
            color: '#ffd700',
            isConstellation: true,
        };

        var allItems = pages.concat([constellationItem]);
        var angleStep = (2 * Math.PI) / allItems.length;
        // Place constellation at the bottom (adjust start angle)
        var startAngle = -Math.PI / 2 + angleStep; // Start from top-right, constellation ends at bottom

        // Build items
        allItems.forEach(function (item, i) {
            // Place constellation at bottom center
            var angle;
            if (item.isConstellation) {
                angle = Math.PI / 2; // Bottom
            } else {
                // Distribute other items around, leaving bottom for constellation
                var otherStep = (2 * Math.PI - angleStep) / pages.length;
                angle = -Math.PI / 2 + otherStep * i;
            }

            var el = document.createElement('a');
            if (item.isConstellation) {
                el.href = typeof virealys !== 'undefined' ? virealys.home_url || '/' : '/';
                el.className = 'vr-radial-item vr-radial-constellation';
            } else {
                el.href = '/' + item.slug + '/';
                el.className = 'vr-radial-item';
            }
            el.setAttribute('data-slug', item.slug);
            el.setAttribute('data-angle', angle.toFixed(4));
            el.style.setProperty('--item-color', item.color);
            el.style.setProperty('--item-angle', angle + 'rad');

            el.innerHTML =
                '<span class="vr-radial-item-icon">' + getRadialIcon(item.icon) + '</span>' +
                '<span class="vr-radial-item-label">' + item.label + '</span>';

            radialMenuEl.appendChild(el);

            // Navigate on click
            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeRadialMenu();
                if (item.isConstellation) {
                    window.location.href = '/';
                } else {
                    window.location.href = '/' + item.slug + '/';
                }
            });
        });

        // Right-click hold to open
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

        document.addEventListener('mousedown', function (e) {
            if (e.button === 2) { // Right click
                S.radialX = e.clientX;
                S.radialY = e.clientY;
                S.radialTimer = setTimeout(function () {
                    openRadialMenu(S.radialX, S.radialY);
                }, CFG.RADIAL_HOLD_DELAY);
            }
        });

        document.addEventListener('mouseup', function (e) {
            if (e.button === 2) {
                if (S.radialTimer) {
                    clearTimeout(S.radialTimer);
                    S.radialTimer = null;
                }
                // If menu is open, keep it open — user can click items
                // Close on next left click outside
            }
        });

        // Close on left click outside radial menu
        document.addEventListener('mousedown', function (e) {
            if (e.button === 0 && S.radialOpen) {
                if (!radialMenuEl.contains(e.target)) {
                    closeRadialMenu();
                }
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && S.radialOpen) closeRadialMenu();
        });
    }

    function openRadialMenu(x, y) {
        if (!radialMenuEl) return;
        S.radialOpen = true;

        // Clamp position to keep menu on screen
        var r = CFG.RADIAL_RADIUS + 60;
        x = Math.max(r, Math.min(window.innerWidth - r, x));
        y = Math.max(r, Math.min(window.innerHeight - r, y));

        radialMenuEl.style.left = x + 'px';
        radialMenuEl.style.top = y + 'px';
        radialMenuEl.classList.add('open');
        radialMenuEl.setAttribute('aria-hidden', 'false');
        document.body.classList.add('vr-radial-active');

        // Animate items outward
        var items = radialMenuEl.querySelectorAll('.vr-radial-item');
        items.forEach(function (item, i) {
            var angle = parseFloat(item.getAttribute('data-angle'));
            var tx = Math.cos(angle) * CFG.RADIAL_RADIUS;
            var ty = Math.sin(angle) * CFG.RADIAL_RADIUS;
            item.style.transitionDelay = (i * 0.04) + 's';
            item.style.transform = 'translate(' + tx.toFixed(1) + 'px, ' + ty.toFixed(1) + 'px) scale(1)';
            item.style.opacity = '1';
        });
    }

    function closeRadialMenu() {
        if (!radialMenuEl) return;
        S.radialOpen = false;
        radialMenuEl.classList.remove('open');
        radialMenuEl.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('vr-radial-active');

        var items = radialMenuEl.querySelectorAll('.vr-radial-item');
        items.forEach(function (item) {
            item.style.transitionDelay = '0s';
            item.style.transform = 'translate(0, 0) scale(0.3)';
            item.style.opacity = '0';
        });
    }

    function getRadialIcon(name) {
        var icons = {
            layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
            utensils: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg>',
            globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>',
            grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
            passport: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
            calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
            star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        };
        return icons[name] || icons.star;
    }

    /* =========================================
       6. CONSTELLATION HUB (Front Page)
       ========================================= */
    function initConstellationHub() {
        var hub = document.getElementById('vr-constellation-hub');
        if (!hub) return;

        // Generate floating stars
        var starsContainer = document.getElementById('constellation-stars');
        if (starsContainer) {
            for (var i = 0; i < 80; i++) {
                var star = document.createElement('div');
                star.className = 'constellation-star';
                star.style.left = (Math.random() * 100) + '%';
                star.style.top = (Math.random() * 100) + '%';
                star.style.animationDelay = (Math.random() * 5) + 's';
                star.style.animationDuration = (3 + Math.random() * 4) + 's';
                var size = 1 + Math.random() * 2;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                starsContainer.appendChild(star);
            }
        }

        // Node hover parallax
        var nodes = hub.querySelectorAll('.constellation-node');
        nodes.forEach(function (node) {
            node.addEventListener('mouseenter', function () {
                node.classList.add('hovered');
                // Dim other nodes
                nodes.forEach(function (n) {
                    if (n !== node) n.classList.add('dimmed');
                });
                // Highlight connected lines
                var slug = node.getAttribute('data-page');
                highlightConnectedLines(slug, true);
            });

            node.addEventListener('mouseleave', function () {
                node.classList.remove('hovered');
                nodes.forEach(function (n) { n.classList.remove('dimmed'); });
                highlightConnectedLines(null, false);
            });
        });

        // Reorder constellation based on user profile
        reorderConstellation(nodes);
    }

    function highlightConnectedLines(slug, highlight) {
        var lines = document.querySelectorAll('.constellation-link-line');
        lines.forEach(function (line) {
            if (highlight) {
                var from = line.getAttribute('data-from');
                var to = line.getAttribute('data-to');
                if (from === slug || to === slug) {
                    line.classList.add('highlighted');
                } else {
                    line.classList.add('dimmed');
                }
            } else {
                line.classList.remove('highlighted', 'dimmed');
            }
        });
    }

    function reorderConstellation(nodes) {
        // Apply priority-based visual emphasis
        nodes.forEach(function (node) {
            var slug = node.getAttribute('data-page');
            var priority = getSectionPriority(slug);
            // Higher priority = slightly larger, brighter
            var scale = 1 + Math.min(priority * 0.005, 0.15);
            var brightness = 1 + Math.min(priority * 0.01, 0.3);
            node.style.setProperty('--priority-scale', scale.toFixed(3));
            node.style.setProperty('--priority-brightness', brightness.toFixed(3));
        });
    }

    /* =========================================
       7. CONSTELLATION RETURN BAR
       ========================================= */
    function initConstellationReturn() {
        var returnBar = document.getElementById('vr-constellation-return');
        if (!returnBar) return;

        // Subtle pulse animation
        var pulse = returnBar.querySelector('.constellation-return-pulse');
        if (pulse) {
            setInterval(function () {
                pulse.classList.add('pulse-active');
                setTimeout(function () { pulse.classList.remove('pulse-active'); }, 1500);
            }, 4000);
        }
    }

    /* =========================================
       8. IDLE BREATHING
       ========================================= */
    function resetIdle() {
        if (S.idle) { S.idle = false; document.body.classList.remove('vr-idle'); }
        clearTimeout(S.idleTimer);
        S.idleTimer = setTimeout(function () {
            S.idle = true;
            document.body.classList.add('vr-idle');
        }, CFG.IDLE_TIMEOUT);
    }

    /* =========================================
       9. PARALLAX
       ========================================= */
    function initParallax() {
        if (S.mobile) return;
        document.querySelectorAll('.hero-orb, .constellation-nebula').forEach(function (o, i) {
            o.setAttribute('data-parallax', ((i + 1) * 0.6).toFixed(1));
        });
    }

    function updateParallax() {
        var els = document.querySelectorAll('[data-parallax]');
        var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        var dx = (S.tx - cx) * 0.015, dy = (S.ty - cy) * 0.015;
        for (var i = 0; i < els.length; i++) {
            var d = parseFloat(els[i].getAttribute('data-parallax')) || 1;
            els[i].style.transform = 'translate(' + (dx * d).toFixed(1) + 'px,' + (dy * d).toFixed(1) + 'px)';
        }
    }

    /* =========================================
       10. REVEALS
       ========================================= */
    function initReveals() {
        var els = document.querySelectorAll('[data-reveal]');
        if (els.length > 0 && 'IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { entry.target.classList.add('revealed'); obs.unobserve(entry.target); }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            els.forEach(function (el) { obs.observe(el); });
        } else {
            els.forEach(function (el) { el.classList.add('revealed'); });
        }
    }

    /* =========================================
       MENU OVERLAY
       ========================================= */
    function initMenuOverlay() {
        var btn = document.getElementById('nav-dock-menu-btn');
        var overlay = document.getElementById('menu-overlay');
        var closeBtn = document.getElementById('menu-overlay-close');

        function open() {
            if (overlay) { overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false'); }
            if (btn) { btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
            document.body.style.overflow = 'hidden';
        }
        function close() {
            if (overlay) { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); }
            if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
            document.body.style.overflow = '';
        }

        if (btn) btn.addEventListener('click', function () {
            overlay && overlay.classList.contains('open') ? close() : open();
        });
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (overlay) overlay.querySelectorAll('.nav-link, .overlay-nav-link').forEach(function (l) {
            l.addEventListener('click', close);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) close();
        });
    }

    /* =========================================
       NAV DOCK
       ========================================= */
    var dock = document.getElementById('vr-dock');
    var dockProgress = document.getElementById('vr-dock-progress');

    function initNavDock() {
        if (!dock) return;
        // Scroll-based dock show/hide
        var lastScrollY = 0, scrollDelta = 0, dockHidden = false;
        window.addEventListener('scroll', function () {
            var y = window.scrollY;
            if (dockProgress) {
                var h = document.documentElement.scrollHeight - window.innerHeight;
                dockProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
            }
            if (y < 100) { dock.classList.remove('dock-hidden'); dockHidden = false; lastScrollY = y; scrollDelta = 0; return; }
            var diff = y - lastScrollY;
            if (diff > 0) {
                scrollDelta += diff;
                if (scrollDelta > 80 && !dockHidden) { dock.classList.add('dock-hidden'); dockHidden = true; }
            } else {
                scrollDelta = 0;
                if (dockHidden) { dock.classList.remove('dock-hidden'); dockHidden = false; }
            }
            lastScrollY = y;
        }, { passive: true });
    }

    /* =========================================
       PARTICLES
       ========================================= */
    function initParticles() {
        var c = document.getElementById('hero-particles');
        if (!c) return;
        for (var i = 0; i < 30; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = 'left:' + (Math.random() * 100) + '%;bottom:-10px;width:' + (1 + Math.random() * 2) +
                'px;height:' + (1 + Math.random() * 2) + 'px;animation-delay:' + (Math.random() * 8) +
                's;animation-duration:' + (6 + Math.random() * 8) + 's;';
            if (i % 3 === 1) { p.style.background = '#a855f7'; p.style.boxShadow = '0 0 6px rgba(168,85,247,0.5)'; }
            else if (i % 3 === 2) { p.style.background = '#4d7cff'; p.style.boxShadow = '0 0 6px rgba(77,124,255,0.5)'; }
            c.appendChild(p);
        }
    }

    /* =========================================
       CARD GLOW
       ========================================= */
    function initCardGlow() {
        document.querySelectorAll('.menu-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect(), glow = card.querySelector('.menu-card-glow');
                if (glow) {
                    glow.style.background = 'radial-gradient(circle at ' + (e.clientX - r.left) + 'px ' + (e.clientY - r.top) + 'px, rgba(0,229,255,0.06), transparent 60%)';
                    glow.style.opacity = '1';
                }
            });
            card.addEventListener('mouseleave', function () {
                var glow = card.querySelector('.menu-card-glow');
                if (glow) glow.style.opacity = '0';
            });
        });
    }

    /* =========================================
       SMOOTH SCROLL (native)
       ========================================= */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#' || id.length <= 1) return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
            });
        });
    }

    /* =========================================
       HYPNOTIC SCROLL EFFECTS
       ========================================= */
    function initHypnoticScroll() {
        if (S.mobile) return;

        // Parallax sections on scroll
        var sections = document.querySelectorAll('.page-section');
        if (sections.length === 0) return;

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var vh = window.innerHeight;

            sections.forEach(function (section) {
                var rect = section.getBoundingClientRect();
                var progress = 1 - (rect.top / vh);
                progress = Math.max(0, Math.min(1, progress));
                section.style.setProperty('--scroll-progress', progress.toFixed(3));
            });
        }, { passive: true });
    }

    /* =========================================
       MAIN ANIMATION LOOP
       ========================================= */
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        S.tx = lerp(S.tx, S.mx, CFG.LERP);
        S.ty = lerp(S.ty, S.my, CFG.LERP);

        if (cursorLight) {
            cursorLight.style.transform = 'translate3d(' + (S.tx - CFG.CURSOR_SIZE / 2).toFixed(0) + 'px,' +
                (S.ty - CFG.CURSOR_SIZE / 2).toFixed(0) + 'px,0)';
        }

        updateMagnetics();
        updateParallax();

        requestAnimationFrame(animate);
    }

    /* =========================================
       EVENTS
       ========================================= */
    document.addEventListener('mousemove', function (e) { S.mx = e.clientX; S.my = e.clientY; resetIdle(); });
    document.addEventListener('touchmove', function (e) {
        if (e.touches.length) { S.mx = e.touches[0].clientX; S.my = e.touches[0].clientY; }
        resetIdle();
    }, { passive: true });
    window.addEventListener('resize', function () { S.mobile = window.matchMedia('(max-width: 768px)').matches; });
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('click', resetIdle);

    /* =========================================
       INIT
       ========================================= */
    initConstellationHub();
    initRadialMenu();
    initConstellationReturn();
    initMagnetics();
    initTilt();
    initNavDock();
    initParallax();
    initReveals();
    initMenuOverlay();
    initSmoothScroll();
    initParticles();
    initCardGlow();
    initHypnoticScroll();
    resetIdle();

    if (!S.mobile) animate();

})();
