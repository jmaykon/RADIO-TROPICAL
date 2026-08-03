(function() {
    "use strict";

    // ---- Navegación con HTMX ----
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-page]');
        if (link) {
            e.preventDefault();
            const page = link.dataset.page;
            const content = document.getElementById('pageContent');
            
            if (content) {
                htmx.ajax('GET', `pages/${page}.html`, {
                    target: '#pageContent',
                    swap: 'innerHTML',
                    history: true
                });
            }
            
            // Cerrar menú móvil
            closeMobileMenu();
        }
    });

    // ---- Funciones del menú móvil ----
    function openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        }
    }

    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        }
    }

    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            if (mobileMenu.classList.contains('translate-x-0')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    }

    // ---- Inicializar eventos del menú móvil ----
    document.addEventListener('DOMContentLoaded', function() {
        // Buscar el botón de toggle (puede estar en navbar)
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuClose = document.getElementById('mobileMenuClose');

        if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMobileMenu();
            });
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileMenu();
            });
        }

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            const mobileMenu = document.getElementById('mobileMenu');
            const menuToggle = document.getElementById('mobileMenuToggle');
            
            if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
                const isMenuClick = mobileMenu.contains(e.target);
                const isToggleClick = menuToggle?.contains(e.target);
                
                if (!isMenuClick && !isToggleClick) {
                    closeMobileMenu();
                }
            }
        });

        // Cerrar menú al presionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    });

    // ---- Sincronizar estado del reproductor después de cambios HTMX ----
    document.addEventListener('htmx:afterSwap', function() {
        // Verificar si el reproductor flotante se ha recargado
        setTimeout(function() {
            const fabRadio = document.getElementById('fabRadio');
            if (fabRadio) {
                const player = document.getElementById('radioPlayer');
                const fabIcon = document.getElementById('fabIcon');
                if (player && !player.paused && fabIcon) {
                    fabIcon.className = 'fas fa-pause';
                }
            }
        }, 50);
    });

    // ---- Manejo de errores HTMX ----
    document.addEventListener('htmx:responseError', function(evt) {
        console.error('Error HTMX:', evt.detail);
        const content = document.getElementById('pageContent');
        if (content) {
            content.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                    <h3 class="text-xl font-bold text-white">Error al cargar la página</h3>
                    <p class="text-gray-400 mt-2">Por favor, intenta nuevamente.</p>
                    <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500">
                        Recargar
                    </button>
                </div>
            `;
        }
    });

    // ---- Exponer funciones del menú globalmente ----
    window.menuControls = {
        open: openMobileMenu,
        close: closeMobileMenu,
        toggle: toggleMobileMenu
    };

    console.log('🎙️ Radio Tropical 87.9 FM - App inicializada');
})();