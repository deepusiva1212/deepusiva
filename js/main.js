const menu=document.querySelector('.menu'), links=document.querySelector('.nav-links');
menu?.addEventListener('click',()=>links?.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const year=document.querySelector('[data-year]'); if(year) year.textContent=new Date().getFullYear();
const form=document.querySelector('#quoteForm');
form?.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('button[type=submit]');const status=document.querySelector('#formStatus');btn.disabled=true;btn.textContent='Sending…';try{const data=new FormData(form);data.append('access_key','59f7a0e9-fa46-4922-96e1-991f9e6cde5b');data.append('subject','New Deepu Siva website enquiry');data.append('from_name','Deepu Siva Website');const r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data});const j=await r.json();if(j.success){form.reset();status.textContent='Thank you. Your enquiry has been sent successfully.';status.className='notice'}else throw new Error(j.message||'Unable to send')}catch(err){status.textContent='The form could not be sent right now. Please contact us directly on WhatsApp.';status.className='notice'}finally{btn.disabled=false;btn.textContent='Send Project Enquiry'}});
