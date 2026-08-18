(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ident=document.getElementById('a56-ident');
  if(ident){
    if(reduce){ident.classList.add('is-gone')} else {
      const force=new URLSearchParams(location.search).get('ident')==='1';
      const delay=force?900:820;
      const dismiss=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>ident.classList.add('is-gone'),delay)));
      if(document.readyState==='complete') dismiss(); else window.addEventListener('load',dismiss,{once:true});
    }
  }

  // Play only cinematic motion that is actually on screen.
  const sceneVideos=[...document.querySelectorAll('.a56-thinking-stage video,.a56-host-talent video')];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      const v=e.target;
      if(reduce){v.pause();return}
      if(e.isIntersecting&&e.intersectionRatio>.14) v.play().catch(()=>{}); else v.pause();
    }),{threshold:[0,.14,.45]});
    sceneVideos.forEach(v=>io.observe(v));
  }

  // Scrambled -> Host: one short signal death, then hard cut into the real room.
  const host=document.getElementById('host-command');
  const scrambled=document.getElementById('third-party');
  if(host&&scrambled&&'IntersectionObserver' in window&&!reduce){
    let armed=true;
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.target===scrambled&&e.isIntersecting) armed=true;
      if(e.target===host&&e.isIntersecting&&armed){
        armed=false;host.classList.remove('a56-signal-in');void host.offsetWidth;host.classList.add('a56-signal-in');
        setTimeout(()=>host.classList.remove('a56-signal-in'),240);
      }
    }),{threshold:.05});
    io.observe(scrambled);io.observe(host);
  }

  const watch=document.getElementById('watch');
  if(watch){
    const buttons=[...watch.querySelectorAll('[data-a56-tune]')];
    const panels=[...watch.querySelectorAll('.a56-program')];
    const opener=watch.querySelector('.a56-program-open');
    const mode=watch.querySelector('#a56-program-mode');
    const nameNode=watch.querySelector('#a56-program-name');
    const meta={
      scrambled:['TELEVISION','SCRAMBLED UP'],
      wimpb:['DAYTIME EXPLAINER',"WHAT'S IN MY PICKLEBALL BAG"],
      finance:['INTELLIGENCE ARCHIVE','FINANCE'],
      apq:['COMMERCIAL INTERRUPTION','PICKLEBALL AUNTIE'],
      archive:['ARCHIVE · 2019','T.I. & TINY']
    };
    let tuneTimer,openTimer,watchVisible=false;
    const pauseWatch=()=>panels.forEach(p=>p.querySelectorAll('video').forEach(v=>v.pause()));
    const syncVideo=()=>{
      panels.forEach(p=>{
        const v=p.querySelector('video'); if(!v) return;
        if(p.classList.contains('is-active')&&watchVisible&&!reduce) v.play().catch(()=>{}); else v.pause();
      });
    };
    const tune=(key,showOpen=true)=>{
      watch.dataset.a56Program=key;
      buttons.forEach(b=>{const on=b.dataset.a56Tune===key;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false')});
      panels.forEach(p=>p.classList.toggle('is-active',p.dataset.program===key));
      if(mode) mode.textContent=meta[key][0]; if(nameNode) nameNode.textContent=meta[key][1];
      if(!reduce){
        watch.classList.remove('is-tuning');void watch.offsetWidth;watch.classList.add('is-tuning');
        clearTimeout(tuneTimer);tuneTimer=setTimeout(()=>watch.classList.remove('is-tuning'),210);
        if(showOpen){watch.classList.remove('is-opening');void watch.offsetWidth;watch.classList.add('is-opening');clearTimeout(openTimer);openTimer=setTimeout(()=>watch.classList.remove('is-opening'),780)}
      }
      syncVideo();
    };
    buttons.forEach(b=>b.addEventListener('click',()=>tune(b.dataset.a56Tune,true)));
    tune('scrambled',false);
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(([entry])=>{watchVisible=entry.isIntersecting&&entry.intersectionRatio>.05;if(!watchVisible)pauseWatch();else syncVideo();},{threshold:[0,.05,.2]});
      io.observe(watch);
    }
    document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseWatch();else syncVideo()});
  }
})();

// A5.6 final media lock: donor autocue code cannot revive inactive/offscreen Watch media.
(()=>{
  const watch=document.getElementById('watch');
  if(!watch) return;
  const vids=[...watch.querySelectorAll('video')];
  const visible=()=>{const r=watch.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight};
  const enforce=()=>vids.forEach(v=>{const p=v.closest('.a56-program');if(!visible()||!p?.classList.contains('is-active'))v.pause()});
  document.addEventListener('play',e=>{const v=e.target;if(v instanceof HTMLVideoElement&&watch.contains(v))queueMicrotask(enforce)},true);
  if('IntersectionObserver' in window){new IntersectionObserver(([e])=>{if(!e.isIntersecting||e.intersectionRatio<.04)vids.forEach(v=>v.pause())},{threshold:[0,.04,.2]}).observe(watch)}
  window.addEventListener('scroll',enforce,{passive:true});
})();
