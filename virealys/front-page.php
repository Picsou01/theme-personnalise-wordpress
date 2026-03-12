<?php
/**
 * Front page template - User Journey: Onboarding > Concept > Ambiances > Menus > Zones > Passeport > Réserver
 * v2.1 - Enhanced hero with visual fallbacks + Ambiance choice section
 */
get_header();

$hero_title    = get_theme_mod( 'hero_title', 'Voyagez sans quitter votre table' );
$hero_subtitle = get_theme_mod( 'hero_subtitle', 'Le premier restaurant Slow Food immersif & évolutif' );
$hero_bg       = get_theme_mod( 'hero_bg', '' );
$img_menus     = virealys_get_image( 'img_menus' );
$img_trace     = virealys_get_image( 'img_tracabilite' );
$img_ambiances = virealys_get_image( 'img_ambiances' );
$reservation   = get_theme_mod( 'reservation_url', '#reservation' );

$img_amb_japon   = virealys_get_image( 'img_ambiance_japon' );
$img_amb_paris   = virealys_get_image( 'img_ambiance_paris' );
$img_amb_classic = virealys_get_image( 'img_ambiance_classic' );
$img_amb_cosmos  = virealys_get_image( 'img_ambiance_cosmos' );
?>

<!-- ========== HERO - ONBOARDING ========== -->
<section class="hero" id="hero">
    <?php if ( $hero_bg ) : ?>
        <div class="hero-bg-image" style="background-image: url(<?php echo esc_url( $hero_bg ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-grid-bg"></div>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>
    <div class="hero-particles" id="hero-particles"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <div class="hero-badge" data-reveal>
            <span class="hero-badge-dot"></span>
            Slow Food Immersif & Évolutif
        </div>
        <h1 class="hero-title" data-reveal>
            <?php echo esc_html( $hero_title ); ?>
        </h1>
        <p class="hero-subtitle" data-reveal>
            <?php echo esc_html( $hero_subtitle ); ?>
        </p>
        <div class="hero-actions" data-reveal>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Vivre l'expérience
            </a>
            <a href="#concept" class="btn btn-ghost btn-lg">
                Découvrir le concept
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </a>
        </div>
    </div>
    <div class="hero-scroll">
        <div class="scroll-line"></div>
    </div>
</section>

<!-- ========== CONCEPT - DÉCOUVERTE ========== -->
<section class="section section-concept" id="concept">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Concept</span>
            <h2 class="section-title">La gastronomie réinventée<br>par l'immersion</h2>
            <p class="section-desc">Virealys fusionne l'art culinaire slow food et la technologie immersive. Chaque salle vous transporte dans un pays, chaque plat raconte une histoire. Vous choisissez votre niveau d'expérience.</p>
        </div>

        <div class="concept-grid">
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3>Salles Évolutives</h3>
                <p>Chaque mois, un pays change totalement. Décor, musique, parfums d'ambiance, tenue du personnel.</p>
            </div>
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3>Hologrammes & VR</h3>
                <p>Des décors holographiques dynamiques et une option VR pour manger dans l'environnement réel de votre plat.</p>
            </div>
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h3>Modulable</h3>
                <p>Classique, Immersif, Gastronomique ou Sensoriel : vous choisissez votre niveau d'expérience.</p>
            </div>
        </div>

        <?php if ( $img_trace ) : ?>
        <div class="concept-showcase" data-reveal>
            <div class="showcase-image">
                <img src="<?php echo esc_url( $img_trace ); ?>" alt="Traçabilité immersive - hologramme de chaque plat" loading="lazy">
                <div class="showcase-glow"></div>
            </div>
            <div class="showcase-caption">
                <span class="section-label">Traçabilité</span>
                <h3>Chaque plat, une histoire visible</h3>
                <p>Découvrez l'origine de chaque ingrédient via un hologramme interactif. Du producteur à votre assiette, en totale transparence.</p>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<!-- ========== AMBIANCES - CHOIX UTILISATEUR ========== -->
