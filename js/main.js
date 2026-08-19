/**
 * THE AMBER GLOW CAFE AJMER — MAIN JAVASCRIPT
 * Warm • Elegant • Cozy • Premium • Magical
 */

// 1. Central Business Configuration
const business = {
    name: "The Amber Glow Cafe",
    category: "Café",
    phone: "+91 1234567890",
    phoneLink: "tel:+911234567890",
    address: "Ajmer, Rajasthan, India",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ajmer+Rajasthan+India"
};

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initFairyLightsCanvas();
    initTestimonials();
    initContactForm();
    highlightActiveNav();
});

// 2. Navbar Scroll Behavior
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// 3. Mobile Navigation Drawer & Overlay
function initMobileNav() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !mobileNav || !overlay) return;

    const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
        mobileNav.classList.toggle('open', isOpen);
        overlay.classList.toggle('open', isOpen);
        toggleBtn.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen);
    };

    toggleBtn.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(false));

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            toggleMenu(false);
        }
    });
}

// 4. Highlight Active Navigation Item
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 5. Scroll Reveal with Intersection Observer
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('revealed'));
    }
}

// 6. Ambient Fairy Lights Particle Canvas Effect
function initFairyLightsCanvas() {
    const canvas = document.getElementById('fairyLightsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 35), 45);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = -Math.random() * 0.45 - 0.15;
            this.baseAlpha = Math.random() * 0.5 + 0.3;
            this.alpha = this.baseAlpha;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseAngle = Math.random() * Math.PI * 2;
            this.color = Math.random() > 0.3 ? '#D9A441' : '#F4C76B';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulseAngle += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.25;

            if (this.y < -10) this.y = height + 10;
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let animationFrame;
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrame = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });
}

// 7. Testimonials Carousel
function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    let autoPlayInterval = null;

    // Create navigation dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Slide ${idx + 1}`);
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    const updateDots = () => {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Auto Play with Pause on Hover
    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5500);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    };

    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        carousel.addEventListener('touchstart', stopAutoPlay, { passive: true });
        carousel.addEventListener('touchend', startAutoPlay, { passive: true });
    }

    startAutoPlay();
}

// 8. Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName');
        const phone = document.getElementById('contactPhone');
        const message = document.getElementById('contactMessage');
        let isValid = true;

        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        } else {
            clearError(name);
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showError(phone, 'Please enter a valid 10-digit Indian phone number');
            isValid = false;
        } else {
            clearError(phone);
        }

        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else {
            clearError(message);
        }

        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                contactForm.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; animation: fadeInScale 0.4s ease;">
                        <div class="success-icon">✓</div>
                        <h3 style="color: var(--cream); margin-bottom: 12px;">Message Received ✨</h3>
                        <p style="color: var(--beige); margin-bottom: 24px;">Thank you, ${escapeHtml(name.value.trim())}! We have received your inquiry and will contact you promptly.</p>
                        <a href="index.html" class="btn btn-secondary">Back to Home</a>
                    </div>
                `;
            }, 700);
        }
    });
}

function showError(input, msg) {
    input.classList.add('is-invalid');
    let err = input.nextElementSibling;
    if (err && err.classList.contains('form-error')) {
        err.textContent = msg;
    }
}

function clearError(input) {
    input.classList.remove('is-invalid');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
