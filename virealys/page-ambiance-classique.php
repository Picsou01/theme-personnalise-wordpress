<?php
/**
 * Template Name: Ambiance Classique Française
 * Description: Page dédiée à l'ambiance classique française
 */
get_header();
$img = virealys_get_image( 'img_ambiance_classic' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero" style="--amb-color: #4caf50; --amb-color-rgb: 76, 175, 80;">
    <?php if ( $img ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( $img ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="ambiance-hero-emoji">&#127860;</span>
        <span class="section-label">Ambiance</span>
        <h1 class="page-hero-title">Classique Française</h1>
        <p class="page-hero-desc">Tradition & Excellence — Le raffinement de la gastronomie française</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="split-layout" data-reveal>
            <div class="split-content">
                <span class="section-label">L'Expérience</span>
                <h2 class="section-title">L'art de la table réinventé</h2>
                <p>Nappes blanches immaculées, argenterie étincelante, chandelles douces. L'ambiance classique française est un retour aux sources de l'élégance gastronomique.</p>
                <p>Les hologrammes discrets projettent des paysages de vignobles bourguignons et de marchés provençaux. La technologie est au service de la tradition, jamais l'inverse.</p>
                <div class="split-stats">
                    <div class="stat">
                        <span class="stat-number">6</span>
                        <span class="stat-label">Plats raffinés</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">100%</span>
                        <span class="stat-label">Produits français</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">3</span>
                        <span class="stat-label">Accords vins</span>
                    </div>
                </div>
            </div>
            <div class="ambiance-visual">
                <div class="zone-visual-card" style="--zone-accent: #4caf50;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Menu Classique</span>
            <h2 class="section-title">Saveurs du Terroir</h2>
        </div>
        <div class="ambiance-menu-list">
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Amuse-bouche</span>
                <h3>Velouté de châtaignes, noisettes</h3>
                <p>Crème onctueuse de châtaignes du Périgord, éclats de noisettes torréfiées, huile de truffe.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Entrée</span>
                <h3>Terrine de campagne maison</h3>
                <p>Porc fermier et gibier, cornichons, pain de campagne grillé au feu de bois.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Plat</span>
                <h3>Canard confit, pommes sarladaises</h3>
                <p>Cuisse de canard confite lentement, pommes de terre fondantes à la graisse de canard, cèpes poêlés.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Fromage</span>
                <h3>Plateau de fromages affinés</h3>
                <p>Sélection de 5 fromages de nos régions, confiture de cerises noires, noix fraîches.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Dessert</span>
                <h3>Tarte Tatin aux pommes caramélisées</h3>
                <p>Pommes fondantes au caramel au beurre salé, crème fraîche épaisse, vanille de Madagascar.</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Savourez la tradition</h2>
            <p class="section-desc">Réservez votre table en ambiance Classique Française pour un voyage dans le temps gastronomique.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
