const VER = 'kimac-v6';
const BASE = '/KIMAC-Service-Sheet';
const CORE = [
  BASE+'/',
  BASE+'/index.html',
  BASE+'/login.html',
  BASE+'/history.html',
  BASE+'/form.html',
  BASE+'/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(CORE).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.url.includes('supabase.co')||e.request.url.includes('googleapis')||e.request.url.includes('jsdelivr')||e.request.url.includes('cdnjs')) {
    e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503})));
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        if(res.ok){const c=res.clone();caches.open(VER).then(ca=>ca.put(e.request,c));}
        return res;
      }).catch(()=>caches.match(BASE+'/login.html')))
    );
  }
});
