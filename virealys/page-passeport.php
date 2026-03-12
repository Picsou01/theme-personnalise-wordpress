<?php
/**
 * Template Name: Passeport Virealys
 * Description: Page syst&egrave;me de fid&eacute;lit&eacute; Passeport
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Fid&eacute;lit&eacute;</span>
            <h1 class="page-hero-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="page-hero-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="page-content passeport-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Pr&ecirc;t &agrave; commencer le voyage ?</h2>
            <p class="section-desc">Votre passeport vous attend.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Obtenir mon passeport</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
