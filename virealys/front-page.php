<?php
/**
 * Front page template - Spatial Panel Navigation
 * v4.0 - Revolutionary spatial experience with predictive navigation
 */
get_header();

$hero_title    = get_theme_mod( 'hero_title', 'Voyagez sans quitter votre table' );
$hero_subtitle = get_theme_mod( 'hero_subtitle', 'Le premier restaurant Slow Food immersif &amp; &eacute;volutif' );
$hero_bg       = get_theme_mod( 'hero_bg', '' );
$img_menus     = virealys_get_image( 'img_menus' );
$img_trace     = virealys_get_image( 'img_tracabilite' );
$img_ambiances = virealys_get_image( 'img_ambiances' );
$reservation   = get_theme_mod( 'reservation_url', '#reservation' );

$img_amb_japon  = virealys_get_image( 'img_ambiance_japon' );
$img_amb_paris  = virealys_get_image( 'img_ambiance_paris' );
$img_amb_italie = virealys_get_image( 'img_ambiance_italie' );
$img_amb_cosmos = virealys_get_image( 'img_ambiance_cosmos' );
?>

<!-- SPATIAL CANVAS -->
<div class="vr-spatial" id="vr-spatial">

<!-- ===== PANEL 0: HERO ===== -->
<section class="vr-panel vr-panel-active" data-panel="hero" id="hero">
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
            Slow Food Immersif &amp; &Eacute;volutif
        </div>
        <h1 class="hero-title" data-reveal><?php echo esc_html( $hero_title ); ?></h1>
        <p class="hero-subtitle" data-reveal><?php echo esc_html( $hero_subtitle ); ?></p>
        <div class="hero-actions" data-reveal>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Vivre l'exp&eacute;rience
            </a>
            <button class="btn btn-ghost btn-lg vr-panel-goto" data-goto="1">
                D&eacute;couvrir
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
        </div>
    </div>
    <div class="hero-scroll">
        <div class="scroll-line"></div>
    </div>
</section>

<!-- ===== PANEL 1: CONCEPT ===== -->
<section class="vr-panel" data-panel="concept" data-section-color="#00e5ff" id="concept">
    <div class="vr-panel-scroll">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Concept</span>
            <h2 class="section-title">La gastronomie r&eacute;invent&eacute;e<br>par l'immersion</h2>
            <p class="section-desc">Virealys fusionne l'art culinaire slow food et la technologie immersive. Chaque salle vous transporte dans un pays, chaque plat raconte une histoire.</p>
        </div>

        <div class="concept-grid">
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3>Salles &Eacute;volutives</h3>
                <p>Chaque mois, un pays change totalement. D&eacute;cor, musique, parfums d'ambiance, tenue du personnel.</p>
            </div>
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3>Hologrammes &amp; VR</h3>
                <p>Des d&eacute;cors holographiques dynamiques et une option VR pour manger dans l'environnement r&eacute;el de votre plat.</p>
            </div>
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h3>Modulable</h3>
                <p>Classique, Immersif, Gastronomique ou Sensoriel : vous choisissez votre niveau d'exp&eacute;rience.</p>
            </div>
        </div>

        <?php if ( $img_trace ) : ?>
        <div class="concept-showcase" data-reveal>
            <div class="showcase-image">
                <img src="<?php echo esc_url( $img_trace ); ?>" alt="Tra&ccedil;abilit&eacute; immersive" loading="lazy">
                <div class="showcase-glow"></div>
            </div>
            <div class="showcase-caption">
                <span class="section-label">Tra&ccedil;abilit&eacute;</span>
                <h3>Chaque plat, une histoire visible</h3>
                <p>D&eacute;couvrez l'origine de chaque ingr&eacute;dient via un hologramme interactif. Du producteur &agrave; votre assiette, en totale transparence.</p>
            </div>
        </div>
        <?php endif; ?>
    </div>
    </div>
</section>

