// =====================================================
// إرسال بيانات الزائر إلى الموقع الصغير
// =====================================================

function getVisitorData() {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const ua = navigator.userAgent;
            let device = 'كمبيوتر';
            if (/Mobile|Android|iPhone|iPad/i.test(ua)) device = 'موبايل';
            
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
                country: data.country_name,
                city: data.city,
                region: data.region,
                device: device,
                os: os,
                browser: browser,
                url: window.location.href
            };
            
            // إرسال البيانات إلى API
            fetch('/api/api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitorInfo)
            });
        })
        .catch(err => console.log('خطأ:', err));
}

// تشغيل عند تحميل الصفحة
getVisitorData();