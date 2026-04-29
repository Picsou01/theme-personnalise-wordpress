/**
 * Virealys v12 - Le Voyage des Saveurs
 * A restaurant-linked canvas game: sail, collect, compose dishes, validate the passport in-room.
 */
(function () {
    'use strict';

    var SAVE_KEY = 'virealys_passport_v11';
    var WORLD = { w: 1600, h: 900 };
    var BOAT_SPEED = 4.1;
    var DOCK_DIST = 112;
    var PICKUP_DIST = 44;

    var config = window.vrGame || {};
    var reservationUrl = config.reservation_url || '#reservation';
    var monthlyCountry = config.monthly_country || 'Japon nocturne';
    var ajaxUrl = config.ajax_url || '';
    var nonce = config.nonce || '';
    var serverReady = !!config.is_logged_in;
    var syncStatus = serverReady ? 'compte connecte' : 'passeport local';
    var serverSaveTimer = 0;

    var ISLANDS = [
        { id: 'origine', name: 'Ile Origine', zone: 'Slow Food pur', x: 265, y: 585, r: 95, color: '#9bbf7a', accent: '#d6a05f', reward: 'Mise en bouche ingredient local', text: 'La route des producteurs: ce que vous recoltez ici existe dans la vraie assiette.' },
        { id: 'voyage', name: 'Ile Voyage', zone: monthlyCountry, x: 438, y: 230, r: 108, color: '#d6a05f', accent: '#7dd3c7', reward: 'Visa pays du mois', text: 'La destination mensuelle modifie les recettes, les sons, les parfums et les bonus en salle.' },
        { id: 'immersion', name: 'Ile Immersion', zone: 'VR douce', x: 1035, y: 238, r: 118, color: '#8bd3ff', accent: '#b694ff', reward: 'Priorite casque VR', text: 'Le virtuel raconte le plat sans remplacer la conversation a table.' },
        { id: 'sensoriel', name: 'Ile Sensorielle', zone: 'Experience totale', x: 1258, y: 626, r: 112, color: '#b694ff', accent: '#f4b36b', reward: 'Surprise sensorielle', text: 'Les etoiles ouvrent des effets de service: parfum, texture, lumiere et plat cache.' },
        { id: 'bar', name: 'Ponton Constellation', zone: 'Bar', x: 790, y: 725, r: 86, color: '#f4b36b', accent: '#7dd3c7', reward: 'Cocktail Constellation -50%', text: 'Le ponton transforme les gains virtuels en attentions simples et desirables.' }
    ];

    var INGREDIENTS = [
        { id: 'yuzu', label: 'Yuzu', x: 515, y: 365, color: '#f7d45b', value: 18, home: 'voyage' },
        { id: 'shiso', label: 'Shiso', x: 345, y: 495, color: '#91c96f', value: 16, home: 'origine' },
        { id: 'riz', label: 'Riz nacre', x: 610, y: 175, color: '#f7efe2', value: 14, home: 'voyage' },
        { id: 'truffe', label: 'Truffe', x: 1040, y: 415, color: '#4a3526', value: 24, home: 'origine' },
        { id: 'miso', label: 'Miso', x: 1180, y: 310, color: '#c77936', value: 20, home: 'immersion' },
        { id: 'lavande', label: 'Lavande', x: 1330, y: 500, color: '#b694ff', value: 18, home: 'sensoriel' },
        { id: 'thym', label: 'Thym', x: 720, y: 610, color: '#9bbf7a', value: 14, home: 'bar' },
        { id: 'agrume', label: 'Agrume', x: 900, y: 670, color: '#f4b36b', value: 16, home: 'bar' },
        { id: 'algue', label: 'Algue bleue', x: 1450, y: 310, color: '#7dd3c7', value: 22, home: 'sensoriel' },
        { id: 'poivre', label: 'Poivre lune', x: 210, y: 245, color: '#d7c5a6', value: 20, home: 'origine' }
    ];

    var RECIPES = [
        { id: 'nacre_yuzu', chapter: 1, island: 'voyage', name: 'Nacre de yuzu', brief: 'Un premier visa aromatique pour le pays du mois.', needs: { yuzu: 1, shiso: 1, riz: 1 }, stars: 90, reputation: 16, real: 'Amuse-bouche yuzu si le code est presente en salle' },
        { id: 'terre_truffe', chapter: 1, island: 'origine', name: 'Terre de producteurs', brief: 'Rendre le virtuel credible par le terroir.', needs: { truffe: 1, thym: 1, poivre: 1 }, stars: 105, reputation: 18, real: 'Accord pain/huile signature offert' },
        { id: 'orbite_miso', chapter: 2, island: 'immersion', name: 'Orbite miso VR', brief: 'Une assiette augmentee mais toujours lisible.', needs: { miso: 1, algue: 1, riz: 1 }, stars: 130, reputation: 22, real: 'Acces prioritaire a la sequence VR douce' },
        { id: 'songe_lavande', chapter: 2, island: 'sensoriel', name: 'Songe lavande', brief: 'Une route sensorielle pour donner envie de revenir.', needs: { lavande: 1, agrume: 1, yuzu: 1 }, stars: 150, reputation: 25, real: 'Effet parfum et dessert cache' },
        { id: 'constellation_bar', chapter: 3, island: 'bar', name: 'Constellation bar', brief: 'Transformer le voyage en moment social.', needs: { agrume: 1, thym: 1, poivre: 1 }, stars: 170, reputation: 30, real: 'Cocktail Constellation -50%' }
    ];

    var REWARDS = [
        { stars: 120, id: 'cocktail', label: 'Cocktail Constellation -50%' },
        { stars: 260, id: 'amuse', label: 'Amuse-bouche secret offert' },
        { stars: 520, id: 'priority', label: 'Acces prioritaire Pays du mois' },
        { stars: 900, id: 'table', label: 'Table immersive recommandee' }
    ];

    var canvas, ctx, root, ui = {}, W = 1, H = 1, DPR = 1, scale = 1, ox = 0, oy = 0;
    var keys = {}, frame = 0, nearIsland = null, toastTimer = 0, lastHeatTick = 0;
    var joy = { active: false, x: 0, y: 0, dx: 0, dy: 0 };
    var state = {
        boat: { x: 800, y: 475, angle: -0.35 },
        stars: 0,
        reputation: 0,
        heat: 18,
        chapter: 1,
        activeRecipe: 'nacre_yuzu',
        inventory: {},
        cargo: [],
        stamps: [],
        dishes: [],
        rewards: [],
        realRewards: [],
        visited: [],
        discovered: [],
        selected: null,
        updated_at: 0
    };

    function $(id) { return document.getElementById(id); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function dist(a, b, x, y) { var dx = a - x, dy = b - y; return Math.sqrt(dx * dx + dy * dy); }
    function has(arr, id) { return Array.isArray(arr) && arr.indexOf(id) !== -1; }
    function findRecipe(id) { return RECIPES.find(function (r) { return r.id === id; }); }
    function recipeById(id) { return findRecipe(id) || RECIPES[0]; }
    function islandById(id) { return ISLANDS.find(function (i) { return i.id === id; }); }
    function itemById(id) { return INGREDIENTS.find(function (i) { return i.id === id; }); }
    function count(id) { return Number(state.inventory[id] || 0); }

    function load() {
        var saved = null;
        try {
            saved = JSON.parse(localStorage.getItem(SAVE_KEY));
            if (saved && saved.boat) state = Object.assign(state, saved);
        } catch (e) {}
        if (config.saved_passport && config.saved_passport.boat) {
            var serverStamp = Number(config.saved_passport.updated_at || 0);
            var localStamp = saved ? Number(saved.updated_at || 0) : 0;
            if (!saved || serverStamp > localStamp) state = Object.assign(state, config.saved_passport);
        }
        normalizeState();
    }

    function normalizeState() {
        state.inventory = state.inventory && typeof state.inventory === 'object' ? state.inventory : {};
        state.cargo = Array.isArray(state.cargo) ? state.cargo : [];
        state.cargo.forEach(function (id) { state.inventory[id] = Math.max(1, count(id)); });
        state.stamps = Array.isArray(state.stamps) ? state.stamps : [];
        state.dishes = Array.isArray(state.dishes) ? state.dishes : [];
        state.rewards = Array.isArray(state.rewards) ? state.rewards : [];
        state.realRewards = Array.isArray(state.realRewards) ? state.realRewards : [];
        state.visited = Array.isArray(state.visited) ? state.visited : [];
        state.discovered = Array.isArray(state.discovered) ? state.discovered : [];
        state.reputation = Number(state.reputation || 0);
        state.heat = Number(state.heat || 18);
        state.chapter = Number(state.chapter || 1);
        if (!findRecipe(state.activeRecipe) || has(state.dishes, state.activeRecipe)) state.activeRecipe = nextRecipe().id;
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
        }).then(function (res) { return res.json(); })
            .then(function (json) { syncStatus = json && json.success ? 'sync compte' : 'passeport local'; updateSyncText(); })
            .catch(function () { syncStatus = 'passeport local'; updateSyncText(); });
    }

    function passportCode() {
        var raw = [state.stamps.join('-') || 'START', state.dishes.join('-') || 'NO-DISH', state.stars, state.reputation].join('|');
        var hash = 0;
        for (var i = 0; i < raw.length; i++) hash = (hash * 31 + raw.charCodeAt(i)) % 9973;
        return 'VRL-' + String(hash).padStart(4, '0') + '-' + state.dishes.length + state.rewards.length;
    }

    function nextRecipe() {
        return RECIPES.find(function (r) { return !has(state.dishes, r.id); }) || RECIPES[0];
    }

    function canCook(recipe) {
        return Object.keys(recipe.needs).every(function (id) { return count(id) >= recipe.needs[id]; });
    }

    function consume(recipe) {
        Object.keys(recipe.needs).forEach(function (id) {
            state.inventory[id] = Math.max(0, count(id) - recipe.needs[id]);
        });
    }

    function build() {
        root = $('vr-game');
        if (!root) return;
        root.innerHTML = '' +
            '<div class="vr-game-shell">' +
            '<canvas class="vr-game-canvas" id="vg-canvas"></canvas>' +
            '<div class="vg-topbar"><span class="vg-brand">VIREALYS</span><span class="vg-chip" id="vg-stars">0 etoile</span><span class="vg-chip" id="vg-rep">Aura 0</span><span class="vg-chip" id="vg-heat">Service calme</span><span class="vg-chip" id="vg-code">VRL-0000</span><span class="vg-chip" id="vg-sync">local</span></div>' +
            '<aside class="vg-mission"><h2>Mission vivante</h2><p id="vg-mission-text"></p><div class="vg-progress"><span id="vg-progress"></span></div></aside>' +
            '<aside class="vg-recipe"><h2>Plat signature</h2><div id="vg-recipe-card"></div><div id="vg-inventory"></div></aside>' +
            '<aside class="vg-passport"><h2>Passeport</h2><div class="vg-stamps" id="vg-stamps"></div><div class="vg-rewards" id="vg-rewards"></div></aside>' +
            '<aside class="vg-service"><h2>En salle</h2><div id="vg-loop"></div><div class="vg-service-code" id="vg-service-code">VRL-0000</div></aside>' +
            '<div class="vg-dock-card" id="vg-dock"><h2 id="vg-dock-title"></h2><p id="vg-dock-text"></p><div class="vg-dock-actions"><button class="vg-button primary" id="vg-validate">Servir</button><a class="vg-button" id="vg-book" href="' + reservationUrl + '">Reserver pour convertir</a></div></div>' +
            '<div class="vg-bottom"><button class="vg-button primary" id="vg-dock-btn">Accoster</button><button class="vg-button" id="vg-cycle">Changer recette</button><button class="vg-button" id="vg-passport-btn">Code passeport</button><button class="vg-button" id="vg-reset">Recommencer</button></div>' +
            '<div class="vg-joy" id="vg-joy"><span id="vg-joy-knob"></span></div>' +
            '<div class="vg-toast" id="vg-toast" role="status" aria-live="polite"></div>' +
            '</div>';

        canvas = $('vg-canvas');
        ctx = canvas.getContext('2d');
        ui.stars = $('vg-stars');
        ui.rep = $('vg-rep');
        ui.heat = $('vg-heat');
        ui.code = $('vg-code');
        ui.sync = $('vg-sync');
        ui.mission = $('vg-mission-text');
        ui.progress = $('vg-progress');
        ui.recipe = $('vg-recipe-card');
        ui.inventory = $('vg-inventory');
        ui.stamps = $('vg-stamps');
        ui.rewards = $('vg-rewards');
        ui.loop = $('vg-loop');
        ui.serviceCode = $('vg-service-code');
        ui.dock = $('vg-dock');
        ui.dockTitle = $('vg-dock-title');
        ui.dockText = $('vg-dock-text');
        ui.validate = $('vg-validate');
        ui.toast = $('vg-toast');

        $('vg-dock-btn').addEventListener('click', dock);
        ui.validate.addEventListener('click', serveOrStamp);
        $('vg-cycle').addEventListener('click', cycleRecipe);
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
            if (e.key.toLowerCase() === 'r') cycleRecipe();
        });
        document.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
        var joyEl = $('vg-joy'), knob = $('vg-joy-knob');
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
        var dx = e.clientX - joy.x, dy = e.clientY - joy.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1, m = 32;
        if (d > m) { dx = dx / d * m; dy = dy / d * m; }
        joy.dx = dx / m; joy.dy = dy / m;
        knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    }

    function endJoy(knob) {
        joy.active = false;
        joy.dx = 0; joy.dy = 0;
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

        if (frame - lastHeatTick > 90) {
            lastHeatTick = frame;
            state.heat = clamp(state.heat + 0.28 - Math.min(state.reputation, 100) * 0.002, 0, 100);
        }

        nearIsland = null;
        var nd = DOCK_DIST;
        ISLANDS.forEach(function (island) {
            var d = dist(state.boat.x, state.boat.y, island.x, island.y);
            if (d < nd) { nd = d; nearIsland = island; }
        });

        INGREDIENTS.forEach(function (item) {
            if (item.cooldown && item.cooldown > frame) return;
            if (dist(state.boat.x, state.boat.y, item.x, item.y) < PICKUP_DIST) collect(item);
        });
        updateUI();
    }

    function collect(item) {
        state.inventory[item.id] = count(item.id) + 1;
        if (!has(state.discovered, item.id)) state.discovered.push(item.id);
        state.stars += item.value;
        state.heat = clamp(state.heat + 1.4, 0, 100);
        item.cooldown = frame + 620 + Math.floor(Math.random() * 360);
        unlockRewards();
        toast(item.label + ' collecte. Stock: ' + count(item.id));
        save();
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
        var recipe = recipeById(state.activeRecipe);
        var isRecipeIsland = recipe.island === nearIsland.id;
        ui.validate.textContent = isRecipeIsland && canCook(recipe) ? 'Servir le plat' : 'Valider le tampon';
        ui.dockTitle.textContent = nearIsland.name + ' - ' + nearIsland.zone;
        ui.dockText.textContent = nearIsland.text + (isRecipeIsland ? ' Recette active: ' + recipe.name + '.' : ' Recompense: ' + nearIsland.reward + '.');
        ui.dock.classList.add('open');
    }

    function serveOrStamp() {
        var island = ISLANDS.find(function (x) { return x.id === state.selected; });
        if (!island) return;
        var recipe = recipeById(state.activeRecipe);
        if (recipe.island === island.id && canCook(recipe) && !has(state.dishes, recipe.id)) {
            serveRecipe(recipe, island);
        } else {
            stampIsland(island);
        }
        unlockRewards();
        ui.dock.classList.remove('open');
        save();
        updateUI();
    }

    function serveRecipe(recipe, island) {
        consume(recipe);
        state.dishes.push(recipe.id);
        if (!has(state.stamps, island.id)) state.stamps.push(island.id);
        if (!has(state.visited, island.id)) state.visited.push(island.id);
        if (!has(state.realRewards, recipe.id)) state.realRewards.push(recipe.id);
        state.stars += recipe.stars + Math.max(0, Math.round(35 - state.heat / 3));
        state.reputation = clamp(state.reputation + recipe.reputation, 0, 999);
        state.heat = clamp(state.heat - 28, 0, 100);
        state.chapter = Math.max(state.chapter, recipe.chapter + 1);
        state.activeRecipe = nextRecipe().id;
        toast(recipe.name + ' servi. En salle: ' + recipe.real + '.');
    }

    function stampIsland(island) {
        var firstVisit = !has(state.stamps, island.id);
        if (firstVisit) {
            state.stamps.push(island.id);
            state.stars += 42 + Object.keys(state.inventory).length * 3;
            toast('Tampon ajoute: ' + island.name + '.');
        } else {
            state.stars += 12;
            toast('Route revisitee: +12 etoiles. Revenez avec un nouveau code en salle.');
        }
        if (!has(state.visited, island.id)) state.visited.push(island.id);
    }

    function cycleRecipe() {
        var current = RECIPES.indexOf(recipeById(state.activeRecipe));
        for (var i = 1; i <= RECIPES.length; i++) {
            var next = RECIPES[(current + i) % RECIPES.length];
            if (!has(state.dishes, next.id)) {
                state.activeRecipe = next.id;
                toast('Nouvelle recette active: ' + next.name);
                updateUI();
                save();
                return;
            }
        }
        state.activeRecipe = RECIPES[0].id;
        toast('Saison complete. Continuez pour monter l aura du passeport.');
    }

    function showPassportCode() {
        var code = passportCode();
        toast('Code passeport: ' + code + ' - a valider par l equipe en salle.');
        if (navigator.clipboard) navigator.clipboard.writeText(code).catch(function () {});
    }

    function reset() {
        if (!window.confirm('Recommencer le voyage et effacer ce passeport local ?')) return;
        localStorage.removeItem(SAVE_KEY);
        state = {
            boat: { x: 800, y: 475, angle: -0.35 },
            stars: 0,
            reputation: 0,
            heat: 18,
            chapter: 1,
            activeRecipe: 'nacre_yuzu',
            inventory: {},
            cargo: [],
            stamps: [],
            dishes: [],
            rewards: [],
            realRewards: [],
            visited: [],
            discovered: [],
            selected: null,
            updated_at: 0
        };
        save();
        toast('Nouveau passeport cree.');
    }

    function updateSyncText() {
        if (ui.sync) ui.sync.textContent = syncStatus;
    }

    function updateUI() {
        var recipe = recipeById(state.activeRecipe);
        ui.stars.textContent = state.stars + (state.stars > 1 ? ' etoiles' : ' etoile');
        ui.rep.textContent = 'Aura ' + state.reputation;
        ui.heat.textContent = state.heat > 68 ? 'Service intense' : (state.heat > 38 ? 'Service vivant' : 'Service calme');
        ui.code.textContent = passportCode();
        if (ui.serviceCode) ui.serviceCode.textContent = passportCode();
        updateSyncText();

        var missing = Object.keys(recipe.needs).filter(function (id) { return count(id) < recipe.needs[id]; });
        var island = islandById(recipe.island);
        ui.mission.textContent = missing.length
            ? 'Composez ' + recipe.name + ' pour ' + island.name + '. Il manque: ' + missing.map(function (id) { return itemById(id).label; }).join(', ') + '.'
            : 'Tous les ingredients sont prets. Accostez a ' + island.name + ' pour servir le plat et debloquer une recompense reelle.';
        ui.progress.style.width = Math.round((state.dishes.length / RECIPES.length) * 100) + '%';

        ui.recipe.innerHTML = '<strong>' + recipe.name + '</strong><p>' + recipe.brief + '</p><div class="vg-needs">' +
            Object.keys(recipe.needs).map(function (id) {
                var item = itemById(id);
                var ok = count(id) >= recipe.needs[id];
                return '<span class="' + (ok ? 'ready' : '') + '">' + item.label + ' ' + count(id) + '/' + recipe.needs[id] + '</span>';
            }).join('') + '</div><small>Chapitre ' + recipe.chapter + ' - ' + island.name + '</small>';

        var inventoryItems = INGREDIENTS.filter(function (item) { return count(item.id) > 0; });
        ui.inventory.innerHTML = inventoryItems.length
            ? inventoryItems.map(function (item) { return '<span>' + item.label + ' x' + count(item.id) + '</span>'; }).join('')
            : '<span>Inventaire vide</span>';

        ui.stamps.innerHTML = ISLANDS.map(function (i) {
            return '<span class="vg-stamp ' + (has(state.stamps, i.id) ? 'earned' : '') + '">' + i.name.replace('Ile ', '') + '</span>';
        }).join('');

        ui.rewards.innerHTML = REWARDS.map(function (reward) {
            var ok = has(state.rewards, reward.id);
            return '<div class="vg-reward"><span>' + reward.label + '</span><strong>' + (ok ? 'pret' : reward.stars + '*') + '</strong></div>';
        }).join('');

        ui.loop.innerHTML = [
            ['Recettes servies', state.dishes.length + '/' + RECIPES.length, state.dishes.length > 0],
            ['Code presente en salle', state.rewards.length + ' bonus', state.rewards.length > 0],
            ['Reputation immersive', state.reputation + ' aura', state.reputation >= 50],
            ['Retour desirable', state.dishes.length >= 4 ? 'route rare' : 'en cours', state.dishes.length >= 4]
        ].map(function (step) {
            return '<div class="vg-loop-step ' + (step[2] ? 'done' : '') + '"><span></span><strong>' + step[0] + '</strong><em>' + step[1] + '</em></div>';
        }).join('');
    }

    function toast(msg) {
        ui.toast.textContent = msg;
        ui.toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { ui.toast.classList.remove('show'); }, 3200);
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
        ctx.globalAlpha = state.heat > 65 ? 0.34 : 0.22;
        for (var y = -30; y < WORLD.h + 60; y += 34) {
            ctx.beginPath();
            for (var x = -20; x < WORLD.w + 20; x += 26) {
                var yy = y + Math.sin((x + frame * 1.4) * 0.018 + y * 0.02) * (state.heat > 65 ? 12 : 8);
                if (x === -20) ctx.moveTo(sx(x), sy(yy));
                else ctx.lineTo(sx(x), sy(yy));
            }
            ctx.strokeStyle = state.heat > 65 ? 'rgba(244,179,107,.22)' : 'rgba(125,211,199,.17)';
            ctx.lineWidth = Math.max(1, ss(1.2));
            ctx.stroke();
        }
        ctx.restore();
        for (var i = 0; i < 110; i++) {
            var px = (i * 173 + frame * 0.08) % WORLD.w;
            var py = (i * 97) % WORLD.h;
            ctx.fillStyle = i % 7 === 0 ? 'rgba(214,160,95,.72)' : 'rgba(247,239,226,.44)';
            ctx.beginPath();
            ctx.arc(sx(px), sy(py), Math.max(.6, ss(i % 7 === 0 ? 1.8 : 1.1)), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawRoutes() {
        var recipe = recipeById(state.activeRecipe);
        ctx.save();
        ctx.setLineDash([ss(10), ss(14)]);
        ctx.lineWidth = Math.max(1.5, ss(2));
        ISLANDS.forEach(function (island) {
            ctx.strokeStyle = recipe.island === island.id ? 'rgba(247,239,226,.72)' : 'rgba(214,160,95,.32)';
            ctx.beginPath();
            ctx.moveTo(sx(800), sy(475));
            ctx.quadraticCurveTo(sx((800 + island.x) / 2), sy((475 + island.y) / 2 - 50), sx(island.x), sy(island.y));
            ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();
    }

    function drawRestaurantPier() {
        var x = sx(800), y = sy(475), r = ss(126);
        ctx.save();
        ctx.fillStyle = 'rgba(247,239,226,.075)';
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
        ctx.fillText('servez ici pour creer le desir de visite', x, y - r * .42);
        ctx.restore();
    }

    function drawIsland(island) {
        var x = sx(island.x), y = sy(island.y), r = ss(island.r);
        var active = nearIsland && nearIsland.id === island.id;
        var recipeActive = recipeById(state.activeRecipe).island === island.id;
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
        ctx.strokeStyle = active || recipeActive ? island.accent : 'rgba(247,239,226,.16)';
        ctx.lineWidth = active ? Math.max(2, ss(4)) : Math.max(1, ss(recipeActive ? 3 : 1));
        ctx.stroke();
        drawLantern(x - r * .25, y - r * .35, island.accent);
        drawLantern(x + r * .22, y - r * .25, island.accent);
        drawTableMark(x, y + r * .08, r * .42, island.accent);
        ctx.font = '700 ' + Math.max(12, ss(16)) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff7eb';
        ctx.fillText(island.name, x, y + r + ss(28));
        ctx.font = Math.max(10, ss(12)) + 'px sans-serif';
        ctx.fillStyle = recipeActive ? '#fff1a8' : '#b9c6c0';
        ctx.fillText(recipeActive ? 'recette active' : island.zone, x, y + r + ss(46));
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
        if (item.cooldown && item.cooldown > frame) return;
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
        var x = sx(state.boat.x), y = sy(state.boat.y), a = state.boat.angle, s = ss(1);
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
