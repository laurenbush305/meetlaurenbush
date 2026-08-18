(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // A4 videos remain asleep until visible. A3 also observes them; this guard is deliberately redundant for performance safety.
 const vids=[...document.querySelectorAll('main video')].filter(v=>v.id!=='player-video');
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{
   if(reduce){e.target.pause();return;}
   if(e.isIntersecting&&e.intersectionRatio>.24){e.target.play().catch(()=>{});}else{e.target.pause();}
 }),{threshold:[0,.24,.55]});
 vids.forEach(v=>io.observe(v));
 // One audio owner remains a hard rule.
 document.addEventListener('play',e=>{
   const v=e.target;if(!(v instanceof HTMLVideoElement)||v.muted)return;
   document.querySelectorAll('video').forEach(other=>{if(other!==v){other.pause();other.muted=true;}});
 },true);
 // Booking transition: audience -> producer. Existing A1 handler still creates the mailto.
 const form=document.getElementById('booking-brief');
 if(form){form.addEventListener('submit',()=>{
   const status=form.querySelector('.a4-booking-status');if(status){status.hidden=false;form.classList.add('is-launching');}
 },true);}
})();