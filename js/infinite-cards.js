(function () {
  const section = document.querySelector(".scrolling-section");
  const track = document.getElementById("scrolling-track");
  if (!section || !track) return;

  let x = 0;
  let last = 0;
  let paused = false;
  let setWidth = 0;
  const speed = 40;

  section.addEventListener("mouseenter", () => (paused = true));
  section.addEventListener("mouseleave", () => (paused = false));

  function build() {
    const original = Array.from(track.children).map((n) => n.cloneNode(true));
    track.innerHTML = "";

    const firstSet = document.createElement("div");
    firstSet.className = "set";
    original.forEach((n) => firstSet.appendChild(n));

    const secondSet = firstSet.cloneNode(true);

    track.appendChild(firstSet);
    track.appendChild(secondSet);

    setWidth = firstSet.getBoundingClientRect().width;
    x = 0;
    track.style.transform = `translate3d(${x}px,0,0)`;
  }

  function tick(ts) {
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;

    if (!paused && setWidth > 0) {
      x -= speed * dt;

      if (Math.abs(x) >= setWidth) {
        x += setWidth;
      }

      track.style.transform = `translate3d(${x}px,0,0)`;
    }

    requestAnimationFrame(tick);
  }

  function init() {
    build();
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", init);
  requestAnimationFrame(tick);
})();