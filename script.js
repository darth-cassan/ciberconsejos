// CiberConsejos - Interactive JavaScript

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial password
    generatePassword();

    // Add smooth scrolling
    initSmoothScrolling();

    // Add navbar background on scroll
    initNavbarScroll();

    // Initialize tooltips
    initTooltips();

    // Add interactive elements
    initInteractiveElements();

    // Highlight active section on scroll
    initActiveSectionHighlight();

    // Back-to-top button
    initBackToTop();

    // Auto-regenerate password on option changes
    initPasswordGeneratorAutoUpdate();
});

function initPasswordGeneratorAutoUpdate() {
    const optionIds = ['uppercase', 'lowercase', 'numbers', 'symbols'];
    optionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', function() {
            const anyChecked = optionIds.some(optionId => document.getElementById(optionId)?.checked);
            if (!anyChecked) {
                this.checked = true;
                return;
            }
            generatePassword();
        });
    });
}

function getRandomInt(maxExclusive) {
    if (maxExclusive <= 0) return 0;
    if (window.crypto && window.crypto.getRandomValues) {
        const uint32 = new Uint32Array(1);
        const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
        let value = 0;
        do {
            window.crypto.getRandomValues(uint32);
            value = uint32[0];
        } while (value >= limit);
        return value % maxExclusive;
    }
    return Math.floor(Math.random() * maxExclusive);
}

function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetPasswordStrength() {
    const strengthBar = document.getElementById('strengthBar');
    if (!strengthBar) return;
    strengthBar.style.width = '0%';
    strengthBar.className = 'progress-bar bg-secondary';
    strengthBar.textContent = '—';
    strengthBar.setAttribute('aria-valuenow', '0');
}

// Password Generator Functions
function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;

    const pools = [];
    if (includeUppercase) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (includeLowercase) pools.push('abcdefghijklmnopqrstuvwxyz');
    if (includeNumbers) pools.push('0123456789');
    if (includeSymbols) pools.push('!@#$%^&*()_+-=[]{}|;:,.<>?');

    if (pools.length === 0) {
        document.getElementById('generatedPassword').value = '';
        resetPasswordStrength();
        showAlert('Por favor selecciona al menos un tipo de carácter', 'warning');
        return;
    }

    const desiredLength = Math.max(8, Math.min(32, parseInt(length, 10) || 16));
    const allChars = pools.join('');
    const passwordChars = [];

    // Ensure at least one from each selected pool
    pools.forEach(pool => {
        passwordChars.push(pool.charAt(getRandomInt(pool.length)));
    });

    // Fill remaining with all chars
    while (passwordChars.length < desiredLength) {
        passwordChars.push(allChars.charAt(getRandomInt(allChars.length)));
    }

    shuffleInPlace(passwordChars);
    const password = passwordChars.join('');

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
    strengthBar.setAttribute('aria-valuenow', String(strength));

    // Change color based on strength
    strengthBar.className = 'progress-bar';
    let label = '—';
    if (strength < 40) {
        strengthBar.classList.add('bg-danger');
        label = 'Débil';
    } else if (strength < 70) {
        strengthBar.classList.add('bg-warning');
        label = 'Media';
    } else if (strength < 90) {
        strengthBar.classList.add('bg-info');
        label = 'Fuerte';
    } else {
        strengthBar.classList.add('bg-success');
        label = 'Muy Fuerte';
    }
    strengthBar.textContent = `${label} (${strength}%)`;
}

function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    const password = passwordField.value;
    const copyButton = passwordField?.closest('.input-group')?.querySelector('button');

    if (!password) {
        showAlert('Primero genera una contraseña', 'warning');
        return;
    }

    if (copyButton?.dataset?.copied === '1') return;

    const showCopied = () => {
        if (copyButton) {
            if (!copyButton.dataset.originalHtml) {
                copyButton.dataset.originalHtml = copyButton.innerHTML;
            }
            if (copyButton.dataset.resetTimerId) {
                window.clearTimeout(Number(copyButton.dataset.resetTimerId));
            }

            // Keep button size stable and avoid "disabled" grey tint
            if (!copyButton.dataset.originalWidth) {
                copyButton.dataset.originalWidth = copyButton.style.width || '';
            }
            copyButton.style.width = `${copyButton.offsetWidth}px`;
            copyButton.style.pointerEvents = 'none';
            copyButton.dataset.copied = '1';

            copyButton.innerHTML = '<i class="fas fa-check me-2"></i>Listo';
            copyButton.setAttribute('aria-label', 'Copiado');

            const timerId = window.setTimeout(() => {
                copyButton.innerHTML = copyButton.dataset.originalHtml || '<i class="fas fa-copy"></i> Copiar';
                copyButton.setAttribute('aria-label', 'Copiar');
                copyButton.style.width = copyButton.dataset.originalWidth || '';
                copyButton.style.pointerEvents = '';
                delete copyButton.dataset.copied;
                delete copyButton.dataset.resetTimerId;
            }, 1800);
            copyButton.dataset.resetTimerId = String(timerId);
        }
    };

    // Prefer modern clipboard API in secure contexts
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(password).then(showCopied).catch(() => {
            fallbackCopyToClipboard(passwordField, showCopied);
        });
        return;
    }

    fallbackCopyToClipboard(passwordField, showCopied);
}

