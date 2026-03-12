<?php
/**
 * Template Name: Ambiance Paris
 * Description: Page dédiée à l'ambiance parisienne
 */
get_header();
$img = virealys_get_image( 'img_ambiance_paris' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero" style="--amb-color: #ffd700; --amb-color-rgb: 255, 215, 0;">
    <?php if ( $img ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( $img ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="ambiance-hero-emoji">&#127467;&#127479;</span>
        <span class="section-label">Ambiance</span>
        <h1 class="page-hero-title">Paris</h1>
        <p class="page-hero-desc">Romance & Lumière — La magie parisienne dans votre assiette</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="split-layout" data-reveal>
            <div class="split-content">
                <span class="section-label">L'Expérience</span>
                <h2 class="section-title">La Ville Lumière à votre table</h2>
                <p>Les hologrammes reconstituent une terrasse parisienne au crépuscule. La Tour Eiffel scintille au loin, les quais de Seine défilent doucement. L'accordéon se mêle aux conversations feutrées.</p>
                <p>La bistronomie créative prend vie : chaque plat est un hommage à la cuisine française revisitée avec audace et modernité, sans jamais perdre l'élégance naturelle de Paris.</p>
                <div class="split-stats">
                    <div class="stat">
                        <span class="stat-number">5</span>
                        <span class="stat-label">Plats signatures</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">360°</span>
                        <span class="stat-label">Vue panoramique</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">2h</span>
                        <span class="stat-label">D'évasion</span>
                    </div>
                </div>
            </div>
            <div class="ambiance-visual">
                <div class="zone-visual-card" style="--zone-accent: #ffd700;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2L8 10H2l5 4-2 8 7-5 7 5-2-8 5-4h-6z"/></svg>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Menu Paris</span>
            <h2 class="section-title">Saveurs de la Ville Lumière</h2>
        </div>
        <div class="ambiance-menu-list">
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Amuse-bouche</span>
                <h3>Gougères au comté affiné</h3>
                <p>Choux soufflés au fromage, crème de ciboulette et fleur de sel de Guérande.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Entrée</span>
                <h3>Foie gras mi-cuit, figues rôties</h3>
                <p>Foie gras de canard fermier, chutney de figues, brioche toastée au beurre doux.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Plat</span>
                <h3>Filet de boeuf Rossini</h3>
                <p>Tournedos sur croûton, escalope de foie gras poêlée, jus truffé, pommes Anna.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Dessert</span>
                <h3>Paris-Brest revisité</h3>
                <p>Choux craquelin, crème pralinée noisettes du Piémont, éclats de caramel au beurre salé.</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Vivez la magie parisienne</h2>
            <p class="section-desc">Réservez votre table en ambiance Paris et laissez la Ville Lumière vous envelopper.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
