<?php
/**
 * Main template file
 */
get_header();
?>

<section class="v-page-hero">
    <div class="container v-page-hero-grid">
        <div data-reveal>
            <span class="section-label"><?php esc_html_e( 'Carnet de bord', 'virealys' ); ?></span>
            <h1 class="v-page-title"><?php esc_html_e( 'Les routes Virealys', 'virealys' ); ?></h1>
            <p class="v-page-desc"><?php esc_html_e( 'Actualites, pays du mois, quetes du passeport et evolutions du restaurant.', 'virealys' ); ?></p>
        </div>
        <div class="v-page-mini-map" data-reveal aria-hidden="true">
            <span class="v-mini-star">News</span>
            <span class="v-mini-star">Pays</span>
            <span class="v-mini-star">Visa</span>
            <span class="v-mini-star">Jeu</span>
        </div>
    </div>
</section>

<section class="section section-page v-page-body">
    <div class="container">
        <?php if ( have_posts() ) : ?>
            <div class="posts-grid">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="post-card-image">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail( 'virealys-card' ); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        <div class="post-card-content">
                            <h2 class="post-card-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h2>
                            <div class="post-card-excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                            <a href="<?php the_permalink(); ?>" class="btn btn-outline btn-sm">Lire la suite</a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <div class="pagination">
                <?php
                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => '&larr;',
                    'next_text' => '&rarr;',
                ) );
                ?>
            </div>
        <?php else : ?>
            <p class="no-posts"><?php esc_html_e( 'Aucun contenu pour le moment.', 'virealys' ); ?></p>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
