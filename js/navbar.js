/**
 * navbar.js - Control del navbar
 */

let navbar, menuToggle, mobileMenu, mobileClose;

function getElements() {
    navbar = document.getElementById('mainNavbar');
    menuToggle = document.getElementById('menuToggle');
    mobileMenu = document.getElementById('mobileMenu');
    mobileClose = document.getElementById('mobileMenuClose');
}

function closeMobileMenu() {
    if (menuToggle) menuToggle.classList.remove('active');
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
        mobileMenu.style.right = '-100%';
    }
    document.body.style.overflow = '';
}

function openMobileMenu() {
    if (menuToggle) menuToggle.classList.add('active');
    if (mobileMenu) {
        mobileMenu.classList.add('open');
        mobileMenu.style.right = '0';
    }
    document.body.style.overflow = 'hidden';
}

export function initNavbar() {
    // Ejecutar inmediatamente si los elementos ya existen
    getElements();
    
    if (!navbar) {
        // Si no existen, esperar un poco
        setTimeout(() => {
            getElements();
            if (!navbar) { 
                console.warn('Navbar no encontrado'); 
                return; 
            }
            setupNavbar();
        }, 200);
    } else {
        setupNavbar();
    }
}

function setupNavbar() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset || document.documentElement.scrollTop;
        navbar.classList.toggle('scrolled', scroll > 50);
    });

    // Menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }

    // Cerrar al hacer clic en enlaces
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (mobileMenu?.classList.contains('open')) {
            const inside = mobileMenu.contains(e.target) || menuToggle?.contains(e.target);
            if (!inside) {
                closeMobileMenu();
            }
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    console.log('✅ Navbar iniciado');
}

// Exponer funciones para uso global
window.closeMobileMenu = closeMobileMenu;
window.openMobileMenu = openMobileMenu;