// =====================================================
// 🤖 بوت تليجرام - نسخة آمنة (تم تغيير التوكن بعد الاختراق)
// =====================================================

// التوكن الجديد - آمن
const TELEGRAM_BOT_TOKEN = 'YOUR_TOKEN_IS_NOW_A_SECRET';
const TELEGRAM_CHAT_ID = '5511952564';

// التحقق من أن الموقع يعمل في النطاق الصحيح فقط
const allowedDomains = ['firogist.github.io', 'localhost', '127.0.0.1', 'firogist.github.io/FIROGIST-DESIGNER'];
const currentDomain = window.location.hostname + window.location.pathname.split('/')[1] ? '/' + window.location.pathname.split('/')[1] : '';
const isAllowed = allowedDomains.some(domain => window.location.href.includes(domain));

if (!isAllowed && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    console.log('🔒 وصول غير مصرح به - تم منع تشغيل البوت');
    // منع تشغيل البوت في مواقع غير مصرح بها
    const originalSend = window.fetch;
    window.fetch = function() {
        if (arguments[0] && arguments[0].includes('api.telegram.org')) {
            console.log('🔒 تم منع إرسال بيانات إلى تليجرام من نطاق غير مصرح به');
            return Promise.reject('غير مسموح');
        }
        return originalSend.apply(this, arguments);
    };
}

// =====================================================
// تخزين بيانات الزائر
// =====================================================

let visitorData = {
    sessionId: null,
    startTime: null,
    ip: 'جاري الحصول على IP...',
    country: 'جاري التحديد...',
    city: 'جاري التحديد...',
    region: 'جاري التحديد...',
    locationMap: 'جاري التحديد...',
    deviceType: 'غير معروف',
    os: 'غير معروف',
    browser: 'غير معروف',
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language || navigator.userLanguage,
    referrer: document.referrer || 'مباشر',
    entryUrl: window.location.href,
    pagesVisited: [],
    clicks: [],
    reportSent: false
};

// استرجاع البيانات المحفوظة
function loadSavedData() {
    const saved = sessionStorage.getItem('telegramVisitorData');
    if (saved) {
        const oldData = JSON.parse(saved);
        visitorData.pagesVisited = oldData.pagesVisited || [];
        visitorData.clicks = oldData.clicks || [];
        visitorData.startTime = oldData.startTime || Date.now();
        visitorData.sessionId = oldData.sessionId || generateSessionId();
        visitorData.ip = oldData.ip || 'جاري الحصول على IP...';
        visitorData.country = oldData.country || 'جاري التحديد...';
        visitorData.city = oldData.city || 'جاري التحديد...';
        visitorData.region = oldData.region || 'جاري التحديد...';
        visitorData.locationMap = oldData.locationMap || 'جاري التحديد...';
        visitorData.deviceType = oldData.deviceType || 'غير معروف';
        visitorData.os = oldData.os || 'غير معروف';
        visitorData.browser = oldData.browser || 'غير معروف';
    } else {
        visitorData.sessionId = generateSessionId();
        visitorData.startTime = Date.now();
    }
}

function saveData() {
    sessionStorage.setItem('telegramVisitorData', JSON.stringify({
        pagesVisited: visitorData.pagesVisited,
        clicks: visitorData.clicks,
        startTime: visitorData.startTime,
        sessionId: visitorData.sessionId,
        ip: visitorData.ip,
        country: visitorData.country,
        city: visitorData.city,
        region: visitorData.region,
        locationMap: visitorData.locationMap,
        deviceType: visitorData.deviceType,
        os: visitorData.os,
        browser: visitorData.browser
    }));
}

function generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

loadSavedData();

// =====================================================
// الحصول على IP والموقع الجغرافي
// =====================================================

