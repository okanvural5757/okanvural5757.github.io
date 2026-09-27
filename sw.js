const CACHE='mebs-v4718-ui-20260927-rc3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./maskable-icon-512.png','./apple-touch-icon.png','./kkk-logo.png','./mebs-logo.png','./randevu.html','./randevu-qr.svg','./tv-v48.html','./tv-screen-v483.html','./tv-panel-v483.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mebs-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req,{cache:'no-store'}).then(r=>{
        if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}
        return r;
      }).catch(async()=>{
        const exact=await caches.match(req);
        if(exact)return exact;
        if(u.pathname.endsWith('/')||u.pathname.endsWith('/index.html'))return (await caches.match('./index.html'))||(await caches.match('./'));
        return new Response('<!doctype html><meta charset="utf-8"><title>Çevrimdışı</title><style>body{font-family:system-ui;padding:24px;background:#07160d;color:#fff}</style><h2>Bağlantı yok</h2><p>Bu ekran daha önce önbelleğe alınmadı.</p>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});
      })
    );
    return;
  }
  e.respondWith(caches.match(req).then(cached=>{
    const fresh=fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;}).catch(()=>cached);
    return cached||fresh;
  }));
});
