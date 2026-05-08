/* ============================================
   A UNIQUE FOOD SUPPLY - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ============================================
  // MOBILE NAV TOGGLE
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // SCROLL REVEAL ANIMATION
  // ============================================
  const revealElements = document.querySelectorAll(
    '.process-card, .service-card, .feature-card, .team-card, ' +
    '.package-card, .event-card, .cuisine-card, .mission-card, ' +
    '.c-card, .stat-item, .story-content, .story-image, ' +
    '.contact-info, .contact-form-wrapper, .dietary-text, .dietary-img'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // TESTIMONIAL SLIDER
  // ============================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });

    if (testimonialCards[index]) {
      testimonialCards[index].classList.add('active');
    }
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  // Auto-play testimonials
  if (testimonialCards.length > 0) {
    testimonialInterval = setInterval(nextTestimonial, 5000);

    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(testimonialInterval);
        showTestimonial(index);
        testimonialInterval = setInterval(nextTestimonial, 5000);
      });
    });
  }

  // ============================================
  // STATS COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-num');

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statsObserver.observe(stat));

  function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * (target - start) + start);

      element.textContent = current.toLocaleString() + (target >= 1000 ? '+' : '+');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString() + '+';
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // GALLERY FILTER
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';

          setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ============================================
  // CONTACT FORM HANDLING
  // ============================================
  const quoteForm = document.getElementById('quoteForm');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email || !data.phone || !data.eventDate || !data.guestCount || !data.eventType) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification('Thank you! We will send you a custom quote within 24 hours.', 'success');
        quoteForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? 'rgba(39, 174, 96, 0.95)' : 'rgba(231, 76, 60, 0.95)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.4s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.4s ease forwards';
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
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

  // ============================================
  // PARALLAX EFFECT FOR HERO
  // ============================================
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    });
  }

  // ============================================
  // ADD ANIMATION KEYFRAMES FOR NOTIFICATIONS
  // ============================================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
    // ============================================
  // BOOK NOW MODAL
  // ============================================

  // Create modal HTML and inject into body
  const modalHTML = `
    <div id="bookModal" class="modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" id="modalClose">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-header">
          <h3><i class="fas fa-calendar-check"></i> Request a Quote</h3>
          <p>Tell us about your event and we'll send a custom proposal within 24 hours.</p>
        </div>
        <form class="modal-form" id="modalQuoteForm">
          <div class="form-row">
            <div class="form-group">
              <label for="modalName">Full Name *</label>
              <input type="text" id="modalName" name="name" placeholder="John Smith" required>
            </div>
            <div class="form-group">
              <label for="modalEmail">Email Address *</label>
              <input type="email" id="modalEmail" name="email" placeholder="john@example.com" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="modalPhone">Phone Number *</label>
              <input type="tel" id="modalPhone" name="phone" placeholder="(555) 123-4567" required>
            </div>
            <div class="form-group">
              <label for="modalEventDate">Event Date *</label>
              <input type="date" id="modalEventDate" name="eventDate" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="modalGuestCount">Number of Guests *</label>
              <select id="modalGuestCount" name="guestCount" required>
                <option value="">Select range</option>
                <option value="10-25">10 - 25 guests</option>
                <option value="26-50">26 - 50 guests</option>
                <option value="51-100">51 - 100 guests</option>
                <option value="101-200">101 - 200 guests</option>
                <option value="201-500">201 - 500 guests</option>
                <option value="500+">500+ guests</option>
              </select>
            </div>
            <div class="form-group">
              <label for="modalEventType">Event Type *</label>
              <select id="modalEventType" name="eventType" required>
                <option value="">Select type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="birthday">Birthday Party</option>
                <option value="anniversary">Anniversary</option>
                <option value="private">Private Dinner</option>
                <option value="holiday">Holiday Party</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Service Preference *</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="modalServiceType" value="live-cooking" required>
                <span class="radio-custom"></span>
                <span class="radio-text">
                  <i class="fas fa-fire-burner"></i>
                  On-Site Live Cooking
                </span>
              </label>
              <label class="radio-label">
                <input type="radio" name="modalServiceType" value="delivery">
                <span class="radio-custom"></span>
                <span class="radio-text">
                  <i class="fas fa-box-open"></i>
                  Gourmet Delivery
                </span>
              </label>
              <label class="radio-label">
                <input type="radio" name="modalServiceType" value="hybrid">
                <span class="radio-custom"></span>
                <span class="radio-text">
                  <i class="fas fa-layer-group"></i>
                  Hybrid (Both)
                </span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="modalCuisine">Preferred Cuisine</label>
            <select id="modalCuisine" name="cuisine">
              <option value="">Select cuisine (optional)</option>
              <option value="american-bbq">American BBQ</option>
              <option value="italian">Italian</option>
              <option value="asian">Asian Fusion</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="mexican">Mexican & Latin</option>
              <option value="steakhouse">Steakhouse</option>
              <option value="custom">Custom / Mixed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="modalMessage">Additional Details</label>
            <textarea id="modalMessage" name="message" rows="3" placeholder="Tell us about dietary restrictions, venue details, budget, or any special requests..."></textarea>
          </div>
          <button type="submit" class="btn-primary btn-submit">
            <i class="fas fa-paper-plane"></i>
            Send Quote Request
          </button>
        </form>
      </div>
    </div>
  `;

  // Inject modal into body
  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = modalHTML;
  document.body.appendChild(modalWrapper.firstElementChild);

  // Modal elements
  const modal = document.getElementById('bookModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalForm = document.getElementById('modalQuoteForm');

  // Open modal when clicking Book Now buttons
  document.querySelectorAll('.nav-cta, a[href="contact.html"]').forEach(btn => {
    if (btn.classList.contains('nav-cta') || btn.textContent.toLowerCase().includes('book')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal form submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification('Thank you! We will send you a custom quote within 24 hours.', 'success');
        modalForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeModal();
      }, 2000);
    });
  }

  console.log('A Unique Food Supply - All systems loaded');
});

