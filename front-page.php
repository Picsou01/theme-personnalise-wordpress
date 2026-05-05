<?php
/**
 * Front page template - Virealys Constellation OS
 */
get_header();

$reservation_url = get_theme_mod( 'reservation_url', '#reservation' );
$hero_title      = get_theme_mod( 'hero_title', 'Virealys' );
$hero_subtitle   = get_theme_mod( 'hero_subtitle', 'Restaurant slow food adaptatif: repas classique, menus gastronomiques, decors holographiques, sections par pays et option VR pour manger dans l ambiance de son choix.' );
$image_base      = get_template_directory_uri() . '/assets/images/';

if ( ! function_exists( 'virealys_front_url' ) ) {
    function virealys_front_url( $slug, $anchor ) {
        $page = get_page_by_path( $slug );
        return $page ? get_permalink( $page ) : home_url( '/#' . $anchor );
    }
}

$constellation_pages = array(
    'concept' => array(
        'title'   => get_theme_mod( 'page_concept_title', 'Concept' ),
        'summary' => get_theme_mod( 'page_concept_summary', 'Slow Food, pays evolutifs et technologie invisible autour de la table.' ),
        'icon'    => 'layers',
        'color'   => '#7dd3c7',
        'x'       => 14,
        'y'       => 50,
        'level'   => 1,
        'anchor'  => 'concept',
    ),
    'menus' => array(
        'title'   => get_theme_mod( 'page_menus_title', 'Menus' ),
        'summary' => get_theme_mod( 'page_menus_summary', 'Quatre niveaux, du repas essentiel a l experience sensorielle.' ),
        'icon'    => 'utensils',
        'color'   => '#d6a05f',
        'x'       => 86,
        'y'       => 50,
        'level'   => 1,
        'anchor'  => 'menus',
    ),
    'ambiances' => array(
        'title'   => get_theme_mod( 'page_ambiances_title', 'Pays du mois' ),
        'summary' => get_theme_mod( 'page_ambiances_summary', 'Chaque mois, decor, sons, parfums et brigade changent de destination.' ),
        'icon'    => 'globe',
        'color'   => '#8bd3ff',
        'x'       => 28,
        'y'       => 77,
        'level'   => 1,
        'anchor'  => 'pays-du-mois',
    ),
    'zones' => array(
        'title'   => get_theme_mod( 'page_zones_title', '4 Zones' ),
        'summary' => get_theme_mod( 'page_zones_summary', 'Origine, Voyage, Immersion et Sensorielle: chacun choisit son intensite.' ),
        'icon'    => 'grid',
        'color'   => '#b694ff',
        'x'       => 72,
        'y'       => 77,
        'level'   => 1,
        'anchor'  => 'zones',
    ),
    'passeport' => array(
        'title'   => get_theme_mod( 'page_passeport_title', 'Passeport' ),
        'summary' => get_theme_mod( 'page_passeport_summary', 'Des tampons virtuels qui debloquent de vraies attentions en salle.' ),
        'icon'    => 'passport',
        'color'   => '#f4b36b',
        'x'       => 50,
        'y'       => 93,
        'level'   => 2,
        'anchor'  => 'passeport',
    ),
    'reservation' => array(
        'title'   => get_theme_mod( 'page_reservation_title', 'Reserver' ),
        'summary' => get_theme_mod( 'page_reservation_summary', 'Choisissez une zone, un pays et un niveau d immersion en quelques gestes.' ),
        'icon'    => 'calendar',
        'color'   => '#6ee7b7',
        'x'       => 50,
        'y'       => 55,
        'level'   => 0,
        'anchor'  => 'reservation',
    ),
    'voyage-game' => array(
        'title'   => get_theme_mod( 'page_voyage_game_title', 'Jeu' ),
        'summary' => get_theme_mod( 'page_voyage_game_summary', 'Servez des commandes, montez l aura du passeport et revenez debloquer du reel.' ),
        'icon'    => 'gamepad',
        'color'   => '#f9d56e',
        'x'       => 50,
        'y'       => 7,
        'level'   => 2,
        'anchor'  => 'jeu',
    ),
    'saisons' => array(
        'title'   => get_theme_mod( 'page_saisons_title', 'Saisons' ),
        'summary' => get_theme_mod( 'page_saisons_summary', 'Les services successifs font evoluer le jeu, la carte et les envies de retour.' ),
        'icon'    => 'star',
        'color'   => '#fff1a8',
        'x'       => 28,
        'y'       => 23,
        'level'   => 2,
        'anchor'  => 'univers-jeu',
    ),
    'recompenses' => array(
        'title'   => get_theme_mod( 'page_recompenses_title', 'Recompenses' ),
        'summary' => get_theme_mod( 'page_recompenses_summary', 'Les visas virtuels deviennent cocktails, surprises et attentions validees en salle.' ),
        'icon'    => 'passport',
        'color'   => '#ffd0a1',
        'x'       => 72,
        'y'       => 23,
        'level'   => 2,
        'anchor'  => 'passeport',
    ),
);

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
    array( 'from' => 'voyage-game', 'to' => 'concept' ),
    array( 'from' => 'voyage-game', 'to' => 'reservation' ),
    array( 'from' => 'voyage-game', 'to' => 'passeport' ),
    array( 'from' => 'voyage-game', 'to' => 'saisons' ),
    array( 'from' => 'saisons', 'to' => 'recompenses' ),
    array( 'from' => 'saisons', 'to' => 'ambiances' ),
    array( 'from' => 'recompenses', 'to' => 'passeport' ),
    array( 'from' => 'recompenses', 'to' => 'reservation' ),
);

