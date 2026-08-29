(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep anchor destinations below the fixed navigation, including proof-index
  // jumps to the back half of the page.
  document.querySelectorAll('main > section').forEach(section => {
    section.style.scrollMarginTop = '76px';
  });

  const explainFrame = document.querySelector('.explain-video');
  const explainVideo = explainFrame?.querySelector('video');
  if (explainFrame && explainVideo) {
    const cover = document.createElement('button');
    cover.type = 'button';
    cover.className = 'video-cover';
    cover.setAttribute('aria-label', "Play What's in My Pickleball Bag");
    cover.innerHTML = '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="assets/img/a5103/wimpb-campaign-main-480.jpg" data-srcset="assets/img/a5103/wimpb-campaign-main-360.jpg 360w, assets/img/a5103/wimpb-campaign-main-480.jpg 480w" data-sizes="100vw" data-deferred-proof="true" alt="" decoding="async"><span>Play WIMPB</span>';
    cover.addEventListener('click', () => {
      cover.remove();
      const play = explainVideo.play();
      if (play && typeof play.catch === 'function') play.catch(() => {});
    });
    explainFrame.appendChild(cover);

    // This cover is created after lbtv-back-half.js has registered its static
    // deferred-media set, so hydrate it independently as Explain approaches.
    const coverImage = cover.querySelector('img[data-src]');
    const loadCover = () => {
      if (!coverImage || coverImage.dataset.loaded === 'true') return;
      coverImage.loading = 'eager';
      coverImage.fetchPriority = 'low';
      if (coverImage.dataset.sizes) coverImage.sizes = coverImage.dataset.sizes;
      if (coverImage.dataset.srcset) coverImage.srcset = coverImage.dataset.srcset;
      if (coverImage.dataset.src) coverImage.src = coverImage.dataset.src;
      coverImage.dataset.loaded = 'true';
    };
    if (coverImage) {
      if ('IntersectionObserver' in window) {
        const coverObserver = new IntersectionObserver(entries => {
          if (!entries.some(entry => entry.isIntersecting)) return;
          loadCover();
          coverObserver.disconnect();
        }, { rootMargin: '1000px 0px' });
        coverObserver.observe(explainFrame);
      } else {
        loadCover();
      }
    }
  }

  const proofIndex = document.querySelector('#proof-index');
  const proofPanel = proofIndex?.querySelector('.proof-index-panel');
  const proofTriggers = [...document.querySelectorAll('.proof-index-trigger')];
  const proofClose = proofIndex?.querySelector('.proof-index-close');
  const proofScrim = proofIndex?.querySelector('.proof-index-scrim');
  const proofLinks = [...document.querySelectorAll('[data-proof-close]')];
  let proofReturnFocus = null;

  // Hidden drawer content has no rendered innerText until opened. Give every
  // interactive element an explicit accessible name so assistive tech and QA
  // can identify it even while the drawer is closed.
  proofClose?.setAttribute('aria-label', 'Close Proof / Source Index');
  proofLinks.forEach(link => {
    if (!link.hasAttribute('aria-label')) {
      const label = link.textContent.replace(/\s+/g, ' ').trim();
      if (label) link.setAttribute('aria-label', label);
    }
  });

  const openProof = trigger => {
    if (!proofIndex) return;
    proofReturnFocus = trigger || document.activeElement;
    proofIndex.setAttribute('aria-hidden', 'false');
    proofTriggers.forEach(button => button.setAttribute('aria-expanded', 'true'));
    document.body.classList.add('proof-index-open');
    requestAnimationFrame(() => (proofClose || proofPanel)?.focus());
  };
  const closeProof = ({ restoreFocus = true } = {}) => {
    if (!proofIndex || proofIndex.getAttribute('aria-hidden') === 'true') return;
    proofIndex.setAttribute('aria-hidden', 'true');
    proofTriggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('proof-index-open');
    if (restoreFocus && proofReturnFocus && typeof proofReturnFocus.focus === 'function') proofReturnFocus.focus();
  };
  proofTriggers.forEach(trigger => trigger.addEventListener('click', () => openProof(trigger)));
  proofClose?.addEventListener('click', () => closeProof());
  proofScrim?.addEventListener('click', () => closeProof());
  proofLinks.forEach(link => link.addEventListener('click', () => closeProof({ restoreFocus: false })));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && proofIndex?.getAttribute('aria-hidden') === 'false') closeProof();
  });

  const ambientVideos = [...document.querySelectorAll('video:not([controls])')];
  if (reduceMotion) {
    ambientVideos.forEach(video => video.pause());
  } else if ('IntersectionObserver' in window) {
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

  if (!reduceMotion && 'IntersectionObserver' in window) {
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