(()=>{
  const still=document.querySelector('[data-still-time]');
  if(still){
    const seek=()=>{try{still.currentTime=Number(still.dataset.stillTime||26);still.pause();}catch(e){}};
    if(still.readyState>=1) seek(); else still.addEventListener('loadedmetadata',seek,{once:true});
    still.addEventListener('seeked',()=>still.pause());
  }
  const buttons=[...document.querySelectorAll('.watch-tuner button')];
  const screen=document.querySelector('.watch-program-screen');
  const img=document.querySelector('#watch-program-image');
  const mode=document.querySelector('#watch-program-mode');
  const title=document.querySelector('#watch-program-title');
  const watch=document.querySelector('#watch');
  const themes={tv:['#071012','#ff2f86'],explain:['#081316','#c9f6f4'],host:['#080a0c','#e7b84c'],create:['#100b14','#ddd5ff']};
  function tune(btn){
    buttons.forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});
    if(!img)return;screen?.classList.add('is-tuning');
    setTimeout(()=>{img.src=btn.dataset.image;img.alt=btn.dataset.alt||'';if(mode)mode.textContent=btn.dataset.program.toUpperCase();if(title)title.textContent=btn.dataset.title||'';const t=themes[btn.dataset.program]||themes.tv;if(watch)watch.style.background=`radial-gradient(circle at 70% 31%,${t[1]}22,transparent 34%),${t[0]}`;screen?.classList.remove('is-tuning')},140);
  }
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>tune(b));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();tune(buttons[next]);});});
})();
