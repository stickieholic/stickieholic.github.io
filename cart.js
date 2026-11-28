(function(){
 const KEY='stickieholic_cart_v1';
 const read=()=>{try{const value=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value:[]}catch{return []}};
 const save=items=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event('stickieholic-cart-updated'));};
 const money=value=>'Rs. '+Number(value||0).toLocaleString('en-PK');
 const add=(product)=>{
  const items=read();const found=items.find(item=>item.name===product.name);
  if(found)found.quantity+=1;else items.push({...product,quantity:1});
  save(items);return items;
 };
 const count=()=>read().reduce((sum,item)=>sum+Number(item.quantity||0),0);
 const updateBadges=()=>document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=count();el.hidden=count()===0;});
 const flyStickerToCart=(button,product)=>{
  const target=document.querySelector('a[href$="cart.html"]');
  if(!target||!button||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const from=button.getBoundingClientRect(),to=target.getBoundingClientRect();
  if(!from.width||!from.height||!to.width||!to.height)return;
  const sx=from.left+from.width/2,sy=from.top+from.height/2;
  const ex=to.left+to.width/2,ey=to.top+to.height/2;
  const dx=ex-sx,dy=ey-sy;
  const distance=Math.hypot(dx,dy);
  const ux=dx/distance,uy=dy/distance;
  const px=-uy,py=ux;
  const loop=Math.max(24,Math.min(92,distance*.19));
  const point=(t,side)=>{
   const along=distance*t,across=loop*side;
   return [sx+ux*along+px*across,sy+uy*along+py*across];
  };
  const fmt=p=>p[0].toFixed(1)+' '+p[1].toFixed(1);
  const p0=point(0,0);
  const p1=point(.10,-.78),p2=point(.08,-1.35),p3=point(.23,-1.18);
  const p4=point(.37,-1.02),p5=point(.25,.28),p6=point(.48,.18);
  const p7=point(.63,.10),p8=point(.64,-1.30),p9=point(.79,-1.12);
  const p10=point(.92,-.94),p11=point(.84,.10),p12=point(.96,.08);
  const p13=point(.985,.04),p14=point(1,0);
  const svgNS='http://www.w3.org/2000/svg';
  const overlay=document.createElementNS(svgNS,'svg');
  overlay.setAttribute('viewBox','0 0 '+window.innerWidth+' '+window.innerHeight);
  overlay.setAttribute('width',window.innerWidth);
  overlay.setAttribute('height',window.innerHeight);
  overlay.setAttribute('aria-hidden','true');
  overlay.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:2147482998;overflow:visible;pointer-events:none;';
  const trail=document.createElementNS(svgNS,'path');
  const d='M '+fmt(p0)+' C '+fmt(p1)+', '+fmt(p2)+', '+fmt(p3)+' C '+fmt(p4)+', '+fmt(p5)+', '+fmt(p6)+' C '+fmt(p7)+', '+fmt(p8)+', '+fmt(p9)+' C '+fmt(p10)+', '+fmt(p11)+', '+fmt(p12)+' C '+fmt(p13)+', '+fmt(p14)+', '+fmt(p14);
  trail.setAttribute('d',d);
  trail.setAttribute('fill','none');
  trail.setAttribute('stroke','#211b20');
  trail.setAttribute('stroke-width','3.5');
  trail.setAttribute('stroke-linecap','round');
  trail.setAttribute('stroke-dasharray','9 10');
  trail.setAttribute('stroke-linejoin','round');
  overlay.appendChild(trail);
  document.body.appendChild(overlay);
  const length=trail.getTotalLength();
  const heart=document.createElement('span');
  heart.setAttribute('aria-hidden','true');
  heart.style.cssText='position:fixed;left:0;top:0;width:52px;height:52px;z-index:2147482999;display:grid;place-items:center;pointer-events:none;overflow:hidden;clip-path:polygon(50% 94%,8% 56%,2% 39%,5% 23%,17% 11%,32% 9%,50% 27%,68% 9%,83% 11%,95% 23%,98% 39%,92% 56%);background:#e9168b;box-shadow:0 8px 22px #392d3530;will-change:transform,opacity;';
  if(product.image){
   const img=document.createElement('img');img.src=product.image;img.alt='';
   img.style.cssText='display:block;width:100%;height:100%;object-fit:cover;background:#fff0f6;';
   heart.appendChild(img);
  }else{
   heart.textContent='♥';heart.style.color='#fff';heart.style.fontSize='34px';
  }
  document.body.appendChild(heart);
  const duration=1050;
  const started=performance.now();
  let frameId=0,finished=false;
  const cleanup=()=>{if(finished)return;finished=true;if(frameId)cancelAnimationFrame(frameId);heart.remove();overlay.remove();};
  const animate=now=>{
   if(finished)return;
   const raw=Math.min(1,(now-started)/duration);
   const eased=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2;
   const point=trail.getPointAtLength(length*eased);
   const ahead=trail.getPointAtLength(Math.min(length,length*eased+2));
   const angle=Math.atan2(ahead.y-point.y,ahead.x-point.x)*180/Math.PI;
   heart.style.transform='translate3d('+(point.x-26)+'px,'+(point.y-26)+'px,0) rotate('+(angle+45)+'deg) scale('+(raw>.88?1-(raw-.88)*5:1)+')';
   heart.style.opacity=raw>.94?String(1-(raw-.94)/.06):'1';
   if(raw<1)frameId=requestAnimationFrame(animate);else cleanup();
  };
  frameId=requestAnimationFrame(animate);
 };
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-add-to-cart]');
  if(!button)return;
  const product={name:button.dataset.name||'Sticker product',price:Number(button.dataset.price||0),image:button.dataset.image||''};
  add(product);
  flyStickerToCart(button,product);
  const old=button.textContent;button.textContent='Added ✓';button.classList.add('added');
  setTimeout(()=>{button.textContent=old;button.classList.remove('added')},1200);
  updateBadges();
 });
 window.addEventListener('stickieholic-cart-updated',updateBadges);
 window.StickieholicCart={read,save,add,count,money,updateBadges};
 document.addEventListener('DOMContentLoaded',updateBadges);
})();