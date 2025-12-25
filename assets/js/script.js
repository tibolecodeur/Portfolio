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
