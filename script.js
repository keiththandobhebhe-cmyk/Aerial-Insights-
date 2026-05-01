/* ===================================================
   Aerial Insights — JavaScript
   ADI Framework: Signal → Pattern → Insight → Decision
   Gold & Black Theme
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────── Page Loader ────────────
  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 700);
  });

  // ──────────── Particle System (Gold Theme) ────────────
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 140;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Clear mouse when it leaves the window
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.8 + 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction — gentle attraction
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (160 - dist) / 160 * 0.012;
            this.vx += dx * force;
            this.vy += dy * force;
          }
        }

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Boundaries — wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // ──────────── Navbar Scroll Effect ────────────
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ──────────── Hamburger Menu ────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ──────────── Typing Animation ────────────
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const text = typingEl.getAttribute('data-text');
    let charIndex = 0;
    typingEl.textContent = '';

    function type() {
      if (charIndex < text.length) {
        typingEl.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(type, 60);
      }
    }

    // Start typing after loader
    setTimeout(type, 1100);
  }

  // ──────────── Scroll Reveal (Intersection Observer) ────────────
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay');
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, parseInt(delay));
          } else {
            entry.target.classList.add('visible');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ──────────── Animated Counter ────────────
  const counters = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-target');
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isFloat = target.includes('.');
          const targetVal = parseFloat(target);
          const duration = 2200;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * targetVal;

            if (isFloat) {
              el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
              el.textContent = prefix + Math.floor(current) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = prefix + target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  // ──────────── Button Ripple Effect ────────────
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ──────────── Page Transitions ────────────
  const transition = document.querySelector('.page-transition');
  const internalLinks = document.querySelectorAll('a[data-transition]');

  internalLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (transition) {
        transition.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 350);
      } else {
        window.location.href = href;
      }
    });
  });

  // ──────────── Contact Form Validation ────────────
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.querySelector('.success-message');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Name validation
      const name = document.getElementById('form-name');
      const nameError = name.parentElement.querySelector('.error-msg');
      if (name.value.trim().length < 2) {
        name.classList.add('error');
        nameError.style.display = 'block';
        isValid = false;
      } else {
        name.classList.remove('error');
        nameError.style.display = 'none';
      }

      // Email validation
      const email = document.getElementById('form-email');
      const emailError = email.parentElement.querySelector('.error-msg');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        emailError.style.display = 'block';
        isValid = false;
      } else {
        email.classList.remove('error');
        emailError.style.display = 'none';
      }

      // Message validation
      const message = document.getElementById('form-message');
      const messageError = message.parentElement.querySelector('.error-msg');
      if (message.value.trim().length < 10) {
        message.classList.add('error');
        messageError.style.display = 'block';
        isValid = false;
      } else {
        message.classList.remove('error');
        messageError.style.display = 'none';
      }

      if (isValid) {
        contactForm.style.display = 'none';
        successMessage.classList.add('show');
      }
    });

    // Real-time validation clearing
    ['form-name', 'form-email', 'form-message'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.classList.remove('error');
          const err = el.parentElement.querySelector('.error-msg');
          if (err) err.style.display = 'none';
        });
      }
    });
  }

  // ──────────── Active Nav Link ────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ──────────── ADI Card Hover Glow ────────────
  document.querySelectorAll('.adi-card').forEach((card) => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.setProperty('--mouse-x', `${x}px`);
      this.style.setProperty('--mouse-y', `${y}px`);
    });
  });

});
