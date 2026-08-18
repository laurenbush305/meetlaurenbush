(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const person=document.getElementById('behavior');
 if(person){
   if(reduce) person.classList.add('is-live');
   else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.2) person.classList.add('is-live')}),{threshold:[0,.2,.45]});io.observe(person)}
 }
 const watch=document.getElementById('watch');
 const weather=watch&&watch.querySelector('.a44-watch-weather');
 const src={tv:'assets/img/watch-weather-tv-a44.webp',explain:'assets/img/watch-weather-explain-a44.webp',create:'assets/img/watch-weather-create-a44.webp',archive:'assets/img/watch-weather-archive-a44.webp'};
 const setProgram=p=>{if(!watch||!p)return;watch.dataset.a44Program=p;watch.dataset.a43Program=p;if(weather&&src[p]&&weather.getAttribute('src')!==src[p])weather.setAttribute('src',src[p]);if(document.body.dataset.a44World==='watch')document.body.dataset.a44World=(p==='explain'||p==='create')?'warm':'dark'};
 if(watch){const programs=[...watch.querySelectorAll('[data-a44-program]')];if(reduce)setProgram('tv');else{const io=new IntersectionObserver(entries=>{const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)setProgram(v.target.dataset.a44Program)}, {rootMargin:'-22% 0px -32% 0px',threshold:[.12,.28,.5,.72]});programs.forEach(x=>io.observe(x))}}
 const map={onair:'daylight',behavior:'dark',thinking:'daylight',authorship:'warm','third-party':'dark','host-command':'dark','activate-field':'daylight',watch:'watch',about:'dark','picture-lauren':'campaign',contact:'dark'};
 const sections=Object.keys(map).map(id=>document.getElementById(id)).filter(Boolean);
 if(sections.length){const io=new IntersectionObserver(entries=>{const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;let w=map[v.target.id]||'daylight';if(w==='watch'){const p=watch?.dataset.a44Program||'tv';w=(p==='explain'||p==='create')?'warm':'dark'}document.body.dataset.a44World=w},{rootMargin:'-38% 0px -48% 0px',threshold:[.05,.25,.5]});sections.forEach(s=>io.observe(s))}
})();