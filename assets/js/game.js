/**
 * Virealys Experience v4.0 — Jeu 2D Immersif Holographique
 * Salles plein ecran + eclairage + particules + slow food
 */
(function () {
    'use strict';

    var SAVE_KEY = 'vr_game4';
    var SPEED = 2;
    var TYPE_SPEED = 30;
    var INTERACT_DIST = 60;
    var PARTICLE_COUNT = 30;

    var SKINS = ['#fce4c0','#f4c794','#d4a373','#a67c5a','#6b4226','#3d2314'];
    var HAIRS = ['#2c1810','#5a3825','#c4883f','#e8c547','#d44e28','#1a1a2e','#e0e0e0','#ff69b4'];
    var OUTFITS = ['#00e5ff','#4d7cff','#a855f7','#e040fb','#10b981','#f97316','#ef4444','#ffd700'];
    var EYES_C = ['#2c1810','#1a6b3d','#2563eb','#7c3aed','#92400e'];
    var STAMPS_DEF = { cuisine:'\ud83d\udc68\u200d\ud83c\udf73', origine:'\ud83c\udf3f', voyage:'\u2708\ufe0f', immersion:'\ud83c\udf0a', sensoriel:'\u2728', bar:'\ud83c\udf78' };

    /* ═══════════════════════════════════════
       SLOW FOOD TIPS
       ═══════════════════════════════════════ */
    var SLOW_FOOD_TIPS = [
        'Slow Food : savourez chaque instant',
        'La cuisine est un art qui prend son temps',
        'Manger bien, manger juste, manger local',
        'Le temps est le meilleur des ingr\u00e9dients',
        'Chaque plat raconte l\'histoire d\'un terroir',
        'Prenez le temps de go\u00fbter la diff\u00e9rence'
    ];
    var slowFoodTipAlpha = 0;
    var slowFoodTipText = '';
    var slowFoodTipTimer = 0;
    var slowFoodTipPhase = 'hidden'; // hidden, fadein, visible, fadeout
    var SLOW_TIP_INTERVAL = 900; // ~30 seconds at 30fps

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
        hote: ['Bienvenue dans le Grand Hall !', 'Quatre zones d\'immersion vous attendent :', '\ud83c\udf3f Origine \u2014 Le go\u00fbt pur, l\'essentiel', '\u2708\ufe0f Voyage \u2014 Projections et accords mets-vins', '\ud83c\udf0a Immersion \u2014 Projection 270\u00b0, son spatial', '\u2728 Sensoriel \u2014 Brume, vibrations, exp\u00e9rience totale', 'La cuisine et le bar sont aussi ouverts !', 'Explorez tout et collectez vos tampons !', 'Prenez le temps d\'explorer. Rien ne presse chez Virealys.'],
        chef: ['Bienvenue dans ma cuisine !', 'Ici tout est Slow Food : local, de saison.', 'Chaque producteur est notre voisin.', 'Ce soir : filet de Wagyu, laquage miso,', 'truffe noire du P\u00e9rigord.', 'Imaginez les ar\u00f4mes qui envahissent la pi\u00e8ce...', 'Votre \u00e9cran ne peut pas vous les transmettre.', 'Mais chez Virealys, chaque soir, c\'est r\u00e9el.', 'Prenez votre temps... Le Slow Food, c\'est aussi savourer chaque instant.'],
        serveur_o: ['Bienvenue en Zone Origine.', 'Ici, pas de projection, pas d\'effet.', 'Juste vous, la bougie, et le go\u00fbt.', 'Formule Classique \u00e0 45\u20ac.', 'Chaque ingr\u00e9dient de moins de 50km.', 'Le carpaccio de Saint-Jacques est sublime.'],
        sommelier: ['Bonsoir ! Je suis votre Sommelier.', 'Chaque plat m\u00e9rite son accord parfait.', 'Pour le carpaccio de Saint-Jacques,', 'je recommande un Muscadet S\u00e8vre-et-Maine.', 'Sa min\u00e9ralit\u00e9 r\u00e9v\u00e8le la fra\u00eecheur iod\u00e9e.', 'Derri\u00e8re moi, la projection montre le vignoble.', 'Ce vignoble existe. On peut le visiter.', 'N\'allez pas trop vite. Un bon vin se d\u00e9guste lentement...'],
        guide_imm: ['Bienvenue en Zone Immersion.', 'Les projections 270\u00b0 vous entourent.', '12 m\u00e8tres de haut. Son spatial.', 'Quatre ambiances changent chaque saison :', '\ud83c\udf3f For\u00eat \u2022 \ud83c\udf0a Oc\u00e9an \u2022 \ud83c\udf05 Aurore \u2022 \ud83c\udf0c Cosmos', 'Chaque visite est diff\u00e9rente.', 'Ce que vous voyez l\u00e0 est une fraction.', 'En vrai, c\'est... indescriptible.'],
        maitre_sens: ['Bienvenue en Zone Sensoriel.', 'L\'exp\u00e9rience la plus avanc\u00e9e.', 'Brume parfum\u00e9e \u00e0 la lavande...', 'Le sol vibre sous vos pieds...', 'Le son vous enveloppe de partout...', 'Formule Sensoriel : 120\u20ac, 7 services.', 'Chaque plat transforme l\'espace.', 'C\'est impossible \u00e0 reproduire ici.', 'Ce moment n\'existe qu\'en vrai.', 'R\u00e9servez pour le vivre.', 'Respirez. Fermez les yeux un instant. Sentez-vous l\'ambiance ?'],
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

        var ctrls = document.createElement('div');
        ctrls.style.cssText = 'position:fixed;bottom:1rem;right:1rem;z-index:10002;display:flex;gap:.5rem';
        var svBtn = document.createElement('button');
        svBtn.textContent = 'Sauvegarder';
        svBtn.style.cssText = 'padding:.5rem 1rem;background:rgba(6,6,15,.85);border:1px solid rgba(0,229,255,.3);border-radius:8px;color:#00e5ff;font-size:.75rem;cursor:pointer;font-family:sans-serif;min-height:40px';
        svBtn.addEventListener('click', function() { save(); svBtn.textContent = '\u2713 Sauvegard\u00e9'; setTimeout(function(){ svBtn.textContent = 'Sauvegarder'; }, 1500); });
        var rsBtn = document.createElement('button');
        rsBtn.textContent = 'Recommencer';
        rsBtn.style.cssText = 'padding:.5rem 1rem;background:rgba(6,6,15,.85);border:1px solid rgba(239,68,68,.3);border-radius:8px;color:#ef4444;font-size:.75rem;cursor:pointer;font-family:sans-serif;min-height:40px';
        rsBtn.addEventListener('click', function() { if(confirm('Recommencer ? Progression perdue.')){ localStorage.removeItem(SAVE_KEY); location.reload(); } });
        ctrls.appendChild(svBtn); ctrls.appendChild(rsBtn); g.appendChild(ctrls);

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
        // Slow food tip timer
        updateSlowFoodTip();
    }

    function rectHit(px,py,pw,ph,rx,ry,rw,rh) { return px+pw>rx && px-pw<rx+rw && py+ph>ry && py-ph<ry+rh; }

    /* ═══════════════════════════════════════
       SLOW FOOD TIP OVERLAY
       ═══════════════════════════════════════ */
    function updateSlowFoodTip() {
        slowFoodTipTimer++;
        if (slowFoodTipPhase === 'hidden') {
            if (slowFoodTipTimer >= SLOW_TIP_INTERVAL) {
                slowFoodTipTimer = 0;
                slowFoodTipText = SLOW_FOOD_TIPS[Math.floor(Math.random() * SLOW_FOOD_TIPS.length)];
                slowFoodTipPhase = 'fadein';
                slowFoodTipAlpha = 0;
            }
        } else if (slowFoodTipPhase === 'fadein') {
            slowFoodTipAlpha += 0.015;
            if (slowFoodTipAlpha >= 0.85) { slowFoodTipAlpha = 0.85; slowFoodTipPhase = 'visible'; slowFoodTipTimer = 0; }
        } else if (slowFoodTipPhase === 'visible') {
            if (slowFoodTipTimer >= 180) { slowFoodTipPhase = 'fadeout'; }
        } else if (slowFoodTipPhase === 'fadeout') {
            slowFoodTipAlpha -= 0.015;
            if (slowFoodTipAlpha <= 0) { slowFoodTipAlpha = 0; slowFoodTipPhase = 'hidden'; slowFoodTipTimer = 0; }
        }
    }

    function drawSlowFoodTip() {
        if (slowFoodTipAlpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = slowFoodTipAlpha;
        var tipW = ctx.measureText(slowFoodTipText).width + 60;
        var tipH = 36;
        var tipX = W / 2 - tipW / 2;
        var tipY = 44;
        // Background
        ctx.fillStyle = 'rgba(10,5,20,0.75)';
        ctx.beginPath();
        ctx.moveTo(tipX + 8, tipY);
        ctx.lineTo(tipX + tipW - 8, tipY);
        ctx.quadraticCurveTo(tipX + tipW, tipY, tipX + tipW, tipY + 8);
        ctx.lineTo(tipX + tipW, tipY + tipH - 8);
        ctx.quadraticCurveTo(tipX + tipW, tipY + tipH, tipX + tipW - 8, tipY + tipH);
        ctx.lineTo(tipX + 8, tipY + tipH);
        ctx.quadraticCurveTo(tipX, tipY + tipH, tipX, tipY + tipH - 8);
        ctx.lineTo(tipX, tipY + 8);
        ctx.quadraticCurveTo(tipX, tipY, tipX + 8, tipY);
        ctx.fill();
        // Border
        ctx.strokeStyle = 'rgba(255,215,0,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Text
        ctx.fillStyle = '#ffd700';
        ctx.font = 'italic 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(slowFoodTipText, W / 2, tipY + tipH / 2 + 5);
        ctx.restore();
    }

    /* ═══════════════════════════════════════
       DETAILED FURNITURE DRAWING HELPERS
       ═══════════════════════════════════════ */
    function drawTable(x, y, w, h, hasCandle) {
        // Table shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath(); ctx.ellipse(x+w/2+3, y+h+5, w/2, 6, 0, 0, Math.PI*2); ctx.fill();
        // Legs
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(x+4, y+h-2, 4, 10); ctx.fillRect(x+w-8, y+h-2, 4, 10);
        // Table top
        ctx.fillStyle = '#4a3020';
        ctx.fillRect(x, y, w, h);
        // Tablecloth shine
        var tg = ctx.createLinearGradient(x, y, x, y+h);
        tg.addColorStop(0, 'rgba(255,255,255,0.08)'); tg.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = tg; ctx.fillRect(x, y, w, h);
        // Edge
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
        // Plate
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.ellipse(x+w/2, y+h/2, w*.2, h*.3, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.ellipse(x+w/2, y+h/2, w*.15, h*.2, 0, 0, Math.PI*2); ctx.stroke();
        // Candle
        if (hasCandle) { drawCandle(x+w-12, y+4); }
    }

    function drawCandle(x, y) {
        ctx.fillStyle = '#f5f0e0'; ctx.fillRect(x, y+4, 6, 12);
        // Flame
        var flicker = Math.sin(frame*.15)*1.5;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.ellipse(x+3, y+2+flicker, 3, 5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffee66';
        ctx.beginPath(); ctx.ellipse(x+3, y+3+flicker, 1.5, 3, 0, 0, Math.PI*2); ctx.fill();
        // Glow
        var cg = ctx.createRadialGradient(x+3, y+3, 0, x+3, y+3, 40);
        cg.addColorStop(0, 'rgba(255,170,0,0.12)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg; ctx.fillRect(x-37, y-37, 80, 80);
    }

    function drawChair(x, y, dir) {
        ctx.fillStyle = '#2a2020';
        // Seat
        ctx.fillRect(x, y, 14, 12);
        // Back
        if (dir === 'up') ctx.fillRect(x+1, y-6, 12, 6);
        else if (dir === 'down') ctx.fillRect(x+1, y+12, 12, 6);
        else if (dir === 'left') ctx.fillRect(x-6, y+1, 6, 10);
        else ctx.fillRect(x+14, y+1, 6, 10);
    }

    function drawCounter(x, y, w, h) {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x+3, y+3, w, h+8);
        // Counter front
        ctx.fillStyle = '#2a1a30';
        ctx.fillRect(x, y+h, w, 10);
        // Counter top
        var cg = ctx.createLinearGradient(x, y, x+w, y);
        cg.addColorStop(0, '#3a2a3a'); cg.addColorStop(.5, '#4a3a4a'); cg.addColorStop(1, '#3a2a3a');
        ctx.fillStyle = cg; ctx.fillRect(x, y, w, h);
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x, y, w, h/3);
        // Edge
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
    }

    function drawProjection(x, y, w, h, color, label) {
        // Screen glow
        var pulse = .4 + Math.sin(frame*.03)*.15;
        var pg = ctx.createRadialGradient(x+w/2, y+h/2, 0, x+w/2, y+h/2, Math.max(w,h));
        pg.addColorStop(0, color.replace(')', ','+pulse+')')); pg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pg; ctx.fillRect(x-20, y-20, w+40, h+40);
        // Screen
        ctx.fillStyle = color.replace(')', ',0.3)');
        ctx.fillRect(x, y, w, h);
        // Scan lines
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
        for (var sy = y; sy < y+h; sy += 4) { ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x+w, sy); ctx.stroke(); }
        // Moving light bar
        var barY = y + ((frame * 0.5) % h);
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x, barY, w, 3);
        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
        // Label
        if (label) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, x+w/2, y+h/2+4); }
    }

    function drawPlant(x, y, size) {
        // Pot
        ctx.fillStyle = '#5a3a2a';
        ctx.fillRect(x-size*.4, y, size*.8, size*.6);
        ctx.fillRect(x-size*.5, y, size, size*.15);
        // Leaves
        ctx.fillStyle = '#1a5a2a';
        for (var i = 0; i < 5; i++) {
            var angle = -Math.PI/2 + (i-2)*0.5 + Math.sin(frame*.01+i)*.05;
            var lx = x + Math.cos(angle)*size*.8;
            var ly = y - Math.sin(-angle)*size*.6 - size*.3;
            ctx.beginPath(); ctx.ellipse(lx, ly, size*.25, size*.08, angle+Math.PI/2, 0, Math.PI*2); ctx.fill();
        }
    }

    function drawStool(x, y) {
        ctx.fillStyle = '#2a2020';
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#1a1515';
        ctx.fillRect(x-2, y+8, 4, 12); ctx.fillRect(x-6, y+18, 12, 3);
    }

    function drawWineBottle(x, y) {
        ctx.fillStyle = '#1a3a1a'; ctx.fillRect(x, y+8, 8, 16);
        ctx.fillStyle = '#2a4a2a'; ctx.fillRect(x+1, y, 6, 10);
        ctx.fillStyle = '#3a1a1a'; ctx.fillRect(x+2, y-2, 4, 4);
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(x+1, y+8, 2, 14);
    }

    function drawWineGlass(x, y) {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(x, y, 5, 3, 0, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y+3); ctx.lineTo(x, y+12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x-4, y+12); ctx.lineTo(x+4, y+12); ctx.stroke();
        // Wine inside
        ctx.fillStyle = 'rgba(120,20,30,0.5)';
        ctx.beginPath(); ctx.ellipse(x, y, 4, 2, 0, 0, Math.PI*2); ctx.fill();
    }

    function drawMist(x, y, w, h, color) {
        for (var i = 0; i < 8; i++) {
            var mx = x + Math.sin(frame*.008+i*2)*w*.3 + w/2;
            var my = y + Math.cos(frame*.006+i*1.5)*h*.3 + h/2;
            var mr = 20 + Math.sin(frame*.01+i)*10;
            var mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
            mg.addColorStop(0, color); mg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = mg; ctx.fillRect(mx-mr, my-mr, mr*2, mr*2);
        }
    }

    /* ═══════════════════════════════════════
       WALL DECORATIONS
       ═══════════════════════════════════════ */
    function drawPainting(x, y, w, h, colors) {
        // Frame (gold)
        ctx.fillStyle = 'rgba(180,150,80,0.6)';
        ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
        // Canvas
        var pg = ctx.createLinearGradient(x, y, x + w, y + h);
        pg.addColorStop(0, colors[0]); pg.addColorStop(0.5, colors[1]); pg.addColorStop(1, colors[2] || colors[0]);
        ctx.fillStyle = pg;
        ctx.fillRect(x, y, w, h);
        // Inner border
        ctx.strokeStyle = 'rgba(200,170,100,0.4)'; ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(x, y, w * 0.4, h);
    }

    function drawWallSconce(x, y) {
        // Bracket
        ctx.fillStyle = 'rgba(180,150,80,0.5)';
        ctx.fillRect(x - 2, y, 4, 10);
        // Sconce cup
        ctx.fillStyle = 'rgba(200,170,100,0.6)';
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x + 4, y - 5);
        ctx.lineTo(x - 4, y - 5);
        ctx.closePath();
        ctx.fill();
        // Flame
        var flick = Math.sin(frame * 0.12 + x) * 1;
        ctx.fillStyle = 'rgba(255,200,80,0.8)';
        ctx.beginPath(); ctx.ellipse(x, y - 7 + flick, 2.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,240,150,0.9)';
        ctx.beginPath(); ctx.ellipse(x, y - 6 + flick, 1.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        // Light glow
        var sg = ctx.createRadialGradient(x, y - 6, 0, x, y - 6, 60);
        sg.addColorStop(0, 'rgba(255,200,80,0.08)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(x - 60, y - 66, 120, 120);
    }

    function drawCrownMolding(wallH) {
        // Top molding
        ctx.fillStyle = 'rgba(180,150,80,0.12)';
        ctx.fillRect(0, wallH - 5, W, 3);
        ctx.fillStyle = 'rgba(180,150,80,0.08)';
        ctx.fillRect(0, wallH - 8, W, 2);
        // Bottom molding
        ctx.fillStyle = 'rgba(180,150,80,0.12)';
        ctx.fillRect(0, H - wallH + 2, W, 3);
        ctx.fillStyle = 'rgba(180,150,80,0.08)';
        ctx.fillRect(0, H - wallH + 5, W, 2);
        // Side molding
        ctx.fillStyle = 'rgba(180,150,80,0.10)';
        ctx.fillRect(W * 0.025 - 1, 0, 3, H);
        ctx.fillRect(W * 0.975 - 2, 0, 3, H);
    }

    /* ═══════════════════════════════════════
       FLOOR PATTERNS
       ═══════════════════════════════════════ */
    function drawFloorParquet() {
        var woodColors = ['#2a1e12', '#332414', '#3a2a18'];
        var plankW = 40;
        var plankH = 12;
        for (var fy = 0; fy < H; fy += plankH) {
            var rowOffset = (Math.floor(fy / plankH) % 2) * (plankW / 2);
            for (var fx = -plankW; fx < W + plankW; fx += plankW) {
                var ci = (Math.floor(fx / plankW) + Math.floor(fy / plankH)) % 3;
                ctx.fillStyle = woodColors[ci];
                ctx.globalAlpha = 0.15;
                ctx.fillRect(fx + rowOffset, fy, plankW - 1, plankH - 1);
                // Wood grain line
                ctx.strokeStyle = 'rgba(255,255,255,0.02)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(fx + rowOffset + 4, fy + plankH / 2);
                ctx.lineTo(fx + rowOffset + plankW - 5, fy + plankH / 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
        // Subtle gap lines
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 0.5;
        for (var gy = 0; gy < H; gy += plankH) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
    }

    function drawFloorStone() {
        var stoneW = 60;
        var stoneH = 40;
        for (var fy = 0; fy < H; fy += stoneH) {
            var rowOffset = (Math.floor(fy / stoneH) % 2) * (stoneW / 2);
            for (var fx = -stoneW; fx < W + stoneW; fx += stoneW) {
                var shade = 0.03 + ((Math.floor(fx / stoneW) * 7 + Math.floor(fy / stoneH) * 13) % 5) * 0.008;
                ctx.fillStyle = 'rgba(100,110,130,' + shade + ')';
                ctx.fillRect(fx + rowOffset, fy, stoneW - 2, stoneH - 2);
                // Stone edge highlight
                ctx.strokeStyle = 'rgba(150,160,180,0.04)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(fx + rowOffset, fy, stoneW - 2, stoneH - 2);
            }
        }
    }

    function drawFloorDarkCarpet() {
        // Base carpet texture
        ctx.fillStyle = 'rgba(30,10,40,0.15)';
        ctx.fillRect(0, 0, W, H);
        // Carpet fiber pattern
        for (var fy = 0; fy < H; fy += 6) {
            for (var fx = 0; fx < W; fx += 6) {
                var noise = ((fx * 17 + fy * 31) % 7) * 0.004;
                ctx.fillStyle = 'rgba(60,20,80,' + noise + ')';
                ctx.fillRect(fx, fy, 5, 5);
            }
        }
        // Subtle border pattern
        ctx.strokeStyle = 'rgba(120,40,160,0.06)';
        ctx.lineWidth = 2;
        ctx.strokeRect(W * 0.05, H * 0.05, W * 0.9, H * 0.9);
        ctx.strokeRect(W * 0.06, H * 0.06, W * 0.88, H * 0.88);
    }

    /* ═══════════════════════════════════════
       AMBIENT LIGHTING
       ═══════════════════════════════════════ */
    function drawAmbientLighting(roomKey) {
        var lights = [];
        var pulse = Math.sin(frame * 0.02) * 0.02;
        if (roomKey === 'entree') {
            // Cool blue tones
            lights = [
                { x: W * 0.5, y: H * 0.15, r: W * 0.35, color: 'rgba(0,100,200,' + (0.04 + pulse) + ')' },
                { x: W * 0.2, y: H * 0.5, r: W * 0.25, color: 'rgba(0,150,255,' + (0.03 + pulse) + ')' },
                { x: W * 0.8, y: H * 0.5, r: W * 0.25, color: 'rgba(0,150,255,' + (0.03 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.85, r: W * 0.3, color: 'rgba(0,80,180,' + (0.03 + pulse) + ')' }
            ];
        } else if (roomKey === 'zone_origine' || roomKey === 'cuisine' || roomKey === 'lobby') {
            // Warm amber
            lights = [
                { x: W * 0.25, y: H * 0.3, r: W * 0.28, color: 'rgba(255,170,50,' + (0.05 + pulse) + ')' },
                { x: W * 0.75, y: H * 0.3, r: W * 0.28, color: 'rgba(255,170,50,' + (0.05 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.6, r: W * 0.3, color: 'rgba(255,150,30,' + (0.04 + pulse) + ')' },
                { x: W * 0.15, y: H * 0.7, r: W * 0.2, color: 'rgba(255,140,20,' + (0.03 + pulse) + ')' },
                { x: W * 0.85, y: H * 0.7, r: W * 0.2, color: 'rgba(255,140,20,' + (0.03 + pulse) + ')' }
            ];
        } else if (roomKey === 'zone_voyage') {
            // Blue tones
            lights = [
                { x: W * 0.5, y: H * 0.15, r: W * 0.4, color: 'rgba(50,80,200,' + (0.05 + pulse) + ')' },
                { x: W * 0.2, y: H * 0.6, r: W * 0.25, color: 'rgba(60,100,220,' + (0.04 + pulse) + ')' },
                { x: W * 0.8, y: H * 0.6, r: W * 0.25, color: 'rgba(60,100,220,' + (0.04 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.8, r: W * 0.3, color: 'rgba(40,70,180,' + (0.03 + pulse) + ')' }
            ];
        } else if (roomKey === 'zone_immersion') {
            // Purple tones
            lights = [
                { x: W * 0.5, y: H * 0.2, r: W * 0.45, color: 'rgba(120,40,200,' + (0.05 + pulse) + ')' },
                { x: W * 0.15, y: H * 0.5, r: W * 0.2, color: 'rgba(140,50,220,' + (0.04 + pulse) + ')' },
                { x: W * 0.85, y: H * 0.5, r: W * 0.2, color: 'rgba(140,50,220,' + (0.04 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.65, r: W * 0.3, color: 'rgba(100,30,180,' + (0.04 + pulse) + ')' }
            ];
        } else if (roomKey === 'zone_sensoriel') {
            // Pink/purple tones
            lights = [
                { x: W * 0.3, y: H * 0.25, r: W * 0.3, color: 'rgba(200,50,180,' + (0.04 + pulse) + ')' },
                { x: W * 0.7, y: H * 0.25, r: W * 0.3, color: 'rgba(180,40,200,' + (0.04 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.55, r: W * 0.35, color: 'rgba(220,60,200,' + (0.05 + pulse) + ')' },
                { x: W * 0.2, y: H * 0.7, r: W * 0.2, color: 'rgba(160,30,160,' + (0.03 + pulse) + ')' },
                { x: W * 0.8, y: H * 0.7, r: W * 0.2, color: 'rgba(160,30,160,' + (0.03 + pulse) + ')' }
            ];
        } else if (roomKey === 'bar') {
            // Warm gold tones
            lights = [
                { x: W * 0.5, y: H * 0.12, r: W * 0.4, color: 'rgba(255,200,50,' + (0.05 + pulse) + ')' },
                { x: W * 0.15, y: H * 0.5, r: W * 0.22, color: 'rgba(255,180,30,' + (0.04 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.5, r: W * 0.22, color: 'rgba(255,180,30,' + (0.04 + pulse) + ')' },
                { x: W * 0.85, y: H * 0.5, r: W * 0.22, color: 'rgba(255,180,30,' + (0.04 + pulse) + ')' },
                { x: W * 0.5, y: H * 0.8, r: W * 0.3, color: 'rgba(255,160,20,' + (0.03 + pulse) + ')' }
            ];
        }
        lights.forEach(function(l) {
            var lg = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
            lg.addColorStop(0, l.color);
            lg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = lg;
            ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
        });
    }

    /* ═══════════════════════════════════════
       WALL DECORATIONS PER ROOM
       ═══════════════════════════════════════ */
    function drawWallDecorations(roomKey) {
        var wallH = H * 0.04;
        if (roomKey === 'entree') {
            // Stone-themed sconces on pillars
            drawWallSconce(W * 0.14, H * 0.25);
            drawWallSconce(W * 0.86, H * 0.25);
        } else if (roomKey === 'lobby') {
            // Paintings on walls
            drawPainting(W * 0.06, wallH + 10, 40, 28, ['#2a1a10', '#4a3020', '#1a0a05']);
            drawPainting(W * 0.9, wallH + 10, 40, 28, ['#0a1a2a', '#1a2a4a', '#050f1a']);
            // Sconces
            drawWallSconce(W * 0.15, wallH + 50);
            drawWallSconce(W * 0.85, wallH + 50);
            drawWallSconce(W * 0.5, wallH + 8);
        } else if (roomKey === 'cuisine') {
            // Kitchen art
            drawPainting(W * 0.85, wallH + 10, 36, 24, ['#3a2a10', '#5a4020', '#2a1a08']);
            drawWallSconce(W * 0.08, wallH + 40);
            drawWallSconce(W * 0.92, wallH + 40);
        } else if (roomKey === 'zone_origine') {
            // Classic art paintings
            drawPainting(W * 0.06, wallH + 12, 44, 30, ['#2a2010', '#4a3a20', '#3a2a15']);
            drawPainting(W * 0.88, wallH + 12, 44, 30, ['#1a2a10', '#2a3a18', '#0a1a08']);
            // Sconces between tables
            drawWallSconce(W * 0.5, wallH + 8);
            drawWallSconce(W * 0.06, H * 0.5);
        } else if (roomKey === 'zone_voyage') {
            // Travel-themed paintings
            drawPainting(W * 0.04, wallH + 10, 38, 26, ['#1a1a3a', '#2a2a5a', '#0a0a2a']);
            drawPainting(W * 0.9, wallH + 10, 38, 26, ['#2a1a2a', '#4a2a4a', '#1a0a1a']);
            drawWallSconce(W * 0.06, H * 0.5);
            drawWallSconce(W * 0.94, H * 0.5);
        } else if (roomKey === 'zone_immersion') {
            // Minimal - the projections are the decoration
            drawWallSconce(W * 0.06, H * 0.55);
            drawWallSconce(W * 0.94, H * 0.55);
        } else if (roomKey === 'zone_sensoriel') {
            // Moody purple paintings
            drawPainting(W * 0.05, wallH + 10, 36, 24, ['#2a0a3a', '#3a1a4a', '#1a0a2a']);
            drawPainting(W * 0.9, wallH + 10, 36, 24, ['#3a0a2a', '#4a1a3a', '#2a0a1a']);
            drawWallSconce(W * 0.06, H * 0.5);
            drawWallSconce(W * 0.94, H * 0.5);
        } else if (roomKey === 'bar') {
            // Bar artwork
            drawPainting(W * 0.04, wallH + 10, 34, 22, ['#2a1a30', '#3a2a40', '#1a0a20']);
            drawPainting(W * 0.92, wallH + 10, 34, 22, ['#3a2a10', '#5a4020', '#2a1a08']);
            drawWallSconce(W * 0.3, wallH + 8);
            drawWallSconce(W * 0.7, wallH + 8);
        }
    }

    /* ═══════════════════════════════════════
       ROOM-SPECIFIC DETAILED DRAWING
       ═══════════════════════════════════════ */
    function drawRoomDetails(room) {
        var r = state.room;
        if (r === 'entree') {
            // Neon sign
            ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 30;
            ctx.fillStyle = '#00e5ff'; ctx.font = 'bold '+Math.max(24,W*.03)+'px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('VIREALYS', W/2, H*.12);
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0,229,255,0.5)'; ctx.font = (W*.012)+'px sans-serif';
            ctx.fillText('Restaurant Slow Food Immersif', W/2, H*.17);
            // Pillars
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(W*.12, H*.2, W*.04, H*.55);
            ctx.fillRect(W*.84, H*.2, W*.04, H*.55);
            // Pillar detail
            ctx.fillStyle = 'rgba(0,229,255,0.05)';
            ctx.fillRect(W*.125, H*.2, W*.01, H*.55);
            ctx.fillRect(W*.845, H*.2, W*.01, H*.55);
            // Floor carpet
            ctx.fillStyle = 'rgba(100,50,50,0.08)';
            ctx.fillRect(W*.3, H*.4, W*.4, H*.5);
        } else if (r === 'lobby') {
            // Central chandelier glow
            var chg = ctx.createRadialGradient(W/2, H*.15, 0, W/2, H*.15, H*.25);
            chg.addColorStop(0, 'rgba(255,215,0,0.08)'); chg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = chg; ctx.fillRect(0, 0, W, H*.4);
            // Couches
            drawCouch(W*.28, H*.38, W*.18, H*.1, '#1f1528');
            drawCouch(W*.54, H*.38, W*.18, H*.1, '#1f1528');
            // Plants
            drawPlant(W*.15, H*.7, 20);
            drawPlant(W*.85, H*.7, 20);
            // Welcome desk
            drawCounter(W*.35, H*.08, W*.3, H*.06);
        } else if (r === 'cuisine') {
            // Counter
            drawCounter(W*.12, H*.12, W*.35, H*.08);
            // Stove
            ctx.fillStyle = '#2a2a2a'; ctx.fillRect(W*.55, H*.12, W*.25, H*.1);
            ctx.fillStyle = '#3a1a0a';
            ctx.beginPath(); ctx.arc(W*.62, H*.17, 8, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(W*.72, H*.17, 8, 0, Math.PI*2); ctx.fill();
            // Flame under
            ctx.fillStyle = 'rgba(255,100,0,0.3)';
            ctx.beginPath(); ctx.arc(W*.62, H*.17, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(W*.72, H*.17, 5, 0, Math.PI*2); ctx.fill();
            // Island
            drawCounter(W*.3, H*.7, W*.35, H*.08);
            // Plat signature
            drawTable(W*.2, H*.5, W*.18, H*.1, false);
            ctx.fillStyle = '#fff'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('\ud83c\udf56 Plat Signature', W*.29, H*.48);
            // Hanging pots
            ctx.fillStyle = '#333';
            ctx.fillRect(W*.15, H*.05, 3, H*.08);
            ctx.fillRect(W*.25, H*.05, 3, H*.06);
            ctx.beginPath(); ctx.arc(W*.155, H*.13, 6, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(W*.255, H*.11, 5, 0, Math.PI*2); ctx.fill();
        } else if (r === 'zone_origine') {
            // 4 detailed tables with candles
            drawTable(W*.15, H*.25, W*.18, H*.12, true);
            drawTable(W*.62, H*.25, W*.18, H*.12, true);
            drawTable(W*.15, H*.6, W*.18, H*.12, true);
            drawTable(W*.62, H*.6, W*.18, H*.12, true);
            // Chairs
            drawChair(W*.20, H*.17, 'up'); drawChair(W*.26, H*.17, 'up');
            drawChair(W*.20, H*.39, 'down'); drawChair(W*.26, H*.39, 'down');
            drawChair(W*.67, H*.17, 'up'); drawChair(W*.73, H*.17, 'up');
            drawChair(W*.67, H*.39, 'down'); drawChair(W*.73, H*.39, 'down');
            // Warm ambient light
            var wl = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*.4);
            wl.addColorStop(0, 'rgba(255,170,0,0.04)'); wl.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = wl; ctx.fillRect(0,0,W,H);
        } else if (r === 'zone_voyage') {
            // Large projection screen
            drawProjection(W*.15, H*.06, W*.7, H*.22, 'rgba(77,124,255', 'Vignoble Toscan');
            // Tables
            drawTable(W*.12, H*.5, W*.18, H*.1, false);
            drawTable(W*.65, H*.5, W*.18, H*.1, false);
            // Wine display
            drawCounter(W*.38, H*.72, W*.24, H*.06);
            drawWineBottle(W*.42, H*.62); drawWineBottle(W*.48, H*.63); drawWineBottle(W*.54, H*.61);
            drawWineGlass(W*.15, H*.52); drawWineGlass(W*.22, H*.53);
            drawWineGlass(W*.68, H*.52); drawWineGlass(W*.76, H*.53);
        } else if (r === 'zone_immersion') {
            // Massive 270° projection
            drawProjection(W*.03, H*.04, W*.94, H*.3, 'rgba(168,85,247', '\ud83c\udf0c For\u00eat Enchant\u00e9e \u2014 Projection 270\u00b0');
            // Side projections
            drawProjection(W*.03, H*.35, W*.08, H*.4, 'rgba(168,85,247', '');
            drawProjection(W*.89, H*.35, W*.08, H*.4, 'rgba(168,85,247', '');
            // Immersive table
            drawTable(W*.33, H*.52, W*.34, H*.15, true);
            drawChair(W*.40, H*.44, 'up'); drawChair(W*.55, H*.44, 'up');
            drawChair(W*.40, H*.69, 'down'); drawChair(W*.55, H*.69, 'down');
            // Speakers
            ctx.fillStyle = '#1a1a3a';
            ctx.beginPath(); ctx.arc(W*.2, H*.7, 12, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(W*.8, H*.7, 12, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(168,85,247,0.3)';
            ctx.beginPath(); ctx.arc(W*.2, H*.7, 6, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(W*.8, H*.7, 6, 0, Math.PI*2); ctx.fill();
        } else if (r === 'zone_sensoriel') {
            // Mist effect
            drawMist(W*.1, H*.1, W*.8, H*.3, 'rgba(224,64,251,0.04)');
            // Vibrating table
            var vib = Math.sin(frame*.1)*2;
            drawTable(W*.28+vib, H*.52, W*.4, H*.14, true);
            drawChair(W*.38, H*.44, 'up'); drawChair(W*.55, H*.44, 'up');
            drawChair(W*.38, H*.68, 'down'); drawChair(W*.55, H*.68, 'down');
            // Diffusers with mist
            ctx.fillStyle = '#2a0a3a';
            ctx.beginPath(); ctx.arc(W*.15, H*.5, 10, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(W*.85, H*.5, 10, 0, Math.PI*2); ctx.fill();
            drawMist(W*.1, H*.4, W*.1, H*.2, 'rgba(200,150,255,0.05)');
            drawMist(W*.8, H*.4, W*.1, H*.2, 'rgba(200,150,255,0.05)');
            // Floor vibration lines
            ctx.strokeStyle = 'rgba(224,64,251,0.08)'; ctx.lineWidth = 1;
            for (var vi = 0; vi < 6; vi++) {
                var vy = H*.5 + vi*15 + Math.sin(frame*.05+vi)*3;
                ctx.beginPath(); ctx.moveTo(W*.2, vy); ctx.lineTo(W*.8, vy); ctx.stroke();
            }
        } else if (r === 'bar') {
            // Bar counter
            drawCounter(W*.1, H*.08, W*.8, H*.1);
            // Bar stools
            drawStool(W*.2, H*.22); drawStool(W*.35, H*.22); drawStool(W*.5, H*.22);
            drawStool(W*.65, H*.22); drawStool(W*.8, H*.22);
            // Bottles behind bar
            for (var bi = 0; bi < 8; bi++) { drawWineBottle(W*.15 + bi*W*.08, H*.02); }
            // Tables
            drawTable(W*.08, H*.48, W*.15, H*.1, true);
            drawTable(W*.42, H*.48, W*.15, H*.1, true);
            drawTable(W*.76, H*.48, W*.15, H*.1, true);
            // Cocktail display
            ctx.fillStyle = 'rgba(255,215,0,0.1)';
            ctx.beginPath(); ctx.arc(W*.9, H*.15, 15, 0, Math.PI*2); ctx.fill();
            drawWineGlass(W*.88, H*.13); drawWineGlass(W*.92, H*.12);
        }
    }

    function drawCouch(x, y, w, h, color) {
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x+3, y+3, w, h);
        ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x, y, w, h*.3);
        // Armrests
        ctx.fillStyle = color; ctx.fillRect(x-4, y+2, 4, h-4); ctx.fillRect(x+w, y+2, 4, h-4);
        // Cushion lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x+w*.33, y); ctx.lineTo(x+w*.33, y+h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+w*.66, y); ctx.lineTo(x+w*.66, y+h); ctx.stroke();
    }

    /* ═══════════════════════════════════════
       DRAW MAIN
       ═══════════════════════════════════════ */
    function draw() {
        ctx.imageSmoothingEnabled = false;

        var room = ROOMS[state.room];
        // Background gradient
        var grad = ctx.createLinearGradient(0,0,0,H);
        grad.addColorStop(0, room.bgTop); grad.addColorStop(1, room.bgBot);
        ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

        // Floor pattern per room type
        var r = state.room;
        if (r === 'entree') {
            drawFloorStone();
        } else if (r === 'zone_sensoriel') {
            drawFloorDarkCarpet();
        } else {
            drawFloorParquet();
        }

        // Ambient lighting per room
        drawAmbientLighting(r);

        // Walls with wainscoting
        var wallH = H*.04;
        ctx.fillStyle = 'rgba(20,20,40,0.8)'; ctx.fillRect(0,0,W,wallH); ctx.fillRect(0,H-wallH,W,wallH);
        ctx.fillRect(0,0,W*.025,H); ctx.fillRect(W*.975,0,W*.025,H);
        // Wall trim
        ctx.fillStyle = 'rgba(0,229,255,0.08)';
        ctx.fillRect(0,wallH-2,W,2); ctx.fillRect(0,H-wallH,W,2);
        ctx.fillRect(W*.025-1,0,1,H); ctx.fillRect(W*.975,0,1,H);

        // Crown molding
        drawCrownMolding(wallH);

        // Wall decorations (paintings, sconces)
        drawWallDecorations(r);

        // Doors (glowing arches)
        room.doors.forEach(function(d) {
            var dx=px(d.x,W), dy=px(d.y,H), dw=px(d.w,W), dh=px(d.h,H);
            var pulse = .5 + Math.sin(frame*.05)*.3;
            // Door frame
            ctx.fillStyle = 'rgba(0,229,255,0.1)'; ctx.fillRect(dx-3,dy-3,dw+6,dh+6);
            // Door
            ctx.fillStyle = 'rgba(0,229,255,'+pulse+')'; ctx.fillRect(dx,dy,dw,dh);
            // Door glow
            var dg = ctx.createRadialGradient(dx+dw/2, dy+dh/2, 0, dx+dw/2, dy+dh/2, Math.max(dw,dh)*1.5);
            dg.addColorStop(0, 'rgba(0,229,255,0.08)'); dg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = dg; ctx.fillRect(dx-40, dy-40, dw+80, dh+80);
            // Label
            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(d.label, dx+dw/2, dy+dh/2+4);
        });

        // Room-specific detailed furniture
        drawRoomDetails(room);

        // Furniture with interaction highlight
        room.furniture.forEach(function(f) {
            if (nearEnt === f) {
                var fx = px(f.x,W), fy = px(f.y,H), fw = px(f.w||5,W), fh = px(f.h||5,H);
                ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2;
                ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12;
                ctx.strokeRect(fx-3, fy-3, fw+6, fh+6);
                ctx.shadowBlur = 0;
                // Label
                ctx.fillStyle = '#00e5ff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(f.label, fx+fw/2, fy-10);
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

        // Slow food tip overlay
        drawSlowFoodTip();

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
