"use strict";

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function nextSlide() {
  currentSlide === slides.length - 1 ? (currentSlide = 0) : currentSlide++;
  goToSlide();
  activateDot(currentSlide);
}

function prevSlide() {
  currentSlide === 0 ? (currentSlide = slides.length - 1) : currentSlide--;
  goToSlide();
  activateDot(currentSlide);
}

function goToSlide() {
  slides.forEach((slide, index) => (slide.style.transform = 
    `translateX(${100 * (index - currentSlide)}%)`));
}

function createDots() {
  slides.forEach(function (_, index) {
    document.querySelector(".dots").insertAdjacentHTML("beforeend",
      `<button class="dots__dot" data-slide="${index}"></button>`);
  });
}

function activateDot(slide) {
  document.querySelectorAll(".dots__dot").forEach((dot) => dot.classList.remove("dots__dot--active"));
  document.querySelector(`.dots__dot[data-slide ="${slide}"]`).classList.add("dots__dot--active");
}

function setNavOpacity(event, opacity) {
  if (event.target.classList.contains('nav__link')) {
    const clickedNavLink = event.target;
    const allNavLinks = clickedNavLink.closest('.nav').querySelectorAll('.nav__link');
    
    allNavLinks.forEach(navLink => {
      if (navLink !== clickedNavLink)
      navLink.style.opacity = opacity;
    });
  }
}


function addHoverListeners() {
  const nav = document.querySelector(".nav");
  nav.addEventListener('mouseover', event => setNavOpacity(event, 0.5));
  nav.addEventListener('mouseout', event => setNavOpacity(event, 0.95));
}


function addClickListeners() {
  document.querySelector(".btn--scroll-to").addEventListener("click", () =>
    document.querySelector("#section--1").scrollIntoView());

  document.querySelector(".btn--close-cookie").addEventListener("click", () =>
    document.querySelector('.cookie-message').remove());

  document.querySelector(".tools__tab-container").addEventListener("click", function (event) {
    const clicked = event.target.closest(".tools__tab");
    if (!clicked) return;
    document.querySelectorAll(".tools__tab").forEach(tab =>
      tab.classList.remove("tools__tab--active"));
    document.querySelectorAll(".tools__content").forEach(tab => 
      tab.classList.remove("tools__content--active"));
    clicked.classList.add("tools__tab--active");
    document.querySelector(`.tools__content--${clicked.dataset.tab}`).classList.add("tools__content--active");
  });

  document.querySelector(".slider__btn--right").addEventListener("click", nextSlide);
  document.querySelector(".slider__btn--left").addEventListener("click", prevSlide);

  document.querySelector(".dots").addEventListener("click", function (event) {
    if (event.target.classList.contains("dots__dot")) {
      currentSlide = Number(event.target.dataset.slide);
      activateDot(currentSlide);
      goToSlide();
    }
  });
}


function addKeyListeners() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });
}


function addHeaderIntersectionObserver(){
  const nav = document.querySelector(".nav");

  const toggleStickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  };

  (new IntersectionObserver(toggleStickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  })).observe(document.querySelector(".header"));
}


function addSectionIntersectionObserver() {
  const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  document.querySelectorAll(".section").forEach(function (section) {
    sectionObserver.observe(section);
  });
}

addSectionIntersectionObserver();
addHeaderIntersectionObserver();
addHoverListeners();
addClickListeners();
addKeyListeners();
goToSlide();
createDots();
activateDot(currentSlide);