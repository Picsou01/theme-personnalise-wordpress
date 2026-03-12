<?php
/**
 * Virealys - Functions and definitions
 * Constellation Navigation Theme v6.0
 */

if ( ! defined( 'VIREALYS_VERSION' ) ) {
    define( 'VIREALYS_VERSION', '6.0.0' );
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
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    register_nav_menus( array(
        'primary' => __( 'Menu Principal', 'virealys' ),
        'footer'  => __( 'Menu Footer', 'virealys' ),
    ) );

    add_image_size( 'virealys-hero', 1920, 1080, true );
    add_image_size( 'virealys-card', 600, 400, true );
    add_image_size( 'virealys-wide', 1200, 600, true );

    add_post_type_support( 'page', 'excerpt' );

    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/css/main.css' );
    add_theme_support( 'align-wide' );

    add_theme_support( 'editor-color-palette', array(
        array( 'name' => 'Neon Cyan',   'slug' => 'neon-cyan',   'color' => '#00e5ff' ),
        array( 'name' => 'Neon Blue',   'slug' => 'neon-blue',   'color' => '#4d7cff' ),
        array( 'name' => 'Neon Purple', 'slug' => 'neon-purple', 'color' => '#a855f7' ),
        array( 'name' => 'Neon Pink',   'slug' => 'neon-pink',   'color' => '#e040fb' ),
        array( 'name' => 'Dark BG',     'slug' => 'dark-bg',     'color' => '#06060f' ),
        array( 'name' => 'Light Text',  'slug' => 'light-text',  'color' => '#c8d6e5' ),
    ) );
}
add_action( 'after_setup_theme', 'virealys_setup' );

/**
 * Enqueue scripts and styles
 */
function virealys_scripts() {
    wp_enqueue_style(
        'virealys-fonts',
        'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    wp_enqueue_style( 'virealys-style', get_stylesheet_uri(), array(), VIREALYS_VERSION );
    wp_enqueue_style( 'virealys-main', get_template_directory_uri() . '/assets/css/main.css', array(), VIREALYS_VERSION );

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
 * Add page slug to body tag for JS tracking
 */
function virealys_body_attributes() {
    global $post;
    if ( $post && ! is_front_page() ) {
        echo ' data-page-slug="' . esc_attr( $post->post_name ) . '"';
    }
}

/**
 * Custom body class filter — add data attribute via wp_body_open
 */
function virealys_body_open_attributes() {
    global $post;
    if ( $post && ! is_front_page() ) {
        echo '<script>document.body.setAttribute("data-page-slug", "' . esc_js( $post->post_name ) . '");</script>';
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

        $atts = array();
        $atts['href'] = ! empty( $item->url ) ? $item->url : '';
        $atts['class'] = 'nav-link';

        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) ) {
                $attributes .= ' ' . $attr . '="' . esc_attr( $value ) . '"';
            }
        }

        $item_output = $args->before ?? '';
        $item_output .= '<a' . $attributes . '>';
        $item_output .= ( $args->link_before ?? '' ) . apply_filters( 'the_title', $item->title, $item->ID ) . ( $args->link_after ?? '' );
        $item_output .= '</a>';
        $item_output .= $args->after ?? '';

        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }
}

/**
 * Primary nav fallback
 */
