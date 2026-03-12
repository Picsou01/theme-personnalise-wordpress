/**
 * Virealys - Main JavaScript
 * Floating adaptive navigation + immersive interactions
 */

(function () {
    'use strict';

    // --- Floating Nav Dock: scroll hide/show ---
    var navDock = document.getElementById('nav-dock');
    var lastScrollY = window.scrollY;
    var scrollDelta = 0;
    var dockHidden = false;
    var scrollTimeout = null;
    var SCROLL_THRESHOLD = 60;

    function updateDockVisibility() {
        var currentScrollY = window.scrollY;
        var diff = currentScrollY - lastScrollY;

        // At top of page, always show
        if (currentScrollY < 100) {
            showDock();
            lastScrollY = currentScrollY;
            scrollDelta = 0;
            return;
        }

        if (diff > 0) {
            // Scrolling down
            scrollDelta += diff;
            if (scrollDelta > SCROLL_THRESHOLD && !dockHidden) {
                hideDock();
            }
        } else {
            // Scrolling up
            scrollDelta = 0;
            if (dockHidden) {
                showDock();
            }
        }

        lastScrollY = currentScrollY;

        // Show dock on scroll pause
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            if (dockHidden) {
                showDock();
            }
        }, 1200);
    }

    function hideDock() {
        if (navDock) {
            navDock.classList.add('dock-hidden');
            dockHidden = true;
        }
    }

    function showDock() {
        if (navDock) {
            navDock.classList.remove('dock-hidden');
            dockHidden = false;
        }
    }

    window.addEventListener('scroll', updateDockVisibility, { passive: true });

    // --- Active section tracking via IntersectionObserver ---
    var dockLinks = document.querySelectorAll('.nav-dock-link[data-section]');
    var sections = [];

    dockLinks.forEach(function (link) {
        var sectionId = link.getAttribute('data-section');
        var section = document.getElementById(sectionId);
        if (section) {
            sections.push({ id: sectionId, el: section, link: link });
        }
    });

    if (sections.length > 0 && 'IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var sectionId = entry.target.id;
                var matchingLink = null;
                for (var i = 0; i < sections.length; i++) {
                    if (sections[i].id === sectionId) {
                        matchingLink = sections[i].link;
                        break;
                    }
                }
                if (matchingLink) {
                    if (entry.isIntersecting) {
                        // Remove active from all, set on current
                        dockLinks.forEach(function (l) { l.classList.remove('active'); });
                        matchingLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-10% 0px -40% 0px'
        });

        sections.forEach(function (s) {
            sectionObserver.observe(s.el);
        });
    }

    // --- Menu Overlay open/close ---
    var menuBtn = document.getElementById('nav-dock-menu-btn');
    var menuOverlay = document.getElementById('menu-overlay');
    var menuCloseBtn = document.getElementById('menu-overlay-close');

    function openOverlay() {
        if (menuOverlay) {
            menuOverlay.classList.add('open');
            menuOverlay.setAttribute('aria-hidden', 'false');
        }
        if (menuBtn) {
            menuBtn.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
        if (menuOverlay) {
            menuOverlay.classList.remove('open');
            menuOverlay.setAttribute('aria-hidden', 'true');
        }
        if (menuBtn) {
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
            var isOpen = menuOverlay && menuOverlay.classList.contains('open');
            if (isOpen) {
                closeOverlay();
            } else {
                openOverlay();
            }
        });
    }

    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeOverlay);
    }

    // Close overlay on nav link click
    if (menuOverlay) {
        menuOverlay.querySelectorAll('.nav-link, .overlay-nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                closeOverlay();
            });
        });
    }

    // Close overlay on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('open')) {
            closeOverlay();
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var targetTop = target.getBoundingClientRect().top + window.scrollY - 20;

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
