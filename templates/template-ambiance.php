<?php
/**
 * Template Name: Ambiance
 * Description: Template universel pour toutes les ambiances. Utilisez l'image mise en avant et l'extrait pour personnaliser chaque page.
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
$monthly     = get_theme_mod( 'monthly_country', 'Japon nocturne' );
?>

<section class="v-page-hero ambiance-hero">
    <?php if ( has_post_thumbnail() ) : ?>
        <div class="page-hero-bg" style="background-image: url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'virealys-hero' ) ); ?>)"></div>
    <?php endif; ?>
    <div class="page-hero-overlay"></div>
    <div class="container v-page-hero-grid">
        <div data-reveal>
            <span class="section-label"><?php echo esc_html( $monthly ); ?></span>
            <h1 class="v-page-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="v-page-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
        <div class="v-page-mini-map" data-reveal aria-hidden="true">
            <span class="v-mini-star">Gout</span>
            <span class="v-mini-star">Son</span>
            <span class="v-mini-star">VR</span>
            <span class="v-mini-star">Visa</span>
        </div>
    </div>
</section>

<section class="section v-page-body">
    <div class="container v-page-layout">
        <div class="page-content v-page-content ambiance-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
            <div class="v-template-grid">
                <article class="v-template-card">
                    <strong><?php esc_html_e( 'Avant la table', 'virealys' ); ?></strong>
                    <p><?php esc_html_e( 'Le client decouvre la destination, joue une quete courte et arrive avec un objectif clair.', 'virealys' ); ?></p>
                </article>
                <article class="v-template-card">
                    <strong><?php esc_html_e( 'Pendant le service', 'virealys' ); ?></strong>
                    <p><?php esc_html_e( 'La salle valide le passeport et transforme les etoiles en attention tangible.', 'virealys' ); ?></p>
                </article>
                <article class="v-template-card">
                    <strong><?php esc_html_e( 'Apres le repas', 'virealys' ); ?></strong>
                    <p><?php esc_html_e( 'Un nouveau tampon ouvre une route differente, pour donner envie de revenir.', 'virealys' ); ?></p>
                </article>
            </div>
        </div>
        <aside class="v-page-side" aria-label="<?php esc_attr_e( 'Ambiance liee', 'virealys' ); ?>">
            <a class="v-link-card" href="<?php echo esc_url( home_url( '/#pays-du-mois' ) ); ?>">
                <strong><?php esc_html_e( 'Pays du mois', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'La destination donne le theme, pas une image generique.', 'virealys' ); ?></span>
            </a>
            <a class="v-link-card" href="<?php echo esc_url( home_url( '/voyage-game/' ) ); ?>">
                <strong><?php esc_html_e( 'Quete associee', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'Le bateau prepare les ingredients et les souvenirs a chercher en salle.', 'virealys' ); ?></span>
            </a>
            <a class="v-link-card" href="<?php echo esc_url( $reservation ); ?>">
                <strong><?php esc_html_e( 'Reserver cette ambiance', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'Choisissez la zone et liez le passeport a la reservation.', 'virealys' ); ?></span>
            </a>
        </aside>
    </div>
</section>

<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title"><?php echo esc_html( get_theme_mod( 'cta_title', 'Tentez l experience' ) ); ?></h2>
            <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cta_subtitle', 'Reservez votre table et laissez-vous transporter.' ) ); ?></p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Reserver</a>
        </div>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>

<?php get_footer(); ?>
