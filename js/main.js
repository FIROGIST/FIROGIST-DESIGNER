// ===== تأثير ظهور أعمال المعرض عند التمرير =====
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

// ===== شريط التحميل العلوي =====
const progressBar = document.getElementById('topProgressBar');

function showProgressBar() {
    if (progressBar) {
        progressBar.style.width = '30%';
        setTimeout(() => {
            if (progressBar) progressBar.style.width = '70%';
        }, 100);
        setTimeout(() => {
            if (progressBar) progressBar.style.width = '90%';
        }, 300);
    }
}

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

// ===== التحكم في القائمة المنسدلة =====
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

// ===== تأثير كتابة آلي (Typing Effect) =====
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
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 500);
        return;
    }
    
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

if (typedWordSpan) {
    setTimeout(typeEffect, 500);
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

const clickableElements = document.querySelectorAll('.nav-item, .menu-btn, .theme-btn, .scroll-top-btn, .work-card, .language-item, .close-menu, .btn, .back-home-btn');
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
if (document.querySelector('header')) {
    document.querySelector('header').style.position = 'relative';
    document.querySelector('header').style.overflow = 'hidden';
    document.querySelector('header').insertBefore(headerParallax, document.querySelector('header').firstChild);
}

// ===== Welcome Popup =====
const welcomePopup = document.getElementById('welcomePopup');
const closePopupBtn = document.getElementById('closePopup');
const popupExplore = document.getElementById('popupExplore');

function showPopup() {
    if (welcomePopup && !localStorage.getItem('popupShown')) {
        setTimeout(() => {
            welcomePopup.classList.add('show');
            localStorage.setItem('popupShown', 'true');
        }, 1500);
    }
}

if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
        welcomePopup.classList.remove('show');
    });
}

if (popupExplore) {
    popupExplore.addEventListener('click', (e) => {
        e.preventDefault();
        welcomePopup.classList.remove('show');
        const gallery = document.getElementById('gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

welcomePopup?.addEventListener('click', (e) => {
    if (e.target === welcomePopup || e.target.classList.contains('popup-overlay')) {
        welcomePopup.classList.remove('show');
    }
});

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
        navHeader: 'التنقل',
        workTitles: [
            'SKATE CULTURE VIBES',
            'MOTIVATIONAL SKELETON',
            'WAKEBOARD ISLAND',
            'READY TO PLAY',
            'SOCCER STRATEGY ARTS',
            'TROPICAL TYPOGRAPHY',
            'URBAN STREET ART',
            'DIGITAL DREAMS',
            'NEON VIBES'
        ]
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
        navHeader: 'Navigation',
        workTitles: [
            'SKATE CULTURE VIBES',
            'MOTIVATIONAL SKELETON',
            'WAKEBOARD ISLAND',
            'READY TO PLAY',
            'SOCCER STRATEGY ARTS',
            'TROPICAL TYPOGRAPHY',
            'URBAN STREET ART',
            'DIGITAL DREAMS',
            'NEON VIBES'
        ]
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
        navHeader: 'Навигация',
        workTitles: [
            'СКЕЙТ КУЛЬТУРА',
            'МОТИВАЦИОННЫЙ СКЕЛЕТ',
            'ОСТРОВ ВЕЙКБОРД',
            'ГОТОВ ИГРАТЬ',
            'ФУТБОЛЬНОЕ ИСКУССТВО',
            'ТРОПИЧЕСКАЯ ТИПОГРАФИКА',
            'УРБАН СТРИТ АРТ',
            'ЦИФРОВЫЕ МЕЧТЫ',
            'НЕОНОВЫЕ ВИБРАЦИИ'
        ]
    }
};

function changeLanguage(lang) {
    const t = translations[lang];
    
    document.title = t.title;
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = t.heroTitle;
    }
    
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) subtitle.textContent = t.subtitle;
    
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
    if (navLinksText.length >= 3) {
        navLinksText[0].textContent = t.navHome;
        navLinksText[1].textContent = t.navAbout;
        navLinksText[2].textContent = t.navWork;
    }
    
    const phoneLabel = document.querySelector('.contact-item:first-child span');
    if (phoneLabel) phoneLabel.textContent = t.phoneLabel;
    
    const whatsappLabel = document.querySelector('.contact-item:nth-child(2) span');
    if (whatsappLabel) whatsappLabel.textContent = t.whatsappLabel;
    
    const telegramLabel = document.querySelector('.contact-item:last-child span');
    if (telegramLabel) telegramLabel.textContent = t.telegramLabel;
    
    const workTitles = document.querySelectorAll('.work-card-title h3');
    workTitles.forEach((title, index) => {
        if (t.workTitles[index]) {
            title.textContent = t.workTitles[index];
        }
    });
    
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
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname === '/' || 
                window.location.pathname.endsWith('/')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.href = 'index.html';
            }
        }
        else if (link === 'about') {
            window.location.href = 'about.html';
        }
        else if (link === 'gallery') {
            const gallery = document.getElementById('gallery');
            if (gallery) {
                gallery.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        if (dropdownMenu) dropdownMenu.classList.remove('open');
    });
});

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

const installBtn = document.createElement('div');
installBtn.className = 'install-pwa-btn';
installBtn.innerHTML = '<i class="fas fa-download"></i>';
installBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 45px;
    height: 45px;
    background: rgba(168,85,247,0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(168,85,247,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999;
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
`;
const installIcon = installBtn.querySelector('i');
if (installIcon) installIcon.style.cssText = 'color: #fff; font-size: 20px;';

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
    console.log('🚀 مرحباً بك في FIROGIST DESIGNER');
});

window.addEventListener('scroll', () => {
    checkVisibility();
});

window.addEventListener('resize', () => {
    checkVisibility();
});