function getVisitorIPAndLocation() {
    const savedIP = sessionStorage.getItem('visitorIP');
    const savedLocationData = sessionStorage.getItem('visitorLocationData');
    
    if (savedIP && savedLocationData) {
        const loc = JSON.parse(savedLocationData);
        visitorData.ip = savedIP;
        visitorData.country = loc.country || 'غير معروف';
        visitorData.city = loc.city || 'غير معروف';
        visitorData.region = loc.region || 'غير معروف';
        visitorData.locationMap = loc.mapUrl || '';
        console.log('✅ تم استرجاع الموقع:', visitorData.city, visitorData.country);
        return;
    }
    
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.ip) {
                visitorData.ip = data.ip;
                visitorData.country = data.country_name || 'غير معروف';
                visitorData.city = data.city || 'غير معروف';
                visitorData.region = data.region || 'غير معروف';
                
                if (data.latitude && data.longitude) {
                    visitorData.locationMap = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
                } else {
                    visitorData.locationMap = `https://www.google.com/maps?q=${encodeURIComponent(data.city + ', ' + data.country_name)}`;
                }
                
                sessionStorage.setItem('visitorIP', data.ip);
                sessionStorage.setItem('visitorLocationData', JSON.stringify({
                    country: data.country_name,
                    city: data.city,
                    region: data.region,
                    mapUrl: visitorData.locationMap
                }));
                
                console.log(`📍 الموقع: ${visitorData.city} - ${visitorData.country}`);
            } else {
                fallbackLocationAPI();
            }
            saveData();
        })
        .catch(() => {
            fallbackLocationAPI();
        });
}

function fallbackLocationAPI() {
    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.status === 'success') {
                visitorData.ip = data.query;
                visitorData.country = data.country || 'غير معروف';
                visitorData.city = data.city || 'غير معروف';
                visitorData.region = data.regionName || 'غير معروف';
                visitorData.locationMap = `https://www.google.com/maps?q=${data.lat},${data.lon}`;
                
                sessionStorage.setItem('visitorIP', data.query);
                sessionStorage.setItem('visitorLocationData', JSON.stringify({
                    country: data.country,
                    city: data.city,
                    region: data.regionName,
                    mapUrl: visitorData.locationMap
                }));
            } else {
                visitorData.country = 'غير متاح';
                visitorData.city = 'غير متاح';
                visitorData.region = 'غير متاح';
                visitorData.locationMap = '';
            }
            saveData();
        })
        .catch(() => {
            visitorData.country = 'غير متاح';
            visitorData.city = 'غير متاح';
            visitorData.region = 'غير متاح';
            visitorData.locationMap = '';
            saveData();
        });
}

// =====================================================
// تحليل الجهاز والمتصفح
// =====================================================

function analyzeDevice() {
    const ua = navigator.userAgent;
    
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
        if (/iPad|iPhone|iPod/.test(ua)) visitorData.deviceType = 'iPhone/iPad 🍎';
        else if (/Android/.test(ua)) visitorData.deviceType = 'Android 📱';
        else visitorData.deviceType = 'موبايل 📱';
    } else {
        visitorData.deviceType = 'كمبيوتر 💻';
    }
    
    if (/Windows/.test(ua)) visitorData.os = 'Windows';
    else if (/Mac/.test(ua)) visitorData.os = 'MacOS';
    else if (/Linux/.test(ua)) visitorData.os = 'Linux';
    else if (/Android/.test(ua)) visitorData.os = 'Android';
    else if (/iPhone|iPad/.test(ua)) visitorData.os = 'iOS';
    else visitorData.os = 'غير معروف';
    
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) visitorData.browser = 'Google Chrome';
    else if (/Firefox/.test(ua)) visitorData.browser = 'Mozilla Firefox';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) visitorData.browser = 'Safari';
    else if (/Edg/.test(ua)) visitorData.browser = 'Microsoft Edge';
    else if (/Opera/.test(ua)) visitorData.browser = 'Opera';
    else visitorData.browser = 'غير معروف';
    
    saveData();
}

// =====================================================
// تتبع الصفحات والروابط
// =====================================================

function trackPage() {
    const currentUrl = window.location.href;
    const lastPage = visitorData.pagesVisited[visitorData.pagesVisited.length - 1];
    if (lastPage && lastPage.url === currentUrl) return;
    
    visitorData.pagesVisited.push({
        url: currentUrl,
        title: document.title,
        time: new Date().toLocaleString('ar-EG')
    });
    saveData();
}

