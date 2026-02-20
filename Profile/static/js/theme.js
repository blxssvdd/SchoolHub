/* ============================================
   SchoolHub - Theme Management
   ============================================ */

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('schoolhub-theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.classList.add(`${this.theme}-mode`);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('schoolhub-theme', this.theme);
        location.reload();
    }

    setupListeners() {
        // Auto-detect system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!localStorage.getItem('schoolhub-theme')) {
                this.theme = 'dark';
                this.applyTheme();
            }
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

/* ============================================
   Global Utilities
   ============================================ */

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
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

        setTimeout(() => ripple.remove(), 600);
    });
});

// Table row hover effect
document.querySelectorAll('.table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });
    row.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Form focus effects
const formInputs = document.querySelectorAll('.form-control, .form-select');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('is-focused');
    });
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('is-focused');
    });
});