<!-- ===== PANEL 2: AMBIANCES ===== -->
<section class="vr-panel" data-panel="ambiances" data-section-color="#a855f7" id="ambiances">
    <div class="vr-panel-scroll">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Les Ambiances</span>
            <h2 class="section-title">Choisissez votre univers</h2>
            <p class="section-desc">Quatre ambiances uniques, quatre voyages sensoriels.</p>
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
                    <p class="ambiance-card-subtitle">Zen &amp; Raffinement</p>
                    <p class="ambiance-card-desc">Jardins zen, cerisiers en fleurs, sushis face au Mont Fuji.</p>
                    <span class="ambiance-card-cta">D&eacute;couvrir <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
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
                    <p class="ambiance-card-subtitle">Romance &amp; Lumi&egrave;re</p>
                    <p class="ambiance-card-desc">Terrasses parisiennes, lumi&egrave;res, bistronomie cr&eacute;ative.</p>
                    <span class="ambiance-card-cta">D&eacute;couvrir <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                </div>
            </a>

            <a href="<?php echo esc_url( home_url( '/ambiance-italie/' ) ); ?>" class="ambiance-card" data-reveal style="--amb-color: #4caf50; --amb-color-rgb: 76, 175, 80;">
                <?php if ( $img_amb_italie ) : ?>
                    <div class="ambiance-card-bg" style="background-image: url(<?php echo esc_url( $img_amb_italie ); ?>)"></div>
                <?php endif; ?>
                <div class="ambiance-card-overlay"></div>
                <div class="ambiance-card-content">
                    <span class="ambiance-card-emoji">&#127470;&#127481;</span>
                    <h3 class="ambiance-card-title">Italie</h3>
                    <p class="ambiance-card-subtitle">Dolce Vita &amp; Saveurs</p>
                    <p class="ambiance-card-desc">Paysages toscans, saveurs m&eacute;diterran&eacute;ennes, vins d'exception.</p>
                    <span class="ambiance-card-cta">D&eacute;couvrir <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
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
                    <p class="ambiance-card-subtitle">Futurisme &amp; &Eacute;vasion</p>
                    <p class="ambiance-card-desc">D&icirc;nez parmi les &eacute;toiles, gastronomie du futur.</p>
                    <span class="ambiance-card-cta">D&eacute;couvrir <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                </div>
            </a>
        </div>
    </div>
    </div>
</section>

<!-- ===== PANEL 3: MENUS ===== -->
<section class="vr-panel" data-panel="menus" data-section-color="#4d7cff" id="menus">
    <div class="vr-panel-scroll">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Nos Formules</span>
            <h2 class="section-title">L'exp&eacute;rience &agrave; votre mesure</h2>
            <p class="section-desc">Du d&icirc;ner classique &agrave; l'immersion totale.</p>
        </div>

        <?php if ( $img_menus ) : ?>
        <div class="menus-showcase" data-reveal>
            <img src="<?php echo esc_url( $img_menus ); ?>" alt="Nos formules" loading="lazy">
            <div class="menus-showcase-glow"></div>
        </div>
        <?php endif; ?>

        <div class="menus-grid">
            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg></div>
                <h3>Menu Classique</h3>
                <p class="menu-price">35&euro;</p>
                <ul class="menu-features">
                    <li>Zone Origine</li>
                    <li>3 plats slow food</li>
                    <li>Produits locaux &amp; de saison</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline btn-sm">R&eacute;server</a>
            </div>

            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg></div>
                <h3>Menu Gastronomique</h3>
                <p class="menu-price">50&euro;</p>
                <ul class="menu-features">
                    <li>Zone Voyage</li>
                    <li>5 plats cr&eacute;atifs</li>
                    <li>D&eacute;cors holographiques</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline btn-sm">R&eacute;server</a>
            </div>

            <div class="menu-card menu-card-featured" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-badge">Populaire</div>
                <div class="menu-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                <h3>Menu Semi-&Eacute;toil&eacute;</h3>
                <p class="menu-price">75&euro;</p>
                <ul class="menu-features">
                    <li>Zone Immersion Totale</li>
                    <li>7 plats signature + VR</li>
                    <li>Sommelier d&eacute;di&eacute;</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-sm">R&eacute;server</a>
            </div>

            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg></div>
                <h3>Haute Gastronomie</h3>
                <p class="menu-price">120&euro;</p>
                <ul class="menu-features">
                    <li>Toutes les zones</li>
                    <li>9 plats d'exception</li>
                    <li>Passeport VIP offert</li>
                </ul>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline btn-sm">R&eacute;server</a>
            </div>
        </div>
    </div>
    </div>
