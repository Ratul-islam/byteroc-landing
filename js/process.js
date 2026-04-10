document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HEADLINE SCROLL SCRUBBING (Multiple Elements) ---
    const headlines = document.querySelectorAll('.headline');

    function wrapChars(node) {
        let html = '';
        const childNodes = Array.from(node.childNodes);

        childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const chars = child.textContent.split('');
                chars.forEach(char => {
                    if (char.trim() === '') {
                        html += char; 
                    } else {
                        html += `<span class="scroll-char">${char}</span>`;
                    }
                });
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'BR') {
                    html += '<br/>';
                } else {
                    const clone = child.cloneNode(false);
                    clone.innerHTML = wrapChars(child);
                    html += clone.outerHTML;
                }
            }
        });
        return html;
    }

    // Store data for all headlines to keep the scroll listener highly performant
    const headlineData = [];

    headlines.forEach(headline => {
        // Wrap characters for each headline
        headline.innerHTML = wrapChars(headline);
        
        // Find and store the characters for this specific headline
        const scrollChars = headline.querySelectorAll('.scroll-char');
        headlineData.push({
            element: headline,
            chars: scrollChars,
            totalChars: scrollChars.length
        });
    });

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const startPos = windowHeight;
        const endPos = windowHeight / 9;
        
        // Loop through each headline and animate based on its own position
        headlineData.forEach(data => {
            const rect = data.element.getBoundingClientRect();
            const currentPos = rect.top;

            let overallProgress = 0;
            if (currentPos > startPos) {
                overallProgress = 0; 
            } else if (currentPos < endPos) {
                overallProgress = 1; 
            } else {
                overallProgress = 1 - ((currentPos - endPos) / (startPos - endPos));
            }

            data.chars.forEach((char, index) => {
                const charStartProgress = (index / data.totalChars) * .8; 
                const charEndProgress = charStartProgress + 0.20; 

                let localProgress = (overallProgress - charStartProgress) / (charEndProgress - charStartProgress);
                localProgress = Math.max(0, Math.min(1, localProgress));

                const easeOut = 1 - Math.pow(1 - localProgress, 3);

                char.style.opacity = localProgress;
                char.style.transform = `translateX(${(1 - easeOut) * 40}px) rotateZ(${(1 - easeOut) * 15}deg)`;
            });
        });
    });


    // --- 2. STEPS "STACK & SPLIT" SEQUENCE (Multiple Elements) ---
    const stepsContainers = document.querySelectorAll('.steps');
    
    // Set up an Intersection Observer
    const stepsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the split class to the specific container that entered the view
                entry.target.classList.add('is-splitting');
                // Stop observing this specific container so it doesn't replay
                stepsObserver.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.3 
    });

    // Observe every .steps container found on the page
    stepsContainers.forEach(container => {
        stepsObserver.observe(container);
    });

    // Initial check on load
    window.dispatchEvent(new Event('scroll'));
});