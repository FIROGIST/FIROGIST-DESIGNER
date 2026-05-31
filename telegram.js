// =====================================================
// 🤖 بوت تليجرام - نسخة آمنة باستخدام Cloudflare Worker
// التوكن مخفي بالكامل في الـ Worker
// =====================================================

const WORKER_URL = 'https://firogist-telegram-bot.firogist.workers.dev';

// إرسال تقرير إلى التليجرام عبر الـ Worker الوسيط
function sendReportToTelegram(report) {
  fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: report })
  })
  .then(response => response.json())
  .then(data => {
    if (data && data.success) {
      console.log('✅ تم إرسال التقرير بنجاح');
    } else {
      console.log('❌ فشل إرسال التقرير');
    }
  })
  .catch(error => console.log('❌ خطأ في الإرسال:', error));
}

// =====================================================
// نظام رصد الزائر (نفس الكود السابق)
// =====================================================

let visitorData = {
  sessionId: null,
  startTime: null,
  ip: 'جاري الحصول على IP...',
  country: 'جاري التحديد...',
  city: 'جاري التحديد...',
  region: 'جاري التحديد...',
  deviceType: 'غير معروف',
  os: 'غير معروف',
  browser: 'غير معروف',
  screenResolution: screen.width + 'x' + screen.height,
  language: navigator.language || navigator.userLanguage,
  referrer: document.referrer || 'مباشر',
  entryUrl: window.location.href,
  pagesVisited: [],
  clicks: [],
  reportSent: false
};

function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
    deviceType: visitorData.deviceType,
    os: visitorData.os,
    browser: visitorData.browser
  }));
}

loadSavedData();

function getVisitorIPAndLocation() {
  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      if (data && data.ip) {
        visitorData.ip = data.ip;
        visitorData.country = data.country_name || 'غير معروف';
        visitorData.city = data.city || 'غير معروف';
        visitorData.region = data.region || 'غير معروف';
        saveData();
      }
    })
    .catch(() => console.log('خطأ في جلب الموقع'));
}

function analyzeDevice() {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    visitorData.deviceType = /iPad|iPhone|iPod/.test(ua) ? 'iPhone/iPad 🍎' : 'Android 📱';
  } else {
    visitorData.deviceType = 'كمبيوتر 💻';
  }
  if (/Windows/.test(ua)) visitorData.os = 'Windows';
  else if (/Mac/.test(ua)) visitorData.os = 'MacOS';
  else if (/Linux/.test(ua)) visitorData.os = 'Linux';
  else if (/Android/.test(ua)) visitorData.os = 'Android';
  else if (/iPhone|iPad/.test(ua)) visitorData.os = 'iOS';
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) visitorData.browser = 'Google Chrome';
  else if (/Firefox/.test(ua)) visitorData.browser = 'Mozilla Firefox';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) visitorData.browser = 'Safari';
  else if (/Edg/.test(ua)) visitorData.browser = 'Microsoft Edge';
  saveData();
}

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
    el.addEventListener('click', () => {
      visitorData.clicks.push({
        text: el.innerText?.substring(0, 100) || 'بدون نص',
        time: new Date().toLocaleString('ar-EG'),
        page: window.location.href
      });
      saveData();
    });
  });
}

function updateVisitCount() {
  const key = 'visitCount_' + visitorData.ip;
  let count = localStorage.getItem(key);
  visitorData.visitCount = count ? parseInt(count) + 1 : 1;
  localStorage.setItem(key, visitorData.visitCount);
  saveData();
}

function sendFinalReport() {
  if (visitorData.reportSent) return;
  visitorData.reportSent = true;

  const endTime = Date.now();
  const duration = Math.round((endTime - (visitorData.startTime || endTime)) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const durationText = minutes > 0 ? minutes + ' دقيقة و ' + seconds + ' ثانية' : seconds + ' ثانية';

  let locationText = visitorData.city;
  if (visitorData.region && visitorData.region !== visitorData.city) locationText += '، ' + visitorData.region;
  locationText += '، ' + visitorData.country;

  let report = '📊 <b>تقرير زائر الموقع</b>\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += '🆔 <b>معرف الجلسة:</b> <code>' + visitorData.sessionId + '</code>\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += '🌐 <b>IP الجهاز:</b> <code>' + visitorData.ip + '</code>\n';
  report += '📍 <b>الموقع:</b> ' + locationText + '\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += '📱 <b>الجهاز:</b> ' + visitorData.deviceType + '\n';
  report += '💿 <b>نظام التشغيل:</b> ' + visitorData.os + '\n';
  report += '🌍 <b>المتصفح:</b> ' + visitorData.browser + '\n';
  report += '📏 <b>الشاشة:</b> ' + visitorData.screenResolution + '\n';
  report += '🔤 <b>اللغة:</b> ' + visitorData.language + '\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += '🚪 <b>رابط الدخول:</b>\n<code>' + visitorData.entryUrl + '</code>\n';
  report += '🔗 <b>المصدر:</b> ' + visitorData.referrer + '\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += '⏱️ <b>الدخول:</b> ' + new Date(visitorData.startTime).toLocaleString('ar-EG') + '\n';
  report += '⏱️ <b>الخروج:</b> ' + new Date(endTime).toLocaleString('ar-EG') + '\n';
  report += '⏱️ <b>المدة:</b> ' + durationText + '\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += '📈 <b>عدد الزيارات:</b> ' + (visitorData.visitCount || 1) + ' مرة\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  if (visitorData.pagesVisited.length > 0) {
    report += '📄 <b>الصفحات (' + visitorData.pagesVisited.length + '):</b>\n';
    visitorData.pagesVisited.forEach(function(page, i) {
      report += (i + 1) + '. <code>' + page.url + '</code>\n';
    });
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  }

  if (visitorData.clicks.length > 0) {
    report += '🖱️ <b>النقرات (' + visitorData.clicks.length + '):</b>\n';
    visitorData.clicks.slice(0, 10).forEach(function(click, i) {
      report += (i + 1) + '. "' + click.text.substring(0, 50) + '"\n';
    });
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  }

  report += '🔒 <b>FIROGIST SECURITY</b>';

  sendReportToTelegram(report);
}

getVisitorIPAndLocation();
analyzeDevice();
trackPage();
trackClicks();
updateVisitCount();

let lastUrl = location.href;
new MutationObserver(function() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    trackPage();
    trackClicks();
  }
}).observe(document, { subtree: true, childList: true });

window.addEventListener('beforeunload', function() { sendFinalReport(); });
window.addEventListener('pagehide', function() { sendFinalReport(); });

console.log('🤖 نظام الرصد يعمل - الجلسة: ' + visitorData.sessionId);