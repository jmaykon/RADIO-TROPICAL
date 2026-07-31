/**
 * router.js - Control de navegación SPA
 */

const PAGES = {
    'inicio': 'pages/inicio.html',
    'programacion': 'pages/programacion.html',
    'tienda': 'pages/tienda.html',
    'contactos': 'pages/contactos.html'
};

let currentPage = 'inicio';
const mainContent = document.getElementById('mainContent');

// ========== CARGAR COMPONENTES ==========
export async function loadComponent(id, file) {
    try {
        const response = await fetch(`components/${file}`);
        if (!response.ok) throw new Error(`Error cargando ${file}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
        return true;
    } catch (error) {
        console.error('Error cargando componente:', error);
        return false;
    }
}

// ========== ACTUALIZAR ENLACES ACTIVOS ==========
export function updateActiveLinks(page) {
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active-link');
        } else {
            link.classList.remove('active-link');
        }
    });
}

// ========== CARGAR PÁGINA ==========
export async function loadPage(page) {
    if (!page || !PAGES[page]) {
        console.warn(`Página "${page}" no existe`);
        page = 'inicio';
    }

    if (page === currentPage && page !== 'inicio') return;
    if (!mainContent) return;

    try {
        // Mostrar loading
        mainContent.innerHTML = `
            <div class="page-loader" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:20px;">
                <div class="loader-spinner" style="font-size:40px;color:#4f46e5;animation:loaderSpin 1s infinite linear;">
                    <i class="fas fa-broadcast"></i>
                </div>
                <p style="color:#64748b;">Cargando...</p>
            </div>
        `;

        const response = await fetch(PAGES[page]);
        if (!response.ok) throw new Error(`Error cargando ${page}`);
        const html = await response.text();
        
        // Actualizar contenido
        mainContent.innerHTML = html;

        // Actualizar URL sin recargar
        history.pushState({ page: page }, '', `#${page}`);
        
        // Actualizar enlaces activos
        updateActiveLinks(page);
        
        // Actualizar página actual
        currentPage = page;

        // Disparar evento de cambio de página
        const event = new CustomEvent('pageChanged', { detail: { page } });
        document.dispatchEvent(event);

        // Re-inicializar scripts de la página
        setTimeout(() => {
            initPageScripts(page);
        }, 100);

        console.log(`📄 Página cargada: ${page}`);

    } catch (error) {
        console.error('Error cargando página:', error);
        mainContent.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size:48px;color:#ef4444;margin-bottom:16px;"></i>
                <h2 style="font-size:24px;font-weight:700;margin-bottom:8px;">Error al cargar la página</h2>
                <p style="color:#64748b;margin-bottom:20px;">${error.message}</p>
                <button onclick="window.location.reload()" style="background:#4f46e5;color:white;border:none;padding:10px 30px;border-radius:8px;cursor:pointer;font-weight:600;">
                    Recargar
                </button>
            </div>
        `;
    }
}

// ========== INICIALIZAR SCRIPTS POR PÁGINA ==========
function initPageScripts(page) {
    switch(page) {
        case 'programacion':
            document.querySelectorAll('.dia-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.dia-btn').forEach(b => {
                        b.className = 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 border border-slate-200';
                    });
                    this.className = 'px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white border border-indigo-600 transition-all duration-300';
                });
            });
            break;

        case 'tienda':
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
            break;

        case 'contactos':
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

            // Mapa expandible
            const mapa = document.getElementById('mapaContainer');
            if (mapa) {
                mapa.addEventListener('click', function() {
                    this.classList.toggle('expandido');
                });
            }
            break;

        default:
            break;
    }
}

// ========== CONFIGURAR NAVEGACIÓN (DELEGACIÓN DE EVENTOS) ==========
export function setupNavigation() {
    // Usar delegación de eventos en el documento
    document.addEventListener('click', function(e) {
        // Buscar el elemento más cercano con data-page
        const link = e.target.closest('[data-page]');
        if (link) {
            e.preventDefault();
            const page = link.dataset.page;
            if (page && PAGES[page]) {
                loadPage(page);
            } else {
                console.warn(`Página "${page}" no encontrada`);
            }
        }
    });

    // También capturar clics en el mainContent (para enlaces dentro de las páginas)
    if (mainContent) {
        mainContent.addEventListener('click', function(e) {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.dataset.page;
                if (page && PAGES[page]) {
                    loadPage(page);
                }
            }
        });
    }

    console.log('✅ Navegación configurada');
}

// ========== INICIALIZAR ROUTER ==========
export async function initRouter() {
    // Cargar componentes
    await loadComponent('navbar', 'navbar.html');
    await loadComponent('footerFab', 'footer-fab.html');

    // Configurar navegación después de cargar los componentes
    setupNavigation();

    // Cargar página inicial
    const hash = window.location.hash.replace('#', '') || 'inicio';
    const initialPage = PAGES[hash] ? hash : 'inicio';
    await loadPage(initialPage);

    // Manejar navegación con el historial
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            loadPage(e.state.page);
        }
    });

    console.log('✅ Router iniciado');
}