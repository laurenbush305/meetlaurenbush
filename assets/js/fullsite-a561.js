(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const watch=document.getElementById('watch');
  if(watch){
    // Keep active tuning marker centered on mobile and make each lock feel physical.
    const buttons=[...watch.querySelectorAll('[data-a56-tune]')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      if(innerWidth<=760) btn.scrollIntoView({behavior:reduce?'auto':'smooth',inline:'center',block:'nearest'});
    }));
  }
  // Tiny operator LEDs breathe only while Trust is on screen; they are information, not decoration.
  const trust=document.getElementById('about');
  const dots=trust?.querySelector('.a561-operator-dots');
  if(trust&&dots&&!reduce&&'IntersectionObserver' in window){
    new IntersectionObserver(([e])=>dots.classList.toggle('is-live',e.isIntersecting&&e.intersectionRatio>.2),{threshold:[0,.2,.5]}).observe(trust);
  }
})();
