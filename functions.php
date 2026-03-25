<?php
/**
 * Virealys - Functions and definitions
 * Constellation Navigation Theme v7.0 — Performance Revolution
 */

if ( ! defined( 'VIREALYS_VERSION' ) ) {
    define( 'VIREALYS_VERSION', '7.0.0' );
}

/**
 * Theme setup
 */
function virealys_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 40,
        'width'       => 160,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );

    register_nav_menus( array(
        'primary' => __( 'Menu Principal', 'virealys' ),
        'footer'  => __( 'Menu Footer', 'virealys' ),
    ) );

    // Optimized image sizes — smaller for speed
    add_image_size( 'virealys-hero', 1280, 720, true );
    add_image_size( 'virealys-card', 400, 267, true );
    add_image_size( 'virealys-thumb', 64, 64, true );

    add_post_type_support( 'page', 'excerpt' );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'align-wide' );

    add_theme_support( 'editor-color-palette', array(
        array( 'name' => 'Neon Cyan',   'slug' => 'neon-cyan',   'color' => '#00e5ff' ),
        array( 'name' => 'Neon Blue',   'slug' => 'neon-blue',   'color' => '#4d7cff' ),
        array( 'name' => 'Neon Purple', 'slug' => 'neon-purple', 'color' => '#a855f7' ),
        array( 'name' => 'Dark BG',     'slug' => 'dark-bg',     'color' => '#06060f' ),
    ) );
}
add_action( 'after_setup_theme', 'virealys_setup' );

/**
 * =============================================
 * PERFORMANCE: Aggressive optimizations
 * =============================================
 */

// Remove ALL WordPress bloat
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'rest_output_link_wp_head' );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_resource_hints', 2 );
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'feed_links_extra', 3 );

// Disable global styles and SVG filters (huge perf hit)
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );

// Disable WP embed scripts
function virealys_disable_embeds() {
    wp_deregister_script( 'wp-embed' );
}
add_action( 'wp_footer', 'virealys_disable_embeds' );

// Remove jQuery (we don't need it)
function virealys_dequeue_jquery() {
    if ( ! is_admin() ) {
        wp_deregister_script( 'jquery' );
    }
}
add_action( 'wp_enqueue_scripts', 'virealys_dequeue_jquery', 1 );

// Disable block library CSS on front-end (saves ~40KB)
function virealys_remove_block_css() {
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'wc-blocks-style' );
    wp_dequeue_style( 'global-styles' );
    wp_dequeue_style( 'classic-theme-styles' );
}
add_action( 'wp_enqueue_scripts', 'virealys_remove_block_css', 100 );

/**
 * Preload hints + DNS prefetch for speed
 */
function virealys_resource_hints() {
    // DNS prefetch for Google Fonts
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">' . "\n";
    echo '<link rel="dns-prefetch" href="//fonts.gstatic.com">' . "\n";
    // Preconnect to Google Fonts
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    // Preload only the weights we actually use
    echo '<link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&family=Space+Grotesk:wght@600;700&display=swap" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">' . "\n";
    echo '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&family=Space+Grotesk:wght@600;700&display=swap"></noscript>' . "\n";
}
add_action( 'wp_head', 'virealys_resource_hints', 1 );

/**
 * Inline critical CSS directly in <head> to avoid render-blocking
 */
