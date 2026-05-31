(function(){
    // ===== تم إزالة التوكن من هنا للأمان =====
    // الآن نستخدم Cloudflare Worker الآمن
    const TELEGRAM_WORKER_URL = 'https://small-haze-e355firogist-telegram-bot.firogist.workers.dev';
    
    // دالة إرسال عبر الـ Worker الآمن
    async function sendTelegramMessage(message) {
        try {
            const response = await fetch(TELEGRAM_WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                console.error('فشل الإرسال:', await response.text());
            }
        } catch(error) {
            console.log('خطأ في الإرسال:', error);
        }
    }
    
    // ===== باقي الكود كما هو مع تعديل دالة التقرير =====
    let stats = {
        todayVisits: 0,
        totalVisits: 0,
        lastDate: null,
        weekVisits: 0,
        lastWeekDate: null
    };
    
    function loadStats() {
        const saved = localStorage.getItem('firogist_stats');
        if (saved) stats = JSON.parse(saved);
        
        const today = new Date().toDateString();
        if (stats.lastDate !== today) {
            stats.todayVisits = 0;
            stats.lastDate = today;
        }
        
        const weekNum = getWeekNumber(new Date());
        if (stats.lastWeekDate !== weekNum) {
            stats.weekVisits = 0;
            stats.lastWeekDate = weekNum;
        }
    }
    
    function saveStats() {
        localStorage.setItem('firogist_stats', JSON.stringify(stats));
    }
    
    function getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const yearStart = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d - yearStart) / 86400000 - 3 + (yearStart.getDay() + 6) % 7) / 7);
    }
    
    function addVisit() {
        stats.todayVisits++;
        stats.totalVisits++;
        stats.weekVisits++;
        saveStats();
    }
    
    function sendDailyReport() {
        const date = new Date().toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const report = `
📊 <b>تقرير إحصائيات FIROGIST DESIGNER</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 <b>التاريخ:</b> ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 <b>اليوم:</b> ${stats.todayVisits} زيارة
📊 <b>هذا الأسبوع:</b> ${stats.weekVisits} زيارة
🏆 <b>إجمالي الزوار:</b> ${stats.totalVisits} مرة
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 FIROGIST STATS`;
        
        sendTelegramMessage(report);
    }
    
    // تهيئة الإحصائيات
    loadStats();
    addVisit();
    
    // إرسال التقرير اليومي
    const lastReport = localStorage.getItem('firogist_last_report');
    const today = new Date().toDateString();
    
    if (lastReport !== today) {
        setTimeout(() => {
            sendDailyReport();
            localStorage.setItem('firogist_last_report', today);
        }, 5000);
    }
    
    console.log('📊 نظام الإحصائيات يعمل - إجمالي الزوار:', stats.totalVisits);
    
    // ===== باقي الكود الأصلي كما هو من هنا =====
    const cards = document.querySelectorAll('.work-card');
    
    function checkVisibility() {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 100 && rect.bottom > 0) {
                card.classList.add('visible');
            }
        });
    }
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.work-card-title h3')?.innerText || 'العمل';
            showToast(`✨ "${title}" - قريباً سأضيف تفاصيل أكثر عن هذا العمل! ✨`);
        });
    });
    
    // Progress Bar
    const progressBar = document.getElementById('topProgressBar');
    function completeProgressBar() {
        if (progressBar) {
            progressBar.style.width = '100%';
            setTimeout(() => {
                if (progressBar) progressBar.style.width = '0%';
            }, 300);
        }
    }
    
    window.addEventListener('load', () => {
        completeProgressBar();
    });
    
    window.addEventListener('pageshow', () => {
        if (progressBar) progressBar.style.width = '0%';
    });
    
    // Menu
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.add('open');
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            dropdownMenu.classList.remove('open');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (dropdownMenu && menuBtn && !dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            dropdownMenu.classList.remove('open');
        }
    });
    
    if (dropdownMenu) {
        dropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Scroll to top
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Theme Toggle
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = themeBtn?.querySelector('i');
    
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
            showToast('🌞 تم التبديل إلى الوضع الفاتح');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
            showToast('🌙 تم التبديل إلى الوضع الداكن');
        }
    }
    
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.className = 'fas fa-sun';
        }
    }
    
    // حماية الصور
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.setAttribute('draggable', 'false');
    });
    
    // Loader
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hide');
            }, 1000);
        });
    }
    
    // Typing effect
    const words = ['Graphic Designer', 'Motion Designer', 'UI/UX Designer', 'Brand Identity', 'Silk Screen Designer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedWordSpan = document.getElementById('typedWord');
    
    function typeEffect() {
        if (!typedWordSpan) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedWordSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedWordSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 50 : 100);
        }
    }
    
    if (typedWordSpan) {
        setTimeout(typeEffect, 500);
    }
    
    // Click sound
    const clickSound = document.getElementById('clickSound');
    if (clickSound) clickSound.volume = 0.3;
    
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('الصوت مش شغال:', e));
        }
    }
    
    document.querySelectorAll('.nav-item, .menu-btn, .theme-btn, .scroll-top-btn, .work-card, .language-item, .close-menu, .btn, .back-home-btn').forEach(el => {
        el.addEventListener('click', playClickSound);
    });
    
    // Toast
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    
    function showToast(message, isSuccess = true) {
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            if (isSuccess) {
                toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            } else {
                toast.style.background = 'linear-gradient(135deg, #a855f7, #7c3aed)';
            }
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
            setTimeout(() => {
                toast.style.background = 'linear-gradient(135deg, #a855f7, #7c3aed)';
            }, 2600);
        }
    }
    
    // Copy phone number
    document.querySelectorAll('.contact-item a[href^="tel:"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const number = el.getAttribute('href').replace('tel:', '');
            navigator.clipboard.writeText(number).then(() => {
                showToast('📞 تم نسخ الرقم: ' + number);
            });
        });
    });
    
    // Parallax
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = 0.3;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Welcome popup
    const welcomePopup = document.getElementById('welcomePopup');
    const closePopup = document.getElementById('closePopup');
    const popupExplore = document.getElementById('popupExplore');
    
    function showPopup() {
        if (welcomePopup && !localStorage.getItem('popupShown')) {
            setTimeout(() => {
                welcomePopup.classList.add('show');
                localStorage.setItem('popupShown', 'true');
            }, 1500);
        }
    }
    
    if (closePopup) {
        closePopup.addEventListener('click', () => {
            welcomePopup.classList.remove('show');
        });
    }
    
    if (popupExplore) {
        popupExplore.addEventListener('click', (e) => {
            e.preventDefault();
            welcomePopup.classList.remove('show');
            const gallery = document.getElementById('gallery');
            if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (welcomePopup) {
        welcomePopup.addEventListener('click', (e) => {
            if (e.target === welcomePopup || e.target.classList.contains('popup-overlay')) {
                welcomePopup.classList.remove('show');
            }
        });
    }
    
    showPopup();
    
    // ===== باقي الكود (الترجمة، PWA، الحماية) استمر كما هو =====
    // ... (أكمل باقي الكود الأصلي من هنا)
    
    console.log('%c🔒 هذا الموقع محمي - يمنع نسخ المحتوى أو فحص العناصر', 'color: #a855f7; font-size: 16px; font-weight: bold;');
    
    window.addEventListener('DOMContentLoaded', () => {
        checkVisibility();
        console.log('🚀 مرحباً بك في FIROGIST DESIGNER');
    });
    
    window.addEventListener('scroll', () => {
        checkVisibility();
    });
    
    window.addEventListener('resize', () => {
        checkVisibility();
    });
})();
