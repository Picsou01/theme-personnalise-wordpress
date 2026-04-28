<?php
/**
 * Virealys - Functions & Definitions
 * v12.0 - Constellation Orbit
 */

if ( ! defined( 'VIREALYS_VERSION' ) ) {
    define( 'VIREALYS_VERSION', '12.0.0' );
}

/* ── THEME SETUP ── */

function virealys_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array( 'height' => 40, 'width' => 160, 'flex-height' => true, 'flex-width' => true ) );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    register_nav_menus( array( 'primary' => __( 'Menu Principal', 'virealys' ), 'footer' => __( 'Menu Footer', 'virealys' ) ) );
    add_image_size( 'virealys-hero', 1280, 720, true );
    add_image_size( 'virealys-hero-sm', 640, 360, true );
    add_image_size( 'virealys-card', 400, 267, true );
    add_image_size( 'virealys-card-sm', 200, 134, true );
    add_image_size( 'virealys-thumb', 64, 64, true );
    add_post_type_support( 'page', 'excerpt' );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'editor-color-palette', array(
        array( 'name' => 'Aqua doux', 'slug' => 'aqua-doux', 'color' => '#7dd3c7' ),
        array( 'name' => 'Ocre renard', 'slug' => 'ocre-renard', 'color' => '#c77936' ),
        array( 'name' => 'Terracotta', 'slug' => 'terracotta', 'color' => '#8b3a0e' ),
        array( 'name' => 'Nuit profonde', 'slug' => 'nuit-profonde', 'color' => '#06060f' ),
    ) );
}
add_action( 'after_setup_theme', 'virealys_setup' );

/* ── REMOVE WORDPRESS BLOAT ── */

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
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );

function virealys_disable_embeds() { wp_deregister_script( 'wp-embed' ); }
add_action( 'wp_footer', 'virealys_disable_embeds' );

function virealys_dequeue_bloat() {
    // Keep jQuery available for booking, payment and loyalty plugins.
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'wc-blocks-style' );
    wp_dequeue_style( 'global-styles' );
    wp_dequeue_style( 'classic-theme-styles' );
}
add_action( 'wp_enqueue_scripts', 'virealys_dequeue_bloat', 1 );

/* ── SELF-HOSTED FONTS ── */

function virealys_fonts() {
    $d = get_template_directory_uri() . '/assets/fonts/';
    $fd = wp_is_mobile() ? 'optional' : 'swap';
    echo '<style id="vr-fonts">';
    echo "@font-face{font-family:'Space Grotesk';font-weight:600;font-display:$fd;src:local('Space Grotesk SemiBold'),url({$d}SpaceGrotesk-SemiBold.woff2) format('woff2')}";
    echo "@font-face{font-family:'Space Grotesk';font-weight:700;font-display:$fd;src:local('Space Grotesk Bold'),url({$d}SpaceGrotesk-Bold.woff2) format('woff2')}";
    echo "@font-face{font-family:'Outfit';font-weight:400;font-display:$fd;src:local('Outfit Regular'),url({$d}Outfit-Regular.woff2) format('woff2')}";
    echo "@font-face{font-family:'Outfit';font-weight:600;font-display:$fd;src:local('Outfit SemiBold'),url({$d}Outfit-SemiBold.woff2) format('woff2')}";
    echo '</style>';
    if ( ! wp_is_mobile() ) {
        echo '<link rel="preload" href="' . esc_url( $d . 'Outfit-Regular.woff2' ) . '" as="font" type="font/woff2" crossorigin>';
        echo '<link rel="preload" href="' . esc_url( $d . 'SpaceGrotesk-SemiBold.woff2' ) . '" as="font" type="font/woff2" crossorigin>';
    }
}
add_action( 'wp_head', 'virealys_fonts', 0 );

/* ── CRITICAL CSS (inline, above-fold only) ── */