function virealys_inline_critical_css() {
    ?>
    <style id="virealys-critical">
    :root{--color-bg:#06060f;--color-bg-alt:#0a0a1a;--color-bg-card:#0e0e20;--color-surface:#12122a;--color-border:rgba(100,200,255,.08);--color-text:#c8d6e5;--color-text-muted:#7a8ba0;--color-heading:#e8f0ff;--color-white:#fff;--neon-cyan:#00e5ff;--neon-blue:#4d7cff;--neon-purple:#a855f7;--neon-pink:#e040fb;--neon-cyan-rgb:0,229,255;--neon-blue-rgb:77,124,255;--neon-purple-rgb:168,85,247;--gradient-primary:linear-gradient(135deg,var(--neon-cyan),var(--neon-blue),var(--neon-purple));--font-heading:'Space Grotesk',system-ui,sans-serif;--font-body:'Outfit',system-ui,sans-serif;--ease-out:cubic-bezier(.16,1,.3,1);--radius-sm:8px;--radius-md:12px;--radius-lg:20px}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{-webkit-font-smoothing:antialiased}
    body{font-family:var(--font-body);font-size:16px;line-height:1.7;color:var(--color-text);background:var(--color-bg);overflow-x:hidden}
    img{max-width:100%;height:auto;display:block}
    a{color:var(--neon-cyan);text-decoration:none}
    h1,h2,h3,h4,h5,h6{font-family:var(--font-heading);color:var(--color-heading);font-weight:600;line-height:1.2}
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 clamp(1.25rem,4vw,2.5rem)}
    .floating-logo{position:fixed;top:1rem;left:1.25rem;z-index:1000;background:rgba(6,6,15,.75);border:1px solid rgba(0,229,255,.1);border-radius:100px;padding:.4rem 1rem}
    .floating-logo a{display:flex;align-items:center;text-decoration:none}
    .logo-text{font-family:var(--font-heading);font-size:.875rem;font-weight:700;letter-spacing:.15em;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .vr-constellation-hub{position:relative;width:100%;height:100vh;height:100dvh;overflow:hidden;background:var(--color-bg)}
    .constellation-hero{position:absolute;top:0;left:0;right:0;z-index:2;text-align:center;padding-top:clamp(2rem,5vh,3.5rem);pointer-events:none}
    .constellation-title{font-size:clamp(1.5rem,3.5vw,2.5rem);font-weight:700;line-height:1.15;margin-bottom:.5rem;background:linear-gradient(135deg,var(--color-white),var(--color-text));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .constellation-subtitle{font-size:clamp(.8rem,1.3vw,.95rem);color:var(--color-text-muted);margin-bottom:.75rem}
    </style>
    <?php
}
add_action( 'wp_head', 'virealys_inline_critical_css', 2 );

/**
 * Enqueue scripts and styles — DEFERRED for speed
 */
function virealys_scripts() {
    // Main CSS loaded async (non-render-blocking)
    wp_enqueue_style( 'virealys-main', get_template_directory_uri() . '/assets/css/main.css', array(), VIREALYS_VERSION );

    // JS loaded deferred
    wp_enqueue_script( 'virealys-main', get_template_directory_uri() . '/assets/js/main.js', array(), VIREALYS_VERSION, true );

    wp_localize_script( 'virealys-main', 'virealys', array(
        'ajax_url'  => admin_url( 'admin-ajax.php' ),
        'nonce'     => wp_create_nonce( 'virealys_nonce' ),
        'theme_url' => get_template_directory_uri(),
        'home_url'  => home_url( '/' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'virealys_scripts' );

/**
 * Make CSS non-render-blocking by converting to preload
 */
function virealys_defer_css( $html, $handle ) {
    if ( is_admin() ) return $html;
    if ( $handle === 'virealys-main' ) {
        // Convert <link rel="stylesheet"> to preload pattern
        $html = str_replace( "rel='stylesheet'", "rel='preload' as='style' onload=\"this.onload=null;this.rel='stylesheet'\"", $html );
        $html .= '<noscript>' . str_replace( array( "rel='preload' as='style' onload=\"this.onload=null;this.rel='stylesheet'\"" ), "rel='stylesheet'", $html ) . '</noscript>';
    }
    return $html;
}
add_filter( 'style_loader_tag', 'virealys_defer_css', 10, 2 );

/**
 * Add defer to JS
 */
function virealys_defer_js( $tag, $handle ) {
    if ( is_admin() || $handle !== 'virealys-main' ) return $tag;
    return str_replace( ' src', ' defer src', $tag );
}
add_filter( 'script_loader_tag', 'virealys_defer_js', 10, 2 );

/**
 * Browser caching headers
 */
function virealys_cache_headers() {
    if ( is_admin() ) return;
    // Let browser cache static pages for 1 hour
    if ( ! is_user_logged_in() ) {
        header( 'Cache-Control: public, max-age=3600, s-maxage=86400' );
    }
}
add_action( 'send_headers', 'virealys_cache_headers' );

/**
 * =============================================
 * SEO: Comprehensive meta tags
 * =============================================
 */
function virealys_seo_meta() {
    $site_name   = get_bloginfo( 'name' );
    $description = 'Virealys — Le premier restaurant Slow Food immersif & évolutif. Gastronomie locale, projections 270°, 4 ambiances sensorielles. Voyagez sans quitter votre table.';
    $keywords    = 'restaurant immersif, slow food, gastronomie, expérience culinaire, réalité augmentée, projection mapping, restaurant Paris, dîner sensoriel, Virealys';
    $url         = get_permalink();
    $image       = get_theme_mod( 'hero_bg', get_template_directory_uri() . '/screenshot.png' );

    if ( is_single() || is_page() ) {
        $post_desc = get_the_excerpt();
        if ( $post_desc ) $description = wp_strip_all_tags( $post_desc );
        if ( has_post_thumbnail() ) $image = get_the_post_thumbnail_url( null, 'virealys-hero' );
    }

    if ( is_front_page() ) {
        $url = home_url( '/' );
        $description = get_theme_mod( 'hero_subtitle', $description );
    }
    ?>
    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php echo esc_attr( $description ); ?>">
    <meta name="keywords" content="<?php echo esc_attr( $keywords ); ?>">
    <meta name="author" content="Virealys">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="<?php echo is_front_page() ? 'website' : 'article'; ?>">
    <meta property="og:url" content="<?php echo esc_url( $url ); ?>">
    <meta property="og:title" content="<?php echo esc_attr( wp_get_document_title() ); ?>">
    <meta property="og:description" content="<?php echo esc_attr( $description ); ?>">
    <meta property="og:image" content="<?php echo esc_url( $image ); ?>">
    <meta property="og:site_name" content="<?php echo esc_attr( $site_name ); ?>">
    <meta property="og:locale" content="fr_FR">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo esc_attr( wp_get_document_title() ); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr( $description ); ?>">
    <meta name="twitter:image" content="<?php echo esc_url( $image ); ?>">

    <!-- Schema.org structured data for Restaurant -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "<?php echo esc_js( $site_name ); ?>",
        "description": "<?php echo esc_js( $description ); ?>",
        "url": "<?php echo esc_url( home_url( '/' ) ); ?>",
        "servesCuisine": ["Gastronomie française", "Slow Food", "Cuisine immersive"],
        "priceRange": "€€€",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "<?php echo esc_js( get_theme_mod( 'address', '' ) ); ?>"
        },
        "telephone": "<?php echo esc_js( get_theme_mod( 'phone_number', '' ) ); ?>",
        "email": "<?php echo esc_js( get_theme_mod( 'email', 'contact@virealys.com' ) ); ?>",
        <?php
        $hours = get_theme_mod( 'footer_hours', "Mar - Sam : 19h - 23h\nDim : 12h - 14h30\nLundi : Fermé" );
        ?>
        "openingHours": "Tu-Sa 19:00-23:00, Su 12:00-14:30",
        "image": "<?php echo esc_url( $image ); ?>",
        "acceptsReservations": true
    }
    </script>
    <?php
}
add_action( 'wp_head', 'virealys_seo_meta', 3 );

/**
 * Add page slug to body tag for JS tracking
 */
function virealys_body_open_attributes() {
    global $post;
    if ( $post && ! is_front_page() ) {
        echo '<script>document.body.setAttribute("data-page-slug","' . esc_js( $post->post_name ) . '")</script>';
    }
}
add_action( 'wp_body_open', 'virealys_body_open_attributes' );

/**
 * Custom walker for the nav menu
 */
class Virealys_Nav_Walker extends Walker_Nav_Menu {
    function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
        $class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
        $output .= '<li' . $class_names . '>';
        $atts = array( 'href' => ! empty( $item->url ) ? $item->url : '', 'class' => 'nav-link' );
        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) ) $attributes .= ' ' . $attr . '="' . esc_attr( $value ) . '"';
        }
        $item_output = ( $args->before ?? '' ) . '<a' . $attributes . '>' . ( $args->link_before ?? '' ) . apply_filters( 'the_title', $item->title, $item->ID ) . ( $args->link_after ?? '' ) . '</a>' . ( $args->after ?? '' );
        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }
}

