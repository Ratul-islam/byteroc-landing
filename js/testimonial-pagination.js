const grid = document.getElementById("card-grid");
const dots = document.querySelectorAll(".pagination-nav .dot");

const updateActiveDot = (activeIndex) => {
  dots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
};

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    const scrollStep = grid.scrollWidth / dots.length;
    grid.scrollTo({ left: scrollStep * index, behavior: "smooth" });
    updateActiveDot(index);
  });
});

grid.addEventListener("scroll", () => {
  const step = grid.scrollWidth / dots.length;
  const index = Math.round(grid.scrollLeft / step);
  updateActiveDot(index);
});