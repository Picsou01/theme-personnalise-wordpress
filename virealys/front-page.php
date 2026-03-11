<?php
/**
 * Front page template
 */
get_header();

$hero_title    = get_theme_mod( 'hero_title', 'Voyagez sans quitter votre table' );
$hero_subtitle = get_theme_mod( 'hero_subtitle', 'Le premier restaurant Slow Food immersif & évolutif' );
$hero_bg       = get_theme_mod( 'hero_bg', '' );
?>

<!-- HERO -->
<section class="hero" id="hero" <?php if ( $hero_bg ) : ?>style="--hero-bg: url(<?php echo esc_url( $hero_bg ); ?>)"<?php endif; ?>>
    <div class="hero-particles" id="hero-particles"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <p class="hero-eyebrow" data-reveal>Slow Food Immersif</p>
        <h1 class="hero-title" data-reveal>
            <?php echo esc_html( $hero_title ); ?>
        </h1>
        <p class="hero-subtitle" data-reveal>
            <?php echo esc_html( $hero_subtitle ); ?>
        </p>
        <div class="hero-actions" data-reveal>
            <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-glow btn-lg">
                Réserver une expérience
            </a>
            <a href="#concept" class="btn btn-ghost btn-lg">
                Découvrir
            </a>
        </div>
    </div>
    <div class="hero-scroll">
        <span>Scroll</span>
        <div class="scroll-line"></div>
    </div>
</section>

<!-- CONCEPT -->
<section class="section section-concept" id="concept">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Le Concept</span>
            <h2 class="section-title">Une cuisine d'exception<br>dans un monde immersif</h2>
            <p class="section-desc">Virealys réinvente l'art de la table en fusionnant gastronomie slow food et technologie immersive. Chaque salle vous transporte dans un pays, chaque plat raconte une histoire.</p>
        </div>
        <div class="concept-grid">
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3>Salles Évolutives</h3>
                <p>Chaque mois, un pays change totalement. Décor, musique, parfums d'ambiance, tenue du personnel.</p>
            </div>
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3>Hologrammes & VR</h3>
                <p>Des décors holographiques dynamiques et une option VR pour manger dans l'environnement réel de votre plat.</p>
            </div>
            <div class="concept-card" data-reveal>
                <div class="concept-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h3>Modulable</h3>
                <p>Classique, Immersif, Gastronomique ou Sensoriel : vous choisissez votre niveau d'expérience.</p>
            </div>
        </div>
    </div>
</section>

<!-- EXPERIENCE / 4 ZONES -->
<section class="section section-zones" id="zones">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Les 4 Zones</span>
            <h2 class="section-title">Choisissez votre voyage</h2>
        </div>
        <div class="zones-grid">
            <div class="zone-card" data-reveal data-zone="origine">
                <div class="zone-number">01</div>
                <div class="zone-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 class="zone-title">Zone Origine</h3>
                <p class="zone-desc">Ambiance naturelle, slow food pur, produits locaux. L'authenticité dans sa forme la plus belle.</p>
                <span class="zone-tag">Slow Food</span>
            </div>
            <div class="zone-card" data-reveal data-zone="voyage">
                <div class="zone-number">02</div>
                <div class="zone-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3 class="zone-title">Zone Voyage</h3>
                <p class="zone-desc">Décor holographique dynamique : marché japonais, terrasse italienne, désert marocain.</p>
                <span class="zone-tag">Holographique</span>
            </div>
            <div class="zone-card" data-reveal data-zone="immersion">
                <div class="zone-number">03</div>
                <div class="zone-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M7 7V5a5 5 0 0 1 10 0v2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                </div>
                <h3 class="zone-title">Zone Immersion Totale</h3>
                <p class="zone-desc">Casque VR + son spatialisé. Savourez des sushis face au Mont Fuji.</p>
                <span class="zone-tag">Réalité Virtuelle</span>
            </div>
            <div class="zone-card" data-reveal data-zone="sensoriel">
                <div class="zone-number">04</div>
                <div class="zone-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <h3 class="zone-title">Zone Sensorielle</h3>
                <p class="zone-desc">Exploration : illusion gustative, jeux sensoriels, textures. Une aventure pour tous les sens.</p>
                <span class="zone-tag">Expérimental</span>
            </div>
        </div>
    </div>
</section>

