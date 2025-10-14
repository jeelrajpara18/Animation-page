/* ---------------------- VIDEO MODAL ---------------------- */
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoSrc = "https://www.youtube.com/watch?v=9T-Zbxg9X_4&list=RD9T-Zbxg9X_4&start_radio=1";

videoModal.addEventListener('show.bs.modal', () => {
  videoFrame.src = videoSrc + "?autoplay=1";
});
videoModal.addEventListener('hidden.bs.modal', () => {
  videoFrame.src = "";
});

/* ---------------------- COUNT-UP ANIMATION ---------------------- */
function countUp(element) {
  const target = +element.getAttribute("data-target");
  const suffix = element.getAttribute("data-suffix") || "";
  let count = 0;
  const duration = 3000;
  const increment = target / (duration / 16);

  const updateCount = () => {
    count += increment;
    if (count < target) {
      element.innerText = Math.floor(count);
      requestAnimationFrame(updateCount);
    } else {
      element.innerText = target + " " + suffix;
    }
  };

  updateCount();
}

const milestoneSection = document.querySelector(".milestone-section");
const statNumbers = document.querySelectorAll(".stat-number");
let hasCounted = false;

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        hasCounted = true;
        statNumbers.forEach((num) => countUp(num));
        const cards = entry.target.querySelectorAll('.reveal');

        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('in-view');
            card.classList.remove('not-in-view');
          }, index * 150);
        });

        entry.target.classList.add('in-view');
        entry.target.classList.remove('not-in-view');
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.add('not-in-view');
      }
    });
  },
  { rootMargin: '0px', threshold: [0.1] }
);

const tags = document.querySelectorAll('h2, .bringing-card, .trusted, .man, .passion');
tags.forEach((tag) => {
  tag.classList.add('not-in-view');
  observer.observe(tag);
});

/* ---------------------- LOGO CAROUSEL ---------------------- */
const logoTrack = document.getElementById("logoTrack");
const logoCarousel = document.getElementById("logoCarousel");
const logoImages = document.querySelectorAll(".logo-track img");
const logoTotal = logoImages.length / 2;

let logoIndex = 0;
let logoInterval;
let logoDragging = false;
let logoStartX, logoCurrentTranslate = 0, logoPrevTranslate = 0;

function moveLogoCarousel() {
  logoIndex++;
  logoTrack.style.transition = "transform 1s ease-in-out";
  logoTrack.style.transform = `translateX(-${logoIndex * 20}vw)`;

  if (logoIndex === logoTotal) {
    setTimeout(() => {
      logoTrack.style.transition = "none";
      logoTrack.style.transform = "translateX(0)";
      logoIndex = 0;
    }, 900);
  }
}

function startLogoAutoSlide() {
  logoInterval = setInterval(moveLogoCarousel, 3000);
}
function stopLogoAutoSlide() {
  clearInterval(logoInterval);
}
startLogoAutoSlide();

// Hover pause
logoCarousel.addEventListener("mouseenter", stopLogoAutoSlide);
logoCarousel.addEventListener("mouseleave", startLogoAutoSlide);

// Drag
logoCarousel.addEventListener("mousedown", logoDragStart);
logoCarousel.addEventListener("mouseup", logoDragEnd);
logoCarousel.addEventListener("mouseleave", logoDragEnd);
logoCarousel.addEventListener("mousemove", logoDragMove);

logoCarousel.addEventListener("touchstart", logoDragStart);
logoCarousel.addEventListener("touchend", logoDragEnd);
logoCarousel.addEventListener("touchmove", logoDragMove);

function logoDragStart(e) {
  logoDragging = true;
  logoStartX = getLogoPosX(e);
  stopLogoAutoSlide();
  logoCarousel.style.cursor = "grabbing";
}

function logoDragEnd() {
  if (!logoDragging) return;
  logoDragging = false;
  logoCarousel.style.cursor = "grab";
  const movedBy = logoCurrentTranslate - logoPrevTranslate;
  if (movedBy < -50) logoIndex++;
  if (movedBy > 50) logoIndex--;
  if (logoIndex < 0) logoIndex = logoTotal - 1;
  if (logoIndex >= logoTotal) logoIndex = 0;
  setLogoPosition();
  startLogoAutoSlide();
}

