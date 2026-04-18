 const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll(".price-card");
                    cards.forEach((card) => card.classList.add("reveal"));
                    containerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const pricingContainer = document.getElementById("pricing-cards-container");
        if (pricingContainer) containerObserver.observe(pricingContainer);
