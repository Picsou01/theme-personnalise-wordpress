<?php
/**
 * Template Name: Le Voyage (Jeu)
 * Description: Aventure interactive — Explorez Virealys
 */
get_header();
?>

<section class="section game-section">
    <div class="container">
        <div id="vr-game" class="vr-game" role="application" aria-label="Le Voyage de Virealys">
            <p>Chargement de l'aventure...</p>
        </div>

        <article class="game-seo-content">
            <h2>Le Voyage de Virealys &mdash; Aventure Interactive</h2>
            <section>
                <h3>Explorez le restaurant immersif</h3>
                <p>Virealys est le premier restaurant Slow Food immersif et &eacute;volutif. Explorez ses salles, rencontrez le Chef, le Sommelier, d&eacute;couvrez les 4 zones d'immersion et collectez votre passeport.</p>
            </section>
            <section>
                <h3>Les 4 Zones d'immersion</h3>
                <p>Zone Origine : gastronomie pure. Zone Voyage : projections murales et accords mets-vins. Zone Immersion : projections 270&deg;. Zone Sensoriel : brume parfum&eacute;e, vibrations, exp&eacute;rience totale.</p>
            </section>
            <section>
                <h3>La Cuisine Slow Food</h3>
                <p>Produits locaux, circuits courts, respect des saisons. Chaque ingr&eacute;dient raconte une histoire. Le Chef pr&eacute;pare le filet de b&oelig;uf Wagyu, laquage miso et truffe du P&eacute;rigord.</p>
            </section>
            <section>
                <h3>Le Bar &agrave; Cocktails</h3>
                <p>Le cocktail signature "Constellation" : gin infus&eacute; au thym, tonic artisanal, z&eacute;leste de yuzu. Servi avec une brume glac&eacute;e.</p>
            </section>
        </article>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>
<?php get_footer(); ?>
