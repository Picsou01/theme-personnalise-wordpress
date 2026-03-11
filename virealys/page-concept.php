<?php
/**
 * Template Name: Le Concept
 * Description: Page dédiée au concept Virealys
 */
get_header();

$hero_bg   = get_theme_mod( 'hero_bg', '' );
$img_trace = virealys_get_image( 'img_tracabilite' );
$img_ambiances = virealys_get_image( 'img_ambiances' );
?>

<!-- PAGE HERO -->
<section class="page-hero" <?php if ( $hero_bg ) : ?>style="--page-hero-bg: url(<?php echo esc_url( $hero_bg ); ?>)"<?php endif; ?>>
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Virealys</span>
            <h1 class="page-hero-title">Le Concept</h1>
            <p class="page-hero-desc">Le premier restaurant Slow Food immersif & évolutif. Une cuisine d'exception dans un monde qui se réinvente chaque mois.</p>
        </div>
    </div>
</section>

<!-- PHILOSOPHIE -->
<section class="section">
    <div class="container">
        <div class="split-layout">
            <div class="split-content" data-reveal>
                <span class="section-label">Philosophie</span>
                <h2 class="section-title">Slow Food, Fast Emotion</h2>
                <p>Chez Virealys, la nourriture est réelle, locale, de saison. La technologie ne remplace jamais la qualité du produit : elle sublime l'expérience qui l'entoure.</p>
                <p>Nous croyons que manger est un voyage. Un voyage qui commence par les yeux, passe par les oreilles, et se termine dans le coeur.</p>
                <div class="split-stats">
                    <div class="stat">
                        <span class="stat-number">100%</span>
                        <span class="stat-label">Produits locaux & de saison</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">4</span>
                        <span class="stat-label">Niveaux d'immersion</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">12</span>
                        <span class="stat-label">Pays par an</span>
                    </div>
                </div>
            </div>
            <?php if ( $img_trace ) : ?>
            <div class="split-visual" data-reveal>
                <div class="showcase-image">
                    <img src="<?php echo esc_url( $img_trace ); ?>" alt="Traçabilité immersive" loading="lazy">
                    <div class="showcase-glow"></div>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- COMMENT ÇA MARCHE -->
<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Votre parcours</span>
            <h2 class="section-title">Comment ça marche</h2>
        </div>
        <div class="steps-grid">
            <div class="step-card" data-reveal>
                <div class="step-number">01</div>
                <h3>Choisissez votre formule</h3>
                <p>Du Menu Classique à l'Expérience Haute Gastronomie Immersive, trouvez le niveau qui vous correspond.</p>
            </div>
            <div class="step-card" data-reveal>
                <div class="step-number">02</div>
                <h3>Recevez votre Passeport</h3>
                <p>Votre passeport numérique Virealys vous accompagne. Collectionnez les tampons de chaque pays visité.</p>
            </div>
            <div class="step-card" data-reveal>
                <div class="step-number">03</div>
                <h3>Plongez dans l'expérience</h3>
                <p>Hologrammes, VR, parfums d'ambiance... Le décor s'adapte à votre menu et au pays du mois.</p>
            </div>
            <div class="step-card" data-reveal>
                <div class="step-number">04</div>
                <h3>Savourez & explorez</h3>
                <p>Dégustez des plats d'exception, découvrez la traçabilité de chaque ingrédient, vivez l'instant.</p>
            </div>
        </div>
    </div>
</section>

<!-- AMBIANCES -->
<?php if ( $img_ambiances ) : ?>
<section class="section">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Les Ambiances</span>
            <h2 class="section-title">Un restaurant qui se réinvente chaque mois</h2>
        </div>
        <div class="fullwidth-image" data-reveal>
            <img src="<?php echo esc_url( $img_ambiances ); ?>" alt="Les 4 ambiances Virealys" loading="lazy">
            <div class="showcase-glow"></div>
        </div>
        <div class="ambiance-features" style="margin-top: 3rem;">
            <div class="ambiance-feature" data-reveal>
                <div class="ambiance-number">01</div>
                <h3>Chaque mois, un nouveau pays</h3>
                <p>Décor, musique, parfums d'ambiance et tenues du personnel changent complètement.</p>
            </div>
            <div class="ambiance-feature" data-reveal>
                <div class="ambiance-number">02</div>
                <h3>Technologie invisible</h3>
                <p>La tech sublime l'expérience sans jamais s'imposer. Tout est au service de vos sens.</p>
            </div>
            <div class="ambiance-feature" data-reveal>
                <div class="ambiance-number">03</div>
                <h3>Nourriture réelle, toujours</h3>
                <p>La qualité des produits reste notre priorité absolue. Le virtuel complète, ne remplace jamais.</p>
            </div>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- CTA -->
<section class="section section-cta" id="reservation">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Prêt à découvrir Virealys ?</h2>
            <p class="section-desc">Réservez votre table et choisissez votre niveau d'immersion.</p>
            <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#' ) ); ?>" class="btn btn-glow btn-lg">Réserver une expérience</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
