document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const btnLeft = document.querySelector('.arrow-left');
    const btnRight = document.querySelector('.arrow-right');
  
    if (!carousel || !btnLeft || !btnRight) return;
  
    // Measure one card’s full width (including gap)
    const card = carousel.querySelector('.card');
    const style = getComputedStyle(card);
    const gap = parseInt(style.marginRight, 10) || 0;
    const scrollAmount = card.offsetWidth + gap;
  
    btnLeft.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  
    btnRight.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });
  