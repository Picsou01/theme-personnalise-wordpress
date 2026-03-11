/**
 * Virealys - Main JavaScript
 * Smooth, minimal, immersive interactions
 */

(function () {
    'use strict';

    // --- Header scroll effect ---
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    function onScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close nav on link click
        mainNav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var headerHeight = header ? header.offsetHeight : 0;
            var targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        });
    });

    // --- Reveal on scroll (Intersection Observer) ---
    var revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // --- Particles in hero ---
    var particlesContainer = document.getElementById('hero-particles');

    if (particlesContainer) {
        var particleCount = 30;

        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';

            var x = Math.random() * 100;
            var delay = Math.random() * 8;
            var duration = 6 + Math.random() * 8;
            var size = 1 + Math.random() * 2;

            particle.style.cssText =
                'left:' + x + '%;' +
                'bottom:-10px;' +
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'animation-delay:' + delay + 's;' +
                'animation-duration:' + duration + 's;';

            // Alternate colors
            if (i % 3 === 1) {
                particle.style.background = '#a855f7';
                particle.style.boxShadow = '0 0 6px rgba(168,85,247,0.5)';
            } else if (i % 3 === 2) {
                particle.style.background = '#4d7cff';
                particle.style.boxShadow = '0 0 6px rgba(77,124,255,0.5)';
            }

            particlesContainer.appendChild(particle);
        }
    }

    // --- Interactive glow effect on menu cards ---
    document.querySelectorAll('.menu-card, .zone-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var glow = card.querySelector('.menu-card-glow');
            if (glow) {
                glow.style.background =
                    'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(0,229,255,0.06), transparent 60%)';
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function () {
            var glow = card.querySelector('.menu-card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });

    // --- Passport card tilt effect ---
    var passportCard = document.querySelector('.passport-card');

    if (passportCard) {
        passportCard.addEventListener('mousemove', function (e) {
            var rect = passportCard.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width;
            var y = (e.clientY - rect.top) / rect.height;

            var rotateX = (0.5 - y) * 12;
            var rotateY = (x - 0.5) * 12;

            passportCard.style.transform =
                'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });

        passportCard.addEventListener('mouseleave', function () {
            passportCard.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
            passportCard.style.transition = 'transform 0.5s ease-out';
        });

        passportCard.addEventListener('mouseenter', function () {
            passportCard.style.transition = 'none';
        });
    }

})();
