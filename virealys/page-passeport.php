<?php
/**
 * Template Name: Passeport Virealys
 * Description: Page dédiée au système de fidélité Passeport
 */
get_header();

$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<!-- PAGE HERO -->
<section class="page-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <span class="section-label">Fidélité</span>
            <h1 class="page-hero-title">Le Passeport Virealys</h1>
            <p class="page-hero-desc">Votre compagnon de voyage culinaire. Collectionnez, débloquez, explorez.</p>
        </div>
    </div>
</section>

<!-- COMMENT ÇA MARCHE -->
<section class="section">
    <div class="container">
        <div class="passport-hero-layout">
            <div class="passport-hero-content" data-reveal>
                <h2 class="section-title">Voyagez, collectionnez, débloquez</h2>
                <p>Le Passeport Virealys est un programme de fidélité immersif. Pas de carte à points classique. Un vrai passeport numérique qui suit vos aventures gustatives.</p>
                <div class="passport-steps">
                    <div class="passport-step">
                        <div class="step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <div>
                            <h4>Réservez</h4>
                            <p>Votre passeport est créé dès votre première visite.</p>
                        </div>
                    </div>
                    <div class="passport-step">
                        <div class="step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                        </div>
                        <div>
                            <h4>Explorez les pays</h4>
                            <p>Chaque visite = un tampon du pays du mois.</p>
                        </div>
                    </div>
                    <div class="passport-step">
                        <div class="step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div>
                            <h4>Débloquez des bonus</h4>
                            <p>Plats cachés, soirées VIP, expériences exclusives.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="passport-hero-visual" data-reveal>
                <div class="passport-card passport-card-lg">
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
                            <span class="stamp" title="Thaïlande">&#127481;&#127469;</span>
                            <span class="stamp" title="Pérou">&#127477;&#127466;</span>
                            <span class="stamp" title="Grèce">&#127468;&#127479;</span>
                        </div>
                        <div class="passport-level">Niveau : Explorateur</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- NIVEAUX -->
<section class="section section-dark">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label">Progression</span>
            <h2 class="section-title">Les niveaux du Passeport</h2>
        </div>
        <div class="levels-grid">
            <div class="level-card" data-reveal>
                <div class="level-badge level-badge-bronze">Curieux</div>
                <p class="level-condition">1ère visite</p>
                <ul class="level-perks">
                    <li>Création du passeport</li>
                    <li>Tampon du pays du mois</li>
                    <li>Amuse-bouche de bienvenue</li>
                </ul>
            </div>
            <div class="level-card" data-reveal>
                <div class="level-badge level-badge-silver">Explorateur</div>
                <p class="level-condition">3 pays visités</p>
                <ul class="level-perks">
                    <li>Accès à 1 plat caché</li>
                    <li>-10% sur la prochaine visite</li>
                    <li>Invitation newsletter VIP</li>
                </ul>
            </div>
            <div class="level-card level-card-featured" data-reveal>
                <div class="level-badge level-badge-gold">Voyageur</div>
                <p class="level-condition">6 pays visités</p>
                <ul class="level-perks">
                    <li>Accès à tous les plats cachés</li>
                    <li>Invitation soirée pays mensuelle</li>
                    <li>Upgrade zone gratuit (1x)</li>
                    <li>Cocktail signature offert</li>
                </ul>
            </div>
            <div class="level-card" data-reveal>
                <div class="level-badge level-badge-platinum">Ambassadeur</div>
                <p class="level-condition">12 pays visités</p>
                <ul class="level-perks">
                    <li>Menu dégustation du chef offert</li>
                    <li>Accès prioritaire aux réservations</li>
                    <li>Soirée privée annuelle</li>
                    <li>Votre nom sur le mur des voyageurs</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section section-cta">
    <div class="cta-bg"></div>
    <div class="container">
        <div class="cta-content" data-reveal>
            <h2 class="section-title">Prêt à commencer le voyage ?</h2>
            <p class="section-desc">Votre passeport vous attend. Réservez votre première expérience.</p>
            <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-lg">Obtenir mon passeport</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
