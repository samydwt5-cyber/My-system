/* يعمل التطبيق بدون إنترنت: الملفات تُحفظ على الجوال، والتحديثات تصل عند وجود إنترنت */
const V='azzi-v1',FILES=['./','index.html','style.css','app.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url),same=u.origin===location.origin;
  if(same){ // ملفات التطبيق: الإنترنت أولًا ثم النسخة المحفوظة
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }else if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){ // الخطوط: المحفوظ أولًا
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(e.request,c));return n}).catch(()=>r)));
  }
});