$zones = array(
    array( 'name' => 'Origine', 'tag' => 'Slow Food pur', 'desc' => 'Produits locaux, saison, bougie, service attentif. La porte d entree rassurante du concept.', 'price' => '35-45 EUR', 'tone' => 'origin', 'image' => 'virealys-zone-france.webp' ),
    array( 'name' => 'Voyage', 'tag' => 'Pays du mois', 'desc' => 'Decor holographique, musique, accords et narration autour de la destination en cours.', 'price' => '+10 EUR', 'tone' => 'voyage', 'image' => 'virealys-zone-asie.webp' ),
    array( 'name' => 'Immersion', 'tag' => 'VR optionnelle', 'desc' => 'Casque leger, son spatialise, scene du plat et table augmentee sans couper du reel.', 'price' => '+20 EUR', 'tone' => 'immersion', 'image' => 'virealys-zone-espace.webp' ),
    array( 'name' => 'Sensorielle', 'tag' => 'Experience totale', 'desc' => 'Parfums programmes, textures, illusions gustatives et surprises debloquees par passeport.', 'price' => 'Menu signature', 'tone' => 'sensoriel', 'image' => 'virealys-zone-italie.webp' ),
);

$menus = array(
    array( 'name' => 'Classique', 'price' => '35 EUR', 'items' => array( 'Cuisine de saison', 'Table Origine', 'Passeport cree' ) ),
    array( 'name' => 'Voyage', 'price' => '45 EUR', 'items' => array( 'Pays du mois', 'Accord boisson', 'Tampon destination' ) ),
    array( 'name' => 'Immersif', 'price' => '60 EUR', 'items' => array( 'Table augmentee', 'Scene sonore', 'Bonus jeu x2' ) ),
    array( 'name' => 'Sensoriel', 'price' => '90 EUR', 'items' => array( '7 temps', 'Effets sensoriels', 'Plat cache eligible' ) ),
);
?>

