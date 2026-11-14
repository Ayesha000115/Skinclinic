/* ==========================================================================
   LifeSecure Skin Clinic — Shared Interactive Script (Pure Vanilla JS)
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Centralized Clinic Configuration (Edit once to update across all pages)
   */
  const CLINIC_CONFIG = {
    name: 'LifeSecure Skin Clinic',
    doctor: 'Dr. Abhishek Verma',
    phoneDisplay: '+44 161 555 0142',
    phoneHref: 'tel:+441615550142',
    whatsappNumber: '447700900123',
    defaultWhatsappMessage:
      'Hello, I would like to enquire about your dermatology services.',
    email: 'hello@lifesecureskinclinic.co.uk',
    location: '10 King Street, Manchester, M2 6AG, United Kingdom',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=10+King+Street+Manchester+M2+6AG+United+Kingdom'
  };

  function buildWhatsappUrl(customMessage) {
    const text = encodeURIComponent(
      customMessage || CLINIC_CONFIG.defaultWhatsappMessage
    );
    return 'https://wa.me/' + CLINIC_CONFIG.whatsappNumber + '?text=' + text;
  }

  /**
   * 1. Hydrate Centralized WhatsApp, Phone, Email & Location Links
   */
  function hydrateClinicLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
      const customMsg = el.getAttribute('data-whatsapp');
      el.setAttribute('href', buildWhatsappUrl(customMsg));
      if (!el.getAttribute('target')) {
        el.setAttribute('target', '_blank');
      }
      el.setAttribute('rel', 'noopener noreferrer');
    });

    document.querySelectorAll('[data-phone-link]').forEach(function (el) {
      el.setAttribute('href', CLINIC_CONFIG.phoneHref);
    });

    document.querySelectorAll('[data-email-link]').forEach(function (el) {
      el.setAttribute('href', 'mailto:' + CLINIC_CONFIG.email);
    });

    document.querySelectorAll('[data-maps-link]').forEach(function (el) {
      el.setAttribute('href', CLINIC_CONFIG.mapsUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /**
   * 2. Sticky Header Shadow & Active Page Highlight
   */
  function initHeaderAndNav() {
    const header = document.querySelector('.site-header');
    if (header) {
      const onScroll = function () {
        if (window.scrollY > 12) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Highlight active page dynamically as a safeguard alongside server/static classes
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentFile = rawPath === '' ? 'index.html' : rawPath;

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const cleanHref = href.split('#')[0].replace(/^\//, '') || 'index.html';
      if (cleanHref === currentFile) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // Mobile hamburger toggle
    const toggleBtn = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.getElementById('mobile-nav');
    if (toggleBtn && mobileNav) {
      const closeMenu = function () {
        mobileNav.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      };

      toggleBtn.addEventListener('click', function () {
        const isOpen = mobileNav.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });

      mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
          closeMenu();
          toggleBtn.focus();
        }
      });
    }
  }

  /**
   * 3. Image Fallback Handler (Zero-Broken-Image Policy)
   */
  function initImageFallbacks() {
    document.querySelectorAll('.media-frame img').forEach(function (img) {
      const markError = function () {
        const frame = img.closest('.media-frame');
        if (frame) {
          frame.classList.add('is-error');
        }
      };

      img.addEventListener('error', markError);
      if (img.complete && img.naturalWidth === 0) {
        markError();
      }
    });
  }

  /**
   * 4. Viewport Scroll Reveal Animations (Intersection Observer)
   */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * 5. Animated Statistics Counters
   */
  function initStatCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = function (el) {
      const target = parseInt(el.getAttribute('data-counter') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';

      if (prefersReduced || target <= 0) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }

      const duration = 1100;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * 6. Subtle Hero Image Parallax (Desktop, Reduced-Motion Safe)
   */
  function initHeroParallax() {
    const heroImg = document.querySelector('.hero-bg-img');
    if (!heroImg) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            const offset = Math.min(window.scrollY * 0.16, 70);
            heroImg.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /**
   * 7. Services Page Category Filter
   */
  function initServiceFilters() {
    const filterButtons = document.querySelectorAll('[data-service-filter]');
    const serviceCards = document.querySelectorAll('[data-service-cat]');
    if (!filterButtons.length || !serviceCards.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const selected = btn.getAttribute('data-service-filter');

        filterButtons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        serviceCards.forEach(function (card) {
          const cats = (card.getAttribute('data-service-cat') || '').split(' ');
          if (selected === 'all' || cats.indexOf(selected) !== -1) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * 8. FAQ Accordion (Single Open Item at a Time + Smooth Toggle)
   */
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('.faq-trigger');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const currentItem = trigger.closest('.faq-item');
        const list = trigger.closest('.faq-list');
        const isCurrentlyExpanded =
          trigger.getAttribute('aria-expanded') === 'true';

        if (list) {
          list.querySelectorAll('.faq-item').forEach(function (item) {
            const btn = item.querySelector('.faq-trigger');
            const panelId = btn ? btn.getAttribute('aria-controls') : null;
            const panel = panelId ? document.getElementById(panelId) : item.querySelector('.faq-panel');
            item.classList.remove('is-open');
            if (btn) {
              btn.setAttribute('aria-expanded', 'false');
            }
            if (panel) {
              panel.setAttribute('aria-hidden', 'true');
            }
          });
        }

        if (!isCurrentlyExpanded) {
          const panelId = trigger.getAttribute('aria-controls');
          const panel = panelId
            ? document.getElementById(panelId)
            : currentItem
              ? currentItem.querySelector('.faq-panel')
              : null;
          if (currentItem) {
            currentItem.classList.add('is-open');
          }
          trigger.setAttribute('aria-expanded', 'true');
          if (panel) {
            panel.setAttribute('aria-hidden', 'false');
          }
        }
      });
    });
  }

  /**
   * 9. Gallery Category Filters & Accessible Lightbox
   */
  function initGalleryAndLightbox() {
    const filterButtons = document.querySelectorAll('[data-gallery-filter]');
    const galleryItems = Array.from(
      document.querySelectorAll('[data-gallery-item]')
    );
    const lightbox = document.getElementById('gallery-lightbox');

    if (filterButtons.length && galleryItems.length) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const cat = btn.getAttribute('data-gallery-filter');
          filterButtons.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');

          galleryItems.forEach(function (item) {
            const itemCat = item.getAttribute('data-gallery-cat');
            if (cat === 'all' || itemCat === cat) {
              item.classList.remove('is-hidden');
            } else {
              item.classList.add('is-hidden');
            }
          });
        });
      });
    }

    if (!lightbox || !galleryItems.length) return;

    const lbImg = document.getElementById('lightbox-image');
    const lbCat = document.getElementById('lightbox-category');
    const lbTitle = document.getElementById('lightbox-title');
    const lbCounter = document.getElementById('lightbox-counter');
    const lbClose = document.getElementById('lightbox-close');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');

    let visibleItems = galleryItems;
    let activeIndex = 0;
    let lastFocused = null;

    function updateLightboxView() {
      const current = visibleItems[activeIndex];
      if (!current) return;

      const src = current.getAttribute('data-src') || '';
      const alt = current.getAttribute('data-alt') || '';
      const cat = current.getAttribute('data-label-cat') || '';
      const title = current.getAttribute('data-label-title') || '';

      if (lbImg) {
        lbImg.setAttribute('src', src);
        lbImg.setAttribute('alt', alt);
      }
      if (lbCat) lbCat.textContent = cat;
      if (lbTitle) lbTitle.textContent = title;
      if (lbCounter) {
        lbCounter.textContent =
          String(activeIndex + 1) + ' / ' + String(visibleItems.length);
      }
    }

    function openLightbox(item) {
      visibleItems = galleryItems.filter(function (el) {
        return !el.classList.contains('is-hidden');
      });
      activeIndex = Math.max(visibleItems.indexOf(item), 0);
      lastFocused = document.activeElement;
      updateLightboxView();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    function showPrev() {
      activeIndex =
        (activeIndex - 1 + visibleItems.length) % visibleItems.length;
      updateLightboxView();
    }

    function showNext() {
      activeIndex = (activeIndex + 1) % visibleItems.length;
      updateLightboxView();
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(item);
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', showPrev);
    if (lbNext) lbNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    });
  }

  /**
   * 10. Contact Page Quick Inquiry Composer (Client-Side Validation + WhatsApp/Email)
   */
  function initContactComposer() {
    const form = document.getElementById('clinic-inquiry-form');
    if (!form) return;

    const feedback = document.getElementById('inquiry-feedback');
    const nameInput = document.getElementById('inquiry-name');
    const phoneInput = document.getElementById('inquiry-phone');
    const topicSelect = document.getElementById('inquiry-topic');
    const messageInput = document.getElementById('inquiry-message');
    const emailFallbackBtn = document.getElementById('inquiry-email-btn');

    function showFeedback(text, isError) {
      if (!feedback) return;
      feedback.textContent = text;
      feedback.classList.add('is-visible');
      feedback.classList.toggle('is-error', isError);
      feedback.classList.toggle('is-success', !isError);
    }

    function validateAndBuildMessage() {
      const name = (nameInput ? nameInput.value : '').trim();
      const phone = (phoneInput ? phoneInput.value : '').trim();
      const topic = (topicSelect ? topicSelect.value : '').trim();
      const notes = (messageInput ? messageInput.value : '').trim();

      if (name.length < 2) {
        showFeedback('Please enter your full name (at least 2 characters).', true);
        if (nameInput) nameInput.focus();
        return null;
      }

      if (phone && !/^[+\d\s()-]{7,18}$/.test(phone)) {
        showFeedback('Please enter a valid contact phone number.', true);
        if (phoneInput) phoneInput.focus();
        return null;
      }

      const parts = [
        'Hello LifeSecure Skin Clinic,',
        'Name: ' + name
      ];
      if (phone) parts.push('Phone: ' + phone);
      if (topic) parts.push('Enquiry Topic: ' + topic);
      if (notes) parts.push('Details: ' + notes);

      return parts.join('\n');
    }

    const whatsappActionLink = document.getElementById('inquiry-whatsapp-ready');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const message = validateAndBuildMessage();
      if (!message) return;

      const waUrl = buildWhatsappUrl(message);
      if (whatsappActionLink) {
        whatsappActionLink.setAttribute('href', waUrl);
        whatsappActionLink.hidden = false;
      }

      showFeedback(
        'Your enquiry is ready. Click "Send Prepared Enquiry on WhatsApp" below to message the clinic desk directly.',
        false
      );
    });

    if (emailFallbackBtn) {
      emailFallbackBtn.addEventListener('click', function () {
        const message = validateAndBuildMessage();
        if (!message) return;

        const topic = (topicSelect ? topicSelect.value : '') || 'Consultation Enquiry';
        const mailto =
          'mailto:' +
          CLINIC_CONFIG.email +
          '?subject=' +
          encodeURIComponent(topic + ' — ' + CLINIC_CONFIG.name) +
          '&body=' +
          encodeURIComponent(message);

        emailFallbackBtn.setAttribute('href', mailto);
        showFeedback('Your email draft has been prepared in your mail application.', false);
      });
    }
  }

  /**
   * 11. Footer Current Year
   */
  function updateCopyrightYear() {
    document.querySelectorAll('[data-current-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    hydrateClinicLinks();
    initHeaderAndNav();
    initImageFallbacks();
    initScrollReveal();
    initStatCounters();
    initHeroParallax();
    initServiceFilters();
    initFaqAccordion();
    initGalleryAndLightbox();
    initContactComposer();
    updateCopyrightYear();
  });
})();
