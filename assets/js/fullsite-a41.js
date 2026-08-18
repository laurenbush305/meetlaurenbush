(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Preserve the A4 one-audio-owner system. A4.1 only tightens failure behavior.
  document.querySelectorAll('video').forEach(v=>{
    v.addEventListener('error',()=>{
      v.setAttribute('data-media-failed','true');
      v.pause();
    });
  });
  // If motion is reduced, poster state is the experience; no silent auto-decoding treadmill.
  if(reduce){document.querySelectorAll('[data-a3-autocue]').forEach(v=>{try{v.pause()}catch(e){}})}
})();
