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

<!-- Floating Logo -->
<div class="floating-logo" id="floating-logo">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php bloginfo( 'name' ); ?>">
        <?php if ( has_custom_logo() ) : ?>
            <?php
            $custom_logo_id = get_theme_mod( 'custom_logo' );
            $logo_url = wp_get_attachment_image_url( $custom_logo_id, 'full' );
            ?>
            <img src="<?php echo esc_url( $logo_url ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="floating-logo-img">
        <?php else : ?>
            <span class="logo-text">VIREALYS</span>
        <?php endif; ?>
    </a>
</div>

<!-- Predictive Adaptive Dock -->
<nav class="vr-dock" id="vr-dock" aria-label="<?php esc_attr_e( 'Navigation adaptative', 'virealys' ); ?>">
    <div class="vr-dock-track" id="vr-dock-track">
        <?php
        $dock_items = array(
            'concept'    => array( 'label' => 'Concept', 'icon' => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/></svg>' ),
            'ambiances'  => array( 'label' => 'Ambiances', 'icon' => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>' ),
            'menus'      => array( 'label' => 'Menus', 'icon' => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20"/></svg>' ),
            'zones'      => array( 'label' => 'Zones', 'icon' => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="3"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>' ),
            'passeport'  => array( 'label' => 'Passeport', 'icon' => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' ),
        );
        foreach ( $dock_items as $slug => $item ) :
            $page = get_page_by_path( $slug );
            $url  = $page ? get_permalink( $page ) : home_url( '/#' . $slug );
        ?>
            <a href="<?php echo esc_url( $url ); ?>" class="vr-dock-btn" data-section="<?php echo esc_attr( $slug ); ?>" data-priority="0">
                <span class="vr-dock-btn-icon"><?php echo $item['icon']; ?></span>
                <span class="vr-dock-btn-label"><?php echo esc_html( $item['label'] ); ?></span>
            </a>
        <?php endforeach; ?>
        <a href="<?php echo esc_url( get_theme_mod( 'reservation_url', '#reservation' ) ); ?>" class="vr-dock-btn vr-dock-btn-cta" data-section="reservation" data-priority="0">
            <span class="vr-dock-btn-label">R&eacute;server</span>
        </a>
        <button class="vr-dock-btn vr-dock-btn-menu" id="nav-dock-menu-btn" aria-label="<?php esc_attr_e( 'Menu', 'virealys' ); ?>" aria-expanded="false">
            <span class="dock-menu-icon"><span></span><span></span></span>
        </button>
    </div>
    <div class="vr-dock-progress" id="vr-dock-progress"></div>
</nav>

<!-- Panel Navigation Dots (front page) -->
<?php if ( is_front_page() ) : ?>
<div class="vr-panel-nav" id="vr-panel-nav" aria-label="Sections"></div>
<!-- Edge Navigation Indicators (all 4 directions) -->
<div class="vr-edge vr-edge-top" id="vr-edge-top"></div>
<div class="vr-edge vr-edge-bottom" id="vr-edge-bottom"></div>
<div class="vr-edge vr-edge-left" id="vr-edge-left"></div>
<div class="vr-edge vr-edge-right" id="vr-edge-right"></div>
<?php endif; ?>

<!-- Full Screen Menu Overlay -->
<div class="menu-overlay" id="menu-overlay" aria-hidden="true">
    <button class="menu-overlay-close" id="menu-overlay-close" aria-label="<?php esc_attr_e( 'Fermer le menu', 'virealys' ); ?>">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    </button>
    <div class="menu-overlay-inner">
        <div class="menu-overlay-nav">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'overlay-nav-list',
                'walker'         => new Virealys_Nav_Walker(),
                'fallback_cb'    => 'virealys_overlay_fallback_menu',
            ) );
            ?>
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
                    <a href="<?php echo esc_url( $url ); ?>" class="overlay-social-link" aria-label="<?php echo esc_attr( ucfirst( $network ) ); ?>" target="_blank" rel="noopener">
                        <?php echo $icon; ?>
                    </a>
                <?php endif; endforeach; ?>
            </div>
        </div>
    </div>
</div>

<main class="site-main">