<section class="section section-ambiances-choice" id="ambiances">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Les Ambiances</span>
            <h2 class="section-title">Choisissez votre univers</h2>
            <p class="section-desc">Quatre ambiances uniques, quatre voyages sensoriels. Chaque mois, un pays évolue, un décor se transforme. Trouvez celle qui vous ressemble.</p>
        </div>

        <div class="ambiances-grid">
            <a href="<?php echo esc_url( home_url( '/ambiance-japon/' ) ); ?>" class="ambiance-card" data-reveal style="--amb-color: #ff6b6b; --amb-color-rgb: 255, 107, 107;">
                <?php if ( $img_amb_japon ) : ?>
                    <div class="ambiance-card-bg" style="background-image: url(<?php echo esc_url( $img_amb_japon ); ?>)"></div>
                <?php endif; ?>
                <div class="ambiance-card-overlay"></div>
                <div class="ambiance-card-content">
                    <span class="ambiance-card-emoji">&#127471;&#127477;</span>
                    <h3 class="ambiance-card-title">Japon</h3>
                    <p class="ambiance-card-subtitle">Zen & Raffinement</p>
                    <p class="ambiance-card-desc">Jardins zen, cerisiers en fleurs, sushis face au Mont Fuji. L'art de vivre japonais sublimé.</p>
                    <span class="ambiance-card-cta">
                        Découvrir
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </div>
            </a>

            <a href="<?php echo esc_url( home_url( '/ambiance-paris/' ) ); ?>" class="ambiance-card" data-reveal style="--amb-color: #ffd700; --amb-color-rgb: 255, 215, 0;">
                <?php if ( $img_amb_paris ) : ?>
                    <div class="ambiance-card-bg" style="background-image: url(<?php echo esc_url( $img_amb_paris ); ?>)"></div>
                <?php endif; ?>
                <div class="ambiance-card-overlay"></div>
                <div class="ambiance-card-content">
                    <span class="ambiance-card-emoji">&#127467;&#127479;</span>
                    <h3 class="ambiance-card-title">Paris</h3>
                    <p class="ambiance-card-subtitle">Romance & Lumière</p>
                    <p class="ambiance-card-desc">Terrasses parisiennes, lumières de la Tour Eiffel, bistronomie créative dans un écrin de douceur.</p>
                    <span class="ambiance-card-cta">
                        Découvrir
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </div>
            </a>

            <a href="<?php echo esc_url( home_url( '/ambiance-classique/' ) ); ?>" class="ambiance-card" data-reveal style="--amb-color: #4caf50; --amb-color-rgb: 76, 175, 80;">
                <?php if ( $img_amb_classic ) : ?>
                    <div class="ambiance-card-bg" style="background-image: url(<?php echo esc_url( $img_amb_classic ); ?>)"></div>
                <?php endif; ?>
                <div class="ambiance-card-overlay"></div>
                <div class="ambiance-card-content">
                    <span class="ambiance-card-emoji">&#127860;</span>
                    <h3 class="ambiance-card-title">Classique Française</h3>
                    <p class="ambiance-card-subtitle">Tradition & Excellence</p>
                    <p class="ambiance-card-desc">L'élégance intemporelle de la gastronomie française. Nappes blanches, chandelles, et savoir-faire ancestral.</p>
                    <span class="ambiance-card-cta">
                        Découvrir
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </div>
            </a>

            <a href="<?php echo esc_url( home_url( '/ambiance-cosmos/' ) ); ?>" class="ambiance-card" data-reveal style="--amb-color: #a855f7; --amb-color-rgb: 168, 85, 247;">
                <?php if ( $img_amb_cosmos ) : ?>
                    <div class="ambiance-card-bg" style="background-image: url(<?php echo esc_url( $img_amb_cosmos ); ?>)"></div>
                <?php endif; ?>
                <div class="ambiance-card-overlay"></div>
                <div class="ambiance-card-content">
                    <span class="ambiance-card-emoji">&#127756;</span>
                    <h3 class="ambiance-card-title">Cosmos</h3>
                    <p class="ambiance-card-subtitle">Futurisme & Évasion</p>
                    <p class="ambiance-card-desc">Dînez parmi les étoiles. Station spatiale, apesanteur visuelle, gastronomie du futur.</p>
                    <span class="ambiance-card-cta">
                        Découvrir
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </div>
            </a>
        </div>
    </div>
