function initializeLightbox() {
    if (typeof window.GLightbox === 'undefined') {
      console.warn('GLightbox not yet loaded, retrying...');
      setTimeout(initializeLightbox, 100);
      return;
    }
  
    console.log('Initializing GLightbox');
    const lightbox = window.GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
    });
  
    const grid = document.querySelector('.masonry-grid');
    if (grid) {
      if (typeof window.imagesLoaded === 'undefined') {
        console.error('imagesLoaded is not defined');
        return;
      }
      window.imagesLoaded(grid, () => {
        grid.style.columnCount =
          window.innerWidth >= 1280
            ? 4
            : window.innerWidth >= 1024
            ? 4
            : window.innerWidth >= 640
            ? 3
            : 2;
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    initializeLightbox();
  });