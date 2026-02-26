// ==========================================
// PRELOADER - FIXED: Multiple fallbacks
// ==========================================
(function() {
    var preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hide')) {
            preloader.classList.add('hide');
            document.body.style.overflow = '';

            // Remove from DOM after transition
            setTimeout(function() {
                if (preloader.parentNode) {
                    preloader.style.display = 'none';
                }
            }, 600);

            // Trigger hero animation
            setTimeout(function() {
                var hero = document.getElementById('heroContent');
                if (hero) {
                    hero.classList.add('animate');
                }
                startCounters();
            }, 200);
        }
    }

    // Method 1: DOMContentLoaded (fires faster than load)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hidePreloader, 1200);
        });
    } else {
        // DOM already loaded
        setTimeout(hidePreloader, 1200);
    }

    // Method 2: Absolute fallback - hide after 3 seconds no matter what
    setTimeout(hidePreloader, 3000);

    // Method 3: window.load as backup
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 500);
    });
})();

// ==========================================
// COUNTER ANIMATION
// ==========================================
var countersStarted = false;

function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    var counters = document.querySelectorAll('.stat-number');
    counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;

        var duration = 2000;
        var startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);

            // Ease out
            var eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(animate);
    });
}

// ==========================================
// NAVBAR
// ==========================================
var navbar = document.getElementById('navbar');
var sections = document.querySelectorAll('section[id]');
var allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link
    sections.forEach(function(section) {
        var top = section.offsetTop - 120;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            allNavLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Back to top
    var backBtn = document.getElementById('backToTop');
    if (backBtn) {
        if (scrollY > 500) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    }
});

// ==========================================
// MOBILE NAV
// ==========================================
var hamburger = document.getElementById('hamburger');
var navLinksEl = document.getElementById('navLinks');

if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinksEl.classList.toggle('open');
    });

    // Close on link click
    navLinksEl.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinksEl.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
            hamburger.classList.remove('active');
            navLinksEl.classList.remove('open');
        }
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var targetEl = document.querySelector(this.getAttribute('href'));
        if (targetEl) {
            var offset = targetEl.offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ==========================================
// TABS
// ==========================================
var tabBtns = document.querySelectorAll('.tab-btn');
var tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        var targetTab = this.getAttribute('data-tab');

        tabBtns.forEach(function(b) { b.classList.remove('active'); });
        tabContents.forEach(function(c) { c.classList.remove('active'); });

        this.classList.add('active');
        var targetEl = document.getElementById(targetTab);
        if (targetEl) {
            targetEl.classList.add('active');

            // Re-trigger animations
            setTimeout(function() {
                targetEl.querySelectorAll('.reveal-up').forEach(function(el) {
                    el.classList.remove('revealed');
                });
                setTimeout(revealElements, 100);
            }, 50);
        }
    });
});

// ==========================================
// SCROLL REVEAL
// ==========================================
function revealElements() {
    var reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    var windowHeight = window.innerHeight;

    reveals.forEach(function(el) {
        var elementTop = el.getBoundingClientRect().top;
        var revealPoint = 120;

        if (elementTop < windowHeight - revealPoint) {
            var delay = parseInt(el.getAttribute('data-delay')) || 0;
            setTimeout(function() {
                el.classList.add('revealed');
            }, delay);
        }
    });
}

window.addEventListener('scroll', revealElements);
setTimeout(revealElements, 500);

// ==========================================
// CONTACT FORM
// ==========================================
var contactForm = document.getElementById('contactForm');
var formMessage = document.getElementById('formMessage');
var submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = document.getElementById('name').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var email = document.getElementById('email').value.trim();
        var service = document.getElementById('service').value;
        var message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !phone || !email || !service || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate sending
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        setTimeout(function() {
            showMessage(
                'Thank you, ' + name + '! Your message has been sent successfully. We will contact you shortly.',
                'success'
            );
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><span class="btn-arrow">&rarr;</span>';

            setTimeout(function() {
                formMessage.className = 'form-message';
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

function showMessage(msg, type) {
    if (formMessage) {
        formMessage.textContent = msg;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
    }
}

// ==========================================
// FOOTER YEAR
// ==========================================
var yearEl = document.getElementById('currentYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ==========================================
// ESCAPE KEY - Close mobile menu
// ==========================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinksEl && navLinksEl.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('open');
    }
});