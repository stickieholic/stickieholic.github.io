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
  const startX=from.left+from.width/2-21,startY=from.top+from.height/2-21;
  const endX=to.left+to.width/2-15,endY=to.top+to.height/2-15;
  const flyer=document.createElement('span');
  flyer.setAttribute('aria-hidden','true');
  flyer.style.cssText='position:fixed;display:grid;place-items:center;z-index:2147483000;left:'+startX+'px;top:'+startY+'px;width:42px;height:42px;border-radius:50%;background:#fff7fb;border:2px solid #f2bfd0;box-shadow:0 8px 22px #392d3530;overflow:hidden;pointer-events:none;will-change:left,top,transform,opacity;';
  if(product.image){
   const img=document.createElement('img');img.src=product.image;img.alt='';img.style.cssText='display:block;width:100%;height:100%;object-fit:contain;padding:3px;';flyer.appendChild(img);
  }else{flyer.textContent='♡';flyer.style.fontSize='27px';flyer.style.color='#e34278';}
  document.body.appendChild(flyer);
  const dx=endX-startX,dy=endY-startY;
  const frames=[
   {left:startX+'px',top:startY+'px',transform:'scale(1) rotate(0deg)',opacity:1,offset:0},
   {left:(startX+dx*.38)+'px',top:(startY+dy*.25-78)+'px',transform:'scale(1.18) rotate(14deg)',opacity:1,offset:.48},
   {left:endX+'px',top:endY+'px',transform:'scale(.18) rotate(28deg)',opacity:.12,offset:1}
  ];
  let finished=false;
  const cleanup=()=>{if(finished)return;finished=true;flyer.remove();};
  try{
   if(typeof flyer.animate==='function'){
    const animation=flyer.animate(frames,{duration:760,easing:'cubic-bezier(.22,.72,.28,1)',fill:'forwards'});
    animation.onfinish=cleanup;
    animation.oncancel=cleanup;
   }else{
    flyer.style.transition='left 760ms cubic-bezier(.22,.72,.28,1),top 760ms cubic-bezier(.22,.72,.28,1),transform 760ms cubic-bezier(.22,.72,.28,1),opacity 760ms ease';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
     flyer.style.left=endX+'px';flyer.style.top=endY+'px';flyer.style.transform='scale(.18) rotate(28deg)';flyer.style.opacity='.12';
    }));
    window.setTimeout(cleanup,850);
   }
  }catch(error){cleanup();console.warn('Cart flight animation unavailable:',error);}
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