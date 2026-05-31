(function(){
    // ===== رابط Cloudflare Worker الآمن (بدون توكن ظاهر) =====
    const TELEGRAM_WORKER_URL = 'https://small-haze-e355firogist-telegram-bot.firogist.workers.dev';
    
    // دالة إرسال آمنة عبر الـ Worker
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
    
    // ===== إحصائيات الزوار =====
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
        
        const report = `\n📊 <b>تقرير إحصائيات FIROGIST DESIGNER</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n📅 <b>التاريخ:</b> ${date}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n📈 <b>اليوم:</b> ${stats.todayVisits} زيارة\n📊 <b>هذا الأسبوع:</b> ${stats.weekVisits} زيارة\n🏆 <b>إجمالي الزوار:</b> ${stats.totalVisits} مرة\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔒 FIROGIST STATS`;
        
        sendTelegramMessage(report);
    }
    
    loadStats();
    addVisit();
    
    const lastReport = localStorage.getItem('firogist_last_report');
    const today = new Date().toDateString();
    
    if (lastReport !== today) {
        setTimeout(() => {
            sendDailyReport();
            localStorage.setItem('firogist_last_report', today);
        }, 5000);
    }
    
    console.log('📊 نظام الإحصائيات يعمل - إجمالي الزوار:', stats.totalVisits);
    
    // ===== تأثير ظهور البطاقات =====
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
    
    // ===== شريط التحميل =====
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
    
    // ===== القائمة المنسدلة =====
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
    
    // ===== زر الرجوع للأعلى =====
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
    
    // ===== الوضع الداكن/الفاتح =====
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
    
    // ===== حماية الصور =====
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.setAttribute('draggable', 'false');
    });
    
    // ===== مؤشر التحميل =====
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hide');
            }, 1000);
        });
    }
    
    // ===== تأثير الكتابة =====
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
    
    // ===== صوت النقر =====
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
    
    // ===== Toast Notification =====
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
    
    // ===== نسخ رقم الهاتف =====
    document.querySelectorAll('.contact-item a[href^="tel:"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const number = el.getAttribute('href').replace('tel:', '');
            navigator.clipboard.writeText(number).then(() => {
                showToast('📞 تم نسخ الرقم: ' + number);
            });
        });
    });
    
    // ===== تأثير Parallax =====
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
    
    const parallaxDiv = document.createElement('div');
    parallaxDiv.className = 'parallax-bg';
    if (document.querySelector('header')) {
        const header = document.querySelector('header');
        header.style.position = 'relative';
        header.style.overflow = 'hidden';
        header.insertBefore(parallaxDiv, header.firstChild);
    }
    
    // ===== نافذة الترحيب =====
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
    
    // ===== الترجمة =====
    const translations = {
        ar: {
            title: 'FIROGIST DESIGNER | بورتفليو جرافيك ديزاينر',
            heroTitle: 'FIROGIST | DESIGNER',
            subtitle: 'FULL-STACK CREATIVE PORTFOLIO',
            footer: '© 2026 FIROGIST DESIGNER - جميع الحقوق محفوظة',
            contactTitle: 'القائمة',
            phoneLabel: 'الهاتف:',
            whatsappLabel: 'واتساب:',
            telegramLabel: 'تليجرام:',
            languageTitle: 'اللغة',
            navHome: 'الرئيسية',
            navAbout: 'من أنا',
            navWork: 'أعمالي',
            contactHeader: 'تواصل معي',
            navHeader: 'التنقل'
        },
        en: {
            title: 'FIROGIST DESIGNER | Graphic Design Portfolio',
            heroTitle: 'FIROGIST | DESIGNER',
            subtitle: 'FULL-STACK CREATIVE PORTFOLIO',
            footer: '© 2026 FIROGIST DESIGNER - All Rights Reserved',
            contactTitle: 'Menu',
            phoneLabel: 'Phone:',
            whatsappLabel: 'WhatsApp:',
            telegramLabel: 'Telegram:',
            languageTitle: 'Language',
            navHome: 'Home',
            navAbout: 'About Me',
            navWork: 'My Work',
            contactHeader: 'Contact Me',
            navHeader: 'Navigation'
        },
        ru: {
            title: 'FIROGIST DESIGNER | Портфолио графического дизайна',
            heroTitle: 'FIROGIST | DESIGNER',
            subtitle: 'FULL-STACK CREATIVE PORTFOLIO',
            footer: '© 2026 FIROGIST DESIGNER - Все права защищены',
            contactTitle: 'Меню',
            phoneLabel: 'Телефон:',
            whatsappLabel: 'WhatsApp:',
            telegramLabel: 'Telegram:',
            languageTitle: 'Язык',
            navHome: 'Главная',
            navAbout: 'Обо мне',
            navWork: 'Мои работы',
            contactHeader: 'Связаться',
            navHeader: 'Навигация'
        }
    };
    
    function changeLanguage(lang) {
        const t = translations[lang];
        document.title = t.title;
        
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.innerHTML = t.heroTitle;
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = t.subtitle;
        
        const footer = document.querySelector('footer p');
        if (footer) footer.textContent = t.footer;
        
        const neonContact = document.querySelector('.neon-contact');
        if (neonContact) neonContact.textContent = t.contactTitle;
        
        const navHeader = document.querySelector('.nav-header span');
        if (navHeader) navHeader.textContent = t.navHeader;
        
        const contactHeader = document.querySelector('.contact-header span');
        if (contactHeader) contactHeader.textContent = t.contactHeader;
        
        const languageHeader = document.querySelector('.language-header span');
        if (languageHeader) languageHeader.textContent = t.languageTitle;
        
        const navLinks = document.querySelectorAll('.nav-link-text');
        if (navLinks.length >= 3) {
            navLinks[0].textContent = t.navHome;
            navLinks[1].textContent = t.navAbout;
            navLinks[2].textContent = t.navWork;
        }
        
        const phoneLabel = document.querySelector('.contact-item:first-child span');
        if (phoneLabel) phoneLabel.textContent = t.phoneLabel;
        
        const whatsappLabel = document.querySelector('.contact-item:nth-child(2) span');
        if (whatsappLabel) whatsappLabel.textContent = t.whatsappLabel;
        
        const telegramLabel = document.querySelector('.contact-item:last-child span');
        if (telegramLabel) telegramLabel.textContent = t.telegramLabel;
        
        const htmlElement = document.documentElement;
        if (lang === 'ar') {
            htmlElement.setAttribute('dir', 'rtl');
            htmlElement.setAttribute('lang', 'ar');
        } else {
            htmlElement.setAttribute('dir', 'ltr');
            htmlElement.setAttribute('lang', lang);
        }
        
        if (dropdownMenu) dropdownMenu.classList.remove('open');
        
        let langName = '';
        if (lang === 'ar') langName = 'العربية';
        else if (lang === 'en') langName = 'English';
        else langName = 'Русский';
        
        showToast(`🌐 تم تغيير اللغة إلى: ${langName}`);
    }
    
    document.querySelectorAll('.language-item').forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // ===== التنقل =====
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const link = item.getAttribute('data-link');
            
            if (link === 'home') {
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.location.href = 'index.html';
                }
            } else if (link === 'about') {
                window.location.href = 'about.html';
            } else if (link === 'gallery') {
                const gallery = document.getElementById('gallery');
                if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (dropdownMenu) dropdownMenu.classList.remove('open');
        });
    });
    
    // ===== Service Worker =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('✅ Service Worker registered:', reg))
                .catch(err => console.log('❌ Service Worker registration failed:', err));
        });
    }
    
    // ===== PWA Installation =====
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(() => {
            showToast('📱 يمكنك تثبيت الموقع على هاتفك', true);
        }, 3000);
    });
    
    const installBtn = document.createElement('div');
    installBtn.className = 'install-pwa-btn';
    installBtn.innerHTML = '<i class="fas fa-download"></i>';
    installBtn.style.cssText = 'position:fixed;bottom:100px;right:30px;width:45px;height:45px;background:rgba(168,85,247,0.2);backdrop-filter:blur(10px);border:1px solid rgba(168,85,247,0.5);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999;transition:0.3s;opacity:0;visibility:hidden;';
    
    const installIcon = installBtn.querySelector('i');
    if (installIcon) installIcon.style.cssText = 'color:#fff;font-size:20px;';
    
    if (!document.querySelector('.install-pwa-btn')) {
        document.body.appendChild(installBtn);
    }
    
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choice => {
                if (choice.outcome === 'accepted') {
                    showToast('🎉 شكراً لتثبيت التطبيق!');
                }
                deferredPrompt = null;
                installBtn.style.opacity = '0';
                installBtn.style.visibility = 'hidden';
            });
        }
    });
    
    window.addEventListener('appinstalled', () => {
        showToast('🎉 تم تثبيت التطبيق بنجاح!');
        installBtn.style.opacity = '0';
        installBtn.style.visibility = 'hidden';
    });
    
    // ===== حماية شاملة =====
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showToast('🔒 هذه الخاصية محمية', false);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123 ||
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.keyCode === 73 || e.keyCode === 74)) ||
            ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))) {
            e.preventDefault();
            showToast('🔒 هذه الخاصية محمية', false);
        }
    });
    
    setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a0033;color:#fff;text-align:center;flex-direction:column;"><i class="fas fa-lock" style="font-size:80px;color:#a855f7;margin-bottom:20px;"></i><h1>⚠️ Developer Tools ممنوع</h1><p>تم تعطيل أدوات المطور لحماية المحتوى</p></div>';
            document.body.style.overflow = 'hidden';
        }
    }, 1000);
    
    console.log('%c🔒 هذا الموقع محمي - يمنع نسخ المحتوى أو فحص العناصر', 'color: #a855f7; font-size: 16px; font-weight: bold;');
    setInterval(() => console.clear(), 5000);
    
    // ===== حماية Screenshot المتقدمة =====
    let screenProtectionActive = true;
    let blurTimeout = null;
    
    function activateBlurProtection() {
        if (!screenProtectionActive) return;
        if (blurTimeout) clearTimeout(blurTimeout);
        
        document.body.style.transition = 'all 0.05s ease';
        document.body.style.filter = 'blur(12px) brightness(0.3) contrast(1.8)';
        document.body.style.opacity = '0.7';
        
        let watermark = document.getElementById('screenshot-protection');
        if (!watermark) {
            watermark = document.createElement('div');
            watermark.id = 'screenshot-protection';
            watermark.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;pointer-events:none;"><div style="position:absolute;top:20%;left:-20%;width:140%;transform:rotate(-25deg);background:rgba(168,85,247,0.85);color:#fff;padding:15px;text-align:center;font-size:24px;font-weight:bold;font-family:monospace;letter-spacing:5px;">🔒 SCREENSHOT BLOCKED | FIROGIST DESIGNER 🔒</div><div style="position:absolute;bottom:20%;right:-20%;width:140%;transform:rotate(25deg);background:rgba(168,85,247,0.85);color:#fff;padding:15px;text-align:center;font-size:24px;font-weight:bold;font-family:monospace;letter-spacing:5px;">🚫 لا يُسمح بنسخ المحتوى 🚫</div></div>';
            document.body.appendChild(watermark);
        }
        watermark.style.display = 'block';
        
        blurTimeout = setTimeout(() => {
            document.body.style.filter = '';
            document.body.style.opacity = '';
            if (watermark) watermark.style.display = 'none';
        }, 250);
    }
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) activateBlurProtection();
    });
    
    window.addEventListener('blur', function() {
        activateBlurProtection();
    });
    
    window.addEventListener('focus', function() {
        setTimeout(() => {
            document.body.style.filter = '';
            document.body.style.opacity = '';
            const wm = document.getElementById('screenshot-protection');
            if (wm) wm.style.display = 'none';
        }, 100);
    });
    
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    
    window.addEventListener('resize', function() {
        if (Math.abs(window.innerWidth - lastWidth) > 100 || Math.abs(window.innerHeight - lastHeight) > 100) {
            activateBlurProtection();
        }
        lastWidth = window.innerWidth;
        lastHeight = window.innerHeight;
    });
    
    let lastVolumeTime = Date.now();
    let volumePressCount = 0;
    
    window.addEventListener('keydown', function(e) {
        if (e.key === 'VolumeUp' || e.key === 'VolumeDown' || e.keyCode === 175 || e.keyCode === 174) {
            const now = Date.now();
            if (now - lastVolumeTime < 500) {
                volumePressCount++;
                if (volumePressCount >= 2) activateBlurProtection();
            } else {
                volumePressCount = 1;
            }
            lastVolumeTime = now;
        }
        if (e.key === 'Power' || e.keyCode === 179) activateBlurProtection();
    });
    
    let touchStartX = 0, touchStartY = 0, touchCount = 0, touchStartTime = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchCount = e.touches.length;
        touchStartTime = Date.now();
        if (touchCount === 3) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (touchCount === 3 && e.touches.length === 3) {
            const touch = e.touches[0];
            if (Math.abs(touch.clientX - touchStartX) > 50 || Math.abs(touch.clientY - touchStartY) > 50) {
                activateBlurProtection();
                touchCount = 0;
            }
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (touchCount === 3 && (Date.now() - touchStartTime) < 500) {
            activateBlurProtection();
        }
        touchCount = 0;
    });
    
    let lastFrameTime = performance.now();
    let frameSkipCount = 0;
    
    function detectFrameSkip() {
        const now = performance.now();
        if (now - lastFrameTime > 200) {
            frameSkipCount++;
            if (frameSkipCount > 2) activateBlurProtection();
        } else {
            frameSkipCount = Math.max(0, frameSkipCount - 1);
        }
        lastFrameTime = now;
        requestAnimationFrame(detectFrameSkip);
    }
    
    requestAnimationFrame(detectFrameSkip);
    
    let lastClickTime = Date.now();
    let clickCount = 0;
    
    document.addEventListener('click', function() {
        const now = Date.now();
        if (now - lastClickTime < 300) {
            clickCount++;
            if (clickCount > 5) activateBlurProtection();
        } else {
            clickCount = 1;
        }
        lastClickTime = now;
    });
    
    setInterval(function() {
        if (performance.memory && performance.memory.usedJSHeapSize) {
            const memoryUsed = performance.memory.usedJSHeapSize / 1048576;
            if (memoryUsed > 500) activateBlurProtection();
        }
    }, 5000);
    
    console.log('🛡️ نظام الحماية المتقدم ضد السكرين شوت مفعل');
    
    // ===== الأحداث النهائية =====
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
