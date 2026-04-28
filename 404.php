<?php
/**
 * 404 template
 */
get_header();
?>

<section class="section section-404 v-page-hero">
    <div class="container v-page-hero-grid">
        <div class="error-content" data-reveal>
            <h1 class="error-title">404</h1>
            <p class="error-subtitle">Cette destination n'existe pas encore.</p>
            <p>Elle apparaitra peut-etre dans une prochaine route du passeport.</p>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-glow">Retour constellation</a>
        </div>
        <div class="v-page-mini-map" data-reveal aria-hidden="true">
            <span class="v-mini-star">?</span>
            <span class="v-mini-star">V</span>
            <span class="v-mini-star">404</span>
            <span class="v-mini-star">R</span>
        </div>
    </div>
</section>

<?php get_footer(); ?>
