<?php
/**
 * Template Name: Contact & R&eacute;servation
 * Description: Page contact et r&eacute;servation
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#' );
$phone       = get_theme_mod( 'phone_number', '' );
$email       = get_theme_mod( 'email', 'contact@virealys.com' );
$address     = get_theme_mod( 'address', '' );
?>

<section class="v-page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container v-page-hero-grid">
        <div data-reveal>
            <span class="section-label"><?php esc_html_e( 'Reservation augmentee', 'virealys' ); ?></span>
            <h1 class="v-page-title"><?php the_title(); ?></h1>
            <?php if ( has_excerpt() ) : ?>
                <p class="v-page-desc"><?php echo esc_html( get_the_excerpt() ); ?></p>
            <?php endif; ?>
        </div>
        <div class="v-page-mini-map" data-reveal aria-hidden="true">
            <span class="v-mini-star">Zone</span>
            <span class="v-mini-star">Date</span>
            <span class="v-mini-star">Visa</span>
            <span class="v-mini-star">Bonus</span>
        </div>
    </div>
</section>

<section class="section v-page-body">
    <div class="container">
        <div class="page-content v-page-content contact-content" data-reveal>
            <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
        </div>

        <div class="contact-info-grid" data-reveal>
            <?php if ( $phone ) : ?>
            <div class="contact-card">
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3>Telephone</h3>
                <a href="tel:<?php echo esc_attr( $phone ); ?>" class="contact-link"><?php echo esc_html( $phone ); ?></a>
            </div>
            <?php endif; ?>

            <div class="contact-card">
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h3>Email</h3>
                <a href="mailto:<?php echo esc_attr( $email ); ?>" class="contact-link"><?php echo esc_html( $email ); ?></a>
            </div>

            <?php if ( $address ) : ?>
            <div class="contact-card">
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3>Adresse</h3>
                <p class="contact-link"><?php echo esc_html( $address ); ?></p>
            </div>
            <?php endif; ?>

            <div class="contact-card">
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3>Reservation</h3>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-sm">Reserver en ligne</a>
            </div>
        </div>

        <div class="v-template-grid" data-reveal>
            <article class="v-template-card">
                <strong><?php esc_html_e( 'Champ indispensable', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Le formulaire doit demander zone, pays du mois, allergies et code passeport.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card">
                <strong><?php esc_html_e( 'Validation en salle', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'L equipe scanne le code et choisit la recompense eligible avant le dessert ou le cocktail.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card">
                <strong><?php esc_html_e( 'Retour client', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Apres la visite, le passeport gagne un nouveau visa et propose une route differente.', 'virealys' ); ?></p>
            </article>
        </div>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>

<?php get_footer(); ?>
