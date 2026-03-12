<?php
/**
 * Template Name: Ambiance Japon
 * Description: Page ambiance japonaise
 */
get_header();
$img         = virealys_get_image( 'img_ambiance_japon' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero ambiance-hero" style="--amb-color: #ff6b6b; --amb-color-rgb: 255, 107, 107;">
    <?php if ( $img ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( $img ); ?>)"></div>
    <?php elseif ( has_post_thumbnail() ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"></div>
    <?php endif; ?>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content" data-reveal>
        <span class="ambiance-hero-emoji">&#127471;&#127477;</span>
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
            <h2 class="section-title">Tentez l'exp&eacute;rience</h2>
            <p class="section-desc">R&eacute;servez votre table et laissez-vous transporter.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">R&eacute;server</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
