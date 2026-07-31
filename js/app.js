/**
 * app.js - Punto de entrada principal
 */

import { initRouter } from './router.js';
import { initRadio } from './radio.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📻 RadioWave - Iniciando...');

    // Inicializar router (carga navbar, footer y configura navegación)
    await initRouter();
    console.log('✅ Router iniciado');

    // Inicializar radio
    initRadio();
    console.log('✅ Radio iniciada');

    // Inicializar navbar (menú móvil, scroll)
    initNavbar();
    console.log('✅ Navbar iniciado');

    // Inicializar footer
    initFooter();
    console.log('✅ Footer iniciado');

    console.log('🚀 RadioWave listo!');
});

// Exponer loadPage globalmente
window.loadPage = async function(page) {
    const { loadPage } = await import('./router.js');
    return loadPage(page);
};