<?php
/**
 * 404 template
 */
get_header();
?>

<section class="section section-404">
    <div class="container">
        <div class="error-content">
            <h1 class="error-title">404</h1>
            <p class="error-subtitle">Cette destination n'existe pas encore.</p>
            <p>Peut-être qu'elle apparaîtra dans une prochaine mise à jour du voyage...</p>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-glow">Retour à l'accueil</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
