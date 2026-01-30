// ==========================================
// MVPVU - Premium Interactive JavaScript v2.0
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initCountUp();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
    initStepsProgress();
    initParallax();
});

// ==========================================
// Navbar Scroll Effect
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// ==========================================
// Mobile Menu Toggle
// ==========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    let isOpen = false;

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        isOpen = !isOpen;

        if (isOpen) {
            navLinks.style.cssText = `
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                padding: 24px var(--container-padding);
                gap: 20px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                animation: slideDown 0.3s ease;
            `;
            menuBtn.classList.add('active');

            // Animate menu items
            navLinks.querySelectorAll('a').forEach((link, i) => {
                link.style.animation = `fadeInUp 0.3s ease ${i * 0.05}s forwards`;
                link.style.opacity = '0';
            });
        } else {
            navLinks.style.cssText = '';
            menuBtn.classList.remove('active');
        }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen && window.innerWidth <= 768) {
                isOpen = false;
                navLinks.style.cssText = '';
                menuBtn.classList.remove('active');
            }
        });
    });

    // Close on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isOpen) {
            isOpen = false;
            navLinks.style.cssText = '';
            menuBtn.classList.remove('active');
        }
    });
}

// ==========================================
// Animated Number Counter
// ==========================================
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCount = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 2500;
        const startTime = performance.now();
        const startValue = 0;

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

            el.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(updateCount);
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            const formatted = (num / 1000);
            return formatted % 1 === 0 ? formatted.toFixed(0) + 'K' : formatted.toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach((counter, index) => {
                    setTimeout(() => animateCount(counter), index * 150);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// ==========================================
// Scroll Animations
// ==========================================
function initScrollAnimations() {
    // Elements to animate
    const animateElements = [
        '.bento-card',
        '.value-card',
        '.step',
        '.testimonial-card',
        '.about-card',
        '.contact-item'
    ];

    const elementsToAnimate = document.querySelectorAll(animateElements.join(', '));

    // Set initial state
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = Array.from(el.parentElement.children).indexOf(el) * 100;

                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elementsToAnimate.forEach(el => observer.observe(el));

    // Animate section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sectionHeaders.forEach(header => headerObserver.observe(header));
}

// ==========================================
// Smooth Scrolling
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// Contact Form Handling
// ==========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Add focus effects
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        // Loading state
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
            </svg>
            Sending...
        `;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';

        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success state
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Message Sent!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.4)';

        form.reset();

        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.background = '';
            submitBtn.style.boxShadow = '';
        }, 3000);
    });
}

// ==========================================
// Steps Progress Line Animation
// ==========================================
function initStepsProgress() {
    const stepsContainer = document.querySelector('.steps-container');
    const progressLine = document.querySelector('.line-progress');

    if (!stepsContainer || !progressLine) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    progressLine.style.width = '100%';
                }, 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(stepsContainer);
}

// ==========================================
// Parallax Effects
// ==========================================
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const floatingElements = document.querySelectorAll('.floating-element');

    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Parallax for orbs
                orbs.forEach((orb, index) => {
                    const speed = 0.1 + (index * 0.05);
                    orb.style.transform = `translateY(${scrollY * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ==========================================
// Intersection Observer for Active Nav
// ==========================================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -66% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

initActiveNav();

// ==========================================
// Add Styles for Animations
// ==========================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-links a.active {
        color: var(--primary-500) !important;
    }

    .nav-links a.active::after {
        width: 100% !important;
    }

    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }

    .form-group.focused label {
        color: var(--primary-500);
    }

    .spinner {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

// ==========================================
// Performance: Reduce Motion Support
// ==========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');

    // Disable animations
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ==========================================
// Lazy Load Images (Future Use)
// ==========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

// ==========================================
// Cursor Glow Effect (Optional - Desktop Only)
// ==========================================
function initCursorGlow() {
    if (window.innerWidth < 1024 || prefersReducedMotion.matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(125, 73, 150, 0.06) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// Uncomment to enable cursor glow effect
// initCursorGlow();

console.log('MVPVU Website Initialized');
