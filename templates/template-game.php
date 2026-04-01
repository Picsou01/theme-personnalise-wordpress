<?php
/**
 * Template Name: Le Voyage (Jeu)
 * Description: Jeu immersif interactif — Vivez votre soiree chez Virealys
 */
get_header();
$reservation = get_theme_mod( 'reservation_url', '#reservation' );
?>

<section class="page-hero game-hero">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <div class="page-hero-content" data-reveal>
            <h1 class="page-hero-title">Le Voyage de Virealys</h1>
            <p class="page-hero-desc">Vivez votre premi&egrave;re soir&eacute;e dans le restaurant immersif le plus r&eacute;volutionnaire.</p>
        </div>
    </div>
</section>

<section class="section game-section">
    <div class="container">
        <div id="vr-game" class="vr-game" role="application" aria-label="Le Voyage de Virealys">
            <!-- Scene display -->
            <div class="game-scene" id="game-scene">
                <div class="game-scene-bg" id="game-scene-bg"></div>
                <div class="game-holo-grid"></div>
                <div class="game-scene-emoji" id="game-scene-emoji"></div>
            </div>

            <!-- Chapter & progress -->
            <div class="game-hud" id="game-hud">
                <div class="game-chapter" id="game-chapter"></div>
                <div class="game-xp" id="game-xp">0 XP</div>
                <div class="game-progress-bar"><div class="game-progress-fill" id="game-progress-fill"></div></div>
            </div>

            <!-- Dialogue -->
            <div class="game-dialogue" id="game-dialogue">
                <div class="game-speaker" id="game-speaker"></div>
                <div class="game-text" id="game-text"></div>
                <div class="game-tap-hint" id="game-tap-hint"></div>
            </div>

            <!-- Choices -->
            <div class="game-choices" id="game-choices"></div>

            <!-- Challenge (quiz/timer) -->
            <div class="game-challenge" id="game-challenge" style="display:none">
                <div class="game-challenge-question" id="game-challenge-q"></div>
                <div class="game-challenge-timer" id="game-challenge-timer"></div>
                <div class="game-challenge-options" id="game-challenge-opts"></div>
            </div>

            <!-- CTA banner (appears contextually) -->
            <div class="game-cta" id="game-cta" style="display:none">
                <p class="game-cta-text" id="game-cta-text"></p>
                <a href="<?php echo esc_url( $reservation ); ?>" class="btn btn-glow btn-sm game-cta-btn">R&eacute;server</a>
            </div>

            <!-- Passport -->
            <div class="game-passport" id="game-passport">
                <div class="game-passport-title">Passeport</div>
                <div class="game-stamps" id="game-stamps"></div>
            </div>

            <!-- Controls -->
            <div class="game-controls">
                <button class="btn btn-ghost btn-sm game-btn-save" id="game-btn-save">Sauvegarder</button>
                <button class="btn btn-ghost btn-sm game-btn-reset" id="game-btn-reset">Recommencer</button>
            </div>

            <!-- Time-aware banner -->
            <div class="game-time-banner" id="game-time-banner" style="display:none"></div>
        </div>

        <!-- SEO: All game content as crawlable HTML -->
        <article class="game-seo-content">
            <h2>Le Voyage de Virealys &mdash; Aventure Interactive</h2>

            <section>
                <h3>Acte 1 : L'Arriv&eacute;e</h3>
                <p>Vous arrivez devant Virealys. La fa&ccedil;ade s'illumine de reflets holographiques dans la nuit. Le premier restaurant Slow Food immersif vous attend. Un h&ocirc;te &eacute;l&eacute;gant vous accueille et vous guide vers quatre zones d'immersion uniques : Origine, Voyage, Immersion et Sensoriel. Chaque zone offre un niveau diff&eacute;rent d'exp&eacute;rience gastronomique et sensorielle.</p>
            </section>

            <section>
                <h3>Acte 2 : L'Installation</h3>
                <p>Votre table vous attend. L'&eacute;clairage s'adapte, les projections holographiques 270&deg; s'activent autour de vous. Quatre ambiances saisonni&egrave;res transforment l'espace : la For&ecirc;t Enchant&eacute;e au printemps, l'Oc&eacute;an Profond en &eacute;t&eacute;, l'Aurore Bor&eacute;ale en automne, et le Cosmos en hiver. Vous d&eacute;couvrez le menu : quatre formules de la Classique &agrave; la Sensorielle, avec des accords mets-vins s&eacute;lectionn&eacute;s par notre sommelier.</p>
            </section>

            <section>
                <h3>Acte 3 : L'Exp&eacute;rience</h3>
                <p>Les plats arrivent dans un ballet sensoriel. Chaque service est accompagn&eacute; d'une transformation de l'ambiance : projections, sons, parfums. Le restaurant Virealys utilise des technologies de projection mapping, de son spatial et d'&eacute;clairage adaptatif pour cr&eacute;er une exp&eacute;rience gastronomique in&eacute;dite. Les ingr&eacute;dients sont locaux, les producteurs sont nos voisins, et chaque plat raconte une histoire Slow Food.</p>
            </section>

            <section>
                <h3>Acte 4 : Le D&eacute;part</h3>
                <p>Votre passeport Virealys re&ccedil;oit un nouveau tampon. Vous avez d&eacute;couvert une ambiance, une zone, un menu. Mais il reste tant &agrave; explorer : 16 combinaisons possibles, des &eacute;v&eacute;nements sp&eacute;ciaux, des salles secr&egrave;tes accessibles uniquement aux d&eacute;tenteurs de badges. R&eacute;servez votre table pour vivre cette exp&eacute;rience en vrai.</p>
            </section>

            <section>
                <h3>&Agrave; propos de Virealys</h3>
                <p>Virealys est le premier restaurant Slow Food immersif et &eacute;volutif. Gastronomie fran&ccedil;aise locale, projections holographiques 270&deg;, 4 ambiances sensorielles qui changent chaque saison, syst&egrave;me de passeport fid&eacute;lit&eacute; avec badges et r&eacute;compenses. Une r&eacute;volution culinaire et technologique.</p>
            </section>
        </article>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>

<?php get_footer(); ?>
