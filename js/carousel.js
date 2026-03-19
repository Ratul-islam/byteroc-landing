
const viewport = document.getElementById('viewport');
const track = document.getElementById('track');

// 1. Clone enough boxes to completely cover even the widest 4K monitors
const originalHTML = track.innerHTML;
// 4 sets guarantees the math wraps entirely off-screen, making it invisible
track.innerHTML = originalHTML + originalHTML + originalHTML + originalHTML; 

const allBoxes = Array.from(track.children);

// 2. Setup Dimensions
const boxWidth = 250;
const gap = 30; // 15px visual gap on each side
const itemWidth = boxWidth + gap; 
const totalWidth = allBoxes.length * itemWidth;
const halfTotal = totalWidth / 2;

// 3. Assign Base Coordinates
allBoxes.forEach((box, i) => {
  box.dataset.basePos = i * itemWidth;
});

// Lerp & Drag Variables
let currentX = 0;
let targetX = 0;
let isDragging = false;
let lastClientX = 0;

// 4. The Cylinder Math (The Magic Loop)
const render = () => {
  // Lerp for buttery inertia
  currentX += (targetX - currentX) * 0.1;

  allBoxes.forEach(box => {
    const basePos = parseFloat(box.dataset.basePos);
    const pos = basePos + currentX;

    // This modulo equation locks the boxes onto a continuous cylinder.
    // When a box goes too far left, it instantly teleports to the far right,
    // safely hidden off-screen.
    const wrappedPos = ((pos + halfTotal) % totalWidth + totalWidth) % totalWidth - halfTotal;

    box.style.transform = `translate3d(${wrappedPos}px, 0, 0)`;
  });

  requestAnimationFrame(render);
};

// Start rendering
requestAnimationFrame(render);

// 5. Drag Logic
const handlePointerDown = (clientX) => {
  isDragging = true;
  viewport.classList.add('active');
  lastClientX = clientX;
};

const handlePointerMove = (clientX) => {
  if (!isDragging) return;
  const deltaX = clientX - lastClientX;
  targetX += deltaX * 1.5; // Multiply by 1.5 for a faster spin
  lastClientX = clientX;
};

const handlePointerUp = () => {
  isDragging = false;
  viewport.classList.remove('active');
};

// Mouse Events
viewport.addEventListener('mousedown', (e) => handlePointerDown(e.pageX));
window.addEventListener('mousemove', (e) => handlePointerMove(e.pageX));
window.addEventListener('mouseup', handlePointerUp);
window.addEventListener('mouseleave', handlePointerUp);

// Touch Events
viewport.addEventListener('touchstart', (e) => handlePointerDown(e.touches[0].pageX));
window.addEventListener('touchmove', (e) => {
  if (isDragging) e.preventDefault();
  handlePointerMove(e.touches[0].pageX);
}, { passive: false });
window.addEventListener('touchend', handlePointerUp);
