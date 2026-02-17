document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/80', 'backdrop-blur-md', 'shadow-lg');
            navbar.classList.remove('py-6');
            navbar.classList.add('py-4');
        } else {
            navbar.classList.remove('bg-black/80', 'backdrop-blur-md', 'shadow-lg');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-6');
        }
    });

    // 3. Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 4. Enhanced Canvas Background (Neural Network)
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseSize = this.size;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.density = (Math.random() * 30) + 1;
            }
            update() {
                // Movement
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;

                // Mouse Interaction (Subtle push/pull)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        this.x -= directionX * 0.1;
                        this.y -= directionY * 0.1;
                    }
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function handleParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 * (1 - distance / 120)})`; // Cyan connections
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            requestAnimationFrame(animate);
        }

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();
    }

    // 5. 3D Tilt Effect for Hero Cards (Mouse Move)
    const heroSection = document.getElementById('home');
    const cards = document.querySelectorAll('.floating-card');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate mouse position relative to center (-1 to 1)
            const x = (clientX / innerWidth - 0.5) * 2;
            const y = (clientY / innerHeight - 0.5) * 2;

            cards.forEach((card, index) => {
                const depth = (index + 1) * 10; // Different depth for each card
                const moveX = x * depth;
                const moveY = y * depth;

                // transform with existing float animation? No, simple transform override might conflict.
                // Better: Apply translation wrapper or just simple parallax.
                // Let's us simple parallax on top of float if possible, or just parallax.
                // Since they have CSS animation 'float', setting transform here will OVERWRITE it.
                // To combine, we wrap the card in a div that floats, and tilt the inner card.
                // BUT, for simplicity in this vanilla script, let's just do a subtle rotation.

                // Actually, CSS animation is on the element itself.
                // Let's skip complex JS tilt to avoid conflict with CSS animation for now, 
                // or just apply it to the container if we had one.
                // I'll skip the JS tilt for the floating cards to keep them smooth with CSS only.
            });
        });
    }

    // 6. Sticker Price Calculator
    // 6. Sticker Price Calculator
    const calcWidth = document.getElementById('calc-width');
    const calcHeight = document.getElementById('calc-height');
    const calcQty = document.getElementById('calc-qty');
    const calcResult = document.getElementById('calc-result');
    const calcArea = document.getElementById('calc-area');

    function calculatePrice() {
        if (!calcWidth || !calcHeight || !calcQty || !calcResult) return;

        const width = parseFloat(calcWidth.value) || 0;
        const height = parseFloat(calcHeight.value) || 0;
        const qty = parseInt(calcQty.value) || 1;

        if (width > 0 && height > 0 && qty > 0) {
            // Formula: (Width * Height / 10000) * Quantity * 4000
            const areaM2 = (width * height) / 10000;
            const basePrice = 4000;
            let total = Math.round(areaM2 * qty * basePrice);

            if (calcArea) {
                calcArea.textContent = areaM2.toFixed(2) + ' nm';
            }

            calcResult.textContent = total.toLocaleString('hu-HU');
        } else {
            if (calcArea) {
                calcArea.textContent = '0.00 nm';
            }
            calcResult.textContent = '0';
        }
    }

    if (calcWidth && calcHeight && calcQty) {
        [calcWidth, calcHeight, calcQty].forEach(input => {
            input.addEventListener('input', calculatePrice);
        });
    }
    // 7. Large Format Calculator
    const lfWidth = document.getElementById('lf-width');
    const lfHeight = document.getElementById('lf-height');
    const lfQty = document.getElementById('lf-qty');
    const lfResult = document.getElementById('lf-result');
    const lfArea = document.getElementById('lf-area');
    const lfWarning = document.getElementById('lf-width-warning');

    function calculateLFPrice() {
        if (!lfWidth || !lfHeight || !lfQty || !lfResult) return;

        const width = parseFloat(lfWidth.value) || 0;
        const height = parseFloat(lfHeight.value) || 0;
        const qty = parseInt(lfQty.value) || 1;

        // Warning Check
        if (lfWarning) {
            if (width > 158 || height > 158) {
                // Check if BOTH are larger, or just one. The machine width is limited.
                // Usually means the shortest side must be <= 158. 
                // But the prompt says "Maximális szélesség: 160 cm". 
                // Let's assume strict check on the 'Width' field for now as per prompt implication, 
                // or intelligent check on min(width, height).
                // Simple approach: Check the input labeled "Szélesség" (which is lf-height in my HTML?! Wait.)

                // In HTML I wrote:
                // Hosszúság -> lf-width
                // Szélesség -> lf-height (max 158)

                if (parseFloat(lfHeight.value) > 158) {
                    lfWarning.classList.remove('hidden');
                } else {
                    lfWarning.classList.add('hidden');
                }
            } else {
                lfWarning.classList.add('hidden');
            }
        }

        if (width > 0 && height > 0 && qty > 0) {
            const areaM2 = (width * height) / 10000;
            const basePrice = 4000;
            let total = Math.round(areaM2 * qty * basePrice);

            if (lfArea) {
                lfArea.textContent = areaM2.toFixed(2) + ' nm';
            }

            // Minimum price logic could be added here if needed, but not requested.
            lfResult.textContent = total.toLocaleString('hu-HU');
        } else {
            if (lfArea) lfArea.textContent = '0.00 nm';
            lfResult.textContent = '0';
        }
    }

    if (lfWidth && lfHeight && lfQty) {
        [lfWidth, lfHeight, lfQty].forEach(input => {
            input.addEventListener('input', calculateLFPrice);
        });
    }
    // 8. Blueprint Calculator
    const bpWidth = document.getElementById('bp-width');
    const bpHeight = document.getElementById('bp-height');
    const bpQty = document.getElementById('bp-qty');
    const bpResult = document.getElementById('bp-result');

    function calculateBCPrice() {
        if (!bpWidth || !bpHeight || !bpQty || !bpResult) return;

        const width = parseFloat(bpWidth.value) || 0;
        const height = parseFloat(bpHeight.value) || 0;
        const qty = parseInt(bpQty.value) || 1;

        if (width > 0 && height > 0 && qty > 0) {
            // Formula: Width(m) * Height(m) * 1000 * Qty
            // Note: Inputs are in meters here!
            const basePrice = 1000;
            let total = Math.round(width * height * qty * basePrice);

            bpResult.textContent = total.toLocaleString('hu-HU');
        } else {
            bpResult.textContent = '0';
        }
    }

    if (bpWidth && bpHeight && bpQty) {
        [bpWidth, bpHeight, bpQty].forEach(input => {
            input.addEventListener('input', calculateBCPrice);
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
