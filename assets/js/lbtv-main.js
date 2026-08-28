(()=>{
  const tuner=[...document.querySelectorAll('[data-watch]')];
  const panels=[...document.querySelectorAll('[data-watch-panel]')];
  function selectWatch(id){
    tuner.forEach(btn=>{const active=btn.dataset.watch===id;btn.classList.toggle('active',active);btn.setAttribute('aria-selected',String(active));});
    panels.forEach(panel=>{const active=panel.dataset.watchPanel===id;panel.hidden=!active;if(!active){panel.querySelectorAll('video').forEach(v=>v.pause());}});
  }
  tuner.forEach(btn=>btn.addEventListener('click',()=>selectWatch(btn.dataset.watch)));
  const form=document.querySelector('#booking-form');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const email=form.dataset.email||'hello@meetlaurenbush.com';const subject=`Booking inquiry: ${data.get('project')||'Lauren Bush'}`;const body=[`Name: ${data.get('name')||''}`,`Email: ${data.get('email')||''}`,`Project: ${data.get('project')||''}`,`When + where: ${data.get('when')||''}`,'',`${data.get('brief')||''}`].join('\n');location.href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;});}
  const lazyVideos=[...document.querySelectorAll('video[data-autoplay-on-view]')];
  if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{const v=entry.target;if(entry.isIntersecting){v.play().catch(()=>{});}else{v.pause();}}),{threshold:.35});lazyVideos.forEach(v=>io.observe(v));}
  else{lazyVideos.forEach(v=>v.play().catch(()=>{}));}
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const nav=document.querySelector('.topbar');if(nav)nav.classList.remove('open');}));
})();
