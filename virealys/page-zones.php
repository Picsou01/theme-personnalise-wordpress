<?php
/**
 * Template Name: Les Zones
 * Description: Page dédiée aux 4 zones d'expérience
 */
get_header();

$img_ambiances = virealys_get_image( 'img_ambiances' );
$reservation   = get_theme_mod( 'reservation_url', '#reservation' );
?>

<!-- PAGE HERO -->
<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">L'Expérience</span>
            <h1 class="page-hero-title">Les 4 Zones</h1>
            <p class="page-hero-desc">Chaque zone offre un niveau d'immersion différent. De l'authenticité pure à l'exploration sensorielle totale.</p>
        </div>
    </div>
</section>

<!-- SHOWCASE IMAGE -->
<?php if ( $img_ambiances ) : ?>
<section class="section" style="padding-bottom: 0;">
    <div class="container">
        <div class="fullwidth-image" data-reveal>
            <img src="<?php echo esc_url( $img_ambiances ); ?>" alt="Les 4 ambiances Virealys" loading="lazy">
            <div class="showcase-glow"></div>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- ZONE 1 -->
<section class="section zone-detail-section" data-zone-color="green">
    <div class="container">
        <div class="zone-detail" data-reveal>
            <div class="zone-detail-header">
                <div class="zone-number-lg">01</div>
                <div>
                    <span class="zone-tag" style="color: #4caf50; border-color: rgba(76,175,80,0.3);">Slow Food</span>
                    <h2 class="section-title">Zone Origine</h2>
                </div>
            </div>
            <div class="zone-detail-grid">
                <div class="zone-detail-content">
                    <p>L'authenticité dans sa forme la plus belle. Pas d'écran, pas d'hologramme. Juste des produits d'exception, un éclairage tamisé chaleureux, et le savoir-faire de nos chefs.</p>
                    <ul class="zone-detail-list">
                        <li>Produits 100% locaux et de saison</li>
                        <li>Ambiance bois naturel & lumière tamisée</li>
                        <li>Cuisine ouverte sur la salle</li>
                        <li>Idéal pour une première visite</li>
                    </ul>
                    <p class="zone-detail-price">À partir de <strong>35&euro;</strong></p>
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver en Zone Origine</a>
                </div>
                <div class="zone-detail-visual">
                    <div class="zone-visual-card" style="--zone-accent: #4caf50;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ZONE 2 -->
<section class="section section-dark zone-detail-section" data-zone-color="blue">
    <div class="container">
        <div class="zone-detail" data-reveal>
            <div class="zone-detail-header">
                <div class="zone-number-lg">02</div>
                <div>
                    <span class="zone-tag" style="color: var(--neon-blue); border-color: rgba(77,124,255,0.3);">Holographique</span>
                    <h2 class="section-title">Zone Voyage</h2>
                </div>
            </div>
            <div class="zone-detail-grid">
                <div class="zone-detail-content">
                    <p>Les murs prennent vie. Vous dînez dans un marché nocturne de Tokyo, sur une terrasse face à la mer Méditerranée, ou au coeur d'un souk marocain.</p>
                    <ul class="zone-detail-list">
                        <li>Décors holographiques haute définition</li>
                        <li>Son spatialisé immersif</li>
                        <li>Parfums d'ambiance du pays</li>
                        <li>Change chaque mois</li>
                    </ul>
                    <p class="zone-detail-price">À partir de <strong>50&euro;</strong></p>
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver en Zone Voyage</a>
                </div>
                <div class="zone-detail-visual">
                    <div class="zone-visual-card" style="--zone-accent: var(--neon-blue);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ZONE 3 -->
<section class="section zone-detail-section" data-zone-color="purple">
    <div class="container">
        <div class="zone-detail" data-reveal>
            <div class="zone-detail-header">
                <div class="zone-number-lg">03</div>
                <div>
                    <span class="zone-tag" style="color: var(--neon-purple); border-color: rgba(168,85,247,0.3);">Réalité Virtuelle</span>
                    <h2 class="section-title">Zone Immersion Totale</h2>
                </div>
            </div>
            <div class="zone-detail-grid">
                <div class="zone-detail-content">
                    <p>Enfilez le casque VR et retrouvez-vous face au Mont Fuji pendant que vous savourez vos sushis. L'immersion est totale, les sens sont décuplés.</p>
                    <ul class="zone-detail-list">
                        <li>Casque VR dernière génération</li>
                        <li>Son spatialisé 360°</li>
                        <li>Environnement VR synchronisé avec le plat</li>
                        <li>Sommelier dédié</li>
                    </ul>
                    <p class="zone-detail-price">À partir de <strong>75&euro;</strong></p>
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver en Zone Immersion</a>
                </div>
                <div class="zone-detail-visual">
                    <div class="zone-visual-card" style="--zone-accent: var(--neon-purple);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M7 7V5a5 5 0 0 1 10 0v2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ZONE 4 -->
<section class="section section-dark zone-detail-section" data-zone-color="pink">
    <div class="container">
        <div class="zone-detail" data-reveal>
            <div class="zone-detail-header">
                <div class="zone-number-lg">04</div>
                <div>
                    <span class="zone-tag" style="color: var(--neon-pink); border-color: rgba(224,64,251,0.3);">Expérimental</span>
                    <h2 class="section-title">Zone Sensorielle</h2>
                </div>
            </div>
            <div class="zone-detail-grid">
                <div class="zone-detail-content">
                    <p>L'exploration ultime. Illusions gustatives, jeux sensoriels, textures surprenantes. Chaque bouchée est une découverte. Votre cerveau et vos papilles jouent ensemble.</p>
                    <ul class="zone-detail-list">
                        <li>Illusions gustatives contrôlées</li>
                        <li>Textures & températures surprenantes</li>
                        <li>VR + hologrammes + expérimental</li>
                        <li>Passeport VIP offert</li>
                    </ul>
                    <p class="zone-detail-price">À partir de <strong>120&euro;</strong></p>
                    <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-outline">Réserver en Zone Sensorielle</a>
                </div>
                <div class="zone-detail-visual">
                    <div class="zone-visual-card" style="--zone-accent: var(--neon-pink);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    </div>
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
            <h2 class="section-title">Quelle zone vous attire ?</h2>
            <p class="section-desc">Réservez et choisissez votre niveau d'immersion.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Réserver maintenant</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
