/* ============================================
   MAIN JS - Navigation, Scroll, Reveals
   ============================================ */

(function () {
  'use strict';

  // ---- Hero entrance animation ----
  function animateHero() {
    const name = document.getElementById('heroName');
    const headline = document.getElementById('heroHeadline');
    const cta = document.getElementById('heroCta');
    const scroll = document.getElementById('heroScroll');

    if (!name) return;

    // Staggered reveal
    setTimeout(function () {
      name.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      name.style.transform = 'translateY(20px)';
      name.style.opacity = '0';
      // Force reflow
      name.offsetHeight;
      name.style.transform = 'translateY(0)';
      name.style.opacity = '1';
    }, 400);

    setTimeout(function () {
      headline.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      headline.style.transform = 'translateY(15px)';
      headline.style.opacity = '0';
      headline.offsetHeight;
      headline.style.transform = 'translateY(0)';
      headline.style.opacity = '1';
    }, 900);

    setTimeout(function () {
      cta.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      cta.style.transform = 'translateY(10px)';
      cta.style.opacity = '0';
      cta.offsetHeight;
      cta.style.transform = 'translateY(0)';
      cta.style.opacity = '1';
    }, 1300);

    if (scroll) {
      setTimeout(function () {
        scroll.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
        scroll.style.opacity = '1';
      }, 1800);
    }
  }

  // ---- Navbar scroll behavior ----
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = scrollY;
    }, { passive: true });
  }

  // ---- Active nav link tracking ----
  function initNavTracking() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar__link[data-section]');
    var mobileLinks = document.querySelectorAll('.navbar__mobile-link[data-section]');

    if (sections.length === 0 || navLinks.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');

          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === id) {
              link.classList.add('active');
            }
          });

          mobileLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ---- Mobile menu ----
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.contains('open');
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    var mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll reveal ----
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  // ---- Blog page: scroll to post from hash ----
  function initBlogHashScroll() {
    if (!window.location.hash) return;

    setTimeout(function () {
      var target = document.querySelector(window.location.hash);
      if (!target) return;

      var navHeight = 72;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }, 300);
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    animateHero();
    initNavbar();
    initNavTracking();
    initMobileMenu();
    initReveal();
    initSmoothScroll();
    initBlogHashScroll();
  });
})();
