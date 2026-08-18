(()=>{
  const host=document.getElementById('host-command');
  const third=document.getElementById('third-party');
  if(host&&third&&'IntersectionObserver' in window){
    let fired=false;
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{
      if(e.target===host&&e.isIntersecting&&!fired){fired=true;host.classList.remove('a55-break');void host.offsetWidth;host.classList.add('a55-break');setTimeout(()=>host.classList.remove('a55-break'),240);}
      if(e.target===third&&e.isIntersecting) fired=false;
    })},{threshold:.04});
    io.observe(third);io.observe(host);
  }
  const watch=document.getElementById('watch');
  if(watch){
    const buttons=[...watch.querySelectorAll('[data-tune]')];
    const panels=[...watch.querySelectorAll('.a55-program')];
    let timer;
    const tune=(name)=>{
      watch.classList.remove('is-tuning'); void watch.offsetWidth; watch.classList.add('is-tuning');
      clearTimeout(timer);timer=setTimeout(()=>watch.classList.remove('is-tuning'),210);
      watch.dataset.a55Program=name;
      buttons.forEach(b=>{const on=b.dataset.tune===name;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false')});
      panels.forEach(p=>{
        const on=p.dataset.program===name;p.classList.toggle('is-active',on);
        const v=p.querySelector('video');if(v){if(on&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches){v.play().catch(()=>{})}else{v.pause();}}
      });
    };
    buttons.forEach(b=>b.addEventListener('click',()=>tune(b.dataset.tune)));
    tune('scrambled');
  }
})();

// A5.5 media-performance lock: inactive tuner media never burns offscreen.
(()=>{
  const watch=document.getElementById('watch');
  if(!watch) return;
  const vids=[...watch.querySelectorAll('video')];
  const pauseAll=()=>vids.forEach(v=>v.pause());
  document.addEventListener('play',e=>{
    const v=e.target;
    if(!(v instanceof HTMLVideoElement)||!watch.contains(v)) return;
    const panel=v.closest('.a55-program');
    const r=watch.getBoundingClientRect();
    const watchVisible=r.bottom>0&&r.top<innerHeight;
    if(!panel?.classList.contains('is-active')||!watchVisible) queueMicrotask(()=>v.pause());
  },true);
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting||entry.intersectionRatio<.04) pauseAll();},{threshold:[0,.04,.2]});
    io.observe(watch);
  }
})();
