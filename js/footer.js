/**
 * footer.js - Control del footer flotante
 */

export function initFooter() {
    setTimeout(() => {
        const fabBtn = document.getElementById('fabRadio');
        if (!fabBtn) { console.warn('Footer no encontrado'); return; }
        console.log('✅ Footer iniciado');
    }, 300);
}