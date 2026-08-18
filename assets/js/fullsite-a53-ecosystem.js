(() => {
  const videos = [...document.querySelectorAll('video')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pauseAll = () => videos.forEach(v => v.pause());
  if (reduced.matches) { pauseAll(); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, intersectionRatio}) => {
      if (intersectionRatio < 0.08) { target.pause(); return; }
      if (intersectionRatio >= 0.24 && target.muted && (target.autoplay || target.hasAttribute('data-a3-autocue'))) {
        target.play().catch(() => {});
      }
    });
  }, {threshold:[0,0.08,0.24,0.5]});
  videos.forEach(v => observer.observe(v));
  document.addEventListener('play', e => {
    const v = e.target;
    if (!(v instanceof HTMLVideoElement)) return;
    const r = v.getBoundingClientRect();
    const visible = r.bottom > innerHeight * .08 && r.top < innerHeight * .92;
    if (!visible) queueMicrotask(() => v.pause());
  }, true);
  reduced.addEventListener?.('change', e => { if (e.matches) pauseAll(); });
})();
