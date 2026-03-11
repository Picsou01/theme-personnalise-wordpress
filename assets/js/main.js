/**
 * Virealys - Revolutionary Adaptive Engine v4.0
 * A site that adapts to the user. Spatial navigation, predictive dock,
 * cursor light, magnetic UI, 3D tilt, click ripples, idle breathing.
 */
(function () {
    'use strict';

    var CFG = {
        CURSOR_SIZE: 600,
        MAGNETIC_RADIUS: 100,
        MAGNETIC_STRENGTH: 0.25,
        TILT_MAX: 6,
        IDLE_TIMEOUT: 4000,
        LERP: 0.12,
        PANEL_TRANSITION: 800,
        DOCK_REORDER_INTERVAL: 5000,
    };

    var S = {
        mx: window.innerWidth / 2, my: window.innerHeight / 2,
        tx: window.innerWidth / 2, ty: window.innerHeight / 2,
        scrollVelocity: 0,
        idle: false, idleTimer: null,
        mobile: window.matchMedia('(max-width: 768px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        // Spatial
        currentPanel: 0, panels: [], transitioning: false, spatialActive: false,
        // Dock
        dockHidden: false, lastScrollY: window.scrollY, scrollDelta: 0,
    };

    // ========== USER PROFILE (localStorage) ==========
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
        if (profile.lastSections.length > 20) profile.lastSections.length = 20;
        saveProfile();
    }

    function getSectionPriority(id) {
        var freq = profile.sections[id] || 0;
        var recIdx = profile.lastSections.indexOf(id);
        var recency = recIdx >= 0 ? (15 - recIdx) : 0;
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

    // Early bailout for reduced motion
    if (S.reduced) {
        initReveals(); initNavDock(); initMenuOverlay(); initSmoothScroll();
        initSpatialCanvas(); return;
    }

    // ========== 1. CURSOR LIGHT ==========
    var cursorLight = null;
    if (!S.mobile) {
        cursorLight = document.createElement('div');
        cursorLight.className = 'vr-cursor-light';
        cursorLight.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorLight);
    }

    // ========== 2. MAGNETIC UI ==========
    function initMagnetics() {
        if (S.mobile) return;
        document.querySelectorAll(
            '.btn, .vr-dock-btn, .overlay-social-link, .footer-social a, .ambiance-card-cta'
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

    // ========== 3. CARD TILT ==========
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

    // ========== 4. CLICK RIPPLE ==========
    document.addEventListener('click', function (e) {
        if (S.mobile) return;
        var r = document.createElement('div');
        r.className = 'vr-ripple';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        document.body.appendChild(r);
        setTimeout(function () { if (r.parentNode) r.remove(); }, 800);
    });

    // ========== 5. SPATIAL CANVAS (Front Page) ==========
    function initSpatialCanvas() {
        var spatial = document.getElementById('vr-spatial');
        if (!spatial) return;

        S.spatialActive = true;
        S.panels = Array.from(spatial.querySelectorAll('.vr-panel'));
        if (S.panels.length === 0) return;

        // Lock body scroll on front page
        document.body.classList.add('vr-spatial-active');

        // Build panel nav dots
        var panelNav = document.getElementById('vr-panel-nav');
        if (panelNav) {
            S.panels.forEach(function (p, i) {
                var dot = document.createElement('button');
                dot.className = 'vr-panel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('data-panel-idx', i);
                dot.setAttribute('aria-label', p.getAttribute('data-panel') || ('Section ' + (i + 1)));
                dot.addEventListener('click', function () { goToPanel(i); });
                panelNav.appendChild(dot);
            });
        }

        // Panel goto buttons
        document.querySelectorAll('.vr-panel-goto').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var idx = parseInt(this.getAttribute('data-goto'));
                if (!isNaN(idx)) goToPanel(idx);
            });
        });

        // Wheel navigation (within panel scroll or between panels)
        spatial.addEventListener('wheel', function (e) {
            var panel = S.panels[S.currentPanel];
            var scroller = panel.querySelector('.vr-panel-scroll');

            if (scroller) {
                var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 5;
                var atTop = scroller.scrollTop <= 5;

                if (e.deltaY > 0 && atBottom) { e.preventDefault(); goToPanel(S.currentPanel + 1); }
                else if (e.deltaY < 0 && atTop) { e.preventDefault(); goToPanel(S.currentPanel - 1); }
                // Otherwise let normal scroll happen inside panel
            } else {
                e.preventDefault();
                if (e.deltaY > 0) goToPanel(S.currentPanel + 1);
                else goToPanel(S.currentPanel - 1);
            }
        }, { passive: false });

        // Touch support
        var touchY = 0;
        spatial.addEventListener('touchstart', function (e) { touchY = e.touches[0].clientY; }, { passive: true });
        spatial.addEventListener('touchend', function (e) {
            var dy = touchY - e.changedTouches[0].clientY;
            if (Math.abs(dy) > 60) goToPanel(S.currentPanel + (dy > 0 ? 1 : -1));
        });

        // Keyboard
        document.addEventListener('keydown', function (e) {
            if (!S.spatialActive) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goToPanel(S.currentPanel + 1); }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goToPanel(S.currentPanel - 1); }
        });

        // Edge indicators
        updateEdges();
    }

    function goToPanel(idx) {
        if (idx < 0 || idx >= S.panels.length || idx === S.currentPanel || S.transitioning) return;
        S.transitioning = true;

        var dir = idx > S.currentPanel ? 1 : -1;
        var current = S.panels[S.currentPanel];
        var next = S.panels[idx];

        // Exit current
        current.classList.remove('vr-panel-active');
        current.classList.add(dir > 0 ? 'vr-panel-exit-up' : 'vr-panel-exit-down');

        // Enter next
        next.classList.add(dir > 0 ? 'vr-panel-enter-below' : 'vr-panel-enter-above');
        // Force reflow
        void next.offsetHeight;
        next.classList.add('vr-panel-active');
        next.classList.remove('vr-panel-enter-below', 'vr-panel-enter-above');

        // Track section
        var sectionId = next.getAttribute('data-panel');
        if (sectionId) trackSection(sectionId);

        // Trigger reveals in new panel
        next.querySelectorAll('[data-reveal]:not(.revealed)').forEach(function (el) {
            el.classList.add('revealed');
        });

        // Section color morph
        var color = next.getAttribute('data-section-color');
        if (color) document.documentElement.style.setProperty('--section-accent', color);

        setTimeout(function () {
            current.classList.remove('vr-panel-exit-up', 'vr-panel-exit-down');
            S.currentPanel = idx;
            S.transitioning = false;
            updatePanelDots();
            updateEdges();
            updateDockFromPanel();
        }, CFG.PANEL_TRANSITION);
    }

    function updatePanelDots() {
        document.querySelectorAll('.vr-panel-dot').forEach(function (dot, i) {
            dot.classList.toggle('active', i === S.currentPanel);
        });
    }

    function updateEdges() {
        var top = document.getElementById('vr-edge-top');
        var bottom = document.getElementById('vr-edge-bottom');
        if (top) top.classList.toggle('visible', S.currentPanel > 0);
        if (bottom) bottom.classList.toggle('visible', S.currentPanel < S.panels.length - 1);
    }

    // ========== 6. PREDICTIVE DOCK ==========
    var dock = document.getElementById('vr-dock');
    var dockTrack = document.getElementById('vr-dock-track');
    var dockProgress = document.getElementById('vr-dock-progress');

    function initNavDock() {
        if (!dock) return;

        // Non-spatial pages: scroll-based dock
        if (!S.spatialActive) {
            window.addEventListener('scroll', onPageScroll, { passive: true });
        }

        // Initial reorder
        reorderDock();

        // Periodically reorder based on profile
        setInterval(reorderDock, CFG.DOCK_REORDER_INTERVAL);
    }

    function onPageScroll() {
        var y = window.scrollY;
        var diff = y - S.lastScrollY;

        // Progress
        if (dockProgress) {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            dockProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        }

        if (y < 100) { showDock(); S.lastScrollY = y; S.scrollDelta = 0; return; }

        if (diff > 0) {
            S.scrollDelta += diff;
            if (S.scrollDelta > 80 && !S.dockHidden) hideDock();
        } else {
            S.scrollDelta = 0;
            if (S.dockHidden) showDock();
        }
        S.lastScrollY = y;
        S.scrollVelocity = Math.abs(diff);
    }

    function hideDock() { if (dock) { dock.classList.add('dock-hidden'); S.dockHidden = true; } }
    function showDock() { if (dock) { dock.classList.remove('dock-hidden'); S.dockHidden = false; } }

    function updateDockFromPanel() {
        // Update progress on spatial navigation
        if (dockProgress && S.spatialActive && S.panels.length > 1) {
            var pct = (S.currentPanel / (S.panels.length - 1)) * 100;
            dockProgress.style.width = pct + '%';
        }

        // Highlight active dock button
        var panelId = S.panels[S.currentPanel] ? S.panels[S.currentPanel].getAttribute('data-panel') : '';
        document.querySelectorAll('.vr-dock-btn[data-section]').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-section') === panelId);
        });
    }

    // ========== 7. PREDICTIVE REORDERING ==========
    function reorderDock() {
        if (!dockTrack) return;
        var buttons = Array.from(dockTrack.querySelectorAll('.vr-dock-btn[data-section]'));
        if (buttons.length === 0) return;

        // Calculate priorities
        var prioritized = buttons.map(function (btn) {
            var id = btn.getAttribute('data-section');
            return { btn: btn, id: id, priority: getSectionPriority(id) };
        });

        // Sort by priority descending
        prioritized.sort(function (a, b) { return b.priority - a.priority; });

        // Apply order via CSS (smooth reorder)
        prioritized.forEach(function (item, i) {
            item.btn.style.order = i;
            // Highest priority gets a subtle glow
            item.btn.classList.toggle('vr-dock-btn-hot', i === 0 && item.priority > 5);
        });
    }

    // Dock buttons also navigate spatial panels
    if (dock) {
        dock.addEventListener('click', function (e) {
            var btn = e.target.closest('.vr-dock-btn[data-section]');
            if (!btn || !S.spatialActive) return;

            var targetId = btn.getAttribute('data-section');
            for (var i = 0; i < S.panels.length; i++) {
                if (S.panels[i].getAttribute('data-panel') === targetId) {
                    e.preventDefault();
                    goToPanel(i);
                    break;
                }
            }
        });
    }

    // ========== 8. IDLE BREATHING ==========
    function resetIdle() {
        if (S.idle) { S.idle = false; document.body.classList.remove('vr-idle'); }
        clearTimeout(S.idleTimer);
        S.idleTimer = setTimeout(function () {
            S.idle = true;
            document.body.classList.add('vr-idle');
        }, CFG.IDLE_TIMEOUT);
    }

    // ========== 9. PARALLAX ==========
    function initParallax() {
        if (S.mobile) return;
        document.querySelectorAll('.hero-orb').forEach(function (o, i) {
            o.setAttribute('data-parallax', ((i + 1) * 0.8).toFixed(1));
        });
        document.querySelectorAll('.hero-grid-bg').forEach(function (el) {
            el.setAttribute('data-parallax', '0.3');
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

    // ========== 10. REVEALS ==========
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

        // For spatial: reveal first panel immediately
        if (S.spatialActive && S.panels[0]) {
            S.panels[0].querySelectorAll('[data-reveal]').forEach(function (el) {
                el.classList.add('revealed');
            });
        }
    }

    // ========== MENU OVERLAY ==========
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

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#' || id === '#reservation') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
            });
        });
    }

    // ========== PARTICLES ==========
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

    // ========== CARD GLOW ==========
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

    // ========== MAIN LOOP ==========
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

        S.scrollVelocity *= 0.92;
        if (S.scrollVelocity < 0.1) S.scrollVelocity = 0;

        requestAnimationFrame(animate);
    }

    // ========== EVENTS ==========
    document.addEventListener('mousemove', function (e) { S.mx = e.clientX; S.my = e.clientY; resetIdle(); });
    document.addEventListener('touchmove', function (e) {
        if (e.touches.length) { S.mx = e.touches[0].clientX; S.my = e.touches[0].clientY; }
        resetIdle();
    }, { passive: true });
    window.addEventListener('resize', function () { S.mobile = window.matchMedia('(max-width: 768px)').matches; });
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('click', resetIdle);

    // ========== INIT ==========
    initSpatialCanvas();
    initMagnetics();
    initTilt();
    initNavDock();
    initParallax();
    initReveals();
    initMenuOverlay();
    initSmoothScroll();
    initParticles();
    initCardGlow();
    resetIdle();

    if (!S.mobile) animate();

})();