</section>

<!-- ===== PANEL 4: ZONES ===== -->
<section class="vr-panel" data-panel="zones" data-section-color="#e040fb" id="zones">
    <div class="vr-panel-scroll">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Les 4 Zones</span>
            <h2 class="section-title">Choisissez votre voyage</h2>
        </div>

        <div class="zones-grid">
            <div class="zone-card" data-reveal data-zone="origine">
                <div class="zone-number">01</div>
                <div class="zone-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <h3 class="zone-title">Zone Origine</h3>
                <p class="zone-desc">Ambiance naturelle, slow food pur, produits locaux.</p>
                <span class="zone-tag">Slow Food</span>
            </div>
            <div class="zone-card" data-reveal data-zone="voyage">
                <div class="zone-number">02</div>
                <div class="zone-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg></div>
                <h3 class="zone-title">Zone Voyage</h3>
                <p class="zone-desc">D&eacute;cor holographique dynamique du pays du mois.</p>
                <span class="zone-tag">Holographique</span>
            </div>
            <div class="zone-card" data-reveal data-zone="immersion">
                <div class="zone-number">03</div>
                <div class="zone-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M7 7V5a5 5 0 0 1 10 0v2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg></div>
                <h3 class="zone-title">Zone Immersion</h3>
                <p class="zone-desc">Casque VR + son spatialis&eacute;. Immersion totale.</p>
                <span class="zone-tag">R&eacute;alit&eacute; Virtuelle</span>
            </div>
            <div class="zone-card" data-reveal data-zone="sensoriel">
                <div class="zone-number">04</div>
                <div class="zone-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div>
                <h3 class="zone-title">Zone Sensorielle</h3>
                <p class="zone-desc">Illusions gustatives, jeux sensoriels, exp&eacute;rimental.</p>
                <span class="zone-tag">Exp&eacute;rimental</span>
            </div>
        </div>
    </div>
    </div>
</section>

<!-- ===== PANEL 5: PASSEPORT ===== -->
<section class="vr-panel" data-panel="passeport" data-section-color="#a855f7" id="passeport">
    <div class="vr-panel-scroll">
    <div class="container">
        <div class="passport-layout">
            <div class="passport-content" data-reveal>
                <span class="section-label">Fid&eacute;lit&eacute;</span>
                <h2 class="section-title">Le Passeport Virealys</h2>
                <p>Votre passeport num&eacute;rique vous accompagne &agrave; chaque visite. Explorez les pays, collectionnez les tampons, d&eacute;bloquez des exp&eacute;riences exclusives.</p>
                <ul class="passport-perks">
                    <li><span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span><span>Tampon digital pour chaque destination</span></li>
                    <li><span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span><span>Bonus d'exp&eacute;rience cumulables</span></li>
                    <li><span class="perk-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span><span>Acc&egrave;s &agrave; des plats cach&eacute;s exclusifs</span></li>
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
                            <span class="stamp stamp-active" title="France">&#127467;&#127479;</span>
                            <span class="stamp" title="Maroc">&#127474;&#127462;</span>
                            <span class="stamp" title="Mexique">&#127474;&#127485;</span>
                            <span class="stamp" title="Inde">&#127470;&#127475;</span>
                        </div>
                        <div class="passport-level">Niveau : Explorateur</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</section>

<!-- ===== PANEL 6: CTA / RESERVATION ===== -->
<section class="vr-panel" data-panel="reservation" data-section-color="#00e5ff" id="reservation">
    <div class="cta-bg"></div>
    <div class="container" style="position: relative; z-index: 1;">
        <div class="cta-content" data-reveal>
            <h2 class="section-title" style="font-size: clamp(2rem, 5vw, 3.5rem);">Pr&ecirc;t pour le voyage ?</h2>
            <p class="section-desc">R&eacute;servez votre table et choisissez votre niveau d'immersion. L'aventure commence ici.</p>
            <div class="cta-actions">
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    R&eacute;server maintenant
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

</div><!-- /.vr-spatial -->

<?php get_footer(); ?>
