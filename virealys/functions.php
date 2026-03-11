<?php
/**
 * Virealys - Functions and definitions
 */

if ( ! defined( 'VIREALYS_VERSION' ) ) {
    define( 'VIREALYS_VERSION', '1.0.0' );
}

/**
 * Theme setup
 */
function virealys_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 80,
        'width'       => 250,
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
        'primary'   => __( 'Menu Principal', 'virealys' ),
        'footer'    => __( 'Menu Footer', 'virealys' ),
    ) );

    add_image_size( 'virealys-hero', 1920, 1080, true );
    add_image_size( 'virealys-card', 600, 400, true );
}
add_action( 'after_setup_theme', 'virealys_setup' );

/**
 * Enqueue scripts and styles
 */
function virealys_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'virealys-fonts',
        'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    // Main stylesheet
    wp_enqueue_style( 'virealys-style', get_stylesheet_uri(), array(), VIREALYS_VERSION );
    wp_enqueue_style( 'virealys-main', get_template_directory_uri() . '/assets/css/main.css', array(), VIREALYS_VERSION );

    // Main JS
    wp_enqueue_script( 'virealys-main', get_template_directory_uri() . '/assets/js/main.js', array(), VIREALYS_VERSION, true );

    wp_localize_script( 'virealys-main', 'virealys', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => wp_create_nonce( 'virealys_nonce' ),
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
 * Customizer settings
 */
function virealys_customize_register( $wp_customize ) {
    // Hero Section
    $wp_customize->add_section( 'virealys_hero', array(
        'title'    => __( 'Section Hero', 'virealys' ),
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

    $wp_customize->add_setting( 'hero_bg', array(
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_bg', array(
        'label'   => __( 'Image de fond Hero', 'virealys' ),
        'section' => 'virealys_hero',
    ) ) );

    // Reservation Section
    $wp_customize->add_section( 'virealys_reservation', array(
        'title'    => __( 'Réservation', 'virealys' ),
        'priority' => 40,
    ) );

    $wp_customize->add_setting( 'reservation_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( 'reservation_url', array(
        'label'   => __( 'URL de réservation', 'virealys' ),
        'section' => 'virealys_reservation',
        'type'    => 'url',
    ) );

    $wp_customize->add_setting( 'phone_number', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'phone_number', array(
        'label'   => __( 'Numéro de téléphone', 'virealys' ),
        'section' => 'virealys_reservation',
        'type'    => 'text',
    ) );

    // Social Media
    $wp_customize->add_section( 'virealys_social', array(
        'title'    => __( 'Réseaux Sociaux', 'virealys' ),
        'priority' => 50,
    ) );

    foreach ( array( 'instagram', 'facebook', 'tiktok' ) as $social ) {
        $wp_customize->add_setting( $social . '_url', array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ) );
        $wp_customize->add_control( $social . '_url', array(
            'label'   => ucfirst( $social ),
            'section' => 'virealys_social',
            'type'    => 'url',
        ) );
    }
}
add_action( 'customize_register', 'virealys_customize_register' );

/**
 * Disable emoji scripts for performance
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
