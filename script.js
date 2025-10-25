document.addEventListener('DOMContentLoaded', () => {

    // --- Interactive Particle Background ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    const mouse = { x: null, y: null, radius: 100 };
    window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    class Particle {
        constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2.5) + 1;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(229, 57, 53, 0.7)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(255, 179, 0, ${opacityValue * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }
    
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { setCanvasSize(); initParticles(); });

    // --- Smooth Scroll-in Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // +++ NEW: Image Modal Logic +++
    const modal = document.getElementById("imageModal");
    const showcaseImg = document.getElementById("showcase-img");
    const modalImg = document.getElementById("modalImage");
    const closeButton = document.querySelector(".close-button");

    let currentScale = 1;
    const zoomIntensity = 0.1;

    // Function to open the modal
    function openModal() {
        modal.style.display = "flex";
        modalImg.src = showcaseImg.src;
        currentScale = 1;
        modalImg.style.transform = `scale(${currentScale})`;
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Function to handle zooming
    function handleZoom(event) {
        event.preventDefault(); // Prevent page scrolling

        if (event.deltaY < 0) { // Scrolling up -> zoom in
            currentScale += zoomIntensity;
        } else { // Scrolling down -> zoom out
            currentScale -= zoomIntensity;
        }

        // Clamp the scale to reasonable limits
        currentScale = Math.max(0.5, Math.min(currentScale, 3)); 

        modalImg.style.transform = `scale(${currentScale})`;
    }

    // Event listeners
    showcaseImg.onclick = openModal;
    closeButton.onclick = closeModal;
    modal.onclick = function(event) {
        // Close if the user clicks on the dark background, but not the image itself
        if (event.target === modal) {
            closeModal();
        }
    };
    modalImg.addEventListener('wheel', handleZoom);
});