// ==========================================
// MVPVU - Clean Interactive JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initRevealAnimations();
    initCountUp();
    initSmoothScroll();
    initContactForm();
    initActiveNav();
});

// --- Navbar scroll behavior ---
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// --- Mobile menu ---
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-open');

        if (isOpen) {
            navLinks.classList.remove('mobile-open');
            if (navButtons) navButtons.classList.remove('mobile-open');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            navLinks.classList.add('mobile-open');
            if (navButtons) navButtons.classList.add('mobile-open');
            menuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            if (navButtons) navButtons.classList.remove('mobile-open');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('mobile-open');
            if (navButtons) navButtons.classList.remove('mobile-open');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// --- Scroll reveal animations ---
function initRevealAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Count up animation ---
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                observer.unobserve(el);

                if (prefersReducedMotion) {
                    el.textContent = formatNumber(target);
                    return;
                }

                animateCount(el, target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCount(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        const current = Math.round(eased * target);

        el.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function formatNumber(num) {
    if (num >= 1000) {
        const k = num / 1000;
        return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K+';
    }
    return num.toLocaleString() + '+';
}

// --- Smooth scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const navHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// --- Contact form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';

        // Simulate submission
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '#37613E';

            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 2500);
        }, 1500);
    });
}

// --- Active nav link highlighting ---
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}
