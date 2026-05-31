const CACHE_NAME = 'firogist-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/css/style.css',
    '/js/main.js',
    '/js/about.js',
    '/js/ntfy.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100;14..32,200;14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    console.log('✅ Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('❌ Cache addAll failed:', err);
            })
    );
    self.skipWaiting();
});

// تنشيط Service Worker
self.addEventListener('activate', event => {
    console.log('✅ Service Worker activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// التعامل مع طلبات الشبكة
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إرجاع الملف من cache إذا وجد
                if (response) {
                    console.log('📄 From cache:', event.request.url);
                    return response;
                }
                
                // إذا لم يوجد في cache، جلب من الشبكة
                console.log('🌐 From network:', event.request.url);
                return fetch(event.request).then(response => {
                    // التحقق من صحة الرد
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // تخزين الملف الجديد في cache
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // صفحة الخطأ في حالة عدم الاتصال بالإنترنت
                if (event.request.url.includes('/index.html') || event.request.url === '/') {
                    return caches.match('/index.html');
                }
                if (event.request.url.includes('/about.html')) {
                    return caches.match('/about.html');
                }
                return new Response('⚠️ لا يوجد اتصال بالإنترنت', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

// التعامل مع الرسائل
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

// تحديث الـ cache بشكل دوري
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-cache') {
        event.waitUntil(updateCache());
    }
});

function updateCache() {
    return caches.open(CACHE_NAME).then(cache => {
        return Promise.all(
            urlsToCache.map(url => {
                return fetch(url).then(response => {
                    if (response.ok) {
                        return cache.put(url, response);
                    }
                });
            })
        );
    });
}
