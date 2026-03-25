<?php
/**
 * Universal page template v8.0
 * Responsive hero images, CSS containment, shared return bar
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
$page_slug   = $post->post_name;
?>

<section class="page-hero"<?php if ( has_post_thumbnail() ) : ?> style="--page-hero-bg:url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"<?php endif; ?>>
    <?php if ( has_post_thumbnail() ) : ?>
        <div class="page-hero-bg" style="background-image:url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <h1 class="page-hero-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="page-hero-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="section page-section" data-reveal>
    <div class="container">
        <div class="page-content">
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title"><?php echo esc_html( get_theme_mod( 'cta_title', 'Prêt à voyager ?' ) ); ?></h2>
            <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cta_subtitle', 'Réservez votre expérience immersive.' ) ); ?></p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
        </div>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>

<?php get_footer(); ?>
