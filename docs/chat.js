(() => {
 const endpoint = window.SITE_CHAT_ENDPOINT || '';
 const pages = window.SITE_CHAT_PAGES || [];
 const host = document.createElement('div');host.id='academic-chat';
 host.innerHTML=`<button class="chat-launch" aria-expanded="false" aria-controls="chat-panel"><img class="chat-avatar" src="profile.webp" alt="" width="40" height="40"><span>Ask me</span></button>
 <section id="chat-panel" aria-label="Website assistant" hidden><div class="chat-heading"><div><strong>Ask me</strong><small>${endpoint?'AI assistant':'Website guide'}</small></div><button class="chat-close" aria-label="Close chat">×</button></div>
 <div class="chat-log" role="log" aria-live="polite" aria-relevant="additions"></div><div class="chat-topics"><button>Research</button><button>Education</button><button>Teaching</button><button>Programming</button></div>
 <form class="chat-form"><label for="chat-question">Your question</label><div><input id="chat-question" maxlength="600" placeholder="Ask about research or teaching…" required autocomplete="off"><button type="submit">Send</button></div></form>
 <p class="chat-note">${endpoint?'AI answers may be inaccurate. Messages are sent to an AI service. Avoid personal or sensitive information.':'Browse answers from this website. AI is not connected yet.'}</p><a class="chat-email" href="mailto:ialjab2@lsu.edu">Contact Ibrahem by email ↗</a></section>`;
 document.body.append(host);
 const panel=host.querySelector('section'),launch=host.querySelector('.chat-launch'),input=host.querySelector('input'),log=host.querySelector('.chat-log'),send=host.querySelector('[type=submit]');
 function message(text,who='assistant',source){const box=document.createElement('div');box.className='chat-message '+who;const p=document.createElement('p');p.textContent=text;box.append(p);if(source){const a=document.createElement('a');a.href=source.url;a.textContent='Read '+source.title+' →';box.append(a);}log.append(box);log.scrollTop=log.scrollHeight;return box;}
 function toggle(open){panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)input.focus();else launch.focus();}
 launch.onclick=()=>toggle(panel.hidden);host.querySelector('.chat-close').onclick=()=>toggle(false);host.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false);});
 message('Hello! I can help you explore Ibrahem’s research, education, teaching, and software. What would you like to know?');
 function localAnswer(q){
 if(/\b(email|contact|collaborat|meeting|join|availability|supervis)\b/i.test(q)){message('For collaboration, supervision, or meeting inquiries, please email Ibrahem at ialjab2@lsu.edu. This guide cannot confirm availability or send messages.');return;}
 const aliases={Collaborators:/collaborator|germany|china|india|canada|\buk\b|\busa\b/i,Research:/research|publication|paper|koopman|topolog|project|neural/i,Education:/education|degree|ph\.?d|thesis|dissertation|minor|master/i,Teaching:/teach|course|class|responsibilit/i,Awards:/award|honor|recognition/i,Conferences:/conference|neurips|siam|workshop/i,Programming:/program|software|python|topox|github|package/i,Home:/biography|who|about|position|role/i};
 const title=Object.keys(aliases).find(t=>aliases[t].test(q));const page=pages.find(p=>p.title===title);
 if(!page){message('I could not match that question to a website topic. Try Research, Education, Teaching, Awards, Conferences, or Programming—or use the email link below.');return;}
 message(page.text.length>1000?page.text.slice(0,1000).replace(/\s+\S*$/,'')+'…':page.text,'assistant',page);
 }
 let busy=false;const history=[];
 async function ask(q){if(busy||!q.trim())return;busy=true;send.disabled=true;message(q,'visitor');input.value='';
 try{if(!endpoint){localAnswer(q);return;}const waiting=message('Looking that up…');try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...history,{role:'user',content:q}].slice(-8)}),signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('Unavailable');const data=await response.json();if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('Empty');waiting.remove();message(data.answer);history.push({role:'user',content:q},{role:'assistant',content:data.answer});if(history.length>8)history.splice(0,history.length-8);}catch{waiting.remove();message('The AI assistant is unavailable right now. Here is help from the website instead.');localAnswer(q);}}
 finally{busy=false;send.disabled=false;}}
 host.querySelector('form').onsubmit=e=>{e.preventDefault();ask(input.value.trim());};host.querySelectorAll('.chat-topics button').forEach(b=>b.onclick=()=>ask(b.textContent));
})();
