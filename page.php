<?php
/**
 * Universal page template
 * Hero (with optional featured image) + Content + CTA
 * All pages automatically get the revolutionary adaptive design.
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero"<?php if ( has_post_thumbnail() ) : ?> style="--page-hero-bg: url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"<?php endif; ?>>
    <?php if ( has_post_thumbnail() ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"></div>
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

<section class="section">
    <div class="container">
        <div class="page-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Une question ?</h2>
            <p class="section-desc">R&eacute;servez votre exp&eacute;rience immersive d&egrave;s maintenant.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">R&eacute;server</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
