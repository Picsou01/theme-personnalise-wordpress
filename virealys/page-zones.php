<?php
/**
 * Template Name: Les Zones
 * Description: Page 4 zones d'exp&eacute;rience
 */
get_header();
$img_ambiances = virealys_get_image( 'img_ambiances' );
$reservation   = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">L'Exp&eacute;rience</span>
            <h1 class="page-hero-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="page-hero-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php if ( $img_ambiances ) : ?>
<section class="section" style="padding-bottom: 0;">
    <div class="container">
        <div class="fullwidth-image" data-reveal>
            <img src="<?php echo esc_url( $img_ambiances ); ?>" alt="<?php the_title(); ?>" loading="lazy">
            <div class="showcase-glow"></div>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="section">
    <div class="container">
        <div class="page-content zones-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Quelle zone vous attire ?</h2>
            <p class="section-desc">R&eacute;servez et choisissez votre niveau d'immersion.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">R&eacute;server maintenant</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