</section>

<!-- ========== MENUS - CHOIX UTILISATEUR ========== -->
<section class="section section-menus" id="menus">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Nos Formules</span>
            <h2 class="section-title">L'expérience à votre mesure</h2>
            <p class="section-desc">Du dîner classique à l'immersion totale, chaque formule est pensée pour vous offrir exactement ce que vous cherchez.</p>
        </div>

        <?php if ( $img_menus ) : ?>
        <div class="menus-showcase" data-reveal>
            <img src="<?php echo esc_url( $img_menus ); ?>" alt="Nos 4 formules - Menu Classique, Gastronomique, Semi-Étoilé, Haute Gastronomie Immersive" loading="lazy">
            <div class="menus-showcase-glow"></div>
        </div>
        <?php endif; ?>

        <div class="menus-grid">
            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg>
                </div>
                <h3>Menu Classique</h3>
                <p class="menu-price">35&euro;</p>
                <ul class="menu-features">
                    <li>Zone Origine</li>
                    <li>3 plats slow food</li>
                    <li>Produits locaux & de saison</li>
                    <li>Ambiance naturelle</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline btn-sm">Réserver cette formule</a>
            </div>

            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                </div>
                <h3>Menu Gastronomique</h3>
                <p class="menu-price">50&euro;</p>
                <ul class="menu-features">
                    <li>Zone Voyage</li>
                    <li>5 plats créatifs</li>
                    <li>Décors holographiques</li>
                    <li>Accord mets & vins</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline btn-sm">Réserver cette formule</a>
            </div>

            <div class="menu-card menu-card-featured" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-badge">Populaire</div>
                <div class="menu-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h3>Menu Semi-Étoilé</h3>
                <p class="menu-price">75&euro;</p>
                <ul class="menu-features">
                    <li>Zone Immersion Totale</li>
                    <li>7 plats signature</li>
                    <li>Expérience VR incluse</li>
                    <li>Sommelier dédié</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-sm">Réserver cette formule</a>
            </div>

            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                </div>
                <h3>Haute Gastronomie Immersive</h3>
                <p class="menu-price">120&euro;</p>
                <ul class="menu-features">
                    <li>Toutes les zones</li>
                    <li>9 plats d'exception</li>
                    <li>Expérience sensorielle complète</li>
                    <li>Passeport VIP offert</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline btn-sm">Réserver cette formule</a>
            </div>
        </div>
    </div>
</section>

