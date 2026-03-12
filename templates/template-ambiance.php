<?php
/**
 * Template Name: Ambiance
 * Description: Template universel pour toutes les ambiances. Utilisez l'image mise en avant et l'extrait pour personnaliser chaque page.
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero">
    <?php if ( has_post_thumbnail() ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="section-label">Ambiance</span>
        <h1 class="page-hero-title"><?php the_title(); ?></h1>
        <?php if ( has_excerpt() ) : ?>
            <p class="page-hero-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
        <?php endif; ?>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="page-content ambiance-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title"><?php echo esc_html( get_theme_mod( 'cta_title', 'Tentez l\'expérience' ) ); ?></h2>
            <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cta_subtitle', 'Réservez votre table et laissez-vous transporter.' ) ); ?></p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">R&eacute;server</a>
        </div>
    </div>
</section>

<!-- Constellation Return Bar -->
<div class="vr-constellation-return" id="vr-constellation-return">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="constellation-return-btn">
        <span class="constellation-return-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </span>
        Constellation
        <span class="constellation-return-pulse"></span>
    </a>
</div>

<?php get_footer(); ?>
