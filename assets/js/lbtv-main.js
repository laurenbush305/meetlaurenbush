(() => {
  const ambientVideos = [...document.querySelectorAll('video:not([controls])')];
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
          const play = video.play();
          if (play && typeof play.catch === 'function') play.catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: [0, .18, .45] });
    ambientVideos.forEach(video => videoObserver.observe(video));
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main > section:not(.hero)')];
    sections.forEach(section => section.dataset.entered = 'false');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dataset.entered = 'true';
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -8%' });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();