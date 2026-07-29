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

    function getMultiplier(sqm) {
        if (sqm <= 3) return 1.0;
        const points = [
            { x: 3, y: 1.0 },
            { x: 5, y: 1.126337534 },
            { x: 10, y: 1.231838922 },
            { x: 20, y: 1.315605709 },
            { x: 50, y: 1.406372449 },
            { x: 100, y: 1.46491161 },
            { x: 200, y: 1.517170858 }
        ];
        let p1, p2;
        for (let i = 0; i < points.length - 1; i++) {
            if (sqm <= points[i + 1].x) {
                p1 = points[i];
                p2 = points[i + 1];
                break;
            }
        }
        if (!p1) {
            p1 = points[points.length - 2];
            p2 = points[points.length - 1];
        }
        const logX = Math.log(sqm);
        const logX1 = Math.log(p1.x);
        const logX2 = Math.log(p2.x);
        const t = (logX - logX1) / (logX2 - logX1);
        return p1.y + t * (p2.y - p1.y);
    }

    // 6. Sticker Price Calculator
    const calcWidth = document.getElementById('calc-width');
    const calcHeight = document.getElementById('calc-height');
    const calcQty = document.getElementById('calc-qty');
    const calcResult = document.getElementById('calc-result');
    const calcArea = document.getElementById('calc-area');
    const calcUnit = document.getElementById('calc-unit');

    function calculatePrice() {
        if (!calcWidth || !calcHeight || !calcQty || !calcResult) return;

        const width = parseFloat(calcWidth.value) || 0;
        const height = parseFloat(calcHeight.value) || 0;
        const qty = parseInt(calcQty.value) || 1;

        if (width > 0 && height > 0 && qty > 0) {
            const areaM2 = (width * height) / 10000;
            const totalSqm = areaM2 * qty;
            const basePrice = 5000;
            const multiplier = getMultiplier(totalSqm);
            const unitPrice = basePrice / multiplier;
            let total = Math.round(totalSqm * unitPrice);

            if (calcArea) {
                calcArea.textContent = totalSqm.toFixed(2) + ' nm';
            }
            if (calcUnit) {
                calcUnit.textContent = Math.round(unitPrice).toLocaleString('hu-HU') + ' Ft/nm';
            }

            calcResult.textContent = total.toLocaleString('hu-HU');
        } else {
            if (calcArea) {
                calcArea.textContent = '0.00 nm';
            }
            if (calcUnit) {
                calcUnit.textContent = '5000 Ft/nm';
            }
            calcResult.textContent = '0';
        }
    }

    if (calcWidth && calcHeight && calcQty) {
        [calcWidth, calcHeight, calcQty].forEach(input => {
            input.addEventListener('input', calculatePrice);
        });
    }

    // 6b. Molino Price Calculator (same pricing as vinyl, base 5000 Ft/nm)
    const mlWidth = document.getElementById('ml-width');
    const mlHeight = document.getElementById('ml-height');
    const mlQty = document.getElementById('ml-qty');
    const mlResult = document.getElementById('ml-result');
    const mlArea = document.getElementById('ml-area');
    const mlUnit = document.getElementById('ml-unit');
    const mlWarning = document.getElementById('ml-width-warning');

    function calculateMolinoPrice() {
        if (!mlWidth || !mlHeight || !mlQty || !mlResult) return;

        const width = parseFloat(mlWidth.value) || 0;
        const height = parseFloat(mlHeight.value) || 0;
        const qty = parseInt(mlQty.value) || 1;

        if (mlWarning) {
            mlWarning.classList.toggle('hidden', height <= 130);
        }

        if (width > 0 && height > 0 && qty > 0) {
            const areaM2 = (width * height) / 10000;
            const totalSqm = areaM2 * qty;
            const basePrice = 5000;
            const multiplier = getMultiplier(totalSqm);
            const unitPrice = basePrice / multiplier;
            let total = Math.round(totalSqm * unitPrice);

            if (mlArea) {
                mlArea.textContent = totalSqm.toFixed(2) + ' nm';
            }
            if (mlUnit) {
                mlUnit.textContent = Math.round(unitPrice).toLocaleString('hu-HU') + ' Ft/nm';
            }

            mlResult.textContent = total.toLocaleString('hu-HU');
        } else {
            if (mlArea) {
                mlArea.textContent = '0.00 nm';
            }
            if (mlUnit) {
                mlUnit.textContent = '5000 Ft/nm';
            }
            mlResult.textContent = '0';
        }
    }

    if (mlWidth && mlHeight && mlQty) {
        [mlWidth, mlHeight, mlQty].forEach(input => {
            input.addEventListener('input', calculateMolinoPrice);
        });
    }
    // 7. Poster (Plakat) Calculator - same pricing curve, base 4000 Ft/nm
    const lfWidth = document.getElementById('lf-width');
    const lfHeight = document.getElementById('lf-height');
    const lfQty = document.getElementById('lf-qty');
    const lfResult = document.getElementById('lf-result');
    const lfArea = document.getElementById('lf-area');
    const lfUnit = document.getElementById('lf-unit');
    const lfWarning = document.getElementById('lf-width-warning');

    function calculateLFPrice() {
        if (!lfWidth || !lfHeight || !lfQty || !lfResult) return;

        const width = parseFloat(lfWidth.value) || 0;
        const height = parseFloat(lfHeight.value) || 0;
        const qty = parseInt(lfQty.value) || 1;

        // The "Szelesseg" input (lf-height) is limited by the printer width
        if (lfWarning) {
            lfWarning.classList.toggle('hidden', height <= 134);
        }

        if (width > 0 && height > 0 && qty > 0) {
            const areaM2 = (width * height) / 10000;
            const totalSqm = areaM2 * qty;
            const basePrice = 4000;
            const multiplier = getMultiplier(totalSqm);
            const unitPrice = basePrice / multiplier;
            let total = Math.round(totalSqm * unitPrice);

            if (lfArea) {
                lfArea.textContent = totalSqm.toFixed(2) + ' nm';
            }
            if (lfUnit) {
                lfUnit.textContent = Math.round(unitPrice).toLocaleString('hu-HU') + ' Ft/nm';
            }

            lfResult.textContent = total.toLocaleString('hu-HU');
        } else {
            if (lfArea) lfArea.textContent = '0.00 nm';
            if (lfUnit) {
                lfUnit.textContent = '4000 Ft/nm';
            }
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

    // 9. Weatherproof Blueprint Calculator - base 4000 Ft/nm
    const bpwWidth = document.getElementById('bp-w-width');
    const bpwHeight = document.getElementById('bp-w-height');
    const bpwQty = document.getElementById('bp-w-qty');
    const bpwResult = document.getElementById('bp-w-result');
    const bpwUnit = document.getElementById('bp-w-unit');

    function calculateBCWeatherPrice() {
        if (!bpwWidth || !bpwHeight || !bpwQty || !bpwResult) return;

        const width = parseFloat(bpwWidth.value) || 0;
        const height = parseFloat(bpwHeight.value) || 0;
        const qty = parseInt(bpwQty.value) || 1;

        if (width > 0 && height > 0 && qty > 0) {
            // Formula in meters: Width * Height = sqm
            const totalSqm = width * height * qty;
            const basePrice = 4000;
            const multiplier = getMultiplier(totalSqm);
            const unitPrice = basePrice / multiplier;
            let total = Math.round(totalSqm * unitPrice);

            if (bpwUnit) {
                bpwUnit.textContent = Math.round(unitPrice).toLocaleString('hu-HU') + ' Ft/nm';
            }

            bpwResult.textContent = total.toLocaleString('hu-HU');
        } else {
            if (bpwUnit) {
                bpwUnit.textContent = '4000 Ft/nm';
            }
            bpwResult.textContent = '0';
        }
    }

    if (bpwWidth && bpwHeight && bpwQty) {
        [bpwWidth, bpwHeight, bpwQty].forEach(input => {
            input.addEventListener('input', calculateBCWeatherPrice);
        });
    }

    // 10. Blueprint Tabs Logic
    const tabPaperBtn = document.getElementById('bp-tab-paper');
    const tabWeatherBtn = document.getElementById('bp-tab-weather');
    const contentPaper = document.getElementById('bp-content-paper');
    const contentWeather = document.getElementById('bp-content-weather');

    if (tabPaperBtn && tabWeatherBtn) {
        tabPaperBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Button styles
            tabPaperBtn.className = "bp-tab-btn active py-3 px-4 rounded-md font-bold text-sm sm:text-base transition-all bg-cyan-500 text-white shadow-lg";
            tabWeatherBtn.className = "bp-tab-btn py-3 px-4 rounded-md font-bold text-sm sm:text-base transition-all text-gray-400 hover:text-white hover:bg-white/10";

            // Content visibility
            contentPaper.classList.remove('hidden');
            contentPaper.classList.add('flex');
            contentWeather.classList.add('hidden');
            contentWeather.classList.remove('flex');
        });

        tabWeatherBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Button styles
            tabWeatherBtn.className = "bp-tab-btn active py-3 px-4 rounded-md font-bold text-sm sm:text-base transition-all bg-purple-500 text-white shadow-lg";
            tabPaperBtn.className = "bp-tab-btn py-3 px-4 rounded-md font-bold text-sm sm:text-base transition-all text-gray-400 hover:text-white hover:bg-white/10";

            // Content visibility
            contentWeather.classList.remove('hidden');
            contentWeather.classList.add('flex');
            contentPaper.classList.add('hidden');
            contentPaper.classList.remove('flex');
        });
    }

    // 11. Kapcsolati űrlap – üzenetküldés e-mailben (Web3Forms)
    const contactForm = document.getElementById('contact-mail-form');
    const contactStatus = document.getElementById('cf-status');
    function setContactStatus(msg, type) {
        if (!contactStatus) return;
        contactStatus.textContent = msg;
        contactStatus.classList.remove('hidden');
        contactStatus.style.color = (type === 'success') ? 'var(--cyan)' : 'var(--magenta)';
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

            const formData = new FormData(contactForm);

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Küldés folyamatban…';
            }
            setContactStatus('Küldés folyamatban…', 'success');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    setContactStatus('Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.', 'success');
                    contactForm.reset();
                } else {
                    setContactStatus((data && data.message) ? data.message : 'Hiba történt a küldés során. Kérjük, próbálja újra, vagy írjon közvetlenül e-mailt.', 'error');
                }
            } catch (err) {
                setContactStatus('Nem sikerült elküldeni az üzenetet. Ellenőrizze az internetkapcsolatot, és próbálja újra.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                }
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    // 12. Kosár / megrendelés rendszer
    const CALC_CONFIG = {
        'sticker-calculator': { title: 'Matrica rendelés', dimsLabel: 'Szélesség × Magasság', unit: 'cm', width: 'calc-width', height: 'calc-height', qty: 'calc-qty', area: 'calc-area', price: 'calc-result', qtyLabel: 'Kívánt darabszám', showArea: true },
        'molino-calculator': { title: 'Molinó rendelés', dimsLabel: 'Hosszúság × Szélesség', unit: 'cm', width: 'ml-width', height: 'ml-height', qty: 'ml-qty', area: 'ml-area', price: 'ml-result', qtyLabel: 'Kívánt darabszám', showArea: true },
        'lf-calculator': { title: 'Plakát rendelés', dimsLabel: 'Hosszúság × Szélesség', unit: 'cm', width: 'lf-width', height: 'lf-height', qty: 'lf-qty', area: 'lf-area', price: 'lf-result', qtyLabel: 'Kívánt darabszám', showArea: true },
        'bp-calculator': { title: 'Tervrajz (papír) rendelés', dimsLabel: 'Szélesség × Hossz', unit: 'm', width: 'bp-width', height: 'bp-height', qty: 'bp-qty', area: null, price: 'bp-result', qtyLabel: 'Példányszám', showArea: false },
        'bp-weather-calculator': { title: 'Tervrajz (időjárásálló) rendelés', dimsLabel: 'Szélesség × Hossz', unit: 'm', width: 'bp-w-width', height: 'bp-w-height', qty: 'bp-w-qty', area: null, price: 'bp-w-result', qtyLabel: 'Példányszám', showArea: false }
    };

    const cart = [];
    let cartSeq = 0;
    let msgAutoFill = true;

    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartFab = document.getElementById('cart-fab');
    const cartFabCount = document.getElementById('cart-fab-count');
    const cartNavCount = document.getElementById('cart-nav-count');
    const checkoutSummaryEl = document.getElementById('checkout-summary');
    const checkoutTotalEl = document.getElementById('checkout-total');
    const msgField = document.getElementById('cf-msg');

    function fmtInt(n) { return Math.round(n).toLocaleString('hu-HU'); }
    function parseNum(txt) { return parseInt(String(txt).replace(/[^\d]/g, ''), 10) || 0; }
    function parseFloatSafe(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }

    function readCalc(formId) {
        const c = CALC_CONFIG[formId];
        if (!c) return null;
        const wEl = document.getElementById(c.width);
        const hEl = document.getElementById(c.height);
        const qEl = document.getElementById(c.qty);
        const w = wEl ? parseFloatSafe(wEl.value) : 0;
        const h = hEl ? parseFloatSafe(hEl.value) : 0;
        const q = qEl ? (parseInt(qEl.value, 10) || 0) : 0;
        const priceEl = document.getElementById(c.price);
        const price = priceEl ? parseNum(priceEl.textContent) : 0;
        let areaTxt = '';
        if (c.showArea && c.area) {
            const aEl = document.getElementById(c.area);
            if (aEl) areaTxt = parseFloatSafe(aEl.textContent).toFixed(2);
        }
        return { cfg: c, w: w, h: h, q: q, price: price, areaTxt: areaTxt };
    }

    function itemMeta(x) {
        const parts = [x.dims, x.qty + ' db'];
        if (x.showArea && x.area) parts.push(x.area + ' m²');
        return parts.join(' · ');
    }

    function cartTotal() { return cart.reduce(function (s, x) { return s + (x.price || 0); }, 0); }

    function buildOrderText() {
        if (cart.length === 0) return '';
        const blocks = cart.map(function (x) {
            const lines = [x.title + ':'];
            lines.push(x.dimsLabel + ': ' + x.dims);
            lines.push(x.qtyLabel + ': ' + x.qty + ' db');
            if (x.showArea && x.area) lines.push('Teljes négyzetméter: ' + x.area + ' m²');
            lines.push('Becsült ár: ' + fmtInt(x.price) + ' Ft');
            return lines.join('\n');
        });
        let txt = blocks.join('\n\n');
        if (cart.length > 1) txt += '\n\nBecsült összesen: ' + fmtInt(cartTotal()) + ' Ft';
        return txt;
    }

    function renderCart(newId) {
        const n = cart.length;
        const total = cartTotal();
        if (cartFab) cartFab.hidden = (n === 0);
        if (cartFabCount) cartFabCount.textContent = n;
        if (cartNavCount) { cartNavCount.style.display = n ? 'inline-flex' : 'none'; cartNavCount.textContent = n; }
        if (cartTotalEl) cartTotalEl.textContent = fmtInt(total) + ' Ft';
        if (checkoutTotalEl) checkoutTotalEl.textContent = fmtInt(total) + ' Ft';

        if (cartItemsEl) {
            if (n === 0) {
                cartItemsEl.innerHTML = '<p class="cart__empty">A kosár üres.<br>Számoljon ki egy méretet a kalkulátorban, majd kattintson a „Megrendelem” gombra.</p>';
            } else {
                cartItemsEl.innerHTML = cart.map(function (x) {
                    return '<div class="cart__item' + (x.id === newId ? ' new' : '') + '" data-id="' + x.id + '">' +
                        '<div class="cart__item-main">' +
                        '<span class="cart__item-title">' + x.title + '</span>' +
                        '<span class="cart__item-meta">' + itemMeta(x) + '</span>' +
                        '<span class="cart__item-price">Becsült ár: ' + fmtInt(x.price) + ' Ft</span>' +
                        '</div>' +
                        '<button type="button" class="cart__item-remove" data-remove="' + x.id + '" aria-label="Tétel törlése">&times;</button>' +
                        '</div>';
                }).join('');
            }
        }

        if (checkoutSummaryEl) {
            if (n === 0) {
                checkoutSummaryEl.innerHTML = '<p class="checkout__empty">A kosár még üres. Használja a fenti kalkulátorokat, és kattintson a „Megrendelem” gombra — a tételek itt jelennek meg. Ha csak üzenetet küldene, töltse ki az űrlapot.</p>';
            } else {
                checkoutSummaryEl.innerHTML = cart.map(function (x) {
                    return '<div class="co-item">' +
                        '<span class="co-item__t">' + x.title + '</span>' +
                        '<span class="co-item__m">' + itemMeta(x) + '</span>' +
                        '<span class="co-item__p">Becsült ár: ' + fmtInt(x.price) + ' Ft</span>' +
                        '</div>';
                }).join('');
            }
        }

        if (msgAutoFill && msgField) msgField.value = buildOrderText();
    }

    function bump(el) { if (!el) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

    function openCart() { if (cartPanel) { cartPanel.classList.add('open'); cartPanel.setAttribute('aria-hidden', 'false'); } if (cartOverlay) cartOverlay.classList.add('open'); }
    function closeCart() { if (cartPanel) { cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden', 'true'); } if (cartOverlay) cartOverlay.classList.remove('open'); }

    function flyToCart(startEl) {
        if (!startEl || !cartFab || cartFab.hidden) return;
        const s = startEl.getBoundingClientRect();
        const t = cartFab.getBoundingClientRect();
        const sx = s.left + s.width / 2, sy = s.top + s.height / 2;
        const dot = document.createElement('span');
        dot.className = 'fly-dot';
        dot.style.left = sx + 'px';
        dot.style.top = sy + 'px';
        document.body.appendChild(dot);
        void dot.offsetWidth;
        dot.style.transform = 'translate(' + ((t.left + t.width / 2) - sx) + 'px,' + ((t.top + t.height / 2) - sy) + 'px) scale(.25)';
        dot.style.opacity = '.25';
        setTimeout(function () { dot.remove(); }, 700);
    }

    function flashInvalid(btn) {
        if (!btn || !btn.parentElement) return;
        let hint = btn.parentElement.querySelector('.order-hint');
        if (!hint) {
            hint = document.createElement('p');
            hint.className = 'order-hint warn';
            btn.parentElement.appendChild(hint);
        }
        hint.textContent = 'Adja meg a méretet és a darabszámot a megrendeléshez.';
        hint.classList.remove('hidden');
        clearTimeout(hint._t);
        hint._t = setTimeout(function () { hint.classList.add('hidden'); }, 4000);
    }

    function addToCart(formId, sourceBtn) {
        const r = readCalc(formId);
        if (!r) return;
        if (!(r.w > 0 && r.h > 0 && r.q > 0 && r.price > 0)) { flashInvalid(sourceBtn); return; }
        const item = {
            id: ++cartSeq,
            title: r.cfg.title,
            dimsLabel: r.cfg.dimsLabel,
            dims: r.w + ' × ' + r.h + ' ' + r.cfg.unit,
            qtyLabel: r.cfg.qtyLabel,
            qty: r.q,
            showArea: r.cfg.showArea,
            area: r.areaTxt,
            price: r.price
        };
        cart.push(item);
        renderCart(item.id);
        flyToCart(sourceBtn);
        bump(cartFab);
        setTimeout(openCart, 480);
    }

    function removeFromCart(id) {
        const i = cart.findIndex(function (x) { return x.id === id; });
        if (i > -1) { cart.splice(i, 1); renderCart(); }
    }

    // Kalkulátor „Megrendelem" gombok bekötése
    document.querySelectorAll('a.cta.cta--block').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            const form = btn.closest('form');
            if (form && CALC_CONFIG[form.id]) {
                e.preventDefault();
                addToCart(form.id, btn);
            }
        });
    });

    const cartCloseBtn = document.getElementById('cart-close');
    const cartCheckoutBtn = document.getElementById('cart-checkout');
    const cartNavBtn = document.getElementById('cart-nav');
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (cartFab) cartFab.addEventListener('click', openCart);
    if (cartNavBtn) cartNavBtn.addEventListener('click', openCart);
    if (cartItemsEl) cartItemsEl.addEventListener('click', function (e) {
        const rm = e.target.closest('[data-remove]');
        if (rm) removeFromCart(parseInt(rm.getAttribute('data-remove'), 10));
    });

    if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', function () {
        if (msgField && cart.length) { msgField.value = buildOrderText(); msgAutoFill = true; }
        closeCart();
        const target = document.getElementById('contact-form');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () { const nm = document.getElementById('cf-name'); if (nm) nm.focus({ preventScroll: true }); }, 600);
    });

    if (msgField) msgField.addEventListener('input', function () { msgAutoFill = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

    renderCart();

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
