</main>

<footer class="site-footer" id="contact">
    <div class="footer-glow"></div>
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col footer-brand">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-text">VIREALYS</a>
                <p class="footer-tagline"><?php echo esc_html( get_theme_mod( 'footer_tagline', 'Voyagez sans quitter votre table.' ) ); ?></p>
                <div class="footer-social">
                    <?php if ( get_theme_mod( 'instagram_url' ) ) : ?>
                        <a href="<?php echo esc_url( get_theme_mod( 'instagram_url' ) ); ?>" target="_blank" rel="noopener" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( get_theme_mod( 'facebook_url' ) ) : ?>
                        <a href="<?php echo esc_url( get_theme_mod( 'facebook_url' ) ); ?>" target="_blank" rel="noopener" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( get_theme_mod( 'tiktok_url' ) ) : ?>
                        <a href="<?php echo esc_url( get_theme_mod( 'tiktok_url' ) ); ?>" target="_blank" rel="noopener" aria-label="TikTok">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <div class="footer-col">
                <h4>Explorer</h4>
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'menu_class'     => 'footer-links',
                    'fallback_cb'    => 'virealys_footer_fallback',
                    'depth'          => 1,
                ) );
                ?>
            </div>

            <div class="footer-col">
                <h4>Horaires</h4>
                <ul class="footer-links">
                    <?php
                    $hours = get_theme_mod( 'footer_hours', "Mar - Sam : 19h - 23h\nDim : 12h - 14h30\nLundi : Fermé" );
                    $hours_lines = explode( "\n", $hours );
                    foreach ( $hours_lines as $line ) :
                        $line = trim( $line );
                        if ( $line ) :
                    ?>
                        <li><?php echo esc_html( $line ); ?></li>
                    <?php endif; endforeach; ?>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Contact</h4>
                <ul class="footer-links">
                    <?php if ( get_theme_mod( 'phone_number' ) ) : ?>
                        <li><a href="tel:<?php echo esc_attr( get_theme_mod( 'phone_number' ) ); ?>"><?php echo esc_html( get_theme_mod( 'phone_number' ) ); ?></a></li>
                    <?php endif; ?>
                    <li><a href="mailto:<?php echo esc_attr( get_theme_mod( 'email', 'contact@virealys.com' ) ); ?>"><?php echo esc_html( get_theme_mod( 'email', 'contact@virealys.com' ) ); ?></a></li>
                    <?php if ( get_theme_mod( 'address' ) ) : ?>
                        <li><?php echo esc_html( get_theme_mod( 'address' ) ); ?></li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> Virealys. Tous droits r&eacute;serv&eacute;s.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
