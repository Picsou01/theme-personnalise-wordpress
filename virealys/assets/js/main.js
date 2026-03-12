/**
 * Virealys - Living Canvas Engine v6.0
 * Revolutionary fluid navigation — no fixed positions, everything flows.
 * Mouse direction drives continuous drift. Wheel accelerates movement.
 * Autonomous floating dock buttons with individual physics/AI.
 * Predictive anticipation & dopamine engagement mechanics.
 */
(function () {
    'use strict';

    // =============================================
    // CONFIGURATION
    // =============================================
    var CFG = {
        // Canvas drift
        DRIFT_BASE_SPEED: 0.3,
        DRIFT_WHEEL_BOOST: 2.5,
        DRIFT_DECAY: 0.94,
        DRIFT_WHEEL_DECAY: 0.97,
        CANVAS_FRICTION: 0.02,
        // Autonomous dock
        DOCK_FLOAT_SPEED: 0.008,
        DOCK_REPULSION: 80,
        DOCK_REPULSION_FORCE: 0.5,
        DOCK_GRAVITY: 0.015,
        DOCK_DAMPING: 0.92,
        DOCK_BOUNDARY_MARGIN: 20,
        DOCK_MOUSE_ATTRACT: 0.04,
        DOCK_MOUSE_RADIUS: 200,
        // Engagement
        REWARD_INTERVAL: 15000,
        STREAK_TIMEOUT: 86400000,
        DISCOVERY_PARTICLE_COUNT: 12,
        // UI
        CURSOR_SIZE: 600,
        MAGNETIC_RADIUS: 120,
        MAGNETIC_STRENGTH: 0.3,
        TILT_MAX: 8,
        IDLE_TIMEOUT: 5000,
        LERP: 0.1,
        PANEL_TRANSITION: 600,
        PREDICTION_UPDATE: 3000,
    };

    // =============================================
    // STATE
    // =============================================
    var S = {
        mx: window.innerWidth / 2,
        my: window.innerHeight / 2,
        tx: window.innerWidth / 2,
        ty: window.innerHeight / 2,
        idle: false,
        idleTimer: null,
        mobile: window.matchMedia('(max-width: 768px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        // Living canvas
        canvasX: 0,
        canvasY: 0,
        driftVX: 0,
        driftVY: 0,
        wheelBoost: 0,
        mouseAngle: 0,
        mouseMagnitude: 0,
        mouseHistory: [],
        // Panel system
        currentPanel: null,
        panels: [],
        panelMap: {},
        transitioning: false,
        spatialActive: false,
        // Autonomous dock buttons
        dockButtons: [],
        dockVisible: true,
        // Engagement state
        discoveryCount: 0,
        lastRewardTime: 0,
        sessionStartTime: Date.now(),
        interactionCount: 0,
        // Prediction
        predictedPanel: null,
        predictionGlowEl: null,
    };

    // =============================================
    // USER PROFILE (localStorage)
    // =============================================
    var PROFILE_KEY = 'vr_user_profile';
    var profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || {
        visits: 0,
        sections: {},
        lastSections: [],
        transitions: {},
        lastVisitTime: 0,
        streak: 0,
        lastStreakDate: '',
        discoveries: [],
        totalInteractions: 0,
        contentOrder: {},
        sessionDurations: [],
    };

    // Update streak
    var today = new Date().toDateString();
    if (profile.lastStreakDate === new Date(Date.now() - 86400000).toDateString()) {
        profile.streak++;
    } else if (profile.lastStreakDate !== today) {
        profile.streak = 1;
    }
    profile.lastStreakDate = today;
    profile.visits++;
    profile.lastVisitTime = Date.now();
    if (!profile.transitions) profile.transitions = {};
    if (!profile.discoveries) profile.discoveries = [];
    if (!profile.contentOrder) profile.contentOrder = {};
    if (!profile.sessionDurations) profile.sessionDurations = [];

    function saveProfile() {
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        } catch (e) { /* quota exceeded — silent */ }
    }

    function trackSection(id) {
        profile.sections[id] = (profile.sections[id] || 0) + 1;
        profile.lastSections.unshift(id);
        if (profile.lastSections.length > 50) profile.lastSections.length = 50;
        profile.totalInteractions = (profile.totalInteractions || 0) + 1;
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
        var recency = recIdx >= 0 ? Math.max(0, 30 - recIdx) : 0;
        var hour = new Date().getHours();
        var timeBonus = 0;
        if ((hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 22)) {
            if (id === 'reservation') timeBonus = 25;
            else if (id === 'menus') timeBonus = 15;
        }
        if (hour >= 10 && hour < 18 && id === 'concept') timeBonus = 5;
        // Streak bonus — returning users get boosted priority on their favorites
        var streakBonus = Math.min(profile.streak, 10) * (freq > 3 ? 2 : 0);
        return freq * 2 + recency + timeBonus + streakBonus;
    }

    function predictNextPanel(currentId) {
        if (!currentId) return null;
        var best = null, bestScore = -1;
        for (var i = 0; i < S.panels.length; i++) {
            var p = S.panels[i];
            if (p.id === currentId) continue;
            var key = currentId + '>' + p.id;
            var transFreq = profile.transitions[key] || 0;
            var sectionPri = getSectionPriority(p.id);
            // Factor in current mouse direction toward this panel
            var dirScore = 0;
            if (S.mouseMagnitude > 0.1 && S.panelMap[currentId]) {
                var cur = S.panelMap[currentId];
                var dx = p.col - cur.col;
                var dy = p.row - cur.row;
                var mag = Math.sqrt(dx * dx + dy * dy);
                if (mag > 0) {
                    var dot = (dx / mag) * Math.cos(S.mouseAngle) + (dy / mag) * Math.sin(S.mouseAngle);
                    dirScore = dot * S.mouseMagnitude * 15;
                }
            }
            var score = transFreq * 4 + sectionPri + dirScore;
            if (score > bestScore) { bestScore = score; best = p; }
        }
        return best;
    }

    saveProfile();

    // =============================================
    // REDUCED MOTION BAILOUT
    // =============================================
    if (S.reduced) {
        document.addEventListener('DOMContentLoaded', function () {
            initReveals(); initMenuOverlay(); initSmoothScroll();
            initStaticDock(); initConstellationCanvas();
        });
        return;
    }

    // =============================================
    // CURSOR LIGHT
    // =============================================
    var cursorLight = null;
    if (!S.mobile) {
        cursorLight = document.createElement('div');
        cursorLight.className = 'vr-cursor-light';
        cursorLight.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorLight);
    }

    // =============================================
    // MOUSE DIRECTION & MAGNITUDE TRACKING
    // =============================================
    function trackMouseDirection() {
        S.mouseHistory.push({ x: S.mx, y: S.my, t: Date.now() });
        if (S.mouseHistory.length > 15) S.mouseHistory.shift();

        if (S.mouseHistory.length >= 4) {
            var first = S.mouseHistory[0];
            var last = S.mouseHistory[S.mouseHistory.length - 1];
            var dx = last.x - first.x;
            var dy = last.y - first.y;
            var mag = Math.sqrt(dx * dx + dy * dy);
            if (mag > 10) {
                S.mouseAngle = Math.atan2(dy, dx);
                S.mouseMagnitude = Math.min(mag / 200, 1);
            } else {
                S.mouseMagnitude *= 0.9;
            }
        }
    }

    // =============================================
    // LIVING CANVAS — CONTINUOUS DRIFT
    // =============================================
    // The canvas has no fixed grid. Panels float in a 2D space.
    // Mouse direction creates a gentle continuous drift.
    // Mouse wheel accelerates/decelerates in the current direction.

    function updateCanvasDrift() {
        if (!S.spatialActive || S.transitioning) return;

        // Mouse direction applies gentle drift force
        if (S.mouseMagnitude > 0.15 && !S.idle) {
            var force = CFG.DRIFT_BASE_SPEED * S.mouseMagnitude;
            S.driftVX += Math.cos(S.mouseAngle) * force;
            S.driftVY += Math.sin(S.mouseAngle) * force;
        }

        // Apply wheel boost in the current drift direction or mouse direction
        if (S.wheelBoost !== 0) {
            var angle = (Math.abs(S.driftVX) > 0.01 || Math.abs(S.driftVY) > 0.01)
                ? Math.atan2(S.driftVY, S.driftVX)
                : S.mouseAngle;
            S.driftVX += Math.cos(angle) * S.wheelBoost;
            S.driftVY += Math.sin(angle) * S.wheelBoost;
            S.wheelBoost *= CFG.DRIFT_WHEEL_DECAY;
            if (Math.abs(S.wheelBoost) < 0.01) S.wheelBoost = 0;
        }

        // Apply friction/decay
        S.driftVX *= CFG.DRIFT_DECAY;
        S.driftVY *= CFG.DRIFT_DECAY;

        // Clamp max speed
        var speed = Math.sqrt(S.driftVX * S.driftVX + S.driftVY * S.driftVY);
        var maxSpeed = 12;
        if (speed > maxSpeed) {
            S.driftVX = (S.driftVX / speed) * maxSpeed;
            S.driftVY = (S.driftVY / speed) * maxSpeed;
        }

        // Update canvas position
        S.canvasX += S.driftVX;
        S.canvasY += S.driftVY;

        // Check if we should transition to a new panel
        checkPanelProximity();

        // Apply transform to the spatial container
        var spatial = document.getElementById('vr-spatial');
        if (spatial) {
            spatial.style.transform = 'translate(' + (-S.canvasX * 0.5).toFixed(1) + 'px, ' + (-S.canvasY * 0.5).toFixed(1) + 'px)';
        }
    }

    function checkPanelProximity() {
        if (!S.currentPanel || S.transitioning) return;

        var threshold = 150; // px of canvas travel to trigger panel switch
        var cur = S.currentPanel;
        var best = null, bestDist = Infinity;

        for (var i = 0; i < S.panels.length; i++) {
            var p = S.panels[i];
            if (p.id === cur.id) continue;

            // Virtual position based on grid coords and canvas offset
            var dx = (p.col - cur.col) * 100 - S.canvasX;
            var dy = (p.row - cur.row) * 100 - S.canvasY;
            var dist = Math.sqrt(dx * dx + dy * dy);

            // Check if canvas has drifted enough toward this panel
            var canvasDist = Math.sqrt(S.canvasX * S.canvasX + S.canvasY * S.canvasY);
            if (canvasDist > threshold) {
                // Find which panel we're drifting toward
                var dirX = S.canvasX / canvasDist;
                var dirY = S.canvasY / canvasDist;
                var panelDirX = p.col - cur.col;
                var panelDirY = p.row - cur.row;
                var panelMag = Math.sqrt(panelDirX * panelDirX + panelDirY * panelDirY);
                if (panelMag > 0) {
                    var dot = (panelDirX / panelMag) * dirX + (panelDirY / panelMag) * dirY;
                    if (dot > 0.5 && panelMag < bestDist) {
                        bestDist = panelMag;
                        best = p;
                    }
                }
            }
        }

        if (best) {
            navigateTo(best.id);
            S.canvasX = 0;
            S.canvasY = 0;
            S.driftVX *= 0.3;
            S.driftVY *= 0.3;
        }
    }

    // =============================================
    // CONSTELLATION CANVAS (Front Page)
    // =============================================
    function initConstellationCanvas() {
        var spatial = document.getElementById('vr-spatial');
        if (!spatial) return;

        S.spatialActive = true;
        var panelEls = Array.from(spatial.querySelectorAll('.vr-panel'));
        if (panelEls.length === 0) return;

        // Build panel map — positions will be dynamically reshuffled
        panelEls.forEach(function (el) {
            var id = el.getAttribute('data-panel');
            var col = parseInt(el.getAttribute('data-grid-col')) || 0;
            var row = parseInt(el.getAttribute('data-grid-row')) || 0;
            var entry = { el: el, id: id, col: col, row: row, baseCol: col, baseRow: row };
            S.panels.push(entry);
            S.panelMap[id] = entry;
        });

        // Dynamically reorder panels based on user profile
        reshufflePanelPositions();

        S.currentPanel = S.panels[0];
        document.body.classList.add('vr-spatial-active');

        // Build constellation mini-map
        buildConstellationNav();

        // Panel goto buttons
        document.querySelectorAll('.vr-panel-goto').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var target = this.getAttribute('data-goto-panel');
                if (target && S.panelMap[target]) navigateTo(target);
            });
        });

        // Mouse wheel — accelerates drift in current direction
        spatial.addEventListener('wheel', function (e) {
            if (S.transitioning) return;

            // Check internal scroll first
            var panel = S.currentPanel.el;
            var scroller = panel.querySelector('.vr-panel-scroll');
            if (scroller) {
                var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 5;
                var atTop = scroller.scrollTop <= 5;
                if (e.deltaY > 0 && !atBottom) return;
                if (e.deltaY < 0 && !atTop) return;
            }

            e.preventDefault();

            // Wheel adds boost in current mouse direction
            var wheelForce = Math.sign(e.deltaY) * CFG.DRIFT_WHEEL_BOOST;
            S.wheelBoost += wheelForce;

            // Track interaction
            S.interactionCount++;
            checkEngagementReward();
        }, { passive: false });

        // Touch swipe
        var touchStart = { x: 0, y: 0 };
        spatial.addEventListener('touchstart', function (e) {
            touchStart.x = e.touches[0].clientX;
            touchStart.y = e.touches[0].clientY;
        }, { passive: true });

        spatial.addEventListener('touchend', function (e) {
            var dx = touchStart.x - e.changedTouches[0].clientX;
            var dy = touchStart.y - e.changedTouches[0].clientY;
            if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return;

            // Apply impulse in swipe direction
            S.driftVX += dx * 0.05;
            S.driftVY += dy * 0.05;
        });

        // Keyboard arrows
        document.addEventListener('keydown', function (e) {
            if (!S.spatialActive || S.transitioning) return;
            var impulse = 5;
            if (e.key === 'ArrowRight') S.driftVX += impulse;
            else if (e.key === 'ArrowLeft') S.driftVX -= impulse;
            else if (e.key === 'ArrowDown') S.driftVY += impulse;
            else if (e.key === 'ArrowUp') S.driftVY -= impulse;
            else return;
            e.preventDefault();
        });

        // Reveal first panel
        S.currentPanel.el.querySelectorAll('[data-reveal]').forEach(function (el) {
            el.classList.add('revealed');
        });

        // Start prediction cycle
        setInterval(function () {
            updatePrediction();
            updateDockAI();
        }, CFG.PREDICTION_UPDATE);
    }

    // =============================================
    // DYNAMIC PANEL RESHUFFLING
    // =============================================
    function reshufflePanelPositions() {
        if (S.panels.length < 2) return;

        // Score each panel and place highest-priority ones closer to current position
        var scored = S.panels.map(function (p) {
            return { panel: p, score: getSectionPriority(p.id) };
        });
        scored.sort(function (a, b) { return b.score - a.score; });

        // Spiral placement: highest priority at center, others spiral outward
        var spiralPositions = generateSpiral(scored.length);
        scored.forEach(function (item, i) {
            item.panel.col = spiralPositions[i].col;
            item.panel.row = spiralPositions[i].row;
        });
    }

    function generateSpiral(count) {
        var positions = [{ col: 0, row: 0 }];
        var directions = [
            { col: 1, row: 0 }, { col: 0, row: 1 },
            { col: -1, row: 0 }, { col: 0, row: -1 }
        ];
        var x = 0, y = 0, dir = 0, steps = 1, stepCount = 0, turnCount = 0;

        while (positions.length < count) {
            x += directions[dir].col;
            y += directions[dir].row;
            positions.push({ col: x, row: y });
            stepCount++;
            if (stepCount === steps) {
                stepCount = 0;
                dir = (dir + 1) % 4;
                turnCount++;
                if (turnCount === 2) {
                    turnCount = 0;
                    steps++;
                }
            }
        }
        return positions;
    }

    // Reorder content within a panel based on engagement
    function reorderPanelContent(panelId) {
        var panel = S.panelMap[panelId];
        if (!panel) return;

        var contentEls = Array.from(panel.el.querySelectorAll('[data-content-priority]'));
        if (contentEls.length < 2) return;

        var order = profile.contentOrder[panelId] || {};
        contentEls.forEach(function (el) {
            var key = el.getAttribute('data-content-priority');
            var score = order[key] || 0;
            el.style.order = -score;
        });
    }

    // =============================================
    // NAVIGATE TO PANEL
    // =============================================
    function navigateTo(targetId) {
        if (!S.panelMap[targetId] || S.transitioning) return;
        var target = S.panelMap[targetId];
        if (target === S.currentPanel) return;
        S.transitioning = true;

        var fromId = S.currentPanel.id;
        var current = S.currentPanel;

        // Direction vector
        var dc = target.col - current.col;
        var dr = target.row - current.row;

        var exitClass = getExitClass(dc, dr);
        var enterClass = getEnterClass(dc, dr);

        // Exit current
        current.el.classList.remove('vr-panel-active');
        current.el.classList.add(exitClass);

        // Enter new
        target.el.classList.add(enterClass);
        void target.el.offsetHeight;
        target.el.classList.add('vr-panel-active');
        target.el.classList.remove(enterClass);

        // Track
        trackSection(targetId);
        trackTransition(fromId, targetId);

        // Check discovery
        checkDiscovery(targetId);

        // Reveals
        target.el.querySelectorAll('[data-reveal]:not(.revealed)').forEach(function (el) {
            el.classList.add('revealed');
        });

        // Section color
        var color = target.el.getAttribute('data-section-color');
        if (color) document.documentElement.style.setProperty('--section-accent', color);

        // Reorder content within the new panel
        reorderPanelContent(targetId);

        // Interaction tracking
        S.interactionCount++;

        setTimeout(function () {
            current.el.classList.remove(exitClass);
            S.currentPanel = target;
            S.transitioning = false;
            updateConstellationNav();
            updateDockButtonStates();
            updatePrediction();
            emitNavigationParticles(dc, dr);
        }, CFG.PANEL_TRANSITION);
    }

    function getExitClass(dc, dr) {
        if (dc > 0 && dr === 0) return 'vr-panel-exit-left';
        if (dc < 0 && dr === 0) return 'vr-panel-exit-right';
        if (dr > 0 && dc === 0) return 'vr-panel-exit-up';
        if (dr < 0 && dc === 0) return 'vr-panel-exit-down';
        if (dc > 0 && dr > 0) return 'vr-panel-exit-topleft';
        if (dc < 0 && dr > 0) return 'vr-panel-exit-topright';
        if (dc > 0 && dr < 0) return 'vr-panel-exit-bottomleft';
        if (dc < 0 && dr < 0) return 'vr-panel-exit-bottomright';
        return 'vr-panel-exit-up';
    }

    function getEnterClass(dc, dr) {
        if (dc > 0 && dr === 0) return 'vr-panel-enter-right';
        if (dc < 0 && dr === 0) return 'vr-panel-enter-left';
        if (dr > 0 && dc === 0) return 'vr-panel-enter-bottom';
        if (dr < 0 && dc === 0) return 'vr-panel-enter-top';
        if (dc > 0 && dr > 0) return 'vr-panel-enter-bottomright';
        if (dc < 0 && dr > 0) return 'vr-panel-enter-bottomleft';
        if (dc > 0 && dr < 0) return 'vr-panel-enter-topright';
        if (dc < 0 && dr < 0) return 'vr-panel-enter-topleft';
        return 'vr-panel-enter-bottom';
    }

    // =============================================
    // NAVIGATION PARTICLES (micro-reward)
    // =============================================
    function emitNavigationParticles(dc, dr) {
        var count = 8 + Math.floor(Math.random() * 6);
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        var angle = Math.atan2(dr, dc);

        for (var i = 0; i < count; i++) {
            var p = document.createElement('div');
            p.className = 'vr-nav-particle';
            var spread = (Math.random() - 0.5) * 1.2;
            var a = angle + spread;
            var dist = 80 + Math.random() * 200;
            var tx = cx + Math.cos(a) * dist;
            var ty = cy + Math.sin(a) * dist;
            p.style.left = cx + 'px';
            p.style.top = cy + 'px';
            p.style.setProperty('--tx', tx.toFixed(0) + 'px');
            p.style.setProperty('--ty', ty.toFixed(0) + 'px');
            p.style.setProperty('--delay', (Math.random() * 0.15) + 's');
            p.style.setProperty('--hue', Math.floor(180 + Math.random() * 60));
            document.body.appendChild(p);
            setTimeout(function (el) { return function () { if (el.parentNode) el.remove(); }; }(p), 1200);
        }
    }

    // =============================================
    // CONSTELLATION MINI-MAP
    // =============================================
    function buildConstellationNav() {
        var nav = document.getElementById('vr-panel-nav');
        if (!nav) return;
        nav.innerHTML = '';
        nav.classList.add('vr-constellation-map');

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

            var label = document.createElement('span');
            label.className = 'vr-constellation-label';
            label.textContent = p.id.charAt(0).toUpperCase() + p.id.slice(1);
            dot.appendChild(label);
            nav.appendChild(dot);
        });

        // Connection lines
        S.panels.forEach(function (p) {
            for (var j = 0; j < S.panels.length; j++) {
                var n = S.panels[j];
                if (p.id >= n.id) continue;
                var dc = Math.abs(n.col - p.col);
                var dr = Math.abs(n.row - p.row);
                if (dc <= 1 && dr <= 1 && (dc + dr > 0)) {
                    var line = document.createElement('div');
                    line.className = 'vr-constellation-line';
                    var x1 = p.col - minC, y1 = p.row - minR;
                    var x2 = n.col - minC, y2 = n.row - minR;
                    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                    var ddx = x2 - x1, ddy = y2 - y1;
                    var length = Math.sqrt(ddx * ddx + ddy * ddy);
                    var ang = Math.atan2(ddy, ddx) * 180 / Math.PI;
                    line.style.setProperty('--line-x', mx);
                    line.style.setProperty('--line-y', my);
                    line.style.setProperty('--line-len', length);
                    line.style.setProperty('--line-angle', ang + 'deg');
                    nav.appendChild(line);
                }
            }
        });
    }

    function updateConstellationNav() {
        document.querySelectorAll('.vr-constellation-dot').forEach(function (dot) {
            var id = dot.getAttribute('data-panel-id');
            dot.classList.toggle('active', id === S.currentPanel.id);
        });
    }

    // =============================================
    // AUTONOMOUS FLOATING DOCK
    // =============================================
    function initAutonomousDock() {
        var dockContainer = document.getElementById('vr-dock');
        if (!dockContainer) return;

        var track = document.getElementById('vr-dock-track');
        if (!track) return;

        // Transform dock into autonomous floating system
        dockContainer.classList.add('vr-dock-autonomous');
        var buttons = Array.from(track.querySelectorAll('.vr-dock-btn'));

        // Set up physics for each button
        buttons.forEach(function (btn, i) {
            var angle = (i / buttons.length) * Math.PI * 2;
            var radius = 120 + Math.random() * 60;
            var centerX = window.innerWidth / 2;
            var centerY = window.innerHeight - 100;

            var dockBtn = {
                el: btn,
                section: btn.getAttribute('data-section'),
                // Physics
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * 30,
                vx: 0,
                vy: 0,
                targetX: centerX + Math.cos(angle) * radius,
                targetY: centerY + Math.sin(angle) * 30,
                // Personality
                wanderPhase: Math.random() * Math.PI * 2,
                wanderSpeed: 0.005 + Math.random() * 0.01,
                wanderRadius: 8 + Math.random() * 15,
                attractionStrength: 0.02 + Math.random() * 0.02,
                // AI state
                priority: 0,
                glowing: false,
                pulsePhase: Math.random() * Math.PI * 2,
                // Size/scale
                baseScale: 1,
                scale: 1,
            };

            S.dockButtons.push(dockBtn);

            // Click handler
            btn.addEventListener('click', function (e) {
                if (S.spatialActive && S.panelMap[dockBtn.section]) {
                    e.preventDefault();
                    navigateTo(dockBtn.section);
                    emitButtonClickParticles(dockBtn);
                }
            });

            // Mouse interaction — buttons react to cursor proximity
            btn.addEventListener('mouseenter', function () {
                dockBtn.scale = 1.2;
                dockBtn.glowing = true;
            });
            btn.addEventListener('mouseleave', function () {
                dockBtn.scale = 1;
                dockBtn.glowing = false;
            });
        });

        // Position buttons initially
        updateDockPositions();
    }

    function initStaticDock() {
        // Fallback dock for reduced motion
        var dock = document.getElementById('vr-dock');
        if (!dock) return;
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

    function updateDockPhysics() {
        if (S.dockButtons.length === 0) return;

        var now = Date.now() * 0.001;
        var w = window.innerWidth;
        var h = window.innerHeight;
        var margin = CFG.DOCK_BOUNDARY_MARGIN;

        for (var i = 0; i < S.dockButtons.length; i++) {
            var btn = S.dockButtons[i];

            // Wander — each button has autonomous floating behavior
            btn.wanderPhase += btn.wanderSpeed;
            var wanderX = Math.cos(btn.wanderPhase) * btn.wanderRadius;
            var wanderY = Math.sin(btn.wanderPhase * 0.7) * btn.wanderRadius * 0.5;

            // Gravity toward base position + wander
            var tx = btn.targetX + wanderX;
            var ty = btn.targetY + wanderY;
            btn.vx += (tx - btn.x) * CFG.DOCK_GRAVITY;
            btn.vy += (ty - btn.y) * CFG.DOCK_GRAVITY;

            // Mouse attraction — buttons gently drift toward cursor
            if (!S.mobile && !S.idle) {
                var dxm = S.mx - btn.x;
                var dym = S.my - btn.y;
                var distM = Math.sqrt(dxm * dxm + dym * dym);
                if (distM < CFG.DOCK_MOUSE_RADIUS && distM > 30) {
                    var pull = CFG.DOCK_MOUSE_ATTRACT * (1 - distM / CFG.DOCK_MOUSE_RADIUS);
                    btn.vx += (dxm / distM) * pull * btn.priority;
                    btn.vy += (dym / distM) * pull * btn.priority;
                }
            }

            // Repulsion between buttons
            for (var j = i + 1; j < S.dockButtons.length; j++) {
                var other = S.dockButtons[j];
                var dx = btn.x - other.x;
                var dy = btn.y - other.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CFG.DOCK_REPULSION && dist > 1) {
                    var force = CFG.DOCK_REPULSION_FORCE * (1 - dist / CFG.DOCK_REPULSION);
                    var fx = (dx / dist) * force;
                    var fy = (dy / dist) * force;
                    btn.vx += fx;
                    btn.vy += fy;
                    other.vx -= fx;
                    other.vy -= fy;
                }
            }

            // Damping
            btn.vx *= CFG.DOCK_DAMPING;
            btn.vy *= CFG.DOCK_DAMPING;

            // Integrate
            btn.x += btn.vx;
            btn.y += btn.vy;

            // Boundary constraints
            btn.x = Math.max(margin, Math.min(w - margin, btn.x));
            btn.y = Math.max(margin, Math.min(h - margin, btn.y));

            // Pulse animation for high-priority buttons
            var pulse = btn.priority > 5 ? 1 + Math.sin(now * 2 + btn.pulsePhase) * 0.03 : 1;
            var finalScale = btn.scale * pulse;

            // Apply transform
            btn.el.style.transform = 'translate(' + btn.x.toFixed(1) + 'px, ' + btn.y.toFixed(1) + 'px) scale(' + finalScale.toFixed(3) + ')';

            // Glow intensity based on priority
            if (btn.priority > 3) {
                var glowIntensity = Math.min(btn.priority / 20, 1);
                btn.el.style.setProperty('--btn-glow', glowIntensity.toFixed(2));
                btn.el.classList.add('vr-dock-btn-alive');
            } else {
                btn.el.classList.remove('vr-dock-btn-alive');
            }
        }
    }

    function updateDockPositions() {
        // Recalculate ideal positions based on priorities
        var scored = S.dockButtons.map(function (btn) {
            btn.priority = getSectionPriority(btn.section);
            return btn;
        });
        scored.sort(function (a, b) { return b.priority - a.priority; });

        var w = window.innerWidth;
        var h = window.innerHeight;

        // Arrange in a flowing arc at the bottom — highest priority in center
        var arcCenterX = w / 2;
        var arcCenterY = h - 80;
        var arcSpread = Math.min(w * 0.6, 500);

        scored.forEach(function (btn, i) {
            var t = scored.length > 1 ? (i / (scored.length - 1)) - 0.5 : 0;
            btn.targetX = arcCenterX + t * arcSpread;
            btn.targetY = arcCenterY + Math.abs(t) * 40; // slight arc curve
        });
    }

    function updateDockButtonStates() {
        if (!S.currentPanel) return;
        S.dockButtons.forEach(function (btn) {
            btn.el.classList.toggle('active', btn.section === S.currentPanel.id);
        });
    }

    function updateDockAI() {
        // Update priorities and reposition targets
        updateDockPositions();

        // The predicted panel's dock button should glow more
        if (S.predictedPanel) {
            S.dockButtons.forEach(function (btn) {
                btn.el.classList.toggle('vr-dock-btn-predicted', btn.section === S.predictedPanel.id);
            });
        }
    }

    function emitButtonClickParticles(dockBtn) {
        for (var i = 0; i < 6; i++) {
            var p = document.createElement('div');
            p.className = 'vr-btn-particle';
            var angle = (i / 6) * Math.PI * 2;
            var dist = 30 + Math.random() * 50;
            p.style.left = dockBtn.x + 'px';
            p.style.top = dockBtn.y + 'px';
            p.style.setProperty('--tx', (dockBtn.x + Math.cos(angle) * dist).toFixed(0) + 'px');
            p.style.setProperty('--ty', (dockBtn.y + Math.sin(angle) * dist).toFixed(0) + 'px');
            document.body.appendChild(p);
            setTimeout(function (el) { return function () { if (el.parentNode) el.remove(); }; }(p), 800);
        }
    }

    // =============================================
    // PREDICTION ENGINE
    // =============================================
    function updatePrediction() {
        if (!S.currentPanel) return;
        var predicted = predictNextPanel(S.currentPanel.id);
        S.predictedPanel = predicted;

        // Update edge glow for predicted direction
        if (predicted) {
            var dc = predicted.col - S.currentPanel.col;
            var dr = predicted.row - S.currentPanel.row;

            ['top', 'bottom', 'left', 'right'].forEach(function (dir) {
                var el = document.getElementById('vr-edge-' + dir);
                if (el) el.classList.remove('vr-edge-predicted');
            });

            if (dr < 0) setPredictedEdge('top');
            if (dr > 0) setPredictedEdge('bottom');
            if (dc < 0) setPredictedEdge('left');
            if (dc > 0) setPredictedEdge('right');
        }

        // Update edge indicators for available directions
        updateEdgeIndicators();

        // Anticipatory content loading for predicted panel
        if (predicted) {
            predicted.el.querySelectorAll('img[data-src]').forEach(function (img) {
                if (!img.src || img.src === '') {
                    img.src = img.getAttribute('data-src');
                }
            });
        }
    }

    function setPredictedEdge(dir) {
        var el = document.getElementById('vr-edge-' + dir);
        if (el) el.classList.add('vr-edge-predicted');
    }

    function updateEdgeIndicators() {
        if (!S.currentPanel) return;
        var cc = S.currentPanel.col, cr = S.currentPanel.row;
        var edges = { top: false, bottom: false, left: false, right: false };

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

    // =============================================
    // DOPAMINE & ENGAGEMENT MECHANICS
    // =============================================
    function checkDiscovery(sectionId) {
        if (profile.discoveries.indexOf(sectionId) === -1) {
            profile.discoveries.push(sectionId);
            S.discoveryCount++;
            saveProfile();

            // Discovery reward!
            showDiscoveryReward(sectionId);
        }
    }

    function showDiscoveryReward(sectionId) {
        var reward = document.createElement('div');
        reward.className = 'vr-discovery-reward';

        var label = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        var discoveredCount = profile.discoveries.length;
        var totalSections = S.panels.length;

        reward.innerHTML =
            '<div class="vr-discovery-icon">&#10024;</div>' +
            '<div class="vr-discovery-text">' +
            '<span class="vr-discovery-title">D\u00e9couverte !</span>' +
            '<span class="vr-discovery-label">' + label + '</span>' +
            '<span class="vr-discovery-progress">' + discoveredCount + '/' + totalSections + '</span>' +
            '</div>';

        document.body.appendChild(reward);
        void reward.offsetHeight;
        reward.classList.add('vr-discovery-show');

        // Discovery particles
        emitDiscoveryParticles(reward);

        setTimeout(function () {
            reward.classList.remove('vr-discovery-show');
            reward.classList.add('vr-discovery-hide');
            setTimeout(function () { if (reward.parentNode) reward.remove(); }, 500);
        }, 3000);
    }

    function emitDiscoveryParticles(rewardEl) {
        var rect = rewardEl.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        for (var i = 0; i < CFG.DISCOVERY_PARTICLE_COUNT; i++) {
            var p = document.createElement('div');
            p.className = 'vr-discovery-particle';
            var angle = (i / CFG.DISCOVERY_PARTICLE_COUNT) * Math.PI * 2;
            var dist = 40 + Math.random() * 80;
            p.style.left = cx + 'px';
            p.style.top = cy + 'px';
            p.style.setProperty('--tx', (cx + Math.cos(angle) * dist).toFixed(0) + 'px');
            p.style.setProperty('--ty', (cy + Math.sin(angle) * dist).toFixed(0) + 'px');
            p.style.setProperty('--hue', Math.floor(160 + Math.random() * 80));
            document.body.appendChild(p);
            setTimeout(function (el) { return function () { if (el.parentNode) el.remove(); }; }(p), 1000);
        }
    }

    function checkEngagementReward() {
        var now = Date.now();
        if (now - S.lastRewardTime < CFG.REWARD_INTERVAL) return;

        // Micro-reward for sustained engagement
        if (S.interactionCount > 5) {
            S.lastRewardTime = now;
            showEngagementPulse();
        }
    }

    function showEngagementPulse() {
        var pulse = document.createElement('div');
        pulse.className = 'vr-engagement-pulse';
        document.body.appendChild(pulse);
        setTimeout(function () { if (pulse.parentNode) pulse.remove(); }, 2000);
    }

    // Streak display on first visit of session
    function showStreakBanner() {
        if (profile.streak <= 1) return;
        var banner = document.createElement('div');
        banner.className = 'vr-streak-banner';
        banner.innerHTML =
            '<span class="vr-streak-fire">&#128293;</span>' +
            '<span class="vr-streak-text">' + profile.streak + ' jours cons\u00e9cutifs</span>' +
            '<span class="vr-streak-fire">&#128293;</span>';
        document.body.appendChild(banner);
        void banner.offsetHeight;
        banner.classList.add('vr-streak-show');
        setTimeout(function () {
            banner.classList.remove('vr-streak-show');
            banner.classList.add('vr-streak-hide');
            setTimeout(function () { if (banner.parentNode) banner.remove(); }, 600);
        }, 3500);
    }

    // =============================================
    // MAGNETIC UI
    // =============================================
    function initMagnetics() {
        if (S.mobile) return;
        document.querySelectorAll(
            '.btn, .overlay-social-link, .footer-social a, .ambiance-card-cta'
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

    // =============================================
    // CARD TILT
    // =============================================
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

    // =============================================
    // CLICK RIPPLE
    // =============================================
    document.addEventListener('click', function (e) {
        if (S.mobile) return;
        var r = document.createElement('div');
        r.className = 'vr-ripple';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        document.body.appendChild(r);
        setTimeout(function () { if (r.parentNode) r.remove(); }, 800);
    });

    // =============================================
    // PARALLAX
    // =============================================
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

    // =============================================
    // REVEALS
    // =============================================
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

    // =============================================
    // MENU OVERLAY
    // =============================================
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

    // =============================================
    // SMOOTH SCROLL
    // =============================================
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

    // =============================================
    // PARTICLES
    // =============================================
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

    // =============================================
    // CARD GLOW
    // =============================================
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

    // =============================================
    // IDLE BREATHING
    // =============================================
    function resetIdle() {
        if (S.idle) { S.idle = false; document.body.classList.remove('vr-idle'); }
        clearTimeout(S.idleTimer);
        S.idleTimer = setTimeout(function () {
            S.idle = true;
            document.body.classList.add('vr-idle');
            // Idle triggers: autonomous dock buttons start wandering more
            S.dockButtons.forEach(function (btn) {
                btn.wanderRadius = 15 + Math.random() * 25;
            });
        }, CFG.IDLE_TIMEOUT);
    }

    // =============================================
    // SPEED INDICATOR
    // =============================================
    function updateSpeedIndicator() {
        var speed = Math.sqrt(S.driftVX * S.driftVX + S.driftVY * S.driftVY);
        var indicator = document.getElementById('vr-speed-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'vr-speed-indicator';
            indicator.className = 'vr-speed-indicator';
            indicator.setAttribute('aria-hidden', 'true');
            document.body.appendChild(indicator);
        }

        if (speed > 1) {
            var level = Math.min(Math.floor(speed / 2), 5);
            indicator.style.opacity = Math.min(speed / 8, 0.8);
            indicator.setAttribute('data-level', level);
            indicator.classList.add('visible');

            // Direction arrow
            var angle = Math.atan2(S.driftVY, S.driftVX) * 180 / Math.PI;
            indicator.style.setProperty('--speed-angle', angle + 'deg');
        } else {
            indicator.classList.remove('visible');
        }
    }

    // =============================================
    // MAIN ANIMATION LOOP
    // =============================================
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
        updateCanvasDrift();
        updateDockPhysics();
        updateSpeedIndicator();

        requestAnimationFrame(animate);
    }

    // =============================================
    // EVENTS
    // =============================================
    document.addEventListener('mousemove', function (e) {
        S.mx = e.clientX;
        S.my = e.clientY;
        resetIdle();
        S.interactionCount++;
    });

    document.addEventListener('touchmove', function (e) {
        if (e.touches.length) {
            S.mx = e.touches[0].clientX;
            S.my = e.touches[0].clientY;
        }
        resetIdle();
    }, { passive: true });

    window.addEventListener('resize', function () {
        S.mobile = window.matchMedia('(max-width: 768px)').matches;
        // Recalculate dock positions on resize
        updateDockPositions();
    });

    document.addEventListener('keydown', resetIdle);
    document.addEventListener('click', resetIdle);

    // Track session duration for profile
    window.addEventListener('beforeunload', function () {
        var duration = Date.now() - S.sessionStartTime;
        profile.sessionDurations.push(duration);
        if (profile.sessionDurations.length > 20) profile.sessionDurations.shift();
        saveProfile();
    });

    // =============================================
    // INIT
    // =============================================
    document.addEventListener('DOMContentLoaded', function () {
        initConstellationCanvas();
        initAutonomousDock();
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

        // Show streak after a brief delay
        setTimeout(showStreakBanner, 1500);

        // Periodically reshuffle panel positions as user behavior evolves
        setInterval(function () {
            reshufflePanelPositions();
            buildConstellationNav();
        }, 60000);
    });

})();
