document.addEventListener('DOMContentLoaded', () => {
  // Grab the scrollable wrapper, not the inner .carousel
  const wrapper = document.querySelector('.carousel-wrapper');
  const btnLeft = document.querySelector('.arrow-left');
  const btnRight = document.querySelector('.arrow-right');

  if (!wrapper || !btnLeft || !btnRight) return;

  // Measure one card’s width (+ gap)
  const card = wrapper.querySelector('.card');
  const style = getComputedStyle(card);
  const gap = parseInt(style.marginRight, 10) || 0;
  const scrollAmount = card.offsetWidth + gap;

  btnLeft.addEventListener('click', () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  btnRight.addEventListener('click', () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
});
