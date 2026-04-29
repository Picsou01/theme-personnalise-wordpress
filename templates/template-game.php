
<?php
/**
 * Template Name: Le Voyage (Jeu)
 * Description: Le Voyage des Saveurs - jeu passeport Virealys
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#06060f">
    <title>Le Voyage des Saveurs - Virealys</title>
    <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:100%;height:100%;overflow:hidden;background:#06060f;font-family:'Outfit',system-ui,sans-serif}
    </style>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="vr-game" class="vr-game-root">
    <p class="vr-game-loading">Chargement du passeport...</p>
</div>
<a href="<?php echo esc_url( home_url('/') ); ?>" class="vr-game-back">&larr; Constellation</a>

<article style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
    <h1>Le Voyage des Saveurs</h1>
    <p>Jeu interactif Virealys reliant constellation virtuelle, recettes signatures, passeport numerique et recompenses utilisables au restaurant.</p>
    <h2>Boucle de fidelite</h2><p>Le joueur collecte des ingredients, sert des commandes, gagne des visas, debloque des tampons, reserve puis valide son code en salle.</p>
    <h2>Profondeur de jeu</h2><p>Inventaire, aura, tension de service, recettes a maitriser, upgrades de brigade, equipage recrutable, astres de constellation, soirees successives et saisons donnent une progression persistante.</p>
    <h2>Zones</h2><p>Origine, Voyage, Immersion, Sensorielle et Bar deviennent des iles a explorer.</p>
</article>

<?php wp_footer(); ?>
</body>
</html>
