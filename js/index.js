// Import the necessary function for preloading images
import { preloadImages } from './utils.js';

// Define a variable that will store the Lenis smooth scrolling object
let lenis;

// Function to initialize Lenis for smooth scrolling
const initSmoothScrolling = () => {
  // Instantiate the Lenis object with specified properties
  lenis = new Lenis({
    lerp: 0.1, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on('scroll', () => ScrollTrigger.update());

  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time); // Run Lenis' requestAnimationFrame method
    requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
  };
  // Start the animation frame loop
  requestAnimationFrame(scrollFn);
};

// Function to trigger Flip animations when scrolling
const triggerFlipOnScroll = (galleryEl, options) => {
  // Default settings for Flip and ScrollTrigger
  let settings = {
    flip: {
      absoluteOnLeave: false,
      absolute: false,
      scale: true,
      simple: true,
      //...
    },
    scrollTrigger: {
      start: 'center center',
      end: '+=300%',
    },
    stagger: 0,
  };

  // Merge default settings with options provided when calling the function
  settings = Object.assign({}, settings, options);

  // Select elements within the gallery that will be animated
  const galleryCaption = galleryEl.querySelector('.caption');
  const galleryItems = galleryEl.querySelectorAll('.gallery__item');
  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  // Temporarily add the final class to capture the final state
  galleryEl.classList.add('gallery--switch');
  const flipstate = Flip.getState([galleryItems, galleryCaption], {
    props: 'filter, opacity',
  });

  // Remove the final class to revert to the initial state
  galleryEl.classList.remove('gallery--switch');

  // Create the Flip animation timeline
  const tl = Flip.to(flipstate, {
    ease: 'none',
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
    },
    stagger: settings.stagger,
  });

  // If there are inner elements in the gallery items, animate them too
  if (galleryItemsInner.length) {
    tl.fromTo(
      galleryItemsInner,
      {
        scale: 2,
      },
      {
        scale: 1,
        scrollTrigger: {
          trigger: galleryEl,
          start: settings.scrollTrigger.start,
          end: settings.scrollTrigger.end,
          scrub: true,
        },
      },
      0
    );
  }
};

// Function to apply scroll-triggered animations to various galleries
// Apply scroll-triggered animations to each gallery with specific settings
const scroll = () => {
  // Define the gallery IDs and their options
  const galleries = [
    // { id: '#gallery-1', options: { flip: { absoluteOnLeave: true, scale: false } } },
    // { id: '#gallery-2' },
    // {
    // 	id: '#gallery-3',
    // 	options: {
    // 		flip: { absolute: true, scale: false },
    // 		scrollTrigger: { start: 'center center', end: '+=900%' },
    // 		stagger: 0.05,
    // 	},
    // },
    { id: '#gallery-4' },
    { id: '#gallery-5' },
    // { id: '#gallery-6' },
    { id: '#gallery-7' },
    // { id: '#gallery-8', options: { flip: { scale: false } } },
    // { id: '#gallery-9' },
  ];

  // Loop through the galleries and apply the scroll-triggered animations
  galleries.forEach((gallery) => {
    const galleryElement = document.querySelector(gallery.id);
    triggerFlipOnScroll(galleryElement, gallery.options);
  });
};

// Preload images, initialize smooth scrolling, apply scroll-triggered animations, and remove loading class from body
preloadImages('.gallery__item').then(() => {
  initSmoothScrolling();
  scroll();
  document.body.classList.remove('loading');
});

// Open modal when clicking on the overlay icons in gallery item
document.querySelectorAll('.overlay i').forEach((icon, index) => {
  icon.addEventListener('click', () => {
    // Video URL parameter (customize as needed for your use case)
    const videoLinks = [
      'https://www.youtube.com/embed/VdrFa9uQR14',
      'https://www.youtube.com/embed/00uAgrFde6E',
      'https://www.youtube.com/embed/peMc33tefjc',
      'https://www.youtube.com/embed/jNYV8G1ekHQ',
      'https://www.youtube.com/embed/xxNeNFXBpys',
      'https://www.youtube.com/embed/FCdi9uc5XkM',
    ];
    const videoURL = videoLinks[index] || '';

    // Create modal structure
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <iframe 
          src="${videoURL}?autoplay=1&rel=0" 
          frameborder="0" 
          allow="autoplay; encrypted-media" 
          allowfullscreen>
        </iframe>
      </div>
    `;
    document.body.appendChild(modal);

    // Close modal
    modal.querySelector('.close').addEventListener('click', () => {
      modal.remove();
    });

    // Close modal by clicking on the background
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  });
});

// Modal CSS
const style = document.createElement('style');
style.innerHTML = `
   .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    height: 70%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
	margin:auto;
  }

  .modal-content {
    position: relative;
    background: transparent;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .modal-content .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    color: white;
    cursor: pointer;
    z-index: 1001;
  }

  .modal-content .close:hover {
    color: red;
  }
`;
document.head.appendChild(style);
