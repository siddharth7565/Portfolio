document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

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
        "I build scalable systems",
        "I'm a coffee-powered dev",
        "I love solving complex bugs",
        "Consistency is my superpower",
        "Let's create something cool"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };
    type();

    // Animated background (particles + links)
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

                // Re-seed particle count proportional to area (capped)
                const target = Math.max(28, Math.min(80, Math.floor((state.w * state.h) / 28000)));
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
                    vx: rand(-0.25, 0.25),
                    vy: rand(-0.25, 0.25),
                    r: rand(1.2, 2.8),
                    a: rand(0.12, 0.28),
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
            const draw = () => {
                ctx.clearRect(0, 0, state.w, state.h);
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';

                // Update + draw particles
                for (const p of state.particles) {
                    // Gentle mouse interaction (subtle)
                    if (state.mouse.active) {
                        const dx = p.x - state.mouse.x;
                        const dy = p.y - state.mouse.y;
                        const dist2 = dx * dx + dy * dy;
                        if (dist2 < 140 * 140) {
                            const dist = Math.sqrt(dist2) || 1;
                            const push = (140 - dist) / 140;
                            p.vx += (dx / dist) * push * 0.015;
                            p.vy += (dy / dist) * push * 0.015;
                        }
                    }

                    p.x += p.vx;
                    p.y += p.vy;

                    // Soft damping to keep it calm
                    p.vx *= 0.985;
                    p.vy *= 0.985;

                    // Wrap edges
                    if (p.x < -10) p.x = state.w + 10;
                    if (p.x > state.w + 10) p.x = -10;
                    if (p.y < -10) p.y = state.h + 10;
                    if (p.y > state.h + 10) p.y = -10;

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();

                    // Tiny colored glow
                    ctx.beginPath();
                    ctx.fillStyle = p.c;
                    ctx.globalAlpha = 0.06;
                    ctx.arc(p.x, p.y, p.r * 6.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

                // Link lines between close particles
                const maxLinkDist = 130;
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
                            ctx.lineWidth = 1;
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

    // Custom Cursor Logic (only for fine pointer + non-reduced motion)
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

    if (!reduceMotion && finePointer) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        const glow = document.querySelector('.cursor-glow');

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let glowX = 0;
        let glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update dot as well
            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }
        });

        // Lerp (Linear Interpolation) for smooth outline following
        let speed = 0;
        let angle = 0;
        let scale = 1;

        const animateCursor = () => {
            const lerp = (start, end, factor) => start + (end - start) * factor;

            // Calculate velocity and direction
            const deltaX = mouseX - outlineX;
            const deltaY = mouseY - outlineY;

            outlineX = lerp(outlineX, mouseX, 0.15);
            outlineY = lerp(outlineY, mouseY, 0.15);

            // Velocity magnitude for stretching
            const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            speed = lerp(speed, dist, 0.15);

            // Rotate towards movement direction
            if (dist > 0.1) {
                angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            }

            // Dynamic scale based on speed (stretching effect)
            scale = 1 + (speed / 150); // Adjust divisor for intensity
            const scaleY = 1 / scale; // Squish slightly while stretching

            if (cursorOutline) {
                cursorOutline.style.left = outlineX + 'px';
                cursorOutline.style.top = outlineY + 'px';

                // Apply rotation and scale
                let hoverScale = 1;
                if (document.body.classList.contains('cursor-hover')) {
                    hoverScale = 1.5;
                }

                cursorOutline.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale * hoverScale}, ${scaleY * hoverScale})`;
            }

            // Smoothed Glow Update
            if (glow) {
                glowX = lerp(glowX, mouseX, 0.04); // Even slower than outline
                glowY = lerp(glowY, mouseY, 0.04);
                glow.style.left = glowX + 'px';
                glow.style.top = glowY + 'px';
            }

            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    }

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .mobile-menu-btn, .contact-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

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
});