function trackClicks() {
    document.querySelectorAll('a, button, .nav-item, .work-card, .contact-item').forEach(el => {
        if (el.hasAttribute('data-click-tracked')) return;
        el.setAttribute('data-click-tracked', 'true');
        
        el.addEventListener('click', (e) => {
            visitorData.clicks.push({
                element: el.tagName,
                text: el.innerText?.substring(0, 100) || 'بدون نص',
                href: el.getAttribute('href') || 'بدون رابط',
                time: new Date().toLocaleString('ar-EG'),
                page: window.location.href
            });
            saveData();
        });
    });
}

// =====================================================
// حساب عدد الزيارات
// =====================================================

function updateVisitCount() {
    const key = `visitCount_${visitorData.ip}`;
    let count = localStorage.getItem(key);
    visitorData.visitCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem(key, visitorData.visitCount);
    saveData();
}

// =====================================================
// إرسال التقرير
// =====================================================

function sendFinalReport() {
    if (visitorData.reportSent) return;
    visitorData.reportSent = true;
    
    const endTime = Date.now();
    const duration = Math.round((endTime - (visitorData.startTime || endTime)) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const durationText = minutes > 0 ? `${minutes} دقيقة و ${seconds} ثانية` : `${seconds} ثانية`;
    
    let locationText = `${visitorData.city}`;
    if (visitorData.region && visitorData.region !== visitorData.city) {
        locationText += `، ${visitorData.region}`;
    }
    locationText += `، ${visitorData.country}`;
    
    let report = `📊 <b>تقرير زائر الموقع</b>\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `🆔 <b>معرف الجلسة:</b> <code>${visitorData.sessionId}</code>\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `🌐 <b>IP الجهاز:</b> <code>${visitorData.ip}</code>\n`;
    report += `📍 <b>الموقع:</b> ${locationText}\n`;
    if (visitorData.locationMap && visitorData.locationMap !== 'جاري التحديد...') {
        report += `🗺️ <b>خريطة:</b> <a href="${visitorData.locationMap}">اضغط للمشاهدة</a>\n`;
    }
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `📱 <b>الجهاز:</b> ${visitorData.deviceType}\n`;
    report += `💿 <b>نظام التشغيل:</b> ${visitorData.os}\n`;
    report += `🌍 <b>المتصفح:</b> ${visitorData.browser}\n`;
    report += `📏 <b>الشاشة:</b> ${visitorData.screenResolution}\n`;
    report += `🔤 <b>اللغة:</b> ${visitorData.language}\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `🚪 <b>رابط الدخول:</b>\n<code>${visitorData.entryUrl}</code>\n`;
    report += `🔗 <b>المصدر:</b> ${visitorData.referrer}\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `⏱️ <b>الدخول:</b> ${new Date(visitorData.startTime).toLocaleString('ar-EG')}\n`;
    report += `⏱️ <b>الخروج:</b> ${new Date(endTime).toLocaleString('ar-EG')}\n`;
    report += `⏱️ <b>المدة:</b> ${durationText}\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `📈 <b>عدد الزيارات:</b> ${visitorData.visitCount || 1} مرة\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (visitorData.pagesVisited.length > 0) {
        report += `📄 <b>الصفحات (${visitorData.pagesVisited.length}):</b>\n`;
        visitorData.pagesVisited.forEach((page, i) => {
            report += `${i+1}. <code>${page.url}</code>\n`;
        });
        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    }
    
    if (visitorData.clicks.length > 0) {
        report += `🖱️ <b>النقرات (${visitorData.clicks.length}):</b>\n`;
        visitorData.clicks.slice(0, 15).forEach((click, i) => {
            report += `${i+1}. "${click.text.substring(0, 50)}"\n`;
        });
        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    }
    
    report += `🔒 <b>FIROGIST SECURITY</b>`;
    
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: report,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    }).catch(e => console.log('خطأ:', e));
}

// =====================================================
// التشغيل
// =====================================================

getVisitorIPAndLocation();
analyzeDevice();
trackPage();
trackClicks();
updateVisitCount();

let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        trackPage();
        trackClicks();
    }
}).observe(document, { subtree: true, childList: true });

window.addEventListener('beforeunload', () => sendFinalReport());
window.addEventListener('pagehide', () => sendFinalReport());

console.log('🤖 نظام الرصد يعمل - الجلسة: ' + visitorData.sessionId);
console.log('🔒 البوت الجديد يعمل بأمان');
