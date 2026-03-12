<?php
/**
 * Front page template - Constellation Hub
 * v5.0 - Bird's-eye constellation map as the home experience
 */
get_header();

$hero_title    = get_theme_mod( 'hero_title', 'Voyagez sans quitter votre table' );
$hero_subtitle = get_theme_mod( 'hero_subtitle', 'Le premier restaurant Slow Food immersif & évolutif' );
$hero_bg       = get_theme_mod( 'hero_bg', '' );
$reservation   = get_theme_mod( 'reservation_url', '#reservation' );

// Constellation pages data — all editable via Customizer
$constellation_pages = array(
    'concept' => array(
        'title'   => get_theme_mod( 'page_concept_title', 'Le Concept' ),
        'summary' => get_theme_mod( 'page_concept_summary', 'Découvrez comment Virealys fusionne gastronomie slow food et technologie immersive pour réinventer l\'expérience culinaire.' ),
        'icon'    => 'layers',
        'color'   => '#00e5ff',
        'x'       => 18,
        'y'       => 40,
        'level'   => 1,
    ),
    'menus' => array(
        'title'   => get_theme_mod( 'page_menus_title', 'Nos Formules' ),
        'summary' => get_theme_mod( 'page_menus_summary', 'Du dîner classique à l\'immersion totale — quatre formules pour vivre l\'expérience à votre mesure.' ),
        'icon'    => 'utensils',
        'color'   => '#4d7cff',
        'x'       => 82,
        'y'       => 40,
        'level'   => 1,
    ),
    'ambiances' => array(
        'title'   => get_theme_mod( 'page_ambiances_title', 'Les Ambiances' ),
        'summary' => get_theme_mod( 'page_ambiances_summary', 'Quatre univers sensoriels uniques — Japon, Paris, Italie, Cosmos. Choisissez votre voyage.' ),
        'icon'    => 'globe',
        'color'   => '#a855f7',
        'x'       => 28,
        'y'       => 70,
        'level'   => 1,
    ),
    'zones' => array(
        'title'   => get_theme_mod( 'page_zones_title', 'Les 4 Zones' ),
        'summary' => get_theme_mod( 'page_zones_summary', 'Origine, Voyage, Immersion, Sensorielle — quatre niveaux d\'expérience pour personnaliser votre soirée.' ),
        'icon'    => 'grid',
        'color'   => '#e040fb',
        'x'       => 72,
        'y'       => 70,
        'level'   => 1,
    ),
    'passeport' => array(
        'title'   => get_theme_mod( 'page_passeport_title', 'Le Passeport' ),
        'summary' => get_theme_mod( 'page_passeport_summary', 'Votre passeport numérique vous accompagne. Collectionnez les tampons, débloquez des expériences exclusives.' ),
        'icon'    => 'passport',
        'color'   => '#f97316',
        'x'       => 50,
        'y'       => 85,
        'level'   => 2,
    ),
    'reservation' => array(
        'title'   => get_theme_mod( 'page_reservation_title', 'Réserver' ),
        'summary' => get_theme_mod( 'page_reservation_summary', 'Réservez votre table et choisissez votre niveau d\'immersion. L\'aventure commence ici.' ),
        'icon'    => 'calendar',
        'color'   => '#10b981',
        'x'       => 50,
        'y'       => 50,
        'level'   => 0,
    ),
);

// Hierarchy links between pages
$constellation_links = array(
    array( 'from' => 'reservation', 'to' => 'concept' ),
    array( 'from' => 'reservation', 'to' => 'menus' ),
    array( 'from' => 'reservation', 'to' => 'ambiances' ),
    array( 'from' => 'reservation', 'to' => 'zones' ),
    array( 'from' => 'concept', 'to' => 'zones' ),
    array( 'from' => 'concept', 'to' => 'ambiances' ),
    array( 'from' => 'menus', 'to' => 'zones' ),
    array( 'from' => 'ambiances', 'to' => 'passeport' ),
    array( 'from' => 'zones', 'to' => 'passeport' ),
);
?>

<!-- CONSTELLATION HUB -->
<div class="vr-constellation-hub" id="vr-constellation-hub">
    <!-- Animated background -->
    <div class="constellation-bg">
        <div class="constellation-stars" id="constellation-stars"></div>
        <div class="constellation-nebula constellation-nebula-1"></div>
        <div class="constellation-nebula constellation-nebula-2"></div>
        <div class="constellation-nebula constellation-nebula-3"></div>
    </div>

    <!-- Hero overlay with title -->
    <div class="constellation-hero">
        <div class="constellation-hero-content" data-reveal>
            <h1 class="constellation-title"><?php echo esc_html( $hero_title ); ?></h1>
            <p class="constellation-subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>
            <p class="constellation-hint"><?php echo esc_html( get_theme_mod( 'constellation_hint', 'Explorez la constellation ou maintenez le clic droit pour naviguer' ) ); ?></p>
        </div>
    </div>

    <!-- SVG lines between nodes -->
    <svg class="constellation-lines" id="constellation-lines" aria-hidden="true">
        <?php foreach ( $constellation_links as $link ) :
            $from = $constellation_pages[ $link['from'] ];
            $to   = $constellation_pages[ $link['to'] ];
        ?>
            <line class="constellation-link-line"
                  data-from="<?php echo esc_attr( $link['from'] ); ?>"
                  data-to="<?php echo esc_attr( $link['to'] ); ?>"
                  x1="<?php echo esc_attr( $from['x'] ); ?>%"
                  y1="<?php echo esc_attr( $from['y'] ); ?>%"
                  x2="<?php echo esc_attr( $to['x'] ); ?>%"
                  y2="<?php echo esc_attr( $to['y'] ); ?>%"
                  stroke="rgba(0,229,255,0.12)"
                  stroke-width="1"
                  stroke-dasharray="4 4" />
        <?php endforeach; ?>
    </svg>

    <!-- Constellation nodes -->
    <div class="constellation-nodes" id="constellation-nodes">
        <?php foreach ( $constellation_pages as $slug => $page_data ) :
            $wp_page = get_page_by_path( $slug );
            $url = $wp_page ? get_permalink( $wp_page ) : home_url( '/' . $slug . '/' );
            $thumb = $wp_page && has_post_thumbnail( $wp_page ) ? get_the_post_thumbnail_url( $wp_page, 'virealys-card' ) : '';
        ?>
            <a href="<?php echo esc_url( $url ); ?>"
               class="constellation-node"
               data-page="<?php echo esc_attr( $slug ); ?>"
               data-level="<?php echo esc_attr( $page_data['level'] ); ?>"
               style="--node-x: <?php echo esc_attr( $page_data['x'] ); ?>%;
                      --node-y: <?php echo esc_attr( $page_data['y'] ); ?>%;
                      --node-color: <?php echo esc_attr( $page_data['color'] ); ?>;">
                <span class="constellation-node-glow"></span>
                <span class="constellation-node-ring"></span>
                <span class="constellation-node-dot"></span>
                <span class="constellation-node-icon"><?php echo virealys_get_constellation_icon( $page_data['icon'] ); ?></span>
                <span class="constellation-node-label"><?php echo esc_html( $page_data['title'] ); ?></span>
                <span class="constellation-node-expand">
                    <?php if ( $thumb ) : ?>
                        <img src="<?php echo esc_url( $thumb ); ?>" alt="" class="constellation-node-thumb" loading="lazy">
                    <?php endif; ?>
                    <span class="constellation-node-summary"><?php echo esc_html( $page_data['summary'] ); ?></span>
                    <span class="constellation-node-cta">Explorer &rarr;</span>
                </span>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<?php get_footer(); ?>