function virealys_critical_css() {
    ?>
    <style id="vr-c">
    :root{--color-bg:#06060f;--color-bg-alt:#0a0a1a;--color-bg-card:#0e0e20;--color-surface:#12122a;--color-border:rgba(100,200,255,.08);--color-text:#c8d6e5;--color-text-muted:#7a8ba0;--color-heading:#e8f0ff;--color-white:#fff;--neon-cyan:#00e5ff;--neon-blue:#4d7cff;--neon-purple:#a855f7;--neon-pink:#e040fb;--neon-cyan-rgb:0,229,255;--neon-blue-rgb:77,124,255;--neon-purple-rgb:168,85,247;--gradient-primary:linear-gradient(135deg,var(--neon-cyan),var(--neon-blue),var(--neon-purple));--font-heading:'Space Grotesk',system-ui,sans-serif;--font-body:'Outfit',system-ui,sans-serif;--ease-out:cubic-bezier(.16,1,.3,1);--transition-fast:.2s var(--ease-out);--transition-medium:.4s var(--ease-out);--radius-sm:8px;--radius-md:12px;--radius-lg:20px;--section-padding:clamp(4rem,8vh,7rem);--container-width:1200px}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
    body{font-family:var(--font-body);font-size:1rem;line-height:1.7;color:var(--color-text);background:var(--color-bg);overflow-x:hidden}
    img{max-width:100%;height:auto;display:block}
    a{color:var(--neon-cyan);text-decoration:none}
    h1,h2,h3,h4,h5,h6{font-family:var(--font-heading);color:var(--color-heading);font-weight:600;line-height:1.2}
    .container{width:100%;max-width:var(--container-width);margin:0 auto;padding:0 clamp(1.25rem,4vw,2.5rem)}
    .site-main{position:relative;z-index:1}
    .v-site-nav{display:none}
    .floating-logo{position:fixed;top:1rem;left:1.25rem;z-index:1000;background:rgba(6,6,15,.75);border:1px solid rgba(0,229,255,.1);border-radius:100px;padding:.4rem 1rem}
    .floating-logo a{display:flex;align-items:center;text-decoration:none}
    .logo-text{font-family:var(--font-heading);font-size:.875rem;font-weight:700;letter-spacing:.15em;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .vr-constellation-hub{position:relative;width:100%;height:100dvh;overflow:hidden;background:var(--color-bg);contain:layout style}
    .constellation-bg{position:absolute;inset:0;z-index:0;contain:strict}
    .constellation-hero{position:absolute;top:0;left:0;right:0;z-index:2;text-align:center;padding-top:clamp(2rem,5vh,3.5rem);pointer-events:none}
    .constellation-hero-content{max-width:600px;margin:0 auto;padding:0 2rem}
    .constellation-title{font-size:clamp(1.5rem,3.5vw,2.5rem);font-weight:700;line-height:1.15;margin-bottom:.5rem;background:linear-gradient(135deg,var(--color-white),var(--color-text));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .constellation-subtitle{font-size:clamp(.8rem,1.3vw,.95rem);color:var(--color-text-muted);margin-bottom:.75rem}
    .constellation-mobile-list{display:none}
    .menu-overlay{position:fixed;inset:0;z-index:999;background:rgba(6,6,15,.96);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .4s var(--ease-out),visibility .4s var(--ease-out)}
    .menu-overlay.open{opacity:1;visibility:visible}
    [data-reveal]{opacity:0;transform:translateY(20px);transition:opacity .5s var(--ease-out),transform .5s var(--ease-out)}
    [data-reveal].revealed{opacity:1;transform:none}
    .page-hero{position:relative;padding:4rem 0;text-align:center;overflow:hidden;contain:layout style paint}
    .page-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
    .page-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,var(--color-bg),rgba(6,6,15,.8),var(--color-bg));z-index:1}
    .page-hero-content{position:relative;z-index:2;max-width:640px;margin:0 auto}
    .page-hero-title{font-size:clamp(2rem,5vw,3.5rem);margin-bottom:1rem}
    .section{contain:layout style paint;padding:var(--section-padding) 0;position:relative}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.7rem 1.5rem;font-family:var(--font-heading);font-size:.8125rem;font-weight:500;letter-spacing:.03em;text-transform:uppercase;border:none;border-radius:var(--radius-sm);cursor:pointer;white-space:nowrap}
    .btn-glow{background:var(--gradient-primary);color:var(--color-bg);font-weight:600}
    .btn-lg{padding:.875rem 2rem;font-size:.875rem}
    .section-title{font-size:clamp(1.75rem,3.5vw,2.75rem);margin-bottom:.75rem}
    .section-desc{font-size:1rem;color:var(--color-text-muted);line-height:1.7}
    .site-footer{position:relative;padding:3.5rem 0 1.5rem;border-top:1px solid var(--color-border);background:var(--color-bg);content-visibility:auto;contain-intrinsic-size:auto 400px}
    .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2.5rem;margin-bottom:2.5rem}
    .footer-col h4{font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--color-heading);margin-bottom:1rem}
    .footer-links{list-style:none}
    .footer-links li{padding:.25rem 0;font-size:.8125rem;color:var(--color-text-muted)}
    .footer-links a{color:var(--color-text-muted);text-decoration:none}
    .footer-bottom{text-align:center;padding-top:1.5rem;border-top:1px solid var(--color-border)}
    .footer-bottom p{font-size:.75rem;color:var(--color-text-muted)}
    .section-cta{text-align:center;position:relative;overflow:hidden;content-visibility:auto;contain-intrinsic-size:auto 300px}
    .cta-content{position:relative;z-index:1}
    @media(max-width:768px){
    .floating-logo{top:.5rem;left:.5rem;padding:.3rem .6rem}
    .logo-text{font-size:.75rem}
    .constellation-nodes,.constellation-lines,.constellation-hint-desktop{display:none!important}
    .constellation-mobile-list{display:flex;flex-direction:column;gap:.5rem;padding:0 1rem;position:absolute;bottom:1.5rem;left:0;right:0;z-index:10;max-height:58vh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;scroll-snap-type:y proximity}
    .constellation-mobile-card{display:flex;align-items:center;gap:.75rem;padding:.75rem;background:rgba(14,14,32,.9);border:1px solid rgba(var(--neon-cyan-rgb),.1);border-radius:var(--radius-md);text-decoration:none;color:var(--color-text);-webkit-tap-highlight-color:transparent;min-height:56px;scroll-snap-align:start;touch-action:manipulation}
    .constellation-mobile-card:active{border-color:var(--node-color);transform:scale(.97)}
    .constellation-mobile-icon{display:flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;border-radius:50%;border:1.5px solid var(--node-color);color:var(--node-color)}
    .constellation-mobile-info{flex:1;min-width:0}
    .constellation-mobile-title{display:block;font-family:var(--font-heading);font-size:.875rem;font-weight:600;color:var(--color-heading)}
    .constellation-mobile-summary{display:block;font-size:.75rem;color:var(--color-text-muted);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .constellation-mobile-card>svg{color:var(--color-text-muted);flex-shrink:0}
    .constellation-hero{padding-top:1.5rem;position:relative}
    .constellation-title{font-size:1.375rem}
    .constellation-subtitle{font-size:.8rem;margin-bottom:.5rem}
    .vr-constellation-hub{display:flex;flex-direction:column}
    .btn{min-height:48px;padding:.75rem 1.5rem}
    .page-hero{padding:3rem 0 2.5rem}
    .page-hero-title{font-size:clamp(1.5rem,5vw,2rem)}
    .section{padding:clamp(2.5rem,5vh,4rem) 0}
    .footer-grid{grid-template-columns:1fr;text-align:center}
    }
    @media(max-width:480px){
    .constellation-mobile-card{padding:.625rem}
    .constellation-mobile-icon{width:44px;height:44px;min-width:44px}
    .constellation-mobile-list{padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
    }
    </style>
    <?php
}
add_action( 'wp_head', 'virealys_critical_css', 2 );

/* ── ENQUEUE & DEFER ── */

function virealys_scripts() {
    wp_enqueue_style( 'virealys-main', get_template_directory_uri() . '/assets/css/main.css', array(), VIREALYS_VERSION );
    wp_enqueue_script( 'virealys-main', get_template_directory_uri() . '/assets/js/main.js', array(), VIREALYS_VERSION, true );
    wp_localize_script( 'virealys-main', 'virealys', array(
        'ajax_url'  => admin_url( 'admin-ajax.php' ),
        'nonce'     => wp_create_nonce( 'virealys_nonce' ),
        'theme_url' => get_template_directory_uri(),
        'home_url'  => home_url( '/' ),
        'routes'    => array(
            'concept'           => home_url( '/#concept' ),
            'menus'             => home_url( '/#menus' ),
            'zones'             => home_url( '/#zones' ),
            'ambiances'         => home_url( '/#pays-du-mois' ),
            'passeport'         => home_url( '/#passeport' ),
            'reservation'       => home_url( '/#reservation' ),
            'voyage-game'       => virealys_get_page_url( 'voyage-game' ),
            '__constellation__' => home_url( '/' ),
        ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'virealys_scripts' );

function virealys_defer_css( $html, $handle ) {
    if ( is_admin() || $handle !== 'virealys-main' ) return $html;
    $html = str_replace( "rel='stylesheet'", "rel='stylesheet' media='print' onload=\"this.media='all'\"", $html );
    $html .= '<noscript>' . str_replace( "media='print' onload=\"this.media='all'\"", "", $html ) . '</noscript>';
    return $html;
}
add_filter( 'style_loader_tag', 'virealys_defer_css', 10, 2 );

function virealys_defer_js( $tag, $handle ) {
    if ( is_admin() ) return $tag;
    if ( $handle === 'virealys-main' || $handle === 'virealys-game' ) {
        return str_replace( ' src', ' defer src', $tag );
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'virealys_defer_js', 10, 2 );

/* ── GAME SCRIPT (only on game page) ── */

function virealys_game_scripts() {
    if ( is_page_template( 'templates/template-game.php' ) ) {
        wp_enqueue_script( 'virealys-game', get_template_directory_uri() . '/assets/js/game.js', array(), VIREALYS_VERSION, true );
        wp_localize_script( 'virealys-game', 'vrGame', array(
            'reservation_url' => get_theme_mod( 'reservation_url', home_url( '/#reservation' ) ),
            'home_url'        => home_url( '/' ),
            'passport_url'    => home_url( '/#passeport' ),
            'monthly_country' => get_theme_mod( 'monthly_country', 'Japon nocturne' ),
            'ajax_url'        => admin_url( 'admin-ajax.php' ),
            'nonce'           => wp_create_nonce( 'virealys_passport_nonce' ),
            'is_logged_in'    => is_user_logged_in(),
            'saved_passport'  => virealys_get_saved_passport(),
            'rewards'         => array(
                array( 'stars' => 120, 'label' => 'Cocktail Constellation -50%' ),
                array( 'stars' => 260, 'label' => 'Amuse-bouche secret offert' ),
                array( 'stars' => 520, 'label' => 'Acces prioritaire Pays du mois' ),
            ),
        ) );
    }
}
add_action( 'wp_enqueue_scripts', 'virealys_game_scripts' );

/* ── PASSPORT SYNC ── */

function virealys_get_saved_passport() {
    if ( ! is_user_logged_in() ) return null;
    $raw = get_user_meta( get_current_user_id(), 'virealys_passport_v11', true );
    if ( ! is_string( $raw ) || $raw === '' ) return null;
    $passport = json_decode( $raw, true );
    return is_array( $passport ) ? $passport : null;
}

function virealys_sanitize_passport_list( $items, $limit = 40 ) {
    $items = is_array( $items ) ? $items : array();
    $items = array_filter( $items, 'is_scalar' );
    $items = array_map( function( $item ) {
        return sanitize_key( (string) $item );
    }, $items );
    $items = array_filter( $items );
    $items = array_values( array_unique( $items ) );
    return array_slice( $items, 0, $limit );
}

function virealys_sanitize_passport( $passport ) {
    $boat = isset( $passport['boat'] ) && is_array( $passport['boat'] ) ? $passport['boat'] : array();
    $selected = isset( $passport['selected'] ) ? sanitize_key( $passport['selected'] ) : '';

    return array(
        'boat'       => array(
            'x'     => max( 70, min( 1530, (float) ( $boat['x'] ?? 800 ) ) ),
            'y'     => max( 70, min( 830, (float) ( $boat['y'] ?? 475 ) ) ),
            'angle' => max( -7, min( 7, (float) ( $boat['angle'] ?? -0.35 ) ) ),
        ),
        'stars'      => max( 0, min( 99999, absint( $passport['stars'] ?? 0 ) ) ),
        'cargo'      => virealys_sanitize_passport_list( $passport['cargo'] ?? array(), 80 ),
        'stamps'     => virealys_sanitize_passport_list( $passport['stamps'] ?? array(), 20 ),
        'rewards'    => virealys_sanitize_passport_list( $passport['rewards'] ?? array(), 30 ),
        'realRewards'=> virealys_sanitize_passport_list( $passport['realRewards'] ?? array(), 30 ),
        'visited'    => virealys_sanitize_passport_list( $passport['visited'] ?? array(), 30 ),
        'selected'   => $selected ?: null,
        'muted'      => ! empty( $passport['muted'] ),
        'updated_at' => max( 0, absint( $passport['updated_at'] ?? time() ) ),
    );
}

function virealys_ajax_sync_passport() {
    check_ajax_referer( 'virealys_passport_nonce', 'nonce' );

    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'Connectez-vous pour synchroniser le passeport.' ), 401 );
    }

    $raw = isset( $_POST['passport'] ) ? wp_unslash( $_POST['passport'] ) : '';
    $passport = json_decode( $raw, true );
    if ( ! is_array( $passport ) ) {
        wp_send_json_error( array( 'message' => 'Passeport invalide.' ), 400 );
    }

    $safe = virealys_sanitize_passport( $passport );
    update_user_meta( get_current_user_id(), 'virealys_passport_v11', wp_json_encode( $safe ) );

    wp_send_json_success( array( 'passport' => $safe ) );
}
add_action( 'wp_ajax_virealys_sync_passport', 'virealys_ajax_sync_passport' );

function virealys_ajax_sync_passport_guest() {
    wp_send_json_error( array( 'message' => 'Le passeport invite reste local.' ), 401 );
}
add_action( 'wp_ajax_nopriv_virealys_sync_passport', 'virealys_ajax_sync_passport_guest' );

/* ── INLINE CRITICAL JS (reveals + menu + lazy images) ── */

function virealys_critical_js() {
    if ( is_admin() ) return;
    ?>
    <script id="vr-cjs">
    (function(){var d={};if('IntersectionObserver' in window){var ro=new IntersectionObserver(function(e){for(var i=0;i<e.length;i++)if(e[i].isIntersecting){e[i].target.classList.add('revealed');ro.unobserve(e[i].target)}},{threshold:.1,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('[data-reveal]').forEach(function(el){ro.observe(el)});d.reveals=1;var io=new IntersectionObserver(function(e){for(var i=0;i<e.length;i++)if(e[i].isIntersecting){var g=e[i].target;var s=new Image();s.onload=function(){g.src=this.src;g.removeAttribute('data-src');g.classList.add('vr-img-loaded')};s.src=g.dataset.src;io.unobserve(g)}},{rootMargin:'200px 0px',threshold:0});document.querySelectorAll('img[data-src]').forEach(function(g){io.observe(g)});d.images=1}else{document.querySelectorAll('[data-reveal]').forEach(function(el){el.classList.add('revealed')});document.querySelectorAll('img[data-src]').forEach(function(g){g.src=g.dataset.src})}var ov=document.getElementById('menu-overlay'),cl=document.getElementById('menu-overlay-close');function c(){if(ov){ov.classList.remove('open');document.body.style.overflow=''}}if(cl)cl.addEventListener('click',c);if(ov)ov.addEventListener('click',function(e){if(e.target.closest('.nav-link,.overlay-nav-link'))c()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov&&ov.classList.contains('open'))c()});d.menu=1;window._vrC=d})();
    </script>
    <?php
}
add_action( 'wp_body_open', 'virealys_critical_js', 1 );

/* ── HEADERS ── */

function virealys_headers() {
    if ( is_admin() || is_user_logged_in() ) return;
    header( 'Cache-Control: public, max-age=3600, stale-while-revalidate=86400' );
    header( 'X-Content-Type-Options: nosniff' );
    header( 'Vary: Accept-Encoding' );
    $css = get_template_directory_uri() . '/assets/css/main.css?ver=' . VIREALYS_VERSION;
    header( 'Link: <' . esc_url( $css ) . '>; rel=preload; as=style', false );
    if ( extension_loaded( 'zlib' ) && ! ini_get( 'zlib.output_compression' ) ) {
        ini_set( 'zlib.output_compression', 'On' );
    }
}
add_action( 'send_headers', 'virealys_headers' );

/* ── HTML MINIFICATION ── */

function virealys_start_minify() {
    if ( is_admin() || is_user_logged_in() ) return;
    ob_start( 'virealys_minify' );
}
function virealys_minify( $h ) {
    if ( empty( $h ) ) return $h;
    $raw = array();
    $h = preg_replace_callback( '#<(pre|script|style|textarea)[^>]*>.*?</\\1>#si', function( $m ) use ( &$raw ) {
        $k = '<!--VR' . count( $raw ) . '-->';
        $raw[ $k ] = $m[0];
        return $k;
    }, $h );
    $h = preg_replace( '/<!--(?!VR).*?-->/s', '', $h );
    $h = preg_replace( '/\\s{2,}/', ' ', $h );
    $h = preg_replace( '/> </', '><', $h );
    return str_replace( array_keys( $raw ), array_values( $raw ), $h );
}
add_action( 'template_redirect', 'virealys_start_minify', 0 );

/* ── SEO META v10.1 ── */

function virealys_seo() {
    $name = get_bloginfo( 'name' );
    $desc = 'Virealys - restaurant Slow Food immersif et evolutif. 4 zones, pays du mois, passeport numerique et recompenses virtuelles converties en attentions reelles.';
    $url  = is_front_page() ? home_url( '/' ) : get_permalink();
    $img  = get_theme_mod( 'hero_bg', get_template_directory_uri() . '/screenshot.png' );
    $title = wp_get_document_title();

    if ( ( is_single() || is_page() ) && get_the_excerpt() ) $desc = wp_strip_all_tags( get_the_excerpt() );
    if ( is_front_page() ) $desc = get_theme_mod( 'hero_subtitle', $desc );
    if ( has_post_thumbnail() ) $img = get_the_post_thumbnail_url( null, 'virealys-hero' );
    ?>
    <meta name="description" content="<?php echo esc_attr( $desc ); ?>">
    <meta name="keywords" content="restaurant immersif, slow food, gastronomie, expérience culinaire, projection mapping, dîner sensoriel, Virealys, restaurant Paris">
    <meta name="author" content="Virealys">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large">
    <link rel="canonical" href="<?php echo esc_url( $url ); ?>">
    <meta property="og:type" content="<?php echo is_front_page() ? 'website' : 'article'; ?>">
    <meta property="og:url" content="<?php echo esc_url( $url ); ?>">
    <meta property="og:title" content="<?php echo esc_attr( $title ); ?>">
    <meta property="og:description" content="<?php echo esc_attr( $desc ); ?>">
    <meta property="og:image" content="<?php echo esc_url( $img ); ?>">
    <meta property="og:image:width" content="1280">
    <meta property="og:image:height" content="720">
    <meta property="og:site_name" content="<?php echo esc_attr( $name ); ?>">
    <meta property="og:locale" content="fr_FR">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo esc_attr( $title ); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr( $desc ); ?>">
    <meta name="twitter:image" content="<?php echo esc_url( $img ); ?>">
    <script type="application/ld+json">{
    "@context":"https://schema.org",
    "@type":"Restaurant",
    "name":"<?php echo esc_js( $name ); ?>",
    "description":"<?php echo esc_js( $desc ); ?>",
    "url":"<?php echo esc_url( home_url('/') ); ?>",
    "servesCuisine":["Gastronomie française","Slow Food","Cuisine immersive"],
    "priceRange":"€€€",
    "address":{"@type":"PostalAddress","addressLocality":"<?php echo esc_js( get_theme_mod('address','') ); ?>"},
    "telephone":"<?php echo esc_js( get_theme_mod('phone_number','') ); ?>",
    "email":"<?php echo esc_js( get_theme_mod('email','contact@virealys.com') ); ?>",
    "openingHours":["Tu-Sa 19:00-23:00","Su 12:00-14:30"],
    "image":"<?php echo esc_url( $img ); ?>",
    "acceptsReservations":true,
    "menu":"<?php echo esc_url( home_url('/menus/') ); ?>"
    }</script>
    <?php
}
add_action( 'wp_head', 'virealys_seo', 3 );

/* ── SEO: Breadcrumbs (Schema.org) ── */

function virealys_breadcrumbs() {
    if ( is_front_page() ) return;
    $items = array( array( 'name' => 'Accueil', 'url' => home_url( '/' ) ) );
    if ( is_page() ) {
        $items[] = array( 'name' => get_the_title(), 'url' => get_permalink() );
    } elseif ( is_single() ) {
        $items[] = array( 'name' => 'Blog', 'url' => home_url( '/blog/' ) );
        $items[] = array( 'name' => get_the_title(), 'url' => get_permalink() );
    }
    echo '<nav class="breadcrumbs" aria-label="Fil d\'Ariane"><div class="container">';
    foreach ( $items as $i => $item ) {
        if ( $i > 0 ) echo ' <span class="breadcrumb-sep">/</span> ';
        if ( $i === count( $items ) - 1 ) {
            echo '<span class="breadcrumb-current">' . esc_html( $item['name'] ) . '</span>';
        } else {
            echo '<a href="' . esc_url( $item['url'] ) . '" class="breadcrumb-link">' . esc_html( $item['name'] ) . '</a>';
        }
    }
    echo '</div></nav>';
    // Schema.org BreadcrumbList
    echo '<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[';
    foreach ( $items as $i => $item ) {
        if ( $i > 0 ) echo ',';
        echo '{"@type":"ListItem","position":' . ( $i + 1 ) . ',"name":"' . esc_js( $item['name'] ) . '","item":"' . esc_url( $item['url'] ) . '"}';
    }
    echo ']}</script>';
}
add_action( 'wp_body_open', 'virealys_breadcrumbs', 5 );

/* ── SEO: XML Sitemap improvements ── */

function virealys_sitemap_styles() {
    // WordPress 5.5+ has built-in sitemaps at /wp-sitemap.xml
    // Ensure pages are prioritized
    return true;
}
add_filter( 'wp_sitemaps_enabled', 'virealys_sitemap_styles' );

/* ── SEO: Better title format ── */

function virealys_title_separator( $sep ) {
    return '—';
}
add_filter( 'document_title_separator', 'virealys_title_separator' );

/* ── BODY SLUG ── */

function virealys_body_slug() {
    global $post;
    if ( $post && ! is_front_page() ) echo '<script>document.body.setAttribute("data-page-slug","' . esc_js( $post->post_name ) . '")</script>';
}
add_action( 'wp_body_open', 'virealys_body_slug' );

/* ── NAV WALKER + FALLBACKS ── */

class Virealys_Nav_Walker extends Walker_Nav_Menu {
    function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $cn = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
        $cn = $cn ? ' class="' . esc_attr( $cn ) . '"' : '';
        $output .= '<li' . $cn . '>';
        $href = ! empty( $item->url ) ? ' href="' . esc_attr( $item->url ) . '"' : '';
        $output .= ( $args->before ?? '' ) . '<a' . $href . ' class="nav-link">' . ( $args->link_before ?? '' ) . apply_filters( 'the_title', $item->title, $item->ID ) . ( $args->link_after ?? '' ) . '</a>' . ( $args->after ?? '' );
    }
}

function virealys_get_page_url( $slug ) {
    static $c = array();
    if ( ! isset( $c[ $slug ] ) ) { $p = get_page_by_path( $slug ); $c[ $slug ] = $p ? get_permalink( $p ) : home_url( '/' . $slug . '/' ); }
    return $c[ $slug ];
}

function virealys_overlay_fallback_menu() {
    $pages = array(
        '#concept'       => 'Le Concept',
        '#zones'         => 'Les 4 Zones',
        '#pays-du-mois'  => 'Pays du mois',
        '#passeport'     => 'Passeport',
        'voyage-game'    => 'Le Jeu',
        '#reservation'   => 'Reserver',
    );
    echo '<ul class="overlay-nav-list">';
    foreach ( $pages as $s => $l ) {
        $url = str_starts_with( $s, '#' ) ? home_url( '/' . $s ) : virealys_get_page_url( $s );
        echo '<li><a href="' . esc_url( $url ) . '" class="nav-link overlay-nav-link">' . esc_html( $l ) . '</a></li>';
    }
    echo '</ul>';
}

function virealys_footer_fallback() {
    $links = array( 'concept' => 'Le Concept', 'menus' => 'Nos Menus', 'zones' => 'Les Zones', 'passeport' => 'Passeport', 'voyage-game' => 'Le Jeu' );
    echo '<ul class="footer-links">';
    foreach ( $links as $s => $l ) echo '<li><a href="' . esc_url( virealys_get_page_url( $s ) ) . '">' . esc_html( $l ) . '</a></li>';
    echo '</ul>';
}

/* ── CUSTOMIZER ── */

function virealys_customizer( $wp ) {
    $wp->add_section( 'virealys_hero', array( 'title' => 'Hero / Accueil', 'priority' => 30 ) );
    $wp->add_setting( 'hero_title', array( 'default' => 'On ne vient pas manger. On vient vivre un monde.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp->add_control( 'hero_title', array( 'label' => 'Titre constellation', 'section' => 'virealys_hero' ) );
    $wp->add_setting( 'hero_subtitle', array( 'default' => 'Restaurant Slow Food immersif et evolutif, ou chaque table devient un pays, une scene et un souvenir a collectionner.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp->add_control( 'hero_subtitle', array( 'label' => 'Sous-titre', 'section' => 'virealys_hero' ) );
    $wp->add_setting( 'hero_bg', array( 'sanitize_callback' => 'esc_url_raw' ) );
    $wp->add_control( new WP_Customize_Image_Control( $wp, 'hero_bg', array( 'label' => 'Image Hero', 'section' => 'virealys_hero' ) ) );
    $wp->add_setting( 'monthly_country', array( 'default' => 'Japon nocturne', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp->add_control( 'monthly_country', array( 'label' => 'Pays du mois', 'section' => 'virealys_hero' ) );

    $wp->add_section( 'virealys_constellation', array( 'title' => 'Constellation - Textes', 'priority' => 32 ) );
    $pages = array(
        'concept' => array( 'Concept', 'Slow Food, pays evolutifs et technologie invisible autour de la table.' ),
        'menus' => array( 'Menus', 'Quatre niveaux, du repas essentiel a l experience sensorielle.' ),
        'ambiances' => array( 'Pays du mois', 'Chaque mois, decor, sons, parfums et brigade changent de destination.' ),
        'zones' => array( 'Les 4 Zones', 'Origine, Voyage, Immersion et Sensorielle: chacun choisit son intensite.' ),
        'passeport' => array( 'Passeport', 'Des tampons virtuels qui debloquent de vraies attentions en salle.' ),
        'reservation' => array( 'Reserver', 'Choisissez une zone, un pays et un niveau d immersion en quelques gestes.' ),
        'voyage_game' => array( 'Jeu', 'Pilotez votre bateau, gagnez des etoiles et convertissez-les au restaurant.' ),
    );
    foreach ( $pages as $slug => $d ) {
        $wp->add_setting( 'page_' . $slug . '_title', array( 'default' => $d[0], 'sanitize_callback' => 'sanitize_text_field' ) );
        $wp->add_control( 'page_' . $slug . '_title', array( 'label' => 'Titre - ' . $d[0], 'section' => 'virealys_constellation' ) );
        $wp->add_setting( 'page_' . $slug . '_summary', array( 'default' => $d[1], 'sanitize_callback' => 'sanitize_text_field' ) );
        $wp->add_control( 'page_' . $slug . '_summary', array( 'label' => 'Résumé - ' . $d[0], 'section' => 'virealys_constellation', 'type' => 'textarea' ) );
    }

    $wp->add_section( 'virealys_cta', array( 'title' => 'Section CTA', 'priority' => 33 ) );
    $wp->add_setting( 'cta_title', array( 'default' => 'Prêt à voyager ?', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp->add_control( 'cta_title', array( 'label' => 'Titre CTA', 'section' => 'virealys_cta' ) );
    $wp->add_setting( 'cta_subtitle', array( 'default' => 'Réservez votre expérience immersive.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp->add_control( 'cta_subtitle', array( 'label' => 'Sous-titre CTA', 'section' => 'virealys_cta' ) );

    $wp->add_section( 'virealys_reservation', array( 'title' => 'Réservation & Contact', 'priority' => 40 ) );
    foreach ( array( 'reservation_url' => array( 'URL réservation', 'url', '#reservation', 'esc_url_raw' ), 'phone_number' => array( 'Téléphone', 'text', '', 'sanitize_text_field' ), 'address' => array( 'Adresse', 'text', '', 'sanitize_text_field' ), 'email' => array( 'Email', 'email', 'contact@virealys.com', 'sanitize_email' ) ) as $k => $d ) {
        $wp->add_setting( $k, array( 'default' => $d[2], 'sanitize_callback' => $d[3] ) );
        $wp->add_control( $k, array( 'label' => $d[0], 'section' => 'virealys_reservation', 'type' => $d[1] ) );
    }

    $wp->add_section( 'virealys_footer', array( 'title' => 'Footer', 'priority' => 45 ) );
    $wp->add_setting( 'footer_tagline', array( 'default' => 'Voyagez sans quitter votre table.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp->add_control( 'footer_tagline', array( 'label' => 'Slogan footer', 'section' => 'virealys_footer' ) );
    $wp->add_setting( 'footer_hours', array( 'default' => "Mar - Sam : 19h - 23h\nDim : 12h - 14h30\nLundi : Fermé", 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp->add_control( 'footer_hours', array( 'label' => 'Horaires', 'section' => 'virealys_footer', 'type' => 'textarea' ) );

    $wp->add_section( 'virealys_social', array( 'title' => 'Réseaux Sociaux', 'priority' => 50 ) );
    foreach ( array( 'instagram', 'facebook', 'tiktok' ) as $s ) {
        $wp->add_setting( $s . '_url', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
        $wp->add_control( $s . '_url', array( 'label' => ucfirst( $s ), 'section' => 'virealys_social', 'type' => 'url' ) );
    }
}
add_action( 'customize_register', 'virealys_customizer' );

/* ── ICONS ── */

function virealys_get_constellation_icon( $n ) {
    $i = array(
        'layers'   => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        'utensils' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/></svg>',
        'globe'    => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>',
        'grid'     => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        'passport' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        'calendar' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'star'     => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        'gamepad'  => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/></svg>',
    );
    return $i[ $n ] ?? $i['star'];
}

/* ── IMAGE OPTIMIZATION ── */

function virealys_optimize_images( $c ) {
    if ( is_admin() ) return $c;
    $c = preg_replace( '/<img(?![^>]*decoding)/', '<img decoding="async"', $c );
    $c = preg_replace( '/<img(?![^>]*loading)/', '<img loading="lazy"', $c );
    return $c;
}
add_filter( 'the_content', 'virealys_optimize_images' );
add_filter( 'post_thumbnail_html', 'virealys_optimize_images' );

function virealys_lcp_hint() {
    if ( is_front_page() || ! has_post_thumbnail() ) return;
    $url = get_the_post_thumbnail_url( null, 'virealys-hero' );
    if ( $url ) echo '<link rel="preload" as="image" href="' . esc_url( $url ) . '" fetchpriority="high">';
}
add_action( 'wp_head', 'virealys_lcp_hint', 4 );
