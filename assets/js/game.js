/**
 * Virealys Experience v4.0 — Jeu 2D Immersif Holographique
 * Salles plein ecran + eclairage + particules + slow food
 */
(function () {
    'use strict';

    var SAVE_KEY = 'vr_game4';
    var SPEED = 2.5;
    var TYPE_SPEED = 30;
    var INTERACT_DIST = 60;
    var PARTICLE_COUNT = 30;

    var SKINS = ['#fce4c0','#f4c794','#d4a373','#a67c5a','#6b4226','#3d2314'];
    var HAIRS = ['#2c1810','#5a3825','#c4883f','#e8c547','#d44e28','#1a1a2e','#e0e0e0','#ff69b4'];
    var OUTFITS = ['#00e5ff','#4d7cff','#a855f7','#e040fb','#10b981','#f97316','#ef4444','#ffd700'];
    var EYES_C = ['#2c1810','#1a6b3d','#2563eb','#7c3aed','#92400e'];
    var STAMPS_DEF = { cuisine:'\ud83d\udc68\u200d\ud83c\udf73', origine:'\ud83c\udf3f', voyage:'\u2708\ufe0f', immersion:'\ud83c\udf0a', sensoriel:'\u2728', bar:'\ud83c\udf78' };

    /* ═══════════════════════════════════════
       ROOMS — each room fills the viewport
       Positions are in % of viewport (0-100)
       ═══════════════════════════════════════ */
    function px(pct, dim) { return pct / 100 * dim; }

    var ROOMS = {
        'entree': {
            name: 'Entr\u00e9e de Virealys',
            bgTop: '#020010', bgBot: '#0a0a2e',
            ambiance: 'nuit', particleColor: 'rgba(0,229,255,0.4)',
            furniture: [
                { type: 'rect', x: 35, y: 5, w: 30, h: 8, color: '#0e1a2e', label: 'VIREALYS', isSign: true },
                { type: 'rect', x: 10, y: 30, w: 8, h: 40, color: '#0a0a1a', label: '' },
                { type: 'rect', x: 82, y: 30, w: 8, h: 40, color: '#0a0a1a', label: '' }
            ],
            npcs: [
                { x: 50, y: 45, label: 'Portier', color: '#d4a373', dlg: 'portier' }
            ],
            doors: [
                { x: 40, y: 88, w: 20, h: 6, target: 'lobby', sx: 50, sy: 15, label: 'Entrer \u2193' }
            ]
        },
        'lobby': {
            name: 'Le Grand Hall',
            bgTop: '#06060f', bgBot: '#12122a',
            ambiance: 'hall', particleColor: 'rgba(255,215,0,0.3)',
            furniture: [
                { type: 'rect', x: 38, y: 3, w: 24, h: 6, color: '#1a1a30', label: 'Accueil Virealys' },
                { type: 'circle', x: 15, y: 75, r: 5, color: '#0a1a0a', label: 'Plante' },
                { type: 'circle', x: 85, y: 75, r: 5, color: '#0a1a0a', label: 'Plante' },
                { type: 'rect', x: 30, y: 40, w: 15, h: 10, color: '#1a1520', label: 'Canap\u00e9' },
                { type: 'rect', x: 55, y: 40, w: 15, h: 10, color: '#1a1520', label: 'Canap\u00e9' }
            ],
            npcs: [
                { x: 50, y: 28, label: 'L\'H\u00f4te', color: '#f4c794', dlg: 'hote' }
            ],
            doors: [
                { x: 40, y: 0, w: 20, h: 4, target: 'entree', sx: 50, sy: 80, label: '\u2191 Sortie' },
                { x: 0, y: 28, w: 4, h: 15, target: 'zone_origine', sx: 90, sy: 50, label: 'Origine \u2190' },
                { x: 96, y: 28, w: 4, h: 15, target: 'zone_voyage', sx: 10, sy: 50, label: 'Voyage \u2192' },
                { x: 0, y: 58, w: 4, h: 15, target: 'zone_immersion', sx: 90, sy: 50, label: 'Immersion \u2190' },
                { x: 96, y: 58, w: 4, h: 15, target: 'zone_sensoriel', sx: 10, sy: 50, label: 'Sensoriel \u2192' },
                { x: 40, y: 94, w: 20, h: 4, target: 'cuisine', sx: 50, sy: 15, label: 'Cuisine \u2193' },
                { x: 80, y: 0, w: 15, h: 4, target: 'bar', sx: 50, sy: 85, label: 'Bar \u2191' }
            ]
        },
        'cuisine': {
            name: 'La Cuisine Slow Food',
            bgTop: '#0f0a05', bgBot: '#1a1510',
            ambiance: 'chaud', particleColor: 'rgba(255,140,0,0.3)',
            furniture: [
                { type: 'rect', x: 15, y: 15, w: 30, h: 8, color: '#2a2a2a', label: 'Plan de travail' },
                { type: 'rect', x: 55, y: 15, w: 25, h: 8, color: '#3a2a1a', label: 'Fourneau' },
                { type: 'rect', x: 20, y: 55, w: 20, h: 12, color: '#2a1a10', label: '\ud83c\udf56 Plat Signature' },
                { type: 'rect', x: 60, y: 55, w: 20, h: 12, color: '#2a2020', label: 'Garde-manger' },
                { type: 'rect', x: 35, y: 75, w: 30, h: 8, color: '#1a1a1a', label: '\u00cele de pr\u00e9paration' }
            ],
            npcs: [
                { x: 40, y: 35, label: 'Le Chef', color: '#f4c794', dlg: 'chef' }
            ],
            doors: [
                { x: 40, y: 0, w: 20, h: 4, target: 'lobby', sx: 50, sy: 88, label: '\u2191 Hall' }
            ],
            stamp: 'cuisine'
        },
        'zone_origine': {
            name: 'Zone Origine \u2014 L\'Essentiel',
            bgTop: '#050f05', bgBot: '#0a1a0a',
            ambiance: 'nature', particleColor: 'rgba(76,175,80,0.3)',
            furniture: [
                { type: 'rect', x: 20, y: 30, w: 18, h: 12, color: '#2a1a10', label: '\ud83d\udd6f Table 1' },
                { type: 'rect', x: 62, y: 30, w: 18, h: 12, color: '#2a1a10', label: '\ud83d\udd6f Table 2' },
                { type: 'rect', x: 20, y: 65, w: 18, h: 12, color: '#2a1a10', label: '\ud83d\udd6f Table 3' },
                { type: 'rect', x: 62, y: 65, w: 18, h: 12, color: '#2a1a10', label: '\ud83d\udd6f Table 4' },
                { type: 'circle', x: 50, y: 15, r: 3, color: '#3a2a10', label: 'Bougie' }
            ],
            npcs: [
                { x: 45, y: 50, label: 'Serveur', color: '#d4a373', dlg: 'serveur_o' }
            ],
            doors: [
                { x: 96, y: 42, w: 4, h: 15, target: 'lobby', sx: 8, sy: 35, label: 'Hall \u2192' }
            ],
            stamp: 'origine'
        },
        'zone_voyage': {
            name: 'Zone Voyage \u2014 L\'\u00c9vasion',
            bgTop: '#050510', bgBot: '#0a0a2a',
            ambiance: 'voyage', particleColor: 'rgba(77,124,255,0.4)',
            furniture: [
                { type: 'rect', x: 20, y: 8, w: 60, h: 20, color: '#0a0a3a', label: '\ud83c\udfa5 Projection Murale \u2014 Vignoble Toscan' },
                { type: 'rect', x: 15, y: 55, w: 18, h: 12, color: '#2a1a10', label: 'Table' },
                { type: 'rect', x: 65, y: 55, w: 18, h: 12, color: '#2a1a10', label: 'Table' },
                { type: 'rect', x: 40, y: 75, w: 20, h: 8, color: '#2a1020', label: '\ud83c\udf77 Pr\u00e9sentoir Vins' }
            ],
            npcs: [
                { x: 35, y: 42, label: 'Sommelier', color: '#d4a373', dlg: 'sommelier' }
            ],
            doors: [
                { x: 0, y: 42, w: 4, h: 15, target: 'lobby', sx: 92, sy: 35, label: '\u2190 Hall' }
            ],
            stamp: 'voyage'
        },
        'zone_immersion': {
            name: 'Zone Immersion \u2014 270\u00b0',
            bgTop: '#0a0520', bgBot: '#15082e',
            ambiance: 'immersion', particleColor: 'rgba(168,85,247,0.4)',
            furniture: [
                { type: 'rect', x: 5, y: 5, w: 90, h: 30, color: '#1a0a3a', label: '\ud83c\udf0c Projections 270\u00b0 \u2014 For\u00eat Enchant\u00e9e' },
                { type: 'rect', x: 35, y: 55, w: 30, h: 15, color: '#2a1a10', label: 'Votre Table Immersive' },
                { type: 'circle', x: 20, y: 70, r: 4, color: '#0a0a2a', label: 'Enceinte Spatiale' },
                { type: 'circle', x: 80, y: 70, r: 4, color: '#0a0a2a', label: 'Enceinte Spatiale' }
            ],
            npcs: [
                { x: 70, y: 50, label: 'Guide', color: '#d4a373', dlg: 'guide_imm' }
            ],
            doors: [
                { x: 96, y: 42, w: 4, h: 15, target: 'lobby', sx: 8, sy: 65, label: 'Hall \u2192' }
            ],
            stamp: 'immersion'
        },
        'zone_sensoriel': {
            name: 'Zone Sensoriel \u2014 Exp\u00e9rience Totale',
            bgTop: '#100520', bgBot: '#1e0835',
            ambiance: 'sensoriel', particleColor: 'rgba(224,64,251,0.4)',
            furniture: [
                { type: 'rect', x: 20, y: 15, w: 60, h: 20, color: '#2a0a4a', label: '\ud83c\udf2b\ufe0f Brume Parfum\u00e9e \u2014 Lavande' },
                { type: 'rect', x: 30, y: 55, w: 40, h: 15, color: '#2a1a10', label: '\u223f Table \u00e0 Vibrations' },
                { type: 'circle', x: 15, y: 50, r: 3, color: '#2a0a3a', label: 'Diffuseur' },
                { type: 'circle', x: 85, y: 50, r: 3, color: '#2a0a3a', label: 'Diffuseur' }
            ],
            npcs: [
                { x: 25, y: 45, label: 'Ma\u00eetre de Salle', color: '#d4a373', dlg: 'maitre_sens' }
            ],
            doors: [
                { x: 0, y: 42, w: 4, h: 15, target: 'lobby', sx: 92, sy: 65, label: '\u2190 Hall' }
            ],
            stamp: 'sensoriel'
        },
        'bar': {
            name: 'Le Bar \u00e0 Cocktails',
            bgTop: '#0a0510', bgBot: '#0f0a1a',
            ambiance: 'bar', particleColor: 'rgba(255,215,0,0.3)',
            furniture: [
                { type: 'rect', x: 15, y: 10, w: 70, h: 10, color: '#2a1a30', label: 'Comptoir' },
                { type: 'rect', x: 10, y: 50, w: 15, h: 10, color: '#1a1a2a', label: 'Table Basse' },
                { type: 'rect', x: 45, y: 50, w: 15, h: 10, color: '#1a1a2a', label: 'Table Basse' },
                { type: 'rect', x: 75, y: 50, w: 15, h: 10, color: '#1a1a2a', label: 'Table Basse' },
                { type: 'circle', x: 90, y: 15, r: 4, color: '#1a0a1a', label: '\ud83c\udf78 Pr\u00e9sentoir' }
            ],
            npcs: [
                { x: 50, y: 22, label: 'Barman', color: '#d4a373', dlg: 'barman' }
            ],
            doors: [
                { x: 40, y: 94, w: 20, h: 4, target: 'lobby', sx: 87, sy: 8, label: 'Hall \u2193' }
            ],
            stamp: 'bar'
        }
    };

    /* ═══════════════════════════════════════
       DIALOGUES
       ═══════════════════════════════════════ */
    var DLG = {
        portier: ['Bonsoir ! Bienvenue chez Virealys.', 'Le premier restaurant Slow Food immersif.', 'Poussez la porte en bas pour entrer.'],
        hote: ['Bienvenue dans le Grand Hall !', 'Quatre zones d\'immersion vous attendent :', '\ud83c\udf3f Origine \u2014 Le go\u00fbt pur, l\'essentiel', '\u2708\ufe0f Voyage \u2014 Projections et accords mets-vins', '\ud83c\udf0a Immersion \u2014 Projection 270\u00b0, son spatial', '\u2728 Sensoriel \u2014 Brume, vibrations, exp\u00e9rience totale', 'La cuisine et le bar sont aussi ouverts !', 'Explorez tout et collectez vos tampons !'],
        chef: ['Bienvenue dans ma cuisine !', 'Ici tout est Slow Food : local, de saison.', 'Chaque producteur est notre voisin.', 'Ce soir : filet de Wagyu, laquage miso,', 'truffe noire du P\u00e9rigord.', 'Imaginez les ar\u00f4mes qui envahissent la pi\u00e8ce...', 'Votre \u00e9cran ne peut pas vous les transmettre.', 'Mais chez Virealys, chaque soir, c\'est r\u00e9el.'],
        serveur_o: ['Bienvenue en Zone Origine.', 'Ici, pas de projection, pas d\'effet.', 'Juste vous, la bougie, et le go\u00fbt.', 'Formule Classique \u00e0 45\u20ac.', 'Chaque ingr\u00e9dient de moins de 50km.', 'Le carpaccio de Saint-Jacques est sublime.'],
        sommelier: ['Bonsoir ! Je suis votre Sommelier.', 'Chaque plat m\u00e9rite son accord parfait.', 'Pour le carpaccio de Saint-Jacques,', 'je recommande un Muscadet S\u00e8vre-et-Maine.', 'Sa min\u00e9ralit\u00e9 r\u00e9v\u00e8le la fra\u00eecheur iod\u00e9e.', 'Derri\u00e8re moi, la projection montre le vignoble.', 'Ce vignoble existe. On peut le visiter.'],
        guide_imm: ['Bienvenue en Zone Immersion.', 'Les projections 270\u00b0 vous entourent.', '12 m\u00e8tres de haut. Son spatial.', 'Quatre ambiances changent chaque saison :', '\ud83c\udf3f For\u00eat \u2022 \ud83c\udf0a Oc\u00e9an \u2022 \ud83c\udf05 Aurore \u2022 \ud83c\udf0c Cosmos', 'Chaque visite est diff\u00e9rente.', 'Ce que vous voyez l\u00e0 est une fraction.', 'En vrai, c\'est... indescriptible.'],
        maitre_sens: ['Bienvenue en Zone Sensoriel.', 'L\'exp\u00e9rience la plus avanc\u00e9e.', 'Brume parfum\u00e9e \u00e0 la lavande...', 'Le sol vibre sous vos pieds...', 'Le son vous enveloppe de partout...', 'Formule Sensoriel : 120\u20ac, 7 services.', 'Chaque plat transforme l\'espace.', 'C\'est impossible \u00e0 reproduire ici.', 'Ce moment n\'existe qu\'en vrai.', 'R\u00e9servez pour le vivre.'],
        barman: ['Bonsoir ! Le cocktail Constellation ?', 'Gin infus\u00e9 au thym, tonic artisanal,', 'z\u00e9leste de yuzu frais.', 'Servi avec une brume glac\u00e9e...', 'La brume d\u00e9borde du verre...', 'Les ar\u00f4mes s\'\u00e9l\u00e8vent...', 'Vous ne pouvez pas les sentir ici.', 'Mais au bar de Virealys, chaque soir.']
    };

    /* ═══════════════════════════════════════
       STATE
       ═══════════════════════════════════════ */
    var state = { phase:'creation', room:'entree', px:50, py:70, name:'', skin:0, hair:0, outfit:0, eyes:0, xp:0, stamps:[], visited:[], talking:false, dlgLines:[], dlgIdx:0, dlgSpeaker:'' };
    var keys = {}, canvas, ctx, W, H, particles = [], nearEnt = null, joystick = { active:false, dx:0, dy:0, sx:0, sy:0 }, typeInt = null, frame = 0;

    /* ═══════════════════════════════════════
       INIT
       ═══════════════════════════════════════ */
    function init() {
        var g = document.getElementById('vr-game');
        if (!g) return;
        g.innerHTML = '';
        canvas = document.createElement('canvas');
        canvas.id = 'vr-c';
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
        g.appendChild(canvas);

        var ui = document.createElement('div'); ui.id = 'vr-ui'; ui.className = 'vr-ui'; g.appendChild(ui);

        var dlg = document.createElement('div'); dlg.id = 'vr-dlg'; dlg.className = 'vr-dlg'; dlg.style.display = 'none';
        dlg.innerHTML = '<div class="vr-dlg-speaker" id="vr-ds"></div><div class="vr-dlg-text" id="vr-dt"></div><div class="vr-dlg-hint">\u25bc Cliquez pour continuer</div>';
        g.appendChild(dlg);

        var hud = document.createElement('div'); hud.id = 'vr-hud'; hud.className = 'vr-hud'; hud.style.display = 'none'; g.appendChild(hud);

        var joy = document.createElement('div'); joy.id = 'vr-joy'; joy.className = 'vr-joy'; joy.style.display = 'none';
        joy.innerHTML = '<div class="vr-joy-knob" id="vr-jk"></div>'; g.appendChild(joy);

        var ib = document.createElement('button'); ib.id = 'vr-ib'; ib.className = 'vr-interact-btn'; ib.style.display = 'none'; g.appendChild(ib);

        ctx = canvas.getContext('2d');
        resize(); window.addEventListener('resize', resize);
        if (loadSave() && state.phase === 'playing') startGame(); else showCreation();
    }

    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
    }

    /* ═══════════════════════════════════════
       CHARACTER CREATION
       ═══════════════════════════════════════ */
    function showCreation() {
        state.phase = 'creation';
        canvas.style.opacity = '0.3';
        document.getElementById('vr-hud').style.display = 'none';
        document.getElementById('vr-joy').style.display = 'none';
        var ui = document.getElementById('vr-ui');
        ui.style.display = 'flex';
        ui.innerHTML = '<div class="gc-screen"><h2 class="gc-title">\u2726 Cr\u00e9ez Votre Personnage \u2726</h2>' +
            '<canvas id="gc-pv" width="100" height="130" style="display:block;margin:0 auto 1rem"></canvas>' +
            '<div class="gc-form">' +
            mkField('Pr\u00e9nom', '<input type="text" class="gc-input" id="gc-n" placeholder="Votre pr\u00e9nom" maxlength="20">') +
            mkColors('Peau', 'skin', SKINS) + mkColors('Yeux', 'eyes', EYES_C) +
            mkColors('Cheveux', 'hair', HAIRS) + mkColors('Tenue', 'outfit', OUTFITS) +
            '</div><button class="game-choice-btn gc-start" id="gc-go">\u2726 Entrer chez Virealys \u2726</button></div>';
        drawPV();
        ui.querySelectorAll('.gc-color-btn').forEach(function (b) {
            b.addEventListener('click', function () {
                state[b.dataset.t] = +b.dataset.i;
                ui.querySelectorAll('.gc-color-btn[data-t="'+b.dataset.t+'"]').forEach(function(x){x.classList.remove('gc-color-active')});
                b.classList.add('gc-color-active'); drawPV();
            });
        });
        document.getElementById('gc-go').addEventListener('click', function () {
            state.name = (document.getElementById('gc-n').value.trim()) || 'Voyageur';
            state.phase = 'playing'; state.room = 'entree'; state.px = 50; state.py = 70;
            ui.style.display = 'none'; canvas.style.opacity = '1'; save(); startGame();
        });
    }

    function mkField(l, html) { return '<div class="gc-field"><label class="gc-label">'+l+'</label>'+html+'</div>'; }
    function mkColors(l, t, arr) {
        var h = ''; arr.forEach(function(c,i) { h += '<button class="gc-color-btn'+(state[t]===i?' gc-color-active':'')+'" data-t="'+t+'" data-i="'+i+'" style="background:'+c+'"></button>'; });
        return mkField(l, '<div class="gc-colors">'+h+'</div>');
    }
    function drawPV() {
        var c = document.getElementById('gc-pv'); if (!c) return;
        var x = c.getContext('2d'); x.clearRect(0,0,100,130);
        drawAvatar(x, 50, 65, 2.5);
    }

    /* ═══════════════════════════════════════
       AVATAR RENDERER
       ═══════════════════════════════════════ */
    function drawAvatar(c, x, y, s) {
        var sk = SKINS[state.skin], hr = HAIRS[state.hair], of = OUTFITS[state.outfit], ey = EYES_C[state.eyes];
        // Shadow
        c.fillStyle = 'rgba(0,0,0,0.3)';
        c.beginPath(); c.ellipse(x, y+16*s, 6*s, 2*s, 0, 0, Math.PI*2); c.fill();
        // Legs
        c.fillStyle = '#1a1a2e';
        c.fillRect(x-4*s, y+6*s, 3*s, 8*s); c.fillRect(x+1*s, y+6*s, 3*s, 8*s);
        // Body
        c.fillStyle = of;
        c.fillRect(x-6*s, y-4*s, 12*s, 12*s);
        // Collar
        c.fillStyle = sk;
        c.beginPath(); c.ellipse(x, y-4*s, 3*s, 1.5*s, 0, 0, Math.PI*2); c.fill();
        // Head
        c.fillStyle = sk;
        c.beginPath(); c.arc(x, y-11*s, 7*s, 0, Math.PI*2); c.fill();
        // Hair
        c.fillStyle = hr;
        c.beginPath(); c.arc(x, y-14*s, 7*s, Math.PI, 0); c.fill();
        c.fillRect(x-7*s, y-14*s, 14*s, 3*s);
        // Eyes
        c.fillStyle = '#fff';
        c.beginPath(); c.ellipse(x-2.5*s, y-12*s, 2*s, 2.2*s, 0, 0, Math.PI*2); c.fill();
        c.beginPath(); c.ellipse(x+2.5*s, y-12*s, 2*s, 2.2*s, 0, 0, Math.PI*2); c.fill();
        c.fillStyle = ey;
        c.beginPath(); c.arc(x-2.5*s, y-12*s, 1.2*s, 0, Math.PI*2); c.fill();
        c.beginPath(); c.arc(x+2.5*s, y-12*s, 1.2*s, 0, Math.PI*2); c.fill();
        c.fillStyle = '#000';
        c.beginPath(); c.arc(x-2.5*s, y-12*s, .6*s, 0, Math.PI*2); c.fill();
        c.beginPath(); c.arc(x+2.5*s, y-12*s, .6*s, 0, Math.PI*2); c.fill();
        // Mouth
        c.strokeStyle = 'rgba(0,0,0,0.4)'; c.lineWidth = s*.8;
        c.beginPath(); c.arc(x, y-8*s, 2*s, .2, Math.PI-.2); c.stroke();
    }

    /* ═══════════════════════════════════════
       START GAME
       ═══════════════════════════════════════ */
    function startGame() {
        canvas.style.opacity = '1';
        document.getElementById('vr-hud').style.display = 'flex';
        document.getElementById('vr-joy').style.display = 'block';
        document.getElementById('vr-ui').style.display = 'none';
        initParticles();
        document.addEventListener('keydown', function(e) { keys[e.key]=true; if(e.key==='e'||e.key==='E') interact(); if((e.key===' '||e.key==='Enter')&&state.talking) advDlg(); if(e.key==='Escape'&&state.talking){ state.talking=false; document.getElementById('vr-dlg').style.display='none'; } });
        document.addEventListener('keyup', function(e) { keys[e.key]=false; });
        document.getElementById('vr-dlg').addEventListener('click', function(){ if(state.talking) advDlg(); });
        document.getElementById('vr-ib').addEventListener('click', interact);
        canvas.addEventListener('click', function(){ if(state.talking) advDlg(); else if(nearEnt) interact(); });
        initJoy();
        loop();
    }

    /* ═══════════════════════════════════════
       PARTICLES
       ═══════════════════════════════════════ */
    function initParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({ x: Math.random()*100, y: Math.random()*100, s: Math.random()*2+1, sp: Math.random()*.3+.05, a: Math.random() });
        }
    }

    /* ═══════════════════════════════════════
       JOYSTICK
       ═══════════════════════════════════════ */
    function initJoy() {
        var j = document.getElementById('vr-joy'), k = document.getElementById('vr-jk');
        j.addEventListener('touchstart', function(e) { e.preventDefault(); joystick.active=true; var r=j.getBoundingClientRect(); joystick.sx=r.left+r.width/2; joystick.sy=r.top+r.height/2; }, {passive:false});
        document.addEventListener('touchmove', function(e) { if(!joystick.active) return; var t=e.touches[0], dx=t.clientX-joystick.sx, dy=t.clientY-joystick.sy, d=Math.sqrt(dx*dx+dy*dy), m=35; if(d>m){dx=dx/d*m;dy=dy/d*m;} k.style.transform='translate('+dx+'px,'+dy+'px)'; joystick.dx=dx/m; joystick.dy=dy/m; }, {passive:true});
        document.addEventListener('touchend', function() { joystick.active=false; joystick.dx=0; joystick.dy=0; k.style.transform='translate(0,0)'; });
    }

    /* ═══════════════════════════════════════
       GAME LOOP
       ═══════════════════════════════════════ */
    function loop() { update(); draw(); frame++; requestAnimationFrame(loop); }

    function update() {
        if (state.talking) return;
        var dx=0, dy=0;
        if (keys.ArrowUp||keys.w||keys.z) dy=-1;
        if (keys.ArrowDown||keys.s) dy=1;
        if (keys.ArrowLeft||keys.q||keys.a) dx=-1;
        if (keys.ArrowRight||keys.d) dx=1;
        if (joystick.active) { dx=joystick.dx; dy=joystick.dy; }
        if (dx||dy) { var l=Math.sqrt(dx*dx+dy*dy); dx=dx/l*SPEED*(100/W); dy=dy/l*SPEED*(100/H); }
        var nx = Math.max(3, Math.min(97, state.px+dx));
        var ny = Math.max(3, Math.min(97, state.py+dy));
        // Furniture collision
        var room = ROOMS[state.room], blocked = false;
        room.furniture.forEach(function(f) {
            if (f.type==='rect' && rectHit(nx, ny, 2, 2, f.x, f.y, f.w, f.h)) blocked = true;
        });
        if (!blocked) { state.px = nx; state.py = ny; }
        // Doors
        room.doors.forEach(function(d) {
            if (rectHit(state.px, state.py, 2, 3, d.x, d.y, d.w, d.h)) {
                state.room = d.target; state.px = d.sx; state.py = d.sy;
                if (state.visited.indexOf(d.target)<0) { state.visited.push(d.target); state.xp+=15; }
                var tr = ROOMS[d.target];
                if (tr.stamp && state.stamps.indexOf(tr.stamp)<0) { state.stamps.push(tr.stamp); state.xp+=25; }
                initParticles(); save();
            }
        });
        // Nearest NPC
        nearEnt = null; var md = INTERACT_DIST/Math.max(W,H)*100;
        room.npcs.forEach(function(n) {
            var d = Math.sqrt(Math.pow(state.px-n.x,2)+Math.pow(state.py-n.y,2));
            if (d < md) { md=d; nearEnt=n; }
        });
        // Also check furniture with dialogues
        room.furniture.forEach(function(f) {
            if (!f.label) return;
            var fx = f.x+f.w/2, fy = f.y+f.h/2;
            var d = Math.sqrt(Math.pow(state.px-fx,2)+Math.pow(state.py-fy,2));
            if (d < md*1.5) { md=d; nearEnt=f; }
        });
        var ib = document.getElementById('vr-ib');
        ib.style.display = nearEnt ? 'block' : 'none';
        if (nearEnt) ib.textContent = nearEnt.label || 'Interagir';
        updateHUD();
        // Particles
        particles.forEach(function(p) { p.y -= p.sp; p.a = Math.sin(frame*.02+p.x)*.5+.5; if(p.y<-2) { p.y=102; p.x=Math.random()*100; } });
    }

    function rectHit(px,py,pw,ph,rx,ry,rw,rh) { return px+pw>rx && px-pw<rx+rw && py+ph>ry && py-ph<ry+rh; }

    /* ═══════════════════════════════════════
       DRAW
       ═══════════════════════════════════════ */
    function draw() {
        var room = ROOMS[state.room];
        // Background gradient
        var grad = ctx.createLinearGradient(0,0,0,H);
        grad.addColorStop(0, room.bgTop); grad.addColorStop(1, room.bgBot);
        ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

        // Floor pattern
        ctx.globalAlpha = 0.15;
        var ts = 50;
        for (var tx=0; tx<W; tx+=ts) { for (var ty=0; ty<H; ty+=ts) { if((Math.floor(tx/ts)+Math.floor(ty/ts))%2===0) { ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(tx,ty,ts,ts); } } }
        ctx.globalAlpha = 1;

        // Walls
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(0,0,W,H*.03); ctx.fillRect(0,H*.97,W,H*.03);
        ctx.fillRect(0,0,W*.02,H); ctx.fillRect(W*.98,0,W*.02,H);

        // Doors (glowing)
        room.doors.forEach(function(d) {
            var dx=px(d.x,W), dy=px(d.y,H), dw=px(d.w,W), dh=px(d.h,H);
            var pulse = .5 + Math.sin(frame*.05)*.3;
            ctx.fillStyle = 'rgba(0,229,255,'+pulse+')';
            ctx.fillRect(dx,dy,dw,dh);
            // Glow
            ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 15;
            ctx.fillRect(dx,dy,dw,dh);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(d.label, dx+dw/2, dy+dh/2+4);
        });

        // Furniture
        room.furniture.forEach(function(f) {
            var fx, fy, fw, fh;
            if (f.type==='rect') {
                fx=px(f.x,W); fy=px(f.y,H); fw=px(f.w,W); fh=px(f.h,H);
                // Shadow
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(fx+3, fy+3, fw, fh);
                // Main
                ctx.fillStyle = f.color;
                ctx.fillRect(fx, fy, fw, fh);
                // Border glow if nearby
                if (nearEnt === f) {
                    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2;
                    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10;
                    ctx.strokeRect(fx-2, fy-2, fw+4, fh+4);
                    ctx.shadowBlur = 0;
                }
                // Sign special
                if (f.isSign) {
                    ctx.fillStyle = '#00e5ff'; ctx.font = 'bold '+Math.max(14,fw/8)+'px sans-serif'; ctx.textAlign = 'center';
                    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 20;
                    ctx.fillText(f.label, fx+fw/2, fy+fh/2+5);
                    ctx.shadowBlur = 0;
                } else if (f.label) {
                    ctx.fillStyle = 'rgba(200,214,229,0.7)'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText(f.label, fx+fw/2, fy-5);
                }
            } else if (f.type==='circle') {
                fx=px(f.x,W); fy=px(f.y,H); var r=px(f.r,Math.min(W,H));
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath(); ctx.ellipse(fx+2, fy+2, r, r*.6, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = f.color;
                ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI*2); ctx.fill();
                if (f.label) { ctx.fillStyle='rgba(200,214,229,0.6)'; ctx.font='8px sans-serif'; ctx.textAlign='center'; ctx.fillText(f.label, fx, fy-r-4); }
            }
        });

        // NPCs
        room.npcs.forEach(function(n) {
            var nx=px(n.x,W), ny=px(n.y,H);
            drawAvatar(ctx, nx, ny, 1.3);
            // Name
            ctx.fillStyle = '#ffd700'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(n.label, nx, ny-22);
            // Highlight
            if (nearEnt === n) {
                ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2;
                ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12;
                ctx.beginPath(); ctx.arc(nx, ny, 18, 0, Math.PI*2); ctx.stroke();
                ctx.shadowBlur = 0;
            }
        });

        // Player
        var ppx=px(state.px,W), ppy=px(state.py,H);
        drawAvatar(ctx, ppx, ppy, 1.5);
        ctx.fillStyle = '#00e5ff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(state.name, ppx, ppy-28);

        // Player light (holographic glow)
        var lg = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 150);
        lg.addColorStop(0, 'rgba(0,229,255,0.06)');
        lg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = lg; ctx.fillRect(ppx-150, ppy-150, 300, 300);

        // Particles
        ctx.globalAlpha = 0.6;
        particles.forEach(function(p) {
            ctx.fillStyle = room.particleColor;
            ctx.globalAlpha = p.a * 0.5;
            ctx.beginPath(); ctx.arc(px(p.x,W), px(p.y,H), p.s, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Room name
        ctx.fillStyle = 'rgba(6,6,15,0.7)';
        var rnw = ctx.measureText(room.name).width + 30;
        ctx.fillRect(W/2-rnw/2, 8, rnw, 28);
        ctx.strokeStyle = 'rgba(0,229,255,0.3)'; ctx.lineWidth = 1;
        ctx.strokeRect(W/2-rnw/2, 8, rnw, 28);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(room.name, W/2, 27);

        // Hour CTA
        var h = new Date().getHours();
        if ((h>=11&&h<=13)||(h>=18&&h<=21)) {
            var msg = h<14 ? '\ud83c\udf7d C\'est l\'heure du d\u00e9jeuner... Virealys vous attend' : '\ud83c\udf19 La soir\u00e9e commence... R\u00e9servez votre table';
            ctx.fillStyle = 'rgba(255,215,0,0.1)'; ctx.fillRect(0, H-35, W, 35);
            ctx.fillStyle = '#ffd700'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(msg, W/2, H-14);
        }
    }

    /* ═══════════════════════════════════════
       HUD
       ═══════════════════════════════════════ */
    function updateHUD() {
        var hud = document.getElementById('vr-hud');
        var sh = ''; Object.keys(STAMPS_DEF).forEach(function(k) { sh += '<span class="vr-hud-stamp'+(state.stamps.indexOf(k)>=0?' earned':'')+'">'+STAMPS_DEF[k]+'</span>'; });
        hud.innerHTML = '<span class="vr-hud-name">'+state.name+'</span><span class="vr-hud-xp">'+state.xp+' XP</span><span class="vr-hud-stamps">'+sh+'</span>';
    }

    /* ═══════════════════════════════════════
       DIALOGUE
       ═══════════════════════════════════════ */
    function interact() {
        if (state.talking || !nearEnt) return;
        var dlgId = nearEnt.dlg || nearEnt.dialogueId;
        var lines = dlgId ? DLG[dlgId] : null;
        if (!lines) return;
        state.talking = true; state.dlgLines = lines; state.dlgIdx = 0; state.dlgSpeaker = nearEnt.label;
        showLine();
    }

    function showLine() {
        var d = document.getElementById('vr-dlg'); d.style.display = 'block';
        document.getElementById('vr-ds').textContent = state.dlgSpeaker;
        tw(document.getElementById('vr-dt'), state.dlgLines[state.dlgIdx]);
    }

    function advDlg() {
        // Skip typewriter if still typing
        if (typeInt) { clearInterval(typeInt); typeInt=null; document.getElementById('vr-dt').textContent = state.dlgLines[state.dlgIdx]; return; }
        state.dlgIdx++;
        if (state.dlgIdx >= state.dlgLines.length) { state.talking=false; document.getElementById('vr-dlg').style.display='none'; state.xp+=5; save(); return; }
        showLine();
    }

    function tw(el, text) {
        if(typeInt) clearInterval(typeInt);
        var i=0; el.textContent='';
        typeInt=setInterval(function(){ if(i<text.length){el.textContent+=text.charAt(i);i++;}else{clearInterval(typeInt);typeInt=null;} }, TYPE_SPEED);
    }

    /* ═══════════════════════════════════════
       SAVE / LOAD
       ═══════════════════════════════════════ */
    function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({phase:state.phase,room:state.room,px:state.px,py:state.py,name:state.name,skin:state.skin,hair:state.hair,outfit:state.outfit,eyes:state.eyes,xp:state.xp,stamps:state.stamps,visited:state.visited})); } catch(e){} }
    function loadSave() { try { var d=JSON.parse(localStorage.getItem(SAVE_KEY)); if(d&&d.phase){Object.keys(d).forEach(function(k){state[k]=d[k];}); return true;} } catch(e){} return false; }

    /* BOOT */
    if (document.getElementById('vr-game')) { if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init(); }
})();
