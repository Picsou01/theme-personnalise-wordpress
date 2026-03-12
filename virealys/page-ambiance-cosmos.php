<?php
/**
 * Template Name: Ambiance Cosmos
 * Description: Page dédiée à l'ambiance spatiale / cosmos
 */
get_header();
$img = virealys_get_image( 'img_ambiance_cosmos' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero" style="--amb-color: #a855f7; --amb-color-rgb: 168, 85, 247;">
    <?php if ( $img ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( $img ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="ambiance-hero-emoji">&#127756;</span>
        <span class="section-label">Ambiance</span>
        <h1 class="page-hero-title">Cosmos</h1>
        <p class="page-hero-desc">Futurisme & Évasion — Dînez parmi les étoiles</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="split-layout" data-reveal>
            <div class="split-content">
                <span class="section-label">L'Expérience</span>
                <h2 class="section-title">Gastronomie interstellaire</h2>
                <p>Bienvenue à bord de la station Virealys. Les murs holographiques projettent l'immensité de l'espace : nébuleuses, galaxies lointaines, la Terre vue depuis l'orbite.</p>
                <p>La gastronomie du futur prend forme : textures inédites, présentations lévitantes, saveurs qui défient la gravité. Une expérience unique qui repousse les limites du possible.</p>
                <div class="split-stats">
                    <div class="stat">
                        <span class="stat-number">7</span>
                        <span class="stat-label">Plats futuristes</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">VR</span>
                        <span class="stat-label">Immersion totale</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">0G</span>
                        <span class="stat-label">Effet visuel</span>
                    </div>
                </div>
            </div>
            <div class="ambiance-visual">
                <div class="zone-visual-card" style="--zone-accent: #a855f7;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Menu Cosmos</span>
            <h2 class="section-title">Saveurs de l'Infini</h2>
        </div>
        <div class="ambiance-menu-list">
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Amuse-bouche</span>
                <h3>Sphère de betterave, bille de chèvre</h3>
                <p>Sphérification de betterave en apesanteur visuelle, crème de chèvre aérienne.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Entrée</span>
                <h3>Nébuleuse de crustacés</h3>
                <p>Tartare de langoustines et oursin, gel de yuzu, caviar d'Aquitaine, fumée de bois blanc.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Plat</span>
                <h3>Orbite de veau stellaire</h3>
                <p>Filet de veau cuit à basse température, purée céleste de panais, jus de morilles réduites, poudre d'étoiles comestible.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Interlude</span>
                <h3>Trou noir sorbet</h3>
                <p>Sorbet charbon actif et cassis, craquant de sésame noir, voile de sucre irisé.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Dessert</span>
                <h3>Galaxie chocolat noir</h3>
                <p>Dôme chocolat 75%, coeur coulant au caramel cosmique, poussière d'or, glace vanille fumée.</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Embarquez vers les étoiles</h2>
            <p class="section-desc">Réservez votre table en ambiance Cosmos et vivez une expérience qui défie les lois de la physique.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