<section class="vr-constellation-hub v-classic-hero" id="vr-constellation-hub" aria-label="<?php esc_attr_e( 'Accueil Virealys', 'virealys' ); ?>">
    <div class="constellation-bg">
        <img class="v-hero-bg-img" src="<?php echo esc_url( $image_base . 'virealys-ambiance-grid.webp' ); ?>" alt="" aria-hidden="true" decoding="async" fetchpriority="high">
        <div class="constellation-stars-css" aria-hidden="true"></div>
        <?php if ( ! wp_is_mobile() ) : ?>
            <div class="constellation-nebula constellation-nebula-1"></div>
            <div class="constellation-nebula constellation-nebula-2"></div>
        <?php endif; ?>
    </div>

    <div class="constellation-hero">
        <div class="constellation-hero-content" data-reveal>
            <span class="v-fictive-notice"><?php esc_html_e( 'Site pedagogique et fictif', 'virealys' ); ?></span>
            <span class="v-eyebrow"><?php esc_html_e( 'Restaurant slow food holographique', 'virealys' ); ?></span>
            <h1 class="constellation-title"><?php echo esc_html( $hero_title ); ?></h1>
            <p class="constellation-subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>
            <div class="v-hero-facts" aria-label="<?php esc_attr_e( 'Promesse Virealys', 'virealys' ); ?>">
                <span><?php esc_html_e( '4 zones par intensite', 'virealys' ); ?></span>
                <span><?php esc_html_e( 'Pays et decor evolutifs', 'virealys' ); ?></span>
                <span><?php esc_html_e( 'VR optionnelle', 'virealys' ); ?></span>
            </div>
            <div class="constellation-actions">
                <a href="#reservation" class="btn btn-glow"><?php esc_html_e( 'Reserver une table', 'virealys' ); ?></a>
                <a href="#menus" class="btn btn-ghost"><?php esc_html_e( 'Voir les menus', 'virealys' ); ?></a>
            </div>
            <p class="constellation-hint"><?php esc_html_e( 'Desktop: clic droit maintenu pour ouvrir la roue de navigation.', 'virealys' ); ?></p>
        </div>
    </div>

    <?php if ( ! wp_is_mobile() ) : ?>
        <div class="constellation-map" aria-label="<?php esc_attr_e( 'Carte constellation Virealys', 'virealys' ); ?>">
            <div class="constellation-orbit orbit-one" aria-hidden="true"></div>
            <div class="constellation-orbit orbit-two" aria-hidden="true"></div>
            <div class="constellation-core" aria-hidden="true">
                <span>V</span>
            </div>
            <div class="constellation-ledger" aria-hidden="true">
                <span>jeu</span>
                <span>table</span>
                <span>visa</span>
                <span>retour</span>
            </div>
            <svg class="constellation-lines" id="constellation-lines" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
                <?php foreach ( $constellation_links as $link ) :
                    $from = $constellation_pages[ $link['from'] ];
                    $to   = $constellation_pages[ $link['to'] ];
                    ?>
                    <line class="constellation-link-line"
                          data-from="<?php echo esc_attr( $link['from'] ); ?>"
                          data-to="<?php echo esc_attr( $link['to'] ); ?>"
                          x1="<?php echo esc_attr( $from['x'] ); ?>"
                          y1="<?php echo esc_attr( $from['y'] ); ?>"
                          x2="<?php echo esc_attr( $to['x'] ); ?>"
                          y2="<?php echo esc_attr( $to['y'] ); ?>" />
                <?php endforeach; ?>
            </svg>

            <div class="constellation-nodes" id="constellation-nodes">
                <?php foreach ( $constellation_pages as $slug => $page_data ) :
                    $url = virealys_front_url( $slug, $page_data['anchor'] );
                    ?>
                    <a href="<?php echo esc_url( $url ); ?>"
                       class="constellation-node"
                       data-page="<?php echo esc_attr( $slug ); ?>"
                       data-level="<?php echo esc_attr( $page_data['level'] ); ?>"
                       style="--node-x:<?php echo esc_attr( $page_data['x'] ); ?>%;--node-y:<?php echo esc_attr( $page_data['y'] ); ?>%;--node-color:<?php echo esc_attr( $page_data['color'] ); ?>">
                        <span class="constellation-node-glow"></span>
                        <span class="constellation-node-ring"></span>
                        <span class="constellation-node-dot"></span>
                        <span class="constellation-node-icon"><?php echo virealys_get_constellation_icon( $page_data['icon'] ); ?></span>
                        <span class="constellation-node-label"><?php echo esc_html( $page_data['title'] ); ?></span>
                        <span class="constellation-node-expand">
                            <span class="constellation-node-summary"><?php echo esc_html( $page_data['summary'] ); ?></span>
                            <span class="constellation-node-cta"><?php esc_html_e( 'Explorer', 'virealys' ); ?></span>
                        </span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="constellation-mobile-list" id="constellation-mobile-list">
        <?php foreach ( $constellation_pages as $slug => $page_data ) : ?>
            <a href="<?php echo esc_url( virealys_front_url( $slug, $page_data['anchor'] ) ); ?>" class="constellation-mobile-card" style="--node-color:<?php echo esc_attr( $page_data['color'] ); ?>">
                <span class="constellation-mobile-icon"><?php echo virealys_get_constellation_icon( $page_data['icon'] ); ?></span>
                <span class="constellation-mobile-info">
                    <span class="constellation-mobile-title"><?php echo esc_html( $page_data['title'] ); ?></span>
                    <span class="constellation-mobile-summary"><?php echo esc_html( $page_data['summary'] ); ?></span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            </a>
        <?php endforeach; ?>
    </div>
