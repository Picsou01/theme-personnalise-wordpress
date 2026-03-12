<?php
/**
 * Template Name: Ambiance Japon
 * Description: Page dédiée à l'ambiance japonaise
 */
get_header();
$img = virealys_get_image( 'img_ambiance_japon' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero" style="--amb-color: #ff6b6b; --amb-color-rgb: 255, 107, 107;">
    <?php if ( $img ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( $img ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="ambiance-hero-emoji">&#127471;&#127477;</span>
        <span class="section-label">Ambiance</span>
        <h1 class="page-hero-title">Japon</h1>
        <p class="page-hero-desc">Zen & Raffinement — Un voyage sensoriel au pays du soleil levant</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="split-layout" data-reveal>
            <div class="split-content">
                <span class="section-label">L'Expérience</span>
                <h2 class="section-title">Immersion nippone</h2>
                <p>Dès votre entrée, les cerisiers en fleurs holographiques vous enveloppent. Le son délicat d'un koto accompagne votre parcours gustatif, tandis que des jardins zen se dessinent autour de vous.</p>
                <p>Les sushis sont préparés devant vous avec une précision millénaire, sublimés par une traçabilité holographique : chaque poisson, chaque grain de riz vous raconte son histoire.</p>
                <div class="split-stats">
                    <div class="stat">
                        <span class="stat-number">4</span>
                        <span class="stat-label">Plats signatures</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">360°</span>
                        <span class="stat-label">Immersion</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">5</span>
                        <span class="stat-label">Sens stimulés</span>
                    </div>
                </div>
            </div>
            <div class="ambiance-visual">
                <div class="zone-visual-card" style="--zone-accent: #ff6b6b;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Menu Japon</span>
            <h2 class="section-title">Saveurs du Soleil Levant</h2>
        </div>
        <div class="ambiance-menu-list">
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Amuse-bouche</span>
                <h3>Edamame fumé au sel noir</h3>
                <p>Fèves de soja grillées au binchotan, sel volcanique de Hokkaido.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Entrée</span>
                <h3>Sashimi du marché de Tsukiji</h3>
                <p>Thon rouge, sériole et daurade royale, condiments yuzu-wasabi frais.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Plat</span>
                <h3>Wagyu A5 grillé au charbon</h3>
                <p>Boeuf de Kobe, sauce teriyaki maison, légumes racines glacés au miso.</p>
            </div>
            <div class="ambiance-menu-item" data-reveal>
                <span class="course-label">Dessert</span>
                <h3>Matcha soufflé, crème azuki</h3>
                <p>Soufflé au thé vert cérémoniel, crème de haricots rouges confits, pétales de sakura.</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Tentez l'expérience Japon</h2>
            <p class="section-desc">Réservez votre table en ambiance japonaise et laissez-vous transporter.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
