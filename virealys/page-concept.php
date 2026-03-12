<?php
/**
 * Template Name: Le Concept
 * Description: Page concept Virealys
 */
get_header();
$hero_bg     = get_theme_mod( 'hero_bg', '' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero" <?php if ( $hero_bg ) : ?>style="--page-hero-bg: url(<?php echo esc_url( $hero_bg ); ?>)"<?php endif; ?>>
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Virealys</span>
            <h1 class="page-hero-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="page-hero-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="page-content concept-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta" id="reservation">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Pr&ecirc;t &agrave; d&eacute;couvrir Virealys ?</h2>
            <p class="section-desc">R&eacute;servez votre table et choisissez votre niveau d'immersion.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">R&eacute;server une exp&eacute;rience</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
