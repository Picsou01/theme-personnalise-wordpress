/**
 * Virealys - Constellation Engine v6.2
 *
 * Right-click HOLD = radial menu with cursor selector, release = navigate
 * Mouse wheel = normal page scroll (smooth)
 * Constellation hub = bird's-eye page selection with image previews
 * No bottom dock — radial menu is the navigator
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
        RADIAL_RADIUS: 140,
        RADIAL_HOLD_DELAY: 180,
    };

    var S = {
        mx: window.innerWidth / 2, my: window.innerHeight / 2,
        tx: window.innerWidth / 2, ty: window.innerHeight / 2,
        idle: false, idleTimer: null,
        mobile: window.matchMedia('(max-width: 768px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        radialOpen: false, radialTimer: null, radialX: 0, radialY: 0,
        radialHoveredItem: null, radialHolding: false,
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

    function saveProfile() { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }

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
            '.btn, .overlay-social-link, .footer-social a'
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
       5. RADIAL MENU (right-click hold + selector)
       All 7 items equally spaced around the circle.
       A cursor line goes from center toward mouse.
       The nearest item gets highlighted.
       On release of right-click -> navigate to highlighted item.
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

        // Cursor line element (center -> mouse direction)
        radialCursorLine = document.createElement('div');
        radialCursorLine.className = 'vr-radial-cursor-line';
        radialMenuEl.appendChild(radialCursorLine);

        // All 7 items, equally spaced (360/7 ≈ 51.43° each)
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
        // Start angle: place constellation (last item, index 6) at bottom (π/2)
        // Item at index i gets angle: startAngle + i * angleStep
        // We want index 6 at π/2: startAngle + 6*step = π/2 => startAngle = π/2 - 6*step
        var startAngle = Math.PI / 2 - 6 * angleStep;

        radialItems = [];

        allPages.forEach(function (item, i) {
            var angle = startAngle + i * angleStep;

            var el = document.createElement('div');
            el.className = 'vr-radial-item' + (item.isConstellation ? ' vr-radial-constellation' : '');
            el.setAttribute('data-slug', item.slug);
            el.setAttribute('data-angle', angle.toFixed(4));
            el.setAttribute('data-index', i);
            el.style.setProperty('--item-color', item.color);

            el.innerHTML =
                '<span class="vr-radial-item-icon">' + getRadialIcon(item.icon) + '</span>' +
                '<span class="vr-radial-item-label">' + item.label + '</span>';

            radialMenuEl.appendChild(el);

            radialItems.push({
                el: el,
                angle: angle,
                slug: item.slug,
                isConstellation: !!item.isConstellation,
            });
        });

        // Prevent context menu
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

        // Right-click DOWN -> start hold timer
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

        // Mouse move while holding -> update cursor line + highlight nearest item
        document.addEventListener('mousemove', function (e) {
            if (!S.radialOpen || !S.radialHolding) return;
            updateRadialCursor(e.clientX, e.clientY);
        });

        // Right-click UP -> navigate to highlighted item
        document.addEventListener('mouseup', function (e) {
            if (e.button === 2) {
                S.radialHolding = false;
                if (S.radialTimer) {
                    clearTimeout(S.radialTimer);
                    S.radialTimer = null;
                }
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

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && S.radialOpen) {
                S.radialHolding = false;
                closeRadialMenu();
            }
        });
    }

    function openRadialMenu(x, y) {
        if (!radialMenuEl) return;
        S.radialOpen = true;

        var r = CFG.RADIAL_RADIUS + 60;
        x = Math.max(r, Math.min(window.innerWidth - r, x));
        y = Math.max(r, Math.min(window.innerHeight - r, y));
        S.radialX = x;
        S.radialY = y;

        radialMenuEl.style.left = x + 'px';
        radialMenuEl.style.top = y + 'px';
        radialMenuEl.classList.add('open');
        radialMenuEl.setAttribute('aria-hidden', 'false');
        document.body.classList.add('vr-radial-active');

        // Place items at equal angles — translate includes -50%,-50% centering
        radialItems.forEach(function (item, i) {
            var tx = Math.cos(item.angle) * CFG.RADIAL_RADIUS;
            var ty = Math.sin(item.angle) * CFG.RADIAL_RADIUS;
            item.el.style.transitionDelay = (i * 0.03) + 's';
            item.el.style.transform = 'translate(calc(-50% + ' + tx.toFixed(1) + 'px), calc(-50% + ' + ty.toFixed(1) + 'px)) scale(1)';
            item.el.style.opacity = '1';
        });

        // Reset cursor line
        if (radialCursorLine) {
            radialCursorLine.style.width = '0px';
            radialCursorLine.style.opacity = '0';
        }
    }

    function updateRadialCursor(mouseX, mouseY) {
        var dx = mouseX - S.radialX;
        var dy = mouseY - S.radialY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);

        // Draw cursor line from center toward mouse
        var lineLen = Math.min(dist, CFG.RADIAL_RADIUS * 0.85);
        if (radialCursorLine) {
            radialCursorLine.style.width = lineLen + 'px';
            radialCursorLine.style.transform = 'rotate(' + angle + 'rad)';
            radialCursorLine.style.opacity = Math.min(dist / 30, 1).toFixed(2);
        }

        // Find nearest item by angle distance
        var bestItem = null;
        var bestAngleDist = Infinity;

        radialItems.forEach(function (item) {
            var diff = angleDiff(angle, item.angle);
            if (diff < bestAngleDist) {
                bestAngleDist = diff;
                bestItem = item;
            }
        });

        // Only highlight if mouse moved enough from center
        if (dist < 25) bestItem = null;

        // Update highlighting
        if (bestItem !== S.radialHoveredItem) {
            if (S.radialHoveredItem) {
                S.radialHoveredItem.el.classList.remove('vr-radial-item-active');
            }
            S.radialHoveredItem = bestItem;
            if (bestItem) {
                bestItem.el.classList.add('vr-radial-item-active');
            }
        }
    }

    function angleDiff(a, b) {
        var d = Math.abs(a - b) % (2 * Math.PI);
        return d > Math.PI ? 2 * Math.PI - d : d;
    }

    function closeRadialMenu() {
        if (!radialMenuEl) return;
        S.radialOpen = false;
        S.radialHoveredItem = null;
        radialMenuEl.classList.remove('open');
        radialMenuEl.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('vr-radial-active');

        radialItems.forEach(function (item) {
            item.el.style.transitionDelay = '0s';
            item.el.style.transform = 'translate(-50%, -50%) scale(0.3)';
            item.el.style.opacity = '0';
            item.el.classList.remove('vr-radial-item-active');
        });

        if (radialCursorLine) {
            radialCursorLine.style.width = '0px';
            radialCursorLine.style.opacity = '0';
        }
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
       Nodes move TOWARD the mouse on hover.
       Image preview floats ABOVE each node.
       ========================================= */
    function initConstellationHub() {
        var hub = document.getElementById('vr-constellation-hub');
        if (!hub) return;

        // Generate floating stars — scattered randomly across the sky
        var starsContainer = document.getElementById('constellation-stars');
        if (starsContainer) {
            for (var i = 0; i < 100; i++) {
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

        var nodes = hub.querySelectorAll('.constellation-node');

        // Make nodes move TOWARD the mouse on hover
        nodes.forEach(function (node) {
            var baseX = parseFloat(node.style.getPropertyValue('--node-x'));
            var baseY = parseFloat(node.style.getPropertyValue('--node-y'));

            node.addEventListener('mouseenter', function () {
                node.classList.add('hovered');
                nodes.forEach(function (n) {
                    if (n !== node) n.classList.add('dimmed');
                });
                var slug = node.getAttribute('data-page');
                highlightConnectedLines(slug, true);
            });

            node.addEventListener('mousemove', function (e) {
                // Move node slightly toward mouse
                var rect = hub.getBoundingClientRect();
                var mouseXPct = ((e.clientX - rect.left) / rect.width) * 100;
                var mouseYPct = ((e.clientY - rect.top) / rect.height) * 100;
                var dx = mouseXPct - baseX;
                var dy = mouseYPct - baseY;
                // Move 8% toward mouse
                var newX = baseX + dx * 0.08;
                var newY = baseY + dy * 0.08;
                node.style.left = newX + '%';
                node.style.top = newY + '%';
            });

            node.addEventListener('mouseleave', function () {
                node.classList.remove('hovered');
                nodes.forEach(function (n) { n.classList.remove('dimmed'); });
                highlightConnectedLines(null, false);
                // Return to original position
                node.style.left = baseX + '%';
                node.style.top = baseY + '%';
            });
        });

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
       7. FIRST-VISIT DISCOVERY SYSTEM
       Encourages first-time visitors to explore all pages.
       Shows progress toast + completion celebration.
       Only active if user hasn't visited all pages yet.
       ========================================= */
    function initDiscovery() {
        var DISCOVERY_KEY = 'vr_discovery';
        var discovery = JSON.parse(localStorage.getItem(DISCOVERY_KEY) || 'null') || {
            visited: [],
            completed: false,
            dismissed: false,
        };

        // All discoverable pages
        var allDiscoverablePages = ['concept', 'menus', 'ambiances', 'zones', 'passeport', 'reservation'];

        // If already completed or dismissed, skip
        if (discovery.completed || discovery.dismissed) return;

        // Track current page visit
        var slug = document.body.getAttribute('data-page-slug');
        if (slug && allDiscoverablePages.indexOf(slug) >= 0 && discovery.visited.indexOf(slug) < 0) {
            discovery.visited.push(slug);
            localStorage.setItem(DISCOVERY_KEY, JSON.stringify(discovery));

            // Show discovery toast
            var visitCount = discovery.visited.length;
            var totalPages = allDiscoverablePages.length;

            if (visitCount >= totalPages) {
                // All pages discovered!
                discovery.completed = true;
                localStorage.setItem(DISCOVERY_KEY, JSON.stringify(discovery));
                showDiscoveryToast(
                    'Bravo, explorateur ! Vous avez découvert tout l\'univers Virealys !',
                    'celebration'
                );
            } else {
                var messages = [
                    'Bienvenue ! Première escale découverte.',
                    'Continuez l\'exploration...',
                    'Vous progressez dans la constellation !',
                    'Encore quelques étoiles à découvrir...',
                    'Presque tout exploré !',
                ];
                var msg = messages[Math.min(visitCount - 1, messages.length - 1)];
                showDiscoveryToast(
                    msg + ' (' + visitCount + '/' + totalPages + ')',
                    'progress'
                );
            }
        }

        // Show discovery prompt on front-page for first-timers
        if (!slug || slug === 'front-page' || slug === 'home') {
            if (discovery.visited.length === 0) {
                // First visit to site
                setTimeout(function () {
                    showDiscoveryToast(
                        'Explorez chaque étoile de la constellation pour débloquer une surprise !',
                        'intro'
                    );
                }, 2500);
            } else if (discovery.visited.length > 0 && discovery.visited.length < allDiscoverablePages.length) {
                // Returning visitor, not all pages visited
                var remaining = allDiscoverablePages.length - discovery.visited.length;
                setTimeout(function () {
                    showDiscoveryToast(
                        'Encore ' + remaining + ' page' + (remaining > 1 ? 's' : '') + ' à découvrir dans la constellation !',
                        'progress'
                    );
                }, 2000);
            }
        }
    }

    function showDiscoveryToast(message, type) {
        var toast = document.createElement('div');
        toast.className = 'vr-discovery-toast vr-discovery-' + type;
        toast.innerHTML =
            '<span class="vr-discovery-icon">' +
                (type === 'celebration'
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
                    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>'
                ) +
            '</span>' +
            '<span class="vr-discovery-text">' + message + '</span>';

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(function () {
            toast.classList.add('vr-discovery-visible');
        });

        // Auto dismiss
        var duration = type === 'celebration' ? 6000 : 4000;
        setTimeout(function () {
            toast.classList.remove('vr-discovery-visible');
            setTimeout(function () { if (toast.parentNode) toast.remove(); }, 500);
        }, duration);
    }

    /* =========================================
       8. CONSTELLATION RETURN BAR
       ========================================= */
    function initConstellationReturn() {
        var returnBar = document.getElementById('vr-constellation-return');
        if (!returnBar) return;
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
       SMOOTH SCROLL
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
    initDiscovery();
    initMagnetics();
    initTilt();
    initParallax();
    initReveals();
    initMenuOverlay();
    initSmoothScroll();
    initParticles();
    initCardGlow();
    resetIdle();

    if (!S.mobile) animate();

})();
