(() => {
  const styles = [
    ['a59-design', 'assets/css/a59-design-elevation.css'],
    ['a59-polish', 'assets/css/a59-polish-fix.css']
  ];

  styles.forEach(([key, href]) => {
    if (document.querySelector(`link[data-${key}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(`data-${key}`, 'true');
    document.head.appendChild(link);
  });

  const watch = document.querySelector('#watch');
  if (!watch) return;

  const tabs = [...watch.querySelectorAll('[data-watch]')];
  const panels = [...watch.querySelectorAll('[data-watch-panel]')];

  const activate = (name, focus = false) => {
    tabs.forEach(tab => {
      const active = tab.dataset.watch === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });

    panels.forEach(panel => {
      const active = panel.dataset.watchPanel === name;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
      if (!active) panel.querySelectorAll('video').forEach(video => video.pause());
    });

    watch.dataset.program = name;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.watch));
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        activate(tabs[next].dataset.watch, true);
      }
    });
  });

  activate(watch.dataset.program || tabs[0]?.dataset.watch || 'scrambled');
})();
