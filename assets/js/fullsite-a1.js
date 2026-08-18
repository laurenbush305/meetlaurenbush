(()=>{
  const form=document.getElementById('booking-brief');
  if(!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd=new FormData(form);
    const project=(fd.get('project')||'Booking inquiry').toString();
    const subject=`Booking Inquiry — ${project}`;
    const body=[
      `Name: ${fd.get('name')||''}`,
      `Email: ${fd.get('email')||''}`,
      `Project: ${project}`,
      `When + where: ${fd.get('when')||''}`,
      '',
      'What we need Lauren to carry:',
      `${fd.get('brief')||''}`
    ].join('\n');
    const address=form.dataset.email||'hello@meetlaurenbush.com';
    window.location.href=`mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