</section>

<section class="section v-home-section v-manifesto" id="concept">
    <div class="container v-split">
        <div class="v-copy" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Le concept', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Une table, quatre intensites, un monde qui change chaque mois.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Virealys part d un vrai restaurant slow food, puis ajoute des decors holographiques, des pays culinaires et une option VR. L objectif reste simple: mieux raconter l assiette, pas faire oublier la cuisine.', 'virealys' ); ?></p>
        </div>
        <div class="v-principles" data-reveal>
            <article>
                <strong>01</strong>
                <h3><?php esc_html_e( 'Cuisine reelle', 'virealys' ); ?></h3>
                <p><?php esc_html_e( 'Produits locaux, saisonnalite et brigade visible avant tout effet visuel.', 'virealys' ); ?></p>
            </article>
            <article>
                <strong>02</strong>
                <h3><?php esc_html_e( 'Immersion choisie', 'virealys' ); ?></h3>
                <p><?php esc_html_e( 'Le client garde la main: repas normal, decor holographique, VR optionnelle ou experience sensorielle.', 'virealys' ); ?></p>
            </article>
            <article>
                <strong>03</strong>
                <h3><?php esc_html_e( 'Detail signature', 'virealys' ); ?></h3>
                <p><?php esc_html_e( 'Les hologrammes comestibles deviennent des bouchees d air aromatique: l illusion existe, mais la promesse reste honnete.', 'virealys' ); ?></p>
            </article>
        </div>
    </div>
</section>

<section class="section v-home-section v-proof" id="experience">
    <div class="container">
        <div class="v-proof-hero" data-reveal>
            <figure class="v-proof-large">
                <img src="<?php echo esc_url( $image_base . 'virealys-hero-immersive.webp' ); ?>" alt="<?php esc_attr_e( 'Ambiances immersives Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
            </figure>
            <div class="v-proof-copy">
                <span class="section-label"><?php esc_html_e( 'Slow Food holographique', 'virealys' ); ?></span>
                <h2 class="section-title"><?php esc_html_e( 'Une experience qui doit se voir, se jouer, puis se vivre en salle.', 'virealys' ); ?></h2>
                <p class="section-desc"><?php esc_html_e( 'Le site met en avant la vraie promesse: une cuisine lisible, des mondes evolutifs, un passeport qui suit le client et un jeu qui prepare la prochaine venue.', 'virealys' ); ?></p>
            </div>
        </div>
        <div class="v-proof-grid">
            <article class="v-proof-card" data-reveal>
                <img src="<?php echo esc_url( $image_base . 'virealys-plate-holo.webp' ); ?>" alt="<?php esc_attr_e( 'Plat gastronomique avec interface holographique', 'virealys' ); ?>" loading="lazy" decoding="async">
                <div>
                    <strong><?php esc_html_e( 'Assiette d abord', 'virealys' ); ?></strong>
                    <span><?php esc_html_e( 'Le visuel augmente le plat sans le remplacer.', 'virealys' ); ?></span>
                </div>
            </article>
            <article class="v-proof-card" data-reveal>
                <img src="<?php echo esc_url( $image_base . 'virealys-passport.webp' ); ?>" alt="<?php esc_attr_e( 'Passeport numerique Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
                <div>
                <strong><?php esc_html_e( 'Passeport client', 'virealys' ); ?></strong>
                <span><?php esc_html_e( 'Le QR relie visite, recompense et souvenir.', 'virealys' ); ?></span>
                </div>
            </article>
            <article class="v-proof-card" data-reveal>
                <img src="<?php echo esc_url( $image_base . 'virealys-reservation.webp' ); ?>" alt="<?php esc_attr_e( 'Reservation holographique Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
                <div>
                    <strong><?php esc_html_e( 'Reservation guidee', 'virealys' ); ?></strong>
                    <span><?php esc_html_e( 'Zone, pays, allergies et recompense eligible au meme endroit.', 'virealys' ); ?></span>
                </div>
            </article>
        </div>
    </div>
