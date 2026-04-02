
      (function () {
        const section = document.querySelector(".scrolling-section");
        const track = document.getElementById("scrolling-track");
        if (!section || !track) return;

        let x = 0;
        let lastTime = 0;
        let paused = false;
        let isDragging = false;
        let startX = 0;
        let setWidth = 0;
        const speed = 40; // Pixels per second for auto-scroll
        const gap = 20; // Matches your CSS gap

        // --- 1. BUILD THE INFINITE LOOP STRUCTURE ---
        function build() {
          const originalChildren = Array.from(track.children);
          track.innerHTML = "";

          // Group all original cards into Set 1
          const firstSet = document.createElement("div");
          firstSet.className = "track-set";
          originalChildren.forEach((n) => firstSet.appendChild(n));

          // Clone Set 1 into Set 2
          const secondSet = firstSet.cloneNode(true);

          track.appendChild(firstSet);
          track.appendChild(secondSet);

          // Calculate exactly how wide one set is (including the gap between sets)
          setWidth = firstSet.getBoundingClientRect().width + gap;
        }

        // --- 2. RENDER LOOP (Handles Auto-Scroll & Wrapping) ---
        function tick(ts) {
          if (!lastTime) lastTime = ts;
          const dt = (ts - lastTime) / 1000;
          lastTime = ts;

          // Only auto-scroll if we aren't hovering or dragging
          if (!paused && !isDragging && setWidth > 0) {
            x -= speed * dt;
          }

          // The infinite wrap logic (works in both directions!)
          if (setWidth > 0) {
            if (x <= -setWidth) {
              x += setWidth; // Wrapped left
            } else if (x > 0) {
              x -= setWidth; // Wrapped right (when dragging backward)
            }
            track.style.transform = `translate3d(${x}px, 0, 0)`;
          }

          requestAnimationFrame(tick);
        }

        // --- 3. DRAG TO SCROLL LOGIC ---
        const handleDragStart = (e) => {
          isDragging = true;
          track.classList.add('is-dragging');
          startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        };

        const handleDragMove = (e) => {
          if (!isDragging) return;
          e.preventDefault(); // Prevents text highlighting
          const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
          const deltaX = currentX - startX;
          x += deltaX;
          startX = currentX;
        };

        const handleDragEnd = () => {
          isDragging = false;
          track.classList.remove('is-dragging');
        };

        // Mouse Events
        track.addEventListener("mousedown", handleDragStart);
        window.addEventListener("mousemove", handleDragMove);
        window.addEventListener("mouseup", handleDragEnd);

        // Touch Events (Mobile)
        track.addEventListener("touchstart", handleDragStart, { passive: false });
        window.addEventListener("touchmove", handleDragMove, { passive: false });
        window.addEventListener("touchend", handleDragEnd);

        // --- 4. MOUSE WHEEL SCROLL LOGIC ---
        section.addEventListener("wheel", (e) => {
          e.preventDefault();
          // Multiply by a factor to control wheel sensitivity
          x -= e.deltaY * 0.8; 
          x -= e.deltaX * 0.8; 
        }, { passive: false });

        // --- 5. HOVER TO PAUSE LOGIC ---
        section.addEventListener("mouseenter", () => (paused = true));
        section.addEventListener("mouseleave", () => {
          paused = false;
          isDragging = false; // Cancel drag if cursor leaves section
          track.classList.remove('is-dragging');
        });

        // Initialize and recalculate on resize
        function init() {
          if (track.children.length > 2) {
             build(); // Only build if it hasn't been built yet
          } else {
             // Recalculate width on window resize
             setWidth = track.children[0].getBoundingClientRect().width + gap;
          }
        }

        window.addEventListener("load", init);
        window.addEventListener("resize", init);
        
        // Start the engine
        build();
        requestAnimationFrame(tick);
      })();