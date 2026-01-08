const canvas=paint, brush=canvas.getContext("2d"), R=80;
let px=0, py=0;

const fit=_=>{
  const p=devicePixelRatio||1;
  canvas.width=innerWidth*p; canvas.height=innerHeight*p;
  brush.setTransform(p,0,0,p,0,0);
  brush.fillStyle="#fff"; brush.fillRect(0,0,innerWidth,innerHeight);
  brush.lineCap=brush.lineJoin="round"; brush.lineWidth=R*2;
};
addEventListener("resize",fit); fit();

const erase=e=>{
  brush.globalCompositeOperation="destination-out";
  brush.beginPath(); brush.moveTo(px,py); brush.lineTo(e.clientX,e.clientY); brush.stroke();
  px=e.clientX; py=e.clientY;
};

canvas.onpointermove=erase;


const btnDiscover = document.querySelector('.action-button');
const wave = document.querySelector('.wave-transition');
const homeContent = document.getElementById('home-content');
const projectsContent = document.getElementById('projects-content');

btnDiscover.addEventListener('click', () => {
    wave.classList.add('active');

    // On switch le contenu à 1.4s (milieu de l'anim de 2.8s)
    setTimeout(() => {
        if(homeContent) homeContent.style.display = 'none';
        if(projectsContent) {
            projectsContent.classList.remove('projects-hidden');
            projectsContent.style.display = 'block';
        }
        window.scrollTo(0, 0);
    }, 1400); 

    // Reset pour permettre de cliquer à nouveau plus tard
    setTimeout(() => {
        wave.classList.remove('active');
    }, 2800);
});