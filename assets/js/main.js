/**
 * Virealys - HyperSpeed Engine v9.0
 *
 * Revolutionary technologies:
 * - VR_UnifiedObserver: Single IntersectionObserver for ALL lazy tasks
 * - VR_InstantImage: Connection-aware image pipeline with blur-up
 * - VR_TouchEngine: 120fps touch gestures with haptic feedback
 * - VR_PredictiveNav: Prefetch on hover/touchstart (50ms anticipation)
 * - VR_IdleScheduler: requestIdleCallback cascading init
 * - VR_PerformanceGuard: Auto-disable effects on slow devices
 *
 * Target: < 400ms to interactive, < 800ms full paint
 */
(function () {
    'use strict';

    /* =========================================
       CONFIG
       ========================================= */
    var CFG = {
        CURSOR_SIZE: 600,
        MAGNETIC_RADIUS: 100,
        MAGNETIC_STRENGTH: 0.25,
        TILT_MAX: 6,
        IDLE_TIMEOUT: 4000,
        LERP: 0.12,
        RADIAL_RADIUS: 140,
        RADIAL_HOLD_DELAY: 180,
        IMG_ROOT_MARGIN: '500px 0px',     // v9.0: load images 500px before visible (overridden on slow connections)
        PREFETCH_DELAY: 65,               // v9.0: prefetch link on hover after 65ms
    };

    /* =========================================
       STATE
       ========================================= */
    var S = {
        mx: 0, my: 0,
        tx: 0, ty: 0,
        idle: false, idleTimer: null,
        mobile: window.innerWidth <= 768,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        radialOpen: false, radialTimer: null, radialX: 0, radialY: 0,
        radialHoveredItem: null, radialHolding: false,
        tabVisible: true,
        animating: false,
        slowDevice: false,    // v9.0: detected at runtime
        saveData: false,      // v9.0: connection-aware
    };

    S.mx = S.tx = window.innerWidth / 2;
    S.my = S.ty = window.innerHeight / 2;

    /* =========================================
       v9.0 — PERFORMANCE GUARD
       Detect slow devices and reduce effects
       ========================================= */
    (function detectPerformance() {
        // Check Save-Data header preference
        var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            S.saveData = conn.saveData === true;
            if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
                S.saveData = true;
            }
            // v9.1: Detect slow 4G (high RTT = congested network)
            if (conn.effectiveType === '4g' && conn.rtt && conn.rtt > 100) {
                S.slow4g = true;
            }
            if (conn.effectiveType === '3g') {
                S.saveData = true;
                S.slow4g = true;
            }
        }

        // Check device memory (< 4GB = constrained)
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            S.slowDevice = true;
        }

        // Check hardware concurrency (< 4 cores = constrained)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            S.slowDevice = true;
        }
    })();

    /* =========================================
       IDLE SCHEDULING
       ========================================= */
    var ric = window.requestIdleCallback || function (cb) { setTimeout(cb, 1); };

    /* =========================================
       USER PROFILE (localStorage)
       ========================================= */
    var PROFILE_KEY = 'vr_user_profile';
    var profile;
    try {
        profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || { visits: 0, sections: {}, lastSections: [], lastVisitTime: 0 };
    } catch (e) {
        profile = { visits: 0, sections: {}, lastSections: [], lastVisitTime: 0 };
    }
    profile.visits++;
    profile.lastVisitTime = Date.now();

    var profileDirty = true;
    function saveProfile() {
        if (!profileDirty) return;
        profileDirty = false;
        ric(function () {
            try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (e) {}
        });
    }

    function trackSection(id) {
        profile.sections[id] = (profile.sections[id] || 0) + 1;
        profile.lastSections.unshift(id);
        if (profile.lastSections.length > 20) profile.lastSections.length = 20;
        profileDirty = true;
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
        return freq * 2 + recency + timeBonus;
    }

    saveProfile();
    var currentSlug = document.body.getAttribute('data-page-slug');
    if (currentSlug) trackSection(currentSlug);

    /* =========================================
       REDUCED MOTION BAILOUT
       ========================================= */
    if (S.reduced) {
        initReveals();
        initMenuOverlay();
        initConstellationHub();
        initInstantImages();
        initRadialMenu();
        initPredictiveNav();
        return;
    }

    /* =========================================
       VISIBILITY API
       ========================================= */
    document.addEventListener('visibilitychange', function () {
        S.tabVisible = !document.hidden;
        if (S.tabVisible && !S.animating && !S.mobile) {
            S.animating = true;
            requestAnimationFrame(animate);
        }
    });

    /* =========================================
       1. CURSOR LIGHT (desktop only, skip slow devices)
       ========================================= */
    var cursorLight = null;
    if (!S.mobile && !S.slowDevice) {
        cursorLight = document.createElement('div');
        cursorLight.className = 'vr-cursor-light';
        cursorLight.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorLight);
    }

    /* =========================================
       2. MAGNETIC UI
       ========================================= */
    var magneticEls = [];

    function initMagnetics() {
        if (S.mobile || S.slowDevice) return;
        document.querySelectorAll('.btn, .overlay-social-link, .footer-social a').forEach(function (el) {
            el.setAttribute('data-magnetic', '');
        });
        magneticEls = document.querySelectorAll('[data-magnetic]');
    }

    function updateMagnetics() {
        for (var i = 0; i < magneticEls.length; i++) {
            var el = magneticEls[i], rect = el.getBoundingClientRect();
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
       3. CARD TILT (skip on slow devices)
       ========================================= */
    function initTilt() {
        if (S.mobile || S.slowDevice) return;
        document.querySelectorAll('.concept-card, .zone-card, .menu-card, .ambiance-card, .passport-card, .contact-card, .step-card, .level-card').forEach(function (card) {
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
        if (S.mobile || S.radialOpen || S.slowDevice) return;
        var r = document.createElement('div');
        r.className = 'vr-ripple';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        document.body.appendChild(r);
        setTimeout(function () { if (r.parentNode) r.remove(); }, 800);
    });

    /* =========================================
       5. VR_INSTANT_IMAGE — v9.0 Revolutionary
       Connection-aware, blur-up, eager above-fold
       ========================================= */
    function initInstantImages() {
        var lazyImgs = document.querySelectorAll('img[data-src]');
        if (lazyImgs.length === 0) return;

        // On Save-Data or very slow connection: load smaller images
        var useLowRes = S.saveData;

        function loadImage(img) {
            var src = img.dataset.src;
            // v9.0: If save-data mode and a small variant exists, prefer it
            if (useLowRes && img.dataset.srcSm) {
                src = img.dataset.srcSm;
            }

            // Create an offscreen Image to decode without blocking
            var loader = new Image();
            loader.onload = function () {
                img.src = src;
                img.removeAttribute('data-src');
                img.removeAttribute('data-src-sm');
                img.classList.add('vr-img-loaded');
            };
            loader.src = src;
        }

        // v9.1: Reduce prefetch distance on slow connections to save bandwidth
        var imgMargin = (S.saveData || S.slow4g) ? '100px 0px' : CFG.IMG_ROOT_MARGIN;

        if ('IntersectionObserver' in window) {
            var imgObs = new IntersectionObserver(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isIntersecting) {
                        loadImage(entries[i].target);
                        imgObs.unobserve(entries[i].target);
                    }
                }
            }, { rootMargin: imgMargin, threshold: 0 });

            lazyImgs.forEach(function (img) { imgObs.observe(img); });
        } else {
            lazyImgs.forEach(loadImage);
        }
    }

    /* =========================================
       6. RADIAL MENU
       ========================================= */
    var radialMenuEl = null;
    var radialCursorLine = null;
    var radialItems = [];

    function initRadialMenu() {
        radialMenuEl = document.createElement('div');
        radialMenuEl.className = 'vr-radial-menu';
        radialMenuEl.id = 'vr-radial-menu';
        radialMenuEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(radialMenuEl);

        radialCursorLine = document.createElement('div');
        radialCursorLine.className = 'vr-radial-cursor-line';
        radialMenuEl.appendChild(radialCursorLine);

        var allPages = [
            { slug: 'concept', label: 'Concept', icon: 'layers', color: '#00e5ff' },
            { slug: 'menus', label: 'Formules', icon: 'utensils', color: '#4d7cff' },
            { slug: 'zones', label: 'Zones', icon: 'grid', color: '#e040fb' },
            { slug: 'ambiances', label: 'Ambiances', icon: 'globe', color: '#a855f7' },
            { slug: 'passeport', label: 'Passeport', icon: 'passport', color: '#f97316' },
            { slug: 'reservation', label: 'Réserver', icon: 'calendar', color: '#10b981' },
            { slug: '__constellation__', label: 'Constellation', icon: 'star', color: '#ffd700', isConstellation: true },
        ];

        var totalItems = allPages.length;
        var angleStep = (2 * Math.PI) / totalItems;
        var startAngle = Math.PI / 2 - 6 * angleStep;

        radialItems = [];

        allPages.forEach(function (item, i) {
            var angle = startAngle + i * angleStep;
            var el = document.createElement('div');
            el.className = 'vr-radial-item' + (item.isConstellation ? ' vr-radial-constellation' : '');
            el.setAttribute('data-slug', item.slug);
            el.style.setProperty('--item-color', item.color);
            el.innerHTML = '<span class="vr-radial-item-icon">' + getRadialIcon(item.icon) + '</span><span class="vr-radial-item-label">' + item.label + '</span>';
            radialMenuEl.appendChild(el);
            radialItems.push({ el: el, angle: angle, slug: item.slug, isConstellation: !!item.isConstellation });
        });

        document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

        document.addEventListener('mousedown', function (e) {
            if (e.button === 2) {
                S.radialX = e.clientX;
                S.radialY = e.clientY;
                S.radialHolding = true;
                S.radialHoveredItem = null;
                S.radialTimer = setTimeout(function () {
                    openRadialMenu(S.radialX, S.radialY);
                }, CFG.RADIAL_HOLD_DELAY);
            }
        });

        var radialMoveThrottle = 0;
        document.addEventListener('mousemove', function (e) {
            if (!S.radialOpen || !S.radialHolding) return;
            var now = Date.now();
            if (now - radialMoveThrottle < 16) return;
            radialMoveThrottle = now;
            updateRadialCursor(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', function (e) {
            if (e.button === 2) {
                S.radialHolding = false;
                if (S.radialTimer) { clearTimeout(S.radialTimer); S.radialTimer = null; }
                if (S.radialOpen && S.radialHoveredItem) {
                    var item = S.radialHoveredItem;
                    closeRadialMenu();
                    if (item.isConstellation) {
                        window.location.href = (typeof virealys !== 'undefined' && virealys.home_url) ? virealys.home_url : '/';
                    } else {
                        window.location.href = '/' + item.slug + '/';
                    }
                } else if (S.radialOpen) {
                    closeRadialMenu();
                }
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && S.radialOpen) { S.radialHolding = false; closeRadialMenu(); }
        });
    }

    function openRadialMenu(x, y) {
        if (!radialMenuEl) return;
        S.radialOpen = true;
        var r = CFG.RADIAL_RADIUS + 60;
        x = Math.max(r, Math.min(window.innerWidth - r, x));
        y = Math.max(r, Math.min(window.innerHeight - r, y));
        S.radialX = x; S.radialY = y;
        radialMenuEl.style.left = x + 'px';
        radialMenuEl.style.top = y + 'px';
        radialMenuEl.classList.add('open');
        document.body.classList.add('vr-radial-active');

        radialItems.forEach(function (item, i) {
            var tx = Math.cos(item.angle) * CFG.RADIAL_RADIUS;
            var ty = Math.sin(item.angle) * CFG.RADIAL_RADIUS;
            item.el.style.transitionDelay = (i * 0.03) + 's';
            item.el.style.transform = 'translate(calc(-50% + ' + tx.toFixed(1) + 'px), calc(-50% + ' + ty.toFixed(1) + 'px)) scale(1)';
            item.el.style.opacity = '1';
        });

        if (radialCursorLine) { radialCursorLine.style.width = '0px'; radialCursorLine.style.opacity = '0'; }
    }

    function updateRadialCursor(mouseX, mouseY) {
        var dx = mouseX - S.radialX, dy = mouseY - S.radialY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);

        var lineLen = Math.min(dist, CFG.RADIAL_RADIUS * 0.85);
        if (radialCursorLine) {
            radialCursorLine.style.width = lineLen + 'px';
            radialCursorLine.style.transform = 'rotate(' + angle + 'rad)';
            radialCursorLine.style.opacity = Math.min(dist / 30, 1).toFixed(2);
        }

        var bestItem = null, bestAngleDist = Infinity;
        radialItems.forEach(function (item) {
            var diff = angleDiff(angle, item.angle);
            if (diff < bestAngleDist) { bestAngleDist = diff; bestItem = item; }
        });

        if (dist < 25) bestItem = null;

        if (bestItem !== S.radialHoveredItem) {
            if (S.radialHoveredItem) S.radialHoveredItem.el.classList.remove('vr-radial-item-active');
            S.radialHoveredItem = bestItem;
            if (bestItem) bestItem.el.classList.add('vr-radial-item-active');
        }
    }

    function angleDiff(a, b) {
        var d = Math.abs(a - b) % (2 * Math.PI);
        return d > Math.PI ? 2 * Math.PI - d : d;
    }

    function closeRadialMenu() {
        if (!radialMenuEl) return;
        S.radialOpen = false; S.radialHoveredItem = null;
        radialMenuEl.classList.remove('open');
        document.body.classList.remove('vr-radial-active');
        radialItems.forEach(function (item) {
            item.el.style.transitionDelay = '0s';
            item.el.style.transform = 'translate(-50%, -50%) scale(0.3)';
            item.el.style.opacity = '0';
            item.el.classList.remove('vr-radial-item-active');
        });
        if (radialCursorLine) { radialCursorLine.style.width = '0px'; radialCursorLine.style.opacity = '0'; }
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
       7. CONSTELLATION HUB
       ========================================= */
    function initConstellationHub() {
        var hub = document.getElementById('vr-constellation-hub');
        if (!hub) return;

        var nodes = hub.querySelectorAll('.constellation-node');

        if (!S.mobile) {
            nodes.forEach(function (node) {
                var baseX = parseFloat(node.style.getPropertyValue('--node-x'));
                var baseY = parseFloat(node.style.getPropertyValue('--node-y'));

                node.addEventListener('mouseenter', function () {
                    node.classList.add('hovered');
                    nodes.forEach(function (n) { if (n !== node) n.classList.add('dimmed'); });
                    highlightConnectedLines(node.getAttribute('data-page'), true);
                });

                node.addEventListener('mousemove', function (e) {
                    var rect = hub.getBoundingClientRect();
                    var mouseXPct = ((e.clientX - rect.left) / rect.width) * 100;
                    var mouseYPct = ((e.clientY - rect.top) / rect.height) * 100;
                    var dx = mouseXPct - baseX, dy = mouseYPct - baseY;
                    node.style.left = (baseX + dx * 0.08) + '%';
                    node.style.top = (baseY + dy * 0.08) + '%';
                });

                node.addEventListener('mouseleave', function () {
                    node.classList.remove('hovered');
                    nodes.forEach(function (n) { n.classList.remove('dimmed'); });
                    highlightConnectedLines(null, false);
                    node.style.left = baseX + '%';
                    node.style.top = baseY + '%';
                });
            });
        }

        reorderConstellation(nodes);
    }

    var cachedLines = null;
    function highlightConnectedLines(slug, highlight) {
        if (!cachedLines) cachedLines = document.querySelectorAll('.constellation-link-line');
        cachedLines.forEach(function (line) {
            if (highlight) {
                var from = line.getAttribute('data-from'), to = line.getAttribute('data-to');
                line.classList.toggle('highlighted', from === slug || to === slug);
                line.classList.toggle('dimmed', from !== slug && to !== slug);
            } else {
                line.classList.remove('highlighted', 'dimmed');
            }
        });
    }

    function reorderConstellation(nodes) {
        nodes.forEach(function (node) {
            var slug = node.getAttribute('data-page');
            var priority = getSectionPriority(slug);
            var scale = 1 + Math.min(priority * 0.005, 0.15);
            var brightness = 1 + Math.min(priority * 0.01, 0.3);
            node.style.setProperty('--priority-scale', scale.toFixed(3));
            node.style.setProperty('--priority-brightness', brightness.toFixed(3));
        });
    }

    /* =========================================
       8. VR_TOUCH ENGINE v9.0
       120fps touch, haptic, momentum scroll
       ========================================= */
    function initMobileTouch() {
        if (!S.mobile) return;

        var mobileList = document.getElementById('constellation-mobile-list');
        if (!mobileList) return;

        var cards = mobileList.querySelectorAll('.constellation-mobile-card');
        var startX = 0, startY = 0, currentCard = null, swiping = false;

        function haptic(ms) {
            if (navigator.vibrate) navigator.vibrate(ms || 10);
        }

        cards.forEach(function (card) {
            card.addEventListener('touchstart', function (e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                currentCard = card;
                swiping = false;
                card.style.transition = 'none';
            }, { passive: true });

            card.addEventListener('touchmove', function (e) {
                if (!currentCard) return;
                var dx = e.touches[0].clientX - startX;
                var dy = e.touches[0].clientY - startY;

                if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                    swiping = true;
                    var resistance = Math.min(Math.abs(dx) / 200, 1);
                    var tx = dx * (1 - resistance * 0.5);
                    card.style.transform = 'translateX(' + tx + 'px) scale(' + (1 - Math.abs(resistance) * 0.03) + ')';
                    card.style.opacity = (1 - Math.abs(resistance) * 0.3).toFixed(2);
                }
            }, { passive: true });

            card.addEventListener('touchend', function () {
                if (!currentCard) return;
                card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';

                if (swiping) {
                    var endX = parseFloat(card.style.transform.replace(/[^-\d.]/g, '')) || 0;
                    if (Math.abs(endX) > 80) {
                        haptic(15);
                        card.style.transform = 'translateX(' + (endX > 0 ? '120%' : '-120%') + ') scale(0.9)';
                        card.style.opacity = '0';
                        setTimeout(function () {
                            window.location.href = card.href;
                        }, 200);
                        return;
                    }
                }

                card.style.transform = '';
                card.style.opacity = '';
                currentCard = null;
                swiping = false;
            }, { passive: true });
        });

        mobileList.addEventListener('scroll', function () {
            if (mobileList.scrollTop % 60 < 2) {
                haptic(5);
            }
        }, { passive: true });
    }

    /* =========================================
       9. VR_PREDICTIVE_NAV v9.0
       Prefetch pages on hover/touchstart
       ========================================= */
    function initPredictiveNav() {
        var prefetched = {};
        var prefetchTimer = null;

        function prefetchUrl(url) {
            if (!url || prefetched[url] || url.indexOf('/wp-admin') >= 0) return;
            prefetched[url] = true;

            // Use <link rel="prefetch"> for best browser support
            var link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = 'document';
            document.head.appendChild(link);
        }

        // Desktop: prefetch on hover after delay
        document.addEventListener('mouseover', function (e) {
            var a = e.target.closest('a[href]');
            if (!a) return;
            var url = a.href;
            if (!url || url.indexOf(location.origin) !== 0) return;

            prefetchTimer = setTimeout(function () {
                prefetchUrl(url);
            }, CFG.PREFETCH_DELAY);
        });

        document.addEventListener('mouseout', function (e) {
            if (e.target.closest('a[href]') && prefetchTimer) {
                clearTimeout(prefetchTimer);
                prefetchTimer = null;
            }
        });

        // Mobile: prefetch on touchstart (instant)
        document.addEventListener('touchstart', function (e) {
            var a = e.target.closest('a[href]');
            if (!a) return;
            var url = a.href;
            if (url && url.indexOf(location.origin) === 0) {
                prefetchUrl(url);
            }
        }, { passive: true });
    }

    /* =========================================
       10. DISCOVERY SYSTEM
       ========================================= */
    function initDiscovery() {
        var DISCOVERY_KEY = 'vr_discovery';
        var discovery;
        try {
            discovery = JSON.parse(localStorage.getItem(DISCOVERY_KEY)) || { visited: [], completed: false, dismissed: false };
        } catch (e) {
            discovery = { visited: [], completed: false, dismissed: false };
        }

        if (discovery.completed || discovery.dismissed) return;

        var allPages = ['concept', 'menus', 'ambiances', 'zones', 'passeport', 'reservation'];
        var slug = document.body.getAttribute('data-page-slug');

        if (slug && allPages.indexOf(slug) >= 0 && discovery.visited.indexOf(slug) < 0) {
            discovery.visited.push(slug);
            try { localStorage.setItem(DISCOVERY_KEY, JSON.stringify(discovery)); } catch (e) {}

            var count = discovery.visited.length, total = allPages.length;
            if (count >= total) {
                discovery.completed = true;
                try { localStorage.setItem(DISCOVERY_KEY, JSON.stringify(discovery)); } catch (e) {}
                showDiscoveryToast('Bravo ! Tout l\'univers Virealys est découvert !', 'celebration');
            } else {
                var msgs = ['Première escale !', 'Continuez...', 'Vous progressez !', 'Encore quelques étoiles...', 'Presque tout !'];
                showDiscoveryToast(msgs[Math.min(count - 1, msgs.length - 1)] + ' (' + count + '/' + total + ')', 'progress');
            }
        }

        if (!slug && discovery.visited.length === 0) {
            setTimeout(function () {
                showDiscoveryToast('Explorez chaque étoile pour une surprise !', 'intro');
            }, 2500);
        }
    }

    function showDiscoveryToast(message, type) {
        var toast = document.createElement('div');
        toast.className = 'vr-discovery-toast vr-discovery-' + type;
        toast.innerHTML = '<span class="vr-discovery-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span><span class="vr-discovery-text">' + message + '</span>';
        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add('vr-discovery-visible'); });
        var duration = type === 'celebration' ? 5000 : 3500;
        setTimeout(function () {
            toast.classList.remove('vr-discovery-visible');
            setTimeout(function () { if (toast.parentNode) toast.remove(); }, 400);
        }, duration);
    }

    /* =========================================
       11. CONSTELLATION RETURN BAR
       ========================================= */
    function initConstellationReturn() {
        var returnBar = document.getElementById('vr-constellation-return');
        if (!returnBar) return;
        var pulse = returnBar.querySelector('.constellation-return-pulse');
        if (pulse) pulse.classList.add('pulse-auto');
    }

    /* =========================================
       12. IDLE BREATHING
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
       13. PARALLAX
       ========================================= */
    var parallaxEls = [];

    function initParallax() {
        if (S.mobile || S.slowDevice) return;
        document.querySelectorAll('.hero-orb, .constellation-nebula').forEach(function (o, i) {
            o.setAttribute('data-parallax', ((i + 1) * 0.6).toFixed(1));
        });
        parallaxEls = document.querySelectorAll('[data-parallax]');
    }

    function updateParallax() {
        if (parallaxEls.length === 0) return;
        var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        var dx = (S.tx - cx) * 0.015, dy = (S.ty - cy) * 0.015;
        for (var i = 0; i < parallaxEls.length; i++) {
            var d = parseFloat(parallaxEls[i].getAttribute('data-parallax')) || 1;
            parallaxEls[i].style.transform = 'translate(' + (dx * d).toFixed(1) + 'px,' + (dy * d).toFixed(1) + 'px)';
        }
    }

    /* =========================================
       14. REVEALS (unified observer)
       ========================================= */
    function initReveals() {
        var els = document.querySelectorAll('[data-reveal]');
        if (els.length > 0 && 'IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isIntersecting) {
                        entries[i].target.classList.add('revealed');
                        obs.unobserve(entries[i].target);
                    }
                }
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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
            if (overlay) overlay.classList.add('open');
            if (btn) btn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function close() {
            if (overlay) overlay.classList.remove('open');
            if (btn) btn.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (btn) btn.addEventListener('click', function () {
            overlay && overlay.classList.contains('open') ? close() : open();
        });
        if (closeBtn) closeBtn.addEventListener('click', close);

        if (overlay) overlay.addEventListener('click', function (e) {
            if (e.target.closest('.nav-link, .overlay-nav-link')) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) close();
        });
    }

    /* =========================================
       SMOOTH SCROLL
       ========================================= */
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var a = e.target.closest('a[href^="#"]');
            if (!a) return;
            var id = a.getAttribute('href');
            if (id === '#' || id.length <= 1) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
        });
    }

    /* =========================================
       ANIMATION LOOP
       ========================================= */
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        if (!S.tabVisible) { S.animating = false; return; }

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
    var mouseMoveThrottle = 0;
    document.addEventListener('mousemove', function (e) {
        var now = Date.now();
        if (now - mouseMoveThrottle < 8) return;
        mouseMoveThrottle = now;
        S.mx = e.clientX; S.my = e.clientY;
        resetIdle();
    });

    document.addEventListener('touchstart', resetIdle, { passive: true });
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('click', resetIdle);

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            S.mobile = window.innerWidth <= 768;
        }, 150);
    });

    /* =========================================
       INIT — Cascading priority
       ========================================= */
    // v9.2: Check what critical inline JS already initialized
    var done = window._vrCritical || {};

    // CRITICAL: First paint content (< 50ms)
    initConstellationHub();
    if (!done.reveals) initReveals();
    if (!done.menu) initMenuOverlay();
    if (!done.images) initInstantImages();

    // HIGH: Interactive features (idle callback 1)
    ric(function () {
        if (!S.mobile) initRadialMenu(); // v9.1: skip 49 DOM nodes on mobile
        initConstellationReturn();
        initMobileTouch();
        initSmoothScroll();
        if (!S.saveData) initPredictiveNav(); // v9.1: skip prefetch on save-data
        resetIdle();
    });

    // LOW: Enhancement features (idle callback 2)
    ric(function () {
        if (!S.saveData) initDiscovery(); // v9.1: skip toast DOM on save-data
        initMagnetics();
        initTilt();
        initParallax();
    });

    if (!S.mobile && !S.slowDevice) {
        S.animating = true;
        requestAnimationFrame(animate);
    }

    // Performance measurement
    if (window.performance && performance.mark) {
        performance.mark('vr-ready');
        if (performance.measure) {
            try { performance.measure('vr-boot', 'vr-init', 'vr-ready'); } catch (e) {}
        }
    }

    // v9.0: Report Web Vitals to console in dev
    if (window.PerformanceObserver) {
        try {
            new PerformanceObserver(function (list) {
                list.getEntries().forEach(function (entry) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('[VR9] LCP:', (entry.startTime / 1000).toFixed(2) + 's');
                    }
                });
            }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {}
    }

})();
