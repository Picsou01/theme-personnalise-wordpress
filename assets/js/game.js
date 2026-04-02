/**
 * Virealys Experience - Moteur de Jeu Immersif v1.0
 * "Votre Soiree Chez Virealys"
 *
 * Architecture: Scene Graph + Typewriter + Quiz Engine
 * Theme: Holographique Slow Food
 * Target: 25-40 minutes de jeu, 15 scenes, 4 actes
 */
(function () {
    'use strict';

    /* ═══════════════════════════════════════
       CONFIGURATION
       ═══════════════════════════════════════ */
    var CFG = {
        SAVE_KEY: 'vr_game_save',
        TYPE_SPEED: 40,
        SLOW_TYPE_SPEED: 65,
        TRANSITION_MS: 1200,
        QUIZ_TIMER: 12,
        VERSION: 1
    };

    /* ═══════════════════════════════════════
       SCENE DATA — 15 scenes, 4 actes
       ═══════════════════════════════════════ */
    var SCENES = {
        /* ── ACTE 1: L'ARRIVEE ── */
        'arrival': {
            chapter: 1, chapterName: 'L\'Arriv\u00e9e',
            bg: 'linear-gradient(180deg, #020010 0%, #0a0a2e 40%, #06060f 100%)',
            emoji: '\u2022 V I R E A L Y S \u2022',
            speaker: 'Narrateur',
            dialogue: [
                'La nuit est tomb\u00e9e sur la ville.',
                'Devant vous, une fa\u00e7ade s\'illumine de reflets holographiques...',
                'VIREALYS \u2014 Le premier restaurant o\u00f9 chaque repas est un voyage.',
                'Vous poussez la porte. L\'aventure commence.'
            ],
            choices: [
                { text: 'Entrer avec curiosit\u00e9', next: 'reception', xp: 10 },
                { text: 'Observer la fa\u00e7ade d\'abord', next: 'arrival_observe', xp: 5 }
            ]
        },
        'arrival_observe': {
            chapter: 1, chapterName: 'L\'Arriv\u00e9e',
            bg: 'linear-gradient(180deg, #020010 0%, #0a0a2e 40%, #06060f 100%)',
            emoji: '\u2726 La Fa\u00e7ade \u2726',
            speaker: 'Narrateur',
            dialogue: [
                'Des projections dansent sur les murs ext\u00e9rieurs.',
                'Des silhouettes de for\u00eats, d\'oc\u00e9ans, d\'aurores bor\u00e9ales...',
                'Chaque saison, l\'ext\u00e9rieur change. Ce soir, c\'est cosmique.',
                'Vous \u00eates pr\u00eat. Vous entrez.'
            ],
            choices: [
                { text: 'Entrer', next: 'reception', xp: 15 }
            ],
            stamp: 'stamp_curious'
        },
        'reception': {
            chapter: 1, chapterName: 'L\'Arriv\u00e9e',
            bg: 'linear-gradient(135deg, #06060f 0%, #12122a 50%, #0a0a1a 100%)',
            emoji: '\u2726 R\u00e9ception \u2726',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'Bonsoir et bienvenue chez Virealys !',
                'Je suis votre h\u00f4te pour cette soir\u00e9e.',
                'Ici, nous croyons que manger est un voyage sensoriel complet.',
                'Quatre zones vous attendent, chacune avec son niveau d\'immersion.',
                'Quelle exp\u00e9rience souhaitez-vous vivre ce soir ?'
            ],
            choices: [
                { text: '\ud83c\udf3f Zone Origine \u2014 L\'essentiel', next: 'zone_origine', xp: 10 },
                { text: '\u2708\ufe0f Zone Voyage \u2014 L\'\u00e9vasion', next: 'zone_voyage', xp: 10 },
                { text: '\ud83c\udf0a Zone Immersion \u2014 270\u00b0', next: 'zone_immersion', xp: 10 },
                { text: '\u2728 Zone Sensoriel \u2014 Totale', next: 'zone_sensoriel', xp: 10 }
            ]
        },

        /* ── ACTE 2: L'INSTALLATION ── */
        'zone_origine': {
            chapter: 2, chapterName: 'L\'Installation',
            bg: 'linear-gradient(135deg, #0a1a0a 0%, #0f2010 50%, #06060f 100%)',
            emoji: '\u25cf Zone Origine',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'La Zone Origine. L\'exp\u00e9rience pure.',
                'Lumi\u00e8re tamis\u00e9e, bois naturel, silence respectueux.',
                'Ici, la gastronomie Slow Food parle d\'elle-m\u00eame.',
                'Vos sens se concentrent sur l\'essentiel : le go\u00fbt.'
            ],
            choices: [
                { text: 'S\'installer et d\u00e9couvrir le menu', next: 'menu_discover', xp: 15 }
            ],
            stamp: 'stamp_origine'
        },
        'zone_voyage': {
            chapter: 2, chapterName: 'L\'Installation',
            bg: 'linear-gradient(135deg, #0a0a2e 0%, #0f1a3e 50%, #06060f 100%)',
            emoji: '\u25cf Zone Voyage',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'La Zone Voyage. L\'\u00e9vasion commence.',
                'Des projections subtiles habillent les murs...',
                'Un vignoble toscan, un march\u00e9 proven\u00e7al, un jardin japonais.',
                'L\'accord mets-vins est inclus. Le sommelier est votre guide.'
            ],
            choices: [
                { text: 'S\'installer et d\u00e9couvrir le menu', next: 'menu_discover', xp: 15 }
            ],
            stamp: 'stamp_voyage'
        },
        'zone_immersion': {
            chapter: 2, chapterName: 'L\'Installation',
            bg: 'linear-gradient(135deg, #1a0a2e 0%, #2a0f3e 50%, #06060f 100%)',
            emoji: '\u25cf Zone Immersion',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'La Zone Immersion. Projection 270 degr\u00e9s.',
                'Les murs, le plafond, le sol... tout s\'anime.',
                'L\'ambiance saisonni\u00e8re vous enveloppe compl\u00e8tement.',
                'Vous n\'\u00eates plus dans un restaurant. Vous \u00eates DANS le voyage.'
            ],
            choices: [
                { text: 'S\'installer et d\u00e9couvrir le menu', next: 'menu_discover', xp: 15 }
            ],
            stamp: 'stamp_immersion'
        },
        'zone_sensoriel': {
            chapter: 2, chapterName: 'L\'Installation',
            bg: 'linear-gradient(135deg, #2a0a2e 0%, #3e0f3e 50%, #06060f 100%)',
            emoji: '\u25cf Zone Sensoriel',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'La Zone Sensoriel. L\'exp\u00e9rience totale.',
                'Projections 270\u00b0, son spatial, brume parfum\u00e9e...',
                'Le sol vibre doucement au rythme de la musique.',
                'Chaque plat d\u00e9clenche une transformation de l\'espace.',
                'Aucun \u00e9cran ne peut reproduire ce que vous allez vivre ici...',
                'Mais nous allons essayer.'
            ],
            choices: [
                { text: 'S\'installer et d\u00e9couvrir le menu', next: 'menu_discover', xp: 20 }
            ],
            stamp: 'stamp_sensoriel',
            cta: { text: 'Cette zone existe vraiment. 12m\u00e8tres de projections.', url: '' }
        },
        'menu_discover': {
            chapter: 2, chapterName: 'L\'Installation',
            bg: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 50%, #06060f 100%)',
            emoji: '\u2726 Le Menu \u2726',
            speaker: 'Le Chef',
            dialogue: [
                'Bonsoir ! Je suis le Chef de Virealys.',
                'Notre cuisine est Slow Food : locale, saisonni\u00e8re, respectueuse.',
                'Chaque producteur est notre voisin. Chaque ingr\u00e9dient a une histoire.',
                'Ce soir, quatre formules s\'offrent \u00e0 vous.'
            ],
            choices: [
                { text: '\ud83c\udf3f Classique (45\u20ac) \u2014 Entr\u00e9e, Plat, Dessert', next: 'wine_select', xp: 10 },
                { text: '\ud83c\udf77 Voyage (65\u20ac) \u2014 + Accord mets-vins', next: 'wine_select', xp: 15 },
                { text: '\ud83c\udf1f Immersion (85\u20ac) \u2014 5 services + projections', next: 'wine_select', xp: 20 },
                { text: '\u2728 Sensoriel (120\u20ac) \u2014 7 services + exp\u00e9rience totale', next: 'wine_select', xp: 25 }
            ]
        },
        'wine_select': {
            chapter: 2, chapterName: 'L\'Installation',
            bg: 'linear-gradient(135deg, #1a0a0a 0%, #2e1210 50%, #06060f 100%)',
            emoji: '\u2726 Le Sommelier \u2726',
            speaker: 'Le Sommelier',
            dialogue: [
                'Bonsoir ! Je m\'occupe de sublimer votre repas avec le bon vin.',
                'Pour votre entr\u00e9e, un carpaccio de Saint-Jacques...',
                'Quel accord proposeriez-vous ?'
            ],
            challenge: {
                type: 'quiz',
                question: 'Quel vin avec un carpaccio de Saint-Jacques ?',
                options: ['Muscadet S\u00e8vre-et-Maine', 'Chateauneuf-du-Pape rouge', 'Champagne ros\u00e9'],
                correct: 0,
                xpBonus: 30,
                feedback: ['Excellent choix ! La min\u00e9ralit\u00e9 du Muscadet se marie parfaitement.', 'Trop puissant pour la d\u00e9licatesse des Saint-Jacques...', 'Int\u00e9ressant mais pas l\'accord id\u00e9al.']
            },
            choices: [
                { text: 'Passer au service', next: 'entree_service', xp: 10 }
            ]
        },

        /* ── ACTE 3: L'EXPERIENCE ── */
        'entree_service': {
            chapter: 3, chapterName: 'L\'Exp\u00e9rience',
            bg: 'linear-gradient(135deg, #0a0a1a 0%, #0f1520 50%, #06060f 100%)',
            emoji: '\u2726 L\'Entr\u00e9e \u2726',
            speaker: 'Narrateur',
            dialogue: [
                'L\'entr\u00e9e arrive. Un carpaccio de Saint-Jacques, tuile de parmesan.',
                'La lumi\u00e8re baisse doucement. Les projections s\'intensifient.',
                'Imaginez le craquant de cette tuile de parmesan sous vos dents...',
                'La fra\u00eecheur iod\u00e9e de la Saint-Jacques sur votre palais...',
                'Vous ne pouvez pas le go\u00fbter ici. Mais chez Virealys, oui.'
            ],
            choices: [
                { text: 'Savourer le moment', next: 'projection_show', xp: 15 }
            ],
            cta: { text: 'Ce plat existe vraiment. R\u00e9servez pour le go\u00fbter.', url: '' },
            slowReveal: true
        },
        'projection_show': {
            chapter: 3, chapterName: 'L\'Exp\u00e9rience',
            bg: 'linear-gradient(135deg, #0a1a2e 0%, #1a2a4e 30%, #0f0520 70%, #06060f 100%)',
            emoji: '\u2726 Projections 270\u00b0 \u2726',
            speaker: 'Narrateur',
            dialogue: [
                'Les projections 270\u00b0 s\'activent.',
                'Les murs disparaissent. Vous \u00eates au c\u0153ur d\'une for\u00eat enchant\u00e9e.',
                'Des lucioles holographiques dansent autour de vos verres.',
                'Le son spatial murmure le vent dans les arbres.',
                'Le plat principal arrive dans ce d\u00e9cor f\u00e9\u00e9rique...'
            ],
            challenge: {
                type: 'quiz',
                question: 'Quel ingr\u00e9dient est projet\u00e9 sur les murs ?',
                options: ['Truffe noire du P\u00e9rigord', 'Safran d\'Iran', 'Vanille de Madagascar'],
                correct: 0,
                xpBonus: 25,
                feedback: ['Bravo ! Vous avez l\'\u0153il du connaisseur.', 'Pas cette fois, mais le safran sera dans le dessert !', 'La vanille viendra au dessert, patience...']
            },
            choices: [
                { text: 'D\u00e9couvrir le plat principal', next: 'plat_principal', xp: 15 }
            ]
        },
        'plat_principal': {
            chapter: 3, chapterName: 'L\'Exp\u00e9rience',
            bg: 'linear-gradient(135deg, #1a0f0a 0%, #2e1a10 50%, #06060f 100%)',
            emoji: '\u2726 Le Plat Signature \u2726',
            speaker: 'Le Chef',
            dialogue: [
                'Voici notre plat signature : le Filet de b\u0153uf Wagyu,',
                'laquage au miso et truffe noire du P\u00e9rigord.',
                'La viande fond. La truffe exhale ses ar\u00f4mes.',
                'Les projections montrent le producteur, sa ferme, ses b\u00eates...',
                'Slow Food signifie conna\u00eetre l\'histoire de chaque bouchee.',
                'Les ar\u00f4mes, la texture, la chaleur du plat...',
                'Seule une visite peut vous offrir \u00e7a.'
            ],
            choices: [
                { text: 'Attendre la surprise...', next: 'surprise_moment', xp: 20 }
            ],
            cta: { text: 'Imaginez ces ar\u00f4mes... R\u00e9servez pour les vivre.', url: '' },
            slowReveal: true
        },
        'surprise_moment': {
            chapter: 3, chapterName: 'L\'Exp\u00e9rience',
            bg: 'linear-gradient(135deg, #2a0a3e 0%, #4e1a5e 30%, #0a0a2e 70%, #06060f 100%)',
            emoji: '\u2726 Surprise \u2726',
            speaker: 'Narrateur',
            dialogue: [
                'SURPRISE !',
                'Les lumi\u00e8res s\'\u00e9teignent compl\u00e8tement.',
                'Une brume l\u00e9g\u00e8re envahit la salle, parfum\u00e9e \u00e0 la lavande.',
                'Le sol vibre doucement.',
                'Des aurores bor\u00e9ales holographiques explosent au plafond.',
                'La musique live commence... un violoncelle r\u00e9sonne.',
                'C\'est impossible \u00e0 reproduire sur un \u00e9cran.',
                'Ce moment n\'existe qu\'ici. Qu\'en vrai.'
            ],
            choices: [
                { text: 'Applaudir', next: 'dessert_finale', xp: 20 },
                { text: 'Rester silencieux, absorb\u00e9', next: 'dessert_finale', xp: 25 }
            ],
            cta: { text: 'La brume, les vibrations, le live... Vivez-le.', url: '' },
            slowReveal: true
        },
        'dessert_finale': {
            chapter: 3, chapterName: 'L\'Exp\u00e9rience',
            bg: 'linear-gradient(135deg, #1a1a0a 0%, #2e2a10 30%, #0f0a20 70%, #06060f 100%)',
            emoji: '\u2726 Le Dessert \u2726',
            speaker: 'Le Chef',
            dialogue: [
                'Le dessert arrive. Sph\u00e8re de chocolat Valrhona,',
                'c\u0153ur coulant au caramel sal\u00e9, \u00e9clats de pralin\u00e9.',
                'Le serveur verse une sauce chaude. La sph\u00e8re fond en direct.',
                'Les projections explosent en un feu d\'artifice dor\u00e9.',
                'Le parfum du chocolat chaud envahit votre espace.',
                'Fermez les yeux. Imaginez.',
                'Maintenant, imaginez le GO\u00dbTER vraiment.'
            ],
            choices: [
                { text: 'C\'\u00e9tait magique...', next: 'passport_stamp', xp: 25 }
            ],
            stamp: 'stamp_dessert',
            cta: { text: 'Ce dessert sort du four chaque soir chez Virealys.', url: '' },
            slowReveal: true
        },

        /* ── ACTE 4: LE DEPART ── */
        'passport_stamp': {
            chapter: 4, chapterName: 'Le D\u00e9part',
            bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2a 50%, #06060f 100%)',
            emoji: '\u2726 Passeport \u2726',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'Quelle soir\u00e9e extraordinaire !',
                'Voici votre passeport Virealys avec vos tampons.',
                'Chaque visite d\u00e9bloque de nouvelles exp\u00e9riences.',
                'Il reste tant \u00e0 d\u00e9couvrir : 16 combinaisons possibles...'
            ],
            choices: [
                { text: 'Voir mon passeport', next: 'feedback', xp: 15 }
            ],
            stamp: 'stamp_evening'
        },
        'feedback': {
            chapter: 4, chapterName: 'Le D\u00e9part',
            bg: 'linear-gradient(135deg, #06060f 0%, #0a0a2e 50%, #06060f 100%)',
            emoji: '\u2726 Votre Avis \u2726',
            speaker: 'L\'H\u00f4te',
            dialogue: [
                'Comment avez-vous trouv\u00e9 votre soir\u00e9e ?'
            ],
            choices: [
                { text: '\u2b50\u2b50\u2b50 Inoubliable !', next: 'farewell', xp: 30 },
                { text: '\u2b50\u2b50 Tr\u00e8s bien', next: 'farewell', xp: 20 },
                { text: '\u2b50 Curieux d\'en voir plus', next: 'farewell', xp: 15 }
            ]
        },
        'farewell': {
            chapter: 4, chapterName: 'Le D\u00e9part',
            bg: 'linear-gradient(180deg, #020010 0%, #0a0a2e 40%, #06060f 100%)',
            emoji: '\u2726 Au Revoir \u2726',
            speaker: 'Narrateur',
            dialogue: [
                'L\'h\u00f4te vous raccompagne vers la sortie.',
                'La nuit est belle. Les \u00e9toiles brillent.',
                'Vous emportez avec vous des souvenirs...',
                'Mais il manque quelque chose.',
                'Le go\u00fbt. L\'odeur. Le toucher. Les vibrations.',
                'Tout ce que l\'\u00e9cran ne peut pas offrir.',
                'Virealys vous attend. Pour de vrai, cette fois.'
            ],
            choices: [
                { text: '\ud83c\udf7d\ufe0f R\u00e9server ma table', next: '__reserve__', xp: 50 },
                { text: '\ud83d\udd01 Rejouer (autre zone)', next: 'arrival', xp: 0 },
                { text: '\ud83d\udcf1 Partager mon score', next: '__share__', xp: 10 }
            ],
            stamp: 'stamp_complete'
        }
    };

    /* ═══════════════════════════════════════
       STAMPS DEFINITION
       ═══════════════════════════════════════ */
    var STAMPS = {
        stamp_curious:   { emoji: '\ud83d\udd2d', name: 'Curieux' },
        stamp_origine:   { emoji: '\ud83c\udf3f', name: 'Origine' },
        stamp_voyage:    { emoji: '\u2708\ufe0f', name: 'Voyage' },
        stamp_immersion: { emoji: '\ud83c\udf0a', name: 'Immersion' },
        stamp_sensoriel: { emoji: '\u2728',       name: 'Sensoriel' },
        stamp_dessert:   { emoji: '\ud83c\udf70', name: 'Dessert' },
        stamp_evening:   { emoji: '\ud83c\udf03', name: 'Soir\u00e9e' },
        stamp_complete:  { emoji: '\u2b50',       name: 'Complet' }
    };

    /* ═══════════════════════════════════════
       STATE
       ═══════════════════════════════════════ */
    var state = {
        scene: 'arrival',
        xp: 0,
        stamps: [],
        visited: [],
        chapter: 1,
        startedAt: Date.now()
    };

    /* ═══════════════════════════════════════
       DOM REFERENCES
       ═══════════════════════════════════════ */
    var $;
    function cacheDom() {
        $ = {};
        var ids = ['game-scene-bg', 'game-scene-emoji', 'game-chapter', 'game-xp', 'game-progress-fill',
            'game-speaker', 'game-text', 'game-tap-hint', 'game-choices', 'game-challenge',
            'game-challenge-q', 'game-challenge-timer', 'game-challenge-opts', 'game-cta',
            'game-cta-text', 'game-stamps', 'game-btn-save', 'game-btn-reset', 'game-time-banner', 'vr-game'];
        for (var i = 0; i < ids.length; i++) {
            $[ids[i]] = document.getElementById(ids[i]);
        }
    }

    /* ═══════════════════════════════════════
       TYPEWRITER
       ═══════════════════════════════════════ */
    var typeInterval = null;
    function typewrite(el, text, speed, cb) {
        if (typeInterval) clearInterval(typeInterval);
        var idx = 0;
        el.textContent = '';
        el.classList.add('game-typing');
        typeInterval = setInterval(function () {
            if (idx < text.length) {
                el.textContent += text.charAt(idx);
                idx++;
            } else {
                clearInterval(typeInterval);
                typeInterval = null;
                el.classList.remove('game-typing');
                if (cb) cb();
            }
        }, speed);

        function skip() {
            if (typeInterval) {
                clearInterval(typeInterval);
                typeInterval = null;
                el.textContent = text;
                el.classList.remove('game-typing');
                el.removeEventListener('click', skip);
                el.removeEventListener('touchend', skip);
                if (cb) cb();
            }
        }
        el.addEventListener('click', skip);
        el.addEventListener('touchend', skip);
    }

    /* ═══════════════════════════════════════
       DIALOGUE SEQUENCER
       ═══════════════════════════════════════ */
    function playDialogue(lines, idx, slow, cb) {
        if (idx >= lines.length) { cb(); return; }
        var speed = slow ? CFG.SLOW_TYPE_SPEED : CFG.TYPE_SPEED;
        var isLast = (idx >= lines.length - 1);
        $['game-tap-hint'].textContent = isLast ? '' : '\u25bc Cliquez n\'importe o\u00f9 pour continuer';
        typewrite($['game-text'], lines[idx], speed, function () {
            if (isLast) { $['game-tap-hint'].textContent = ''; cb(); return; }
            // Make the ENTIRE game container clickable to advance
            function advance(e) {
                // Don't advance if clicking a button
                if (e.target.closest('button, .game-choice-btn, .game-quiz-btn, .game-cta-btn, .game-controls')) return;
                e.preventDefault();
                $['vr-game'].removeEventListener('click', advance);
                $['vr-game'].removeEventListener('touchend', advance);
                playDialogue(lines, idx + 1, slow, cb);
            }
            $['vr-game'].addEventListener('click', advance);
            $['vr-game'].addEventListener('touchend', advance);
        });
    }

    /* ═══════════════════════════════════════
       SCENE RENDERER
       ═══════════════════════════════════════ */
    function loadScene(sceneId) {
        var scene = SCENES[sceneId];
        if (!scene) return;

        state.scene = sceneId;
        if (state.visited.indexOf(sceneId) < 0) state.visited.push(sceneId);
        state.chapter = scene.chapter;

        // Transition out
        var game = $['vr-game'];
        game.classList.add('game-transitioning');

        setTimeout(function () {
            // Update visuals
            $['game-scene-bg'].style.background = scene.bg;
            $['game-scene-emoji'].textContent = scene.emoji;
            $['game-chapter'].textContent = 'Acte ' + scene.chapter + ' \u2014 ' + scene.chapterName;
            $['game-xp'].textContent = state.xp + ' XP';
            $['game-speaker'].textContent = scene.speaker;
            $['game-text'].textContent = '';
            $['game-choices'].innerHTML = '';
            $['game-challenge'].style.display = 'none';
            $['game-tap-hint'].textContent = '';

            // Progress bar
            var progress = (state.visited.length / Object.keys(SCENES).length) * 100;
            $['game-progress-fill'].style.width = Math.min(progress, 100) + '%';

            // Stamp
            if (scene.stamp && state.stamps.indexOf(scene.stamp) < 0) {
                state.stamps.push(scene.stamp);
                renderStamps();
                setTimeout(function () { flashStamp(scene.stamp); }, 800);
            }

            // Transition in
            game.classList.remove('game-transitioning');
            game.classList.add('game-entering');
            setTimeout(function () { game.classList.remove('game-entering'); }, CFG.TRANSITION_MS);

            // Play dialogue
            playDialogue(scene.dialogue, 0, !!scene.slowReveal, function () {
                // After dialogue: challenge or choices
                if (scene.challenge) {
                    showChallenge(scene.challenge, function () {
                        showChoices(scene.choices);
                        showCTA(scene);
                    });
                } else {
                    showChoices(scene.choices);
                    showCTA(scene);
                }
            });

            // Time-aware banner
            checkTimeBanner();
            autoSave();
        }, CFG.TRANSITION_MS / 2);
    }

    /* ═══════════════════════════════════════
       CHOICES
       ═══════════════════════════════════════ */
    function showChoices(choices) {
        $['game-choices'].innerHTML = '';
        choices.forEach(function (choice) {
            var btn = document.createElement('button');
            btn.className = 'game-choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                handleChoice(choice);
            });
            btn.addEventListener('touchend', function (e) {
                e.preventDefault();
                handleChoice(choice);
            });
            $['game-choices'].appendChild(btn);
        });
    }

    function handleChoice(choice) {
        state.xp += (choice.xp || 0);

        if (choice.next === '__reserve__') {
            var url = (typeof vrGame !== 'undefined' && vrGame.reservation_url) ? vrGame.reservation_url : '/reservation/';
            window.location.href = url;
            return;
        }
        if (choice.next === '__share__') {
            shareScore();
            return;
        }

        loadScene(choice.next);
    }

    /* ═══════════════════════════════════════
       CHALLENGE / QUIZ
       ═══════════════════════════════════════ */
    function showChallenge(ch, cb) {
        $['game-challenge'].style.display = 'block';
        $['game-challenge-q'].textContent = ch.question;
        $['game-challenge-opts'].innerHTML = '';

        var answered = false;
        var timer = ch.type === 'quiz' ? CFG.QUIZ_TIMER : 0;
        var timerBar = $['game-challenge-timer'];
        timerBar.style.width = '100%';

        ch.options.forEach(function (opt, i) {
            var btn = document.createElement('button');
            btn.className = 'game-quiz-btn';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                if (answered) return;
                answered = true;
                if (i === ch.correct) {
                    btn.classList.add('game-quiz-correct');
                    state.xp += ch.xpBonus;
                    $['game-xp'].textContent = state.xp + ' XP';
                } else {
                    btn.classList.add('game-quiz-wrong');
                    $['game-challenge-opts'].children[ch.correct].classList.add('game-quiz-correct');
                }
                $['game-challenge-q'].textContent = ch.feedback[i];
                setTimeout(function () {
                    $['game-challenge'].style.display = 'none';
                    cb();
                }, 2000);
            });
            $['game-challenge-opts'].appendChild(btn);
        });

        // Timer animation
        if (timer > 0) {
            timerBar.style.transition = 'width ' + timer + 's linear';
            requestAnimationFrame(function () { timerBar.style.width = '0%'; });
            setTimeout(function () {
                if (!answered) {
                    answered = true;
                    $['game-challenge-q'].textContent = 'Temps \u00e9coul\u00e9 ! ' + ch.feedback[ch.correct];
                    $['game-challenge-opts'].children[ch.correct].classList.add('game-quiz-correct');
                    setTimeout(function () {
                        $['game-challenge'].style.display = 'none';
                        cb();
                    }, 2000);
                }
            }, timer * 1000);
        }
    }

    /* ═══════════════════════════════════════
       STAMPS / PASSPORT
       ═══════════════════════════════════════ */
    function renderStamps() {
        $['game-stamps'].innerHTML = '';
        Object.keys(STAMPS).forEach(function (id) {
            var s = STAMPS[id];
            var el = document.createElement('span');
            el.className = 'game-stamp' + (state.stamps.indexOf(id) >= 0 ? ' game-stamp-earned' : '');
            el.setAttribute('data-stamp', id);
            el.setAttribute('title', s.name);
            el.textContent = s.emoji;
            $['game-stamps'].appendChild(el);
        });
    }

    function flashStamp(stampId) {
        var el = $['game-stamps'].querySelector('[data-stamp="' + stampId + '"]');
        if (el) {
            el.classList.add('game-stamp-flash');
            setTimeout(function () { el.classList.remove('game-stamp-flash'); }, 1500);
        }
    }

    /* ═══════════════════════════════════════
       TIME-AWARE BANNER
       ═══════════════════════════════════════ */
    function checkTimeBanner() {
        var h = new Date().getHours();
        var banner = $['game-time-banner'];
        if (h >= 11 && h <= 13) {
            banner.innerHTML = '\ud83c\udf7d\ufe0f C\'est l\'heure du d\u00e9jeuner... Et si c\'\u00e9tait chez Virealys ?';
            banner.style.display = 'block';
        } else if (h >= 18 && h <= 21) {
            banner.innerHTML = '\ud83c\udf19 La soir\u00e9e commence... Votre table vous attend chez Virealys';
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    }

    /* ═══════════════════════════════════════
       CTA
       ═══════════════════════════════════════ */
    function showCTA(scene) {
        if (scene.cta) {
            $['game-cta-text'].textContent = scene.cta.text;
            $['game-cta'].style.display = 'flex';
        } else {
            $['game-cta'].style.display = 'none';
        }
    }

    /* ═══════════════════════════════════════
       SHARE
       ═══════════════════════════════════════ */
    function shareScore() {
        var text = 'J\'ai v\u00e9cu ma soir\u00e9e virtuelle chez Virealys ! Score: ' + state.xp + ' XP, ' + state.stamps.length + ' tampons. Vivez l\'exp\u00e9rience : ';
        var url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'Mon Voyage Virealys', text: text, url: url });
        } else {
            window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + url), '_blank');
        }
    }

    /* ═══════════════════════════════════════
       SAVE / LOAD
       ═══════════════════════════════════════ */
    function autoSave() {
        try {
            localStorage.setItem(CFG.SAVE_KEY, JSON.stringify({
                scene: state.scene, xp: state.xp, stamps: state.stamps,
                visited: state.visited, chapter: state.chapter, v: CFG.VERSION
            }));
        } catch (e) {}
    }

    function loadSave() {
        try {
            var d = JSON.parse(localStorage.getItem(CFG.SAVE_KEY));
            if (d && d.v === CFG.VERSION && d.scene) {
                state.scene = d.scene;
                state.xp = d.xp || 0;
                state.stamps = d.stamps || [];
                state.visited = d.visited || [];
                state.chapter = d.chapter || 1;
                return true;
            }
        } catch (e) {}
        return false;
    }

    function resetGame() {
        localStorage.removeItem(CFG.SAVE_KEY);
        state = { scene: 'arrival', xp: 0, stamps: [], visited: [], chapter: 1, startedAt: Date.now() };
        renderStamps();
        loadScene('arrival');
    }

    /* ═══════════════════════════════════════
       INIT
       ═══════════════════════════════════════ */
    function init() {
        cacheDom();
        if (!$['vr-game']) return;

        $['vr-game'].style.touchAction = 'manipulation';
        renderStamps();

        $['game-btn-save'].addEventListener('click', function () {
            autoSave();
            $['game-btn-save'].textContent = 'Sauvegard\u00e9 \u2713';
            setTimeout(function () { $['game-btn-save'].textContent = 'Sauvegarder'; }, 1500);
        });
        $['game-btn-reset'].addEventListener('click', function () {
            if (confirm('Recommencer l\'aventure ? Votre progression sera perdue.')) resetGame();
        });

        // Load or start
        if (loadSave() && state.scene !== 'arrival') {
            $['game-text'].textContent = 'Vous avez une aventure en cours (' + state.xp + ' XP, ' + state.stamps.length + ' tampons).';
            $['game-choices'].innerHTML = '';
            var btnContinue = document.createElement('button');
            btnContinue.className = 'game-choice-btn';
            btnContinue.textContent = '\u25b6 Continuer l\'aventure';
            btnContinue.addEventListener('click', function () { loadScene(state.scene); });

            var btnNew = document.createElement('button');
            btnNew.className = 'game-choice-btn';
            btnNew.textContent = '\ud83d\udd04 Nouvelle partie';
            btnNew.addEventListener('click', resetGame);

            $['game-choices'].appendChild(btnContinue);
            $['game-choices'].appendChild(btnNew);
            $['game-scene-bg'].style.background = 'linear-gradient(135deg, #06060f, #0a0a2e, #06060f)';
            $['game-scene-emoji'].textContent = '\ud83c\udf1f\ud83d\udcd8\u2728';
            $['game-speaker'].textContent = 'Virealys';
            $['game-chapter'].textContent = 'Reprise';
            $['game-xp'].textContent = state.xp + ' XP';
            renderStamps();
        } else {
            loadScene('arrival');
        }
    }

    // Boot
    if (document.getElementById('vr-game')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();
