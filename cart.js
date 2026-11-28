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
  const svgNS='http://www.w3.org/2000/svg';
  const overlay=document.createElementNS(svgNS,'svg');
  overlay.setAttribute('viewBox','0 0 '+window.innerWidth+' '+window.innerHeight);
  overlay.setAttribute('width',window.innerWidth);
  overlay.setAttribute('height',window.innerHeight);
  overlay.setAttribute('aria-hidden','true');
  overlay.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:2147482998;overflow:visible;pointer-events:none;';
  const trail=document.createElementNS(svgNS,'path');
  const c1x=sx+dx*.20,c1y=sy-75;
  const c2x=sx+dx*.17,c2y=sy-145;
  const loopX=sx+dx*.34,loopY=sy-95;
  const c3x=sx+dx*.53,c3y=sy-38;
  const c4x=sx+dx*.35,c4y=sy+Math.sign(dy||1)*95;
  const midX=sx+dx*.56,midY=sy+dy*.48;
  const d='M '+sx+' '+sy+' C '+c1x+' '+c1y+', '+c2x+' '+c2y+', '+loopX+' '+loopY+' C '+(sx+dx*.53)+' '+(sy-48)+', '+(sx+dx*.42)+' '+(sy+28)+', '+midX+' '+midY+' C '+(sx+dx*.73)+' '+(sy+dy*.66-65)+', '+(ex-dx*.10)+' '+(ey-dy*.18-38)+', '+ex+' '+ey;
  trail.setAttribute('d',d);
  trail.setAttribute('fill','none');
  trail.setAttribute('stroke','#211b20');
  trail.setAttribute('stroke-width','3.5');
  trail.setAttribute('stroke-linecap','round');
  trail.setAttribute('stroke-dasharray','11 10');
  overlay.appendChild(trail);
  document.body.appendChild(overlay);
  const length=trail.getTotalLength();
  trail.style.strokeDasharray='11 10';
  trail.style.strokeDashoffset=String(length);
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
   trail.style.strokeDashoffset=String(length*(1-eased));
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