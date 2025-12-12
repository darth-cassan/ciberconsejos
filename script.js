// CiberConsejos - Interactive JavaScript

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial password
    generatePassword();

    // Add smooth scrolling
    initSmoothScrolling();

    // Add navbar background on scroll
    initNavbarScroll();

    // Add scroll animations
    initScrollAnimations();

    // Initialize tooltips
    initTooltips();

    // Add interactive elements
    initInteractiveElements();
});

// Password Generator Functions
function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        showAlert('Por favor selecciona al menos un tipo de carácter', 'warning');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('generatedPassword').value = password;
    updatePasswordStrength(password);

    // Add generation animation
    const input = document.getElementById('generatedPassword');
    input.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
        input.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    let strength = 0;

    // Check length
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (password.length >= 16) strength += 20;

    // Check character variety
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    // Update progress bar
    strengthBar.style.width = strength + '%';

    // Change color based on strength
    strengthBar.className = 'progress-bar';
    if (strength < 40) {
        strengthBar.classList.add('bg-danger');
        strengthBar.textContent = 'Débil';
    } else if (strength < 70) {
        strengthBar.classList.add('bg-warning');
        strengthBar.textContent = 'Media';
    } else if (strength < 90) {
        strengthBar.classList.add('bg-info');
        strengthBar.textContent = 'Fuerte';
    } else {
        strengthBar.classList.add('bg-success');
        strengthBar.textContent = 'Muy Fuerte';
    }
}

function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    const password = passwordField.value;

    if (!password) {
        showAlert('Primero genera una contraseña', 'warning');
        return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(password).then(() => {
        showAlert('¡Contraseña copiada al portapapeles!', 'success');

        // Visual feedback
        passwordField.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            passwordField.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
    }).catch(() => {
        // Fallback for older browsers
        passwordField.select();
        document.execCommand('copy');
        showAlert('¡Contraseña copiada al portapapeles!', 'success');
    });
}

function updateLength() {
    const length = document.getElementById('passwordLength').value;
    document.getElementById('lengthValue').textContent = length;
    generatePassword();
}

// Modal Functions
function showChannels() {
    const modal = new bootstrap.Modal(document.getElementById('channelsModal'));
    modal.show();
}

function showHelpCenters() {
    const modal = new bootstrap.Modal(document.getElementById('helpCentersModal'));
    modal.show();
}

// Alert Function
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Navbar Background on Scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(52, 58, 64, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(52, 58, 64, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Add hover effects to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click feedback to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginTop = '-50px';
            ripple.style.marginLeft = '-50px';
            ripple.style.animation = 'ripple 0.6s';
            ripple.style.pointerEvents = 'none';

            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add security tips rotation
    startSecurityTips();
}

// Security Tips Rotation
function startSecurityTips() {
    const tips = [
        "💡 Usa contraseñas diferentes para cada sitio",
        "🛡️ Activa la autenticación de dos factores siempre",
        "🔒 Nunca compartas tus contraseñas con nadie",
        "📱 Revisa regularmente la configuración de privacidad",
        "🔍 Desconfía de mensajes y enlaces sospechosos",
        "🌐 Mantén tus aplicaciones y navegador actualizados",
        "👁️ Sé cuidadoso con lo que compartes online",
        "🚫 No aceptes solicitudes de amistad de desconocidos"
    ];

    let currentTip = 0;

    // You can add a tip container to the HTML if you want this feature
    function showNextTip() {
        const tipContainer = document.getElementById('security-tip');
        if (tipContainer) {
            tipContainer.textContent = tips[currentTip];
            tipContainer.classList.add('animate__animated', 'animate__fadeIn');
            setTimeout(() => {
                tipContainer.classList.remove('animate__animated', 'animate__fadeIn');
            }, 1000);
            currentTip = (currentTip + 1) % tips.length;
        }
    }

    // Change tip every 10 seconds
    setInterval(showNextTip, 10000);
}

// Form Validation (if you add forms later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// Local Storage Functions
function saveSettings(settings) {
    localStorage.setItem('ciberconsejos_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('ciberconsejos_settings');
    return saved ? JSON.parse(saved) : {};
}

// Analytics/Tracking placeholder (remove or replace with actual tracking)
function trackEvent(action, category = 'interaction') {
    console.log(`Event tracked: ${category} - ${action}`);
    // Add your analytics code here
}

// Performance Monitoring
function logPerformance() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
    }
}

// Log performance after page load
window.addEventListener('load', logPerformance);

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);