// =====================================================
// إرسال بيانات الزائر إلى GitHub API (بدون PHP)
// =====================================================

const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN'; // هتعمله بعدين
const REPO = 'FIROGIST/FIROGIST-DESIGNER';

function getVisitorData() {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const ua = navigator.userAgent;
            let device = 'كمبيوتر 💻';
            if (/Mobile|Android|iPhone|iPad/i.test(ua)) device = 'موبايل 📱';
            
            let os = 'غير معروف';
            if (/Windows/i.test(ua)) os = 'Windows';
            else if (/Mac/i.test(ua)) os = 'MacOS';
            else if (/Linux/i.test(ua)) os = 'Linux';
            else if (/Android/i.test(ua)) os = 'Android';
            else if (/iPhone|iPad/i.test(ua)) os = 'iOS';
            
            let browser = 'غير معروف';
            if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
            else if (/Firefox/i.test(ua)) browser = 'Firefox';
            else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
            else if (/Edg/i.test(ua)) browser = 'Edge';
            
            const visitorInfo = {
                ip: data.ip,
                country: data.country_name || 'غير معروف',
                city: data.city || 'غير معروف',
                region: data.region || 'غير معروف',
                device: device,
                os: os,
                browser: browser,
                url: window.location.href,
                time: new Date().toLocaleString('ar-EG'),
                timestamp: Date.now()
            };
            
            // حفظ في localStorage مؤقتاً
            let visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
            visitors.unshift(visitorInfo);
            if (visitors.length > 100) visitors = visitors.slice(0, 100);
            localStorage.setItem('visitors', JSON.stringify(visitors));
            
            console.log('📊 تم تسجيل بيانات الزائر محلياً');
        })
        .catch(err => console.log('خطأ:', err));
}

getVisitorData();
