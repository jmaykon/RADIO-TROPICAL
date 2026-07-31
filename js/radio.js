/**
 * radio.js - Control del reproductor de audio
 * Adaptado para el footer con iconos de Font Awesome
 */

let audio = null;
let isPlaying = false;
let radioInitialized = false;

const STREAM_URL = "https://viavision.share.zrok.io/radio";

function getElements() {
    return {
        audio: document.getElementById('radioPlayer'),
        playBtn: document.getElementById('fabRadio'),
        fabIcon: document.getElementById('fabIcon'),
        statusText: document.getElementById('statusText'),
        liveIndicator: document.getElementById('liveIndicator'),
        actionLabel: document.getElementById('actionLabel'),
        btnIconContainer: document.getElementById('btnIconContainer')
    };
}

function updateUI(state, els) {
    const { playBtn, fabIcon, statusText, liveIndicator, actionLabel, btnIconContainer } = els;
    if (!playBtn) return;

    // Resetear clases
    playBtn.className = 'flex items-center justify-center text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-all transform hover:scale-110 active:scale-95 border border-white/20';
    if (statusText) {
        statusText.className = 'text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300';
        statusText.style.color = '';
    }
    if (liveIndicator) {
        liveIndicator.className = 'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300';
    }

    switch(state) {
        case 'connected':
            isPlaying = true;
            playBtn.classList.add('connected', 'shadow-[0_0_20px_rgba(6,182,212,0.4)]');
            if (fabIcon) {
                fabIcon.className = 'fas fa-pause text-sm sm:text-base md:text-xl';
            }
            if (statusText) {
                statusText.textContent = 'En Vivo Ahora';
                statusText.className = 'text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 estado-texto connected';
            }
            if (liveIndicator) {
                liveIndicator.className = 'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 estado-indicador connected';
            }
            if (actionLabel) actionLabel.textContent = 'Reproduciendo';
            break;

        case 'connecting':
            isPlaying = false;
            playBtn.classList.add('connecting');
            if (fabIcon) {
                fabIcon.className = 'fas fa-spinner fa-spin text-sm sm:text-base md:text-xl';
            }
            if (statusText) {
                statusText.textContent = 'Conectando...';
                statusText.className = 'text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 estado-texto connecting';
            }
            if (liveIndicator) {
                liveIndicator.className = 'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 estado-indicador connecting';
            }
            if (actionLabel) actionLabel.textContent = 'Cargando...';
            break;

        case 'error':
            isPlaying = false;
            playBtn.classList.add('error');
            if (fabIcon) {
                fabIcon.className = 'fas fa-play text-sm sm:text-base md:text-xl';
            }
            if (statusText) {
                statusText.textContent = 'No disponible';
                statusText.className = 'text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 estado-texto error';
            }
            if (liveIndicator) {
                liveIndicator.className = 'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 estado-indicador error';
            }
            if (actionLabel) actionLabel.textContent = 'Error de conexión';
            break;

        default: // 'off'
            isPlaying = false;
            if (fabIcon) {
                fabIcon.className = 'fas fa-play text-sm sm:text-base md:text-xl ml-0.5 sm:ml-1';
            }
            if (statusText) {
                statusText.textContent = 'Señal Digital';
                statusText.className = 'text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest transition-all duration-300';
            }
            if (liveIndicator) {
                liveIndicator.className = 'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-500 transition-all duration-300';
            }
            if (actionLabel) actionLabel.textContent = 'Escuchar ahora';
            break;
    }
}

function togglePlay(els) {
    const { audio: audioEl } = els;
    if (!audioEl) return;

    if (isPlaying) {
        audioEl.pause();
        audioEl.src = '';
        updateUI('off', els);
        return;
    }

    updateUI('connecting', els);
    audioEl.src = STREAM_URL + '?t=' + new Date().getTime();

    audioEl.play()
        .then(() => updateUI('connected', els))
        .catch((err) => {
            console.error('Error de streaming:', err);
            updateUI('error', els);
            setTimeout(() => {
                if (!isPlaying) updateUI('off', els);
            }, 5000);
        });
}

export function initRadio() {
    if (radioInitialized) return;
    radioInitialized = true;

    setTimeout(() => {
        const els = getElements();
        const { audio: audioEl, playBtn } = els;
        audio = audioEl;

        if (!playBtn || !audio) {
            console.warn('Radio no encontrada');
            return;
        }

        // Event listener del botón play
        playBtn.addEventListener('click', () => togglePlay(els));

        // Eventos del audio
        audio.addEventListener('ended', () => {
            if (isPlaying) updateUI('off', els);
        });

        audio.addEventListener('error', () => {
            if (isPlaying) {
                updateUI('error', els);
                setTimeout(() => {
                    if (!isPlaying) updateUI('off', els);
                }, 5000);
            }
        });

        // Reconexión automática
        let attempts = 0;
        audio.addEventListener('stalled', () => {
            if (isPlaying && attempts < 3) {
                attempts++;
                console.log(`Reconexión intento ${attempts}`);
                setTimeout(() => {
                    if (isPlaying) {
                        audio.load();
                        audio.play().catch(() => {});
                    }
                }, 2000);
            }
        });

        audio.addEventListener('canplay', () => {
            attempts = 0;
        });

        // Estado inicial
        updateUI('off', els);
        console.log('📻 Radio inicializada');
    }, 300);
}