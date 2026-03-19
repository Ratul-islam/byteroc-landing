
    (() => {
      const container = document.getElementById("motoContainer");
      if (!container) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const io = new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting) return;

        container.classList.add("is-revealed");

        setTimeout(() => {
          container.classList.add("is-active");
        }, 150);

        observer.unobserve(entry.target);
        observer.disconnect();
      }, {
        threshold: 0.5
      });

      io.observe(container);
    })();

    (() => {
      const section = document.getElementById("statsSection");
      if (!section) return;

      const numbers = section.querySelectorAll(".stat-num");
      let hasAnimated = false;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function formatValue(value, suffix, originalTo) {
        if (suffix === "+" && originalTo < 10) {
          return String(value).padStart(2, "0") + suffix;
        }
        return value + suffix;
      }

      function animateCount(el, to, suffix, duration = 1700, delay = 0) {
        const start = 0;
        const startTime = performance.now() + delay;

        function frame(now) {
          if (now < startTime) {
            requestAnimationFrame(frame);
            return;
          }

          const progress = Math.min((now - startTime) / duration, 1);
          const eased = easeOutCubic(progress);
          const current = Math.round(start + (to - start) * eased);

          el.textContent = formatValue(current, suffix, to);

          if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      }

      function runAnimation() {
        if (hasAnimated) return;
        hasAnimated = true;

        section.classList.add("is-visible");

        numbers.forEach((el, i) => {
          const to = Number(el.dataset.countTo || 0);
          const suffix = el.dataset.suffix || "";
          animateCount(el, to, suffix, 1700, i * 120);
        });
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        section.classList.add("is-visible");
        numbers.forEach((el) => {
          const to = Number(el.dataset.countTo || 0);
          const suffix = el.dataset.suffix || "";
          el.textContent = formatValue(to, suffix, to);
        });
        return;
      }

      if (!("IntersectionObserver" in window)) {
        runAnimation();
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimation();
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.35
      });

      observer.observe(section);
    })();

     document.addEventListener("DOMContentLoaded", () => {
      const section = document.getElementById("glowSection");
      const wrapper = document.getElementById("pillWrapper");

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            wrapper.classList.add("is-active");
            
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5
      });

      if (section) {
        observer.observe(section);
      }
    });