// --- EFFET DE GRATTAGE ---
const canvas = document.getElementById('paint');
const brush = canvas.getContext("2d");
const R = 80;
let px = 0, py = 0;

const fit = () => {
    const p = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * p;
    canvas.height = window.innerHeight * p;
    brush.setTransform(p, 0, 0, p, 0, 0);
    brush.fillStyle = "#fff";
    brush.fillRect(0, 0, window.innerWidth, window.innerHeight);
    brush.lineCap = brush.lineJoin = "round";
    brush.lineWidth = R * 2;
};
window.addEventListener("resize", fit);
fit();

const erase = e => {
    brush.globalCompositeOperation = "destination-out";
    brush.beginPath();
    brush.moveTo(px, py);
    brush.lineTo(e.clientX, e.clientY);
    brush.stroke();
    px = e.clientX;
    py = e.clientY;
};
canvas.onpointermove = erase;
canvas.onpointerdown = e => { px = e.clientX; py = e.clientY; };

// --- TRANSITION VAGUES ---
const btnDiscover = document.querySelector('.action-button');
const wave = document.querySelector('.wave-transition');
const homeContent = document.getElementById('home-content');
const projectsContent = document.getElementById('projects-content');

btnDiscover.addEventListener('click', () => {
    wave.classList.add('active');

    // Changement de page au milieu de l'animation
    setTimeout(() => {
        if (homeContent) homeContent.style.display = 'none';
        if (projectsContent) {
            projectsContent.style.display = 'block';
            document.body.style.overflowY = 'auto'; // Réactive le scroll pour les projets
        }
    }, 1400);
});

// --- EFFET IMAGE FLOTTANTE PROJETS ---
const projectItems = document.querySelectorAll('.project-item');
const mediaWrapper = document.querySelector('.hover-media-wrapper');
const mediaImage = document.querySelector('.hover-media');

let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const animateMedia = () => {
    // Calcul de l'inertie (Lerp)
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    const x = currentX - 175; // centrage horizontal
    const y = currentY - 225; // centrage vertical

    const scale = mediaWrapper.classList.contains('is-active') ? 1 : 0.8;
    mediaWrapper.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    requestAnimationFrame(animateMedia);
};
animateMedia();

projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const imgUrl = item.getAttribute('data-img');
        mediaImage.style.backgroundImage = `url(${imgUrl})`;
        mediaWrapper.classList.add('is-active');
    });
    item.addEventListener('mouseleave', () => {
        mediaWrapper.classList.remove('is-active');
    });
});