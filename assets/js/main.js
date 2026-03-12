/**
 * Virealys - Nexus Engine v7.0
 * Revolutionary web-graph navigation with radial context menu.
 * Pages form a living web — connections evolve, directions shift.
 * Left-click opens radial menu. Hold & release to navigate.
 * Mouse direction + wheel drive seamless spatial drift.
 * Dopamine mechanics & predictive anticipation.
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
        // Radial menu
        RADIAL_RADIUS: 100,
        RADIAL_INNER: 30,
        RADIAL_HOLD_DELAY: 80,
        RADIAL_ANIM_DURATION: 250,
        // Navigation graph
        NAV_TRANSITION_DURATION: 600,
        CONNECTION_EVOLUTION_INTERVAL: 30000,
        // Engagement
        REWARD_INTERVAL: 15000,
        DISCOVERY_PARTICLE_COUNT: 12,
        // UI
        CURSOR_SIZE: 600,
        MAGNETIC_RADIUS: 120,
        MAGNETIC_STRENGTH: 0.3,
        TILT_MAX: 8,
        IDLE_TIMEOUT: 5000,
        LERP: 0.1,
        PREDICTION_UPDATE: 3000,
    };

    // =============================================
    // NAVIGATION GRAPH DEFINITION
    // Configurable web topology with hierarchy
    // =============================================
    // Graph structure: each node has connections to other nodes.
    // "required" connections = must visit this node to unlock neighbors.
    // Directions are evolutionary — they change over time.
    var DEFAULT_GRAPH = {
        hero: {
            connections: ['concept', 'menus', 'ambiances'],
            required: false, // hero is always accessible
            tier: 0,
        },
        concept: {
            connections: ['hero', 'ambiances', 'zones', 'menus'],
            required: false,
            tier: 1,
        },
        ambiances: {
            connections: ['hero', 'concept', 'zones', 'menus'],
            required: false,
            tier: 1,
        },
        menus: {
            connections: ['hero', 'concept', 'ambiances', 'reservation'],
            required: false,
            tier: 1,
        },
        zones: {
            connections: ['concept', 'ambiances', 'passeport'],
            required: true, // must visit concept or ambiances first
            requiredFrom: ['concept', 'ambiances'],
            tier: 2,
        },
        passeport: {
            connections: ['zones', 'reservation', 'menus'],
            required: true,
            requiredFrom: ['zones'],
            tier: 2,
        },
        reservation: {
            connections: ['menus', 'passeport', 'hero'],
            required: false,
            tier: 3,
        },
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
        // Canvas drift
        canvasX: 0,
        canvasY: 0,
        driftVX: 0,
        driftVY: 0,
        wheelBoost: 0,
        mouseAngle: 0,
        mouseMagnitude: 0,
        mouseHistory: [],
        // Navigation
        currentPanel: null,
        panels: [],
        panelMap: {},
        transitioning: false,
        spatialActive: false,
        graph: null,
        visitedPanels: [],
        unlockedPanels: ['hero'],
        // Radial menu
        radialOpen: false,
        radialEl: null,
        radialItems: [],
        radialHovered: -1,
        radialOriginX: 0,
        radialOriginY: 0,
        mouseDownTime: 0,
        mouseDownButton: -1,
        // Direction assignments (evolutionary)
        directionMap: {},
        // Engagement
        discoveryCount: 0,
        lastRewardTime: 0,
        sessionStartTime: Date.now(),
        interactionCount: 0,
        predictedPanel: null,
    };

    // =============================================
    // USER PROFILE
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
        directionHistory: {},
        sessionDurations: [],
        graphOverrides: null,
    };

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
    if (!profile.directionHistory) profile.directionHistory = {};

    function saveProfile() {
        try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (e) {}
    }

    function trackSection(id) {
        profile.sections[id] = (profile.sections[id] || 0) + 1;
        profile.lastSections.unshift(id);
        if (profile.lastSections.length > 50) profile.lastSections.length = 50;
        profile.totalInteractions = (profile.totalInteractions || 0) + 1;

        // Unlock connected panels
        if (S.graph[id]) {
            S.graph[id].connections.forEach(function (conn) {
                if (S.unlockedPanels.indexOf(conn) === -1) {
                    var node = S.graph[conn];
                    if (!node || !node.required) {
                        S.unlockedPanels.push(conn);
                    } else if (node.requiredFrom) {
                        // Check if we've visited any required predecessor
                        var hasAccess = node.requiredFrom.some(function (req) {
                            return S.visitedPanels.indexOf(req) !== -1;
                        });
                        if (hasAccess) S.unlockedPanels.push(conn);
                    }
                }
            });
        }
        if (S.visitedPanels.indexOf(id) === -1) {
            S.visitedPanels.push(id);
        }
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
        var streakBonus = Math.min(profile.streak, 10) * (freq > 3 ? 2 : 0);
        return freq * 2 + recency + timeBonus + streakBonus;
    }

    function predictNextPanel(currentId) {
        if (!currentId || !S.graph[currentId]) return null;
        var best = null, bestScore = -1;
        var conns = getAvailableConnections(currentId);
        for (var i = 0; i < conns.length; i++) {
            var cid = conns[i];
            var key = currentId + '>' + cid;
            var transFreq = profile.transitions[key] || 0;
            var sectionPri = getSectionPriority(cid);
            var score = transFreq * 4 + sectionPri;
            if (score > bestScore) { bestScore = score; best = cid; }
        }
        return best;
    }

    saveProfile();

    // =============================================
    // NAVIGATION GRAPH
    // =============================================
    function initGraph() {
        S.graph = profile.graphOverrides || JSON.parse(JSON.stringify(DEFAULT_GRAPH));

        // Assign evolutionary directions to connections
        assignDirections();

        // Periodically evolve directions
        setInterval(evolveDirections, CFG.CONNECTION_EVOLUTION_INTERVAL);
    }

    function getAvailableConnections(panelId) {
        if (!S.graph[panelId]) return [];
        return S.graph[panelId].connections.filter(function (conn) {
            return S.unlockedPanels.indexOf(conn) !== -1 && S.panelMap[conn];
        });
    }

    function isLocked(panelId) {
        return S.unlockedPanels.indexOf(panelId) === -1;
    }

    // Assign an angle to each connection from a panel
    // Directions evolve over time and based on user behavior
    function assignDirections() {
        S.directionMap = {};
        for (var panelId in S.graph) {
            if (!S.graph.hasOwnProperty(panelId)) continue;
            var conns = S.graph[panelId].connections;
            S.directionMap[panelId] = {};

            // Check if we have history for this panel
            var history = profile.directionHistory[panelId];
            if (history && Object.keys(history).length === conns.length) {
                // Use stored directions
                for (var conn in history) {
                    S.directionMap[panelId][conn] = history[conn];
                }
            } else {
                // Distribute evenly around the circle
                for (var i = 0; i < conns.length; i++) {
                    var angle = (i / conns.length) * Math.PI * 2 - Math.PI / 2;
                    S.directionMap[panelId][conns[i]] = angle;
                }
                // Store initial assignment
                profile.directionHistory[panelId] = {};
                for (var j = 0; j < conns.length; j++) {
                    profile.directionHistory[panelId][conns[j]] = S.directionMap[panelId][conns[j]];
                }
                saveProfile();
            }
        }
    }

    // Evolve: shuffle directions slightly based on usage patterns
    function evolveDirections() {
        for (var panelId in S.directionMap) {
            if (!S.directionMap.hasOwnProperty(panelId)) continue;
            var conns = Object.keys(S.directionMap[panelId]);
            if (conns.length < 2) continue;

            // Score connections by usage
            var scored = conns.map(function (conn) {
                var key = panelId + '>' + conn;
                return { conn: conn, score: (profile.transitions[key] || 0) + getSectionPriority(conn) };
            });
            scored.sort(function (a, b) { return b.score - a.score; });

            // Redistribute: most used gets top position, others flow around
            for (var i = 0; i < scored.length; i++) {
                var targetAngle = (i / scored.length) * Math.PI * 2 - Math.PI / 2;
                var currentAngle = S.directionMap[panelId][scored[i].conn];
                // Smooth evolution — only shift 15% toward target
                var diff = targetAngle - currentAngle;
                // Normalize to -PI..PI
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                S.directionMap[panelId][scored[i].conn] = currentAngle + diff * 0.15;
            }

            // Save evolved directions
            profile.directionHistory[panelId] = {};
            conns.forEach(function (conn) {
                profile.directionHistory[panelId][conn] = S.directionMap[panelId][conn];
            });
        }
        saveProfile();
    }

    // =============================================
    // RADIAL CONTEXT MENU
    // =============================================
    function createRadialMenu() {
        var el = document.createElement('div');
        el.className = 'vr-radial';
        el.id = 'vr-radial';
        el.setAttribute('aria-hidden', 'true');

        // Center indicator
        var center = document.createElement('div');
        center.className = 'vr-radial-center';
        el.appendChild(center);

        // SVG for segments
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'vr-radial-svg');
        svg.setAttribute('viewBox', '-150 -150 300 300');
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '300');
        el.appendChild(svg);

        // Label container
        var labels = document.createElement('div');
        labels.className = 'vr-radial-labels';
        el.appendChild(labels);

        document.body.appendChild(el);
        S.radialEl = el;
    }

    function openRadialMenu(x, y) {
        if (S.radialOpen || S.transitioning || !S.currentPanel) return;
        S.radialOpen = true;
        S.radialOriginX = x;
        S.radialOriginY = y;
        S.radialHovered = -1;

        var el = S.radialEl;
        el.style.left = x + 'px';
        el.style.top = y + 'px';

        // Get available connections
        var currentId = S.currentPanel.id;
        var conns = getAvailableConnections(currentId);

        // Also add locked connections (shown as locked)
        var allConns = S.graph[currentId] ? S.graph[currentId].connections : [];
        var lockedConns = allConns.filter(function (c) { return conns.indexOf(c) === -1 && S.panelMap[c]; });

        S.radialItems = [];

        // Build segments
        var totalItems = conns.length + lockedConns.length;
        if (totalItems === 0) return;

        var svg = el.querySelector('.vr-radial-svg');
        svg.innerHTML = '';
        var labelsContainer = el.querySelector('.vr-radial-labels');
        labelsContainer.innerHTML = '';

        var angleStep = (Math.PI * 2) / totalItems;
        var radius = CFG.RADIAL_RADIUS;
        var innerR = CFG.RADIAL_INNER;

        // Determine the starting angle based on evolutionary direction map
        var directions = S.directionMap[currentId] || {};

        // Combine all items
        var allItems = conns.map(function (c) { return { id: c, locked: false }; })
            .concat(lockedConns.map(function (c) { return { id: c, locked: true }; }));

        // Sort by their assigned direction angle
        allItems.sort(function (a, b) {
            var angleA = directions[a.id] !== undefined ? directions[a.id] : 0;
            var angleB = directions[b.id] !== undefined ? directions[b.id] : 0;
            return angleA - angleB;
        });

        allItems.forEach(function (item, i) {
            var startAngle = (i / totalItems) * Math.PI * 2 - Math.PI / 2 - angleStep / 2;
            var endAngle = startAngle + angleStep;
            var midAngle = startAngle + angleStep / 2;

            // Create SVG arc segment
            var path = createArcPath(innerR, radius, startAngle, endAngle);
            var segment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            segment.setAttribute('d', path);
            segment.setAttribute('class', 'vr-radial-segment' + (item.locked ? ' locked' : ''));
            segment.setAttribute('data-index', i);
            svg.appendChild(segment);

            // Label
            var labelR = radius + 25;
            var lx = Math.cos(midAngle) * labelR;
            var ly = Math.sin(midAngle) * labelR;

            var label = document.createElement('div');
            label.className = 'vr-radial-label' + (item.locked ? ' locked' : '');
            label.style.left = (150 + lx) + 'px';
            label.style.top = (150 + ly) + 'px';
            var displayName = item.id.charAt(0).toUpperCase() + item.id.slice(1);
            label.innerHTML = (item.locked ? '<span class="vr-radial-lock">&#128274;</span>' : '') + displayName;
            labelsContainer.appendChild(label);

            // Icon inside the segment
            var iconR = (innerR + radius) / 2;
            var ix = Math.cos(midAngle) * iconR;
            var iy = Math.sin(midAngle) * iconR;
            var iconEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            iconEl.setAttribute('x', ix);
            iconEl.setAttribute('y', iy + 4);
            iconEl.setAttribute('class', 'vr-radial-icon' + (item.locked ? ' locked' : ''));
            iconEl.setAttribute('text-anchor', 'middle');
            iconEl.textContent = getIconChar(item.id);
            svg.appendChild(iconEl);

            S.radialItems.push({
                id: item.id,
                locked: item.locked,
                startAngle: startAngle,
                endAngle: endAngle,
                midAngle: midAngle,
                segment: segment,
                label: label,
            });
        });

        // Animate open
        el.classList.add('open');
        el.setAttribute('aria-hidden', 'false');

        // Adaptive radius based on item count
        var adaptedRadius = Math.max(80, 60 + totalItems * 15);
        el.style.setProperty('--radial-radius', adaptedRadius + 'px');
    }

    function getIconChar(sectionId) {
        var icons = {
            hero: '\u2302',       // ⌂
            concept: '\u2B21',    // ⬡
            ambiances: '\u2734',  // ✴
            menus: '\u2442',      // ⑂
            zones: '\u25CE',      // ◎
            passeport: '\u2637',  // ☷
            reservation: '\u2611' // ☑
        };
        return icons[sectionId] || '\u25CF';
    }

    function closeRadialMenu() {
        if (!S.radialOpen) return;
        S.radialOpen = false;
        S.radialHovered = -1;
        if (S.radialEl) {
            S.radialEl.classList.remove('open');
            S.radialEl.setAttribute('aria-hidden', 'true');
        }
    }

    function updateRadialHover(mx, my) {
        if (!S.radialOpen || S.radialItems.length === 0) return;

        var dx = mx - S.radialOriginX;
        var dy = my - S.radialOriginY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);

        // Must be within inner/outer radius
        if (dist < CFG.RADIAL_INNER * 0.5 || dist > CFG.RADIAL_RADIUS * 2) {
            setRadialHover(-1);
            return;
        }

        // Find which segment the angle falls in
        var found = -1;
        for (var i = 0; i < S.radialItems.length; i++) {
            var item = S.radialItems[i];
            var a = normalizeAngle(angle);
            var start = normalizeAngle(item.startAngle);
            var end = normalizeAngle(item.endAngle);

            if (start < end) {
                if (a >= start && a < end) { found = i; break; }
            } else {
                // Wraps around
                if (a >= start || a < end) { found = i; break; }
            }
        }

        setRadialHover(found);
    }

    function normalizeAngle(a) {
        while (a < 0) a += Math.PI * 2;
        while (a >= Math.PI * 2) a -= Math.PI * 2;
        return a;
    }

    function setRadialHover(index) {
        if (index === S.radialHovered) return;
        S.radialHovered = index;

        S.radialItems.forEach(function (item, i) {
            item.segment.classList.toggle('hovered', i === index && !item.locked);
            item.label.classList.toggle('hovered', i === index && !item.locked);
            if (i === index && item.locked) {
                item.segment.classList.add('locked-hover');
                item.label.classList.add('locked-hover');
            } else {
                item.segment.classList.remove('locked-hover');
                item.label.classList.remove('locked-hover');
            }
        });
    }

    function selectRadialItem() {
        if (S.radialHovered < 0 || S.radialHovered >= S.radialItems.length) {
            closeRadialMenu();
            return;
        }

        var item = S.radialItems[S.radialHovered];
        if (item.locked) {
            // Show locked feedback
            showLockedFeedback(item);
            closeRadialMenu();
            return;
        }

        var targetId = item.id;
        closeRadialMenu();

        // Navigate using the direction from the radial
        if (S.panelMap[targetId]) {
            navigateTo(targetId, item.midAngle);
        }
    }

    function showLockedFeedback(item) {
        var el = document.createElement('div');
        el.className = 'vr-locked-feedback';
        el.style.left = S.radialOriginX + 'px';
        el.style.top = S.radialOriginY + 'px';

        var node = S.graph[item.id];
        var reqNames = node && node.requiredFrom
            ? node.requiredFrom.map(function (r) { return r.charAt(0).toUpperCase() + r.slice(1); }).join(' ou ')
            : '?';
        el.innerHTML = '<span class="vr-locked-icon">&#128274;</span> Visitez d\'abord : ' + reqNames;
        document.body.appendChild(el);
        void el.offsetHeight;
        el.classList.add('show');
        setTimeout(function () {
            el.classList.remove('show');
            el.classList.add('hide');
            setTimeout(function () { if (el.parentNode) el.remove(); }, 500);
        }, 2500);
    }

    function createArcPath(innerR, outerR, startAngle, endAngle) {
        var gap = 0.02; // Small gap between segments
        var s = startAngle + gap;
        var e = endAngle - gap;

        var x1 = Math.cos(s) * outerR;
        var y1 = Math.sin(s) * outerR;
        var x2 = Math.cos(e) * outerR;
        var y2 = Math.sin(e) * outerR;
        var x3 = Math.cos(e) * innerR;
        var y3 = Math.sin(e) * innerR;
        var x4 = Math.cos(s) * innerR;
        var y4 = Math.sin(s) * innerR;

        var largeArc = (e - s > Math.PI) ? 1 : 0;

        return 'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) +
            ' A ' + outerR + ' ' + outerR + ' 0 ' + largeArc + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) +
            ' L ' + x3.toFixed(2) + ' ' + y3.toFixed(2) +
            ' A ' + innerR + ' ' + innerR + ' 0 ' + largeArc + ' 0 ' + x4.toFixed(2) + ' ' + y4.toFixed(2) +
            ' Z';
    }

    // =============================================
    // MOUSE TRACKING
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
    // LIVING CANVAS DRIFT
    // =============================================
    function updateCanvasDrift() {
        if (!S.spatialActive || S.transitioning || S.radialOpen) return;

        // Mouse direction drift (gentle)
        if (S.mouseMagnitude > 0.15 && !S.idle) {
            var force = CFG.DRIFT_BASE_SPEED * S.mouseMagnitude;
            S.driftVX += Math.cos(S.mouseAngle) * force;
            S.driftVY += Math.sin(S.mouseAngle) * force;
        }

        // Wheel boost
        if (S.wheelBoost !== 0) {
            var angle = (Math.abs(S.driftVX) > 0.01 || Math.abs(S.driftVY) > 0.01)
                ? Math.atan2(S.driftVY, S.driftVX)
                : S.mouseAngle;
            S.driftVX += Math.cos(angle) * S.wheelBoost;
            S.driftVY += Math.sin(angle) * S.wheelBoost;
            S.wheelBoost *= CFG.DRIFT_WHEEL_DECAY;
            if (Math.abs(S.wheelBoost) < 0.01) S.wheelBoost = 0;
        }

        // Decay
        S.driftVX *= CFG.DRIFT_DECAY;
        S.driftVY *= CFG.DRIFT_DECAY;

        // Clamp speed
        var speed = Math.sqrt(S.driftVX * S.driftVX + S.driftVY * S.driftVY);
        if (speed > 12) {
            S.driftVX = (S.driftVX / speed) * 12;
            S.driftVY = (S.driftVY / speed) * 12;
        }

        S.canvasX += S.driftVX;
        S.canvasY += S.driftVY;

        // Boundary — keep within current panel's connections
        var maxDrift = 200;
        var driftDist = Math.sqrt(S.canvasX * S.canvasX + S.canvasY * S.canvasY);
        if (driftDist > maxDrift) {
            // Elastic pullback
            var pullback = 0.05;
            S.canvasX *= (1 - pullback);
            S.canvasY *= (1 - pullback);
            S.driftVX *= 0.8;
            S.driftVY *= 0.8;
        }

        // Check proximity to connected panels — auto-navigate
        checkDriftNavigation();

        // Apply subtle parallax to active panel
        var spatial = document.getElementById('vr-spatial');
        if (spatial) {
            spatial.style.transform = 'translate(' + (-S.canvasX * 0.3).toFixed(1) + 'px, ' + (-S.canvasY * 0.3).toFixed(1) + 'px)';
        }
    }

    function checkDriftNavigation() {
        if (!S.currentPanel || S.transitioning) return;
        var threshold = 160;
        var driftDist = Math.sqrt(S.canvasX * S.canvasX + S.canvasY * S.canvasY);
        if (driftDist < threshold) return;

        var driftAngle = Math.atan2(S.canvasY, S.canvasX);
        var currentId = S.currentPanel.id;
        var conns = getAvailableConnections(currentId);
        var directions = S.directionMap[currentId] || {};

        // Find which connection aligns with drift direction
        var best = null, bestDot = -Infinity;
        conns.forEach(function (conn) {
            var connAngle = directions[conn] !== undefined ? directions[conn] : 0;
            var dot = Math.cos(driftAngle - connAngle);
            if (dot > 0.5 && dot > bestDot) {
                bestDot = dot;
                best = conn;
            }
        });

        if (best) {
            var connAngle = directions[best];
            navigateTo(best, connAngle);
            S.canvasX = 0;
            S.canvasY = 0;
            S.driftVX *= 0.2;
            S.driftVY *= 0.2;
        }
    }

    // =============================================
    // CONSTELLATION CANVAS
    // =============================================
    function initConstellationCanvas() {
        var spatial = document.getElementById('vr-spatial');
        if (!spatial) return;

        S.spatialActive = true;
        var panelEls = Array.from(spatial.querySelectorAll('.vr-panel'));
        if (panelEls.length === 0) return;

        panelEls.forEach(function (el) {
            var id = el.getAttribute('data-panel');
            var col = parseInt(el.getAttribute('data-grid-col')) || 0;
            var row = parseInt(el.getAttribute('data-grid-row')) || 0;
            var entry = { el: el, id: id, col: col, row: row };
            S.panels.push(entry);
            S.panelMap[id] = entry;
        });

        // Initialize graph
        initGraph();

        // Unlock panels that don't require prerequisites
        for (var pid in S.graph) {
            if (S.graph.hasOwnProperty(pid) && !S.graph[pid].required) {
                if (S.unlockedPanels.indexOf(pid) === -1) {
                    S.unlockedPanels.push(pid);
                }
            }
        }

        S.currentPanel = S.panelMap['hero'] || S.panels[0];
        document.body.classList.add('vr-spatial-active');

        // Build web-map
        buildWebMap();

        // Panel goto
        document.querySelectorAll('.vr-panel-goto').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var target = this.getAttribute('data-goto-panel');
                if (target && S.panelMap[target] && !isLocked(target)) navigateTo(target);
            });
        });

        // Wheel — acceleration
        spatial.addEventListener('wheel', function (e) {
            if (S.transitioning || S.radialOpen) return;
            var panel = S.currentPanel.el;
            var scroller = panel.querySelector('.vr-panel-scroll');
            if (scroller) {
                var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 5;
                var atTop = scroller.scrollTop <= 5;
                if (e.deltaY > 0 && !atBottom) return;
                if (e.deltaY < 0 && !atTop) return;
            }
            e.preventDefault();
            S.wheelBoost += Math.sign(e.deltaY) * CFG.DRIFT_WHEEL_BOOST;
            S.interactionCount++;
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
            S.driftVX += dx * 0.05;
            S.driftVY += dy * 0.05;
        });

        // Keyboard
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

        // First panel reveals
        S.currentPanel.el.querySelectorAll('[data-reveal]').forEach(function (el) {
            el.classList.add('revealed');
        });

        // Prediction cycle
        setInterval(function () {
            S.predictedPanel = predictNextPanel(S.currentPanel.id);
        }, CFG.PREDICTION_UPDATE);

        // Edge indicators
        updateEdgeIndicators();
    }

    // =============================================
    // NAVIGATE TO PANEL
    // =============================================
    function navigateTo(targetId, fromAngle) {
        if (!S.panelMap[targetId] || S.transitioning) return;
        var target = S.panelMap[targetId];
        if (target === S.currentPanel) return;
        S.transitioning = true;

        var fromId = S.currentPanel.id;
        var current = S.currentPanel;

        // Use the angle to determine enter/exit direction
        var dirAngle = fromAngle !== undefined ? fromAngle : 0;
        var dc = Math.round(Math.cos(dirAngle));
        var dr = Math.round(Math.sin(dirAngle));
        if (dc === 0 && dr === 0) dr = 1;

        var exitClass = getExitClass(dc, dr);
        var enterClass = getEnterClass(dc, dr);

        current.el.classList.remove('vr-panel-active');
        current.el.classList.add(exitClass);

        target.el.classList.add(enterClass);
        void target.el.offsetHeight;
        target.el.classList.add('vr-panel-active');
        target.el.classList.remove(enterClass);

        trackSection(targetId);
        trackTransition(fromId, targetId);
        checkDiscovery(targetId);

        target.el.querySelectorAll('[data-reveal]:not(.revealed)').forEach(function (el) {
            el.classList.add('revealed');
        });

        var color = target.el.getAttribute('data-section-color');
        if (color) document.documentElement.style.setProperty('--section-accent', color);

        S.interactionCount++;

        // Emit particles
        emitNavigationParticles(dc, dr);

        setTimeout(function () {
            current.el.classList.remove(exitClass);
            S.currentPanel = target;
            S.transitioning = false;
            updateWebMap();
            updateEdgeIndicators();
        }, CFG.NAV_TRANSITION_DURATION);
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
    // NAVIGATION PARTICLES
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
            p.style.left = cx + 'px';
            p.style.top = cy + 'px';
            p.style.setProperty('--tx', (cx + Math.cos(a) * dist).toFixed(0) + 'px');
            p.style.setProperty('--ty', (cy + Math.sin(a) * dist).toFixed(0) + 'px');
            p.style.setProperty('--delay', (Math.random() * 0.15) + 's');
            p.style.setProperty('--hue', Math.floor(180 + Math.random() * 60));
            document.body.appendChild(p);
            setTimeout((function (el) { return function () { if (el.parentNode) el.remove(); }; })(p), 1200);
        }
    }

    // =============================================
    // WEB MAP (replaces constellation)
    // =============================================
    function buildWebMap() {
        var nav = document.getElementById('vr-panel-nav');
        if (!nav) return;
        nav.innerHTML = '';
        nav.classList.add('vr-web-map');

        // Create a force-directed layout of the graph
        var nodes = {};
        var nodeList = [];

        // Position nodes using a simple force layout
        S.panels.forEach(function (p) {
            var tier = (S.graph[p.id] && S.graph[p.id].tier) || 0;
            nodes[p.id] = {
                id: p.id,
                x: 50 + Math.cos(Math.random() * Math.PI * 2) * 30,
                y: 20 + tier * 25,
                locked: isLocked(p.id),
            };
            nodeList.push(nodes[p.id]);
        });

        // Simple spring layout iterations
        for (var iter = 0; iter < 50; iter++) {
            // Repulsion
            for (var i = 0; i < nodeList.length; i++) {
                for (var j = i + 1; j < nodeList.length; j++) {
                    var dx = nodeList[i].x - nodeList[j].x;
                    var dy = nodeList[i].y - nodeList[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var force = 200 / (dist * dist);
                    nodeList[i].x += (dx / dist) * force;
                    nodeList[i].y += (dy / dist) * force;
                    nodeList[j].x -= (dx / dist) * force;
                    nodeList[j].y -= (dy / dist) * force;
                }
            }
            // Attraction along edges
            for (var pid in S.graph) {
                if (!S.graph.hasOwnProperty(pid) || !nodes[pid]) continue;
                S.graph[pid].connections.forEach(function (conn) {
                    if (!nodes[conn]) return;
                    var dx = nodes[conn].x - nodes[pid].x;
                    var dy = nodes[conn].y - nodes[pid].y;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var force = (dist - 25) * 0.05;
                    nodes[pid].x += (dx / dist) * force;
                    nodes[pid].y += (dy / dist) * force;
                    nodes[conn].x -= (dx / dist) * force;
                    nodes[conn].y -= (dy / dist) * force;
                });
            }
            // Center constraint
            nodeList.forEach(function (n) {
                n.x = Math.max(10, Math.min(90, n.x));
                n.y = Math.max(10, Math.min(90, n.y));
            });
        }

        // Draw edges
        for (var eid in S.graph) {
            if (!S.graph.hasOwnProperty(eid) || !nodes[eid]) continue;
            S.graph[eid].connections.forEach(function (conn) {
                if (!nodes[conn] || eid >= conn) return;
                var line = document.createElement('div');
                line.className = 'vr-web-edge';
                var n1 = nodes[eid], n2 = nodes[conn];
                var x1 = n1.x, y1 = n1.y, x2 = n2.x, y2 = n2.y;
                var dx = x2 - x1, dy = y2 - y1;
                var len = Math.sqrt(dx * dx + dy * dy);
                var angle = Math.atan2(dy, dx) * 180 / Math.PI;
                line.style.width = len + '%';
                line.style.left = x1 + '%';
                line.style.top = y1 + '%';
                line.style.transform = 'rotate(' + angle + 'deg)';
                line.style.transformOrigin = '0 0';
                var isLocked2 = isLocked(eid) || isLocked(conn);
                if (isLocked2) line.classList.add('locked');
                nav.appendChild(line);
            });
        }

        // Draw nodes
        nodeList.forEach(function (n) {
            var dot = document.createElement('button');
            dot.className = 'vr-web-node';
            if (n.id === S.currentPanel.id) dot.classList.add('active');
            if (n.locked) dot.classList.add('locked');
            if (S.visitedPanels.indexOf(n.id) !== -1) dot.classList.add('visited');
            dot.setAttribute('data-panel-id', n.id);
            dot.setAttribute('aria-label', n.id);
            dot.style.left = n.x + '%';
            dot.style.top = n.y + '%';
            dot.addEventListener('click', function () {
                if (!n.locked) navigateTo(n.id);
            });

            var label = document.createElement('span');
            label.className = 'vr-web-node-label';
            label.textContent = n.id.charAt(0).toUpperCase() + n.id.slice(1);
            dot.appendChild(label);

            nav.appendChild(dot);
        });
    }

    function updateWebMap() {
        document.querySelectorAll('.vr-web-node').forEach(function (dot) {
            var id = dot.getAttribute('data-panel-id');
            dot.classList.toggle('active', id === S.currentPanel.id);
            dot.classList.toggle('locked', isLocked(id));
            dot.classList.toggle('visited', S.visitedPanels.indexOf(id) !== -1);
        });
    }

    // =============================================
    // EDGE INDICATORS
    // =============================================
    function updateEdgeIndicators() {
        if (!S.currentPanel) return;
        var currentId = S.currentPanel.id;
        var conns = getAvailableConnections(currentId);
        var directions = S.directionMap[currentId] || {};

        var edges = { top: false, bottom: false, left: false, right: false };

        conns.forEach(function (conn) {
            var angle = directions[conn] !== undefined ? directions[conn] : 0;
            var dx = Math.cos(angle);
            var dy = Math.sin(angle);
            if (dy < -0.3) edges.top = true;
            if (dy > 0.3) edges.bottom = true;
            if (dx < -0.3) edges.left = true;
            if (dx > 0.3) edges.right = true;
        });

        ['top', 'bottom', 'left', 'right'].forEach(function (dir) {
            var el = document.getElementById('vr-edge-' + dir);
            if (el) el.classList.toggle('visible', edges[dir]);
        });

        // Predicted edge
        if (S.predictedPanel && directions[S.predictedPanel]) {
            var pAngle = directions[S.predictedPanel];
            var pdx = Math.cos(pAngle);
            var pdy = Math.sin(pAngle);
            ['top', 'bottom', 'left', 'right'].forEach(function (dir) {
                var el = document.getElementById('vr-edge-' + dir);
                if (el) el.classList.remove('vr-edge-predicted');
            });
            if (pdy < -0.3) setPredictedEdge('top');
            if (pdy > 0.3) setPredictedEdge('bottom');
            if (pdx < -0.3) setPredictedEdge('left');
            if (pdx > 0.3) setPredictedEdge('right');
        }
    }

    function setPredictedEdge(dir) {
        var el = document.getElementById('vr-edge-' + dir);
        if (el) el.classList.add('vr-edge-predicted');
    }

    // =============================================
    // DOPAMINE & ENGAGEMENT
    // =============================================
    function checkDiscovery(sectionId) {
        if (profile.discoveries.indexOf(sectionId) === -1) {
            profile.discoveries.push(sectionId);
            S.discoveryCount++;
            saveProfile();
            showDiscoveryReward(sectionId);
        }
    }

    function showDiscoveryReward(sectionId) {
        var reward = document.createElement('div');
        reward.className = 'vr-discovery-reward';
        var label = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        var count = profile.discoveries.length;
        var total = Object.keys(S.graph).length;

        reward.innerHTML =
            '<div class="vr-discovery-icon">&#10024;</div>' +
            '<div class="vr-discovery-text">' +
            '<span class="vr-discovery-title">D\u00e9couverte !</span>' +
            '<span class="vr-discovery-label">' + label + '</span>' +
            '<span class="vr-discovery-progress">' + count + '/' + total + '</span>' +
            '</div>';

        document.body.appendChild(reward);
        void reward.offsetHeight;
        reward.classList.add('vr-discovery-show');
        emitDiscoveryParticles(reward);

        setTimeout(function () {
            reward.classList.remove('vr-discovery-show');
            reward.classList.add('vr-discovery-hide');
            setTimeout(function () { if (reward.parentNode) reward.remove(); }, 500);
        }, 3000);
    }

    function emitDiscoveryParticles(el) {
        var rect = el.getBoundingClientRect();
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
            setTimeout((function (el) { return function () { if (el.parentNode) el.remove(); }; })(p), 1000);
        }
    }

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
            indicator.style.opacity = Math.min(speed / 8, 0.8);
            indicator.classList.add('visible');
            var angle = Math.atan2(S.driftVY, S.driftVX) * 180 / Math.PI;
            indicator.style.setProperty('--speed-angle', angle + 'deg');
        } else {
            indicator.classList.remove('visible');
        }
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
        if (S.mobile || S.radialOpen) return;
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
            if (e.key === 'Escape') {
                if (S.radialOpen) { closeRadialMenu(); return; }
                if (overlay && overlay.classList.contains('open')) close();
            }
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
    // IDLE
    // =============================================
    function resetIdle() {
        if (S.idle) { S.idle = false; document.body.classList.remove('vr-idle'); }
        clearTimeout(S.idleTimer);
        S.idleTimer = setTimeout(function () {
            S.idle = true;
            document.body.classList.add('vr-idle');
        }, CFG.IDLE_TIMEOUT);
    }

    // =============================================
    // CURSOR LIGHT
    // =============================================
    var cursorLight = null;
    if (!S.mobile && !S.reduced) {
        cursorLight = document.createElement('div');
        cursorLight.className = 'vr-cursor-light';
        cursorLight.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorLight);
    }

    // =============================================
    // MAIN LOOP
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
        updateSpeedIndicator();

        if (S.radialOpen) {
            updateRadialHover(S.mx, S.my);
        }

        requestAnimationFrame(animate);
    }

    // =============================================
    // EVENTS
    // =============================================

    // Left click — radial menu (hold & release)
    document.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return; // left button only
        if (S.mobile) return;
        // Don't open radial on interactive elements
        var tag = e.target.tagName.toLowerCase();
        var isInteractive = tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select';
        var closest = e.target.closest('a, button, input, textarea, select, .menu-overlay, .vr-radial, .vr-web-map');
        if (isInteractive || closest) return;

        S.mouseDownTime = Date.now();
        S.mouseDownButton = 0;
    });

    document.addEventListener('mouseup', function (e) {
        if (e.button !== 0 || S.mobile) return;

        if (S.radialOpen) {
            // Release on a segment = navigate
            selectRadialItem();
            return;
        }

        // If held long enough, open radial
        var holdDuration = Date.now() - S.mouseDownTime;
        if (S.mouseDownButton === 0 && holdDuration >= CFG.RADIAL_HOLD_DELAY) {
            // Don't open if on interactive
            var tag = e.target.tagName.toLowerCase();
            var isInteractive = tag === 'a' || tag === 'button' || tag === 'input';
            var closest = e.target.closest('a, button, input, textarea, select, .menu-overlay');
            if (!isInteractive && !closest && S.spatialActive) {
                openRadialMenu(e.clientX, e.clientY);
            }
        }

        S.mouseDownButton = -1;
    });

    // Context menu prevention on right-click (keep default)
    // We use LEFT click for the radial menu

    // Close radial on right-click or Escape
    document.addEventListener('contextmenu', function () {
        if (S.radialOpen) closeRadialMenu();
    });

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

    // Mobile: long press for radial menu
    var mobileTouchTimer = null;
    document.addEventListener('touchstart', function (e) {
        if (!S.mobile || !S.spatialActive) return;
        var tag = e.target.tagName.toLowerCase();
        var closest = e.target.closest('a, button, input, .menu-overlay, .vr-radial');
        if (tag === 'a' || tag === 'button' || closest) return;

        var tx = e.touches[0].clientX;
        var ty = e.touches[0].clientY;
        mobileTouchTimer = setTimeout(function () {
            openRadialMenu(tx, ty);
        }, 400);
    }, { passive: true });

    document.addEventListener('touchend', function () {
        clearTimeout(mobileTouchTimer);
        if (S.radialOpen) {
            selectRadialItem();
        }
    });

    window.addEventListener('resize', function () {
        S.mobile = window.matchMedia('(max-width: 768px)').matches;
        if (S.radialOpen) closeRadialMenu();
    });

    document.addEventListener('keydown', resetIdle);

    window.addEventListener('beforeunload', function () {
        var duration = Date.now() - S.sessionStartTime;
        profile.sessionDurations = profile.sessionDurations || [];
        profile.sessionDurations.push(duration);
        if (profile.sessionDurations.length > 20) profile.sessionDurations.shift();
        saveProfile();
    });

    // =============================================
    // INIT
    // =============================================
    if (S.reduced) {
        document.addEventListener('DOMContentLoaded', function () {
            initReveals(); initMenuOverlay(); initSmoothScroll();
            initConstellationCanvas();
        });
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            createRadialMenu();
            initConstellationCanvas();
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

            setTimeout(showStreakBanner, 1500);
        });
    }

})();
