export function paintScene(X, state) {
  const {mode,p,E,B,score,best,wave,hearts,combo,mouse,up,particles,flash,waveBanner}=state;
  X.shadowBlur=0; X.globalAlpha=1;
  X.fillStyle='#050814'; X.fillRect(0,0,1280,800);
  for(let i=0;i<150;i++){
    const x=(i*7919+83)%1280,y=(i*3571+47)%800;
    X.fillStyle=i%4===0?'#527d9c':'#203248';X.fillRect(x,y,i%4===0?2:1,1);
  }
  const nebula=X.createRadialGradient(640,400,20,640,400,660);
  nebula.addColorStop(0,'#11233d66');nebula.addColorStop(1,'#02030be0');
  X.fillStyle=nebula;X.fillRect(0,0,1280,800);
  function text(s,x,y,size,color='#d9f7ff'){
    X.shadowColor=color;X.shadowBlur=size>40?24:6;X.fillStyle=color;
    X.font=`${size>30?'bold ':''}${size}px Arial`;X.fillText(s,x,y);X.shadowBlur=0;
  }
  function shape(x,y,angle,points,color){
    X.save();X.translate(x,y);X.rotate(angle);X.shadowColor=color;X.shadowBlur=18;
    X.beginPath();points.forEach(([a,b],i)=>i?X.lineTo(a,b):X.moveTo(a,b));X.closePath();
    X.fillStyle='#10182c';X.fill();X.strokeStyle=color;X.lineWidth=2;X.stroke();X.restore();
  }
  const silhouettes=[[[20,0],[-15,-15],[-7,0],[-15,15]],[[19,0],[0,-17],[-19,0],[0,17]],[[18,0],[9,-16],[-9,-16],[-18,0],[-9,16],[9,16]],[[22,0],[-12,-15],[-4,0],[-12,15]]];
  if(mode==='title'||mode==='over'){
    X.textAlign='center';text('S U R V I V E   T H E   S I G N A L',640,145,16,'#f36dc9');
    text(mode==='title'?'NEON SWARM':'GAME OVER',640,255,86,'#66f5ff');
    text(mode==='title'?'A neon arena. An endless swarm. One pilot.':`FINAL SCORE  ${score}     /     WAVE REACHED  ${wave}`,640,327,24);
    text(`BEST SCORE  ${best}`,640,382,20,'#ffe581');
    X.strokeStyle='#397988';X.strokeRect(380,433,520,74);
    text(mode==='title'?'CLICK OR PRESS ENTER TO START':'PRESS R TO RESTART',640,479,23,'#66f5ff');
    text('WASD / ARROWS  MOVE     MOUSE  AIM',640,580,17);
    text('HOLD CLICK / SPACE  FIRE     P / ESC  PAUSE     M  MUTE',640,616,17);
    silhouettes.forEach((s,i)=>shape(490+i*100,704,-Math.PI/2,s,['#ff57ba','#ffe581','#ac83ff','#ff8855'][i]));
    return;
  }
  X.strokeStyle='#1d3c50';X.strokeRect(12,70,1256,718);
  const angle=Math.atan2(mouse.y-p.y,mouse.x-p.x);
  X.save();X.translate(p.x,p.y);X.rotate(angle);
  X.shadowColor='#60eeff';X.shadowBlur=20;
  const trail=X.createLinearGradient(-12,0,-55,0);trail.addColorStop(0,'#69f8ffbb');trail.addColorStop(1,'#69f8ff00');
  X.fillStyle=trail;X.beginPath();X.moveTo(-10,-6);X.lineTo(-55,0);X.lineTo(-10,6);X.fill();X.restore();
  shape(p.x,p.y,angle,[[23,0],[-15,-14],[-8,0],[-15,14]],'#68f5ff');
  E.forEach((e,i)=>shape(e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x),silhouettes[e.visualType??i%4],['#ff57ba','#ffe581','#ac83ff','#ff8855'][e.visualType??i%4]));
  X.lineCap='round';B.forEach(b=>{X.shadowColor='#ffe581';X.shadowBlur=14;X.strokeStyle='#fff4b0';X.lineWidth=3;X.beginPath();X.moveTo(b.x-b.vx*1.5,b.y-b.vy*1.5);X.lineTo(b.x,b.y);X.stroke()});X.shadowBlur=0;
  particles.forEach(t=>{X.globalAlpha=t.life/24;X.fillStyle=t.color;X.fillRect(t.x,t.y,3,3)});X.globalAlpha=1;
  X.fillStyle='#07101ee8';X.fillRect(0,0,1280,65);X.textAlign='left';
  text(`SCORE  ${score}`,26,40,21);text(`BEST  ${best}`,230,40,18,'#709bb7');text(`WAVE  ${wave}`,430,40,21);text(`COMBO  x${combo}`,610,40,21,'#ffe581');text('HULL',980,40,16,'#709bb7');
  for(let i=0;i<3;i++){
    X.save();X.translate(1060+i*52,24);X.beginPath();X.moveTo(0,6);X.bezierCurveTo(-18,-10,-23,10,0,27);X.bezierCurveTo(23,10,18,-10,0,6);
    X.fillStyle=i<hearts?'#ff5ba9':'#172238';X.shadowColor='#ff5ba9';X.shadowBlur=i<hearts?14:0;X.fill();X.strokeStyle=i<hearts?'#ffa5cc':'#37415b';X.stroke();X.restore();
  }
  if(mode==='pause'||mode==='upgrade'){
    X.fillStyle='#050814de';X.fillRect(0,70,1280,730);X.textAlign='center';text(mode==='pause'?'PAUSED':'WAVE CLEAR',640,250,60,'#66f5ff');
    if(mode==='upgrade'){text('CHOOSE UPGRADE',640,310,22);up.forEach((u,i)=>{X.strokeStyle='#38778b';X.strokeRect(240+i*280,365,250,140);text(`${i+1}. ${u}`,365+i*280,447,23)})}
  }
  if(waveBanner>0&&mode==='play'){X.textAlign='center';X.globalAlpha=Math.min(1,waveBanner/20);text('WAVE '+wave,640,135,34,'#ffe581');X.globalAlpha=1}if(flash>0){X.fillStyle=`rgba(255,65,130,${flash/24})`;X.fillRect(0,0,1280,800)}
}
