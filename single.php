<?php
/**
 * Single post template
 */
get_header();
?>

<section class="v-page-hero">
    <div class="container v-page-hero-grid">
        <?php while ( have_posts() ) : the_post(); ?>
        <div data-reveal>
            <span class="section-label"><?php echo esc_html( get_the_date() ); ?></span>
            <h1 class="v-page-title"><?php the_title(); ?></h1>
        </div>
        <div class="v-page-mini-map" data-reveal aria-hidden="true">
            <span class="v-mini-star">Lire</span>
            <span class="v-mini-star">Jouer</span>
            <span class="v-mini-star">Visa</span>
            <span class="v-mini-star">Table</span>
        </div>
        <?php endwhile; rewind_posts(); ?>
    </div>
</section>

<section class="section section-page v-page-body">
    <div class="container container-narrow">
        <?php while ( have_posts() ) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="post-featured-image">
                        <?php the_post_thumbnail( 'virealys-hero' ); ?>
                    </div>
                <?php endif; ?>

                <div class="post-content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</section>

<?php get_template_part( 'template-parts/constellation-return' ); ?>

<?php get_footer(); ?>
