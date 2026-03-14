// Crystal Building Maintenance Website JavaScript
// Modern interactions, hamburger menu, form handling, and animations

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Functionality
    initializeMobileMenu();
    
    // Smooth scrolling for navigation links
    initializeSmoothScrolling();
    
    // Header scroll effects
    initializeHeaderEffects();
    
    // Contact form handling
    initializeContactForm();
    
    // Phone number formatting
    initializePhoneFormatting();
    
    // Analytics tracking
    initializeAnalytics();
    
    // Animation observers
    initializeAnimations();
    
    // Mobile dropdown toggles
    initializeMobileDropdowns();
    
});

// Mobile Menu Functions
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle mobile nav
        mobileNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
        
        // Add/remove class to header for styling
        document.getElementById('header').classList.toggle('mobile-menu-open');
    });
    
    // Close mobile menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuToggle.contains(event.target) && !mobileNav.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('header').classList.remove('mobile-menu-open');
    }
}

// Mobile Dropdown Functions
function initializeMobileDropdowns() {
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdownMenu = this.nextElementSibling;
            const icon = this.querySelector('.mobile-dropdown-icon');
            const isOpen = dropdownMenu.classList.contains('active');
            
            // Close all other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    const otherMenu = otherToggle.nextElementSibling;
                    const otherIcon = otherToggle.querySelector('.mobile-dropdown-icon');
                    otherMenu.classList.remove('active');
                    otherIcon.textContent = '+';
                }
            });
            
            // Toggle current dropdown
            dropdownMenu.classList.toggle('active');
            icon.textContent = isOpen ? '+' : '−';
        });
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" 
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    document.getElementById('mobileMenuToggle').click();
                }
                
                // Smooth scroll to target
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Header Effects
function initializeHeaderEffects() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    
    function updateHeaderOnScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
        
        // Update active nav link based on scroll position
        updateActiveNavLinkOnScroll();
    }
    
    window.addEventListener('scroll', function() {
        // Throttle scroll events
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateHeaderOnScroll, 10);
    });
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const scrollPosition = window.scrollY + 150; // Offset for header
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.querySelector('.lead-capture-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Validation
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>🔄 Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handler)
        setTimeout(() => {
            // Track form submission
            trackEvent('form_submission', 'engagement', 'quote_request');
            
            // Show success message
            showFormSuccess();
            
            // Reset form
            this.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
        }, 2000);
    });
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'facility-type'];
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.replace('-', ' ')} is required`);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    // Consent validation
    if (!data.consent) {
        errors.push('Please consent to receive communications');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\(\)\-\+\.]{10,}$/;
    return phoneRegex.test(phone);
}

function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Show error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        background: #ff4757;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-weight: 600;
    `;
    errorDiv.innerHTML = `
        <div style="margin-bottom: 0.5rem;">Please fix the following errors:</div>
        <ul style="margin: 0; padding-left: 1rem;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    const form = document.querySelector('.lead-capture-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showFormSuccess() {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-error, .form-success');
    existingMessages.forEach(msg => msg.remove());
    
    // Show success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = `
        background: linear-gradient(135deg, #FF6B35, #F7931E);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 600;
        animation: slideInUp 0.5s ease;
    `;
    successDiv.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
        <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">Thank you for your quote request!</div>
        <div>We'll contact you within 2 hours during business hours.</div>
        <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.9;">
            Or call us now at <a href="tel:5616845652" style="color: #FFD23F; font-weight: bold;">(561) 684-5652</a>
        </div>
    `;
    
    const form = document.querySelector('.lead-capture-form');
    form.insertBefore(successDiv, form.firstChild);
    
    // Auto-remove success message after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Phone Number Formatting
function initializePhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                // Format as (XXX) XXX-XXXX
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
            } else if (value.length >= 6) {
                // Format as (XXX) XXX-
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                // Format as (XXX) 
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    });
}

// Analytics and Tracking
function initializeAnalytics() {
    // Track page view
    trackEvent('page_view', 'engagement', 'homepage');
    
    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_call', 'engagement', 'header_phone');
        });
    });
    
    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.toLowerCase().includes('quote') ? 'quote_request' : 'cta_click';
            trackEvent(action, 'engagement', 'cta_button');
        });
    });
    
    // Track video engagement
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
        container.addEventListener('click', function() {
            trackEvent('video_play', 'engagement', 'homepage_video');
        });
    });
    
    // Track scroll depth
    let scrollDepth = 0;
    const trackScrollDepth = throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > scrollDepth && scrollPercent % 25 === 0) {
            scrollDepth = scrollPercent;
            trackEvent('scroll_depth', 'engagement', `${scrollPercent}_percent`);
        }
    }, 1000);
    
    window.addEventListener('scroll', trackScrollDepth);
}

function trackEvent(action, category, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', action, { category: category, label: label });
    }
    
    // Console log for debugging
    console.log('Event tracked:', { action, category, label });
}

// Animation Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                const gridItems = entry.target.querySelectorAll('.service-card, .area-card, .testimonial, .video-container');
                gridItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const animatedSections = document.querySelectorAll('.services, .video-showcase, .areas, .testimonials');
    animatedSections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual elements
    const animatedElements = document.querySelectorAll('.service-card, .area-card, .testimonial, .video-container, .hero-stats .stat');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility Functions
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images when they're about to be visible
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'styles.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
initializePerformanceOptimizations();

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .service-card,
    .area-card,
    .testimonial,
    .video-container,
    .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(25px);
    }
    
    .header.header-hidden {
        transform: translateY(-100%);
    }
    
    .header.mobile-menu-open {
        background: rgba(255, 255, 255, 1);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .service-card,
        .area-card,
        .testimonial,
        .video-container,
        .stat {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;

document.head.appendChild(animationStyles);