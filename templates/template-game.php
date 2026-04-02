<?php
/**
 * Template Name: Le Voyage (Jeu)
 * Description: Aventure 2D interactive — Explorez Virealys
 */
wp_head();
wp_body_open();
?>
<div id="vr-game" class="vr-game-fullscreen">
    <p style="color:#c8d6e5;text-align:center;padding:2rem">Chargement...</p>
</div>
<a href="<?php echo esc_url( home_url('/') ); ?>" class="vr-game-back" title="Retour">&larr; Retour</a>

<article class="game-seo-content">
    <h1>Le Voyage de Virealys — Aventure Interactive</h1>
    <p>Explorez le premier restaurant Slow Food immersif. D&eacute;couvrez les 4 zones d'immersion, rencontrez le Chef, le Sommelier, visitez la cuisine et le bar. Collectez vos tampons passeport.</p>
    <h2>Zone Origine</h2><p>Gastronomie pure, lumi&egrave;re tamis&eacute;e, produits locaux &agrave; moins de 50km.</p>
    <h2>Zone Voyage</h2><p>Projections murales, accords mets-vins, &eacute;vasion sensorielle.</p>
    <h2>Zone Immersion</h2><p>Projections 270&deg;, son spatial, ambiances saisonni&egrave;res.</p>
    <h2>Zone Sensoriel</h2><p>Brume parfum&eacute;e, vibrations, exp&eacute;rience totale &agrave; 120&euro;.</p>
    <h2>La Cuisine</h2><p>Filet de Wagyu, laquage miso, truffe du P&eacute;rigord. Slow Food local et saisonnier.</p>
    <h2>Le Bar</h2><p>Cocktail Constellation : gin au thym, tonic artisanal, yuzu, brume glac&eacute;e.</p>
</article>
<?php wp_footer(); ?>
