document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Smooth Circle Cursor
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const isDesktop = window.innerWidth >= 769;

    if (!reduceMotion && finePointer && isDesktop) {
        const customCursor = document.querySelector('.custom-cursor');
        const cursorCircle = document.querySelector('.cursor-circle');
        const cursorDot = document.querySelector('.cursor-dot');

        if (customCursor && cursorCircle && cursorDot) {
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let circleX = mouseX;
            let circleY = mouseY;
            let dotX = mouseX;
            let dotY = mouseY;

            // Initialize positions
            cursorCircle.style.left = circleX + 'px';
            cursorCircle.style.top = circleY + 'px';
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';

            // Mouse move event listener
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Linear interpolation for smooth trailing
            const lerp = (start, end, factor) => start + (end - start) * factor;

            // Animation loop
            const animateCursor = () => {
                // Circle follows with slight delay (smooth trailing)
                circleX = lerp(circleX, mouseX, 0.15);
                circleY = lerp(circleY, mouseY, 0.15);

                // Dot follows more quickly
                dotX = lerp(dotX, mouseX, 0.4);
                dotY = lerp(dotY, mouseY, 0.4);

                // Update positions
                cursorCircle.style.left = circleX + 'px';
                cursorCircle.style.top = circleY + 'px';
                cursorDot.style.left = dotX + 'px';
                cursorDot.style.top = dotY + 'px';

                requestAnimationFrame(animateCursor);
            };

            // Start animation
            animateCursor();

            // Hover effects on interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .btn, .mobile-menu-btn, .contact-item, .project-card, .profile-card, .skill-category, .bento-item, .highlight-card');

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-hover');
                });
                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-hover');
                });
            });

            // Hide cursor when mouse leaves window
            document.addEventListener('mouseleave', () => {
                customCursor.style.opacity = '0';
            });

            document.addEventListener('mouseenter', () => {
                customCursor.style.opacity = '1';
            });
        }
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        root.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        root.classList.toggle('light-mode');
        const isLight = root.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Add a temporary animation class to the button
        themeToggle.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
        ], { duration: 300 });
    });

    // Typing Effect Logic
    const typingText = document.getElementById('typing-text');
    const phrases = [
        "Building full-stack MERN applications",
        "Designing RAG & LLM-powered systems",
        "Solving problems with DSA in C++",
        "Turning ideas into user-focused products"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 60;

    const type = () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 30;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 300;
        }

        setTimeout(type, typeSpeed);
    };
    type();

    // Animated background (particles + links) - Optimized
    const reduceMotionBg = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointerBg = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const bgCanvas = document.getElementById('bg-canvas');

    if (!reduceMotionBg && !coarsePointerBg && bgCanvas) {
        const ctx = bgCanvas.getContext('2d', { alpha: true });
        if (ctx) {
            const rootStyles = getComputedStyle(document.documentElement);
            const colorA = rootStyles.getPropertyValue('--primary').trim() || '#38bdf8';
            const colorB = rootStyles.getPropertyValue('--secondary').trim() || '#818cf8';
            const colorC = rootStyles.getPropertyValue('--tertiary').trim() || '#a855f7';

            const state = {
                w: 0,
                h: 0,
                dpr: Math.min(2, window.devicePixelRatio || 1),
                particles: [],
                mouse: { x: 0, y: 0, active: false }
            };

            const rand = (min, max) => Math.random() * (max - min) + min;

            const resize = () => {
                state.w = window.innerWidth;
                state.h = window.innerHeight;
                state.dpr = Math.min(2, window.devicePixelRatio || 1);
                bgCanvas.width = Math.floor(state.w * state.dpr);
                bgCanvas.height = Math.floor(state.h * state.dpr);
                bgCanvas.style.width = `${state.w}px`;
                bgCanvas.style.height = `${state.h}px`;
                ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

                // Slightly increased particle count for better visual
                const target = Math.max(25, Math.min(55, Math.floor((state.w * state.h) / 35000)));
                while (state.particles.length < target) addParticle();
                while (state.particles.length > target) state.particles.pop();
            };

            const pickColor = () => {
                const r = Math.random();
                if (r < 0.45) return colorA;
                if (r < 0.8) return colorB;
                return colorC;
            };

            const addParticle = () => {
                state.particles.push({
                    x: rand(0, state.w),
                    y: rand(0, state.h),
                    vx: rand(-0.15, 0.15),
                    vy: rand(-0.15, 0.15),
                    r: rand(1, 2),
                    a: rand(0.12, 0.22),
                    c: pickColor()
                });
            };

            const onMouseMove = (e) => {
                state.mouse.x = e.clientX;
                state.mouse.y = e.clientY;
                state.mouse.active = true;
            };
            const onMouseLeave = () => (state.mouse.active = false);

            window.addEventListener('resize', resize);
            document.addEventListener('mousemove', onMouseMove, { passive: true });
            document.addEventListener('mouseleave', onMouseLeave);
            resize();

            let rafId = 0;
            let lastTime = 0;
            const fps = 30; // Cap at 30fps for performance
            const interval = 1000 / fps;

            const draw = (timestamp) => {
                if (timestamp - lastTime < interval) {
                    rafId = requestAnimationFrame(draw);
                    return;
                }
                lastTime = timestamp;

                ctx.clearRect(0, 0, state.w, state.h);
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';

                // Update + draw particles
                for (const p of state.particles) {
                    // Simplified mouse interaction
                    if (state.mouse.active) {
                        const dx = p.x - state.mouse.x;
                        const dy = p.y - state.mouse.y;
                        const dist2 = dx * dx + dy * dy;
                        if (dist2 < 100 * 100) {
                            const dist = Math.sqrt(dist2) || 1;
                            const push = (100 - dist) / 100;
                            p.vx += (dx / dist) * push * 0.01;
                            p.vy += (dy / dist) * push * 0.01;
                        }
                    }

                    p.x += p.vx;
                    p.y += p.vy;

                    // Soft damping
                    p.vx *= 0.99;
                    p.vy *= 0.99;

                    // Wrap edges
                    if (p.x < -10) p.x = state.w + 10;
                    if (p.x > state.w + 10) p.x = -10;
                    if (p.y < -10) p.y = state.h + 10;
                    if (p.y > state.h + 10) p.y = -10;

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();

                    // Simplified glow
                    ctx.beginPath();
                    ctx.fillStyle = p.c;
                    ctx.globalAlpha = 0.05;
                    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

                // Link lines between close particles - slightly increased for better visual
                const maxLinkDist = 110;
                for (let i = 0; i < state.particles.length; i++) {
                    for (let j = i + 1; j < state.particles.length; j++) {
                        const a = state.particles[i];
                        const b = state.particles[j];
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < maxLinkDist) {
                            const t = 1 - d / maxLinkDist;
                            ctx.strokeStyle = `rgba(56,189,248,${0.08 * t})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }

                ctx.restore();
                rafId = requestAnimationFrame(draw);
            };

            rafId = requestAnimationFrame(draw);

            // Re-sync colors on theme toggle
            const themeToggleBtn = document.getElementById('theme-toggle');
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    const styles = getComputedStyle(document.documentElement);
                    const nextA = styles.getPropertyValue('--primary').trim() || colorA;
                    const nextB = styles.getPropertyValue('--secondary').trim() || colorB;
                    const nextC = styles.getPropertyValue('--tertiary').trim() || colorC;
                    state.particles.forEach(p => {
                        const r = Math.random();
                        p.c = r < 0.45 ? nextA : (r < 0.8 ? nextB : nextC);
                    });
                });
            }
        }
    }

    // Back to top
    const backToTop = document.getElementById('back-to-top');
    const toggleBackToTop = () => {
        if (!backToTop) return;
        if (window.scrollY > 500) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    };
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const icon = mobileMenuBtn.querySelector('i');
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');

            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-xmark', isOpen);
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            });
        });
    }

    // Scroll Reveal Animation using Intersection Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once it's revealed, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to sections and cards
    const revealElements = document.querySelectorAll('.section-title, .about-text, .stat-card, .skill-category, .service-card, .highlight-card, .project-card, .timeline-item, .cert-card, .contact-card');

    // Add hidden state initially
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Add CSS for visible state dynamically or in CSS file
    const style = document.createElement('style');
    style.innerHTML = `
        .is-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link highlight (current section)
    const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sectionIds = navAnchors
        .map(a => a.getAttribute('href'))
        .filter(Boolean)
        .map(href => href.slice(1))
        .filter(Boolean);

    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const setActiveNav = (id) => {
        navAnchors.forEach(a => {
            const isActive = a.getAttribute('href') === `#${id}`;
            a.classList.toggle('active', isActive);
        });
    };

    if (sections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

            if (visible && visible.target && visible.target.id) {
                setActiveNav(visible.target.id);
            }
        }, {
            root: null,
            threshold: [0.2, 0.35, 0.5],
            rootMargin: '-25% 0px -65% 0px'
        });

        sections.forEach(s => navObserver.observe(s));
        setActiveNav(sections[0].id);
    }


    // --- Bento Grid Spotlight Effect ---
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            item.style.setProperty('--x', `${x}px`);
            item.style.setProperty('--y', `${y}px`);
        });
    });

    // --- Resume Modal ---
    const resumeModal = document.getElementById('resume-modal');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const navResumeBtn = document.getElementById('nav-resume-btn');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const resumeIframe = document.querySelector('.resume-iframe');
    const resumeFallback = document.querySelector('.resume-fallback');

    const openModal = (e) => {
        if (e) e.preventDefault();
        resumeModal.classList.add('active');
        resumeModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Check if iframe loads or show fallback on mobile
        if (window.innerWidth < 768) {
            showFallback();
        } else {
            showIframe();
        }
    };

    const closeModal = () => {
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const showIframe = () => {
        resumeIframe.style.display = 'block';
        resumeFallback.style.display = 'none';
    };

    const showFallback = () => {
        resumeIframe.style.display = 'none';
        resumeFallback.style.display = 'flex';
    };

    // Handle iframe load error
    if (resumeIframe) {
        resumeIframe.addEventListener('error', showFallback);
    }

    // Open modal on button clicks
    if (heroResumeBtn) {
        heroResumeBtn.addEventListener('click', openModal);
    }

    if (navResumeBtn) {
        navResumeBtn.addEventListener('click', openModal);
    }

    // Close modal on close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle window resize for iframe/fallback
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (resumeModal.classList.contains('active')) {
                if (window.innerWidth < 768) {
                    showFallback();
                } else {
                    showIframe();
                }
            }
        }, 250);
    });
});
