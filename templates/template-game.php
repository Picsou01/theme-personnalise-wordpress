
<?php
/**
 * Template Name: Le Voyage (Jeu)
 * Description: Aventure 2D interactive — Explorez Virealys
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#06060f">
    <title>Le Voyage de Virealys</title>
    <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:100%;height:100%;overflow:hidden;background:#06060f;font-family:'Outfit',system-ui,sans-serif}
    </style>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="vr-game" style="position:fixed;inset:0;z-index:10000;background:#06060f;overflow:hidden">
    <p style="color:#c8d6e5;text-align:center;padding-top:40vh">Chargement...</p>
</div>
<a href="<?php echo esc_url( home_url('/') ); ?>" style="position:fixed;top:1rem;left:1rem;z-index:10002;color:#00e5ff;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;background:rgba(6,6,15,.8);padding:.5rem 1rem;border-radius:100px;border:1px solid rgba(0,229,255,.2);font-family:system-ui">&larr; Retour</a>

<article style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
    <h1>Le Voyage de Virealys</h1>
    <p>Explorez le premier restaurant Slow Food immersif. 4 zones d'immersion, cuisine ouverte, bar a cocktails. Collectez votre passeport.</p>
    <h2>Zone Origine</h2><p>Gastronomie pure, produits locaux a moins de 50km.</p>
    <h2>Zone Voyage</h2><p>Projections murales, accords mets-vins.</p>
    <h2>Zone Immersion</h2><p>Projections 270 degres, son spatial.</p>
    <h2>Zone Sensoriel</h2><p>Brume parfumee, vibrations, experience totale a 120 euros.</p>
    <h2>La Cuisine</h2><p>Filet de Wagyu, laquage miso, truffe du Perigord.</p>
    <h2>Le Bar</h2><p>Cocktail Constellation : gin au thym, tonic artisanal, yuzu.</p>
</article>

<?php wp_footer(); ?>
</body>
</html>
