const $=id=>document.getElementById(id);
let base=localStorage.getItem('cm_api_base')||'', history=[];
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){const box=$('messages');box.querySelectorAll('.msg').forEach(x=>x.remove());history.forEach(m=>{const el=document.createElement('div');el.className='msg';el.innerHTML=`<div class="avatar">${m.role==='user'?'أ':'✦'}</div><div class="bubble">${esc(m.content).replace(/```([\s\S]*?)```/g,(_,c)=>'<pre>'+c+'</pre>')}</div>`;box.appendChild(el)});box.scrollTop=box.scrollHeight}
function baseUrl(v){return v.trim().replace(/\/+$/,'').replace(/\/api\/chat$/i,'')}
function add(role,content){history.push({role,content});render()}
$('settingsBtn').onclick=()=>{$('apiBase').value=base;$('modal').classList.remove('hidden')};
$('close').onclick=()=>$('modal').classList.add('hidden');
$('save').onclick=()=>{base=baseUrl($('apiBase').value);localStorage.setItem('cm_api_base',base);$('status').textContent='تم حفظ الرابط.';$('modal').classList.add('hidden');$('hint').textContent=base?'رابط الخادم محفوظ. تقدر تبدأ المحادثة.':'افتح الإعدادات لإضافة رابط الخادم.'};
document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{$('input').value=b.dataset.p;$('input').focus()});
$('input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('form').requestSubmit()}});
$('form').onsubmit=async e=>{e.preventDefault();const t=$('input').value.trim();if(!t)return;if(!base){$('modal').classList.remove('hidden');$('status').textContent='أضف رابط الخادم المنشور أولًا، وليس رابط Groq المباشر.';return}
add('user',t);$('input').value='';$('send').disabled=true;history.push({role:'assistant',content:'جاري التفكير...'});render();
try{const r=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.slice(0,-1)})});const raw=await r.text();let d;try{d=JSON.parse(raw)}catch{d={error:raw||'استجابة غير مفهومة من الخادم.'}}
if(!r.ok){const detail=typeof d.error==='string'?d.error:(d.error?.message||d.message||`خطأ HTTP ${r.status}`);throw new Error(detail)}
if(typeof d.reply!=='string'||!d.reply.trim())throw new Error('الخادم لم يرجع ردًا نصيًا.');history[history.length-1].content=d.reply
}catch(err){let m=typeof err?.message==='string'?err.message:'خطأ غير معروف';if(m==='Failed to fetch'||m.includes('NetworkError'))m='تعذر الوصول للخادم. راجع الرابط واتصال الإنترنت.';history[history.length-1].content='تعذر الاتصال: '+m}
finally{$('send').disabled=false;render()}};
