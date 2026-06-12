// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav') || document.querySelector('nav');

let mobileOverlay = document.querySelector('.mobile-overlay');
if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.prepend(mobileOverlay);
}

function closeMobileMenu() {
    if (nav) nav.classList.remove('active');
    if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        const isActive = nav.classList.toggle('active');
        menuToggle.classList.toggle('active', isActive);
        menuToggle.setAttribute('aria-expanded', String(isActive));
        mobileOverlay.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);
}

document.querySelectorAll('nav ul li a, nav .nav-cta, .main-nav .nav-cta').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Active nav link for subpages
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav ul li a, .main-nav ul li a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('#')[0] || 'index.html';
    const isHome = (currentPage === '' || currentPage === 'index.html') && (linkPage === 'index.html' || linkPage === '');
    const isMatch = linkPage === currentPage || isHome;
    link.classList.toggle('active', isMatch && !href.includes('#'));
});

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerH = document.querySelector('.site-header, header')?.offsetHeight || 80;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// Header scroll effect
const header = document.querySelector('.site-header') || document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    }, { passive: true });
}

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stat counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const count = parseInt(el.dataset.count, 10);
        if (!count) return;
        const suffix = el.textContent.replace(/[\d]/g, '').trim();
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * count) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = count + suffix;
        }
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => statObserver.observe(el));

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn = contactForm.querySelector('.submit-btn') || contactForm.querySelector('[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const inputs = contactForm.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement?.classList.add('focused'));
        input.addEventListener('blur', () => {
            if (!input.value) input.parentElement?.classList.remove('focused');
        });
        if (input.value) input.parentElement?.classList.add('focused');
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!submitBtn) return;

        const originalText = btnText ? btnText.textContent : submitBtn.textContent;

        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';
        const subjectEl = document.getElementById('subject');
        const subject = subjectEl ? subjectEl.value : '';

        inputs.forEach(input => {
            input.classList.remove('error');
            input.parentElement?.querySelector('.error-message')?.remove();
        });

        let hasError = false;

        if (!name) { showError(document.getElementById('name'), 'Name is required'); hasError = true; }
        if (!email) {
            showError(document.getElementById('email'), 'Email is required');
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(document.getElementById('email'), 'Please enter a valid email address');
            hasError = true;
        }
        if (!phone) {
            showError(document.getElementById('phone'), 'Phone number is required');
            hasError = true;
        } else if (!/^[\d\s+\-()]+$/.test(phone) || phone.replace(/\D/g, '').length < 10) {
            showError(document.getElementById('phone'), 'Please enter a valid phone number');
            hasError = true;
        }
        if (subjectEl && !subject) {
            showError(subjectEl, 'Please select a subject');
            hasError = true;
        }
        if (!message) {
            showError(document.getElementById('message'), 'Message is required');
            hasError = true;
        }

        if (hasError) {
            submitBtn.style.animation = 'shake 0.5s ease';
            setTimeout(() => { submitBtn.style.animation = ''; }, 500);
            return;
        }

        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
            showSuccessMessage();
            contactForm.reset();
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = originalText;
            submitBtn.style.opacity = '1';
        }, 1500);
    });
}

function showError(input, message) {
    if (!input) return;
    input.classList.add('error');
    const field = input.closest('.form-group, .form-group-modern') || input.parentElement;
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    field?.appendChild(errorMsg);
}

function showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✓</span>
            <div>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
        </div>`;
    successMsg.style.cssText = `
        position:fixed;top:100px;right:20px;
        background:linear-gradient(135deg,#10b981,#1d4ed8);
        color:white;padding:1.5rem 2rem;border-radius:16px;
        box-shadow:0 10px 40px rgba(16,185,129,0.4);
        z-index:10000;animation:slideInRight 0.5s ease;max-width:400px;`;
    const content = successMsg.querySelector('.success-content');
    content.style.cssText = 'display:flex;align-items:center;gap:1rem;';
    successMsg.querySelector('.success-icon').style.cssText = `
        font-size:1.5rem;background:rgba(255,255,255,0.2);
        width:48px;height:48px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;flex-shrink:0;`;
    successMsg.querySelector('h4').style.margin = '0 0 0.35rem';
    successMsg.querySelector('p').style.cssText = 'margin:0;opacity:0.95;font-size:0.9rem;';
    document.body.appendChild(successMsg);
    setTimeout(() => {
        successMsg.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => successMsg.remove(), 500);
    }, 5000);
}

// Animations + error styles
if (!document.getElementById('rw-anim-styles')) {
    const style = document.createElement('style');
    style.id = 'rw-anim-styles';
    style.textContent = `
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes fadeOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(80px)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(80px)} to{opacity:1;transform:translateX(0)} }
    `;
    document.head.appendChild(style);
}

// Hero Slider
function initHeroSliders() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.hero-slider').forEach(slider => {
        const track = slider.querySelector('.hero-slider-track');
        const slides = slider.querySelectorAll('.hero-slide');
        const dotsContainer = slider.querySelector('.slider-dots');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const autoplayMs = parseInt(slider.dataset.autoplay, 10) || 6000;

        if (!track || slides.length === 0) return;

        let current = 0;
        let autoplayTimer = null;
        let touchStartX = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer?.appendChild(dot);
        });

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === current);
                slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === current);
                dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
            });
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAutoplay() {
            if (prefersReducedMotion || slides.length < 2) return;
            stopAutoplay();
            autoplayTimer = setInterval(next, autoplayMs);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        prevBtn?.addEventListener('click', () => { prev(); startAutoplay(); });
        nextBtn?.addEventListener('click', () => { next(); startAutoplay(); });

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', stopAutoplay);
        slider.addEventListener('focusout', (e) => {
            if (!slider.contains(e.relatedTarget)) startAutoplay();
        });

        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); startAutoplay(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); startAutoplay(); }
        });

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
            startAutoplay();
        }, { passive: true });

        slider.setAttribute('tabindex', '0');
        goTo(0);
        startAutoplay();
    });
}

initHeroSliders();

// Image fallback
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
        const ph = document.createElement('div');
        ph.style.cssText = `
            display:flex;align-items:center;justify-content:center;
            background:#e2e8f0;color:#64748b;font-size:0.85rem;border-radius:8px;`;
        if (this.id === 'logo-img') {
            ph.textContent = 'Recruitiva World';
            ph.style.cssText += 'height:52px;padding:0 1rem;font-weight:700;color:#0f2744;';
        } else if (this.id === 'abhi-img') {
            ph.textContent = 'AK';
            ph.style.cssText += 'width:100%;height:100%;border-radius:50%;font-size:2rem;font-weight:800;';
        } else {
            ph.textContent = 'Image';
            ph.style.width = this.width ? this.width + 'px' : '100%';
            ph.style.height = (this.height || 200) + 'px';
        }
        this.replaceWith(ph);
    }, { once: true });
});
