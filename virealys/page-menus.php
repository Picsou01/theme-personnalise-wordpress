<?php
/**
 * Template Name: Nos Menus
 * Description: Page formules et menus
 */
get_header();
$img_menus   = virealys_get_image( 'img_menus' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Les Formules</span>
            <h1 class="page-hero-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="page-hero-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php if ( $img_menus ) : ?>
<section class="section" style="padding-bottom: 0;">
    <div class="container">
        <div class="fullwidth-image" data-reveal>
            <img src="<?php echo esc_url( $img_menus ); ?>" alt="<?php the_title(); ?>" loading="lazy">
            <div class="showcase-glow"></div>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="section">
    <div class="container">
        <div class="page-content menus-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Une question sur nos formules ?</h2>
            <p class="section-desc">Notre &eacute;quipe est l&agrave; pour vous guider.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">R&eacute;server</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
