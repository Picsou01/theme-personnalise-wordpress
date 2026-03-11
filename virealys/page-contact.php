<?php
/**
 * Template Name: Contact & Réservation
 * Description: Page contact et réservation
 */
get_header();

$reservation = get_theme_mod( 'reservation_url', '#' );
$phone       = get_theme_mod( 'phone_number', '' );
$email       = get_theme_mod( 'email', 'contact@virealys.com' );
$address     = get_theme_mod( 'address', '' );
?>

<!-- PAGE HERO -->
<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Contact</span>
            <h1 class="page-hero-title">Réservez votre expérience</h1>
            <p class="page-hero-desc">Une question, une réservation, un événement privé ? Nous sommes là pour vous.</p>
        </div>
    </div>
</section>

<!-- CONTACT INFO -->
<section class="section">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-card" data-reveal>
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3>Réservation</h3>
                <p>Réservez en ligne 24h/24 ou par téléphone pendant nos heures d'ouverture.</p>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-sm">Réserver en ligne</a>
            </div>

            <?php if ( $phone ) : ?>
            <div class="contact-card" data-reveal>
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3>Téléphone</h3>
                <p>Du mardi au samedi, 10h - 22h</p>
                <a href="tel:<?php echo esc_attr( $phone ); ?>" class="contact-link"><?php echo esc_html( $phone ); ?></a>
            </div>
            <?php endif; ?>

            <div class="contact-card" data-reveal>
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h3>Email</h3>
                <p>Réponse sous 24h</p>
                <a href="mailto:<?php echo esc_attr( $email ); ?>" class="contact-link"><?php echo esc_html( $email ); ?></a>
            </div>

            <div class="contact-card" data-reveal>
                <div class="contact-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Événements privés</h3>
                <p>Privatisez Virealys pour vos événements d'entreprise ou célébrations.</p>
                <a href="mailto:<?php echo esc_attr( $email ); ?>?subject=Événement privé" class="contact-link">Demander un devis</a>
            </div>
        </div>
    </div>
</section>

<!-- HORAIRES & INFOS -->
<section class="section section-dark">
    <div class="container">
        <div class="info-grid">
            <div class="info-block" data-reveal>
                <h3>Horaires d'ouverture</h3>
                <div class="hours-list">
                    <div class="hours-row">
                        <span>Lundi</span>
                        <span class="hours-closed">Fermé</span>
                    </div>
                    <div class="hours-row">
                        <span>Mardi - Samedi</span>
                        <span>19h00 - 23h00</span>
                    </div>
                    <div class="hours-row">
                        <span>Dimanche</span>
                        <span>12h00 - 14h30</span>
                    </div>
                </div>
            </div>
            <div class="info-block" data-reveal>
                <h3>Informations pratiques</h3>
                <ul class="info-list">
                    <?php if ( $address ) : ?>
                        <li><?php echo esc_html( $address ); ?></li>
                    <?php endif; ?>
                    <li>Réservation recommandée (surtout le week-end)</li>
                    <li>Accessible PMR</li>
                    <li>Parking à proximité</li>
                    <li>Allergènes : informez-nous lors de la réservation</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