function fallbackCopyToClipboard(inputEl, onSuccess) {
    try {
        inputEl.removeAttribute('readonly');
        inputEl.select();
        inputEl.setSelectionRange(0, inputEl.value.length);
        const ok = document.execCommand('copy');
        inputEl.setAttribute('readonly', 'readonly');
        window.getSelection?.().removeAllRanges?.();
        if (ok) onSuccess();
        else showAlert('No se pudo copiar automáticamente. Selecciona y copia manualmente.', 'warning');
    } catch {
        inputEl.setAttribute('readonly', 'readonly');
        showAlert('No se pudo copiar automáticamente. Selecciona y copia manualmente.', 'warning');
    }
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
            const href = this.getAttribute('href');
            if (!href) return;

            // Allow harmless "#" links (common for placeholders)
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            let target = null;
            try {
                target = document.querySelector(href);
            } catch {
                return;
            }
            if (!target) return;

            e.preventDefault();
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });

            // Only mark nav links active (avoid adding .active to buttons)
            if (this.classList.contains('nav-link')) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
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
            navbar.style.backgroundColor = 'rgba(11, 18, 32, 0.88)';
            navbar.style.boxShadow = '0 14px 40px rgba(0, 0, 0, 0.22)';
        } else {
            navbar.style.backgroundColor = 'rgba(11, 18, 32, 0.78)';
            navbar.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.16)';
        }
    });
}

// Scroll Animations
// (Disabled) Previously used IntersectionObserver + Animate.css which caused cards to "move" while scrolling.
function initScrollAnimations() {}

// Tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Add click feedback to buttons
    document.querySelectorAll('.btn:not(.back-to-top):not(.btn-close)').forEach(button => {
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

    // Make resource cards clickable (like their internal button/link)
    initClickableResourceCards();
}

function initClickableResourceCards() {
    const cards = document.querySelectorAll('.resource-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const activate = () => {
            const primaryAction =
                card.querySelector('a.btn[href]') ||
                card.querySelector('button.btn') ||
                card.querySelector('a[href]');
            if (primaryAction) primaryAction.click();
        };

        card.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.closest && target.closest('a,button,input,select,textarea,label')) return;
            activate();
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
}

// Security Tips Rotation
function startSecurityTips() {
    const tips = [
        "💡 Usa contraseñas diferentes para cada sitio",
        "🛡️ Activa la autenticación de dos factores siempre",
        "🔒 Nunca compartas tus contraseñas con nadie",
        "📱 Revisa regularmente la configuración de privacidad",
        "🔍 Desconfía de mensajes y enlaces sospechosos",
        "🌐 Mantén tus apps y navegador actualizados",
        "👁️ Se cuidadoso con lo que compartes online",
        "🚫 No aceptes solicitudes de amistad de desconocidos"
    ];

    let currentTip = 0;

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

    showNextTip();
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
        const navEntries = performance.getEntriesByType?.('navigation') || [];
        const perfData = navEntries[0];
        if (perfData && typeof perfData.loadEventEnd === 'number' && typeof perfData.fetchStart === 'number') {
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }
    }
}

// Log performance after page load
window.addEventListener('load', logPerformance);

function initActiveSectionHighlight() {
    const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
    if (!navLinks.length) return;

    const sectionPairs = navLinks
        .map(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return null;
            const id = href.slice(1);
            const section = document.getElementById(id);
            if (!section) return null;
            return { id, link, section };
        })
        .filter(Boolean);

    if (!sectionPairs.length) return;

    const navbar = document.querySelector('.navbar');
    let ticking = false;

    const setActive = (activeId) => {
        sectionPairs.forEach(({ id, link }) => {
            link.classList.toggle('active', id === activeId);
        });
    };

    const computeActiveId = () => {
        const navbarHeight = navbar?.offsetHeight || 70;

        // Handle very top of page explicitly.
        if (window.scrollY <= 10) return sectionPairs[0].id;

        // Handle very bottom explicitly.
        const scrollBottom = window.scrollY + window.innerHeight;
        const pageBottom = document.documentElement.scrollHeight;
        if (scrollBottom >= pageBottom - 2) return sectionPairs[sectionPairs.length - 1].id;

        const probeY = window.scrollY + navbarHeight + 12;
        let current = sectionPairs[0].id;
        for (const pair of sectionPairs) {
            if (pair.section.offsetTop <= probeY) current = pair.id;
            else break;
        }
        return current;
    };

    const update = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            setActive(computeActiveId());
            ticking = false;
        });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const update = () => {
        btn.classList.toggle('is-visible', window.scrollY > 600);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

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
