<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Virealys - Le premier restaurant Slow Food immersif & évolutif. Voyagez sans quitter votre table.">
    <meta name="theme-color" content="#06060f">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
    <div class="header-inner">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo" aria-label="<?php bloginfo( 'name' ); ?>">
            <?php if ( has_custom_logo() ) : ?>
                <?php
                $custom_logo_id = get_theme_mod( 'custom_logo' );
                $logo_url = wp_get_attachment_image_url( $custom_logo_id, 'full' );
                ?>
                <img src="<?php echo esc_url( $logo_url ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="header-logo-img">
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

        <div class="header-actions">
            <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="btn btn-glow btn-sm header-cta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Réserver
            </a>
        </div>

        <button class="nav-toggle" id="nav-toggle" aria-label="<?php esc_attr_e( 'Menu', 'virealys' ); ?>" aria-expanded="false">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
    </div>
</header>

<main class="site-main">
