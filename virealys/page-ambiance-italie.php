<?php
/**
 * Template Name: Ambiance Italie
 * Description: Page dédiée à l'ambiance italienne
 */
get_header();
$img = virealys_get_image( 'img_ambiance_italie' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero" style="--amb-color: #e040fb; --amb-color-rgb: 224, 64, 251;">
    <?php if ( $img ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( $img ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="ambiance-hero-emoji">&#127470;&#127481;</span>
        <span class="section-label">Ambiance</span>
        <h1 class="page-hero-title">Italie</h1>
        <p class="page-hero-desc">Dolce Vita & Saveurs — Un voyage au coeur de la gastronomie italienne</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="split-layout" data-reveal>
            <div class="split-content">
                <span class="section-label">L'Expérience</span>
                <h2 class="section-title">Immersion italienne</h2>
                <p>Dès votre arrivée, les collines toscanes se déploient autour de vous en hologrammes dorés. Le parfum d'huile d'olive et de basilic frais flotte dans l'air, tandis qu'un air d'opéra accompagne votre dégustation.</p>
                <p>La cuisine italienne prend vie : pâtes fraîches façonnées devant vous, mozzarella filée à la minute, vins des meilleurs domaines de la Botte. Chaque plat raconte l'histoire d'une région, de la Sicile aux Dolomites.</p>
                <div class="split-stats">
                    <div class="stat">
                        <span class="stat-number">6</span>
                        <span class="stat-label">Plats signatures</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">360°</span>
                        <span class="stat-label">Immersion</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">20</span>
                        <span class="stat-label">Régions d'Italie</span>
                    </div>
                </div>
            </div>
            <div class="ambiance-visual">
                <div class="zone-visual-card" style="--zone-accent: #e040fb;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Menu Italie</span>
            <h2 class="section-title">Saveurs de la Botte</h2>
        </div>
        <div class="ambiance-menu-list">
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Amuse-bouche</span>
                <h3>Bruschetta al pomodoro & burrata</h3>
                <p>Pain toscan grillé au feu de bois, tomates San Marzano confites, burrata crémeuse des Pouilles, filet d'huile d'olive extra vierge.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Antipasto</span>
                <h3>Carpaccio di manzo, roquette & parmesan</h3>
                <p>Fines tranches de boeuf cru, roquette sauvage, copeaux de Parmigiano Reggiano 36 mois, vinaigrette au citron de Sorrente.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Primo</span>
                <h3>Risotto allo zafferano e osso buco</h3>
                <p>Risotto milanais au safran de San Gimignano, osso buco de veau braisé, gremolata d'agrumes et persil frais.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Secondo</span>
                <h3>Branzino al forno, olive & capperi</h3>
                <p>Bar de ligne rôti au four, olives taggiasca, câpres de Pantelleria, tomates cerises, pommes de terre fondantes au romarin.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Intermezzo</span>
                <h3>Granita al limone di Amalfi</h3>
                <p>Granité au citron de la côte amalfitaine, zeste confit, feuille de menthe fraîche.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Dolce</span>
                <h3>Tiramisu alla Virealys</h3>
                <p>Biscuits savoiardi imbibés d'espresso, crème de mascarpone à la vanille de Sicile, cacao amer et éclats d'amaretti.</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Vivez la Dolce Vita</h2>
            <p class="section-desc">Réservez votre table en ambiance Italie et laissez-vous transporter au coeur de la péninsule.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
