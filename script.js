/**
 * Portfolio Website - Interactive JavaScript
 * Handles theme toggle, animations, counters, scroll effects, and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    ThemeToggle.init();
    Navigation.init();
    AnimatedCounters.init();
    ScrollAnimations.init();
    SkillBars.init();
    ProjectFilter.init();
    ContactForm.init();
    ScrollToTop.init();
});

/**
 * Theme Toggle Module
 * Handles switching between light and dark modes
 */
const ThemeToggle = {
    toggle: null,
    icon: null,

    init() {
        this.toggle = document.getElementById('themeToggle');
        this.icon = this.toggle.querySelector('i');

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateIcon(savedTheme);

        // Toggle event
        this.toggle.addEventListener('click', () => this.toggleTheme());
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateIcon(newTheme);

        // Add animation
        this.toggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.toggle.style.transform = '';
        }, 300);
    },

    updateIcon(theme) {
        if (theme === 'dark') {
            this.icon.classList.remove('fa-moon');
            this.icon.classList.add('fa-sun');
        } else {
            this.icon.classList.remove('fa-sun');
            this.icon.classList.add('fa-moon');
        }
    }
};

/**
 * Navigation Module
 * Handles navbar scroll effects and mobile menu
 */
const Navigation = {
    navbar: null,
    navToggle: null,
    navMenu: null,
    navLinks: null,

    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Active link on scroll
        this.setupActiveLink();
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    },

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    },

    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY + 100;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
};

/**
 * Animated Counters Module
 * Animates numbers in the hero stats section
 */
const AnimatedCounters = {
    counters: null,
    observer: null,

    init() {
        this.counters = document.querySelectorAll('.stat-number');

        // Use Intersection Observer for scroll-triggered animation
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    },

    animateCounter(counter) {
        const parent = counter.closest('.stat-item');
        const target = parseInt(parent.getAttribute('data-count'));
        const suffix = target >= 500 ? 'K+' : target >= 25 ? '%' : '+';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };

        updateCounter();
    }
};

/**
 * Scroll Animations Module
 * Handles fade-in and slide-in animations on scroll
 */
const ScrollAnimations = {
    observer: null,

    init() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            this.observer.observe(item);
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
            this.observer.observe(card);
        });
    }
};

/**
 * Skill Bars Module
 * Animates skill progress bars on scroll
 */
const SkillBars = {
    observer: null,

    init() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBars();
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.observer.observe(skillsSection);
    },

    animateBars() {
        const bars = document.querySelectorAll('.skill-progress');

        bars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 200);
        });
    }
};

/**
 * Project Filter Module
 * Filters projects by category (All, Flutter, Android)
 */
const ProjectFilter = {
    buttons: null,
    cards: null,

    init() {
        this.buttons = document.querySelectorAll('.filter-btn');
        this.cards = document.querySelectorAll('.project-card');

        this.buttons.forEach(button => {
            button.addEventListener('click', () => this.filterProjects(button));
        });
    },

    filterProjects(selectedButton) {
        // Update active state
        this.buttons.forEach(btn => btn.classList.remove('active'));
        selectedButton.classList.add('active');

        const filter = selectedButton.getAttribute('data-filter');

        this.cards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = '';
                    card.classList.add('visible');
                }, 10);
            } else {
                card.classList.remove('visible');
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });
    }
};

/**
 * Contact Form Module
 * Handles form submission with validation
 */
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();

        // Get form values
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!this.validateForm(data)) return;

        // Show success message (in production, send to backend)
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

        // Reset form
        this.form.reset();
    },

    validateForm(data) {
        const { name, email, subject, message } = data;

        if (!name.trim()) {
            this.showNotification('Please enter your name', 'error');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email', 'error');
            return false;
        }

        if (!subject.trim()) {
            this.showNotification('Please enter a subject', 'error');
            return false;
        }

        if (!message.trim() || message.length < 10) {
            this.showNotification('Please enter a message (at least 10 characters)', 'error');
            return false;
        }

        return true;
    },

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 25px',
            background: type === 'success' ? '#22c55e' : '#ef4444',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
};

/**
 * Scroll to Top Module
 * Shows/hides scroll to top button
 */
const ScrollToTop = {
    button: null,

    init() {
        this.button = document.getElementById('scrollTop');
        if (!this.button) return;

        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    },

    handleScroll() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Add keyframe animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

/**
 * Smooth scroll for anchor links (fallback for older browsers)
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Add typing effect to hero title (optional enhancement)
 */
const TypingEffect = {
    element: null,
    text: '',
    index: 0,
    speed: 100,

    init(selector, text) {
        this.element = document.querySelector(selector);
        if (!this.element) return;

        this.text = text;
        this.type();
    },

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
};

// Export for potential external use
window.PortfolioUtils = {
    ThemeToggle,
    Navigation,
    AnimatedCounters,
    ScrollAnimations,
    SkillBars,
    ProjectFilter,
    ContactForm,
    ScrollToTop,
    TypingEffect
};
