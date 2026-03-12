<?php
/**
 * Virealys - Functions and definitions
 * Revolutionary Adaptive Restaurant Theme v4.0
 */

if ( ! defined( 'VIREALYS_VERSION' ) ) {
    define( 'VIREALYS_VERSION', '4.0.0' );
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

    // Enable excerpts on pages (for hero descriptions)
    add_post_type_support( 'page', 'excerpt' );

    // Editor styles
    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/css/main.css' );

    // Wide/full alignment in block editor
    add_theme_support( 'align-wide' );

    // Block editor color palette
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
    ) );
}
add_action( 'wp_enqueue_scripts', 'virealys_scripts' );

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
        $url = $page ? get_permalink( $page ) : home_url( '/#' . $slug );
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
        $url = $page ? get_permalink( $page ) : home_url( '/#' . $slug );
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
        $url = $page ? get_permalink( $page ) : home_url( '/#' . $slug );
        echo '<li><a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

/**
 * Customizer settings
 */
function virealys_customize_register( $wp_customize ) {

    // === HERO ===
    $wp_customize->add_section( 'virealys_hero', array(
        'title'    => __( 'Hero / Accueil', 'virealys' ),
        'priority' => 30,
    ) );

    $wp_customize->add_setting( 'hero_title', array(
        'default'           => 'Voyagez sans quitter votre table',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_title', array(
        'label'   => __( 'Titre Hero', 'virealys' ),
        'section' => 'virealys_hero',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'hero_subtitle', array(
        'default'           => 'Le premier restaurant Slow Food immersif & évolutif',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_subtitle', array(
        'label'   => __( 'Sous-titre Hero', 'virealys' ),
        'section' => 'virealys_hero',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'hero_bg', array( 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_bg', array(
        'label'   => __( 'Image Hero (restaurant VR)', 'virealys' ),
        'section' => 'virealys_hero',
    ) ) );

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
        'img_ambiance_japon'   => 'Aperçu Ambiance Japon (accueil)',
        'img_ambiance_paris'   => 'Aperçu Ambiance Paris (accueil)',
        'img_ambiance_italie'  => 'Aperçu Ambiance Italie (accueil)',
        'img_ambiance_cosmos'  => 'Aperçu Ambiance Cosmos (accueil)',
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
 * Performance
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
