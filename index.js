const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoSrc = "https://www.youtube.com/watch?v=9T-Zbxg9X_4&list=RD9T-Zbxg9X_4&start_radio=1"; // Replace with your video link

videoModal.addEventListener('show.bs.modal', () => {
  videoFrame.src = videoSrc + "?autoplay=1";
});
videoModal.addEventListener('hidden.bs.modal', () => {
  videoFrame.src = "";
});

// ✅ Count-up animation when visible
function countUp(element) {
  const target = +element.getAttribute("data-target");
  const suffix = element.getAttribute("data-suffix") || ""; // e.g. "K+"
  let count = 0;
  const duration = 3000; // total duration in ms
  const increment = target / (duration / 16); // ~60fps

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

// els.forEach(makeCountup);
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        hasCounted = true;
        statNumbers.forEach((num) => countUp(num));
        const cards = entry.target.querySelectorAll('.reveal');
        
        cards.forEach((card, index) => {
          // Add delay of 2 seconds (2000ms) * index
          setTimeout(() => {
            card.classList.add('in-view');
            card.classList.remove('not-in-view');
          }, index * 150);
        });

        entry.target.classList.add('in-view');
        entry.target.classList.remove('not-in-view');

        observer.unobserve(entry.target);
        // observer.unobserve()
      } else {
        entry.target.classList.add('not-in-view');
      }
    });
  },
  {
    rootMargin: '0px',
    threshold: [0.1],
  }
);
// observer.observe(milestoneSection);

// Observe the section or container that wraps the cards
const tags = document.querySelectorAll('h2, .bringing-card , .trusted' ,'.man' , '.passion');

tags.forEach((tag) => {
  tag.classList.add('not-in-view');
  observer.observe(tag);
});