function logoDragMove(e) {
  if (!logoDragging) return;
  const currentX = getLogoPosX(e);
  logoCurrentTranslate = logoPrevTranslate + (currentX - logoStartX);
  logoTrack.style.transform = `translateX(${logoCurrentTranslate}px)`;
}

function getLogoPosX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}
function setLogoPosition() {
  logoTrack.style.transition = "transform 0.6s ease-in-out";
  logoTrack.style.transform = `translateX(-${logoIndex * 20}vw)`;
}

/* ---------------------- CLIENT CAROUSEL ---------------------- */
const clientTrack = document.querySelector('.carousel-track');
const clientCards = Array.from(clientTrack.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

const clientGap = parseInt(window.getComputedStyle(clientTrack).gap) || 0;
function getClientCardWidth() {
  return clientCards[0].offsetWidth + clientGap;
}
function getVisibleClientCount() {
  return Math.floor(document.querySelector('.carousel-client').offsetWidth / getClientCardWidth());
}

// Clone edges for infinite scroll
const visibleClientCount = getVisibleClientCount();
const firstClientClones = clientCards.slice(0, visibleClientCount).map(c => c.cloneNode(true));
const lastClientClones = clientCards.slice(-visibleClientCount).map(c => c.cloneNode(true));

firstClientClones.forEach(c => clientTrack.appendChild(c));
lastClientClones.forEach(c => clientTrack.insertBefore(c, clientTrack.firstChild));

const allClientCards = Array.from(clientTrack.children);
let clientIndex = visibleClientCount;
let clientDragging = false, clientStartX = 0, clientCurrentTranslate = 0, clientPrevTranslate = 0;

function moveClientSlide(transition = true) {
  const cardWidth = getClientCardWidth();
  clientTrack.style.transition = transition ? 'transform 0.6s ease' : 'none';
  clientTrack.style.transform = `translateX(-${clientIndex * cardWidth}px)`;
}
moveClientSlide(false);

function handleClientTransitionEnd() {
  const total = allClientCards.length;
  if (clientIndex >= total - visibleClientCount) {
    clientIndex = visibleClientCount;
    moveClientSlide(false);
  } else if (clientIndex < visibleClientCount) {
    clientIndex = total - visibleClientCount * 2;
    moveClientSlide(false);
  }
  clientTrack.removeEventListener('transitionend', handleClientTransitionEnd);
}

nextButton.addEventListener('click', () => {
  clientIndex++;
  moveClientSlide();
  clientTrack.addEventListener('transitionend', handleClientTransitionEnd);
});

prevButton.addEventListener('click', () => {
  clientIndex--;
  moveClientSlide();
  clientTrack.addEventListener('transitionend', handleClientTransitionEnd);
});

// Dragging
const clientCarousel = document.querySelector('.carousel-client');

clientCarousel.addEventListener('mousedown', clientDragStart);
clientCarousel.addEventListener('touchstart', clientDragStart, { passive: true });
clientCarousel.addEventListener('mousemove', clientDragMove);
clientCarousel.addEventListener('touchmove', clientDragMove, { passive: true });
clientCarousel.addEventListener('mouseup', clientDragEnd);
clientCarousel.addEventListener('mouseleave', clientDragEnd);
clientCarousel.addEventListener('touchend', clientDragEnd);

function clientDragStart(e) {
  clientDragging = true;
  clientStartX = getClientPosX(e);
  clientPrevTranslate = -clientIndex * getClientCardWidth();
  clientTrack.style.transition = 'none';
}

function clientDragMove(e) {
  if (!clientDragging) return;
  const currentX = getClientPosX(e);
  const diff = currentX - clientStartX;
  clientCurrentTranslate = clientPrevTranslate + diff;
  clientTrack.style.transform = `translateX(${clientCurrentTranslate}px)`;
}

function clientDragEnd(e) {
  if (!clientDragging) return;
  clientDragging = false;
  const movedBy = clientCurrentTranslate - clientPrevTranslate;
  const threshold = getClientCardWidth() / 4;

  if (movedBy < -threshold) clientIndex++;
  else if (movedBy > threshold) clientIndex--;

  moveClientSlide();
  clientTrack.addEventListener('transitionend', handleClientTransitionEnd);
}

function getClientPosX(e) {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

// Resize handling
window.addEventListener('resize', () => {
  moveClientSlide(false);
});

/* ---------------------- CARD ACTIVE STATE ---------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card-box');
  if (cards.length > 0) cards[0].classList.add('active');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
});
