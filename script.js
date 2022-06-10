'use strict';

(function () {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  
  function addClickListeners() {
    const toggleTabClasses = event => {
      const clicked = event.target.closest('.tools__tab');
      
      if (!clicked) return;
    
      document.querySelectorAll('.tools__tab')
          .forEach(tab => tab.classList.remove('tools__tab--active'));
      
      clicked.classList.add('tools__tab--active');
      
      document.querySelectorAll('.tools__content')
          .forEach(tab => tab.classList.remove('tools__content--active')
      );
      document
          .querySelector(`.tools__content--${clicked.dataset.tab}`)
          .classList.add('tools__content--active');
    }
    
    document.querySelector('.tools__tab-container')
        .addEventListener('click', toggleTabClasses);
    document.querySelector('.slider__btn--right')
        .addEventListener('click', nextSlide);
    document.querySelector('.slider__btn--left')
        .addEventListener('click', prevSlide);
    document
        .querySelector('.btn--close-cookie')
        .addEventListener('click', () => {
          document.querySelector('.cookie-message').remove();
        });
    document
        .querySelector('.btn--scroll-to')
        .addEventListener('click', () => {
          document.querySelector('#section--1').scrollIntoView();
        });
    
    document.querySelector('.dots')
        .addEventListener('click', event => {
          if (!event.target.classList.contains('dots__dot')) return;
          
          currentSlide = Number(event.target.dataset.slide);
          activateDot();
          showCurrentSlide();
        });
  }
  
  function addKeypressHandler() {
    document.addEventListener('keydown', event => {
      const keydownActions = {
        ArrowRight: nextSlide,
        ArrowLeft: prevSlide,
      };
      
      const action = keydownActions[event.key];
      
      if (action) action();
    });
  }
  
  function setNavLinkOpacity(event, opacity) {
    if (!event.target.classList.contains('nav__link')) return;
    
    const clickedNavLink = event.target;
    const otherNavLinks = clickedNavLink.closest('nav').querySelectorAll('.nav__link');
    otherNavLinks.forEach(navLink => {
      if (navLink === clickedNavLink) return;
      navLink.style.opacity = opacity;
    });
  }
  
  function activateDot() {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide ="${currentSlide}"]`).classList.add('dots__dot--active');
  }
  
  function showCurrentSlide() {
    slides.forEach(
        (slide, index) =>
            (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
    );
  }
  
  function nextSlide() {
    currentSlide === slides.length - 1 ? (currentSlide = 0) : currentSlide++;
    showCurrentSlide();
    activateDot();
  }
  
  function prevSlide() {
    currentSlide === 0 ? (currentSlide = slides.length - 1) : currentSlide--;
    showCurrentSlide();
    activateDot();
  }
  
  function createHeaderIntersectionObserver() {
    const nav = document.querySelector('.nav');
    
    const toggleNavbarSticky = (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) nav.classList.add('sticky');
      else nav.classList.remove('sticky');
    };
    
    (new IntersectionObserver(toggleNavbarSticky, {
      root: null,
      threshold: 0,
      rootMargin: `-${nav.getBoundingClientRect().height}px`,
    })).observe(document.querySelector('.header'));
  }
  
  function createSectionIntersectionObservers() {
    const revealSection = function (entries, observer) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
      root: null,
      threshold: 0.15,
    });
    
    document.querySelectorAll('.section').forEach(section => {
      sectionObserver.observe(section);
    });
  }
  
  function addHoverListeners() {
    const nav = document.querySelector('.nav');
    
    nav.addEventListener('mouseover', event => setNavLinkOpacity(event, 0.5));
    nav.addEventListener('mouseout', event => setNavLinkOpacity(event, 1));
  }
  
  addHoverListeners();
  createHeaderIntersectionObserver();
  createSectionIntersectionObservers();
  addClickListeners();
  addKeypressHandler();
  showCurrentSlide();
  activateDot();
})();
