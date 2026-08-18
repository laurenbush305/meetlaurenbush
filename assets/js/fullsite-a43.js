(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const person=document.getElementById('behavior');
 if(person){
   if(reduce){person.classList.add('is-live');}
   else{
     const io=new IntersectionObserver(es=>es.forEach(e=>{
       if(e.isIntersecting&&e.intersectionRatio>.22) person.classList.add('is-live');
     }),{threshold:[0,.22,.5]});
     io.observe(person);
   }
 }
 const watch=document.getElementById('watch');
 if(watch){
   const programs=[...watch.querySelectorAll('[data-a43-program]')].filter(x=>x!==watch);
   if(programs.length){
     const setProgram=(p)=>{ if(p) watch.dataset.a43Program=p; };
     if(reduce){ setProgram(programs[0].dataset.a43Program||'tv'); }
     else{
       const io=new IntersectionObserver(entries=>{
         const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
         if(visible) setProgram(visible.target.dataset.a43Program);
       },{rootMargin:'-22% 0px -32% 0px',threshold:[.12,.28,.5,.72]});
       programs.forEach(p=>io.observe(p));
     }
   }
 }
})();