<!-- MENUS -->
<section class="section section-menus" id="menus">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Nos Formules</span>
            <h2 class="section-title">L'expérience à votre mesure</h2>
        </div>
        <div class="menus-grid">
            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                </div>
                <h3>Menu Classique</h3>
                <p class="menu-price">35&euro;</p>
                <ul class="menu-features">
                    <li>Zone Origine</li>
                    <li>3 plats slow food</li>
                    <li>Produits locaux & de saison</li>
                    <li>Ambiance naturelle</li>
                </ul>
                <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-outline">Réserver</a>
            </div>

            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                </div>
                <h3>Menu Gastronomique</h3>
                <p class="menu-price">50&euro;</p>
                <ul class="menu-features">
                    <li>Zone Voyage</li>
                    <li>5 plats créatifs</li>
                    <li>Décors holographiques</li>
                    <li>Accord mets & vins</li>
                </ul>
                <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-outline">Réserver</a>
            </div>

            <div class="menu-card menu-card-featured" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-badge">Populaire</div>
                <div class="menu-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h3>Menu Semi-Étoilé</h3>
                <p class="menu-price">75&euro;</p>
                <ul class="menu-features">
                    <li>Zone Immersion Totale</li>
                    <li>7 plats signature</li>
                    <li>Expérience VR incluse</li>
                    <li>Sommelier dédié</li>
                </ul>
                <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-glow">Réserver</a>
            </div>

            <div class="menu-card" data-reveal>
                <div class="menu-card-glow"></div>
                <div class="menu-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>
                </div>
                <h3>Haute Gastronomie Immersive</h3>
                <p class="menu-price">120&euro;</p>
                <ul class="menu-features">
                    <li>Toutes les zones</li>
                    <li>9 plats d'exception</li>
                    <li>Expérience sensorielle complète</li>
                    <li>Passeport VIP offert</li>
                </ul>
                <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-outline">Réserver</a>
            </div>
        </div>
    </div>
</section>

<!-- PASSEPORT -->
<section class="section section-passport" id="passeport">
    <div class="container">
        <div class="passport-layout">
            <div class="passport-content" data-reveal>
                <span class="section-label">Fidélité</span>
                <h2 class="section-title">Le Passeport Virealys</h2>
                <p>À l'entrée, recevez votre passeport numérique. À chaque pays exploré :</p>
                <ul class="passport-perks">
                    <li>
                        <span class="perk-icon">&#10043;</span>
                        <span>Tampon digital pour chaque destination</span>
                    </li>
                    <li>
                        <span class="perk-icon">&#10043;</span>
                        <span>Bonus d'expérience cumulables</span>
                    </li>
                    <li>
                        <span class="perk-icon">&#10043;</span>
                        <span>Accès à des plats cachés exclusifs</span>
                    </li>
                    <li>
                        <span class="perk-icon">&#10043;</span>
                        <span>Invitations aux soirées spéciales</span>
                    </li>
                </ul>
                <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-glow">Obtenir mon passeport</a>
            </div>
            <div class="passport-visual" data-reveal>
                <div class="passport-card">
                    <div class="passport-card-inner">
                        <div class="passport-header">PASSEPORT</div>
                        <div class="passport-logo">VIREALYS</div>
                        <div class="passport-stamps">
                            <span class="stamp stamp-active" title="Japon">&#127471;&#127477;</span>
                            <span class="stamp stamp-active" title="Italie">&#127470;&#127481;</span>
                            <span class="stamp stamp-active" title="Maroc">&#127474;&#127462;</span>
                            <span class="stamp" title="France">&#127467;&#127479;</span>
                            <span class="stamp" title="Mexique">&#127474;&#127485;</span>
                            <span class="stamp" title="Inde">&#127470;&#127475;</span>
                        </div>
                        <div class="passport-level">Niveau : Explorateur</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AMBIANCE / GALLERY TEASER -->
<section class="section section-ambiance" id="experience">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">L'Ambiance</span>
            <h2 class="section-title">Un restaurant qui ne devient jamais répétitif</h2>
            <p class="section-desc">Lumière tamisée, design futuriste mais chaleureux. Un mélange unique de bois naturel et de technologie invisible.</p>
        </div>
        <div class="ambiance-features">
            <div class="ambiance-feature" data-reveal>
                <div class="ambiance-number">01</div>
                <h3>Chaque mois, un nouveau pays</h3>
                <p>Décor, musique, parfums d'ambiance et tenues du personnel changent complètement.</p>
            </div>
            <div class="ambiance-feature" data-reveal>
                <div class="ambiance-number">02</div>
                <h3>Technologie invisible</h3>
                <p>La tech sublime l'expérience sans jamais s'imposer. Tout est au service de vos sens.</p>
            </div>
            <div class="ambiance-feature" data-reveal>
                <div class="ambiance-number">03</div>
                <h3>Nourriture réelle, toujours</h3>
                <p>La qualité des produits reste notre priorité absolue. Le virtuel complète, ne remplace jamais.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA RESERVATION -->
<section class="section section-cta" id="reservation">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Prêt pour le voyage ?</h2>
            <p class="section-desc">Réservez votre table et choisissez votre niveau d'immersion.</p>
            <div class="cta-actions">
                <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#' ) ); ?>" class="btn btn-glow btn-lg">Réserver maintenant</a>
                <?php if ( get_theme_mod( 'phone_number' ) ) : ?>
                    <a href="tel:<?php echo esc_attr( get_theme_mod( 'phone_number' ) ); ?>" class="btn btn-ghost btn-lg">
                        <?php echo esc_html( get_theme_mod( 'phone_number' ) ); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
