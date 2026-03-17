const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
);

document.querySelectorAll("[data-reveal], [data-stagger]").forEach((el) => io.observe(el));