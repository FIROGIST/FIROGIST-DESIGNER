// =====================================================
// 🚀 إشعار فوري عند دخول الزائر - نسخة مبسطة
// =====================================================

const NTFY_TOPIC = 'https://ntfy.sh/firogist-alerts';

// إرسال إشعار فوري
function sendInstantNotification(message) {
  fetch(NTFY_TOPIC, {
    method: 'POST',
    headers: {
      'Title': '🚪 زائر جديد دخل الموقع',
      'Priority': 'high',
      'Tags': 'globe_with_meridians,man'
    },
    body: message
  })
  .then(() => console.log('✅ تم إرسال الإشعار'))
  .catch(error => console.log('❌ خطأ:', error));
}

// =====================================================
// جلب معلومات الزائر
// =====================================================

let visitorInfo = {
  ip: 'جاري الحصول على IP...',
  country: 'جاري التحديد...',
  city: 'جاري التحديد...',
  region: 'جاري التحديد...',
  deviceType: 'غير معروف',
  os: 'غير معروف',
  browser: 'غير معروف'
};

// تحليل الجهاز
function analyzeDevice() {
  const ua = navigator.userAgent;
  
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    visitorInfo.deviceType = /iPad|iPhone|iPod/.test(ua) ? 'iPhone/iPad 🍎' : 'Android 📱';
  } else {
    visitorInfo.deviceType = 'كمبيوتر 💻';
  }
  
  if (/Windows/.test(ua)) visitorInfo.os = 'Windows';
  else if (/Mac/.test(ua)) visitorInfo.os = 'MacOS';
  else if (/Linux/.test(ua)) visitorInfo.os = 'Linux';
  else if (/Android/.test(ua)) visitorInfo.os = 'Android';
  else if (/iPhone|iPad/.test(ua)) visitorInfo.os = 'iOS';
  
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) visitorInfo.browser = 'Google Chrome';
  else if (/Firefox/.test(ua)) visitorInfo.browser = 'Mozilla Firefox';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) visitorInfo.browser = 'Safari';
  else if (/Edg/.test(ua)) visitorInfo.browser = 'Microsoft Edge';
  else visitorInfo.browser = 'غير معروف';
}

// جلب IP والموقع
function getVisitorIPAndLocation() {
  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      if (data && data.ip) {
        visitorInfo.ip = data.ip;
        visitorInfo.country = data.country_name || 'غير معروف';
        visitorInfo.city = data.city || 'غير معروف';
        visitorInfo.region = data.region || 'غير معروف';
        
        // بعد الحصول على كل المعلومات، أرسل الإشعار
        sendNotification();
      }
    })
    .catch(() => {
      visitorInfo.ip = 'غير متاح';
      visitorInfo.country = 'غير متاح';
      visitorInfo.city = 'غير متاح';
      visitorInfo.region = 'غير متاح';
      sendNotification();
    });
}

// إرسال الإشعار النهائي
function sendNotification() {
  let locationText = `${visitorInfo.city}`;
  if (visitorInfo.region && visitorInfo.region !== visitorInfo.city) {
    locationText += `، ${visitorInfo.region}`;
  }
  locationText += `، ${visitorInfo.country}`;
  
  let message = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🌐 IP: ${visitorInfo.ip}\n`;
  message += `📍 الموقع: ${locationText}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📱 الجهاز: ${visitorInfo.deviceType}\n`;
  message += `💿 نظام التشغيل: ${visitorInfo.os}\n`;
  message += `🌍 المتصفح: ${visitorInfo.browser}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔒 FIROGIST SECURITY`;
  
  sendInstantNotification(message);
}

// تشغيل الرصد فوراً
analyzeDevice();
getVisitorIPAndLocation();

console.log('🚀 نظام الرصد يعمل - سيتم إرسال إشعار فوري عند تحميل الصفحة');
