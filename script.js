// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

// Create mobile overlay if it doesn't exist
let mobileOverlay = document.querySelector('.mobile-overlay');
if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isActive = nav.classList.toggle('active');
        menuToggle.classList.toggle('active', isActive);
        mobileOverlay.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('nav ul li a, nav .nav-cta');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Set active navigation based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinksAll = document.querySelectorAll('nav ul li a');
navLinksAll.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Smooth scroll for anchor links (only on same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Contact Form Handling with Modern Feedback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Add floating label effect
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        const subject = document.getElementById('subject') ? document.getElementById('subject').value : '';
        const company = document.getElementById('company') ? document.getElementById('company').value.trim() : '';
        
        // Remove previous error states
        inputs.forEach(input => {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        let hasError = false;
        
        // Validation
        if (!name) {
            showError(document.getElementById('name'), 'Name is required');
            hasError = true;
        }
        
        if (!email) {
            showError(document.getElementById('email'), 'Email is required');
            hasError = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError(document.getElementById('email'), 'Please enter a valid email address');
                hasError = true;
            }
        }
        
        if (!phone) {
            showError(document.getElementById('phone'), 'Phone number is required');
            hasError = true;
        } else {
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(phone) || phone.length < 10) {
                showError(document.getElementById('phone'), 'Please enter a valid phone number');
                hasError = true;
            }
        }
        
        if (document.getElementById('subject') && !subject) {
            showError(document.getElementById('subject'), 'Please select a subject');
            hasError = true;
        }
        
        if (!message) {
            showError(document.getElementById('message'), 'Message is required');
            hasError = true;
        }
        
        if (hasError) {
            submitBtn.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                submitBtn.style.animation = '';
            }, 500);
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showSuccessMessage();
            contactForm.reset();
            
            // Reset button
            submitBtn.disabled = false;
            btnText.textContent = originalText;
            submitBtn.style.opacity = '1';
        }, 1500);
    });
}

function showError(input, message) {
    input.classList.add('error');
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    errorMsg.style.color = '#ef4444';
    errorMsg.style.fontSize = '0.875rem';
    errorMsg.style.marginTop = '0.5rem';
    errorMsg.style.animation = 'fadeIn 0.3s ease';
    input.parentElement.appendChild(errorMsg);
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
        </div>
    `;
    successMsg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    
    const successContent = successMsg.querySelector('.success-content');
    successContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    const successIcon = successMsg.querySelector('.success-icon');
    successIcon.style.cssText = `
        font-size: 2rem;
        background: rgba(255, 255, 255, 0.2);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    successMsg.querySelector('h4').style.cssText = `
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    `;
    
    successMsg.querySelector('p').style.cssText = `
        margin: 0;
        opacity: 0.95;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            successMsg.remove();
        }, 500);
    }, 5000);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    .form-group-modern input.error,
    .form-group-modern textarea.error,
    .select-wrapper select.error {
        border-color: #ef4444;
        background: #fef2f2;
    }
`;
document.head.appendChild(style);

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Image error handling - show placeholder if image doesn't exist
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('error', function() {
        // Create a placeholder div if image fails to load
        const placeholder = document.createElement('div');
        placeholder.style.width = this.width || '100%';
        placeholder.style.height = this.height || '200px';
        placeholder.style.backgroundColor = '#e2e8f0';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = '#64748b';
        placeholder.style.fontSize = '0.9rem';
        placeholder.textContent = 'Image not found';
        placeholder.style.borderRadius = '8px';
        
        if (this.id === 'logo-img') {
            placeholder.textContent = 'Logo';
            placeholder.style.width = '50px';
            placeholder.style.height = '50px';
        } else if (this.id === 'aditi-img' || this.id === 'abhi-img') {
            placeholder.style.width = '100%';
            placeholder.style.height = '100%';
            placeholder.style.borderRadius = '50%';
            placeholder.textContent = 'Photo';
        }
        
        this.parentNode.replaceChild(placeholder, this);
    });
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.card, .service-card, .team-card, .team-contact-card, .help-card, .blog-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

