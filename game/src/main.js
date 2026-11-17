import { paintScene } from './neon-render.js';
const q=new URLSearchParams(location.search),shot=q.get('shot');
let seed=Number(q.get('seed')??1)>>>0;
function random(){if(!shot)return Math.random();let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}
let best=0;
try{best=+localStorage.neonBest||0}catch{}
if(shot)best=0;
let particles=[],flash=0,waveBanner=0;
function sparks(x,y,color){for(let i=0;i<16;i++){const a=i*Math.PI/8;particles.push({x,y,vx:Math.cos(a)*3,vy:Math.sin(a)*3,life:24,color})}}
const C=document.querySelector('canvas'),X=C.getContext('2d');C.width=1280;C.height=800;let mode='title',keys={},mouse={x:640,y:400,down:false},score=0,wave=1,hearts=3,combo=1,p={x:640,y:400,f:0,shield:0},E=[],B=[],P=[],up=[];addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;if(e.key==='Enter'&&mode==='title')start();if(e.key.toLowerCase()==='r'&&mode==='over')start();if(e.key.toLowerCase()==='p'||e.key==='Escape')mode=mode==='play'?'pause':mode==='pause'?'play':mode;if(e.key.toLowerCase()==='m'){} });addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);onmousemove=e=>{mouse.x=e.clientX*1280/innerWidth;mouse.y=e.clientY*800/innerHeight};onmousedown=()=>{mouse.down=1;if(mode==='title')start()};onmouseup=()=>mouse.down=0;function start(){mode='play';score=0;wave=1;hearts=3;combo=1;E=[];B=[];waveBanner=120;spawn()}function spawn(){for(let i=0;i<4+wave*2;i++){let a=random()*6.28;E.push({x:640+Math.cos(a)*380,y:400+Math.sin(a)*300,h:1,visualType:i%4})}}function shoot(){let a=Math.atan2(mouse.y-p.y,mouse.x-p.x);B.push({x:p.x,y:p.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,l:80});p.f=8}function update(){particles=particles.filter(t=>--t.life>0);particles.forEach(t=>{t.x+=t.vx;t.y+=t.vy});flash=Math.max(0,flash-1);waveBanner=Math.max(0,waveBanner-1);if(mode!=='play')return;let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);p.x=Math.max(20,Math.min(1260,p.x+dx*5));p.y=Math.max(20,Math.min(780,p.y+dy*5));if((mouse.down||keys[' '])&&p.f<=0)shoot();p.f--;B.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.l--});E.forEach(e=>{let a=Math.atan2(p.y-e.y,p.x-e.x);e.x+=Math.cos(a)*(1+wave*.1);e.y+=Math.sin(a)*(1+wave*.1);if(Math.hypot(e.x-p.x,e.y-p.y)<24){hearts--;flash=6;sparks(p.x,p.y,'#ff5ba9');e.x=-999;combo=1;if(hearts<=0){mode='over';best=Math.max(best,score);if(!shot){try{localStorage.neonBest=best}catch{}}}}});B.forEach(b=>E.forEach(e=>{if(Math.hypot(b.x-e.x,b.y-e.y)<18){sparks(e.x,e.y,'#ff71dc');e.h--;b.l=0;if(e.h<=0){e.x=-999;score+=10*combo;combo++}}}));B=B.filter(b=>b.l>0);E=E.filter(e=>e.x>-500);if(!E.length){wave++;waveBanner=120;mode='upgrade';up=['DAMAGE +','RAPID FIRE','SHIELD']}}function draw(){paintScene(X,{mode,p,E,B,score,best,wave,hearts,combo,mouse,up,particles,flash,waveBanner})}function loop(){update();draw();requestAnimationFrame(loop)}
function stageShot(){
  if(shot==='start')return;
  start();
  for(let tick=0;tick<10000;tick++){
    const target=E.reduce((a,e)=>!a||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(a.x-p.x,a.y-p.y)?e:a,null);
    keys={};mouse.down=false;
    if(target){
      mouse.x=target.x;mouse.y=target.y;
      // Earn a real kill before allowing the swarm to overwhelm the pilot.
      mouse.down=shot!=='end'||score===0;
      if(mouse.down){keys.d=target.x>p.x+10;keys.a=target.x<p.x-10;keys.s=target.y>p.y+10;keys.w=target.y<p.y-10;}
    }
    update();
    if(shot==='play'&&score>0&&E.length&&B.length&&mode==='play')return;
    if(mode==='over')return;
    if(mode==='upgrade'){mode='play';spawn();}
  }
  throw new Error('Screenshot simulation did not reach its target');
}
// Freeze staged frames so capture timing cannot change their state.
if(shot){stageShot();draw();requestAnimationFrame(()=>{window.__shotReady=true;});}
else loop();
