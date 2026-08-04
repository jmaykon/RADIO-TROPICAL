// ============================================
// APP.JS - RADIO TROPICAL 87.9 FM
// ============================================

let radioInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📻 Radio Tropical 87.9 FM - Iniciando...');
    
    // Inicializar después de un pequeño retraso para asegurar que el footer está listo
    setTimeout(function() {
        const footer = document.getElementById('floatingFooter');
        if (footer && !radioInitialized) {
            console.log('✅ Inicializando reproductor...');
            radioInitialized = true;
            initRadioPlayer();
        }
    }, 500);
});

// ============================================
// FUNCIÓN PRINCIPAL DEL REPRODUCTOR
// ============================================

function initRadioPlayer() {
    // CONFIGURACIÓN - PRUEBA CON DIFERENTES OPCIONES
    // Opción 1: Sin extensión (la que tienes ahora)
    const STREAM_URL = "https://jazlynn-commenceable-nonaristocratically.ngrok-free.dev/radiotropical";
    
    // Opción 2: Con .mp3 (descomenta para probar)
    // const STREAM_URL = "https://jazlynn-commenceable-nonaristocratically.ngrok-free.dev/radiotropical.mp3";
    
    // Opción 3: Con punto de montaje (descomenta para probar)
    // const STREAM_URL = "https://jazlynn-commenceable-nonaristocratically.ngrok-free.dev/radiotropical;stream.mp3";
    
    // Opción 4: Usando el mount de Icecast (descomenta para probar)
    // const STREAM_URL = "https://jazlynn-commenceable-nonaristocratically.ngrok-free.dev/radiotropical?type=.mp3";
    
    // Obtener elementos
    const audio = document.getElementById('radioPlayer');
    const playBtn = document.getElementById('playBtn');
    const btnIcon = document.getElementById('btnIcon');
    const statusText = document.getElementById('statusTextFloat');
    const liveIndicator = document.getElementById('liveIndicatorFloat');
    const actionLabel = document.getElementById('actionLabel');
    const loadingRing = document.getElementById('loadingRing');

    // Verificar que existan todos los elementos
    if (!audio || !playBtn || !btnIcon) {
        console.error('❌ Elementos del reproductor no encontrados');
        return;
    }

    // Estado
    let isPlaying = false;
    let isConnecting = false;

    // ============================================
    // FUNCIONES DE UI
    // ============================================

    function setStatus(state, message) {
        if (liveIndicator) {
            liveIndicator.className = 'status-dot-float';
        }
        if (loadingRing) {
            loadingRing.classList.remove('active');
        }
        playBtn.disabled = false;

        switch(state) {
            case 'loading':
                isConnecting = true;
                if (statusText) {
                    statusText.textContent = 'Conectando...';
                    statusText.style.color = '#fbbf24';
                }
                if (actionLabel) actionLabel.textContent = 'Cargando...';
                if (liveIndicator) {
                    liveIndicator.classList.add('bg-yellow-500', 'animate-pulse');
                }
                if (btnIcon) {
                    btnIcon.className = 'fas fa-spinner fa-spin';
                }
                if (loadingRing) {
                    loadingRing.classList.add('active');
                }
                playBtn.disabled = true;
                break;

            case 'playing':
                isConnecting = false;
                if (statusText) {
                    statusText.textContent = 'En Vivo Ahora';
                    statusText.style.color = '#22d3ee';
                }
                if (actionLabel) actionLabel.textContent = 'Reproduciendo';
                if (liveIndicator) {
                    liveIndicator.classList.add('bg-cyan-400', 'animate-pulse');
                }
                if (btnIcon) {
                    btnIcon.className = 'fas fa-pause';
                }
                break;

            case 'error':
                isConnecting = false;
                if (statusText) {
                    statusText.textContent = message || 'Error de conexión';
                    statusText.style.color = '#ef4444';
                }
                if (actionLabel) actionLabel.textContent = 'Reintentar';
                if (liveIndicator) {
                    liveIndicator.classList.add('bg-red-500');
                }
                if (btnIcon) {
                    btnIcon.className = 'fas fa-play';
                }
                break;

            default:
                isConnecting = false;
                if (statusText) {
                    statusText.textContent = 'Señal Digital';
                    statusText.style.color = '#9ca3af';
                }
                if (actionLabel) actionLabel.textContent = 'Escuchar ahora';
                if (liveIndicator) {
                    liveIndicator.classList.add('bg-gray-500');
                }
                if (btnIcon) {
                    btnIcon.className = 'fas fa-play';
                }
                break;
        }
    }

    // ============================================
    // FUNCIONES DEL REPRODUCTOR
    // ============================================

    async function playRadio() {
        if (isConnecting) return;
        
        try {
            setStatus('loading');
            
            // Limpiar completamente el audio
            audio.pause();
            audio.src = '';
            audio.removeAttribute('src');
            audio.load();
            
            // Esperar un momento para que el navegador se resetee
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Configurar el stream con timestamp
            const url = STREAM_URL + (STREAM_URL.includes('?') ? '&' : '?') + '_=' + Date.now();
            
            console.log('🔗 Intentando conectar a:', url);
            
            // Establecer la fuente y cargar
            audio.src = url;
            audio.load();
            
            // Intentar reproducir con manejo adecuado de promesas
            try {
                await audio.play();
                // Éxito
                isPlaying = true;
                setStatus('playing');
                console.log('✅ Reproduciendo correctamente');
            } catch (playError) {
                if (playError.name === 'AbortError') {
                    console.warn('⚠️ Play interrumpido, reintentando...');
                    // Reintentar después de un momento
                    setTimeout(() => {
                        if (!isPlaying && !isConnecting) {
                            playRadio();
                        }
                    }, 500);
                } else {
                    throw playError;
                }
            }
            
        } catch (error) {
            console.error('❌ Error detallado:', error);
            isPlaying = false;
            setStatus('error', error.message || 'No se pudo conectar');
            
            // Reintentar automáticamente
            setTimeout(() => {
                if (!isPlaying && !isConnecting) {
                    console.log('🔄 Reintentando conexión...');
                    setStatus('stopped');
                }
            }, 3000);
        }
    }

    function pauseRadio() {
        audio.pause();
        audio.src = '';
        audio.removeAttribute('src');
        audio.load();
        isPlaying = false;
        isConnecting = false;
        setStatus('stopped');
        console.log('⏸️ Pausado');
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    playBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (isPlaying) {
            pauseRadio();
        } else {
            playRadio();
        }
    });

    // Manejar errores de audio con más detalle
    audio.addEventListener('error', function(e) {
        console.error('🔴 Error de audio:', e);
        console.log('🔍 Código de error:', audio.error ? audio.error.code : 'unknown');
        console.log('🔍 Mensaje de error:', audio.error ? audio.error.message : 'unknown');
        
        if (isPlaying) {
            isPlaying = false;
            setStatus('error', 'Error en la transmisión');
            
            setTimeout(() => {
                if (!isPlaying && !isConnecting) {
                    playRadio();
                }
            }, 3000);
        }
    });

    // Reconectar si termina inesperadamente
    audio.addEventListener('ended', function() {
        if (isPlaying) {
            console.log('🔄 Stream terminado, reconectando...');
            setTimeout(() => {
                if (isPlaying && !isConnecting) {
                    playRadio();
                }
            }, 2000);
        }
    });

    // Escuchar cambios en el estado del audio
    audio.addEventListener('loadstart', function() {
        console.log('📥 Cargando stream...');
    });

    audio.addEventListener('canplay', function() {
        console.log('✅ Stream listo para reproducir');
    });

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    setStatus('stopped');
    console.log('📻 Radio Tropical 87.9 FM - Player listo');
    console.log('🔗 Stream URL:', STREAM_URL);
    console.log('💡 Presiona el botón para escuchar');
}

// ============================================
// NAVEGACIÓN ENTRE PÁGINAS (Mantener tu código existente)
// ============================================

function loadPage(page) {
    const content = document.getElementById('pageContent');
    if (content) {
        content.setAttribute('hx-get', `pages/${page}.html`);
        content.setAttribute('hx-trigger', 'load');
        htmx.trigger(content, 'load');
    }
}

document.addEventListener('click', function(e) {
    const link = e.target.closest('a[data-page]');
    if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) {
            loadPage(page);
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('translate-x-0')) {
                mobileMenu.classList.remove('translate-x-0');
            }
            document.querySelectorAll('.mobile-link').forEach(el => {
                el.classList.remove('text-cyan-400');
                if (el.getAttribute('data-page') === page) {
                    el.classList.add('text-cyan-400');
                }
            });
        }
    }
});

// Menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('mobileMenuClose');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.toggle('translate-x-0');
            mobileMenu.classList.toggle('translate-x-full');
        });
    }

    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        });
    }

    document.addEventListener('click', function(e) {
        if (mobileMenu && !mobileMenu.contains(e.target) && !menuToggle?.contains(e.target)) {
            if (mobileMenu.classList.contains('translate-x-0')) {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
            }
        }
    });
});