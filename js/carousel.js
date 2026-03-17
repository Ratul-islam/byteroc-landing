const imageUrls = [
  "../assets/carasoul/carasoul-1.png",
  "../assets/carasoul/carasoul-2.png",
  "../assets/carasoul/carasoul-3.png",
  "../assets/carasoul/carasoul-4.png",
  "../assets/carasoul/carasoul-5.png"
];

const carousel = document.getElementById("carousel");
const track = document.getElementById("track");

let speedPxPerSec = 55;
let x = 0;
let lastTime = 0;
let paused = false;
let oneSetWidth = 0;

carousel.addEventListener("mouseenter", () => (paused = true));
carousel.addEventListener("mouseleave", () => (paused = false));

function createCard(url, idx) {
  const card = document.createElement("div");
  card.className = "cara-card";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1000 1700");
  const clipId = `clip-${idx}-${Math.random().toString(36).slice(2, 8)}`;
  svg.innerHTML = `
    <defs>
      <clipPath id="${clipId}" clipPathUnits="objectBoundingBox">
        <path id="p-${idx}" d=""></path>
      </clipPath>
    </defs>
    <image class="img" href="${url}" x="0" y="0" width="1000" height="1400" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"></image>
  `;
  card.appendChild(svg);
  return card;
}

function buildOneSet(setIndex) {
  const set = document.createElement("div");
  set.className = "set";
  imageUrls.forEach((url, i) => set.appendChild(createCard(url, `${setIndex}-${i}`)));
  return set;
}

function ensureEnoughSets() {
  while (track.children.length < 3) track.appendChild(buildOneSet(track.children.length));
  oneSetWidth = track.children[0].getBoundingClientRect().width;
  const neededWidth = carousel.clientWidth + oneSetWidth * 2;
  let totalWidth = [...track.children].reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
  while (totalWidth < neededWidth) {
    const set = buildOneSet(track.children.length);
    track.appendChild(set);
    totalWidth += set.getBoundingClientRect().width;
  }
}

function roundedTrapezoidPath(topLeftY, topRightY, bottomRightY, bottomLeftY, r = 0.07) {
  const x0 = 0, x1 = 1, y0 = topLeftY, y1 = topRightY, y2 = bottomRightY, y3 = bottomLeftY;
  return `M ${x0 + r} ${y0} L ${x1 - r} ${y1} C ${x1 - r / 2} ${y1} ${x1} ${y1 + r / 2} ${x1} ${y1 + r} L ${x1} ${y2 - r} C ${x1} ${y2 - r / 2} ${x1 - r / 2} ${y2} ${x1 - r} ${y2} L ${x0 + r} ${y3} C ${x0 + r / 2} ${y3} ${x0} ${y3 - r / 2} ${x0} ${y3 - r} L ${x0} ${y0 + r} C ${x0} ${y0 + r / 2} ${x0 + r / 2} ${y0} ${x0 + r} ${y0} Z`.replace(/\s+/g, " ").trim();
}

function updateWarp() {
  const cards = track.querySelectorAll(".cara-card");
  const rect = carousel.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const hw = rect.width / 2 || 1;

  cards.forEach((card) => {
    const r = card.getBoundingClientRect();
    const left = r.left, right = r.right, center = (left + right) / 2;
    const getPinch = (xx) => Math.max(0, (1 - Math.abs((xx - cx) / hw)) * 0.17);
    const lp = getPinch(left);
    const rp = getPinch(right);
    const pathD = roundedTrapezoidPath(lp, rp, 1 - rp, 1 - lp, 0.07);
    const path = card.querySelector("path[id^='p-']");
    if (path) path.setAttribute("d", pathD);
  });
}

function tick(ts) {
  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;

  if (!paused) {
    x -= speedPxPerSec * dt;
    while (Math.abs(x) >= oneSetWidth) {
      x += oneSetWidth;
      track.appendChild(track.firstElementChild);
    }
  }

  track.style.transform = `translateX(${x}px)`;
  updateWarp();
  requestAnimationFrame(tick);
}

function initCarousel() {
  track.innerHTML = "";
  x = 0;
  lastTime = 0;
  ensureEnoughSets();
  updateWarp();
  requestAnimationFrame(tick);
}

window.addEventListener("resize", initCarousel);
window.addEventListener("load", initCarousel);