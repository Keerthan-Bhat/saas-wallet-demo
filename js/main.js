/**
 * main.js — Wallet Landing Page
 * Handles: scroll-triggered animations, ripple effect,
 * sticky navbar state, smooth interactions
 */

/* ─────────────────────────────────────────
   1. SCROLL-TRIGGERED ANIMATIONS
   Uses IntersectionObserver for performant
   viewport detection
───────────────────────────────────────── */

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Only unobserve non-repeating elements
      if (!entry.target.classList.contains('repeat-animation')) {
        animationObserver.unobserve(entry.target);
      }
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll('.animate-fade-up, .preview, .testimonial__card')
  .forEach((el) => animationObserver.observe(el));


/* ─────────────────────────────────────────
   2. BUTTON RIPPLE EFFECT
───────────────────────────────────────── */

document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


/* ─────────────────────────────────────────
   3. STICKY NAVBAR — add shadow on scroll
───────────────────────────────────────── */

const navbar = document.querySelector('.navbar');

const navbarObserver = new IntersectionObserver(
  ([entry]) => {
    navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
  },
  { threshold: 0 }
);

// Observe a sentinel element at the top of the page
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:100%;pointer-events:none;';
document.body.prepend(sentinel);
navbarObserver.observe(sentinel);


/* ─────────────────────────────────────────
   4. NAVBAR SCROLL STYLE
───────────────────────────────────────── */

// Add CSS for scrolled state dynamically
const navStyle = document.createElement('style');
navStyle.textContent = `
  .navbar--scrolled {
    box-shadow: 0 2px 20px rgba(0,0,0,0.4);
    border-bottom-color: rgba(255,255,255,0.1);
  }
`;
document.head.appendChild(navStyle);


/* ─────────────────────────────────────────
   5. SMOOTH ACTIVE NAV LINK HIGHLIGHTING
───────────────────────────────────────── */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle(
            'navbar__link--active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((s) => sectionObserver.observe(s));

// Add CSS for active nav link
const linkStyle = document.createElement('style');
linkStyle.textContent = `
  .navbar__link--active {
    color: var(--color-text-primary) !important;
  }
  .navbar__link--active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(linkStyle);


/* ─────────────────────────────────────────
   6. NEWSLETTER FORM — micro feedback
───────────────────────────────────────── */

const form = document.querySelector('.footer__form');
const input = document.querySelector('.footer__input');
const submitBtn = document.querySelector('.footer__submit');

if (form && input && submitBtn) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      input.style.borderColor = '#ff5f57';
      input.focus();
      return;
    }

    // Success feedback
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5 6.5-7" stroke="#28c840" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    submitBtn.style.color = '#28c840';
    input.value = '';
    input.placeholder = 'You\'re subscribed!';

    setTimeout(() => {
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      submitBtn.style.color = '';
      input.placeholder = 'Email address';
    }, 3000);
  });
}


/* ─────────────────────────────────────────
   7. FEATURE CARD — tilt on hover
───────────────────────────────────────── */

document.querySelectorAll('.feature-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      translateY(-4px)
      rotateX(${-y * 5}deg)
      rotateY(${x * 5}deg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ─────────────────────────────────────────
   8. HERO MOCKUP — subtle parallax on scroll
───────────────────────────────────────── */

const heroMockup = document.querySelector('.hero__mockup');

if (heroMockup) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 600) {
      heroMockup.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
  }, { passive: true });
}


/* ─────────────────────────────────────────
   9. MODAL MANAGEMENT
───────────────────────────────────────── */

function openModal(type) {
  const overlay = document.getElementById('modal-overlay');
  const signinPanel = document.getElementById('panel-signin');
  const signupPanel = document.getElementById('panel-signup');
  
  if (overlay) {
    overlay.classList.add('modal-overlay--active');
    
    // Reset panels
    if (signinPanel) signinPanel.classList.remove('modal__panel--active');
    if (signupPanel) signupPanel.classList.remove('modal__panel--active');
    
    // Show the requested panel
    if (type === 'signin' && signinPanel) {
      signinPanel.classList.add('modal__panel--active');
    } else if (type === 'signup' && signupPanel) {
      signupPanel.classList.add('modal__panel--active');
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  
  if (overlay) {
    overlay.classList.remove('modal-overlay--active');
    document.body.style.overflow = '';
  }
}

function switchPanel(type) {
  const signinPanel = document.getElementById('panel-signin');
  const signupPanel = document.getElementById('panel-signup');
  
  if (type === 'signin') {
    if (signupPanel) signupPanel.classList.remove('modal__panel--active');
    if (signinPanel) signinPanel.classList.add('modal__panel--active');
  } else if (type === 'signup') {
    if (signinPanel) signinPanel.classList.remove('modal__panel--active');
    if (signupPanel) signupPanel.classList.add('modal__panel--active');
  }
}

function handleAuth(type) {
  const successPanel = document.getElementById('panel-success');
  const signinPanel = document.getElementById('panel-signin');
  const signupPanel = document.getElementById('panel-signup');
  
  // Hide current panel
  if (type === 'signin' && signinPanel) {
    signinPanel.classList.remove('modal__panel--active');
  } else if (type === 'signup' && signupPanel) {
    signupPanel.classList.remove('modal__panel--active');
  }
  
  // Show success panel
  if (successPanel) {
    successPanel.classList.add('modal__panel--active');
  }
}


/* ─────────────────────────────────────────
   10. PAGE LOAD — initial animation trigger & modal setup
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero elements immediately (above fold)
  setTimeout(() => {
    document.querySelectorAll('.hero .animate-fade-up').forEach((el) => {
      el.classList.add('is-visible');
    });
  }, 100);

  // Setup modal event listeners
  const overlay = document.getElementById('modal-overlay');
  
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }
});

// Close modal on Escape key (attach to document, not inside DOMContentLoaded)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
