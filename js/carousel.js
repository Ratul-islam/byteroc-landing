
const gg = document.getElementById('boxes-viewport');
const track = document.getElementById('track');

const originalHTML = track.innerHTML;
track.innerHTML = originalHTML + originalHTML + originalHTML + originalHTML; 

const allBoxes = Array.from(track.children);

const boxWidth = 250;
const gap = 30; 
const itemWidth = boxWidth + gap; 
const totalWidth = allBoxes.length * itemWidth;
const halfTotal = totalWidth / 2;

allBoxes.forEach((box, i) => {
  box.dataset.basePos = i * itemWidth;
});

let currentX = 0;
let targetX = 0;
let isDragging = false;
let lastClientX = 0;

const render = () => {
  currentX += (targetX - currentX) * 0.1;

  allBoxes.forEach(box => {
    const basePos = parseFloat(box.dataset.basePos);
    const pos = basePos + currentX;

    const wrappedPos = ((pos + halfTotal) % totalWidth + totalWidth) % totalWidth - halfTotal;

    box.style.transform = `translate3d(${wrappedPos}px, 0, 0)`;
  });

  requestAnimationFrame(render);
};

requestAnimationFrame(render);

const handlePointerDown = (clientX) => {
  isDragging = true;
  gg.classList.add('active');
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
  gg.classList.remove('active');
};

gg.addEventListener('mousedown', (e) => handlePointerDown(e.pageX));
window.addEventListener('mousemove', (e) => handlePointerMove(e.pageX));
window.addEventListener('mouseup', handlePointerUp);
window.addEventListener('mouseleave', handlePointerUp);

gg.addEventListener('touchstart', (e) => handlePointerDown(e.touches[0].pageX));
window.addEventListener('touchmove', (e) => {
  if (isDragging) e.preventDefault();
  handlePointerMove(e.touches[0].pageX);
}, { passive: false });
window.addEventListener('touchend', handlePointerUp);
