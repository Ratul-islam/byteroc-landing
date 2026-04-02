
        const modal = document.getElementById('project-modal');
        const modalStack = document.getElementById('modal-stack');
        const modalCenterImage = document.getElementById('modal-center-image');
        
        // Stack Elements
        const modalStack1 = document.getElementById('modal-stack-1');
        const modalStack2 = document.getElementById('modal-stack-2');
        const modalStack3 = document.getElementById('modal-stack-3');
        const modalStack4 = document.getElementById('modal-stack-4');

        const uiCategory = document.getElementById('modal-category');
        const uiTitle = document.getElementById('modal-title');

        let activeOriginalImage = null;
        let isAnimating = false; 

        function getRotationDegrees(el) {
            const style = window.getComputedStyle(el);
            const transform = style.transform || style.webkitTransform || style.mozTransform;
            if (transform === 'none') return 0;
            const values = transform.split('(')[1].split(')')[0].split(',');
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            return Math.round(Math.atan2(b, a) * (180/Math.PI));
        }

        function openModal(imgElement) {
            if (isAnimating) return; 
            isAnimating = true;

            activeOriginalImage = imgElement;
            
            modalCenterImage.src = imgElement.src;

            modalStack1.src = imgElement.getAttribute('data-stack1') || '';
            modalStack2.src = imgElement.getAttribute('data-stack2') || '';
            modalStack3.src = imgElement.getAttribute('data-stack3') || '';
            modalStack4.src = imgElement.getAttribute('data-stack4') || '';
            
            // Inject minimalist text data
            uiCategory.textContent = imgElement.getAttribute('data-category') || 'Selected Work';
            uiTitle.textContent = imgElement.getAttribute('data-title') || 'Case Study';

            const rect = imgElement.getBoundingClientRect();
            const originalWidth = imgElement.offsetWidth;
            const originalHeight = imgElement.offsetHeight;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const originalRotation = getRotationDegrees(imgElement);
            
            let targetWidth = window.innerWidth * 0.23; 
            if (targetWidth < 140) targetWidth = 140;
            if (targetWidth > 280) targetWidth = 280;
            let targetHeight = targetWidth * (4/3); 
            
            let targetX = window.innerWidth / 2;
            let targetY = window.innerHeight / 2;

            modalStack.style.transition = 'none';
            modalStack.style.setProperty('--w', `${originalWidth}px`);
            modalStack.style.setProperty('--h', `${originalHeight}px`);
            modalStack.style.setProperty('--x', `${centerX}px`);
            modalStack.style.setProperty('--y', `${centerY}px`);
            modalStack.style.setProperty('--rot', `${originalRotation}deg`);
            modalStack.style.opacity = '1'; 
            
            void modalStack.offsetWidth; 
            imgElement.style.opacity = '0';
            
            modalStack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            modalStack.style.setProperty('--w', `${targetWidth}px`);
            modalStack.style.setProperty('--h', `${targetHeight}px`);
            modalStack.style.setProperty('--x', `${targetX}px`);
            modalStack.style.setProperty('--y', `${targetY}px`);
            modalStack.style.setProperty('--rot', `0deg`);
            
            modal.classList.add('active'); 
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                modal.classList.add('expanded');
                isAnimating = false; 
            }, 400); 
        }

        function closeModal() {
            if (isAnimating) return;
            isAnimating = true;

            modal.classList.remove('expanded');
            
            const rect = activeOriginalImage.getBoundingClientRect();
            const originalWidth = activeOriginalImage.offsetWidth;
            const originalHeight = activeOriginalImage.offsetHeight;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const originalRotation = getRotationDegrees(activeOriginalImage);
            
            modalStack.style.setProperty('--w', `${originalWidth}px`);
            modalStack.style.setProperty('--h', `${originalHeight}px`);
            modalStack.style.setProperty('--x', `${centerX}px`);
            modalStack.style.setProperty('--y', `${centerY}px`);
            modalStack.style.setProperty('--rot', `${originalRotation}deg`);
            
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                modalStack.style.opacity = '0';
                if (activeOriginalImage) {
                    activeOriginalImage.style.opacity = '1';
                }
                isAnimating = false; 
            }, 600);
        }

        document.querySelectorAll('.samples-section img').forEach(img => {
            img.addEventListener('click', () => {
                openModal(img);
            });
        });




        window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });
});