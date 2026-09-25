/* DANTAKAVACHA offline support: the app and its QR reader are kept on the phone after the first visit */
const CACHE='dantakavacha-202609250835';
const CORE=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
const JSQR='https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).then(()=>fetch(JSQR,{mode:'no-cors'}).then(r=>c.put(JSQR,r)).catch(()=>0))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r.url).then(m=>m||fetch(r).then(res=>{if(r.url===JSQR||new URL(r.url).origin===location.origin){const c=res.clone();caches.open(CACHE).then(x=>x.put(r.url,c))}return res})))});