<!-- ========== ZONES - EXPLORATION ========== -->
<section class="section section-zones" id="zones">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Les 4 Zones</span>
            <h2 class="section-title">Choisissez votre voyage</h2>
            <p class="section-desc">Chaque zone offre un niveau d'immersion différent. Vous décidez de la profondeur de votre expérience.</p>
        </div>

        <?php if ( $img_ambiances ) : ?>
        <div class="zones-showcase" data-reveal>
            <img src="<?php echo esc_url( $img_ambiances ); ?>" alt="Les 4 ambiances Virealys - Japon, Paris, Classique, Cosmos" loading="lazy">
            <div class="zones-showcase-glow"></div>
        </div>
        <?php endif; ?>

        <div class="zones-grid">
            <div class="zone-card" data-reveal data-zone="origine">
                <div class="zone-number">01</div>
                <div class="zone-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 class="zone-title">Zone Origine</h3>
                <p class="zone-desc">Ambiance naturelle, slow food pur, produits locaux. L'authenticité dans sa forme la plus belle.</p>
                <span class="zone-tag">Slow Food</span>
            </div>
            <div class="zone-card" data-reveal data-zone="voyage">
                <div class="zone-number">02</div>
                <div class="zone-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3 class="zone-title">Zone Voyage</h3>
                <p class="zone-desc">Décor holographique dynamique : marché japonais, terrasse italienne, désert marocain.</p>
                <span class="zone-tag">Holographique</span>
            </div>
            <div class="zone-card" data-reveal data-zone="immersion">
                <div class="zone-number">03</div>
                <div class="zone-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M7 7V5a5 5 0 0 1 10 0v2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                </div>
                <h3 class="zone-title">Zone Immersion Totale</h3>
                <p class="zone-desc">Casque VR + son spatialisé. Savourez des sushis face au Mont Fuji.</p>
                <span class="zone-tag">Réalité Virtuelle</span>
            </div>
            <div class="zone-card" data-reveal data-zone="sensoriel">
                <div class="zone-number">04</div>
                <div class="zone-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <h3 class="zone-title">Zone Sensorielle</h3>
                <p class="zone-desc">Exploration : illusion gustative, jeux sensoriels, textures. Une aventure pour tous les sens.</p>
                <span class="zone-tag">Expérimental</span>
            </div>
        </div>
    </div>
</section>

<!-- ========== PASSEPORT - FIDÉLISATION ========== -->
<section class="section section-passport" id="passeport">
    <div class="container">
        <div class="passport-layout">
            <div class="passport-content" data-reveal>
                <span class="section-label">Fidélité</span>
                <h2 class="section-title">Le Passeport Virealys</h2>
                <p>Votre passeport numérique vous accompagne à chaque visite. Explorez les pays, collectionnez les tampons, débloquez des expériences exclusives.</p>
                <ul class="passport-perks">
                    <li>
                        <span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                        <span>Tampon digital pour chaque destination</span>
                    </li>
                    <li>
                        <span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                        <span>Bonus d'expérience cumulables</span>
                    </li>
                    <li>
                        <span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                        <span>Accès à des plats cachés exclusifs</span>
                    </li>
                    <li>
                        <span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                        <span>Invitations aux soirées spéciales</span>
                    </li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow">Obtenir mon passeport</a>
            </div>
            <div class="passport-visual" data-reveal>
                <div class="passport-card">
                    <div class="passport-card-inner">
                        <div class="passport-header">PASSEPORT</div>
                        <div class="passport-logo">VIREALYS</div>
                        <div class="passport-stamps">
                            <span class="stamp stamp-active" title="Japon">&#127471;&#127477;</span>
                            <span class="stamp stamp-active" title="Italie">&#127470;&#127481;</span>
                            <span class="stamp stamp-active" title="Maroc">&#127474;&#127462;</span>
                            <span class="stamp" title="France">&#127467;&#127479;</span>
                            <span class="stamp" title="Mexique">&#127474;&#127485;</span>
                            <span class="stamp" title="Inde">&#127470;&#127475;</span>
                        </div>
                        <div class="passport-level">Niveau : Explorateur</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ========== CTA FINAL - CONVERSION ========== -->
<section class="section section-cta" id="reservation">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Prêt pour le voyage ?</h2>
            <p class="section-desc">Réservez votre table et choisissez votre niveau d'immersion. L'aventure commence ici.</p>
            <div class="cta-actions">
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Réserver maintenant
                </a>
                <?php if ( get_theme_mod( 'phone_number' ) ) : ?>
                    <a href="tel:<?php echo esc_attr( get_theme_mod( 'phone_number' ) ); ?>" class="btn btn-ghost btn-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <?php echo esc_html( get_theme_mod( 'phone_number' ) ); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
