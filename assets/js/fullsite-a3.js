(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const inline=[...document.querySelectorAll('main video')].filter(v=>v.id!=='player-video');
 const player=document.getElementById('player-video');
 const hero=document.getElementById('v-host');
 const windows=new WeakMap();
 document.querySelectorAll('[data-a3-window]').forEach(v=>{
   const [s,e]=(v.dataset.a3Window||'0,5').split(',').map(Number);windows.set(v,{s:s||0,e:e||5});
   v.addEventListener('timeupdate',()=>{const w=windows.get(v);if(w&&v.currentTime>=w.e){v.currentTime=w.s;}});
 });
 document.querySelectorAll('[data-a3-start]').forEach(v=>v.addEventListener('loadedmetadata',()=>{v.currentTime=parseFloat(v.dataset.a3Start)||0},{once:true}));
 const io=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting,intersectionRatio})=>{
   if(reduce){target.pause();return}
   if(isIntersecting&&intersectionRatio>.28){
     target.play().catch(()=>{});
     if(target.closest('#behavior')) target.closest('#behavior').classList.add('is-awake');
   } else {target.pause();}
 }),{threshold:[0,.28,.6]});
 inline.forEach(v=>io.observe(v));
 if(hero&&!reduce){hero.pause();setTimeout(()=>{if(hero.getBoundingClientRect().bottom>0&&hero.getBoundingClientRect().top<innerHeight)hero.play().catch(()=>{})},1500)}
 function quietInline(){inline.forEach(v=>v.pause())}
 document.addEventListener('click',e=>{
   if(e.target.closest('.playable')) quietInline();
   if(e.target.closest('#player-close')){ if(player){player.pause();player.muted=true;} }
 });
 document.addEventListener('play',e=>{
   if(e.target instanceof HTMLVideoElement && !e.target.muted){
      document.querySelectorAll('video').forEach(v=>{if(v!==e.target){v.pause();v.muted=true;}});
   }
 },true);
 // Stable door states: /#create /#explain /#host /#activate cue the hero door.
 const laneHashes=new Set(['create','explain','host','activate']);
 function cueHash(){const h=location.hash.slice(1);if(laneHashes.has(h)){document.querySelector('[data-lane="'+h+'"][role="tab"]')?.click();}}
 addEventListener('hashchange',cueHash);cueHash();
 document.querySelectorAll('.tune [data-lane]').forEach(btn=>btn.addEventListener('click',()=>{
   const lane=btn.dataset.lane;if(laneHashes.has(lane)&&location.hash.slice(1)!==lane)history.replaceState(null,'','#'+lane);
 }));
})();