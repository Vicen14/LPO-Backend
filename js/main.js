// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos
    configurarEventos();
    
    // Efecto de navbar al hacer scroll
    window.addEventListener('scroll', manejarScrollNavbar);
    
    // Configurar link activo de la navbar
    configurarNavbarActiva();
    
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Configurar link activo
function configurarNavbarActiva() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentSearch = window.location.search;

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Match exact href (e.g. products.html?categoria=pelo)
        if (href === currentPath + currentSearch) {
            link.classList.add('active');
        } 
        // Match base path if no search params exist
        else if (href === currentPath && !currentSearch && !href.includes('?')) {
            link.classList.add('active');
        }
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo === 'error' ? 'danger' : tipo === 'success' ? 'success' : 'info'} notification-toast position-fixed top-0 end-0 m-3 d-flex align-items-center`;
    notificacion.style.zIndex = '1050';
    
    // Icono según tipo
    let icono = 'info-circle';
    if (tipo === 'success') icono = 'check-circle';
    if (tipo === 'error') icono = 'exclamation-circle';
    
    notificacion.innerHTML = `
        <i class="fas fa-${icono} me-2"></i>
        <div>${mensaje}</div>
        <button type="button" class="btn-close ms-2" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.remove();
        }
    }, 3000);
}

// Configurar eventos
function configurarEventos() {
    // Registro para programa de lealtad
    const registerBtn = document.querySelector('.loyalty-form button');
    if (registerBtn) {
        registerBtn.addEventListener('click', registerForLoyalty);
    }
    
    // Formulario de email para registro
    const emailInput = document.getElementById('register-email');
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                registerForLoyalty();
            }
        });
    }
}

// Registro para programa de lealtad
function registerForLoyalty() {
    const emailInput = document.getElementById('register-email');
    const email = emailInput.value.trim();
    
    if (!email || !validarEmail(email)) {
        mostrarNotificacion('Por favor, introduce un email válido', 'error');
        emailInput.focus();
        return;
    }
    
    // Simular envío a servidor
    mostrarNotificacion('Te has registrado exitosamente', 'success');
    
    // Mostrar modal de confirmación
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
    
    // Limpiar campo
    emailInput.value = '';
    
    // Guardar en localStorage
    const registros = JSON.parse(localStorage.getItem('loyaltyRegistrations')) || [];
    registros.push({
        email: email,
        fecha: new Date().toISOString(),
        puntos: 100 // Puntos de bienvenida
    });
    localStorage.setItem('loyaltyRegistrations', JSON.stringify(registros));
}

// Validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Manejar scroll para navbar
function manejarScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}