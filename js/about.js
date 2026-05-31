// ===== التحكم في القائمة المنسدلة =====
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const closeMenu = document.getElementById('closeMenu');
const backHomeBtn = document.getElementById('backHomeBtn');

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
    if (dropdownMenu && menuBtn) {
        if (!dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            dropdownMenu.classList.remove('open');
        }
    }
});

if (dropdownMenu) {
    dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// ===== تأثير ظهور العناصر عند التمرير =====
const skillItems = document.querySelectorAll('.skill-item-large');
const infoCards = document.querySelectorAll('.info-card');

function checkVisibility() {
    skillItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            item.classList.add('visible');
        }
    });
    
    infoCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        }
    });
}

const style = document.createElement('style');
style.textContent = `
    .skill-item-large {
        opacity: 0;
        transform: translateX(-30px);
        transition: 0.5s ease;
    }
    .skill-item-large.visible {
        opacity: 1;
        transform: translateX(0);
    }
    .info-card {
        opacity: 0;
        transform: translateY(30px);
        transition: 0.5s ease;
    }
    .info-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// ===== شريط التحميل العلوي =====
const progressBar = document.getElementById('topProgressBar');

function completeProgressBar() {
    if (progressBar) {
        progressBar.style.width = '100%';
        setTimeout(() => {
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }, 300);
    }
}

window.addEventListener('load', () => {
    completeProgressBar();
});

window.addEventListener('pageshow', () => {
    if (progressBar) {
        progressBar.style.width = '0%';
    }
});

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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.className = 'fas fa-sun';
    }
}

// ===== حماية الصور =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    img.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
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

// ===== صوت خفيف عند الضغط =====
const clickSound = document.getElementById('clickSound');
if (clickSound) {
    clickSound.volume = 0.3;
}

function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('الصوت مش شغال:', e));
    }
}

const clickableElements = document.querySelectorAll('.nav-item, .menu-btn, .theme-btn, .scroll-top-btn, .language-item, .close-menu, .btn, .back-home-btn');
clickableElements.forEach(el => {
    el.addEventListener('click', playClickSound);
});

// ===== إشعارات منبثقة (Toast Notifications) =====
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

function showToast(message, isSuccess = true) {
    if (toastNotification && toastMessage) {
        toastMessage.textContent = message;
        toastNotification.classList.add('show');
        
        if (isSuccess) {
            toastNotification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            toastNotification.style.background = 'linear-gradient(135deg, #a855f7, #7c3aed)';
        }
        
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 2500);
        
        setTimeout(() => {
            toastNotification.style.background = 'linear-gradient(135deg, #a855f7, #7c3aed)';
        }, 2600);
    }
}

// نسخ رقم الهاتف
const phoneNumbers = document.querySelectorAll('.contact-item a[href^="tel:"]');
phoneNumbers.forEach(phone => {
    phone.addEventListener('click', (e) => {
        e.preventDefault();
        const number = phone.getAttribute('href').replace('tel:', '');
        navigator.clipboard.writeText(number).then(() => {
            showToast('📞 تم نسخ الرقم: ' + number);
        });
    });
});

// ===== Parallax Effect =====
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

const headerParallax = document.createElement('div');
headerParallax.className = 'parallax-bg';
if (document.querySelector('.about-page')) {
    const aboutPage = document.querySelector('.about-page');
    aboutPage.style.position = 'relative';
    aboutPage.style.overflow = 'hidden';
    aboutPage.insertBefore(headerParallax, aboutPage.firstChild);
}

// ===== الترجمة =====
const translations = {
    ar: {
        title: 'من أنا | Faris Suleiman',
        footer: '© 2026 Faris Suleiman - جميع الحقوق محفوظة',
        contactTitle: 'القائمة',
        phoneLabel: 'الهاتف:',
        whatsappLabel: 'واتساب:',
        telegramLabel: 'تليجرام:',
        languageTitle: 'اللغة',
        navHome: 'الرئيسية',
        navAbout: 'من أنا',
        contactHeader: 'تواصل معي',
        navHeader: 'التنقل',
        aboutName: 'Faris Suleiman',
        aboutTitle: 'مصمم جرافيك | Graphic Designer',
        aboutDesc: 'مصمم جرافيك متخصص في التصميم الإبداعي والهوية البصرية والـ Silk Screen لطباعة الأقمشة. أحول الأفكار إلى تصاميم بصرية مؤثرة تعبر عن الهوية والرسالة.',
        skillsTitle: 'المهارات',
        expCard: 'سنوات الخبرة',
        projectsCard: 'المشاريع',
        clientsCard: 'عملاء سعداء',
        btnBack: 'العودة للمعرض',
        btnCv: 'تحميل CV'
    },
    en: {
        title: 'About Me | Faris Suleiman',
        footer: '© 2026 Faris Suleiman - All Rights Reserved',
        contactTitle: 'Menu',
        phoneLabel: 'Phone:',
        whatsappLabel: 'WhatsApp:',
        telegramLabel: 'Telegram:',
        languageTitle: 'Language',
        navHome: 'Home',
        navAbout: 'About Me',
        contactHeader: 'Contact Me',
        navHeader: 'Navigation',
        aboutName: 'Faris Suleiman',
        aboutTitle: 'Graphic Designer',
        aboutDesc: 'Graphic designer specialized in creative design, visual identity, and Silk Screen for fabric printing. I turn ideas into impactful visual designs that express identity and message.',
        skillsTitle: 'Skills',
        expCard: 'Experience',
        projectsCard: 'Projects',
        clientsCard: 'Happy Clients',
        btnBack: 'Back to Gallery',
        btnCv: 'Download CV'
    },
    ru: {
        title: 'Обо мне | Faris Suleiman',
        footer: '© 2026 Faris Suleiman - Все права защищены',
        contactTitle: 'Меню',
        phoneLabel: 'Телефон:',
        whatsappLabel: 'WhatsApp:',
        telegramLabel: 'Telegram:',
        languageTitle: 'Язык',
        navHome: 'Главная',
        navAbout: 'Обо мне',
        contactHeader: 'Связаться',
        navHeader: 'Навигация',
        aboutName: 'Faris Suleiman',
        aboutTitle: 'Графический дизайнер',
        aboutDesc: 'Графический дизайнер, специализирующийся на креативном дизайне, визуальной идентичности и трафаретной печати на ткани. Превращаю идеи в эффектные визуальные дизайны.',
        skillsTitle: 'Навыки',
        expCard: 'Опыт',
        projectsCard: 'Проекты',
        clientsCard: 'Клиенты',
        btnBack: 'Назад',
        btnCv: 'Скачать CV'
    }
};

function changeLanguage(lang) {
    const t = translations[lang];
    
    document.title = t.title;
    
    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = t.footer;
    
    const contactTitle = document.querySelector('.neon-contact');
    if (contactTitle) contactTitle.textContent = t.contactTitle;
    
    const navHeader = document.querySelector('.nav-header span');
    if (navHeader) navHeader.textContent = t.navHeader;
    
    const contactHeader = document.querySelector('.contact-header span');
    if (contactHeader) contactHeader.textContent = t.contactHeader;
    
    const languageHeader = document.querySelector('.language-header span');
    if (languageHeader) languageHeader.textContent = t.languageTitle;
    
    const navLinksText = document.querySelectorAll('.nav-link-text');
    if (navLinksText.length >= 2) {
        navLinksText[0].textContent = t.navHome;
        navLinksText[1].textContent = t.navAbout;
    }
    
    const phoneLabel = document.querySelector('.contact-item:first-child span');
    if (phoneLabel) phoneLabel.textContent = t.phoneLabel;
    
    const whatsappLabel = document.querySelector('.contact-item:nth-child(2) span');
    if (whatsappLabel) whatsappLabel.textContent = t.whatsappLabel;
    
    const telegramLabel = document.querySelector('.contact-item:last-child span');
    if (telegramLabel) telegramLabel.textContent = t.telegramLabel;
    
    const aboutName = document.querySelector('.about-name-large');
    if (aboutName) aboutName.textContent = t.aboutName;
    
    const aboutTitle = document.querySelector('.about-title-text');
    if (aboutTitle) aboutTitle.textContent = t.aboutTitle;
    
    const aboutDesc = document.querySelector('.about-description');
    if (aboutDesc) aboutDesc.innerHTML = t.aboutDesc;
    
    const skillsTitle = document.querySelector('.skills-container h3');
    if (skillsTitle) skillsTitle.textContent = t.skillsTitle;
    
    const infoCardsEl = document.querySelectorAll('.info-card h4');
    if (infoCardsEl.length >= 3) {
        infoCardsEl[0].textContent = t.expCard;
        infoCardsEl[1].textContent = t.projectsCard;
        infoCardsEl[2].textContent = t.clientsCard;
    }
    
    const backBtn = document.querySelector('.btn-primary span');
    if (backBtn) backBtn.textContent = t.btnBack;
    
    const cvBtn = document.querySelector('.btn-secondary span');
    if (cvBtn) cvBtn.textContent = t.btnCv;
    
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

const languageItems = document.querySelectorAll('.language-item');
languageItems.forEach(item => {
    item.addEventListener('click', () => {
        const lang = item.getAttribute('data-lang');
        changeLanguage(lang);
    });
});

// ===== معالجة الروابط في القائمة =====
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const link = item.getAttribute('data-link');
        
        if (link === 'home') {
            window.location.href = 'index.html';
        }
        else if (link === 'about') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (dropdownMenu) dropdownMenu.classList.remove('open');
    });
});

// زر العودة للمعرض في الصفحة
const backToHomeBtn = document.getElementById('backToHomeBtn');
if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.html';
    });
}

// ===== PWA =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('✅ Service Worker registered:', reg);
        }).catch(err => {
            console.log('❌ Service Worker registration failed:', err);
        });
    });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        showToast('📱 يمكنك تثبيت الموقع على هاتفك', true);
    }, 3000);
});

// =====================================================
// 🔒 حماية الموقع
// =====================================================

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showToast('🔒 هذه الخاصية محمية', false);
    return false;
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123 ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.keyCode === 73 || e.keyCode === 74)) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))) {
        e.preventDefault();
        showToast('🔒 هذه الخاصية محمية', false);
        return false;
    }
});

setInterval(function() {
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

// ===== تحميل أولي =====
window.addEventListener('DOMContentLoaded', () => {
    checkVisibility();
    console.log('📄 صفحة من أنا - Faris Suleiman');
});

window.addEventListener('scroll', () => {
    checkVisibility();
});

window.addEventListener('resize', () => {
    checkVisibility();
});
