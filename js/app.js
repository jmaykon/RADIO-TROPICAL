
(function () {
    "use strict";

    if (window._footerInitialized) return;
    window._footerInitialized = true;

    setTimeout(function () {
        const fabRadio = document.getElementById('fabRadio');
        const fabIcon = document.getElementById('fabIcon');
        const loadingRing = document.getElementById('loadingRing');
        const liveIndicatorFloat = document.getElementById('liveIndicatorFloat');
        const statusTextFloat = document.getElementById('statusTextFloat');
        const actionLabel = document.getElementById('actionLabel');

        if (!fabRadio) {
            console.warn('Reproductor flotante no encontrado');
            return;
        }

        let isPlaying = false;
        let currentTrackIndex = 0;
        let audioPlayer = null;

        const streams = [
            { title: 'Ritmo Caribeño', artist: 'Salsa · Merengue', url: 'https://stream-152.zeno.fm/2xr1kh0qp0hvv' },
            { title: 'Salsa Brava', artist: 'Grupo Niche', url: 'https://stream-153.zeno.fm/7r1kgh0qp0hvv' },
            { title: 'El Merengue', artist: 'Juan Luis Guerra', url: 'https://stream-154.zeno.fm/8s2lih1rq0hvv' },
            { title: 'Bachata Rosa', artist: 'Romeo Santos', url: 'https://stream-156.zeno.fm/0u4nkj3ts0hvv' }
        ];

        function getAudioPlayer() {
            if (!audioPlayer) {
                audioPlayer = document.getElementById('radioPlayer');
                if (!audioPlayer) {
                    audioPlayer = document.createElement('audio');
                    audioPlayer.id = 'radioPlayer';
                    audioPlayer.preload = 'none';
                    document.body.appendChild(audioPlayer);

                    // Eventos nativos de conexión del audio
                    audioPlayer.addEventListener('waiting', () => {
                        setLoadingState(true, 'Conectando...');
                    });

                    audioPlayer.addEventListener('playing', () => {
                        setLoadingState(false);
                        isPlaying = true;
                        updateUIState();
                    });

                    audioPlayer.addEventListener('error', () => {
                        handleConnectionError();
                    });
                }
            }
            return audioPlayer;
        }

        function setLoadingState(loading, message = 'Cargando...') {
            if (loading) {
                if (loadingRing) loadingRing.classList.remove('hidden');
                if (fabIcon) fabIcon.className = 'fas fa-circle-notch fa-spin';
                if (statusTextFloat) statusTextFloat.textContent = message;
            } else {
                if (loadingRing) loadingRing.classList.add('hidden');
            }
        }

        function handleConnectionError() {
            isPlaying = false;
            setLoadingState(false);
            // Icono suave de señal débil en lugar de alerta fuerte
            if (fabIcon) fabIcon.className = 'fas fa-signal text-cyan-300/60';
            if (statusTextFloat) {
                statusTextFloat.textContent = 'Reconectando...';
                statusTextFloat.classList.add('text-cyan-300/80');
            }
            if (actionLabel) actionLabel.textContent = 'Buscando señal';

            // Restaura suavemente el estado original
            setTimeout(() => {
                if (!isPlaying) {
                    if (fabIcon) fabIcon.className = 'fas fa-play';
                    if (statusTextFloat) {
                        statusTextFloat.textContent = 'Señal Digital';
                        statusTextFloat.classList.remove('text-cyan-300/80');
                    }
                    if (actionLabel) actionLabel.textContent = 'Escuchar ahora';
                }
            }, 3500);
        }

        function updateUIState() {
            if (liveIndicatorFloat) {
                if (isPlaying) liveIndicatorFloat.classList.add('on');
                else liveIndicatorFloat.classList.remove('on');
            }
            if (statusTextFloat) {
                if (isPlaying) {
                    statusTextFloat.classList.add('on');
                    statusTextFloat.textContent = 'En Vivo';
                    statusTextFloat.classList.remove('text-amber-400');
                    if (actionLabel) actionLabel.textContent = 'Reproduciendo';
                } else {
                    statusTextFloat.classList.remove('on');
                    statusTextFloat.textContent = 'Señal Digital';
                    if (actionLabel) actionLabel.textContent = 'Escuchar ahora';
                }
            }
            if (fabIcon) {
                if (!loadingRing || loadingRing.classList.contains('hidden')) {
                    fabIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
                }
            }
        }

        function changeTrack(direction) {
            if (direction === 'next') {
                currentTrackIndex = (currentTrackIndex + 1) % streams.length;
            } else if (direction === 'prev') {
                currentTrackIndex = (currentTrackIndex - 1 + streams.length) % streams.length;
            }

            const track = streams[currentTrackIndex];
            const player = getAudioPlayer();
            player.src = track.url;
            player.load();

            if (isPlaying) {
                setLoadingState(true, 'Cambiando...');
                player.play().catch(() => handleConnectionError());
            }

            document.dispatchEvent(new CustomEvent('trackChanged', { detail: { track, index: currentTrackIndex } }));
        }

        function togglePlay() {
            const player = getAudioPlayer();

            if (!isPlaying) {
                if (!player.src) {
                    const track = streams[currentTrackIndex];
                    player.src = track.url;
                    player.load();
                }

                setLoadingState(true, 'Conectando...');

                player.play()
                    .then(() => {
                        isPlaying = true;
                        updateUIState();
                        if (window._trackInterval) clearInterval(window._trackInterval);
                        window._trackInterval = setInterval(() => changeTrack('next'), 15000);
                    })
                    .catch(() => {
                        handleConnectionError();
                    });
            } else {
                player.pause();
                isPlaying = false;
                setLoadingState(false);
                updateUIState();
                if (window._trackInterval) {
                    clearInterval(window._trackInterval);
                    window._trackInterval = null;
                }
            }

            document.dispatchEvent(new CustomEvent('playStateChanged', { detail: { isPlaying } }));
        }

        fabRadio.addEventListener('click', togglePlay);
        updateUIState();

        window.radioControls = {
            toggle: togglePlay,
            play: togglePlay,
            pause: function () { if (isPlaying) togglePlay(); },
            next: function () { changeTrack('next'); },
            prev: function () { changeTrack('prev'); },
            getState: function () { return { isPlaying, currentTrack: streams[currentTrackIndex] }; }
        };

        console.log('📻 Reproductor flotante con animaciones y manejo de errores inicializado');
    }, 100);
})();

    document.addEventListener('DOMContentLoaded', function() {
        "use strict";

    // Interceptar clics en los enlaces de navegación (tanto desktop como móvil)
    document.addEventListener('click', function(e) {
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
                } else if (!window.htmx) {
        console.warn('HTMX no está cargado en la página.');
                }

    // Cerrar el menú móvil automáticamente al hacer clic en una opción
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
                }
            }
        });

    // Control del botón Hamburguesa para abrir/cerrar el menú móvil
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
