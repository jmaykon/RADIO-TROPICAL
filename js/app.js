document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) { 
        lucide.createIcons(); 
    }

    const audio = document.getElementById('radioPlayer');
    const playBtn = document.getElementById('playBtn');
    const btnIconContainer = document.getElementById('btnIconContainer');
    const statusText = document.getElementById('statusText');
    const liveIndicator = document.getElementById('liveIndicator');
    const actionLabel = document.getElementById('actionLabel');
    
    // Validación de seguridad por si algún elemento no carga en la vista
    if (!audio || !playBtn) {
        console.warn("Reproductor de radio no detectado en esta página.");
        return;
    }

    let isPlaying = false;
    const streamUrl = "https://jazlynn-commenceable-nonaristocratically.ngrok-free.dev/radiotropical";

    // Función para cambiar iconos de Lucide dinámicamente
    const setIcon = (name, extraClass = "") => {
        if (!btnIconContainer) return;
        btnIconContainer.innerHTML = `<i data-lucide="${name}" class="${extraClass} fill-current w-6 h-6 md:w-8 md:h-8"></i>`;
        if (window.lucide) { 
            lucide.createIcons(); 
        }
    };

    playBtn.addEventListener('click', function() {
        if (!isPlaying) {
            // 1. ESTADO: CONECTANDO
            if (statusText) {
                statusText.innerText = "Conectando...";
                statusText.style.color = "#fbbf24"; // Amarillo
            }
            if (actionLabel) {
                actionLabel.innerText = "Cargando...";
            }
            setIcon("loader", "animate-spin");

            audio.src = streamUrl + "?t=" + new Date().getTime();
            
            audio.play().then(() => {
                // 2. ESTADO: REPRODUCIENDO
                isPlaying = true;
                if (statusText) {
                    statusText.innerText = "En Vivo Ahora";
                    statusText.style.color = "#22d3ee"; // Cian
                }
                if (liveIndicator) {
                    liveIndicator.className = "h-2 w-2 rounded-full bg-cyan-400 animate-pulse";
                }
                if (actionLabel) {
                    actionLabel.innerText = "Reproduciendo";
                }
                setIcon("pause");
            }).catch(err => {
                // 3. ESTADO: ERROR (Fuera de línea / Sin señal)
                console.error("Error de streaming:", err);
                isPlaying = false;
                if (statusText) {
                    statusText.innerText = "Fuera de línea";
                    statusText.style.color = "#ef4444"; // Rojo
                }
                if (liveIndicator) {
                    liveIndicator.className = "h-2 w-2 rounded-full bg-red-500";
                }
                if (actionLabel) {
                    actionLabel.innerText = "Fuera de línea";
                }
                setIcon("play", "ml-1");
                audio.src = ""; 
            });

        } else {
            // 4. ESTADO: DETENER / PAUSAR
            audio.pause();
            audio.src = ""; 
            isPlaying = false;
            
            if (statusText) {
                statusText.innerText = "Señal Digital";
                statusText.style.color = "#9ca3af"; // Gris
            }
            if (liveIndicator) {
                liveIndicator.className = "h-2 w-2 rounded-full bg-gray-500";
            }
            if (actionLabel) {
                actionLabel.innerText = "Escuchar ahora";
            }
            setIcon("play", "ml-1");
        }
    });
});