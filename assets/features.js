/* Ad-Deen — ইবাদত ট্যাব: অ্যালার্ম, ছক (দৈনিক/সাপ্তাহিক/মাসিক), কিবলা, বিশেষ দিন, সেটিংস */
var AD_SHARED={};
(function(){
const $=id=>document.getElementById(id),S=store,bn=n=>String(n).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
document.head.insertAdjacentHTML('beforeend',`<style>
.tabbar button{font-size:9.5px}.big-ar{font-size:calc(26px*var(--arz,1))}main{zoom:var(--fz,1)}
body.light{--ink:#f6f1e4;--panel:#fffaf0;--panel2:#efe6d0;--line:rgba(60,45,10,.14);--sand:#2b2416;--sand-dim:#6f6445}
body.light{background:var(--ink)}body.light header,body.light .tabbar{background:rgba(255,250,240,.92)}body.light nav.drawer{background:#fffaf0}
.sw{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)}
.sw:last-child{border:0}.sw .n{font-size:13.5px}.sw .n small{display:block;color:var(--sand-dim);font-size:11px}
.tg{width:44px;height:25px;border-radius:20px;background:var(--panel2);border:1px solid var(--line);position:relative;flex:none}
.tg:after{content:"";position:absolute;top:2px;left:2px;width:19px;height:19px;border-radius:50%;background:var(--sand-dim);transition:.2s}
.tg.on{background:var(--gold)}.tg.on:after{left:21px;background:#141008}
.sel{background:var(--ink);color:var(--sand);border:1px solid var(--line);border-radius:8px;padding:5px;font-size:12px}
#ring{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;padding:24px}
#ring .box{background:var(--panel);border:1px solid var(--gold);border-radius:22px;padding:26px 20px;text-align:center;width:100%;max-width:340px}
#ring .big{font-size:30px;font-weight:800;font-family:"Noto Serif Bengali",serif;color:var(--gold-soft);margin:8px 0 18px}
.cmp{width:200px;height:200px;border-radius:50%;border:2px solid var(--gold);margin:14px auto;position:relative;background:var(--panel)}
.cmp i{position:absolute;left:50%;top:8px;width:0;height:0;margin-left:-11px;border:11px solid transparent;border-bottom:78px solid var(--gold);border-top:0;transform-origin:11px 92px;transition:transform .2s}
.dayrow{display:flex;gap:5px;margin:8px 0}.dayrow div{flex:1;text-align:center;padding:7px 0;border-radius:8px;background:var(--panel2);font-size:11px;color:var(--sand-dim)}.dayrow div.on{background:var(--gold);color:#141008;font-weight:700}
</style>`);
document.body.insertAdjacentHTML('beforeend','<div id="ring"><div class="box"><div style="font-size:42px">🕌</div><div class="big" id="ringT"></div><button class="btn" onclick="AD.stop()">বন্ধ করুন</button><button class="btn ghost" style="margin-top:8px" onclick="AD.snooze()">৫ মিনিট পরে মনে করান</button></div></div>');
document.querySelector('main').insertAdjacentHTML('afterbegin','<section class="view" id="view-ibadah"><div class="sec-h" style="margin-top:6px"><div class="ic">🕌</div><div><h2>ইবাদত</h2><div class="sub">অ্যালার্ম, দৈনিক-সাপ্তাহিক-মাসিক ছক ও আরও</div></div></div><div class="chip-row" id="ibChips"></div><div id="ibBody"></div></section>');
ICO.mosque='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M7 11a5 5 0 0 1 10 0"/><path d="M4 21V11h16v10M10 21v-4a2 2 0 0 1 4 0v4"/></svg>';TABS.splice(3,0,{id:'ibadah',label:'ইবাদত',ic:'mosque'});buildNav();goto('home');

/* ---------- সময় ও হিজরি ---------- */
const locNow=()=>new Date(Date.now()+(userLoc.tz*60+new Date().getTimezoneOffset())*60000);
function hj(date){const o=S.get('hOff',0),d=new Date(date.getFullYear(),date.getMonth(),date.getDate()+o);const gy=d.getFullYear(),gm=d.getMonth()+1,gd=d.getDate(),a=Math.floor((14-gm)/12),yy=gy+4800-a,mm=gm+12*a-3;
const jd=gd+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;let l=jd-1948440+10632;const n=Math.floor((l-1)/10631);l=l-10631*n+354;
const j=Math.floor((10985-l)/5316)*Math.floor((50*l)/17719)+Math.floor(l/5670)*Math.floor((43*l)/15238);l=l-Math.floor((30-j)/15)*Math.floor((17719*j)/50)-Math.floor(j/16)*Math.floor((15238*j)/43)+29;const m=Math.floor((24*l)/709);return[30*n+j-30,m,l-Math.floor((709*m)/24)];}
function times(d){const t=PrayerCalc.calc(d,userLoc.lat,userLoc.lng,userLoc.tz),nt=(t.maghrib!=null&&t.fajr!=null)?(t.fajr+24-t.maghrib)%24:null;
t.ishraq=t.sunrise+.25;t.chasht=(t.sunrise+t.dhuhr)/2;t.awwabin=t.maghrib+.25;t.tahajjud=nt?(t.maghrib+nt*2/3)%24:null;t.jumuah=t.dhuhr-.75;return t;}
const ALM=[['fajr','ফজর (আযান)'],['sunrise','সূর্যোদয় — ফজরের সময় শেষ'],['ishraq','ইশরাক'],['chasht','চাশত'],['dhuhr','যোহর (আযান)'],['jumuah','জুমার প্রস্তুতি (শুক্রবার)'],['asr','আসর (আযান)'],['maghrib','মাগরিব (আযান)'],['awwabin','আওয়াবিন'],['isha','ইশা (আযান)'],['tahajjud','তাহাজ্জুদ (রাতের শেষ ১/৩)']];
window.AD_S={bn,times,ALM,locNow};
const DN=['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'];

/* ---------- অ্যালার্ম ইঞ্জিন ---------- */
let ac,stopT,au;const cfg=()=>S.get('alm',{a:{},c:[],vol:.8,vib:true,snd:null});
function chime(){const c=cfg();try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();let t=ac.currentTime;
for(let r=0;r<12;r++)[523,659,784,659,880,784].forEach(f=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(ac.destination);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(c.vol*.5,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+.7);o.start(t);o.stop(t+.75);t+=.6;});}catch(e){}}
function ring(title,body){const c=cfg();$('ringT').textContent=title;$('ring').style.display='flex';
if(c.snd){try{au=new Audio(c.snd);au.volume=c.vol;au.play().catch(chime);}catch(e){chime();}}else chime();
if(c.vib&&navigator.vibrate)navigator.vibrate([400,200,400,200,400]);
if('Notification' in window&&Notification.permission==='granted'){const o={body:body||'আল্লাহর স্মরণের সময়',icon:'./icon-192.png',tag:title,requireInteraction:true,vibrate:[300,150,300]};
navigator.serviceWorker&&navigator.serviceWorker.getRegistration().then(r=>r?r.showNotification('Ad-Deen — '+title,o):new Notification(title,o)).catch(()=>{});}
clearTimeout(stopT);stopT=setTimeout(AD.stop,90000);}
window.AD={stop(){$('ring').style.display='none';clearTimeout(stopT);try{ac&&ac.close();ac=null;}catch(e){}if(au){au.pause();au=null;}navigator.vibrate&&navigator.vibrate(0);},
snooze(){const d=new Date(Date.now()+300000),c=cfg();c.c.push({id:Date.now(),label:'স্নুজ রিমাইন্ডার',time:('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2),rep:'once',on:true});S.set('alm',c);AD.stop();},
test(){ring('পরীক্ষামূলক অ্যালার্ম','সাউন্ড ঠিক আছে কিনা দেখুন');}};
function tick(){const c=cfg(),n=locNow(),dk=dateKey(n),nm=n.getHours()*60+n.getMinutes(),fired=S.get('fired',{});let ch=false;
const fire=(k,t,b)=>{if(fired[dk+k])return;fired[dk+k]=1;ch=true;ring(t,b);};
const t=times(n);ALM.forEach(([k,l])=>{const a=c.a[k];if(!a||!a.on||t[k]==null)return;if(k==='jumuah'&&n.getDay()!==5)return;
const tm=Math.round(t[k]*60+(a.off||0));if(nm>=tm&&nm<tm+3)fire(k,l.replace(/ \(.*\)/,'')+(a.off?' — '+bn(-a.off)+' মিনিট পর/আগে':' — সময় হয়েছে'));});
const [,,hd]=hj(n);c.c.forEach(x=>{if(!x.on)return;const[h,m]=x.time.split(':').map(Number),tm=h*60+m;if(!(nm>=tm&&nm<tm+3))return;
if(x.rep==='weekly'&&!(x.days||[]).includes(n.getDay()))return;if(x.rep==='monthly'&&n.getDate()!==+x.dom)return;if(x.rep==='hijri'&&hd!==+x.dom)return;
fire('c'+x.id,x.label,'আপনার সেট করা রিমাইন্ডার');if(x.rep==='once'&&fired[dk+'c'+x.id])x.on=false,S.set('alm',c);});
if(ch){Object.keys(fired).forEach(k=>{if(!k.startsWith(dk))delete fired[k];});S.set('fired',fired);}}
setInterval(tick,15000);tick();document.addEventListener('visibilitychange',()=>!document.hidden&&tick());

/* ---------- ছক ডেটা ---------- */
const PLAN={daily:['ফজর জামায়াতে','সকালের জিকির','ইশরাক ২ রাকাত','চাশত ২-৮ রাকাত','যোহর ও সুন্নাত','আসর','মাগরিব ও সুন্নাত','আওয়াবিন ৬ রাকাত','ইশা ও সুন্নাত','বিতর','কুরআন তিলাওয়াত (অন্তত ১ পৃষ্ঠা)','দরূদ ১০০ বার','ইস্তিগফার ১০০ বার','সন্ধ্যার জিকির','আয়াতুল কুরসি ও ৩ কুল (ঘুমের আগে)','অল্প হলেও সদকা','মা-বাবার জন্য দোয়া','মিসওয়াক'],
weekly:['শুক্রবার: গোসল ও আগেভাগে মসজিদে যাওয়া','সূরা কাহফ তিলাওয়াত','জুমার দিনে বেশি দরূদ','সোমবারের রোজা','বৃহস্পতিবারের রোজা','কমপক্ষে ২ দিন তাহাজ্জুদ','পরিবারের সাথে দ্বীনি আলোচনা','আত্মীয়ের খোঁজ নেওয়া','একটি হাদিস শেখা','একজন প্রতিবেশীকে হাদিয়া/সাহায্য','ঘর-পোশাক পরিচ্ছন্নতা','সাপ্তাহিক মুহাসাবা'],
monthly:['আইয়ামে বীজের রোজা (হিজরি ১৩-১৫)','কুরআনের মাসিক লক্ষ্য','মাসিক মুহাসাবা','কাযা নামাযের লক্ষ্য','সম্পদ ও যাকাতের হিসাব দেখা','অভাবীকে নিয়মিত সাহায্য','কবর যিয়ারত','নতুন একটি সুন্নাত শেখা','ইসলামিক বই পড়া','দোয়া-আজকার রিভিউ']};
const PK={daily:()=>dateKey(locNow()),weekly:()=>weekKey(),monthly:()=>{const d=locNow();return d.getFullYear()+'-'+(d.getMonth()+1);}},PL={daily:'দৈনিক',weekly:'সাপ্তাহিক',monthly:'মাসিক'};
const getP=t=>{const p=S.get('plan_'+t,{});return p.k===PK[t]()?p.d:{};};
window.AD.pt=(t,i,el)=>{const d=getP(t);d[i]=!d[i];S.set('plan_'+t,{k:PK[t](),d});ib('plan',t);};

/* ---------- ভিউ ---------- */
const TABS2=[['alarm','⏰ অ্যালার্ম'],['plan','✅ ইবাদত ছক'],['qibla','🧭 কিবলা'],['days','📅 বিশেষ দিন'],['set','⚙️ সেটিংস']];
$('ibChips').innerHTML=TABS2.map(([k,l])=>`<div class="chip" data-k="${k}" onclick="AD.ib('${k}')">${l}</div>`).join('');
const tg=(on,fn)=>`<div class="tg ${on?'on':''}" onclick="${fn}"></div>`;
function ib(k,sub){k=k||S.get('ibTab','alarm');S.set('ibTab',k);document.querySelectorAll('#ibChips .chip').forEach(c=>c.classList.toggle('active',c.dataset.k===k));$('ibBody').innerHTML=V[k](sub);}
window.AD.ib=ib;
const V={
alarm(){const c=cfg(),t=times(locNow());return `<div class="card"><div style="font-size:12px;color:var(--sand-dim);line-height:1.7">⚠️ অ্যালার্ম বাজার জন্য অ্যাপ/ব্রাউজার খোলা থাকতে হবে (ব্যাকগ্রাউন্ডে থাকলেও চলে, কিন্তু ফোন/ব্রাউজার বন্ধ করলে ওয়েব অ্যাপ বাজাতে পারে না)। নোটিফিকেশন চালু করুন এবং "স্ক্রিন জাগিয়ে রাখুন" ব্যবহার করুন — সেটিংসে আছে।</div>
<div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" onclick="AD.test()">🔊 পরীক্ষা করুন</button><button class="btn sm ghost" onclick="AD.notif()">🔔 নোটিফিকেশন চালু</button></div></div>
<div class="card"><h3 style="margin-bottom:6px">ওয়াক্তের অ্যালার্ম</h3>`+ALM.map(([k,l])=>{const a=c.a[k]||{on:false,off:0};return `<div class="sw"><div class="n">${l}<small>${t[k]!=null?PrayerCalc.fmt(t[k]):'—'}</small></div><div style="display:flex;gap:8px;align-items:center"><select class="sel" onchange="AD.off('${k}',this.value)">${[[-30,'৩০ মি আগে'],[-15,'১৫ মি আগে'],[-10,'১০ মি আগে'],[-5,'৫ মি আগে'],[0,'ঠিক সময়ে'],[5,'৫ মি পরে'],[10,'১০ মি পরে']].map(o=>`<option value="${o[0]}" ${(a.off||0)==o[0]?'selected':''}>${o[1]}</option>`).join('')}</select>${tg(a.on,`AD.al('${k}')`)}</div></div>`;}).join('')+`</div>
<div class="card"><h3 style="margin-bottom:8px">নিজের অ্যালার্ম (দৈনিক / সাপ্তাহিক / মাসিক)</h3><input class="field" id="cLabel" placeholder="নাম (যেমন: তাহাজ্জুদ, সূরা কাহফ)"><div class="row"><input class="field" id="cTime" type="time" value="05:00"><select class="field" id="cRep" onchange="AD.rep()"><option value="daily">প্রতিদিন</option><option value="weekly">সাপ্তাহিক</option><option value="monthly">মাসিক (ইংরেজি তারিখ)</option><option value="hijri">মাসিক (হিজরি তারিখ)</option><option value="once">একবার</option></select></div>
<div id="cExtra"></div><button class="btn" onclick="AD.addC()">অ্যালার্ম যোগ করুন</button></div>`+(c.c.length?c.c.map((x,i)=>`<div class="card"><div class="sw" style="border:0;padding:0"><div class="n"><b>${esc(x.label)}</b><small>${x.time} • ${{daily:'প্রতিদিন',weekly:(x.days||[]).map(d=>DN[d]).join(' '),monthly:'প্রতি মাসের '+bn(x.dom)+' তারিখ',hijri:'প্রতি হিজরি মাসের '+bn(x.dom)+' তারিখ',once:'একবার'}[x.rep]}</small></div><div style="display:flex;gap:8px;align-items:center">${tg(x.on,`AD.tc(${i})`)}<button class="btn sm ghost" onclick="AD.dc(${i})">✕</button></div></div></div>`).join(''):'');},
plan(t){t=t||S.get('planT','daily');S.set('planT',t);const d=getP(t),n=PLAN[t].length,done=Object.values(d).filter(Boolean).length;
return `<div class="section-toggle">${Object.keys(PL).map(k=>`<button class="${k===t?'active':''}" onclick="AD.ib('plan','${k}')">${PL[k]}</button>`).join('')}</div><div class="card"><div style="display:flex;justify-content:space-between;font-size:13px"><b>${PL[t]} অগ্রগতি</b><span>${bn(done)}/${bn(n)}</span></div><div class="progress-bar"><div style="width:${done/n*100}%"></div></div>${done===n?'<div style="text-align:center;color:var(--gold-soft);font-size:13px">মাশাআল্লাহ! সব সম্পন্ন 🎉</div>':''}</div><div class="card">`+PLAN[t].map((s,i)=>`<div class="list-item"><div class="check ${d[i]?'on':''}" onclick="AD.pt('${t}',${i})">${d[i]?ic('check'):''}</div><div class="body"><div class="t">${s}</div></div></div>`).join('')+'</div>';},
qibla(){const R=Math.PI/180,k=[21.4225,39.8262],l1=userLoc.lat*R,l2=k[0]*R,dl=(k[1]-userLoc.lng)*R,b=((Math.atan2(Math.sin(dl)*Math.cos(l2),Math.cos(l1)*Math.sin(l2)-Math.sin(l1)*Math.cos(l2)*Math.cos(dl))/R)+360)%360;window.AD.qb=b;
return `<div class="card" style="text-align:center"><div style="font-size:13px;color:var(--sand-dim)">${esc(userLoc.label)} থেকে কিবলা</div><div class="result-box"><div class="n">${bn(b.toFixed(1))}°</div><div class="l">উত্তর থেকে ঘড়ির কাঁটার দিকে</div></div><div class="cmp"><i id="qArrow" style="transform:rotate(${b}deg)"></i></div><div id="qHint" style="font-size:12px;color:var(--sand-dim);line-height:1.7">ফোনের কম্পাস চালু করলে তীর কিবলার দিকে ঘুরবে। ধাতব বস্তু থেকে দূরে রাখুন; সন্দেহ হলে মসজিদ/কম্পাসে মিলিয়ে নিন।</div><button class="btn sm" style="margin-top:10px" onclick="AD.compass()">কম্পাস চালু করুন</button></div>`;},
days(){const n=locNow(),ev=[[1,1,'হিজরি নববর্ষ'],[1,10,'আশুরা (৯-১০ বা ১০-১১ রোজা)'],[9,1,'রমজানের শুরু'],[9,21,'লাইলাতুল কদর তালাশ (শেষ ১০ রাত)'],[10,1,'ঈদুল ফিতর'],[10,2,'শাওয়ালের ৬ রোজা শুরু'],[12,9,'আরাফার দিন (রোজা)'],[12,10,'ঈদুল আযহা'],[0,13,'আইয়ামে বীজ রোজা শুরু (প্রতি মাস)']],out=[];
ev.forEach(e=>{for(let i=0;i<400;i++){const d=new Date(n.getFullYear(),n.getMonth(),n.getDate()+i),h=hj(d);if(h[2]===e[1]&&(e[0]===0||h[1]===e[0])){out.push([i,e[2],d]);break;}}});out.sort((a,b)=>a[0]-b[0]);
return `<div class="card"><div style="font-size:12px;color:var(--sand-dim);line-height:1.7">তারিখগুলো আনুমানিক হিজরি হিসাব; চাঁদ দেখার ওপর ১-২ দিন এদিক-ওদিক হতে পারে। সেটিংসে হিজরি তারিখ ±১-২ দিন মিলিয়ে নিন।</div></div><div class="card">`+out.map(([i,t,d])=>`<div class="list-item"><div class="ic">📅</div><div class="body"><div class="t">${t}</div><div class="d">${d.toLocaleDateString('bn-BD',{weekday:'long',day:'numeric',month:'long'})} — ${i?'আর '+bn(i)+' দিন':'আজ'}</div></div></div>`).join('')+'</div>';},
set(){const c=cfg(),th=S.get('theme',{});return `<div class="card"><h3 style="margin-bottom:6px">চেহারা</h3><div class="sw"><div class="n">হালকা মোড</div>${tg(th.light,"AD.th('light')")}</div>
<div class="sw"><div class="n">রঙ</div><div style="display:flex;gap:8px">${[['#C9A24B','#e4c883'],['#3fae8b','#7fd6b8'],['#4a9ad8','#8cc4ee'],['#d8668a','#f0a2bc']].map(a=>`<div onclick="AD.col('${a[0]}','${a[1]}')" style="width:26px;height:26px;border-radius:50%;background:${a[0]}"></div>`).join('')}</div></div>
<div class="sw"><div class="n">লেখার সাইজ</div><input type="range" min="0.9" max="1.3" step="0.05" value="${th.fz||1}" oninput="AD.fz(this.value)"></div><div class="sw"><div class="n">আরবি লেখার সাইজ</div><input type="range" min="0.8" max="1.6" step="0.1" value="${th.arz||1}" oninput="AD.arz(this.value)"></div></div>
<div class="card"><h3 style="margin-bottom:6px">অ্যালার্ম সেটিংস</h3><div class="sw"><div class="n">ভলিউম</div><input type="range" min="0.1" max="1" step="0.1" value="${c.vol}" onchange="AD.vol(this.value)"></div><div class="sw"><div class="n">কম্পন (ভাইব্রেশন)</div>${tg(c.vib,'AD.vib()')}</div>
<div class="sw"><div class="n">স্ক্রিন জাগিয়ে রাখুন<small>অ্যালার্ম বাজাতে সাহায্য করে (ব্যাটারি বেশি খরচ)</small></div>${tg(window.AD.wl,'AD.wake()')}</div>
<div class="sw"><div class="n">নিজের আযান/সাউন্ড (সর্বোচ্চ ২ MB)<small>${c.snd?'নিজের ফাইল সেট আছে':'ডিফল্ট চাইম ব্যবহার হচ্ছে'}</small></div><label class="btn sm ghost" style="width:auto">ফাইল<input type="file" accept="audio/*" hidden onchange="AD.file(this)"></label></div>${c.snd?'<button class="btn sm ghost" onclick="AD.nofile()">ডিফল্টে ফিরুন</button>':''}</div>
<div class="card"><h3 style="margin-bottom:6px">ডেটা ও সময়</h3><div class="sw"><div class="n">হিজরি তারিখ সমন্বয়</div><select class="sel" onchange="AD.hoff(this.value)">${[-2,-1,0,1,2].map(v=>`<option value="${v}" ${S.get('hOff',0)==v?'selected':''}>${v>0?'+':''}${bn(v)} দিন</option>`).join('')}</select></div>
<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn sm" onclick="AD.exp()">⬇️ ব্যাকআপ</button><label class="btn sm ghost" style="width:auto">⬆️ রিস্টোর<input type="file" accept=".json" hidden onchange="AD.imp(this)"></label><button class="btn sm ghost" id="instBtn" onclick="AD.inst()">📲 ইনস্টল করুন</button></div></div>`;}};
/* ---------- অ্যাকশন ---------- */
const up=f=>{const c=cfg();f(c);S.set('alm',c);};
Object.assign(AD,{ib,al:k=>{up(c=>{c.a[k]=c.a[k]||{on:false,off:0};c.a[k].on=!c.a[k].on;if(c.a[k].on)AD.notif();});ib('alarm');},off:(k,v)=>up(c=>{c.a[k]=c.a[k]||{on:false};c.a[k].off=+v;}),
rep(){const r=$('cRep').value;$('cExtra').innerHTML=r==='weekly'?`<div class="dayrow" id="cDays">${DN.map((d,i)=>`<div onclick="this.classList.toggle('on')" data-d="${i}">${d}</div>`).join('')}</div>`:(r==='monthly'||r==='hijri')?'<input class="field" id="cDom" type="number" min="1" max="30" placeholder="তারিখ (১-৩০)">':'';},
addC(){const l=$('cLabel').value.trim()||'রিমাইন্ডার',r=$('cRep').value,x={id:Date.now(),label:l,time:$('cTime').value||'05:00',rep:r,on:true};
if(r==='weekly'){x.days=[...document.querySelectorAll('#cDays .on')].map(e=>+e.dataset.d);if(!x.days.length)return alert('কমপক্ষে একটি দিন বেছে নিন');}
if(r==='monthly'||r==='hijri'){x.dom=+$('cDom').value;if(!(x.dom>=1&&x.dom<=31))return alert('সঠিক তারিখ দিন');}up(c=>c.c.push(x));AD.notif();ib('alarm');},
tc:i=>{up(c=>c.c[i].on=!c.c[i].on);ib('alarm');},dc:i=>{up(c=>c.c.splice(i,1));ib('alarm');},
notif(){if('Notification' in window&&Notification.permission==='default')Notification.requestPermission();},
vol:v=>up(c=>c.vol=+v),vib:()=>{up(c=>c.vib=!c.vib);ib('set');},
async wake(){try{if(AD.wl){await AD.wl.release();AD.wl=null;}else AD.wl=await navigator.wakeLock.request('screen');}catch(e){alert('এই ডিভাইসে সাপোর্ট নেই');}ib('set');},
file(el){const f=el.files[0];if(!f)return;if(f.size>2e6)return alert('ফাইল ২ MB-এর বেশি');const r=new FileReader();r.onload=()=>{up(c=>c.snd=r.result);ib('set');};r.readAsDataURL(f);},nofile:()=>{up(c=>c.snd=null);ib('set');},
th(k){const t=S.get('theme',{});t[k]=!t[k];S.set('theme',t);apply();ib('set');},col(a,b){const t=S.get('theme',{});t.g=a;t.gs=b;S.set('theme',t);apply();},fz(v){const t=S.get('theme',{});t.fz=+v;S.set('theme',t);apply();},arz(v){const t=S.get('theme',{});t.arz=+v;S.set('theme',t);apply();},
hoff(v){S.set('hOff',+v);renderHome();},
exp(){const o={};Object.keys(localStorage).filter(k=>k.startsWith('addeen_')).forEach(k=>o[k]=localStorage.getItem(k));const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.download='ad-deen-backup-'+dateKey(new Date())+'.json';a.click();},
imp(el){const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);Object.keys(o).filter(k=>k.startsWith('addeen_')).forEach(k=>localStorage.setItem(k,o[k]));alert('রিস্টোর সম্পন্ন');location.reload();}catch(e){alert('ফাইলটি সঠিক নয়');}};r.readAsText(f);},
inst(){if(window._ip){_ip.prompt();}else alert('ব্রাউজার মেনু থেকে "Add to Home screen / হোম স্ক্রিনে যোগ করুন" বেছে নিন');},
async compass(){try{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission){if(await DeviceOrientationEvent.requestPermission()!=='granted')return;}
const h=e=>{const hd=e.webkitCompassHeading!=null?e.webkitCompassHeading:(e.alpha!=null?(360-e.alpha)%360:null);if(hd==null)return;const a=$('qArrow');if(a)a.style.transform=`rotate(${AD.qb-hd}deg)`;else removeEventListener('deviceorientationabsolute',h),removeEventListener('deviceorientation',h);};
addEventListener('deviceorientationabsolute',h);addEventListener('deviceorientation',h);$('qHint').textContent='ফোন সমতলভাবে ধরুন; তীর যেদিকে, সেটাই কিবলা।';}catch(e){alert('কম্পাস সেন্সর পাওয়া যায়নি');}}});
addEventListener('beforeinstallprompt',e=>{e.preventDefault();window._ip=e;});
function apply(){const t=S.get('theme',{}),s=document.documentElement.style;document.body.classList.toggle('light',!!t.light);if(t.g){s.setProperty('--gold',t.g);s.setProperty('--gold-soft',t.gs);}s.setProperty('--fz',t.fz||1);s.setProperty('--arz',t.arz||1);}
apply();const _g=goto;window.goto=function(id){_g(id);if(id==='ibadah')ib();};
})();
/* ---------- ডিজাইন পালিশ ও "পরবর্তী অ্যালার্ম" কার্ড ---------- */
(function(){const $=id=>document.getElementById(id),{bn,times,ALM,locNow}=window.AD_S;
document.head.insertAdjacentHTML('beforeend',`<style>
:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.card,.tile{box-shadow:0 2px 14px rgba(0,0,0,.18)}
.tile{background:linear-gradient(160deg,var(--panel),var(--panel2))}
.tile:hover{border-color:color-mix(in srgb,var(--gold) 55%,transparent)}
.hero{box-shadow:0 8px 28px rgba(0,0,0,.28)}
.tabbar button{min-height:48px;position:relative}
.tabbar button.active:before{content:"";position:absolute;top:-6px;left:30%;right:30%;height:3px;border-radius:3px;background:var(--gold)}
.btn,.chip,.drawer-item,.tg{min-height:40px;cursor:pointer}.tg{min-height:25px}
.big-ar{text-shadow:0 0 18px color-mix(in srgb,var(--gold) 22%,transparent)}
#nxA{display:flex;align-items:center;gap:12px}#nxA .e{font-size:26px}#nxA b{font-size:14px}#nxA small{display:block;color:var(--sand-dim);font-size:11.5px;margin-top:2px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>`);
$('heroBox').insertAdjacentHTML('afterend','<div class="card" id="nxA" onclick="goto(\'ibadah\');AD.ib(\'alarm\')" style="cursor:pointer"></div>');
function nx(){const c=store.get('alm',{a:{},c:[]}),n=locNow(),t=times(n),nm=n.getHours()*60+n.getMinutes(),L=[];
ALM.forEach(([k,l])=>{const a=c.a[k];if(!a||!a.on||t[k]==null||(k==='jumuah'&&n.getDay()!==5))return;L.push([Math.round(t[k]*60+(a.off||0)),l.replace(/ \(.*\)/,'')]);});
(c.c||[]).forEach(x=>{if(!x.on||x.rep==='monthly'||x.rep==='hijri'||(x.rep==='weekly'&&!(x.days||[]).includes(n.getDay())))return;const[h,m]=x.time.split(':').map(Number);L.push([h*60+m,x.label]);});
const f=L.filter(e=>e[0]>nm).sort((a,b)=>a[0]-b[0])[0],el=$('nxA');
el.innerHTML=f?`<div class="e">⏰</div><div><b>পরবর্তী অ্যালার্ম: ${f[1]}</b><small>আর ${bn(Math.floor((f[0]-nm)/60))} ঘণ্টা ${bn((f[0]-nm)%60)} মিনিট • অ্যাপ খোলা রাখুন</small></div>`:`<div class="e">🔕</div><div><b>আজ আর কোনো অ্যালার্ম সেট নেই</b><small>ইবাদত ট্যাবে আযান অ্যালার্ম চালু করুন</small></div>`;}
nx();setInterval(nx,30000);})();
