(function () {
    "use strict";

    if (window._footerInitialized) return;
    window._footerInitialized = true;

    document.addEventListener('DOMContentLoaded', function () {
        const fabRadio = document.getElementById('fabRadio');
        const fabIcon = document.getElementById('fabIcon');
        const loadingRing = document.getElementById('loadingRing');
        const liveIndicatorFloat = document.getElementById('liveIndicatorFloat');
        const statusTextFloat = document.getElementById('statusTextFloat');
        const actionLabel = document.getElementById('actionLabel');
        const audio = document.getElementById('radioAudio');

        if (!fabRadio || !audio) {
            console.warn('Elementos del reproductor no encontrados en el DOM.');
            return;
        }

        let isPlaying = false;

        // Eventos del elemento de audio
        audio.addEventListener('waiting', () => {
            if (loadingRing) loadingRing.classList.remove('hidden');
            if (fabIcon) fabIcon.className = 'fas fa-circle-notch fa-spin';
            if (statusTextFloat) statusTextFloat.textContent = 'Conectando...';
        });

        audio.addEventListener('playing', () => {
            isPlaying = true;
            updateUI();
        });

        audio.addEventListener('pause', () => {
            isPlaying = false;
            updateUI();
        });

        audio.addEventListener('error', () => {
            isPlaying = false;
            if (loadingRing) loadingRing.classList.add('hidden');
            if (fabIcon) fabIcon.className = 'fas fa-exclamation-triangle text-red-400';
            if (statusTextFloat) statusTextFloat.textContent = 'Fuera de línea';
            if (actionLabel) actionLabel.textContent = 'Sin señal';
            if (liveIndicatorFloat) liveIndicatorFloat.classList.remove('on', 'active');
        });

        function updateUI() {
            if (loadingRing) loadingRing.classList.add('hidden');
            
            if (isPlaying) {
                if (fabIcon) fabIcon.className = 'fas fa-pause';
                if (statusTextFloat) {
                    statusTextFloat.textContent = 'En línea';
                    statusTextFloat.classList.add('on');
                }
                if (actionLabel) actionLabel.textContent = 'Pausar';
                if (liveIndicatorFloat) liveIndicatorFloat.classList.add('on', 'active');
            } else {
                if (fabIcon) fabIcon.className = 'fas fa-play';
                if (statusTextFloat) {
                    statusTextFloat.textContent = 'Señal Digital';
                    statusTextFloat.classList.remove('on');
                }
                if (actionLabel) actionLabel.textContent = 'Escuchar ahora';
                if (liveIndicatorFloat) liveIndicatorFloat.classList.remove('on', 'active');
            }
        }

        // Control del Clic en el Botón Play
        fabRadio.addEventListener('click', function () {
            if (audio.paused) {
                if (loadingRing) loadingRing.classList.remove('hidden');
                if (fabIcon) fabIcon.className = 'fas fa-circle-notch fa-spin';
                if (statusTextFloat) statusTextFloat.textContent = 'Conectando...';

                // Forzamos la recarga del stream para evitar caché
                audio.src = "https://jazlynn-commenceable-nonaristocratically.ngrok-free.dev/radiotropical?t=" + new Date().getTime();
                
                audio.play().catch(error => {
                    console.error("Error al reproducir:", error);
                    if (loadingRing) loadingRing.classList.add('hidden');
                    if (fabIcon) fabIcon.className = 'fas fa-play';
                    if (statusTextFloat) statusTextFloat.textContent = 'Fuera de línea';
                    if (actionLabel) actionLabel.textContent = 'Sin señal';
                });
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    });

    // --- Control de navegación por HTMX y Menú Móvil ---
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.dataset.page;
                const content = document.getElementById('pageContent');

                if (content && window.htmx) {
                    htmx.ajax('GET', `pages/${page}.html`, {
                        target: '#pageContent',
                        swap: 'innerHTML',
                        history: true
                    });
                }

                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu) {
                    mobileMenu.classList.add('translate-x-full');
                    mobileMenu.classList.remove('translate-x-0');
                }
            }
        });

        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                mobileMenu.classList.toggle('translate-x-full');
                mobileMenu.classList.toggle('translate-x-0');
            });
        }

        if (mobileMenuClose && mobileMenu) {
            mobileMenuClose.addEventListener('click', function (e) {
                e.stopPropagation();
                mobileMenu.classList.add('translate-x-full');
                mobileMenu.classList.remove('translate-x-0');
            });
        }
    });
})();