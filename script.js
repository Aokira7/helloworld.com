/* ==========================================================================
   AOKIRA CYBER — CORE JAVASCRIPT (VANILLA 60FPS ENGINE)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initCanvasAnimation();
    initNetworkCanvas();
    initTypingEffect();
    initTerminalLoop();
    initScrollObserver();
    initFilterSystem();
    initMobileNav();
    initMouseGlow();
});

/* --------------------------------------------------------------------------
   1. BACKGROUND CANVAS (MATRIX RAIN + FLOATING PARTICLES)
   -------------------------------------------------------------------------- */
function initCanvasAnimation() {
    const canvas = document.getElementById("cyber-canvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Matrix Rain Data
    const matrixChars = "01ABCDXYZ>/<{}[]";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    // Particles Data
    const particleCount = Math.min(Math.floor(width / 20), 50);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }

    function render() {
        // Semi-transparent clearing for trail effect
        ctx.fillStyle = "rgba(2, 6, 4, 0.15)";
        ctx.fillRect(0, 0, width, height);

        // 1. Matrix Rain
        ctx.fillStyle = "#00ff66";
        ctx.font = `${fontSize}px 'Fira Code', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(char, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        // 2. Floating Particles & Connections
        ctx.fillStyle = "rgba(0, 255, 102, 0.7)";
        ctx.strokeStyle = "rgba(0, 255, 102, 0.15)";

        particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Link nearest particles
            for (let j = idx + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(render);
    }

    render();
}

/* --------------------------------------------------------------------------
   2. NETWORK NODES VISUALIZATION
   -------------------------------------------------------------------------- */
function initNetworkCanvas() {
    const canvas = document.getElementById("network-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = canvas.parentElement.clientWidth);
    let h = (canvas.height = canvas.parentElement.clientHeight);

    const nodes = [
        { x: w * 0.2, y: h * 0.3, label: "NODE_01" },
        { x: w * 0.8, y: h * 0.2, label: "NODE_02" },
        { x: w * 0.5, y: h * 0.5, label: "AOKIRA" },
        { x: w * 0.3, y: h * 0.8, label: "NODE_03" },
        { x: w * 0.7, y: h * 0.8, label: "NODE_04" }
    ];

    let pulseOffset = 0;

    function animateNetwork() {
        ctx.clearRect(0, 0, w, h);

        // Connections
        ctx.strokeStyle = "rgba(0, 255, 102, 0.3)";
        ctx.lineWidth = 1;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }

        // Draw Nodes
        nodes.forEach((node) => {
            ctx.fillStyle = node.label === "AOKIRA" ? "#00f0ff" : "#00ff66";
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#7a9a8b";
            ctx.font = "10px 'Fira Code'";
            ctx.fillText(node.label, node.x - 20, node.y - 12);
        });

        pulseOffset += 0.02;
        requestAnimationFrame(animateNetwork);
    }

    animateNetwork();
}

/* --------------------------------------------------------------------------
   3. TYPING ANIMATION (HERO)
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const el = document.getElementById("hero-typing-log");
    const logs = [
        "> INITIALIZING AOKIRA SYSTEM...",
        "> CONNECTING SECURE NODE...",
        "> SYSTEM STATUS: ONLINE",
        "> SECURITY LEVEL: ACTIVE"
    ];

    let logIdx = 0;
    let charIdx = 0;

    function type() {
        if (logIdx < logs.length) {
            if (charIdx < logs[logIdx].length) {
                el.innerHTML += logs[logIdx].charAt(charIdx);
                charIdx++;
                setTimeout(type, 40);
            } else {
                setTimeout(() => {
                    el.innerHTML = "";
                    charIdx = 0;
                    logIdx = (logIdx + 1) % logs.length;
                    type();
                }, 2000);
            }
        }
    }

    type();
}

/* --------------------------------------------------------------------------
   4. TERMINAL LIVE SEQUENCES
   -------------------------------------------------------------------------- */
function initTerminalLoop() {
    const output = document.getElementById("terminal-output");
    const commands = [
        "> scanning service database... 07 services detected",
        "> research module ........ ONLINE",
        "> security module ........ ONLINE",
        "> device module .......... ONLINE",
        "> debugging module ....... ONLINE",
        "> media module ........... ONLINE",
        "> AOKIRA CORE STATUS: OPERATIONAL",
        "> awaiting client request..."
    ];

    let idx = 0;

    function addLine() {
        if (idx < commands.length) {
            const div = document.createElement("div");
            div.className = "terminal-line t-green";
            div.textContent = commands[idx];
            output.appendChild(div);
            idx++;
            setTimeout(addLine, 1200);
        }
    }

    setTimeout(addLine, 1000);
}

/* --------------------------------------------------------------------------
   5. FILTER SYSTEM & ANIMATIONS
   -------------------------------------------------------------------------- */
function initFilterSystem() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".service-card");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.getAttribute("data-category");

            cards.forEach((card) => {
                const cardCat = card.getAttribute("data-category");
                if (category === "all" || cardCat === category) {
                    card.style.display = "flex";
                    card.style.opacity = "1";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL & COUNTERS
   -------------------------------------------------------------------------- */
function initScrollObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains("stat-number")) {
                        animateCounter(entry.target);
                    }
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll(".stat-number").forEach((el) => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"));
    let current = 0;
    const interval = setInterval(() => {
        if (current < target) {
            current++;
            el.textContent = current < 10 ? `0${current}` : current;
        } else {
            clearInterval(interval);
        }
    }, 150);
}

/* --------------------------------------------------------------------------
   7. MODAL & FORM HANDLER
   -------------------------------------------------------------------------- */
function openOrderModal(serviceCode, serviceName) {
    const modal = document.getElementById("order-modal");
    const select = document.getElementById("modal-service-select");

    if (serviceCode) {
        select.value = serviceCode;
    }

    modal.classList.add("active");
    document.getElementById("order-form").style.display = "block";
    document.getElementById("order-status-result").style.display = "none";
}

function closeOrderModal() {
    document.getElementById("order-modal").classList.remove("active");
}

function handleFormSubmit(e) {
    e.preventDefault();

    document.getElementById("order-form").style.display = "none";
    document.getElementById("order-status-result").style.display = "block";

    showToast("REQUEST REGISTERED TO AOKIRA SYSTEM");
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

/* --------------------------------------------------------------------------
   8. MOBILE NAV & MOUSE GLOW
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

function initMouseGlow() {
    const glow = document.getElementById("mouse-glow");
    window.addEventListener("mousemove", (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}
