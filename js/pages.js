/**
 * pages.js - Scripts específicos por página
 */

export function initPageScripts() {
    document.addEventListener('pageChanged', (e) => {
        const page = e.detail.page;
        console.log(`📄 Página: ${page}`);
        switch(page) {
            case 'programacion': initProgramacion(); break;
            case 'tienda': initTienda(); break;
            case 'contactos': initContactos(); break;
            default: break;
        }
    });

    const current = window.location.hash.replace('#', '') || 'inicio';
    setTimeout(() => {
        switch(current) {
            case 'programacion': initProgramacion(); break;
            case 'tienda': initTienda(); break;
            case 'contactos': initContactos(); break;
            default: break;
        }
    }, 500);
}

// ========== PROGRAMACIÓN MODERNA ==========
function initProgramacion() {
    // Tabs desktop
    const tabs = document.querySelectorAll('.dia-tab');
    const tabsMobile = document.querySelectorAll('.dia-tab-mobile');
    const contenidos = document.querySelectorAll('.dia-contenido');

    function switchDay(day) {
        // Actualizar tabs desktop
        tabs.forEach(tab => {
            tab.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-200');
            tab.classList.add('text-slate-600');
            if (tab.textContent.trim().toLowerCase().includes(day)) {
                tab.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-200');
                tab.classList.remove('text-slate-600');
            }
        });

        // Actualizar tabs móvil
        tabsMobile.forEach(tab => {
            tab.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-200');
            tab.classList.add('bg-slate-100', 'text-slate-600');
            if (tab.textContent.trim().toLowerCase() === day.substring(0, 3)) {
                tab.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-200');
                tab.classList.remove('bg-slate-100', 'text-slate-600');
            }
        });

        // Mostrar contenido del día
        contenidos.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
            if (content.dataset.dia === day) {
                content.classList.remove('hidden');
                content.classList.add('active');
            }
        });
    }

    // Eventos de tabs desktop
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const day = this.textContent.trim().toLowerCase();
            switchDay(day);
        });
    });

    // Eventos de tabs móvil
    tabsMobile.forEach(tab => {
        tab.addEventListener('click', function() {
            const dayMap = {
                'lun': 'lunes',
                'mar': 'martes',
                'mié': 'miercoles',
                'jue': 'jueves',
                'vie': 'viernes',
                'sáb': 'sabado',
                'dom': 'domingo'
            };
            const day = dayMap[this.textContent.trim().toLowerCase()] || this.textContent.trim().toLowerCase();
            switchDay(day);
        });
    });

    // Inicializar con Lunes
    switchDay('lunes');

    console.log('📅 Programación moderna inicializada');
}

// ========== TIENDA ==========
function initTienda() {
    // Filtros de productos
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filtro-btn').forEach(b => {
                b.className = 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 border border-slate-200';
            });
            this.className = 'px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white border border-indigo-600 transition-all duration-300';
        });
    });

    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const name = this.closest('.product-card')?.querySelector('h4')?.textContent || 'Producto';
            alert(`🛒 Agregado al carrito: ${name}`);
        });
    });
}

// ========== CONTACTOS ==========
function initContactos() {
    document.querySelector('.btn-whatsapp')?.addEventListener('click', () => {
        window.open('https://wa.me/59171264858', '_blank');
    });

    document.querySelector('.btn-email')?.addEventListener('click', () => {
        window.location.href = 'mailto:hola@radiowave.fm';
    });

    document.querySelector('.formulario-contacto form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ Mensaje enviado correctamente.');
        this.reset();
    });

    const mapa = document.getElementById('mapaContainer');
    if (mapa) {
        mapa.addEventListener('click', function() {
            this.classList.toggle('expandido');
        });
    }
}