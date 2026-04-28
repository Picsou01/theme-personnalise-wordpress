/**
 * Virealys v11 - Le Voyage des Saveurs
 * Canvas game linking virtual passport rewards to real restaurant visits.
 */
(function () {
    'use strict';

    var SAVE_KEY = 'virealys_passport_v11';
    var WORLD = { w: 1600, h: 900 };
    var BOAT_SPEED = 3.9;
    var DOCK_DIST = 105;
    var PICKUP_DIST = 42;

    var config = window.vrGame || {};
    var reservationUrl = config.reservation_url || '#reservation';
    var homeUrl = config.home_url || '/';
    var monthlyCountry = config.monthly_country || 'Japon nocturne';
    var ajaxUrl = config.ajax_url || '';
    var nonce = config.nonce || '';
    var serverReady = !!config.is_logged_in;
    var syncStatus = serverReady ? 'compte connecte' : 'local';
    var serverSaveTimer = 0;

    var ISLANDS = [
        {
            id: 'origine',
            name: 'Ile Origine',
            zone: 'Slow Food pur',
            x: 265,
            y: 585,
            r: 95,
            color: '#9bbf7a',
            accent: '#d6a05f',
            reward: 'Herbes de saison: amuse-bouche secret',
            text: 'Ici, chaque ingredient virtuel correspond a un produit reel de saison.'
        },
        {
            id: 'voyage',
            name: 'Ile Voyage',
            zone: monthlyCountry,
            x: 438,
            y: 230,
            r: 108,
            color: '#d6a05f',
            accent: '#7dd3c7',
            reward: 'Tampon pays du mois: bonus etoiles x2 en salle',
            text: 'La destination mensuelle change les quetes, les parfums et les accords.'
        },
        {
            id: 'immersion',
            name: 'Ile Immersion',
            zone: 'VR douce',
            x: 1035,
            y: 238,
            r: 118,
            color: '#8bd3ff',
            accent: '#b694ff',
            reward: 'Essai VR prioritaire si vous reservez cette semaine',
            text: 'Le casque ouvre le monde du plat sans couper le lien avec la table.'
        },
        {
            id: 'sensoriel',
            name: 'Ile Sensorielle',
            zone: 'Experience totale',
            x: 1258,
            y: 626,
            r: 112,
            color: '#b694ff',
            accent: '#f4b36b',
            reward: 'Acces a une surprise sensorielle au prochain repas',
            text: 'Les illusions de texture restent un jeu: l assiette, elle, reste vraie.'
        },
        {
            id: 'bar',
            name: 'Ponton Constellation',
            zone: 'Bar',
            x: 790,
            y: 725,
            r: 86,
            color: '#f4b36b',
            accent: '#7dd3c7',
            reward: 'Cocktail Constellation -50%',
            text: 'Convertissez vos etoiles en attentions simples, lisibles, desirables.'
        }
    ];

    var INGREDIENTS = [
        { id: 'yuzu', label: 'Yuzu', x: 515, y: 365, color: '#f7d45b', value: 18 },
        { id: 'shiso', label: 'Shiso', x: 345, y: 495, color: '#91c96f', value: 16 },
        { id: 'riz', label: 'Riz nacre', x: 610, y: 175, color: '#f7efe2', value: 14 },
        { id: 'truffe', label: 'Truffe', x: 1040, y: 415, color: '#4a3526', value: 24 },
        { id: 'miso', label: 'Miso', x: 1180, y: 310, color: '#c77936', value: 20 },
        { id: 'lavande', label: 'Lavande', x: 1330, y: 500, color: '#b694ff', value: 18 },
        { id: 'thym', label: 'Thym', x: 720, y: 610, color: '#9bbf7a', value: 14 },
        { id: 'agrume', label: 'Agrume', x: 900, y: 670, color: '#f4b36b', value: 16 }
    ];

    var REWARDS = [
        { stars: 120, id: 'cocktail', label: 'Cocktail Constellation -50%' },
        { stars: 260, id: 'amuse', label: 'Amuse-bouche secret offert' },
        { stars: 520, id: 'priority', label: 'Acces prioritaire Pays du mois' },
        { stars: 900, id: 'table', label: 'Table immersive recommandee' }
    ];

    var REAL_LOOP = [
        { label: 'Reserver une zone', done: function () { return state.stamps.length > 0; } },
        { label: 'Presenter le code passeport', done: function () { return state.rewards.length > 0; } },
        { label: 'Debloquer une attention en salle', done: function () { return state.realRewards.length > 0; } },
        { label: 'Revenir pour une nouvelle route', done: function () { return state.stamps.length >= 4; } }
    ];

    var canvas, ctx, root, ui = {}, W = 1, H = 1, DPR = 1, scale = 1, ox = 0, oy = 0;
    var keys = {}, frame = 0, nearIsland = null, toastTimer = 0;
    var joy = { active: false, x: 0, y: 0, dx: 0, dy: 0 };
    var state = {
        boat: { x: 800, y: 475, angle: -0.35 },
        stars: 0,
        cargo: [],
        stamps: [],
        rewards: [],
        realRewards: [],
        visited: [],
        selected: null,
        muted: false,
        updated_at: 0
    };

    function $(id) { return document.getElementById(id); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function dist(a, b, x, y) { var dx = a - x, dy = b - y; return Math.sqrt(dx * dx + dy * dy); }
    function has(arr, id) { return arr.indexOf(id) !== -1; }

    function load() {
        var saved = null;
        try {
            saved = JSON.parse(localStorage.getItem(SAVE_KEY));
            if (saved && saved.boat) state = Object.assign(state, saved);
        } catch (e) {}

        if (config.saved_passport && config.saved_passport.boat) {
            var serverStamp = Number(config.saved_passport.updated_at || 0);
            var localStamp = saved ? Number(saved.updated_at || 0) : 0;
            if (!saved || serverStamp > localStamp) {
                state = Object.assign(state, config.saved_passport);
                try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
            }
        }
        normalizeState();
    }

    function normalizeState() {
        state.cargo = Array.isArray(state.cargo) ? state.cargo : [];
        state.stamps = Array.isArray(state.stamps) ? state.stamps : [];
        state.rewards = Array.isArray(state.rewards) ? state.rewards : [];
        state.realRewards = Array.isArray(state.realRewards) ? state.realRewards : [];
        state.visited = Array.isArray(state.visited) ? state.visited : [];
    }

    function save() {
        state.updated_at = Math.floor(Date.now() / 1000);
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
        queueServerSync();
    }

    function queueServerSync() {
        if (!ajaxUrl || !nonce || !serverReady || !window.fetch) {
            syncStatus = serverReady ? 'sync indisponible' : 'passeport local';
            updateSyncText();
            return;
        }
        syncStatus = 'sync...';
        updateSyncText();
        clearTimeout(serverSaveTimer);
        serverSaveTimer = setTimeout(syncPassport, 650);
    }

    function syncPassport() {
        var body = new URLSearchParams();
        body.set('action', 'virealys_sync_passport');
        body.set('nonce', nonce);
        body.set('passport', JSON.stringify(state));

        fetch(ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: body.toString()
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            syncStatus = json && json.success ? 'sync compte' : 'passeport local';
            updateSyncText();
        }).catch(function () {
            syncStatus = 'passeport local';
            updateSyncText();
        });
    }

    function updateSyncText() {
        if (ui.sync) ui.sync.textContent = syncStatus;
    }

    function passportCode() {
        var raw = (state.stamps.join('-') || 'START') + '-' + state.stars;
        var hash = 0;
        for (var i = 0; i < raw.length; i++) hash = (hash * 31 + raw.charCodeAt(i)) % 9973;
        return 'VRL-' + String(hash).padStart(4, '0') + '-' + state.stamps.length + state.rewards.length;
    }

    function realRewardFor(island) {
        if (!island) return '';
        var map = {
            origine: 'Mise en bouche ingredient local',
            voyage: 'Visa ' + monthlyCountry + ' et bonus etoiles en salle',
            immersion: 'Priorite casque VR doux',
            sensoriel: 'Surprise sensorielle au dessert',
            bar: 'Cocktail Constellation -50%'
        };
        return map[island.id] || island.reward;
    }

    function build() {
        root = $('vr-game');
        if (!root) return;
        root.innerHTML = '' +
            '<div class="vr-game-shell">' +
            '<canvas class="vr-game-canvas" id="vg-canvas"></canvas>' +
            '<div class="vg-topbar"><span class="vg-brand">VIREALYS</span><span class="vg-chip" id="vg-stars">0 etoile</span><span class="vg-chip" id="vg-cargo">0 ingredient</span><span class="vg-chip" id="vg-code">VRL-0000-00</span><span class="vg-chip" id="vg-sync">local</span></div>' +
            '<aside class="vg-mission"><h2>Quete du jour</h2><p id="vg-mission-text"></p><div class="vg-progress"><span id="vg-progress"></span></div></aside>' +
            '<aside class="vg-passport"><h2>Passeport</h2><div class="vg-stamps" id="vg-stamps"></div><div class="vg-rewards" id="vg-rewards"></div></aside>' +
            '<aside class="vg-service"><h2>En salle</h2><div id="vg-loop"></div><div class="vg-service-code" id="vg-service-code">VRL-0000</div></aside>' +
            '<div class="vg-dock-card" id="vg-dock"><h2 id="vg-dock-title"></h2><p id="vg-dock-text"></p><div class="vg-dock-actions"><button class="vg-button primary" id="vg-validate">Valider le tampon</button><a class="vg-button" id="vg-book" href="' + reservationUrl + '">Reserver pour convertir</a></div></div>' +
            '<div class="vg-bottom"><button class="vg-button primary" id="vg-dock-btn">Accoster</button><button class="vg-button" id="vg-passport-btn">Code passeport</button><button class="vg-button" id="vg-reset">Recommencer</button></div>' +
            '<div class="vg-joy" id="vg-joy"><span id="vg-joy-knob"></span></div>' +
            '<div class="vg-toast" id="vg-toast" role="status" aria-live="polite"></div>' +
            '</div>';

        canvas = $('vg-canvas');
        ctx = canvas.getContext('2d');
        ui.stars = $('vg-stars');
        ui.cargo = $('vg-cargo');
        ui.code = $('vg-code');
        ui.sync = $('vg-sync');
        ui.mission = $('vg-mission-text');
        ui.progress = $('vg-progress');
        ui.stamps = $('vg-stamps');
        ui.rewards = $('vg-rewards');
        ui.loop = $('vg-loop');
        ui.serviceCode = $('vg-service-code');
        ui.dock = $('vg-dock');
        ui.dockTitle = $('vg-dock-title');
        ui.dockText = $('vg-dock-text');
        ui.toast = $('vg-toast');

        $('vg-dock-btn').addEventListener('click', dock);
        $('vg-validate').addEventListener('click', validateDock);
        $('vg-passport-btn').addEventListener('click', showPassportCode);
        $('vg-reset').addEventListener('click', reset);
        bindControls();
        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(loop);
    }

    function bindControls() {
        document.addEventListener('keydown', function (e) {
            keys[e.key.toLowerCase()] = true;
            if (e.key === 'Enter' || e.key.toLowerCase() === 'e') dock();
        });
        document.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });

        var joyEl = $('vg-joy');
        var knob = $('vg-joy-knob');
        if (!joyEl) return;
        joyEl.addEventListener('pointerdown', function (e) {
            joy.active = true;
            joyEl.setPointerCapture(e.pointerId);
            var r = joyEl.getBoundingClientRect();
            joy.x = r.left + r.width / 2;
            joy.y = r.top + r.height / 2;
            moveJoy(e, knob);
        });
        joyEl.addEventListener('pointermove', function (e) { if (joy.active) moveJoy(e, knob); });
        joyEl.addEventListener('pointerup', function () { endJoy(knob); });
        joyEl.addEventListener('pointercancel', function () { endJoy(knob); });
    }

    function moveJoy(e, knob) {
        var dx = e.clientX - joy.x;
        var dy = e.clientY - joy.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var m = 32;
        if (d > m) { dx = dx / d * m; dy = dy / d * m; }
        joy.dx = dx / m;
        joy.dy = dy / m;
        knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    }

    function endJoy(knob) {
        joy.active = false;
        joy.dx = 0;
        joy.dy = 0;
        knob.style.transform = 'translate(0,0)';
    }

    function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.clientWidth || window.innerWidth;
        H = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.floor(W * DPR);
        canvas.height = Math.floor(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        scale = Math.min(W / WORLD.w, H / WORLD.h);
        ox = (W - WORLD.w * scale) / 2;
        oy = (H - WORLD.h * scale) / 2;
    }

    function sx(x) { return ox + x * scale; }
    function sy(y) { return oy + y * scale; }
    function ss(v) { return v * scale; }

    function inputVector() {
        var x = 0, y = 0;
        if (keys.arrowleft || keys.q || keys.a) x -= 1;
        if (keys.arrowright || keys.d) x += 1;
        if (keys.arrowup || keys.z || keys.w) y -= 1;
        if (keys.arrowdown || keys.s) y += 1;
        if (joy.active) { x += joy.dx; y += joy.dy; }
        var l = Math.sqrt(x * x + y * y);
        if (l > 1) { x /= l; y /= l; }
        return { x: x, y: y };
    }

    function update() {
        var v = inputVector();
        if (v.x || v.y) {
            state.boat.x = clamp(state.boat.x + v.x * BOAT_SPEED, 70, WORLD.w - 70);
            state.boat.y = clamp(state.boat.y + v.y * BOAT_SPEED, 70, WORLD.h - 70);
            state.boat.angle = Math.atan2(v.y, v.x);
            ui.dock.classList.remove('open');
        }

        nearIsland = null;
        var nd = DOCK_DIST;
        ISLANDS.forEach(function (island) {
            var d = dist(state.boat.x, state.boat.y, island.x, island.y);
            if (d < nd) { nd = d; nearIsland = island; }
        });

        INGREDIENTS.forEach(function (item) {
            if (has(state.cargo, item.id)) return;
            if (dist(state.boat.x, state.boat.y, item.x, item.y) < PICKUP_DIST) {
                state.cargo.push(item.id);
                state.stars += item.value;
                unlockRewards();
                toast('Ingredient collecte: ' + item.label + ' +' + item.value + ' etoiles');
                save();
            }
        });
        updateUI();
    }

    function unlockRewards() {
        REWARDS.forEach(function (reward) {
            if (state.stars >= reward.stars && !has(state.rewards, reward.id)) {
                state.rewards.push(reward.id);
                toast('Recompense debloquee: ' + reward.label);
            }
        });
    }

    function dock() {
        if (!nearIsland) {
            toast('Approchez-vous d une ile pour accoster.');
            return;
        }
        state.selected = nearIsland.id;
        ui.dockTitle.textContent = nearIsland.name + ' - ' + nearIsland.zone;
        ui.dockText.textContent = nearIsland.text + ' Recompense: ' + nearIsland.reward + '.';
        ui.dock.classList.add('open');
    }

    function validateDock() {
        var island = ISLANDS.find(function (x) { return x.id === state.selected; });
        if (!island) return;
        var firstVisit = !has(state.stamps, island.id);
        if (firstVisit) {
            state.stamps.push(island.id);
            state.stars += 40 + state.cargo.length * 4;
            if (!has(state.realRewards, island.id)) state.realRewards.push(island.id);
            toast('Tampon ajoute: ' + island.name + '. En salle: ' + realRewardFor(island) + '.');
        } else {
            state.stars += 12;
            toast('Route revisitee: +12 etoiles. Revenez avec un nouveau code en salle.');
        }
        if (!has(state.visited, island.id)) state.visited.push(island.id);
        unlockRewards();
        ui.dock.classList.remove('open');
        save();
        updateUI();
    }

    function showPassportCode() {
        var code = passportCode();
        toast('Code passeport: ' + code + ' - a valider par l equipe en salle.');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).catch(function () {});
        }
    }

    function reset() {
        if (!window.confirm('Recommencer le voyage et effacer ce passeport local ?')) return;
        localStorage.removeItem(SAVE_KEY);
        state = {
            boat: { x: 800, y: 475, angle: -0.35 },
            stars: 0,
            cargo: [],
            stamps: [],
            rewards: [],
            realRewards: [],
            visited: [],
            selected: null,
            muted: false,
            updated_at: 0
        };
        save();
        toast('Nouveau passeport cree.');
    }

    function updateUI() {
        ui.stars.textContent = state.stars + (state.stars > 1 ? ' etoiles' : ' etoile');
        ui.cargo.textContent = state.cargo.length + ' ingredient' + (state.cargo.length > 1 ? 's' : '');
        ui.code.textContent = passportCode();
        if (ui.serviceCode) ui.serviceCode.textContent = passportCode();
        updateSyncText();
        var active = ISLANDS.find(function (x) { return !has(state.stamps, x.id); }) || ISLANDS[0];
        ui.mission.textContent = 'Rejoignez ' + active.name + ', collectez trois ingredients, puis validez le tampon pour transformer vos etoiles en recompense reelle.';
        var progress = Math.min(100, Math.round((state.stamps.length / ISLANDS.length) * 100));
        ui.progress.style.width = progress + '%';

        ui.stamps.innerHTML = ISLANDS.map(function (island) {
            return '<span class="vg-stamp ' + (has(state.stamps, island.id) ? 'earned' : '') + '">' + island.name.replace('Ile ', '') + '</span>';
        }).join('');

        ui.rewards.innerHTML = REWARDS.map(function (reward) {
            var ok = has(state.rewards, reward.id);
            return '<div class="vg-reward"><span>' + reward.label + '</span><strong>' + (ok ? 'pret' : reward.stars + '*') + '</strong></div>';
        }).join('');

        if (ui.loop) {
            ui.loop.innerHTML = REAL_LOOP.map(function (step) {
                return '<div class="vg-loop-step ' + (step.done() ? 'done' : '') + '"><span></span><strong>' + step.label + '</strong></div>';
            }).join('');
        }
    }

    function toast(msg) {
        ui.toast.textContent = msg;
        ui.toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { ui.toast.classList.remove('show'); }, 2800);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        drawWater();
        drawRestaurantPier();
        drawRoutes();
        ISLANDS.forEach(drawIsland);
        INGREDIENTS.forEach(drawIngredient);
        drawBoat();
        drawHudHints();
    }

    function drawWater() {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#06100f');
        g.addColorStop(0.45, '#072126');
        g.addColorStop(1, '#0a1510');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.globalAlpha = 0.22;
        for (var y = -30; y < WORLD.h + 60; y += 34) {
            ctx.beginPath();
            for (var x = -20; x < WORLD.w + 20; x += 26) {
                var yy = y + Math.sin((x + frame * 1.2) * 0.018 + y * 0.02) * 8;
                if (x === -20) ctx.moveTo(sx(x), sy(yy));
                else ctx.lineTo(sx(x), sy(yy));
            }
            ctx.strokeStyle = 'rgba(125,211,199,.17)';
            ctx.lineWidth = Math.max(1, ss(1.2));
            ctx.stroke();
        }
        ctx.restore();

        for (var i = 0; i < 90; i++) {
            var px = (i * 173 + frame * 0.08) % WORLD.w;
            var py = (i * 97) % WORLD.h;
            ctx.fillStyle = i % 7 === 0 ? 'rgba(214,160,95,.7)' : 'rgba(247,239,226,.46)';
            ctx.beginPath();
            ctx.arc(sx(px), sy(py), Math.max(.6, ss(i % 7 === 0 ? 1.8 : 1.1)), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawRoutes() {
        ctx.save();
        ctx.setLineDash([ss(10), ss(14)]);
        ctx.lineWidth = Math.max(1.5, ss(2));
        ctx.strokeStyle = 'rgba(214,160,95,.42)';
        ctx.beginPath();
        ctx.moveTo(sx(800), sy(475));
        ISLANDS.forEach(function (island) {
            ctx.quadraticCurveTo(sx((800 + island.x) / 2), sy((475 + island.y) / 2 - 50), sx(island.x), sy(island.y));
            ctx.moveTo(sx(800), sy(475));
        });
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    function drawRestaurantPier() {
        var x = sx(800), y = sy(475), r = ss(122);
        ctx.save();
        ctx.fillStyle = 'rgba(247,239,226,.07)';
        ctx.strokeStyle = 'rgba(214,160,95,.36)';
        ctx.lineWidth = Math.max(1, ss(2));
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.22, r * .58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(125,211,199,.24)';
        ctx.setLineDash([ss(8), ss(10)]);
        ctx.beginPath();
        ctx.arc(x, y, r * .75, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        for (var i = 0; i < 5; i++) {
            var a = -Math.PI * .85 + i * Math.PI * .42;
            var tx = x + Math.cos(a) * r * .75;
            var ty = y + Math.sin(a) * r * .35;
            ctx.fillStyle = 'rgba(8,16,15,.72)';
            ctx.strokeStyle = 'rgba(247,239,226,.28)';
            ctx.beginPath();
            ctx.ellipse(tx, ty, ss(22), ss(12), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.fillStyle = '#fff7eb';
        ctx.font = '700 ' + Math.max(12, ss(15)) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Restaurant reel', x, y - r * .58);
        ctx.font = Math.max(10, ss(11)) + 'px sans-serif';
        ctx.fillStyle = '#b9c6c0';
        ctx.fillText('ramenez le code passeport en salle', x, y - r * .42);
        ctx.restore();
    }

    function drawIsland(island) {
        var x = sx(island.x), y = sy(island.y), r = ss(island.r);
        var active = nearIsland && nearIsland.id === island.id;
        var grd = ctx.createRadialGradient(x - r * .25, y - r * .3, 0, x, y, r * 1.25);
        grd.addColorStop(0, island.color);
        grd.addColorStop(.62, '#263323');
        grd.addColorStop(1, '#09110f');
        ctx.fillStyle = grd;
        ctx.beginPath();
        for (var i = 0; i < 28; i++) {
            var a = i / 28 * Math.PI * 2;
            var wobble = 1 + Math.sin(i * 2.1 + island.x) * .06 + Math.cos(i * 1.7) * .05;
            var px = x + Math.cos(a) * r * wobble;
            var py = y + Math.sin(a) * r * .72 * wobble;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = active ? island.accent : 'rgba(247,239,226,.16)';
        ctx.lineWidth = active ? Math.max(2, ss(3)) : Math.max(1, ss(1));
        ctx.stroke();

        drawLantern(x - r * .25, y - r * .35, island.accent);
        drawLantern(x + r * .22, y - r * .25, island.accent);
        drawTableMark(x, y + r * .08, r * .42, island.accent);

        ctx.font = '700 ' + Math.max(12, ss(16)) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff7eb';
        ctx.fillText(island.name, x, y + r + ss(28));
        ctx.font = Math.max(10, ss(12)) + 'px sans-serif';
        ctx.fillStyle = '#b9c6c0';
        ctx.fillText(island.zone, x, y + r + ss(46));
    }

    function drawLantern(x, y, color) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4, ss(8)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawTableMark(x, y, r, color) {
        ctx.save();
        ctx.strokeStyle = 'rgba(247,239,226,.45)';
        ctx.fillStyle = 'rgba(8,16,15,.42)';
        ctx.lineWidth = Math.max(1, ss(2));
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * .48, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x - r * .45, y);
        ctx.lineTo(x + r * .45, y);
        ctx.moveTo(x, y - r * .24);
        ctx.lineTo(x, y + r * .24);
        ctx.stroke();
        ctx.restore();
    }

    function drawIngredient(item) {
        if (has(state.cargo, item.id)) return;
        var pulse = 1 + Math.sin(frame * .05 + item.x) * .12;
        var x = sx(item.x), y = sy(item.y), r = ss(16 * pulse);
        ctx.save();
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,.75)';
        ctx.lineWidth = Math.max(1, ss(2));
        ctx.stroke();
        ctx.font = '700 ' + Math.max(9, ss(11)) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff7eb';
        ctx.fillText(item.label, x, y - r - ss(8));
        ctx.restore();
    }

    function drawBoat() {
        var x = sx(state.boat.x), y = sy(state.boat.y);
        var a = state.boat.angle;
        var s = ss(1);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = 'rgba(0,0,0,.28)';
        ctx.beginPath();
        ctx.ellipse(0, 24 * s, 31 * s, 12 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        var hull = ctx.createLinearGradient(-34 * s, 0, 34 * s, 0);
        hull.addColorStop(0, '#4b2a19');
        hull.addColorStop(.48, '#d6a05f');
        hull.addColorStop(1, '#3c2215');
        ctx.fillStyle = hull;
        ctx.beginPath();
        ctx.moveTo(0, -50 * s);
        ctx.bezierCurveTo(42 * s, -25 * s, 34 * s, 44 * s, 0, 58 * s);
        ctx.bezierCurveTo(-34 * s, 44 * s, -42 * s, -25 * s, 0, -50 * s);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(247,239,226,.58)';
        ctx.lineWidth = 2 * s;
        ctx.stroke();
        ctx.fillStyle = '#08100f';
        ctx.beginPath();
        ctx.ellipse(0, 0, 18 * s, 27 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(125,211,199,.45)';
        ctx.stroke();
        ctx.restore();
    }

    function drawHudHints() {
        if (!nearIsland) return;
        ctx.save();
        ctx.font = '700 ' + Math.max(13, ss(15)) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff7eb';
        ctx.fillText('Accoster: Enter ou bouton', sx(state.boat.x), sy(state.boat.y - 78));
        ctx.restore();
    }

    function loop() {
        update();
        draw();
        frame++;
        requestAnimationFrame(loop);
    }

    load();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
})();
