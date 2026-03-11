<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Virealys - Le premier restaurant Slow Food immersif & évolutif">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
    <div class="header-inner">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo" aria-label="<?php bloginfo( 'name' ); ?>">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <span class="logo-text">VIREALYS</span>
            <?php endif; ?>
        </a>

        <nav class="main-nav" id="main-nav" aria-label="<?php esc_attr_e( 'Navigation principale', 'virealys' ); ?>">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'nav-list',
                'walker'         => new Virealys_Nav_Walker(),
                'fallback_cb'    => 'virealys_fallback_menu',
            ) );
            ?>
        </nav>

        <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-glow">
            Réserver
        </a>

        <button class="nav-toggle" id="nav-toggle" aria-label="<?php esc_attr_e( 'Menu', 'virealys' ); ?>" aria-expanded="false">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
    </div>
</header>

<main class="site-main">

<?php
function virealys_fallback_menu() {
    echo '<ul class="nav-list">';
    echo '<li><a href="#concept" class="nav-link">Concept</a></li>';
    echo '<li><a href="#experience" class="nav-link">Expérience</a></li>';
    echo '<li><a href="#menus" class="nav-link">Menus</a></li>';
    echo '<li><a href="#zones" class="nav-link">Zones</a></li>';
    echo '<li><a href="#passeport" class="nav-link">Passeport</a></li>';
    echo '<li><a href="#contact" class="nav-link">Contact</a></li>';
    echo '</ul>';
}
?>
