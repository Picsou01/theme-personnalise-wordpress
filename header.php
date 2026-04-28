<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#06060f">
    <meta name="color-scheme" content="dark">
    <meta name="format-detection" content="telephone=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <?php // v9.0 — Crawler-specific meta tags ?>
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="<?php echo esc_url( is_front_page() ? home_url( '/' ) : get_permalink() ); ?>">
    <?php if ( is_front_page() ) : ?>
    <meta name="google-site-verification" content="">
    <?php endif; ?>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="v-site-nav" id="v-site-nav">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="v-site-brand" aria-label="<?php bloginfo( 'name' ); ?>">
        <?php if ( has_custom_logo() ) : ?>
            <?php
            $custom_logo_id = get_theme_mod( 'custom_logo' );
            $logo_url = wp_get_attachment_image_url( $custom_logo_id, 'thumbnail' );
            ?>
            <img src="<?php echo esc_url( $logo_url ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="floating-logo-img" width="120" height="24" loading="eager" fetchpriority="high">
        <?php else : ?>
            <span class="logo-text">VIREALYS</span>
        <?php endif; ?>
    </a>
    <nav class="v-site-nav-links" aria-label="<?php esc_attr_e( 'Navigation rapide', 'virealys' ); ?>">
        <a href="<?php echo esc_url( home_url( '/#zones' ) ); ?>"><?php esc_html_e( 'Zones', 'virealys' ); ?></a>
        <a href="<?php echo esc_url( home_url( '/#passeport' ) ); ?>"><?php esc_html_e( 'Passeport', 'virealys' ); ?></a>
        <a href="<?php echo esc_url( home_url( '/#menus' ) ); ?>"><?php esc_html_e( 'Menus', 'virealys' ); ?></a>
    </nav>
    <div class="v-site-actions">
        <a href="<?php echo esc_url( home_url( '/#reservation' ) ); ?>" class="v-nav-cta"><?php esc_html_e( 'Reserver', 'virealys' ); ?></a>
        <button class="v-menu-button" id="nav-dock-menu-btn" type="button" aria-label="<?php esc_attr_e( 'Ouvrir le menu', 'virealys' ); ?>" aria-controls="menu-overlay" aria-expanded="false">
            <span class="dock-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
    </div>
</header>

<!-- Full Screen Menu Overlay -->
<div class="menu-overlay" id="menu-overlay" aria-hidden="true">
    <button class="menu-overlay-close" id="menu-overlay-close" aria-label="<?php esc_attr_e( 'Fermer le menu', 'virealys' ); ?>">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="menu-overlay-inner">
        <div class="menu-overlay-nav">
            <?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'overlay-nav-list', 'walker' => new Virealys_Nav_Walker(), 'fallback_cb' => 'virealys_overlay_fallback_menu' ) ); ?>
        </div>
        <div class="menu-overlay-info">
            <?php
            $phone   = get_theme_mod( 'phone_number', '' );
            $email   = get_theme_mod( 'email', 'contact@virealys.com' );
            $address = get_theme_mod( 'address', '' );
            ?>
            <?php if ( $phone ) : ?>
                <a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', $phone ) ); ?>" class="overlay-contact-link"><?php echo esc_html( $phone ); ?></a>
            <?php endif; ?>
            <?php if ( $email ) : ?>
                <a href="mailto:<?php echo esc_attr( $email ); ?>" class="overlay-contact-link"><?php echo esc_html( $email ); ?></a>
            <?php endif; ?>
            <?php if ( $address ) : ?>
                <p class="overlay-address"><?php echo esc_html( $address ); ?></p>
            <?php endif; ?>
            <div class="overlay-social">
                <?php
                $socials = array(
                    'instagram' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
                    'facebook'  => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
                    'tiktok'    => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>',
                );
                foreach ( $socials as $network => $icon ) :
                    $url = get_theme_mod( $network . '_url', '' );
                    if ( $url ) :
                ?>
                    <a href="<?php echo esc_url( $url ); ?>" class="overlay-social-link" aria-label="<?php echo esc_attr( ucfirst( $network ) ); ?>" target="_blank" rel="noopener"><?php echo $icon; ?></a>
                <?php endif; endforeach; ?>
            </div>
        </div>
    </div>
</div>

<main class="site-main">