/**
 * Nav fallbacks — cached page lookups
 */
function virealys_get_page_url( $slug ) {
    static $cache = array();
    if ( ! isset( $cache[ $slug ] ) ) {
        $page = get_page_by_path( $slug );
        $cache[ $slug ] = $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
    }
    return $cache[ $slug ];
}

function virealys_fallback_menu() {
    $pages = array( 'concept' => 'Le Concept', 'menus' => 'Nos Menus', 'zones' => 'Les Zones', 'ambiances' => 'Ambiances', 'passeport' => 'Passeport' );
    echo '<ul class="nav-list">';
    foreach ( $pages as $slug => $label ) {
        echo '<li><a href="' . esc_url( virealys_get_page_url( $slug ) ) . '" class="nav-link">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

function virealys_overlay_fallback_menu() {
    $pages = array( 'concept' => 'Le Concept', 'menus' => 'Nos Menus', 'ambiances' => 'Ambiances', 'zones' => 'Les Zones', 'passeport' => 'Passeport' );
    echo '<ul class="overlay-nav-list">';
    foreach ( $pages as $slug => $label ) {
        echo '<li><a href="' . esc_url( virealys_get_page_url( $slug ) ) . '" class="nav-link overlay-nav-link">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

function virealys_footer_fallback() {
    $links = array( 'concept' => 'Le Concept', 'menus' => 'Nos Menus', 'zones' => 'Les Zones', 'passeport' => 'Passeport', 'contact' => 'Contact' );
    echo '<ul class="footer-links">';
    foreach ( $links as $slug => $label ) {
        echo '<li><a href="' . esc_url( virealys_get_page_url( $slug ) ) . '">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

/**
 * Customizer settings
 */
function virealys_customize_register( $wp_customize ) {
    // === HERO / ACCUEIL ===
    $wp_customize->add_section( 'virealys_hero', array( 'title' => __( 'Hero / Accueil', 'virealys' ), 'priority' => 30 ) );

    $wp_customize->add_setting( 'hero_title', array( 'default' => 'Voyagez sans quitter votre table', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_title', array( 'label' => __( 'Titre principal constellation', 'virealys' ), 'section' => 'virealys_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_subtitle', array( 'default' => 'Le premier restaurant Slow Food immersif & évolutif', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_subtitle', array( 'label' => __( 'Sous-titre constellation', 'virealys' ), 'section' => 'virealys_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_bg', array( 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_bg', array( 'label' => __( 'Image Hero', 'virealys' ), 'section' => 'virealys_hero' ) ) );

    // === CONSTELLATION PAGES ===
    $wp_customize->add_section( 'virealys_constellation', array( 'title' => __( 'Constellation - Textes', 'virealys' ), 'priority' => 32 ) );

    $pages = array(
        'concept'     => array( 'Concept', 'Gastronomie slow food et technologie immersive fusionnées.' ),
        'menus'       => array( 'Nos Formules', 'Quatre formules du classique à l\'immersion totale.' ),
        'ambiances'   => array( 'Les Ambiances', 'Quatre univers sensoriels qui changent chaque saison.' ),
        'zones'       => array( 'Les 4 Zones', 'Choisissez votre niveau d\'immersion.' ),
        'passeport'   => array( 'Le Passeport', 'Collectionnez les tampons, débloquez des récompenses.' ),
        'reservation' => array( 'Réserver', 'Réservez votre table immersive.' ),
    );

    foreach ( $pages as $slug => $defaults ) {
        $wp_customize->add_setting( 'page_' . $slug . '_title', array( 'default' => $defaults[0], 'sanitize_callback' => 'sanitize_text_field' ) );
        $wp_customize->add_control( 'page_' . $slug . '_title', array( 'label' => sprintf( __( 'Titre - %s', 'virealys' ), $defaults[0] ), 'section' => 'virealys_constellation', 'type' => 'text' ) );
        $wp_customize->add_setting( 'page_' . $slug . '_summary', array( 'default' => $defaults[1], 'sanitize_callback' => 'sanitize_text_field' ) );
        $wp_customize->add_control( 'page_' . $slug . '_summary', array( 'label' => sprintf( __( 'Résumé - %s', 'virealys' ), $defaults[0] ), 'section' => 'virealys_constellation', 'type' => 'textarea' ) );
    }

    // === CTA ===
    $wp_customize->add_section( 'virealys_cta', array( 'title' => __( 'Section CTA', 'virealys' ), 'priority' => 33 ) );
    $wp_customize->add_setting( 'cta_title', array( 'default' => 'Prêt à voyager ?', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'cta_title', array( 'label' => __( 'Titre CTA', 'virealys' ), 'section' => 'virealys_cta', 'type' => 'text' ) );
    $wp_customize->add_setting( 'cta_subtitle', array( 'default' => 'Réservez votre expérience immersive.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'cta_subtitle', array( 'label' => __( 'Sous-titre CTA', 'virealys' ), 'section' => 'virealys_cta', 'type' => 'text' ) );

    // === RESERVATION ===
    $wp_customize->add_section( 'virealys_reservation', array( 'title' => __( 'Réservation & Contact', 'virealys' ), 'priority' => 40 ) );
    $fields = array(
        'reservation_url' => array( 'URL de réservation', 'url', '#reservation', 'esc_url_raw' ),
        'phone_number'    => array( 'Téléphone', 'text', '', 'sanitize_text_field' ),
        'address'         => array( 'Adresse', 'text', '', 'sanitize_text_field' ),
        'email'           => array( 'Email', 'email', 'contact@virealys.com', 'sanitize_email' ),
    );
    foreach ( $fields as $key => $d ) {
        $wp_customize->add_setting( $key, array( 'default' => $d[2], 'sanitize_callback' => $d[3] ) );
        $wp_customize->add_control( $key, array( 'label' => __( $d[0], 'virealys' ), 'section' => 'virealys_reservation', 'type' => $d[1] ) );
    }

    // === FOOTER ===
    $wp_customize->add_section( 'virealys_footer', array( 'title' => __( 'Footer', 'virealys' ), 'priority' => 45 ) );
    $wp_customize->add_setting( 'footer_tagline', array( 'default' => 'Voyagez sans quitter votre table.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'footer_tagline', array( 'label' => __( 'Slogan footer', 'virealys' ), 'section' => 'virealys_footer', 'type' => 'text' ) );
    $wp_customize->add_setting( 'footer_hours', array( 'default' => "Mar - Sam : 19h - 23h\nDim : 12h - 14h30\nLundi : Fermé", 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'footer_hours', array( 'label' => __( 'Horaires', 'virealys' ), 'section' => 'virealys_footer', 'type' => 'textarea' ) );

    // === SOCIAL ===
    $wp_customize->add_section( 'virealys_social', array( 'title' => __( 'Réseaux Sociaux', 'virealys' ), 'priority' => 50 ) );
    foreach ( array( 'instagram', 'facebook', 'tiktok' ) as $social ) {
        $wp_customize->add_setting( $social . '_url', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
        $wp_customize->add_control( $social . '_url', array( 'label' => ucfirst( $social ), 'section' => 'virealys_social', 'type' => 'url' ) );
    }
}
add_action( 'customize_register', 'virealys_customize_register' );

/**
 * Helper: get constellation icon SVG (minimal, cached)
 */
function virealys_get_constellation_icon( $name ) {
    $icons = array(
        'layers'   => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        'utensils' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg>',
        'globe'    => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>',
        'grid'     => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        'passport' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        'calendar' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'star'     => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    );
    return isset( $icons[ $name ] ) ? $icons[ $name ] : $icons['star'];
}

/**
 * Image optimization: add loading=lazy, decoding=async, fetchpriority
 */
function virealys_optimize_images( $content ) {
    if ( is_admin() ) return $content;
    // Add decoding=async to all images
    $content = preg_replace( '/<img(?![^>]*decoding)/', '<img decoding="async"', $content );
    return $content;
}
add_filter( 'the_content', 'virealys_optimize_images' );
add_filter( 'post_thumbnail_html', 'virealys_optimize_images' );

/**
 * Add fetchpriority="high" to hero images (LCP optimization)
 */
function virealys_lcp_image_hint() {
    if ( is_front_page() ) return; // No hero image on constellation
    if ( has_post_thumbnail() ) {
        $url = get_the_post_thumbnail_url( null, 'virealys-hero' );
        if ( $url ) {
            echo '<link rel="preload" as="image" href="' . esc_url( $url ) . '" fetchpriority="high">' . "\n";
        }
    }
}
add_action( 'wp_head', 'virealys_lcp_image_hint', 4 );
