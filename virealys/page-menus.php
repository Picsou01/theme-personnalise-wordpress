<?php
/**
 * Template Name: Nos Menus
 * Description: Page dédiée aux formules et menus
 */
get_header();

$img_menus   = virealys_get_image( 'img_menus' );
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<!-- PAGE HERO -->
<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Les Formules</span>
            <h1 class="page-hero-title">Nos Menus</h1>
            <p class="page-hero-desc">Du dîner classique à l'immersion totale. Chaque formule est pensée pour vous offrir exactement ce que vous cherchez.</p>
        </div>
    </div>
</section>

<!-- SHOWCASE IMAGE -->
<?php if ( $img_menus ) : ?>
<section class="section" style="padding-bottom: 0;">
    <div class="container">
        <div class="fullwidth-image" data-reveal>
            <img src="<?php echo esc_url( $img_menus ); ?>" alt="Nos 4 formules holographiques" loading="lazy">
            <div class="showcase-glow"></div>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- MENU DÉTAILLÉ -->
<section class="section section-menus">
    <div class="container">
        <div class="menus-grid menus-grid-detailed">
            <!-- CLASSIQUE -->
            <div class="menu-card-detailed" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-card-header">
                    <div class="menu-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg>
                    </div>
                    <h3>Menu Classique</h3>
                    <p class="menu-price">35&euro;<span>/personne</span></p>
                </div>
                <div class="menu-card-body">
                    <p class="menu-zone-tag"><span class="zone-dot zone-dot-green"></span> Zone Origine</p>
                    <div class="menu-course">
                        <span class="course-label">Entrée</span>
                        <p>Velouté de saison aux herbes du jardin</p>
                    </div>
                    <div class="menu-course">
                        <span class="course-label">Plat</span>
                        <p>Pièce du boucher, légumes rôtis, jus corsé</p>
                    </div>
                    <div class="menu-course">
                        <span class="course-label">Dessert</span>
                        <p>Tarte fine aux fruits de saison</p>
                    </div>
                    <ul class="menu-includes">
                        <li>Produits 100% locaux & de saison</li>
                        <li>Ambiance naturelle et chaleureuse</li>
                        <li>Pain artisanal & amuse-bouche offerts</li>
                    </ul>
                </div>
                <div class="menu-card-footer">
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver cette formule</a>
                </div>
            </div>

            <!-- GASTRONOMIQUE -->
            <div class="menu-card-detailed" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-card-header">
                    <div class="menu-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                    </div>
                    <h3>Menu Gastronomique</h3>
                    <p class="menu-price">50&euro;<span>/personne</span></p>
                </div>
                <div class="menu-card-body">
                    <p class="menu-zone-tag"><span class="zone-dot zone-dot-blue"></span> Zone Voyage</p>
                    <div class="menu-course">
                        <span class="course-label">Amuse-bouche</span>
                        <p>Trilogie du pays du mois</p>
                    </div>
                    <div class="menu-course">
                        <span class="course-label">Entrée</span>
                        <p>Création du chef inspirée du voyage</p>
                    </div>
                    <div class="menu-course">
                        <span class="course-label">Poisson</span>
                        <p>Selon arrivage, cuisson basse température</p>
                    </div>
                    <div class="menu-course">
                        <span class="course-label">Plat</span>
                        <p>Pièce noble, garniture du terroir revisitée</p>
                    </div>
                    <div class="menu-course">
                        <span class="course-label">Dessert</span>
                        <p>Création sucrée du pays</p>
                    </div>
                    <ul class="menu-includes">
                        <li>Décors holographiques dynamiques</li>
                        <li>Accord mets & vins (3 verres)</li>
                        <li>Musique & parfums d'ambiance du pays</li>
                    </ul>
                </div>
                <div class="menu-card-footer">
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver cette formule</a>
                </div>
            </div>

            <!-- SEMI-ÉTOILÉ -->
            <div class="menu-card-detailed menu-card-featured" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-badge">Populaire</div>
                <div class="menu-card-header">
                    <div class="menu-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <h3>Menu Semi-Étoilé</h3>
                    <p class="menu-price">75&euro;<span>/personne</span></p>
                </div>
                <div class="menu-card-body">
                    <p class="menu-zone-tag"><span class="zone-dot zone-dot-purple"></span> Zone Immersion Totale</p>
                    <div class="menu-course">
                        <span class="course-label">7 plats signature</span>
                        <p>Menu surprise du chef, adapté au pays du mois. Chaque plat est accompagné de son ambiance VR dédiée.</p>
                    </div>
                    <ul class="menu-includes">
                        <li>Casque VR + son spatialisé inclus</li>
                        <li>Sommelier dédié à votre table</li>
                        <li>Accord mets & vins premium (5 verres)</li>
                        <li>Hologramme traçabilité sur chaque plat</li>
                        <li>Tampon Passeport Virealys</li>
                    </ul>
                </div>
                <div class="menu-card-footer">
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow">Réserver cette formule</a>
                </div>
            </div>

            <!-- HAUTE GASTRONOMIE -->
            <div class="menu-card-detailed" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-card-header">
                    <div class="menu-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                    </div>
                    <h3>Haute Gastronomie Immersive</h3>
                    <p class="menu-price">120&euro;<span>/personne</span></p>
                </div>
                <div class="menu-card-body">
                    <p class="menu-zone-tag"><span class="zone-dot zone-dot-pink"></span> Toutes les Zones</p>
                    <div class="menu-course">
                        <span class="course-label">9 plats d'exception</span>
                        <p>Le chef déploie toute sa créativité dans un parcours sensoriel complet. Vous traversez les 4 zones au fil des plats.</p>
                    </div>
                    <ul class="menu-includes">
                        <li>Expérience sensorielle complète (4 zones)</li>
                        <li>VR + hologrammes + illusions gustatives</li>
                        <li>Accord mets & vins grand cru</li>
                        <li>Passeport VIP offert</li>
                        <li>Accès aux plats cachés du chef</li>
                        <li>Photo souvenir holographique</li>
                    </ul>
                </div>
                <div class="menu-card-footer">
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver cette formule</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Une question sur nos formules ?</h2>
            <p class="section-desc">Notre équipe est là pour vous guider vers l'expérience qui vous correspond.</p>
            <div class="cta-actions">
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver</a>
                <?php if ( get_theme_mod( 'phone_number' ) ) : ?>
                    <a href="tel:<?php echo esc_attr( get_theme_mod( 'phone_number' ) ); ?>" class="btn btn-ghost btn-lg"><?php echo esc_html( get_theme_mod( 'phone_number' ) ); ?></a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
