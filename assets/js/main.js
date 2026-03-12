/**
 * Virealys - Constellation Adaptive Engine v5.0
 * 2D spatial navigation — panels arrive from any direction.
 * Gravitational prediction — the site anticipates where you want to go.
 * Every interaction reshapes the experience.
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
        PANEL_TRANSITION: 700,
        DOCK_REORDER_INTERVAL: 5000,
        EDGE_PEEK_ZONE: 80,        // px from edge to trigger peek
        EDGE_PEEK_STRENGTH: 0.08,  // how much the next panel peeks in
    };

    var S = {
        mx: window.innerWidth / 2, my: window.innerHeight / 2,
        tx: window.innerWidth / 2, ty: window.innerHeight / 2,
        idle: false, idleTimer: null,
        mobile: window.matchMedia('(max-width: 768px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        // Constellation
        currentPanel: null, panels: [], panelMap: {}, transitioning: false, spatialActive: false,
        // Dock
        dockHidden: false, lastScrollY: window.scrollY, scrollDelta: 0,
        // Edge peek
        peekDirection: null, peekTarget: null,
        // Mouse direction tracking for prediction
        mouseHistory: [], mouseDir: { x: 0, y: 0 },
    };

    // ========== USER PROFILE (localStorage) ==========
    var PROFILE_KEY = 'vr_user_profile';
    var profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || {
        visits: 0, sections: {}, lastSections: [], transitions: {}, lastVisitTime: 0,
    };
    profile.visits++;
    profile.lastVisitTime = Date.now();
    if (!profile.transitions) profile.transitions = {};

    function saveProfile() {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }

    function trackSection(id) {
        profile.sections[id] = (profile.sections[id] || 0) + 1;
        profile.lastSections.unshift(id);
        if (profile.lastSections.length > 30) profile.lastSections.length = 30;
        saveProfile();
    }

    function trackTransition(fromId, toId) {
        var key = fromId + '>' + toId;
        profile.transitions[key] = (profile.transitions[key] || 0) + 1;
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

    // Predict most likely next panel from current panel
    function predictNextPanel(currentId) {
        var best = null, bestScore = -1;
        var neighbors = getNeighbors(currentId);
        for (var i = 0; i < neighbors.length; i++) {
            var n = neighbors[i];
            var key = currentId + '>' + n.id;
            var transFreq = profile.transitions[key] || 0;
            var sectionPri = getSectionPriority(n.id);
            // Factor in mouse direction
            var dirScore = 0;
            if (S.mouseDir.x !== 0 || S.mouseDir.y !== 0) {
                var dx = n.col - S.panelMap[currentId].col;
                var dy = n.row - S.panelMap[currentId].row;
                dirScore = (dx * S.mouseDir.x + dy * S.mouseDir.y) * 10;
            }
            var score = transFreq * 3 + sectionPri + dirScore;
            if (score > bestScore) { bestScore = score; best = n; }
        }
        return best;
    }

    function getNeighbors(panelId) {
        var p = S.panelMap[panelId];
        if (!p) return [];
        var result = [];
        for (var id in S.panelMap) {
            if (id === panelId) continue;
            var o = S.panelMap[id];
            var dc = Math.abs(o.col - p.col);
            var dr = Math.abs(o.row - p.row);
            if (dc <= 1 && dr <= 1 && (dc + dr > 0)) {
                result.push(o);
            }
        }
        return result;
    }

    saveProfile();

    // Early bailout for reduced motion
    if (S.reduced) {
        initReveals(); initNavDock(); initMenuOverlay(); initSmoothScroll();
        initConstellationCanvas(); return;
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

    // ========== 5. CONSTELLATION CANVAS (Front Page) ==========
    function initConstellationCanvas() {
        var spatial = document.getElementById('vr-spatial');
        if (!spatial) return;

        S.spatialActive = true;
        var panelEls = Array.from(spatial.querySelectorAll('.vr-panel'));
        if (panelEls.length === 0) return;

        // Build panel map with 2D coordinates
        panelEls.forEach(function (el) {
            var id = el.getAttribute('data-panel');
            var col = parseInt(el.getAttribute('data-grid-col')) || 0;
            var row = parseInt(el.getAttribute('data-grid-row')) || 0;
            var entry = { el: el, id: id, col: col, row: row };
            S.panels.push(entry);
            S.panelMap[id] = entry;
        });

        S.currentPanel = S.panels[0];
        document.body.classList.add('vr-spatial-active');

        // Build constellation mini-map
        buildConstellationNav();

        // Panel goto buttons (by panel name)
        document.querySelectorAll('.vr-panel-goto').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var target = this.getAttribute('data-goto-panel');
                if (target && S.panelMap[target]) navigateTo(target);
            });
        });

        // Wheel navigation: determine direction from scroll
        spatial.addEventListener('wheel', function (e) {
            if (S.transitioning) return;
            var panel = S.currentPanel.el;
            var scroller = panel.querySelector('.vr-panel-scroll');

            // Check if internal scroll should handle this
            if (scroller) {
                var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 5;
                var atTop = scroller.scrollTop <= 5;
                if (e.deltaY > 0 && !atBottom) return;
                if (e.deltaY < 0 && !atTop) return;
            }

            e.preventDefault();

            // Determine navigation direction from wheel
            var absDX = Math.abs(e.deltaX);
            var absDY = Math.abs(e.deltaY);

            var dirCol = 0, dirRow = 0;
            if (absDX > absDY) {
                dirCol = e.deltaX > 0 ? 1 : -1;
            } else {
                dirRow = e.deltaY > 0 ? 1 : -1;
            }

            // Find panel in that direction
            var target = findPanelInDirection(dirCol, dirRow);
            if (target) navigateTo(target.id);
        }, { passive: false });

        // Touch support — swipe in any direction
        var touchStart = { x: 0, y: 0 };
        spatial.addEventListener('touchstart', function (e) {
            touchStart.x = e.touches[0].clientX;
            touchStart.y = e.touches[0].clientY;
        }, { passive: true });

        spatial.addEventListener('touchend', function (e) {
            var dx = touchStart.x - e.changedTouches[0].clientX;
            var dy = touchStart.y - e.changedTouches[0].clientY;
            var absDX = Math.abs(dx), absDY = Math.abs(dy);
            if (absDX < 40 && absDY < 40) return; // too small

            var dirCol = 0, dirRow = 0;
            // Allow diagonal swipes
            if (absDX > 30) dirCol = dx > 0 ? 1 : -1;
            if (absDY > 30) dirRow = dy > 0 ? 1 : -1;

            var target = findPanelInDirection(dirCol, dirRow);
            if (target) navigateTo(target.id);
        });

        // Keyboard — all 4 arrows
        document.addEventListener('keydown', function (e) {
            if (!S.spatialActive || S.transitioning) return;
            var dirCol = 0, dirRow = 0;
            if (e.key === 'ArrowRight') dirCol = 1;
            else if (e.key === 'ArrowLeft') dirCol = -1;
            else if (e.key === 'ArrowDown') dirRow = 1;
            else if (e.key === 'ArrowUp') dirRow = -1;
            else return;

            e.preventDefault();
            var target = findPanelInDirection(dirCol, dirRow);
            if (target) navigateTo(target.id);
        });

        // Edge peek on mouse near viewport edges
        if (!S.mobile) {
            document.addEventListener('mousemove', updateEdgePeek);
        }

        // Update edge indicators
        updateEdgeIndicators();

        // Reveal first panel
        S.currentPanel.el.querySelectorAll('[data-reveal]').forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    function findPanelInDirection(dirCol, dirRow) {
        if (!S.currentPanel) return null;
        var cc = S.currentPanel.col, cr = S.currentPanel.row;
        var targetCol = cc + dirCol, targetRow = cr + dirRow;

        // Exact match first
        for (var i = 0; i < S.panels.length; i++) {
            if (S.panels[i].col === targetCol && S.panels[i].row === targetRow) {
                return S.panels[i];
            }
        }

        // If diagonal didn't match, try nearest in that general direction
        var best = null, bestDist = Infinity;
        for (var j = 0; j < S.panels.length; j++) {
            var p = S.panels[j];
            if (p.id === S.currentPanel.id) continue;
            var dc = p.col - cc, dr = p.row - cr;
            // Must be in the right general direction
            if (dirCol !== 0 && Math.sign(dc) !== Math.sign(dirCol)) continue;
            if (dirRow !== 0 && Math.sign(dr) !== Math.sign(dirRow)) continue;
            if (dirCol === 0 && dc !== 0) continue;
            if (dirRow === 0 && dr !== 0) continue;
            var dist = Math.abs(dc) + Math.abs(dr);
            if (dist < bestDist) { bestDist = dist; best = p; }
        }
        return best;
    }

    // ========== NAVIGATE TO PANEL ==========
    function navigateTo(targetId) {
        if (!S.panelMap[targetId] || S.transitioning) return;
        var target = S.panelMap[targetId];
        if (target === S.currentPanel) return;
        S.transitioning = true;

        var fromId = S.currentPanel.id;
        var current = S.currentPanel;

        // Calculate direction vector
        var dc = target.col - current.col;
        var dr = target.row - current.row;

        // Determine transition class based on direction
        var exitClass = getExitClass(dc, dr);
        var enterClass = getEnterClass(dc, dr);

        // Clear any peek
        clearPeek();

        // Exit current panel
        current.el.classList.remove('vr-panel-active');
        current.el.classList.add(exitClass);

        // Enter new panel
        target.el.classList.add(enterClass);
        void target.el.offsetHeight; // force reflow
        target.el.classList.add('vr-panel-active');
        target.el.classList.remove(enterClass);

        // Track
        trackSection(targetId);
        trackTransition(fromId, targetId);

        // Trigger reveals
        target.el.querySelectorAll('[data-reveal]:not(.revealed)').forEach(function (el) {
            el.classList.add('revealed');
        });

        // Section color morph
        var color = target.el.getAttribute('data-section-color');
        if (color) document.documentElement.style.setProperty('--section-accent', color);

        setTimeout(function () {
            current.el.classList.remove(exitClass);
            S.currentPanel = target;
            S.transitioning = false;
            updateConstellationNav();
            updateEdgeIndicators();
            updateDockFromPanel();
            updatePredictiveGlow();
        }, CFG.PANEL_TRANSITION);
    }

    function getExitClass(dc, dr) {
        // Panel exits in the OPPOSITE direction of navigation
        if (dc > 0 && dr === 0) return 'vr-panel-exit-left';
        if (dc < 0 && dr === 0) return 'vr-panel-exit-right';
        if (dr > 0 && dc === 0) return 'vr-panel-exit-up';
        if (dr < 0 && dc === 0) return 'vr-panel-exit-down';
        // Diagonals
        if (dc > 0 && dr > 0) return 'vr-panel-exit-topleft';
        if (dc < 0 && dr > 0) return 'vr-panel-exit-topright';
        if (dc > 0 && dr < 0) return 'vr-panel-exit-bottomleft';
        if (dc < 0 && dr < 0) return 'vr-panel-exit-bottomright';
        return 'vr-panel-exit-up';
    }

    function getEnterClass(dc, dr) {
        // Panel enters FROM the direction of navigation
        if (dc > 0 && dr === 0) return 'vr-panel-enter-right';
        if (dc < 0 && dr === 0) return 'vr-panel-enter-left';
        if (dr > 0 && dc === 0) return 'vr-panel-enter-bottom';
        if (dr < 0 && dc === 0) return 'vr-panel-enter-top';
        // Diagonals
        if (dc > 0 && dr > 0) return 'vr-panel-enter-bottomright';
        if (dc < 0 && dr > 0) return 'vr-panel-enter-bottomleft';
        if (dc > 0 && dr < 0) return 'vr-panel-enter-topright';
        if (dc < 0 && dr < 0) return 'vr-panel-enter-topleft';
        return 'vr-panel-enter-bottom';
    }

    // ========== CONSTELLATION MINI-MAP ==========
    function buildConstellationNav() {
        var nav = document.getElementById('vr-panel-nav');
        if (!nav) return;
        nav.innerHTML = '';
        nav.classList.add('vr-constellation-map');

        // Find grid bounds
        var minC = Infinity, maxC = -Infinity, minR = Infinity, maxR = -Infinity;
        S.panels.forEach(function (p) {
            if (p.col < minC) minC = p.col;
            if (p.col > maxC) maxC = p.col;
            if (p.row < minR) minR = p.row;
            if (p.row > maxR) maxR = p.row;
        });

        var cols = maxC - minC + 1;
        var rows = maxR - minR + 1;
        nav.style.setProperty('--map-cols', cols);
        nav.style.setProperty('--map-rows', rows);

        S.panels.forEach(function (p) {
            var dot = document.createElement('button');
            dot.className = 'vr-constellation-dot' + (p === S.currentPanel ? ' active' : '');
            dot.setAttribute('data-panel-id', p.id);
            dot.setAttribute('aria-label', p.id);
            dot.style.setProperty('--dot-col', p.col - minC);
            dot.style.setProperty('--dot-row', p.row - minR);
            dot.addEventListener('click', function () { navigateTo(p.id); });

            // Tooltip
            var label = document.createElement('span');
            label.className = 'vr-constellation-label';
            label.textContent = p.id.charAt(0).toUpperCase() + p.id.slice(1);
            dot.appendChild(label);

            nav.appendChild(dot);
        });

        // Draw connection lines
        S.panels.forEach(function (p) {
            var neighbors = getNeighbors(p.id);
            neighbors.forEach(function (n) {
                // Only draw line once (from lower id to higher id)
                if (p.id < n.id) {
                    var line = document.createElement('div');
                    line.className = 'vr-constellation-line';
                    var x1 = p.col - minC, y1 = p.row - minR;
                    var x2 = n.col - minC, y2 = n.row - minR;
                    var midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
                    var dx = x2 - x1, dy = y2 - y1;
                    var length = Math.sqrt(dx * dx + dy * dy);
                    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    line.style.setProperty('--line-x', midX);
                    line.style.setProperty('--line-y', midY);
                    line.style.setProperty('--line-len', length);
                    line.style.setProperty('--line-angle', angle + 'deg');
                    nav.appendChild(line);
                }
            });
        });
    }

    function updateConstellationNav() {
        document.querySelectorAll('.vr-constellation-dot').forEach(function (dot) {
            var id = dot.getAttribute('data-panel-id');
            dot.classList.toggle('active', id === S.currentPanel.id);
        });
    }

    // ========== EDGE PEEK (mouse near viewport edge previews neighbor) ==========
    function updateEdgePeek() {
        if (S.transitioning || !S.spatialActive || !S.currentPanel) return;

        var w = window.innerWidth, h = window.innerHeight;
        var zone = CFG.EDGE_PEEK_ZONE;
        var dirCol = 0, dirRow = 0;

        if (S.mx < zone) dirCol = -1;
        else if (S.mx > w - zone) dirCol = 1;
        if (S.my < zone) dirRow = -1;
        else if (S.my > h - zone) dirRow = 1;

        if (dirCol === 0 && dirRow === 0) {
            clearPeek();
            return;
        }

        var target = findPanelInDirection(dirCol, dirRow);
        if (!target || target === S.peekTarget) return;

        clearPeek();
        S.peekTarget = target;
        S.peekDirection = { col: dirCol, row: dirRow };

        // Show a subtle peek of the target panel
        target.el.classList.add('vr-panel-peeking');
        target.el.style.setProperty('--peek-x', (dirCol * -100) + '%');
        target.el.style.setProperty('--peek-y', (dirRow * -100) + '%');
        target.el.style.setProperty('--peek-offset', CFG.EDGE_PEEK_STRENGTH * 100 + '%');
    }

    function clearPeek() {
        if (S.peekTarget) {
            S.peekTarget.el.classList.remove('vr-panel-peeking');
            S.peekTarget = null;
            S.peekDirection = null;
        }
    }

    // ========== EDGE INDICATORS ==========
    function updateEdgeIndicators() {
        if (!S.currentPanel) return;
        var cc = S.currentPanel.col, cr = S.currentPanel.row;
        var edges = {
            top: false, bottom: false, left: false, right: false
        };

        S.panels.forEach(function (p) {
            if (p.id === S.currentPanel.id) return;
            var dc = p.col - cc, dr = p.row - cr;
            if (dr < 0) edges.top = true;
            if (dr > 0) edges.bottom = true;
            if (dc < 0) edges.left = true;
            if (dc > 0) edges.right = true;
        });

        ['top', 'bottom', 'left', 'right'].forEach(function (dir) {
            var el = document.getElementById('vr-edge-' + dir);
            if (el) el.classList.toggle('visible', edges[dir]);
        });
    }

    // ========== PREDICTIVE GLOW ==========
    function updatePredictiveGlow() {
        if (!S.currentPanel) return;
        var predicted = predictNextPanel(S.currentPanel.id);

        // Update edge glow intensity for predicted direction
        if (predicted) {
            var dc = predicted.col - S.currentPanel.col;
            var dr = predicted.row - S.currentPanel.row;

            ['top', 'bottom', 'left', 'right'].forEach(function (dir) {
                var el = document.getElementById('vr-edge-' + dir);
                if (el) el.classList.remove('vr-edge-predicted');
            });

            if (dr < 0) addPredictedClass('top');
            if (dr > 0) addPredictedClass('bottom');
            if (dc < 0) addPredictedClass('left');
            if (dc > 0) addPredictedClass('right');
        }
    }

    function addPredictedClass(dir) {
        var el = document.getElementById('vr-edge-' + dir);
        if (el) el.classList.add('vr-edge-predicted');
    }

    // ========== MOUSE DIRECTION TRACKING ==========
    function trackMouseDirection() {
        S.mouseHistory.push({ x: S.mx, y: S.my, t: Date.now() });
        if (S.mouseHistory.length > 10) S.mouseHistory.shift();

        if (S.mouseHistory.length >= 3) {
            var first = S.mouseHistory[0];
            var last = S.mouseHistory[S.mouseHistory.length - 1];
            var dx = last.x - first.x, dy = last.y - first.y;
            var mag = Math.sqrt(dx * dx + dy * dy);
            if (mag > 20) {
                S.mouseDir.x = dx / mag;
                S.mouseDir.y = dy / mag;
            }
        }
    }

    // ========== 6. PREDICTIVE DOCK ==========
    var dock = document.getElementById('vr-dock');
    var dockTrack = document.getElementById('vr-dock-track');
    var dockProgress = document.getElementById('vr-dock-progress');

    function initNavDock() {
        if (!dock) return;
        if (!S.spatialActive) {
            window.addEventListener('scroll', onPageScroll, { passive: true });
        }
        reorderDock();
        setInterval(reorderDock, CFG.DOCK_REORDER_INTERVAL);
    }

    function onPageScroll() {
        var y = window.scrollY;
        var diff = y - S.lastScrollY;
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
    }

    function hideDock() { if (dock) { dock.classList.add('dock-hidden'); S.dockHidden = true; } }
    function showDock() { if (dock) { dock.classList.remove('dock-hidden'); S.dockHidden = false; } }

    function updateDockFromPanel() {
        if (dockProgress && S.spatialActive && S.panels.length > 1) {
            var idx = S.panels.indexOf(S.currentPanel);
            var pct = (idx / (S.panels.length - 1)) * 100;
            dockProgress.style.width = pct + '%';
        }
        if (!S.currentPanel) return;
        document.querySelectorAll('.vr-dock-btn[data-section]').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-section') === S.currentPanel.id);
        });
    }

    // ========== 7. PREDICTIVE REORDERING ==========
    function reorderDock() {
        if (!dockTrack) return;
        var buttons = Array.from(dockTrack.querySelectorAll('.vr-dock-btn[data-section]'));
        if (buttons.length === 0) return;

        var prioritized = buttons.map(function (btn) {
            var id = btn.getAttribute('data-section');
            return { btn: btn, id: id, priority: getSectionPriority(id) };
        });

        prioritized.sort(function (a, b) { return b.priority - a.priority; });

        prioritized.forEach(function (item, i) {
            item.btn.style.order = i;
            item.btn.classList.toggle('vr-dock-btn-hot', i === 0 && item.priority > 5);
        });
    }

    // Dock buttons navigate constellation
    if (dock) {
        dock.addEventListener('click', function (e) {
            var btn = e.target.closest('.vr-dock-btn[data-section]');
            if (!btn || !S.spatialActive) return;
            var targetId = btn.getAttribute('data-section');
            if (S.panelMap[targetId]) {
                e.preventDefault();
                navigateTo(targetId);
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
        trackMouseDirection();

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
    initConstellationCanvas();
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
