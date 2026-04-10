 document.addEventListener("DOMContentLoaded", () => {
        const svgElement = document.querySelector('.thanks svg');
        const paths = svgElement.querySelectorAll('path');
        const container = document.querySelector('.thanks');

        paths.forEach(path => {
          const length = path.getTotalLength();
          
          const fill = path.getAttribute('fill');
          if(fill && fill !== "none") {
              path.style.stroke = fill;
          }
          
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length;
        });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
            } else {
              entry.target.classList.remove('animate');
              paths.forEach(path => {
                 path.style.strokeDashoffset = path.getTotalLength();
              });
            }
          });
        }, { 
            threshold: 0.3 
        });

        observer.observe(container);
      });