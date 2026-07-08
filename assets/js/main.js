/**
* Template Name: Yummy
* Template URL: https://bootstrapmade.com/yummy-bootstrap-restaurant-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Cookie consent banner
   */
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  function setCookie(name, value, days) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expiryDate.toUTCString()};path=/`;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptBtn');

    if (cookieConsent && !getCookie('cookieConsent')) {
      cookieConsent.style.display = 'block';
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        setCookie('cookieConsent', 'accepted', 30);
        if (cookieConsent) {
          cookieConsent.style.display = 'none';
        }
      });
    }
  });

  /**
   * Menu section switcher
   */
  function showMenu(sectionId) {
    const sections = document.querySelectorAll('.menu-section');
    const buttons = document.querySelectorAll('.menu-btn');

    sections.forEach((section) => {
      const isActive = section.id === sectionId;
      section.hidden = !isActive;
      section.classList.toggle('active', isActive);
      section.classList.toggle('show', isActive);
    });

    buttons.forEach((button) => {
      const targetId = button.getAttribute('data-menu-target');
      button.classList.toggle('active', targetId === sectionId);
    });
  }

  document.querySelectorAll('.menu-btn[data-menu-target]').forEach((button) => {
    button.addEventListener('click', () => {
      showMenu(button.getAttribute('data-menu-target'));
    });
  });

  if (document.getElementById('menu-starters')) {
    showMenu('menu-starters');
  }

  /**
   * Testimonials slider
   */
  document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSlider = document.querySelector('.mySwiper');
    if (testimonialsSlider) {
      new Swiper('.mySwiper', {
        loop: true,
        speed: 600,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        slidesPerView: 1,
        pagination: {
          el: testimonialsSlider.querySelector('.swiper-pagination'),
          clickable: true,
        }
      });
    }
  });

  /**
   * Events clock
   */
  function updateClock() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const ampmElement = document.getElementById('ampm');

    if (!hoursElement || !minutesElement || !secondsElement || !ampmElement) {
      return;
    }

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    hoursElement.innerText = hours.toString().padStart(2, '0');
    minutesElement.innerText = minutes;
    secondsElement.innerText = seconds;
    ampmElement.innerText = ampm;
    ampmElement.classList.add('highlight');
  }

  if (document.getElementById('hours')) {
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  /**
   * Reservation form validation
   */
  const reservationForm = document.querySelector('.reservation-form');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (event) => {
      const name = document.getElementById('name')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const people = document.getElementById('people')?.value.trim() || '';
      const date = document.getElementById('date')?.value || '';
      const time = document.getElementById('time')?.value || '';
      const errorMessage = document.getElementById('errorMsg');

      let error = '';

      if (!name) {
        error = 'Please enter your name.';
      } else if (!/^\d{10,11}$/.test(phone)) {
        error = 'Enter valid phone number (10 or 11 digits).';
      } else if (!people || Number.parseInt(people, 10) < 1) {
        error = 'Number of people must be at least 1.';
      } else if (!date) {
        error = 'Please select a date.';
      } else if (!time) {
        error = 'Please select a time.';
      }

      if (error) {
        event.preventDefault();
        if (errorMessage) {
          errorMessage.innerText = error;
        }
        return;
      }

      if (errorMessage) {
        errorMessage.innerText = '';
      }

      window.alert('Booking successful!');
    });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      window.alert('Message sent successfully!');
      contactForm.reset();
    });
  }

})();