/**
 * Virealys Experience v2.0 — Aventure Interactive Complete
 * Point-and-click adventure dans le restaurant
 *
 * Features:
 * - Character creation (nom, couleurs avatar)
 * - 8 salles navigables (entree, lobby, cuisine, 4 zones, bar)
 * - PNJ interactifs avec dialogues
 * - Quetes et missions
 * - Systeme de passeport et XP
 * - Navigation par portes/fleches
 * - Sauvegarde localStorage
 */
(function () {
    'use strict';

    var SAVE_KEY = 'vr_game2';
    var TYPE_SPEED = 35;

    /* ═══════════════════════════════════════
       ROOMS — 8 salles du restaurant
       ═══════════════════════════════════════ */
    var ROOMS = {
        'creation': {
            name: 'Cr\u00e9ation du personnage',
            bg: 'linear-gradient(180deg, #020010, #0a0a2e, #06060f)',
            description: 'Bienvenue chez Virealys. Cr\u00e9ez votre avatar avant d\'entrer.',
            hotspots: [],
            exits: {}
        },
        'entree': {
            name: 'Entr\u00e9e du Restaurant',
            bg: 'linear-gradient(180deg, #020010 0%, #0a0a2e 60%, #06060f 100%)',
            description: 'La fa\u00e7ade de Virealys s\'\u00e9claire devant vous. Des reflets holographiques dansent sur les murs.',
            hotspots: [
                { id: 'door', label: 'Porte d\'entr\u00e9e', x: 45, y: 70, icon: '\ud83d\udeaa', action: 'enter_lobby' },
                { id: 'sign', label: 'Enseigne', x: 45, y: 20, icon: '\u2726', action: 'read_sign' }
            ],
            exits: { 'entrer': 'lobby' },
            npc: null
        },
        'lobby': {
            name: 'Le Hall d\'Accueil',
            bg: 'linear-gradient(135deg, #06060f 0%, #12122a 50%, #0a0a1a 100%)',
            description: 'Un hall majestueux. L\'h\u00f4te vous sourit. Quatre couloirs m\u00e8nent aux diff\u00e9rentes zones.',
            hotspots: [
                { id: 'hote', label: 'L\'H\u00f4te', x: 45, y: 40, icon: '\ud83d\udc64', action: 'talk_hote' },
                { id: 'door_origine', label: 'Zone Origine', x: 10, y: 55, icon: '\u2190', action: 'goto_origine' },
                { id: 'door_voyage', label: 'Zone Voyage', x: 80, y: 55, icon: '\u2192', action: 'goto_voyage' },
                { id: 'door_immersion', label: 'Zone Immersion', x: 10, y: 80, icon: '\u2190', action: 'goto_immersion' },
                { id: 'door_sensoriel', label: 'Zone Sensoriel', x: 80, y: 80, icon: '\u2192', action: 'goto_sensoriel' },
                { id: 'door_cuisine', label: 'Cuisine', x: 45, y: 15, icon: '\u2191', action: 'goto_cuisine' },
                { id: 'door_bar', label: 'Le Bar', x: 80, y: 20, icon: '\u2192', action: 'goto_bar' }
            ],
            exits: { 'sortir': 'entree' }
        },
        'cuisine': {
            name: 'La Cuisine',
            bg: 'linear-gradient(135deg, #1a0f0a 0%, #2e1a10 50%, #06060f 100%)',
            description: 'La cuisine ouverte. Le Chef pr\u00e9pare un plat signature. L\'odeur est envo\u00fbtante... Imaginez-la.',
            hotspots: [
                { id: 'chef', label: 'Le Chef', x: 40, y: 40, icon: '\ud83d\udc68\u200d\ud83c\udf73', action: 'talk_chef' },
                { id: 'plat', label: 'Plat en pr\u00e9paration', x: 60, y: 55, icon: '\ud83c\udf7d\ufe0f', action: 'watch_plat' },
                { id: 'retour', label: 'Retour au hall', x: 45, y: 90, icon: '\u2193', action: 'goto_lobby' }
            ],
            exits: { 'retour': 'lobby' },
            stamp: 'stamp_cuisine'
        },
        'zone_origine': {
            name: 'Zone Origine',
            bg: 'linear-gradient(135deg, #0a1a0a 0%, #0f2010 50%, #06060f 100%)',
            description: 'L\'essentiel. Bois naturel, lumi\u00e8re tamis\u00e9e. Ici, seul le go\u00fbt compte.',
            hotspots: [
                { id: 'table', label: 'S\'asseoir', x: 40, y: 50, icon: '\ud83e\udeb5', action: 'sit_origine' },
                { id: 'serveur', label: 'Le Serveur', x: 70, y: 40, icon: '\ud83d\udc64', action: 'talk_serveur_o' },
                { id: 'retour', label: 'Retour au hall', x: 45, y: 90, icon: '\u2193', action: 'goto_lobby' }
            ],
            exits: { 'retour': 'lobby' },
            stamp: 'stamp_origine'
        },
        'zone_voyage': {
            name: 'Zone Voyage',
            bg: 'linear-gradient(135deg, #0a0a2e 0%, #0f1a3e 50%, #06060f 100%)',
            description: 'Des projections subtiles sur les murs. Un vignoble toscan, un march\u00e9 proven\u00e7al...',
            hotspots: [
                { id: 'projection', label: 'Les Projections', x: 50, y: 30, icon: '\ud83c\udfa5', action: 'watch_projection' },
                { id: 'sommelier', label: 'Le Sommelier', x: 25, y: 50, icon: '\ud83d\udc64', action: 'talk_sommelier' },
                { id: 'retour', label: 'Retour au hall', x: 45, y: 90, icon: '\u2193', action: 'goto_lobby' }
            ],
            exits: { 'retour': 'lobby' },
            stamp: 'stamp_voyage',
            challenge: {
                question: 'Quel vin avec un carpaccio de Saint-Jacques ?',
                options: ['Muscadet S\u00e8vre-et-Maine', 'Chateauneuf-du-Pape rouge', 'Champagne ros\u00e9'],
                correct: 0,
                xp: 30,
                feedback: ['Excellent ! La min\u00e9ralit\u00e9 du Muscadet est parfaite.', 'Trop puissant pour la d\u00e9licatesse des Saint-Jacques.', 'Int\u00e9ressant mais pas l\'accord id\u00e9al.']
            }
        },
        'zone_immersion': {
            name: 'Zone Immersion',
            bg: 'linear-gradient(135deg, #1a0a2e 0%, #2a0f3e 50%, #06060f 100%)',
            description: 'Projection 270\u00b0. Les murs, le plafond, tout s\'anime. Vous \u00eates DANS le voyage.',
            hotspots: [
                { id: 'ambiance', label: 'Changer l\'ambiance', x: 50, y: 30, icon: '\ud83c\udf0c', action: 'change_ambiance' },
                { id: 'table', label: 'Votre table', x: 40, y: 60, icon: '\ud83e\udeb5', action: 'sit_immersion' },
                { id: 'retour', label: 'Retour au hall', x: 45, y: 90, icon: '\u2193', action: 'goto_lobby' }
            ],
            exits: { 'retour': 'lobby' },
            stamp: 'stamp_immersion'
        },
        'zone_sensoriel': {
            name: 'Zone Sensoriel',
            bg: 'linear-gradient(135deg, #2a0a2e 0%, #3e0f3e 50%, #06060f 100%)',
            description: 'L\'exp\u00e9rience totale. Brume parfum\u00e9e, vibrations, son spatial. Impossible \u00e0 reproduire sur \u00e9cran.',
            hotspots: [
                { id: 'experience', label: 'Lancer l\'exp\u00e9rience', x: 45, y: 40, icon: '\u2728', action: 'start_sensoriel' },
                { id: 'retour', label: 'Retour au hall', x: 45, y: 90, icon: '\u2193', action: 'goto_lobby' }
            ],
            exits: { 'retour': 'lobby' },
            stamp: 'stamp_sensoriel',
            cta: 'La brume, les vibrations... Seule une visite peut vous offrir \u00e7a.'
        },
        'bar': {
            name: 'Le Bar',
            bg: 'linear-gradient(135deg, #0f0a1a 0%, #1a102e 50%, #06060f 100%)',
            description: 'Le bar \u00e0 cocktails. Lumi\u00e8res tamis\u00e9es, ambiance feutr\u00e9e.',
            hotspots: [
                { id: 'barman', label: 'Le Barman', x: 45, y: 35, icon: '\ud83d\udc64', action: 'talk_barman' },
                { id: 'cocktail', label: 'Commander', x: 65, y: 50, icon: '\ud83c\udf78', action: 'order_cocktail' },
                { id: 'retour', label: 'Retour au hall', x: 45, y: 90, icon: '\u2193', action: 'goto_lobby' }
            ],
            exits: { 'retour': 'lobby' },
            stamp: 'stamp_bar'
        }
    };

    /* ═══════════════════════════════════════
       DIALOGUES
       ═══════════════════════════════════════ */
    var DIALOGUES = {
        'read_sign': {
            speaker: 'Enseigne',
            lines: ['VIREALYS', 'Le premier restaurant Slow Food immersif & \u00e9volutif.', 'R\u00e9servations : tous les soirs.']
        },
        'talk_hote': {
            speaker: 'L\'H\u00f4te',
            lines: ['Bienvenue chez Virealys !', 'Quatre zones vous attendent, chacune avec son niveau d\'immersion.', 'La cuisine est ouverte, le bar vous accueille aussi.', 'Explorez librement et collectez vos tampons passeport !']
        },
        'talk_chef': {
            speaker: 'Le Chef',
            lines: ['Bienvenue dans ma cuisine !', 'Ici tout est Slow Food : local, saisonnier, respectueux.', 'Chaque producteur est notre voisin.', 'Ce soir, filet de b\u0153uf Wagyu, laquage miso, truffe du P\u00e9rigord.', 'Imaginez les ar\u00f4mes... Seule une visite peut vous les offrir.']
        },
        'watch_plat': {
            speaker: 'Narrateur',
            lines: ['Le Chef dresse un plat avec une pr\u00e9cision chirurgicale.', 'Chaque \u00e9l\u00e9ment est plac\u00e9 comme une \u0153uvre d\'art.', 'La sauce est vers\u00e9e au dernier moment, juste avant le service.', 'L\'ar\u00f4me emplit la cuisine... mais votre \u00e9cran ne peut pas le transmettre.']
        },
        'sit_origine': {
            speaker: 'Narrateur',
            lines: ['Vous vous installez. Le bois est chaud sous vos mains.', 'La lumi\u00e8re des bougies danse doucement.', 'Pas de projection, pas d\'effet. Juste vous et la gastronomie.', 'L\'essentiel. Le vrai Slow Food.']
        },
        'talk_serveur_o': {
            speaker: 'Le Serveur',
            lines: ['Bienvenue en Zone Origine.', 'Notre formule Classique \u00e0 45\u20ac : entr\u00e9e, plat, dessert.', 'Chaque ingr\u00e9dient vient de moins de 50km.', 'Puis-je vous recommander le carpaccio de Saint-Jacques ?']
        },
        'watch_projection': {
            speaker: 'Narrateur',
            lines: ['Les murs s\'animent. Un vignoble appara\u00eet autour de vous.', 'Les rangs de vigne s\'\u00e9tendent \u00e0 perte de vue.', 'Le soleil se couche. Les couleurs changent.', 'C\'est beau... mais ce n\'est qu\'une projection.', 'En vrai, c\'est 12 m\u00e8tres de haut. \u00c0 couper le souffle.']
        },
        'talk_sommelier': {
            speaker: 'Le Sommelier',
            lines: ['Bonsoir ! Je suis l\u00e0 pour sublimer votre repas.', 'Chaque plat a son accord parfait.', 'Testons vos connaissances...'],
            triggerChallenge: true
        },
        'change_ambiance': {
            speaker: 'Syst\u00e8me',
            lines: ['Les projections changent autour de vous.', 'For\u00eat enchant\u00e9e... Oc\u00e9an profond... Aurore bor\u00e9ale... Cosmos...', 'Quatre ambiances, quatre saisons. Chaque visite est unique.', 'Laquelle vivrez-vous en vrai ?']
        },
        'sit_immersion': {
            speaker: 'Narrateur',
            lines: ['Vous vous asseyez. Les projections 270\u00b0 vous enveloppent.', 'Le son spatial murmure autour de vous.', 'Des particules de lumi\u00e8re flottent dans l\'air.', 'Vous oubliez que vous \u00eates dans un restaurant.', 'C\'est exactement le but.']
        },
        'start_sensoriel': {
            speaker: 'Narrateur',
            lines: ['L\'\u00e9clairage s\'\u00e9teint compl\u00e8tement.', 'Une brume l\u00e9g\u00e8re envahit votre espace, parfum\u00e9e \u00e0 la lavande.', 'Le sol vibre doucement sous vos pieds.', 'Des aurores bor\u00e9ales holographiques explosent au plafond.', 'Un violoncelle r\u00e9sonne dans le noir.', 'C\'est impossible \u00e0 reproduire sur un \u00e9cran.', 'Ce moment n\'existe qu\'ici. Qu\'en vrai. Chez Virealys.']
        },
        'talk_barman': {
            speaker: 'Le Barman',
            lines: ['Bonsoir ! Cocktail signature ce soir ?', 'Le "Constellation" : gin infus\u00e9 au thym, tonic artisanal, z\u00e9leste de yuzu.', 'Servi avec une brume glac\u00e9e qui d\u00e9borde du verre.', 'Visuellement spectaculaire. Gustativement divin.']
        },
        'order_cocktail': {
            speaker: 'Le Barman',
            lines: ['Voil\u00e0 votre Constellation !', 'La brume glac\u00e9e d\u00e9borde du verre...', 'Les ar\u00f4mes de thym et de yuzu s\'\u00e9l\u00e8vent...', 'Vous ne pouvez pas les sentir ici. Mais au bar de Virealys, oui.']
        },
        'enter_lobby': {
            speaker: 'Narrateur',
            lines: ['Vous poussez la porte...']
        }
    };

    /* ═══════════════════════════════════════
       STAMPS
       ═══════════════════════════════════════ */
    var STAMPS = {
        stamp_cuisine:   { emoji: '\ud83d\udc68\u200d\ud83c\udf73', name: 'Cuisine' },
        stamp_origine:   { emoji: '\ud83c\udf3f',   name: 'Origine' },
        stamp_voyage:    { emoji: '\u2708\ufe0f',    name: 'Voyage' },
        stamp_immersion: { emoji: '\ud83c\udf0a',    name: 'Immersion' },
        stamp_sensoriel: { emoji: '\u2728',          name: 'Sensoriel' },
        stamp_bar:       { emoji: '\ud83c\udf78',    name: 'Bar' }
    };

    /* ═══════════════════════════════════════
       AVATAR COLORS
       ═══════════════════════════════════════ */
    var AVATAR_OPTIONS = {
        skin: ['#fce4c0', '#f4c794', '#d4a373', '#a67c5a', '#6b4226', '#3d2314'],
        hair: ['#2c1810', '#5a3825', '#c4883f', '#e8c547', '#d44e28', '#1a1a2e', '#e0e0e0', '#ff69b4'],
        hairStyle: ['court', 'long', 'punk', 'boucl\u00e9'],
        eyes: ['#2c1810', '#1a6b3d', '#2563eb', '#7c3aed', '#92400e'],
        outfit: ['#00e5ff', '#4d7cff', '#a855f7', '#e040fb', '#10b981', '#f97316', '#ef4444', '#ffd700'],
        accessory: ['aucun', 'lunettes', 'chapeau', 'boucles']
    };

    /* ═══════════════════════════════════════
       STATE
       ═══════════════════════════════════════ */
    var state = {
        phase: 'creation',
        room: 'creation',
        playerName: '',
        avatar: { skin: 0, hair: 0, hairStyle: 0, eyes: 0, outfit: 0, accessory: 0 },
        xp: 0,
        stamps: [],
        visited: [],
        questsDone: []
    };

    /* ═══════════════════════════════════════
       DOM
       ═══════════════════════════════════════ */
    var $ = {};
    var gameEl;

    function init() {
        gameEl = document.getElementById('vr-game');
        if (!gameEl) return;
        gameEl.style.touchAction = 'manipulation';

        if (loadSave() && state.phase === 'playing') {
            renderRoom(state.room);
        } else {
            renderCreation();
        }
    }

    /* ═══════════════════════════════════════
       CHARACTER CREATION
       ═══════════════════════════════════════ */
    function renderCreation() {
        state.phase = 'creation';
        gameEl.innerHTML = '<div class="gc-screen">' +
            '<h2 class="gc-title">Cr\u00e9ez votre personnage</h2>' +
            '<div class="gc-avatar-preview" id="gc-avatar"></div>' +
            '<div class="gc-form">' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Votre pr\u00e9nom</label>' +
                    '<input type="text" class="gc-input" id="gc-name" placeholder="Entrez votre pr\u00e9nom" maxlength="20">' +
                '</div>' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Couleur de peau</label>' +
                    '<div class="gc-colors" id="gc-skin"></div>' +
                '</div>' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Couleur des yeux</label>' +
                    '<div class="gc-colors" id="gc-eyes"></div>' +
                '</div>' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Couleur des cheveux</label>' +
                    '<div class="gc-colors" id="gc-hair"></div>' +
                '</div>' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Coiffure</label>' +
                    '<div class="gc-options" id="gc-hairStyle"></div>' +
                '</div>' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Tenue</label>' +
                    '<div class="gc-colors" id="gc-outfit"></div>' +
                '</div>' +
                '<div class="gc-field">' +
                    '<label class="gc-label">Accessoire</label>' +
                    '<div class="gc-options" id="gc-accessory"></div>' +
                '</div>' +
            '</div>' +
            '<button class="game-choice-btn gc-start" id="gc-start">\u2726 Entrer chez Virealys \u2726</button>' +
        '</div>';

        renderColorPickers();
        updateAvatarPreview();

        document.getElementById('gc-start').addEventListener('click', function () {
            var name = document.getElementById('gc-name').value.trim();
            state.playerName = name || 'Voyageur';
            state.phase = 'playing';
            state.room = 'entree';
            save();
            renderRoom('entree');
        });
    }

    function renderColorPickers() {
        // Color-based options
        ['skin', 'hair', 'eyes', 'outfit'].forEach(function (type) {
            var container = document.getElementById('gc-' + type);
            if (!container) return;
            container.innerHTML = ''; // clear before refill
            AVATAR_OPTIONS[type].forEach(function (color, i) {
                var btn = document.createElement('button');
                btn.className = 'gc-color-btn' + (state.avatar[type] === i ? ' gc-color-active' : '');
                btn.style.background = color;
                btn.addEventListener('click', function () {
                    state.avatar[type] = i;
                    renderColorPickers();
                    updateAvatarPreview();
                });
                container.appendChild(btn);
            });
        });
        // Text-based options (hairStyle, accessory)
        ['hairStyle', 'accessory'].forEach(function (type) {
            var container = document.getElementById('gc-' + type);
            if (!container) return;
            container.innerHTML = '';
            AVATAR_OPTIONS[type].forEach(function (label, i) {
                var btn = document.createElement('button');
                btn.className = 'gc-option-btn' + (state.avatar[type] === i ? ' gc-option-active' : '');
                btn.textContent = label;
                btn.addEventListener('click', function () {
                    state.avatar[type] = i;
                    renderColorPickers();
                    updateAvatarPreview();
                });
                container.appendChild(btn);
            });
        });
    }

    function getAvatarStyle() {
        return '--av-skin:' + AVATAR_OPTIONS.skin[state.avatar.skin] +
            ';--av-hair:' + AVATAR_OPTIONS.hair[state.avatar.hair] +
            ';--av-eyes:' + AVATAR_OPTIONS.eyes[state.avatar.eyes] +
            ';--av-outfit:' + AVATAR_OPTIONS.outfit[state.avatar.outfit];
    }

    function getAvatarClasses() {
        var hs = AVATAR_OPTIONS.hairStyle[state.avatar.hairStyle] || 'court';
        var acc = AVATAR_OPTIONS.accessory[state.avatar.accessory] || 'aucun';
        return 'av-hs-' + hs.replace(/\u00e9/g,'e') + (acc !== 'aucun' ? ' av-acc-' + acc : '');
    }

    function buildAvatarHTML(size) {
        var cls = (size === 'sm') ? 'avatar avatar-sm' : 'avatar';
        return '<div class="' + cls + ' ' + getAvatarClasses() + '" style="' + getAvatarStyle() + '">' +
            '<div class="av-acc"></div>' +
            '<div class="av-hair"></div>' +
            '<div class="av-head"><div class="av-eyes"></div><div class="av-mouth"></div></div>' +
            '<div class="av-body"></div>' +
            '<div class="av-legs"></div>' +
        '</div>';
    }

    function updateAvatarPreview() {
        var el = document.getElementById('gc-avatar');
        if (!el) return;
        el.innerHTML = buildAvatarHTML('lg');
    }

    function getAvatarHTML() {
        return buildAvatarHTML('sm');
    }

    /* ═══════════════════════════════════════
       ROOM RENDERER
       ═══════════════════════════════════════ */
    function renderRoom(roomId) {
        var room = ROOMS[roomId];
        if (!room) return;

        state.room = roomId;
        if (state.visited.indexOf(roomId) < 0) {
            state.visited.push(roomId);
            state.xp += 10;
        }

        // Award stamp
        if (room.stamp && state.stamps.indexOf(room.stamp) < 0) {
            state.stamps.push(room.stamp);
        }

        save();

        var html = '<div class="gr-container">' +
            '<div class="gr-scene" style="background:' + room.bg + '">' +
                '<div class="gr-holo-grid"></div>' +
                '<div class="gr-room-title">' + room.name + '</div>';

        // Hotspots
        room.hotspots.forEach(function (hs) {
            html += '<button class="gr-hotspot" data-action="' + hs.action + '" style="left:' + hs.x + '%;top:' + hs.y + '%"' +
                ' title="' + hs.label + '">' +
                '<span class="gr-hotspot-icon">' + hs.icon + '</span>' +
                '<span class="gr-hotspot-label">' + hs.label + '</span>' +
            '</button>';
        });

        // Player avatar
        html += '<div class="gr-player" id="gr-player">' + getAvatarHTML() + '<span class="gr-player-name">' + state.playerName + '</span></div>';

        html += '</div>'; // close scene

        // HUD
        html += '<div class="gr-hud">' +
            '<span class="gr-hud-name">' + state.playerName + '</span>' +
            '<span class="gr-hud-xp">' + state.xp + ' XP</span>' +
            '<span class="gr-hud-room">' + room.name + '</span>' +
        '</div>';

        // Dialogue area
        html += '<div class="gr-dialogue" id="gr-dialogue">' +
            '<div class="gr-speaker" id="gr-speaker">Narrateur</div>' +
            '<div class="gr-text" id="gr-text">' + room.description + '</div>' +
        '</div>';

        // Passport
        html += '<div class="gr-passport"><div class="gr-passport-title">Passeport (' + state.stamps.length + '/' + Object.keys(STAMPS).length + ')</div><div class="gr-stamps">';
        Object.keys(STAMPS).forEach(function (id) {
            var earned = state.stamps.indexOf(id) >= 0;
            html += '<span class="gr-stamp' + (earned ? ' gr-stamp-earned' : '') + '" title="' + STAMPS[id].name + '">' + STAMPS[id].emoji + '</span>';
        });
        html += '</div></div>';

        // CTA
        if (room.cta) {
            var resUrl = (typeof vrGame !== 'undefined' && vrGame.reservation_url) ? vrGame.reservation_url : '/reservation/';
            html += '<div class="gr-cta"><p>' + room.cta + '</p><a href="' + resUrl + '" class="btn btn-glow btn-sm">R\u00e9server</a></div>';
        }

        // Time banner
        var h = new Date().getHours();
        if (h >= 11 && h <= 13) {
            html += '<div class="gr-time-banner">\ud83c\udf7d\ufe0f C\'est l\'heure du d\u00e9jeuner... Et si c\'\u00e9tait chez Virealys ?</div>';
        } else if (h >= 18 && h <= 21) {
            html += '<div class="gr-time-banner">\ud83c\udf19 La soir\u00e9e commence... Votre table vous attend</div>';
        }

        // Controls
        html += '<div class="gr-controls">' +
            '<button class="btn btn-ghost btn-sm" id="gr-reset">Recommencer</button>' +
        '</div>';

        html += '</div>'; // close container

        gameEl.innerHTML = html;

        // Bind hotspot clicks
        gameEl.querySelectorAll('.gr-hotspot').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                handleAction(btn.getAttribute('data-action'), roomId);
            });
        });

        document.getElementById('gr-reset').addEventListener('click', function () {
            if (confirm('Recommencer ? Votre progression sera perdue.')) {
                localStorage.removeItem(SAVE_KEY);
                state = { phase: 'creation', room: 'creation', playerName: '', avatar: { skin: 0, hair: 0, hairStyle: 0, eyes: 0, outfit: 0, accessory: 0 }, xp: 0, stamps: [], visited: [], questsDone: [] };
                renderCreation();
            }
        });
    }

    /* ═══════════════════════════════════════
       ACTION HANDLER
       ═══════════════════════════════════════ */
    function handleAction(action, currentRoom) {
        // Navigation actions
        if (action === 'enter_lobby' || action === 'goto_lobby') { renderRoom('lobby'); return; }
        if (action === 'goto_cuisine') { renderRoom('cuisine'); return; }
        if (action === 'goto_origine') { renderRoom('zone_origine'); return; }
        if (action === 'goto_voyage') { renderRoom('zone_voyage'); return; }
        if (action === 'goto_immersion') { renderRoom('zone_immersion'); return; }
        if (action === 'goto_sensoriel') { renderRoom('zone_sensoriel'); return; }
        if (action === 'goto_bar') { renderRoom('bar'); return; }

        // Dialogue actions
        var dialogue = DIALOGUES[action];
        if (dialogue) {
            showDialogue(dialogue, currentRoom);
            return;
        }
    }

    /* ═══════════════════════════════════════
       DIALOGUE SYSTEM
       ═══════════════════════════════════════ */
    function showDialogue(dialogue, roomId) {
        var speakerEl = document.getElementById('gr-speaker');
        var textEl = document.getElementById('gr-text');
        if (!speakerEl || !textEl) return;

        speakerEl.textContent = dialogue.speaker;
        playLines(textEl, dialogue.lines, 0, function () {
            // After dialogue, check for challenge
            if (dialogue.triggerChallenge) {
                var room = ROOMS[roomId];
                if (room && room.challenge && state.questsDone.indexOf(roomId + '_quiz') < 0) {
                    showChallenge(room.challenge, roomId, textEl, speakerEl);
                    return;
                }
            }
            // Show CTA after sensory descriptions
            var room = ROOMS[roomId];
            if (room && room.cta) {
                textEl.textContent = room.cta;
                speakerEl.textContent = 'Virealys';
            }
        });
    }

    function playLines(el, lines, idx, cb) {
        if (idx >= lines.length) { cb(); return; }
        typewrite(el, lines[idx], function () {
            function next(e) {
                if (e.target.closest('button')) return;
                e.preventDefault();
                el.removeEventListener('click', next);
                gameEl.removeEventListener('click', next);
                playLines(el, lines, idx + 1, cb);
            }
            if (idx < lines.length - 1) {
                el.addEventListener('click', next);
                gameEl.addEventListener('click', next);
            } else {
                cb();
            }
        });
    }

    var typeInterval = null;
    function typewrite(el, text, cb) {
        if (typeInterval) clearInterval(typeInterval);
        var i = 0;
        el.textContent = '';
        typeInterval = setInterval(function () {
            if (i < text.length) { el.textContent += text.charAt(i); i++; }
            else { clearInterval(typeInterval); typeInterval = null; if (cb) cb(); }
        }, TYPE_SPEED);
        function skip() {
            if (typeInterval) {
                clearInterval(typeInterval); typeInterval = null;
                el.textContent = text;
                el.removeEventListener('click', skip);
                if (cb) cb();
            }
        }
        el.addEventListener('click', skip);
    }

    /* ═══════════════════════════════════════
       CHALLENGE / QUIZ
       ═══════════════════════════════════════ */
    function showChallenge(ch, roomId, textEl, speakerEl) {
        speakerEl.textContent = 'Quiz';
        textEl.textContent = ch.question;

        var optDiv = document.createElement('div');
        optDiv.className = 'gr-quiz-options';

        ch.options.forEach(function (opt, i) {
            var btn = document.createElement('button');
            btn.className = 'game-choice-btn';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                state.questsDone.push(roomId + '_quiz');
                if (i === ch.correct) {
                    state.xp += ch.xp;
                    btn.classList.add('game-quiz-correct');
                } else {
                    btn.classList.add('game-quiz-wrong');
                    optDiv.children[ch.correct].classList.add('game-quiz-correct');
                }
                textEl.textContent = ch.feedback[i];
                setTimeout(function () {
                    if (optDiv.parentNode) optDiv.remove();
                    save();
                    renderRoom(roomId);
                }, 2500);
            });
            optDiv.appendChild(btn);
        });

        var dialogueEl = document.getElementById('gr-dialogue');
        if (dialogueEl) dialogueEl.appendChild(optDiv);
    }

    /* ═══════════════════════════════════════
       SAVE / LOAD
       ═══════════════════════════════════════ */
    function save() {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function loadSave() {
        try {
            var d = JSON.parse(localStorage.getItem(SAVE_KEY));
            if (d && d.phase) {
                state = d;
                return true;
            }
        } catch (e) {}
        return false;
    }

    /* ═══════════════════════════════════════
       BOOT
       ═══════════════════════════════════════ */
    if (document.getElementById('vr-game')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();