</section>

<section class="section v-home-section v-zones" id="zones">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Les 4 zones', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Du repas essentiel a l experience totale.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Chaque zone a son rythme, son niveau d immersion et ses recompenses dans le passeport.', 'virealys' ); ?></p>
        </div>
        <div class="v-zone-grid">
            <?php foreach ( $zones as $index => $zone ) : ?>
                <article class="v-zone-card" data-zone="<?php echo esc_attr( $zone['tone'] ); ?>" data-reveal>
                    <figure class="v-zone-media">
                        <img src="<?php echo esc_url( $image_base . $zone['image'] ); ?>" alt="<?php echo esc_attr( $zone['name'] ); ?>" loading="lazy" decoding="async">
                    </figure>
                    <span class="v-zone-index"><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
                    <h3><?php echo esc_html( $zone['name'] ); ?></h3>
                    <p><?php echo esc_html( $zone['desc'] ); ?></p>
                    <div class="v-zone-meta">
                        <span><?php echo esc_html( $zone['tag'] ); ?></span>
                        <span><?php echo esc_html( $zone['price'] ); ?></span>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section v-home-section v-passport" id="passeport">
    <div class="container v-split v-split-passport">
        <div class="v-passport-visual" data-reveal>
            <figure class="v-passport-real">
                <img src="<?php echo esc_url( $image_base . 'virealys-passport.webp' ); ?>" alt="<?php esc_attr_e( 'Passeport gastronomique numerique Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
            </figure>
            <div class="v-passport-card">
                <div class="v-passport-top">
                    <span>VIREALYS</span>
                    <span>NIVEAU 03</span>
                </div>
                <div class="v-passport-code">VRL-ORIGINE-742</div>
                <div class="v-passport-stamps">
                    <span class="earned">Origine</span>
                    <span class="earned">Voyage</span>
                    <span>Immersion</span>
                    <span>Sensoriel</span>
                </div>
                <div class="v-passport-reward">
                    <small><?php esc_html_e( 'Prochaine recompense reelle', 'virealys' ); ?></small>
                    <strong><?php esc_html_e( 'Cocktail Constellation offert', 'virealys' ); ?></strong>
                </div>
            </div>
        </div>
        <div class="v-copy" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Passeport virtuel + reel', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Le passeport relie la visite, la reservation et les recompenses.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Le jeu reste un divertissement bonus. Le passeport, lui, sert de fil conducteur: il garde les tampons de visite, signale les recompenses eligibles et donne une raison concrete de revenir.', 'virealys' ); ?></p>
            <div class="v-loop-steps">
                <span><?php esc_html_e( 'Jouer', 'virealys' ); ?></span>
                <span><?php esc_html_e( 'Collecter', 'virealys' ); ?></span>
                <span><?php esc_html_e( 'Reserver', 'virealys' ); ?></span>
                <span><?php esc_html_e( 'Scanner en salle', 'virealys' ); ?></span>
                <span><?php esc_html_e( 'Debloquer', 'virealys' ); ?></span>
            </div>
        </div>
    </div>
</section>

<section class="section v-home-section v-country" id="pays-du-mois">
    <div class="container v-split">
        <div class="v-copy" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Pays du mois', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Japon nocturne, produits locaux, service lyonnais.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'La destination change regulierement pour que le restaurant ne soit jamais repetitif. Le jeu annonce les ingredients a chercher, la salle revele leur version gastronomique.', 'virealys' ); ?></p>
            <figure class="v-country-media">
                <img src="<?php echo esc_url( $image_base . 'virealys-zone-asie.webp' ); ?>" alt="<?php esc_attr_e( 'Ambiance Japon nocturne Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
            </figure>
        </div>
        <div class="v-country-board" data-reveal>
            <span><?php esc_html_e( 'Quete active', 'virealys' ); ?></span>
            <h3><?php esc_html_e( 'La route du yuzu', 'virealys' ); ?></h3>
            <p><?php esc_html_e( 'Collectez yuzu, shiso et riz nacre dans le jeu. En salle, le QR du passeport debloque un amuse-bouche secret si la reservation est faite cette semaine.', 'virealys' ); ?></p>
        </div>
    </div>
