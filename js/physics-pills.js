  const { Engine, Runner, Bodies, Composite, Events, Body, Common, Constraint, Sleeping } = Matter;

        const viewport = document.getElementById("physics-viewport");
        const pricingSection = document.getElementById("pricing-section");
        
        if (viewport && pricingSection) {
            const engine = Engine.create({
                gravity: { x: 0, y: 0.82, scale: 0.0015 }
            });

            engine.constraintIterations = 3;
            engine.positionIterations = 8;
            engine.velocityIterations = 6;
            engine.enableSleeping = true;

            const runner = Runner.create({ isFixed: true, delta: 1000 / 60 });

            const items = [
                { t: "Welcome Series", c: "p-dark" },
                { t: "Abandoned Cart", c: "p-medium" },
                { t: "Design to Develop", c: "p-light" },
                { t: "Product Launch", c: "p-light" },
                { t: "Re-engagement", c: "p-white" },
                { t: "Transactional", c: "p-dark" },
                { t: "Cold Outreach", c: "p-medium" },
                { t: "Newsletter", c: "p-white" }
            ];

            const physicsItems = [];
            let floor, leftWall, rightWall;
            let pillsDropped = false;

            const rand = (min, max) => Common.random(min, max);

            function createBounds() {
                const width = viewport.clientWidth;
                const height = viewport.clientHeight;
                const wallThickness = 60;
                const floorThickness = 60;

                // Stop pills from falling off the bottom
                floor = Bodies.rectangle(width / 2, height + floorThickness / 2 - 6, width + wallThickness * 2, floorThickness, {
                    isStatic: true,
                    friction: 0.8,
                    restitution: 0.05
                });

                leftWall = Bodies.rectangle(-wallThickness / 2 + 4, height / 2, wallThickness, height * 2, { isStatic: true });
                rightWall = Bodies.rectangle(width + wallThickness / 2 - 4, height / 2, wallThickness, height * 2, { isStatic: true });

                Composite.add(engine.world, [floor, leftWall, rightWall]);
            }

            function clearBounds() {
                if (floor) Composite.remove(engine.world, floor);
                if (leftWall) Composite.remove(engine.world, leftWall);
                if (rightWall) Composite.remove(engine.world, rightWall);
            }

            function createPills() {
                const width = viewport.clientWidth;

                items.forEach((data, i) => {
                    const el = document.createElement("div");
                    el.className = `pill ${data.c}`;
                    el.textContent = data.t;
                    viewport.appendChild(el);

                    const rect = el.getBoundingClientRect();
                    // Spawn near the top center
                    const x = width * 0.5 + rand(-width * 0.22, width * 0.22);
                    const y = -80 - i * rand(90, 130);

                    const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                        chamfer: { radius: rect.height * 0.48 },
                        restitution: rand(0.12, 0.22),
                        friction: rand(0.35, 0.6),
                        frictionAir: rand(0.018, 0.03),
                        frictionStatic: 0.7,
                        density: rand(0.0009, 0.0013),
                        sleepThreshold: 45
                    });

                    Body.setAngle(body, rand(-0.08, 0.08));
                    Body.setAngularVelocity(body, rand(-0.01, 0.01));
                    Body.setVelocity(body, { x: rand(-0.25, 0.25), y: rand(0, 0.15) });

                    physicsItems.push({ body, el });
                    Composite.add(engine.world, body);
                });
            }

            function syncDom() {
                for (const { body, el } of physicsItems) {
                    el.style.opacity = "1";
                    el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
                    el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
                    el.style.transform = `translateZ(0) rotate(${body.angle}rad)`;
                }
            }

            Events.on(engine, "beforeUpdate", () => {
                for (const { body } of physicsItems) {
                    if (body.isSleeping) continue;
                    Body.applyForce(body, body.position, { x: rand(-0.0000015, 0.0000015), y: 0 });
                }
            });

            Events.on(engine, "afterUpdate", syncDom);

            function handleResize() {
                const bodies = physicsItems.map((p) => p.body);
                clearBounds();
                createBounds();

                const width = viewport.clientWidth;
                const height = viewport.clientHeight;

                for (const b of bodies) {
                    const px = Math.min(Math.max(b.position.x, 40), width - 40);
                    const py = Math.min(Math.max(b.position.y, -200), height - 40);
                    Body.setPosition(b, { x: px, y: py });
                }
            }

            // Drag and Drop Logic
            let dragConstraint = null;

            window.addEventListener('mousedown', (e) => {
                const pillEl = e.target.closest('.pill');
                if (pillEl) {
                    const idx = physicsItems.findIndex(p => p.el === pillEl);
                    if (idx > -1) {
                        const body = physicsItems[idx].body;
                        Sleeping.set(body, false);

                        const rect = viewport.getBoundingClientRect();
                        const mouseX = e.clientX - rect.left;
                        const mouseY = e.clientY - rect.top;

                        dragConstraint = Constraint.create({
                            pointA: { x: mouseX, y: mouseY },
                            bodyB: body,
                            stiffness: 0.1,
                            damping: 0.1,
                            length: 0
                        });

                        Composite.add(engine.world, dragConstraint);
                    }
                }
            });

            window.addEventListener('mousemove', (e) => {
                if (dragConstraint) {
                    const rect = viewport.getBoundingClientRect();
                    dragConstraint.pointA = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                }
            });

            window.addEventListener('mouseup', () => {
                if (dragConstraint) {
                    Composite.remove(engine.world, dragConstraint);
                    dragConstraint = null;
                }
            });

            // Scroll Trigger Logic for Pills
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !pillsDropped) {
                        pillsDropped = true;
                        createPills();
                    }
                });
            }, { threshold: 0.2 });

            function initPhysics() {
                createBounds();
                Runner.run(runner, engine);
                scrollObserver.observe(pricingSection);
                window.addEventListener("resize", handleResize, { passive: true });
            }

            initPhysics();
        }