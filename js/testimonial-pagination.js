document.addEventListener("DOMContentLoaded", () => {
            const marquees = document.querySelectorAll('.marquee-container');

            marquees.forEach(marquee => {
                const track = marquee.querySelector('.marquee-track');
                const trackContent = marquee.querySelector('.track-content');
                
                const direction = marquee.classList.contains('rtl') ? -1 : 1;
                const speed = 1.2;

                let position = 0;
                let isHovered = false;
                let contentWidth = 0;

                const setupClones = () => {
                    track.querySelectorAll('.is-clone').forEach(c => c.remove());

                    contentWidth = trackContent.getBoundingClientRect().width;
                    
                    const requiredWidth = window.innerWidth * 2 + contentWidth;
                    let currentWidth = contentWidth;

                    while (currentWidth < requiredWidth) {
                        const clone = trackContent.cloneNode(true);
                        clone.classList.add('is-clone');
                        clone.setAttribute('aria-hidden', 'true');
                        track.appendChild(clone);
                        currentWidth += contentWidth;
                    }

                    if (direction === 1 && position === 0) {
                        position = -contentWidth;
                    }
                };

                setupClones();
                window.addEventListener('resize', setupClones);

                marquee.addEventListener('mouseenter', () => isHovered = true);
                marquee.addEventListener('mouseleave', () => isHovered = false);

                const animate = () => {
                    if (!isHovered) {
                        position += speed * direction;

                        if (direction === -1) { 
                            if (Math.abs(position) >= contentWidth) {
                                position += contentWidth;
                            }
                        } else {
                            if (position >= 0) {
                                position -= contentWidth;
                            }
                        }

                        track.style.transform = `translate3d(${position}px, 0, 0)`;
                    }
                    requestAnimationFrame(animate);
                };

                requestAnimationFrame(animate);
            });
        });





    document.addEventListener("DOMContentLoaded", () => {
      const serviceRows = document.querySelectorAll('.service-row');

      const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the row is visible
      };

      const rowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      }, observerOptions);

      // Attach the observer to each row
      serviceRows.forEach(row => {
        rowObserver.observe(row);
      });
    });