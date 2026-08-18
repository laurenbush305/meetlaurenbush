(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const watch=document.getElementById('watch');
  if(!watch) return;
  const tuner=watch.querySelector('.a56-tuner');
  const buttons=[...watch.querySelectorAll('[data-a56-tune]')];
  const panels=[...watch.querySelectorAll('.a56-program')];
  const mode=watch.querySelector('#a56-program-mode');
  const nameNode=watch.querySelector('#a56-program-name');
  const meta={
    scrambled:['TELEVISION','SCRAMBLED UP'],
    wimpb:['DAYTIME EXPLAINER',"WHAT'S IN MY PICKLEBALL BAG"],
    finance:['INTELLIGENCE SIGNAL','FINANCE'],
    apq:['COMMERCIAL INTERRUPTION','PICKLEBALL AUNTIE'],
    archive:['ARCHIVE · RETAINED SIGNAL','T.I. & TINY']
  };
  let current=watch.dataset.a56Program||'scrambled';
  let transitioning=false, queued=null, watchVisible=false, preloadStarted=false;

  const panelFor=key=>panels.find(p=>p.dataset.program===key);
  const videoFor=key=>panelFor(key)?.querySelector('video')||null;
  const pauseInactive=()=>{
    panels.forEach(p=>p.querySelectorAll('video').forEach(v=>{
      if(!watchVisible||p.dataset.program!==current) v.pause();
    }));
  };
  const beginPreload=()=>{
    if(preloadStarted) return; preloadStarted=true;
    panels.forEach(p=>p.querySelectorAll('video').forEach(v=>{v.preload='metadata';}));
  };
  const ensureReady=key=>new Promise(resolve=>{
    const v=videoFor(key); if(!v){resolve(true);return}
    v.preload='auto';
    if(v.readyState>=2){resolve(true);return}
    let done=false;
    const finish=ok=>{if(done)return;done=true;v.removeEventListener('canplay',okFn);v.removeEventListener('loadeddata',okFn);v.removeEventListener('error',errFn);resolve(ok)};
    const okFn=()=>finish(true), errFn=()=>finish(false);
    v.addEventListener('canplay',okFn,{once:true});v.addEventListener('loadeddata',okFn,{once:true});v.addEventListener('error',errFn,{once:true});
    try{v.load()}catch(_){finish(false)}
    setTimeout(()=>finish(v.readyState>=2),6000);
  });
  const updateTuner=key=>{
    buttons.forEach(b=>{const on=b.dataset.a56Tune===key;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false')});
    if(innerWidth<=760){const active=buttons.find(b=>b.dataset.a56Tune===key);active?.scrollIntoView({behavior:reduce?'auto':'smooth',inline:'center',block:'nearest'})}
  };
  const swapUnderCover=key=>{
    current=key; watch.dataset.a56Program=key;
    panels.forEach(p=>p.classList.toggle('is-active',p.dataset.program===key));
    updateTuner(key);
    if(mode) mode.textContent=meta[key][0]; if(nameNode) nameNode.textContent=meta[key][1];
    panels.forEach(p=>p.querySelectorAll('video').forEach(v=>{
      if(p.dataset.program===key&&watchVisible&&!reduce){v.play().catch(()=>{})}else v.pause();
    }));
  };
  const cleanTransition=()=>{
    watch.classList.remove('a562-transitioning','is-tuning','a562-open','is-opening');
    delete watch.dataset.a562Target;tuner?.removeAttribute('aria-busy');transitioning=false;pauseInactive();
    if(queued&&queued!==current){const next=queued;queued=null;switchTo(next)}else queued=null;
  };
  const switchTo=async key=>{
    if(!meta[key]||key===current&&!transitioning) return;
    if(transitioning){queued=key;return}
    transitioning=true;tuner?.setAttribute('aria-busy','true');watch.dataset.a562Target=key;
    const ready=await ensureReady(key);
    if(!ready){cleanTransition();return}
    if(reduce){swapUnderCover(key);cleanTransition();return}
    watch.classList.remove('is-tuning','is-opening','a562-open','a562-transitioning');void watch.offsetWidth;
    watch.classList.add('a562-transitioning');
    // Swap only once the designed signal is covering the old program.
    setTimeout(()=>swapUnderCover(key),118);
    setTimeout(()=>{watch.classList.add('a562-open');},142);
    setTimeout(cleanTransition,520);
  };

  // Capture phase suppresses A5.6 donor click handlers so only the buffered A5.6.2 swap runs.
  watch.addEventListener('click',e=>{
    const btn=e.target.closest('[data-a56-tune]'); if(!btn||!watch.contains(btn)) return;
    e.preventDefault();e.stopImmediatePropagation();switchTo(btn.dataset.a56Tune);
  },true);

  // Button semantics already provide keyboard activation; arrow keys make channel stepping faster.
  tuner?.addEventListener('keydown',e=>{
    const btn=e.target.closest('[data-a56-tune]'); if(!btn) return;
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    let i=buttons.indexOf(btn); if(e.key==='ArrowRight')i=(i+1)%buttons.length; if(e.key==='ArrowLeft')i=(i-1+buttons.length)%buttons.length;if(e.key==='Home')i=0;if(e.key==='End')i=buttons.length-1;
    buttons[i].focus(); switchTo(buttons[i].dataset.a56Tune);
  });

  // Prebuffer when Watch approaches, but never play inactive programs.
  if('IntersectionObserver' in window){
    new IntersectionObserver(([entry])=>{
      watchVisible=entry.isIntersecting&&entry.intersectionRatio>.04;
      if(entry.isIntersecting)beginPreload();
      if(!watchVisible)panels.forEach(p=>p.querySelectorAll('video').forEach(v=>v.pause()));
      else{const v=videoFor(current);if(v&&!reduce)v.play().catch(()=>{})}
      pauseInactive();
    },{rootMargin:'35% 0px 35% 0px',threshold:[0,.04,.2]}).observe(watch);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)panels.forEach(p=>p.querySelectorAll('video').forEach(v=>v.pause()));else pauseInactive()});
  window.addEventListener('scroll',pauseInactive,{passive:true});

  // Initial semantic state. Donor visuals remain intact until interaction.
  updateTuner(current); pauseInactive();
})();

// A5.6.2 final Scrambled→Host sequence: fixed network break covers the actual chapter handoff.
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host=document.getElementById('host-command');
  const scrambled=document.getElementById('third-party');
  if(!host||!scrambled||reduce||!('IntersectionObserver' in window)) return;
  const layer=document.createElement('div');layer.id='a562-program-break';layer.setAttribute('aria-hidden','true');layer.innerHTML='<i></i><b></b>';document.body.appendChild(layer);
  let armed=true,busy=false,timer=0;
  const fire=()=>{if(!armed||busy)return;armed=false;busy=true;layer.classList.remove('is-live');void layer.offsetWidth;layer.classList.add('is-live');clearTimeout(timer);timer=setTimeout(()=>{layer.classList.remove('is-live');busy=false},330)};
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.target===scrambled&&e.isIntersecting&&e.intersectionRatio>.08) armed=true;
    if(e.target===host&&e.isIntersecting&&e.boundingClientRect.top>0&&armed) fire();
  }),{threshold:[0,.01,.08,.2]});
  io.observe(scrambled);io.observe(host);
})();