function virealys_fallback_menu() {
    $pages = array(
        'concept'    => 'Le Concept',
        'menus'      => 'Nos Menus',
        'zones'      => 'Les Zones',
        'ambiances'  => 'Ambiances',
        'passeport'  => 'Passeport',
    );
    echo '<ul class="nav-list">';
    foreach ( $pages as $slug => $label ) {
        $page = get_page_by_path( $slug );
        $url = $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
        echo '<li><a href="' . esc_url( $url ) . '" class="nav-link">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

/**
 * Overlay nav fallback
 */
function virealys_overlay_fallback_menu() {
    $pages = array(
        'concept'    => 'Le Concept',
        'menus'      => 'Nos Menus',
        'ambiances'  => 'Ambiances',
        'zones'      => 'Les Zones',
        'passeport'  => 'Passeport',
    );
    echo '<ul class="overlay-nav-list">';
    foreach ( $pages as $slug => $label ) {
        $page = get_page_by_path( $slug );
        $url = $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
        echo '<li><a href="' . esc_url( $url ) . '" class="nav-link overlay-nav-link">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

/**
 * Footer nav fallback
 */
function virealys_footer_fallback() {
    $links = array(
        'concept'   => 'Le Concept',
        'menus'     => 'Nos Menus',
        'zones'     => 'Les Zones',
        'passeport' => 'Passeport',
        'contact'   => 'Contact',
    );
    echo '<ul class="footer-links">';
    foreach ( $links as $slug => $label ) {
        $page = get_page_by_path( $slug );
        $url = $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
        echo '<li><a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

/**
 * Customizer settings
 */
function virealys_customize_register( $wp_customize ) {

    // === HERO / ACCUEIL ===
    $wp_customize->add_section( 'virealys_hero', array(
        'title'    => __( 'Hero / Accueil', 'virealys' ),
        'priority' => 30,
    ) );

    $wp_customize->add_setting( 'hero_title', array(
        'default'           => 'Voyagez sans quitter votre table',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_title', array(
        'label'   => __( 'Titre principal constellation', 'virealys' ),
        'section' => 'virealys_hero',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'hero_subtitle', array(
        'default'           => 'Le premier restaurant Slow Food immersif & évolutif',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_subtitle', array(
        'label'   => __( 'Sous-titre constellation', 'virealys' ),
        'section' => 'virealys_hero',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'hero_bg', array( 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_bg', array(
        'label'   => __( 'Image Hero (fond constellation)', 'virealys' ),
        'section' => 'virealys_hero',
    ) ) );

    // === CONSTELLATION PAGES ===
    $wp_customize->add_section( 'virealys_constellation', array(
        'title'       => __( 'Constellation - Textes des pages', 'virealys' ),
        'priority'    => 32,
        'description' => __( 'Modifiez le titre et le résumé de chaque page tel qu\'il apparaît dans la constellation.', 'virealys' ),
    ) );

    $constellation_pages = array(
        'concept'     => array( 'Concept', 'Découvrez comment Virealys fusionne gastronomie slow food et technologie immersive pour réinventer l\'expérience culinaire.' ),
        'menus'       => array( 'Nos Formules', 'Du dîner classique à l\'immersion totale — quatre formules pour vivre l\'expérience à votre mesure.' ),
        'ambiances'   => array( 'Les Ambiances', 'Quatre univers sensoriels uniques — Japon, Paris, Italie, Cosmos. Choisissez votre voyage.' ),
        'zones'       => array( 'Les 4 Zones', 'Origine, Voyage, Immersion, Sensorielle — quatre niveaux d\'expérience pour personnaliser votre soirée.' ),
        'passeport'   => array( 'Le Passeport', 'Votre passeport numérique vous accompagne. Collectionnez les tampons, débloquez des expériences exclusives.' ),
        'reservation' => array( 'Réserver', 'Réservez votre table et choisissez votre niveau d\'immersion. L\'aventure commence ici.' ),
    );

    foreach ( $constellation_pages as $slug => $defaults ) {
        $wp_customize->add_setting( 'page_' . $slug . '_title', array(
            'default'           => $defaults[0],
            'sanitize_callback' => 'sanitize_text_field',
        ) );
        $wp_customize->add_control( 'page_' . $slug . '_title', array(
            'label'   => sprintf( __( 'Titre - %s', 'virealys' ), $defaults[0] ),
            'section' => 'virealys_constellation',
            'type'    => 'text',
        ) );

        $wp_customize->add_setting( 'page_' . $slug . '_summary', array(
            'default'           => $defaults[1],
            'sanitize_callback' => 'sanitize_text_field',
        ) );
        $wp_customize->add_control( 'page_' . $slug . '_summary', array(
            'label'   => sprintf( __( 'Résumé - %s', 'virealys' ), $defaults[0] ),
            'section' => 'virealys_constellation',
            'type'    => 'textarea',
        ) );
    }

    // === CTA SECTION ===
    $wp_customize->add_section( 'virealys_cta', array(
        'title'    => __( 'Section CTA (bas de page)', 'virealys' ),
        'priority' => 33,
    ) );

    $wp_customize->add_setting( 'cta_title', array(
        'default'           => 'Une question ?',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'cta_title', array(
        'label'   => __( 'Titre CTA', 'virealys' ),
        'section' => 'virealys_cta',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'cta_subtitle', array(
        'default'           => 'Réservez votre expérience immersive dès maintenant.',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'cta_subtitle', array(
        'label'   => __( 'Sous-titre CTA', 'virealys' ),
        'section' => 'virealys_cta',
        'type'    => 'text',
    ) );

    // === IMAGES ===
    $wp_customize->add_section( 'virealys_images', array(
        'title'    => __( 'Images des sections', 'virealys' ),
        'priority' => 35,
    ) );

    $images = array(
        'img_menus'            => 'Image Menus holographiques',
        'img_tracabilite'      => 'Image Traçabilité (plat + hologramme)',
        'img_ambiances'        => 'Image 4 Ambiances',
        'img_logo'             => 'Logo Virealys',
        'img_ambiance_japon'   => 'Aperçu Ambiance Japon',
        'img_ambiance_paris'   => 'Aperçu Ambiance Paris',
        'img_ambiance_italie'  => 'Aperçu Ambiance Italie',
        'img_ambiance_cosmos'  => 'Aperçu Ambiance Cosmos',
    );

    foreach ( $images as $key => $label ) {
        $wp_customize->add_setting( $key, array( 'sanitize_callback' => 'esc_url_raw' ) );
        $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $key, array(
            'label'   => __( $label, 'virealys' ),
            'section' => 'virealys_images',
        ) ) );
    }

    // === RESERVATION ===
    $wp_customize->add_section( 'virealys_reservation', array(
        'title'    => __( 'Réservation & Contact', 'virealys' ),
        'priority' => 40,
    ) );

    $fields = array(
        'reservation_url' => array( 'label' => 'URL de réservation', 'type' => 'url', 'default' => '#reservation', 'sanitize' => 'esc_url_raw' ),
        'phone_number'    => array( 'label' => 'Téléphone', 'type' => 'text', 'default' => '', 'sanitize' => 'sanitize_text_field' ),
        'address'         => array( 'label' => 'Adresse', 'type' => 'text', 'default' => '', 'sanitize' => 'sanitize_text_field' ),
        'email'           => array( 'label' => 'Email', 'type' => 'email', 'default' => 'contact@virealys.com', 'sanitize' => 'sanitize_email' ),
    );

    foreach ( $fields as $key => $data ) {
        $wp_customize->add_setting( $key, array( 'default' => $data['default'], 'sanitize_callback' => $data['sanitize'] ) );
        $wp_customize->add_control( $key, array( 'label' => __( $data['label'], 'virealys' ), 'section' => 'virealys_reservation', 'type' => $data['type'] ) );
    }

    // === FOOTER ===
    $wp_customize->add_section( 'virealys_footer', array(
        'title'    => __( 'Footer', 'virealys' ),
        'priority' => 45,
    ) );

    $wp_customize->add_setting( 'footer_tagline', array(
        'default'           => 'Voyagez sans quitter votre table.',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'footer_tagline', array(
        'label'   => __( 'Slogan footer', 'virealys' ),
        'section' => 'virealys_footer',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'footer_hours', array(
        'default'           => "Mar - Sam : 19h - 23h\nDim : 12h - 14h30\nLundi : Fermé",
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    $wp_customize->add_control( 'footer_hours', array(
        'label'   => __( 'Horaires (une ligne par créneau)', 'virealys' ),
        'section' => 'virealys_footer',
        'type'    => 'textarea',
    ) );

    // === SOCIAL ===
    $wp_customize->add_section( 'virealys_social', array(
        'title'    => __( 'Réseaux Sociaux', 'virealys' ),
        'priority' => 50,
    ) );

    foreach ( array( 'instagram', 'facebook', 'tiktok' ) as $social ) {
        $wp_customize->add_setting( $social . '_url', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
        $wp_customize->add_control( $social . '_url', array( 'label' => ucfirst( $social ), 'section' => 'virealys_social', 'type' => 'url' ) );
    }
}
add_action( 'customize_register', 'virealys_customize_register' );

/**
 * Helper: get image URL with fallback
 */
function virealys_get_image( $key, $fallback = '' ) {
    $url = get_theme_mod( $key );
    return $url ? $url : $fallback;
}

/**
 * Helper: get constellation icon SVG by name
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
 * Performance
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