</section>

<section class="section v-home-section v-game-promo" id="jeu">
    <div class="container v-split">
        <div class="v-game-orbit" data-reveal aria-hidden="true">
            <span class="v-orbit-dot dot-a"></span>
            <span class="v-orbit-dot dot-b"></span>
            <span class="v-orbit-dot dot-c"></span>
            <span class="v-boat-mark"></span>
            <div class="v-game-screen">
                <span><?php esc_html_e( 'Service vivant', 'virealys' ); ?></span>
                <strong><?php esc_html_e( 'Saison 04 - Route Yuzu', 'virealys' ); ?></strong>
                <small><?php esc_html_e( '3 commandes actives - 8 recompenses reelles - 15 astres', 'virealys' ); ?></small>
            </div>
        </div>
        <div class="v-copy" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Le Voyage des Saveurs', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Un jeu bonus pour decouvrir les zones avant de reserver.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Le bateau sert a explorer les pays, comprendre les ingredients et gagner quelques avantages. Il divertit, il fidelise, mais le coeur du site reste le restaurant.', 'virealys' ); ?></p>
            <div class="v-actions">
                <a href="<?php echo esc_url( virealys_front_url( 'voyage-game', 'jeu' ) ); ?>" class="btn btn-glow btn-lg"><?php esc_html_e( 'Jouer maintenant', 'virealys' ); ?></a>
                <a href="#reservation" class="btn btn-outline btn-lg"><?php esc_html_e( 'Transformer mes gains', 'virealys' ); ?></a>
            </div>
        </div>
    </div>
</section>

