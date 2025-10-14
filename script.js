// Navbar scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to elements
const animateElements = document.querySelectorAll('.feature-card, .step, .testimonial-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter animation for hero stats
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    };

    updateCounter();
};

const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
};

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');

            const stats = [
                { selector: '.stat-number', value: 500000 },
                { selector: '.stat:nth-child(2) .stat-number', value: 10000000 },
                { selector: '.stat:nth-child(3) .stat-number', value: 4.9 }
            ];

            stats.forEach((stat, index) => {
                const element = document.querySelectorAll('.stat-number')[index];
                if (element) {
                    if (index === 2) {
                        // For rating, use different animation
                        let current = 0;
                        const target = 4.9;
                        const increment = 0.1;
                        const updateRating = () => {
                            current += increment;
                            if (current < target) {
                                element.textContent = current.toFixed(1);
                                setTimeout(updateRating, 50);
                            } else {
                                element.textContent = target.toFixed(1);
                            }
                        };
                        updateRating();
                    } else {
                        animateCounter(element, stat.value);
                    }
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Add parallax effect to hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.hero-shape');

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Store button click handlers - Only prevent default for buttons without href
const storeButtons = document.querySelectorAll('.store-button');
storeButtons.forEach(button => {
    const href = button.getAttribute('href');
    if (!href || href === '#') {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const storeName = button.querySelector('.store-name').textContent;
            alert(`Thank you for your interest! ${storeName} download coming soon.`);
        });
    }
});

// Features Slideshow Functionality
let currentSlide = 0;
let slideshowInterval;
let restartTimeout;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const featureCards = document.querySelectorAll('.feature-card');

// Function to show specific slide
function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    featureCards.forEach(card => card.classList.remove('active'));

    // Add active class to current slide, dot, and card
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    featureCards[index].classList.add('active');

    currentSlide = index;
}

// Function to go to next slide
function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

// Start automatic slideshow
function startSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

// Stop automatic slideshow
function stopSlideshow() {
    clearInterval(slideshowInterval);
    clearTimeout(restartTimeout);
}

// Restart slideshow after delay
function restartSlideshowAfterDelay() {
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(() => {
        startSlideshow();
    }, 4000); // Wait 4 seconds before resuming
}

// Feature card click handlers
featureCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        stopSlideshow();
        showSlide(index);
        restartSlideshowAfterDelay();
    });
});

// Dot click handlers
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopSlideshow();
        showSlide(index);
        restartSlideshowAfterDelay();
    });
});

// Initialize slideshow
showSlide(0);
startSlideshow();

// Pause slideshow when user hovers over slideshow
const slideshowContainer = document.querySelector('.slideshow-container');
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', stopSlideshow);
    slideshowContainer.addEventListener('mouseleave', restartSlideshowAfterDelay);
}

// Pause slideshow when user hovers over cards
featureCards.forEach(card => {
    card.addEventListener('mouseenter', stopSlideshow);
    card.addEventListener('mouseleave', restartSlideshowAfterDelay);
});

// Testimonial card rotation effect
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotateY(2deg)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateY(0deg)';
    });
});

// Phone mockup tilt effect
const phoneMockup = document.querySelector('.phone-mockup');
if (phoneMockup) {
    phoneMockup.addEventListener('mousemove', (e) => {
        const rect = phoneMockup.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        phoneMockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px)`;
    });

    phoneMockup.addEventListener('mouseleave', () => {
        phoneMockup.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn, .store-button');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn, .store-button {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if any are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// Add active link styling
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-link.active-link {
        color: var(--accent-orange);
        position: relative;
    }

    .nav-link.active-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--accent-orange);
    }
`;
document.head.appendChild(activeLinkStyle);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedUpdateNavLink = debounce(updateActiveNavLink, 100);
window.addEventListener('scroll', debouncedUpdateNavLink);

// Social Media Follower Counts (Dynamic)
const socialFollowerCounts = {
    instagram: 7757,    // Real follower count
    tiktok: 10200       // Real follower count (10.2k)
};

// Animate social follower counts when section is visible
const socialFollowerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');

            const instagramElement = document.querySelector('[data-platform="instagram"]');
            const tiktokElement = document.querySelector('[data-platform="tiktok"]');

            if (instagramElement) {
                animateCounter(instagramElement, socialFollowerCounts.instagram);
            }

            if (tiktokElement) {
                animateCounter(tiktokElement, socialFollowerCounts.tiktok);
            }
        }
    });
}, { threshold: 0.5 });

const testimonialsSection = document.querySelector('.testimonials');
if (testimonialsSection) {
    socialFollowerObserver.observe(testimonialsSection);
}

console.log('Nutrea showcase website loaded successfully!');
