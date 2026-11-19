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
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-add-to-cart]');
  if(!button)return;
  const product={name:button.dataset.name||'Sticker product',price:Number(button.dataset.price||0),image:button.dataset.image||''};
  add(product);
  const old=button.textContent;button.textContent='Added ✓';button.classList.add('added');
  setTimeout(()=>{button.textContent=old;button.classList.remove('added')},1200);
  updateBadges();
 });
 window.addEventListener('stickieholic-cart-updated',updateBadges);
 window.StickieholicCart={read,save,add,count,money,updateBadges};
 document.addEventListener('DOMContentLoaded',updateBadges);
})();