<section class="section v-home-section v-game-depth" id="univers-jeu">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Univers persistant', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Le divertissement prolonge l experience sans l envahir.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Le jeu donne de la rejouabilite: recettes, saisons, equipage et astres. Mais tout reste lisible comme un bonus de fidelisation pour un restaurant fictif.', 'virealys' ); ?></p>
        </div>
        <div class="v-template-grid">
            <article class="v-template-card" data-reveal>
                <strong><?php esc_html_e( 'Commandes en salle', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Les tables virtuelles demandent des plats precis: les servir donne visas, aura et recompenses reelles.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card" data-reveal>
                <strong><?php esc_html_e( 'Maitrise de recettes', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Les recettes peuvent etre rejouees et maitrisees, pour transformer le jeu en progression longue.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card" data-reveal>
                <strong><?php esc_html_e( 'Brigade a ameliorer', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Les visas financent la mise en place, le sommelier holographique et les couches de service.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card" data-reveal>
                <strong><?php esc_html_e( 'Saisons de retour', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Une soiree complete relance de nouvelles commandes et cree une raison naturelle de revenir.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card" data-reveal>
                <strong><?php esc_html_e( 'Equipage a recruter', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Cartographe, chef narratif, concierge et astronome changent les bonus du passeport sur la duree.', 'virealys' ); ?></p>
            </article>
            <article class="v-template-card" data-reveal>
                <strong><?php esc_html_e( 'Astres a collectionner', 'virealys' ); ?></strong>
                <p><?php esc_html_e( 'Les paliers de constellation recompensent la fidelite, la maitrise des recettes et les visites repetees.', 'virealys' ); ?></p>
            </article>
        </div>
        <div class="v-season-road" data-reveal>
            <span><?php esc_html_e( 'Boucle longue', 'virealys' ); ?></span>
            <strong><?php esc_html_e( 'Jouer une session, reserver, scanner le passeport, gagner une attention, revenir pour une nouvelle destination.', 'virealys' ); ?></strong>
            <p><?php esc_html_e( 'Cette boucle reste secondaire mais utile: elle montre l USP, donne du contenu a presenter et rend le projet plus vivant.', 'virealys' ); ?></p>
        </div>
    </div>
</section>

<section class="section v-home-section v-menus" id="menus">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Menus', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Un prix lisible, une experience modulable.', 'virealys' ); ?></h2>
        </div>
        <figure class="v-menu-showcase" data-reveal>
            <img src="<?php echo esc_url( $image_base . 'virealys-menu-holo.webp' ); ?>" alt="<?php esc_attr_e( 'Menus holographiques Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
        </figure>
        <div class="v-menu-grid">
            <?php foreach ( $menus as $menu ) : ?>
                <article class="v-menu-card" data-reveal>
                    <h3><?php echo esc_html( $menu['name'] ); ?></h3>
                    <strong><?php echo esc_html( $menu['price'] ); ?></strong>
                    <ul>
                        <?php foreach ( $menu['items'] as $item ) : ?>
                            <li><?php echo esc_html( $item ); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section v-home-section v-architecture" id="architecture">
    <div class="container">
        <div class="section-header" data-reveal>
            <span class="section-label"><?php esc_html_e( 'Architecture du projet', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Un concept pense comme une experience complete, pas comme une vitrine.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Chaque page soutient l USP: Slow Food, immersion choisie, passeport vivant, jeu rejouable et recompenses convertibles en salle.', 'virealys' ); ?></p>
        </div>
        <div class="v-architecture-grid">
            <article data-reveal><strong><?php esc_html_e( 'USP', 'virealys' ); ?></strong><span><?php esc_html_e( 'Restaurant evolutif ou le virtuel sert le gout et la fidelite.', 'virealys' ); ?></span></article>
            <article data-reveal><strong><?php esc_html_e( 'UI/UX', 'virealys' ); ?></strong><span><?php esc_html_e( 'Constellation desktop, parcours mobile vertical et appels a l action courts.', 'virealys' ); ?></span></article>
            <article data-reveal><strong><?php esc_html_e( 'Ergonomie', 'virealys' ); ?></strong><span><?php esc_html_e( 'Choix par zones, prix visibles, QR passeport et conversion claire.', 'virealys' ); ?></span></article>
            <article data-reveal><strong><?php esc_html_e( 'Compatibilite', 'virealys' ); ?></strong><span><?php esc_html_e( 'Theme responsive, images WebP legeres, canvas degradeable et contenu SEO.', 'virealys' ); ?></span></article>
            <article data-reveal><strong><?php esc_html_e( 'Benchmark', 'virealys' ); ?></strong><span><?php esc_html_e( 'Positionnement entre gastronomie, experience immersive et fidelisation gamifiee.', 'virealys' ); ?></span></article>
            <article data-reveal><strong><?php esc_html_e( 'Boucle retour', 'virealys' ); ?></strong><span><?php esc_html_e( 'Chaque visite ajoute un visa, une route et une prochaine recompense.', 'virealys' ); ?></span></article>
        </div>
    </div>
</section>

<section class="section v-home-section v-reservation" id="reservation">
    <div class="container v-reservation-shell" data-reveal>
        <div>
            <span class="section-label"><?php esc_html_e( 'Reservation', 'virealys' ); ?></span>
            <h2 class="section-title"><?php esc_html_e( 'Choisissez votre voyage en moins d une minute.', 'virealys' ); ?></h2>
            <p class="section-desc"><?php esc_html_e( 'Le vrai tunnel de reservation doit connecter date, zone, allergies, passeport et recompense eligible. Cette page prepare deja le parcours.', 'virealys' ); ?></p>
        </div>
        <div class="v-reservation-side">
            <figure class="v-reservation-media">
                <img src="<?php echo esc_url( $image_base . 'virealys-reservation.webp' ); ?>" alt="<?php esc_attr_e( 'Interface de reservation Virealys', 'virealys' ); ?>" loading="lazy" decoding="async">
            </figure>
            <div class="v-reservation-panel">
                <span><?php esc_html_e( '1. Zone', 'virealys' ); ?></span>
                <span><?php esc_html_e( '2. Date', 'virealys' ); ?></span>
                <span><?php esc_html_e( '3. Passeport', 'virealys' ); ?></span>
                <a href="<?php echo esc_url( $reservation_url ); ?>" class="btn btn-glow"><?php esc_html_e( 'Reserver', 'virealys' ); ?></a>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
