
const wrapper = document.getElementById('carousel-wrapper');
const trackMasked = document.getElementById('track-masked');
const trackUnmasked = document.getElementById('track-unmasked');

const carouselItemsHTML = `
    <div class="curve-box"><div class="box-inner" style="background-color: #333; background-image: url('assets/carasoul/carasoul-1.png');"loading="lazy" ></div></div>
    <div class="curve-box"><div class="box-inner" style="background-color: #444; background-image: url('assets/carasoul/carasoul-2.png');"loading="lazy" ></div></div>
    <div class="curve-box"><div class="box-inner" style="background-color: #555; background-image: url('assets/carasoul/carasoul-3.png');"loading="lazy" ></div></div>
    <div class="curve-box"><div class="box-inner" style="background-color: #666; background-image: url('assets/carasoul/carasoul-4.png');"loading="lazy" ></div></div>
    <div class="curve-box"><div class="box-inner" style="background-color: #777; background-image: url('assets/carasoul/carasoul-5.png');"loading="lazy" ></div></div>
    <div class="curve-box"><div class="box-inner" style="background-color: #888; background-image: url('assets/carasoul/carasoul-1.png');"loading="lazy" ></div></div>
`;

// Multiply the items to create the infinite loop
const fullHTML = carouselItemsHTML.repeat(4);
trackMasked.innerHTML = fullHTML;
trackUnmasked.innerHTML = fullHTML;

const maskedBoxes = Array.from(trackMasked.children);
const unmaskedBoxes = Array.from(trackUnmasked.children);

const boxWidth = 250;
const gap = 30; 
const itemWidth = boxWidth + gap; 
const totalWidth = maskedBoxes.length * itemWidth;
const halfTotal = totalWidth / 2;

let currentX = 0;
let targetX = 0;
let isDragging = false;
let isHovering = false;
let lastClientX = 0;

const autoScrollSpeed = -0.8; 

const render = () => {
  if (!isDragging && !isHovering) {
    targetX += autoScrollSpeed;
  }

  // Smoothly lerp towards the targetX
  currentX += (targetX - currentX) * 0.1;

  for (let i = 0; i < maskedBoxes.length; i++) {
    const basePos = i * itemWidth;
    const pos = basePos + currentX;
    const wrappedPos = ((pos + halfTotal) % totalWidth + totalWidth) % totalWidth - halfTotal;

    const transformStr = `translate3d(${wrappedPos.toFixed(2)}px, 0, 0)`;
    
    maskedBoxes[i].style.transform = transformStr;
    unmaskedBoxes[i].style.transform = transformStr;
  }

  requestAnimationFrame(render);
};

requestAnimationFrame(render);

// --- CONTROLS ---

const handlePointerDown = (clientX) => {
  isDragging = true;
  wrapper.classList.add('active');
  lastClientX = clientX;
};

const handlePointerMove = (clientX) => {
  if (!isDragging) return;
  const deltaX = clientX - lastClientX;
  targetX += deltaX * 1.5;
  lastClientX = clientX;
};

const handlePointerUp = () => {
  isDragging = false;
  wrapper.classList.remove('active');
};

// Mouse Events
wrapper.addEventListener('mousedown', (e) => handlePointerDown(e.pageX));
window.addEventListener('mousemove', (e) => handlePointerMove(e.pageX));
window.addEventListener('mouseup', handlePointerUp);

wrapper.addEventListener('mouseenter', () => isHovering = true);
wrapper.addEventListener('mouseleave', () => {
  isHovering = false;
  handlePointerUp(); 
});

wrapper.addEventListener('touchstart', (e) => {
  isHovering = true;
  handlePointerDown(e.touches[0].pageX);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (isDragging) e.preventDefault();
  handlePointerMove(e.touches[0].pageX);
}, { passive: false });

window.addEventListener('touchend', () => {
  isHovering = false;
  handlePointerUp();
});