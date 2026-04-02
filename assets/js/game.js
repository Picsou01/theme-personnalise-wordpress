/**
 * Virealys Experience v3.0 — Jeu 2D Top-Down Complet
 * Canvas fullscreen + deplacement libre + joystick mobile
 */
(function () {
    'use strict';

    var SAVE_KEY = 'vr_game3';
    var TILE = 40;
    var SPEED = 3;
    var TYPE_SPEED = 30;
    var INTERACT_DIST = 50;

    /* ═══════════════════════════════════════
       COLORS
       ═══════════════════════════════════════ */
    var C = {
        bg: '#06060f', floor1: '#0e0e20', floor2: '#101025',
        wall: '#1a1a30', wallTop: '#12122a', door: '#00e5ff',
        cyan: '#00e5ff', gold: '#ffd700', purple: '#a855f7', pink: '#e040fb', green: '#10b981',
        text: '#c8d6e5', white: '#ffffff', muted: '#7a8ba0',
        skinDef: '#d4a373', hairDef: '#2c1810', outfitDef: '#00e5ff'
    };

    /* ═══════════════════════════════════════
       AVATAR OPTIONS
       ═══════════════════════════════════════ */
    var SKINS = ['#fce4c0','#f4c794','#d4a373','#a67c5a','#6b4226','#3d2314'];
    var HAIRS = ['#2c1810','#5a3825','#c4883f','#e8c547','#d44e28','#1a1a2e','#e0e0e0','#ff69b4'];
    var OUTFITS = ['#00e5ff','#4d7cff','#a855f7','#e040fb','#10b981','#f97316','#ef4444','#ffd700'];
    var EYES_C = ['#2c1810','#1a6b3d','#2563eb','#7c3aed','#92400e'];

    /* ═══════════════════════════════════════
       ROOMS — maps (simple grid)
       Each room: { name, bg, floor, entities[], doors[], w, h }
       Entities: { type, x, y, w, h, color, label, dialogueId }
       Doors: { x, y, w, h, target, spawnX, spawnY, label }
       ═══════════════════════════════════════ */
    var ROOMS = {
        'entree': {
            name: 'Entr\u00e9e', bg: '#020010', floor: '#0a0a1a', w: 600, h: 400,
            entities: [
                { type: 'decor', x: 250, y: 30, w: 100, h: 40, color: C.cyan, label: 'VIREALYS', isSign: true },
                { type: 'npc', x: 300, y: 200, w: 20, h: 20, color: '#f4c794', label: 'Portier', dialogueId: 'portier' }
            ],
            doors: [
                { x: 260, y: 350, w: 80, h: 20, target: 'lobby', spawnX: 300, spawnY: 60, label: 'Entrer' }
            ]
        },
        'lobby': {
            name: 'Le Hall', bg: '#06060f', floor: '#0e0e20', w: 800, h: 600,
            entities: [
                { type: 'npc', x: 400, y: 250, w: 20, h: 20, color: '#f4c794', label: 'H\u00f4te', dialogueId: 'hote' },
                { type: 'decor', x: 350, y: 50, w: 100, h: 30, color: C.gold, label: 'Accueil' },
                { type: 'decor', x: 100, y: 400, w: 60, h: 60, color: '#1a2a1a', label: 'Plante' },
                { type: 'decor', x: 650, y: 400, w: 60, h: 60, color: '#1a2a1a', label: 'Plante' }
            ],
            doors: [
                { x: 360, y: 0, w: 80, h: 15, target: 'entree', spawnX: 300, spawnY: 300, label: 'Sortie' },
                { x: 0, y: 200, w: 15, h: 80, target: 'zone_origine', spawnX: 550, spawnY: 300, label: 'Origine' },
                { x: 785, y: 200, w: 15, h: 80, target: 'zone_voyage', spawnX: 50, spawnY: 300, label: 'Voyage' },
                { x: 0, y: 400, w: 15, h: 80, target: 'zone_immersion', spawnX: 550, spawnY: 300, label: 'Immersion' },
                { x: 785, y: 400, w: 15, h: 80, target: 'zone_sensoriel', spawnX: 50, spawnY: 300, label: 'Sensoriel' },
                { x: 360, y: 585, w: 80, h: 15, target: 'cuisine', spawnX: 300, spawnY: 60, label: 'Cuisine' },
                { x: 700, y: 0, w: 80, h: 15, target: 'bar', spawnX: 200, spawnY: 350, label: 'Bar' }
            ]
        },
        'cuisine': {
            name: 'La Cuisine', bg: '#0f0a05', floor: '#1a1510', w: 600, h: 400,
            entities: [
                { type: 'npc', x: 250, y: 150, w: 20, h: 20, color: '#f4c794', label: 'Le Chef', dialogueId: 'chef' },
                { type: 'decor', x: 100, y: 100, w: 120, h: 40, color: '#333', label: 'Plan de travail' },
                { type: 'decor', x: 350, y: 100, w: 120, h: 40, color: '#333', label: 'Fourneau' },
                { type: 'decor', x: 200, y: 250, w: 80, h: 30, color: '#2a1a10', label: 'Plat signature', dialogueId: 'plat' }
            ],
            doors: [
                { x: 260, y: 0, w: 80, h: 15, target: 'lobby', spawnX: 400, spawnY: 540, label: 'Hall' }
            ],
            stamp: 'cuisine'
        },
        'zone_origine': {
            name: 'Zone Origine', bg: '#050f05', floor: '#0a1a0a', w: 600, h: 500,
            entities: [
                { type: 'npc', x: 400, y: 200, w: 20, h: 20, color: '#d4a373', label: 'Serveur', dialogueId: 'serveur_o' },
                { type: 'decor', x: 150, y: 200, w: 80, h: 50, color: '#2a1a10', label: 'Table' },
                { type: 'decor', x: 350, y: 350, w: 80, h: 50, color: '#2a1a10', label: 'Table' },
                { type: 'decor', x: 100, y: 100, w: 30, h: 40, color: '#3a2a10', label: 'Bougie', dialogueId: 'bougie' }
            ],
            doors: [
                { x: 585, y: 250, w: 15, h: 80, target: 'lobby', spawnX: 40, spawnY: 240, label: 'Hall' }
            ],
            stamp: 'origine'
        },
        'zone_voyage': {
            name: 'Zone Voyage', bg: '#050510', floor: '#0a0a1a', w: 600, h: 500,
            entities: [
                { type: 'npc', x: 200, y: 200, w: 20, h: 20, color: '#d4a373', label: 'Sommelier', dialogueId: 'sommelier' },
                { type: 'decor', x: 300, y: 50, w: 200, h: 100, color: '#1a1a3a', label: 'Projection murale' },
                { type: 'decor', x: 100, y: 350, w: 80, h: 50, color: '#2a1a10', label: 'Table' },
                { type: 'decor', x: 400, y: 350, w: 80, h: 50, color: '#2a1a10', label: 'Table' }
            ],
            doors: [
                { x: 0, y: 250, w: 15, h: 80, target: 'lobby', spawnX: 740, spawnY: 240, label: 'Hall' }
            ],
            stamp: 'voyage'
        },
        'zone_immersion': {
            name: 'Zone Immersion', bg: '#0a0520', floor: '#12082a', w: 600, h: 500,
            entities: [
                { type: 'decor', x: 50, y: 50, w: 500, h: 150, color: '#1a0a3a', label: 'Projections 270\u00b0', dialogueId: 'projection270' },
                { type: 'decor', x: 250, y: 300, w: 100, h: 60, color: '#2a1a10', label: 'Votre table', dialogueId: 'table_imm' },
                { type: 'npc', x: 450, y: 350, w: 20, h: 20, color: '#d4a373', label: 'Guide', dialogueId: 'guide_imm' }
            ],
            doors: [
                { x: 585, y: 250, w: 15, h: 80, target: 'lobby', spawnX: 40, spawnY: 440, label: 'Hall' }
            ],
            stamp: 'immersion'
        },
        'zone_sensoriel': {
            name: 'Zone Sensoriel', bg: '#100520', floor: '#1a0830', w: 600, h: 500,
            entities: [
                { type: 'decor', x: 200, y: 100, w: 200, h: 80, color: '#2a0a4a', label: 'Brume parfum\u00e9e', dialogueId: 'brume' },
                { type: 'decor', x: 250, y: 300, w: 100, h: 60, color: '#2a1a10', label: 'Table vibration', dialogueId: 'table_sens' },
                { type: 'npc', x: 100, y: 250, w: 20, h: 20, color: '#d4a373', label: 'Ma\u00eetre', dialogueId: 'maitre_sens' }
            ],
            doors: [
                { x: 0, y: 250, w: 15, h: 80, target: 'lobby', spawnX: 740, spawnY: 440, label: 'Hall' }
            ],
            stamp: 'sensoriel'
        },
        'bar': {
            name: 'Le Bar', bg: '#0a0510', floor: '#0f0a1a', w: 500, h: 400,
            entities: [
                { type: 'decor', x: 100, y: 50, w: 300, h: 40, color: '#2a1a30', label: 'Comptoir' },
                { type: 'npc', x: 250, y: 80, w: 20, h: 20, color: '#d4a373', label: 'Barman', dialogueId: 'barman' },
                { type: 'decor', x: 100, y: 250, w: 60, h: 40, color: '#1a1a2a', label: 'Table basse' },
                { type: 'decor', x: 340, y: 250, w: 60, h: 40, color: '#1a1a2a', label: 'Table basse' }
            ],
            doors: [
                { x: 200, y: 385, w: 80, h: 15, target: 'lobby', spawnX: 740, spawnY: 40, label: 'Hall' }
            ],
            stamp: 'bar'
        }
    };

    /* ═══════════════════════════════════════
       DIALOGUES
       ═══════════════════════════════════════ */
    var DLG = {
        portier: ['Bonsoir ! Bienvenue chez Virealys.', 'Le premier restaurant Slow Food immersif.', 'Entrez, l\'h\u00f4te vous attend.'],
        hote: ['Bienvenue dans le Hall de Virealys !', 'Quatre zones vous attendent :', '\u2022 Origine \u2014 L\'essentiel du go\u00fbt', '\u2022 Voyage \u2014 Projections et accords mets-vins', '\u2022 Immersion \u2014 Projection 270\u00b0', '\u2022 Sensoriel \u2014 Exp\u00e9rience totale', 'La cuisine et le bar sont aussi ouverts.', 'Explorez et collectez vos tampons !'],
        chef: ['Bienvenue dans ma cuisine !', 'Tout est Slow Food : local, saisonnier.', 'Ce soir : filet de Wagyu, laquage miso,', 'truffe noire du P\u00e9rigord.', 'Imaginez les ar\u00f4mes...', 'Seule une visite peut vous les offrir.'],
        plat: ['Un plat magnifique est en pr\u00e9paration.', 'Chaque \u00e9l\u00e9ment plac\u00e9 avec pr\u00e9cision.', 'L\'ar\u00f4me emplit la cuisine...', 'Votre \u00e9cran ne peut pas le transmettre.'],
        serveur_o: ['Bienvenue en Zone Origine.', 'Formule Classique \u00e0 45\u20ac.', 'Chaque ingr\u00e9dient vient de moins de 50km.', 'Le carpaccio de Saint-Jacques est divin.'],
        bougie: ['La flamme danse doucement.', 'Pas de projection, pas d\'effet.', 'Juste vous et la gastronomie. L\'essentiel.'],
        sommelier: ['Bonsoir ! Testons vos connaissances...', 'Quel vin avec un carpaccio de Saint-Jacques ?', '(Le Muscadet S\u00e8vre-et-Maine est id\u00e9al !)'],
        projection270: ['Les murs disparaissent.', 'Des for\u00eats enchant\u00e9es, des oc\u00e9ans...', '12 m\u00e8tres de projection. \u00c0 couper le souffle.', 'Impossible \u00e0 reproduire sur un \u00e9cran.'],
        table_imm: ['Vous vous asseyez.', 'Les projections 270\u00b0 vous enveloppent.', 'Le son spatial murmure autour de vous.', 'Vous oubliez que c\'est un restaurant.'],
        guide_imm: ['Les ambiances changent chaque saison :', 'For\u00eat \u2022 Oc\u00e9an \u2022 Aurore \u2022 Cosmos', 'Chaque visite est unique.'],
        brume: ['Une brume l\u00e9g\u00e8re envahit l\'espace...', 'Parfum\u00e9e \u00e0 la lavande.', 'Le sol vibre doucement.', 'C\'est impossible \u00e0 reproduire ici.', 'Ce moment n\'existe qu\'en vrai.'],
        table_sens: ['La table vibre au rythme de la musique.', 'Les vibrations montent dans vos mains.', 'Chaque plat d\u00e9clenche une transformation.'],
        maitre_sens: ['Zone Sensoriel. L\'exp\u00e9rience totale.', 'Brume, vibrations, son spatial.', 'Formule \u00e0 120\u20ac \u2014 7 services.', 'R\u00e9servez pour vivre \u00e7a.'],
        barman: ['Bonsoir ! Le cocktail Constellation ?', 'Gin au thym, tonic artisanal, yuzu.', 'Servi avec une brume glac\u00e9e.', 'Visuellement spectaculaire.']
    };

    var STAMPS_DEF = { cuisine:'\ud83d\udc68\u200d\ud83c\udf73', origine:'\ud83c\udf3f', voyage:'\u2708\ufe0f', immersion:'\ud83c\udf0a', sensoriel:'\u2728', bar:'\ud83c\udf78' };

    /* ═══════════════════════════════════════
       STATE
       ═══════════════════════════════════════ */
    var state = {
        phase: 'creation',
        room: 'entree',
        px: 300, py: 300,
        name: '',
        skin: 0, hair: 0, outfit: 0, eyes: 0,
        xp: 0, stamps: [], visited: [],
        talking: false, dialogueLines: [], dialogueIdx: 0, dialogueSpeaker: ''
    };

    var keys = {};
    var canvas, ctx, uiEl, dpr;
    var joystick = { active: false, sx: 0, sy: 0, dx: 0, dy: 0 };
    var nearEntity = null;
    var animFrame;

    /* ═══════════════════════════════════════
       INIT
       ═══════════════════════════════════════ */
    function init() {
        var container = document.getElementById('vr-game');
        if (!container) return;

        container.innerHTML = '<canvas id="vr-canvas"></canvas>' +
            '<div id="vr-ui" class="vr-ui"></div>' +
            '<div id="vr-dialogue" class="vr-dlg" style="display:none">' +
                '<div class="vr-dlg-speaker" id="vr-dlg-speaker"></div>' +
                '<div class="vr-dlg-text" id="vr-dlg-text"></div>' +
                '<div class="vr-dlg-hint">Cliquez pour continuer</div>' +
            '</div>' +
            '<div id="vr-hud" class="vr-hud"></div>' +
            '<div id="vr-joystick" class="vr-joy"><div class="vr-joy-knob" id="vr-joy-knob"></div></div>' +
            '<button id="vr-interact-btn" class="vr-interact-btn" style="display:none">E</button>';

        canvas = document.getElementById('vr-canvas');
        ctx = canvas.getContext('2d');
        uiEl = document.getElementById('vr-ui');

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resize();
        window.addEventListener('resize', resize);

        if (loadSave() && state.phase === 'playing') {
            startGame();
        } else {
            showCreation();
        }
    }

    function resize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ═══════════════════════════════════════
       CHARACTER CREATION (DOM overlay)
       ═══════════════════════════════════════ */
    function showCreation() {
        state.phase = 'creation';
        canvas.style.display = 'none';
        document.getElementById('vr-hud').style.display = 'none';
        document.getElementById('vr-joystick').style.display = 'none';

        var html = '<div class="gc-screen"><h2 class="gc-title">Cr\u00e9ez votre personnage</h2>' +
            '<canvas id="gc-preview" width="120" height="160" style="display:block;margin:0 auto 1rem"></canvas>' +
            '<div class="gc-form">' +
            field('Pr\u00e9nom', '<input type="text" class="gc-input" id="gc-name" placeholder="Votre pr\u00e9nom" maxlength="20">') +
            colorField('Peau', 'skin', SKINS) +
            colorField('Yeux', 'eyes', EYES_C) +
            colorField('Cheveux', 'hair', HAIRS) +
            colorField('Tenue', 'outfit', OUTFITS) +
            '</div><button class="game-choice-btn gc-start" id="gc-start">\u2726 Entrer chez Virealys \u2726</button></div>';
        uiEl.innerHTML = html;
        uiEl.style.display = 'block';

        drawPreviewAvatar();

        document.querySelectorAll('.gc-color-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var t = btn.getAttribute('data-type');
                var i = parseInt(btn.getAttribute('data-idx'));
                state[t] = i;
                document.querySelectorAll('.gc-color-btn[data-type="' + t + '"]').forEach(function (b) { b.classList.remove('gc-color-active'); });
                btn.classList.add('gc-color-active');
                drawPreviewAvatar();
            });
        });

        document.getElementById('gc-start').addEventListener('click', function () {
            state.name = (document.getElementById('gc-name').value.trim()) || 'Voyageur';
            state.phase = 'playing';
            state.room = 'entree';
            state.px = 300; state.py = 300;
            uiEl.style.display = 'none';
            save();
            startGame();
        });
    }

    function field(label, input) {
        return '<div class="gc-field"><label class="gc-label">' + label + '</label>' + input + '</div>';
    }

    function colorField(label, type, colors) {
        var btns = '';
        colors.forEach(function (c, i) {
            btns += '<button class="gc-color-btn' + (state[type] === i ? ' gc-color-active' : '') + '" data-type="' + type + '" data-idx="' + i + '" style="background:' + c + '"></button>';
        });
        return field(label, '<div class="gc-colors">' + btns + '</div>');
    }

    function drawPreviewAvatar() {
        var pc = document.getElementById('gc-preview');
        if (!pc) return;
        var c = pc.getContext('2d');
        c.clearRect(0, 0, 120, 160);
        drawAvatar(c, 60, 80, 3, SKINS[state.skin], HAIRS[state.hair], OUTFITS[state.outfit], EYES_C[state.eyes]);
    }

    /* ═══════════════════════════════════════
       DRAW AVATAR (on any canvas context)
       ═══════════════════════════════════════ */
    function drawAvatar(c, x, y, scale, skin, hair, outfit, eyes) {
        var s = scale || 1;
        // Legs
        c.fillStyle = skin;
        c.fillRect(x - 5*s, y + 8*s, 4*s, 10*s);
        c.fillRect(x + 1*s, y + 8*s, 4*s, 10*s);
        // Body
        c.fillStyle = outfit;
        c.beginPath();
        c.roundRect(x - 7*s, y - 4*s, 14*s, 14*s, 3*s);
        c.fill();
        // Head
        c.fillStyle = skin;
        c.beginPath();
        c.arc(x, y - 12*s, 8*s, 0, Math.PI * 2);
        c.fill();
        // Hair
        c.fillStyle = hair;
        c.beginPath();
        c.arc(x, y - 15*s, 8*s, Math.PI, 0);
        c.fill();
        // Eyes
        c.fillStyle = eyes || '#2c1810';
        c.beginPath();
        c.arc(x - 3*s, y - 13*s, 1.5*s, 0, Math.PI * 2);
        c.arc(x + 3*s, y - 13*s, 1.5*s, 0, Math.PI * 2);
        c.fill();
        // Eye shine
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(x - 2.5*s, y - 13.5*s, 0.5*s, 0, Math.PI * 2);
        c.arc(x + 3.5*s, y - 13.5*s, 0.5*s, 0, Math.PI * 2);
        c.fill();
        // Mouth
        c.strokeStyle = 'rgba(0,0,0,0.3)';
        c.lineWidth = s;
        c.beginPath();
        c.arc(x, y - 9*s, 2*s, 0.1, Math.PI - 0.1);
        c.stroke();
    }

    /* ═══════════════════════════════════════
       START GAME
       ═══════════════════════════════════════ */
    function startGame() {
        canvas.style.display = 'block';
        document.getElementById('vr-hud').style.display = 'flex';
        document.getElementById('vr-joystick').style.display = 'block';
        uiEl.style.display = 'none';

        // Controls
        document.addEventListener('keydown', function (e) {
            keys[e.key] = true;
            if (e.key === 'e' || e.key === 'E') tryInteract();
            if ((e.key === ' ' || e.key === 'Enter') && state.talking) advanceDialogue();
        });
        document.addEventListener('keyup', function (e) { keys[e.key] = false; });

        // Dialogue click
        document.getElementById('vr-dialogue').addEventListener('click', function () {
            if (state.talking) advanceDialogue();
        });

        // Interact button
        document.getElementById('vr-interact-btn').addEventListener('click', tryInteract);

        // Joystick
        initJoystick();

        // Canvas click to interact
        canvas.addEventListener('click', function () {
            if (state.talking) { advanceDialogue(); return; }
            if (nearEntity) tryInteract();
        });

        loop();
    }

    /* ═══════════════════════════════════════
       JOYSTICK (mobile)
       ═══════════════════════════════════════ */
    function initJoystick() {
        var joy = document.getElementById('vr-joystick');
        var knob = document.getElementById('vr-joy-knob');

        joy.addEventListener('touchstart', function (e) {
            e.preventDefault();
            joystick.active = true;
            var r = joy.getBoundingClientRect();
            joystick.sx = r.left + r.width / 2;
            joystick.sy = r.top + r.height / 2;
        }, { passive: false });

        document.addEventListener('touchmove', function (e) {
            if (!joystick.active) return;
            var t = e.touches[0];
            var dx = t.clientX - joystick.sx;
            var dy = t.clientY - joystick.sy;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var maxD = 35;
            if (dist > maxD) { dx = dx / dist * maxD; dy = dy / dist * maxD; }
            knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            joystick.dx = dx / maxD;
            joystick.dy = dy / maxD;
        }, { passive: true });

        document.addEventListener('touchend', function () {
            joystick.active = false;
            joystick.dx = 0; joystick.dy = 0;
            knob.style.transform = 'translate(0,0)';
        });
    }

    /* ═══════════════════════════════════════
       GAME LOOP
       ═══════════════════════════════════════ */
    function loop() {
        update();
        draw();
        animFrame = requestAnimationFrame(loop);
    }

    function update() {
        if (state.talking) return;

        var dx = 0, dy = 0;
        if (keys['ArrowUp'] || keys['w'] || keys['z']) dy = -1;
        if (keys['ArrowDown'] || keys['s']) dy = 1;
        if (keys['ArrowLeft'] || keys['q'] || keys['a']) dx = -1;
        if (keys['ArrowRight'] || keys['d']) dx = 1;

        if (joystick.active) {
            dx = joystick.dx;
            dy = joystick.dy;
        }

        if (dx || dy) {
            var len = Math.sqrt(dx * dx + dy * dy);
            dx = dx / len * SPEED;
            dy = dy / len * SPEED;
        }

        var room = ROOMS[state.room];
        var nx = state.px + dx;
        var ny = state.py + dy;

        // Bounds
        if (nx > 15 && nx < room.w - 15) state.px = nx;
        if (ny > 15 && ny < room.h - 15) state.py = ny;

        // Collision with entities
        room.entities.forEach(function (e) {
            if (rectCollide(state.px - 8, state.py - 8, 16, 16, e.x, e.y, e.w, e.h)) {
                state.px -= dx;
                state.py -= dy;
            }
        });

        // Door check
        room.doors.forEach(function (d) {
            if (rectCollide(state.px - 8, state.py - 8, 16, 16, d.x, d.y, d.w, d.h)) {
                changeRoom(d.target, d.spawnX, d.spawnY);
            }
        });

        // Nearest interactable
        nearEntity = null;
        var minDist = INTERACT_DIST;
        room.entities.forEach(function (e) {
            if (!e.dialogueId) return;
            var ex = e.x + e.w / 2, ey = e.y + e.h / 2;
            var dist = Math.sqrt(Math.pow(state.px - ex, 2) + Math.pow(state.py - ey, 2));
            if (dist < minDist) { minDist = dist; nearEntity = e; }
        });

        var btn = document.getElementById('vr-interact-btn');
        if (nearEntity) {
            btn.style.display = 'block';
            btn.textContent = nearEntity.label;
        } else {
            btn.style.display = 'none';
        }

        updateHUD();
    }

    function rectCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }

    function changeRoom(roomId, sx, sy) {
        state.room = roomId;
        state.px = sx; state.py = sy;
        if (state.visited.indexOf(roomId) < 0) {
            state.visited.push(roomId);
            state.xp += 15;
        }
        var room = ROOMS[roomId];
        if (room.stamp && state.stamps.indexOf(room.stamp) < 0) {
            state.stamps.push(room.stamp);
            state.xp += 25;
        }
        save();
    }

    /* ═══════════════════════════════════════
       DRAW
       ═══════════════════════════════════════ */
    function draw() {
        var w = canvas.width / dpr;
        var h = canvas.height / dpr;
        var room = ROOMS[state.room];

        // Camera
        var cx = state.px - w / 2;
        var cy = state.py - h / 2;
        cx = Math.max(0, Math.min(cx, room.w - w));
        cy = Math.max(0, Math.min(cy, room.h - h));

        ctx.save();
        ctx.translate(-cx, -cy);

        // Background
        ctx.fillStyle = room.bg;
        ctx.fillRect(0, 0, room.w, room.h);

        // Floor tiles
        ctx.fillStyle = room.floor;
        for (var tx = 0; tx < room.w; tx += TILE) {
            for (var ty = 0; ty < room.h; ty += TILE) {
                if ((tx / TILE + ty / TILE) % 2 === 0) {
                    ctx.fillRect(tx + 1, ty + 1, TILE - 2, TILE - 2);
                }
            }
        }

        // Wall borders
        ctx.fillStyle = C.wall;
        ctx.fillRect(0, 0, room.w, 10);
        ctx.fillRect(0, room.h - 10, room.w, 10);
        ctx.fillRect(0, 0, 10, room.h);
        ctx.fillRect(room.w - 10, 0, 10, room.h);

        // Doors
        room.doors.forEach(function (d) {
            ctx.fillStyle = C.door;
            ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 500) * 0.2;
            ctx.fillRect(d.x, d.y, d.w, d.h);
            ctx.globalAlpha = 1;
            ctx.fillStyle = C.white;
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(d.label, d.x + d.w / 2, d.y + d.h / 2 + 3);
        });

        // Entities
        room.entities.forEach(function (e) {
            if (e.isSign) {
                ctx.fillStyle = 'rgba(0,229,255,0.15)';
                ctx.fillRect(e.x, e.y, e.w, e.h);
                ctx.fillStyle = C.cyan;
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(e.label, e.x + e.w / 2, e.y + e.h / 2 + 5);
            } else {
                ctx.fillStyle = e.color;
                if (e.type === 'npc') {
                    // NPC as circle
                    ctx.beginPath();
                    ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2 + 4, 0, Math.PI * 2);
                    ctx.fill();
                    // NPC highlight if near
                    if (nearEntity === e) {
                        ctx.strokeStyle = C.cyan;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2 + 8, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                } else {
                    ctx.fillRect(e.x, e.y, e.w, e.h);
                    if (nearEntity === e) {
                        ctx.strokeStyle = C.cyan;
                        ctx.lineWidth = 2;
                        ctx.strokeRect(e.x - 2, e.y - 2, e.w + 4, e.h + 4);
                    }
                }
                ctx.fillStyle = C.muted;
                ctx.font = '8px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(e.label, e.x + e.w / 2, e.y - 5);
            }
        });

        // Player
        drawAvatar(ctx, state.px, state.py, 1.2, SKINS[state.skin], HAIRS[state.hair], OUTFITS[state.outfit], EYES_C[state.eyes]);
        ctx.fillStyle = C.cyan;
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.name, state.px, state.py + 25);

        ctx.restore();

        // Room name overlay
        ctx.fillStyle = 'rgba(6,6,15,0.6)';
        ctx.fillRect(w / 2 - 60, 8, 120, 22);
        ctx.fillStyle = C.white;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.name, w / 2, 23);
    }

    /* ═══════════════════════════════════════
       HUD
       ═══════════════════════════════════════ */
    function updateHUD() {
        var hud = document.getElementById('vr-hud');
        var stampsHtml = '';
        Object.keys(STAMPS_DEF).forEach(function (k) {
            var earned = state.stamps.indexOf(k) >= 0;
            stampsHtml += '<span class="vr-hud-stamp' + (earned ? ' earned' : '') + '">' + STAMPS_DEF[k] + '</span>';
        });
        hud.innerHTML = '<span class="vr-hud-name">' + state.name + '</span>' +
            '<span class="vr-hud-xp">' + state.xp + ' XP</span>' +
            '<span class="vr-hud-stamps">' + stampsHtml + '</span>';
    }

    /* ═══════════════════════════════════════
       DIALOGUE
       ═══════════════════════════════════════ */
    function tryInteract() {
        if (state.talking || !nearEntity || !nearEntity.dialogueId) return;
        var lines = DLG[nearEntity.dialogueId];
        if (!lines) return;
        state.talking = true;
        state.dialogueLines = lines;
        state.dialogueIdx = 0;
        state.dialogueSpeaker = nearEntity.label;
        showDialogueLine();
    }

    function showDialogueLine() {
        var dlg = document.getElementById('vr-dialogue');
        dlg.style.display = 'block';
        document.getElementById('vr-dlg-speaker').textContent = state.dialogueSpeaker;
        var textEl = document.getElementById('vr-dlg-text');
        typewrite(textEl, state.dialogueLines[state.dialogueIdx]);
    }

    function advanceDialogue() {
        state.dialogueIdx++;
        if (state.dialogueIdx >= state.dialogueLines.length) {
            state.talking = false;
            document.getElementById('vr-dialogue').style.display = 'none';
            state.xp += 5;
            save();
            return;
        }
        showDialogueLine();
    }

    var typeInt = null;
    function typewrite(el, text) {
        if (typeInt) clearInterval(typeInt);
        var i = 0; el.textContent = '';
        typeInt = setInterval(function () {
            if (i < text.length) { el.textContent += text.charAt(i); i++; }
            else { clearInterval(typeInt); typeInt = null; }
        }, TYPE_SPEED);
    }

    /* ═══════════════════════════════════════
       SAVE / LOAD
       ═══════════════════════════════════════ */
    function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }
    function loadSave() { try { var d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (d && d.phase) { state = d; return true; } } catch (e) {} return false; }

    /* ═══════════════════════════════════════
       BOOT
       ═══════════════════════════════════════ */
    if (document.getElementById('vr-game')) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
        else init();
    }
})();
