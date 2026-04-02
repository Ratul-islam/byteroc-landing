
    document.addEventListener("DOMContentLoaded", () => {
      const container = document.querySelector(".three-ball");

      if (!container) return;

      const circles = container.querySelectorAll(".moto-circle");

      if (circles.length < 3) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return;
      }

      const observerOptions = {
        rootMargin: "0px 0px -20% 0px",

        threshold: 0.2
      };

      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          // Ignore if not intersecting
          if (!entry.isIntersecting) return;

          // 4. Clean class application using our reliable querySelectorAll array
          circles[0].classList.add("first-class");
          circles[1].classList.add("second-class");
          circles[2].classList.add("last-class");

          setTimeout(() => {
            container.classList.add("is-active");
          }, 150);

          // 5. Cleanup: Stop observing immediately to save browser memory
          observer.disconnect();
        });
      }, observerOptions);

      // Start observing
      io.observe(container);
    });

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

const comps = document.querySelectorAll('.comp');

comps.forEach((comp) => {
  const style = window.getComputedStyle(comp);
  
  if (!style.backgroundImage || style.backgroundImage === 'none') return;
  
  const bgImgUrl = style.backgroundImage.split(',')[0].slice(4, -1).replace(/["']/g, "");

  const img = new Image();
  img.src = bgImgUrl;

  let imageRenderedWidth = 0;
  let testX = 0;
  let copiesNeeded = 2;
  const speed = 1.5; 
  const gapAdjustment = -420;

  img.onload = () => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    const calculateWidth = () => {
      const currentHeight = comp.clientHeight;
      
      imageRenderedWidth = (currentHeight * aspectRatio) + gapAdjustment;
      
      if (imageRenderedWidth <= 0) return; 
      
      copiesNeeded = Math.ceil(window.innerWidth / imageRenderedWidth) + 1;
      
      const bgImages = [];
      const bgSizes = [];
      for (let i = 0; i < copiesNeeded; i++) {
        bgImages.push(`url('${bgImgUrl}')`);
        bgSizes.push('auto 100%');
      }
      
      comp.style.backgroundImage = bgImages.join(', ');
      comp.style.backgroundRepeat = 'no-repeat';
      comp.style.backgroundSize = bgSizes.join(', ');
    };

    calculateWidth();
    
    window.addEventListener('resize', calculateWidth);

    const animate = () => {
      testX -= speed;

      if (testX <= -imageRenderedWidth) {
        testX += imageRenderedWidth; 
      }

      const positions = [];
      for (let i = 0; i < copiesNeeded; i++) {
        positions.push(`${testX + (i * imageRenderedWidth)}px center`);
      }
      comp.style.backgroundPosition = positions.join(', ');

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };
});