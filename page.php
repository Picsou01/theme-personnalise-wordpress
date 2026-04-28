<?php
/**
 * Universal page template - Virealys orbit page
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
$page_slug   = isset( $post ) ? $post->post_name : '';
?>

<section class="v-page-hero v-page-hero-<?php echo esc_attr( $page_slug ); ?>"<?php if ( has_post_thumbnail() ) : ?> style="--page-hero-bg:url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"<?php endif; ?>>
    <?php if ( has_post_thumbnail() ) : ?>
        <div class="page-hero-bg" style="background-image:url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"></div>
    <?php endif; ?>
    <div class="page-hero-overlay"></div>
    <div class="container v-page-hero-grid">
        <div data-reveal>
            <span class="section-label"><?php esc_html_e( 'Route Virealys', 'virealys' ); ?></span>
            <h1 class="v-page-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="v-page-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
        <div class="v-page-mini-map" data-reveal aria-hidden="true">
            <span class="v-mini-star">01</span>
            <span class="v-mini-star">02</span>
            <span class="v-mini-star">03</span>
            <span class="v-mini-star">04</span>
        </div>
    </div>
</section>

<section class="section v-page-body" data-reveal>
    <div class="container v-page-layout">
        <div class="page-content v-page-content">
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>
        <aside class="v-page-side" aria-label="<?php esc_attr_e( 'Raccourcis Virealys', 'virealys' ); ?>">
            <a class="v-link-card" href="<?php echo esc_url( home_url( '/#passeport' ) ); ?>">
                <strong><?php esc_html_e( 'Passeport vivant', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'Tampons, niveaux et recompenses relient chaque page a la salle.', 'virealys' ); ?></span>
            </a>
            <a class="v-link-card" href="<?php echo esc_url( home_url( '/voyage-game/' ) ); ?>">
                <strong><?php esc_html_e( 'Jeu bateau', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'Collectez les ingredients avant de les convertir au restaurant.', 'virealys' ); ?></span>
            </a>
            <a class="v-link-card" href="<?php echo esc_url( $reservation ); ?>">
                <strong><?php esc_html_e( 'Reservation', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'Zone, pays du mois, allergies et code passeport au meme endroit.', 'virealys' ); ?></span>
            </a>
        </aside>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title"><?php echo esc_html( get_theme_mod( 'cta_title', 'Pret a voyager ?' ) ); ?></h2>
            <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cta_subtitle', 'Reservez votre experience immersive.' ) ); ?></p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Reserver</a>
        </div>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>

<?php get_footer(); ?>
