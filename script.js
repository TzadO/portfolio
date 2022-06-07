'use strict';

const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLink = document.querySelectorAll('.nav__link');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.tools__tab');
const tabsContainer = document.querySelector('.tools__tab-container');
const tabsContent = document.querySelectorAll('.tools__content');
const allSections = document.querySelectorAll('.section');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

function cookieMessage() {
  const message = document.createElement('div');
  message.classList.add('cookie-message');
  message.innerHTML =
    'Ik houd van chocolate chip cookies!<button class="btn btn--close-cookie">OK</button>';
  header.append(message);
  document
    .querySelector('.btn--close-cookie')
    .addEventListener('click', function () {
      message.remove();
    });
}
cookieMessage();

function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;        
    });
  }
}

//Eventlisteners
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView();
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.tools__tab');
  if (clicked) {
    tabs.forEach(tab => tab.classList.remove('tools__tab--active'));
    clicked.classList.add('tools__tab--active');
    tabsContent.forEach(tab =>
      tab.classList.remove('tools__content--active')
    );
    document
      .querySelector(`.tools__content--${clicked.dataset.tab}`)
      .classList.add('tools__content--active');
  }
});

// Scrollers
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

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
allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

//Slider
let currSlide = 0;

function createDots() {
  slides.forEach(function (_, index) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

function nextSlide() {
  currSlide === slides.length - 1 ? (currSlide = 0) : currSlide++;
  goToSlide();
  activateDot(currSlide);
}

function prevSlide() {
  currSlide === 0 ? (currSlide = slides.length - 1) : currSlide--;
  goToSlide();
  activateDot(currSlide);
}

function goToSlide() {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - currSlide)}%)`)
  );
}

function activateDot(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide ="${slide}"]`).classList.add('dots__dot--active');
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});
dotsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    currSlide = +e.target.dataset.slide;
    activateDot(currSlide);
    goToSlide();
  }
})

function init() {
  createDots();
  goToSlide(currSlide);
  activateDot(currSlide);
}
init();

